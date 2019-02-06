## IPOP Controller Framework Architecture

### Introduction
***

With  the current implementation of the IPOP controller, extending and create custom controllers is a difficult task and sometimes intimidating for the end users. To make the process of creating a custom controller easy, a new controller framework is being developed. The new controller framework allows the users to create their own controllers by simply plugging in the required modules, each performing various functions of an IPOP controller(e.g. IP address translation, topology management, routing, multicasting).

#### Example use Cases

Consider a GVPN controller for a small VPN (10s of nodes). A user may wish to configure a controller that implements proactive establishment of an all-to-all mesh topology among endpoints, routing is unnecessary as messages are simply forwarded across a Tincan link (at the tincan module), implements multicast by forwarding to all local tincan links, and supports static DNS mapping of names to IPOP addresses independently at each controller by encoding IP addresses into DNS names.

Consider instead a GVPN controller for a large VPN (100s-1000s of nodes). Proactively establishing an all-to-all topology would not scale; instead, a GVPN controller might manage a scalable topology with proactively created tincan links (e.g. a structured P2P topology, or a random graph). A routing protocol might use identifier-based routing towards a destination, or attempt to discover paths using dynamic source routing (DSR), or allow creation of on-demand links if necessary. Multicast messages would use a flooding mechanism. The controller might support an external, centralized DNS service for the virtual network.

While these two controllers would expose a GVPN to applications and share common traits (e.g. the same OSN), the design requirements for the different networks would lead to different approaches to topology management, routing, and multicasting. The small-VPN controller would focus on simplicity and fast responses, while the large-VPN controller would focus on scalability,

### Components
***

The new controller framework has 2 major components:
* **Controller Framework (CFx)**

  Controller Framework performs various tasks associated with loading, maintaining and coordinating the      execution of the controller modules. The responsibilities of the CFx are:
  * Initializing the controller (Creating sockets, making initializing TincanAPI calls etc.)
  * Dynamically load the controller modules
  * Maintain the DB of registered modules
  * Ensuring cross controller configuration and version compatibility
  * Enforce Inter CM dependencies
  * Facilitate Inter Modular communication

* **Controller Modules (CMs)**

  Each controller module is a highly cohesive component of the controller that implements and performs a well-defined core functionality of the controller. Examples of CMs:

  * AddressMapper
  * LinkManager
  * TincanListener
  * BaseTopologyManager
  * Monitor
  * Logger
  * Watchdog etc

* **CFxHandle**

  CFxHandle is basically an interface between the CFx and CMs. CMs cannot directly communicate with the CFx. They can do so via the CFxHandle. The CFx exposes some functions to the CFxHandle, and CFxHandle exposes some functions to the CMs. The CFx creates a CFxHandle for every CM.

### Inter Modular Communication
***

In many cases, a CM might need data/services from another CM. In such cases, the CMs need a way to communicate with each other. The objective of IMC, within the context of the IPOP controller system, is to facilitate in a structured and coordinated fashion, the processing of operations or requests that require action within more than a single module.

This communication is achieved with the help of an ADT (Abstract Data Type) called **Controller Brokered Task (CBT)**. A CM creates a CBT whenever it needs data/service from another module. A CBT completely defines the task that the recipient CM is to perform. Structure of the CBT is as follows:

* Unique ID
* Initiator
* Recipient
* Action
* Data

The CMs do not directly send the CBT to the recipient. Instead, the CMs send the CBT to the CFx (via its CFxHandle) and the CFx is responsible to deliver the CBT to the appropriate destination CM. After processing the CBT, the recipient CM might notify the initiator CM by sending a modified CBT to the source CM via the CFx. With this mechanism, any CM is capable of doing the following:

* Receive a request to perform a task
* Requests services from other modules, 
* Get notification of their completion

Let this strategy be illustrated with the following use case where we consider a routing module (multihop), a topology module and a link management module. The link management module provides the basic operations of establishing and trimming links as well as maintaining link status data. Link management may opt to never initiate any operation on its own, only servicing request from a topology module. Alternatively, it may also monitor it’s links and clean up links to unresponsive nodes. A topology module at startup may attempt to build its topology creating and sending CBTs to the link manager. Additionally, the topology will need to respond to changes in network conditions and modify its active set of links. Here, the CFx would deliver a CBT indicating that a node is no longer directly accessible and the module would respond by restructuring its topology.
<br/><br/>
The routing module leverages the infrastructure of the topology and link management layers but it does not necessarily need to directly invoke their facilities. Multi-hop routing is influenced by the nature of the underlying topology. If the topology allowed unlimited direct links then there would be very little routing to be done. It is when no direct link to a node exist in the overlay network that multi-hop is invoked. The CFx is notified of a packet being sent to an IP address which is not known (no link). The CFx creates a CBT for this event and delivers it to the multi-hop routing (MHR) module. MHR will perform discovery by communicating with other peer MHR modules and then attempt to either send the packet to its destination or fail it as undeliverable. This communication would be done using CBTs to the CFx to Tincan.

### Configuration
***

The new controller framework is a configuration driven model. Configuration will exist for CFx and all the CMs as well. Usually, the configuration of the framework is specified in the config.json file. The CFx parses the configuration and dynamically loads all the CMs listed in the configuration. In some cases, a CM might have some other CMs as dependencies. In such cases,the dependency CMs will be initialized before this CM is initialized. The list of dependencies of a CM is specified in its part of the configuration of the controller.

Example Config:

```
{
    "CFx": {
        "xmpp_username": "",
        "xmpp_password": "",
        "xmpp_host": "jabber.ru",
        "ip4": "192.168.5.1",
        "ip4_mask": 24,
        "stat_report": true,
        "tincan_logging": 0,
        "controller_logging": "DEBUG"
    },
    "TincanListener" : {
        "joinEnabled": true,
        "dependencies": ["Logger"]
    }
}
```
### Technical Details
***

#### CFX.py
The CFx parses config given by the user (from config.json), and then initializes the controller by creating the controller sockets and making initialization TincanAPI calls like register_svc(), set_cb_endpoint(), set_local_ip() etc. After parsing the config file, the CFx dynamically loads all the listed CMs, by creating their objects and respective CFxHandles(explained later), using importlib. The CMs can specify their dependencies and the CFx will make sure that the dependencies of a module are loaded before the module gets itself loaded. The CFx can also detect circular dependencies. The CFx also facilitates IMC and acts as an intermediate for inter modular communication. The CFx exposes a submitCBT() function to the CFxHandle, which allows the CM to issue a CBT to a CM from which it requires services/data. Lastly, the CFx also waits for shutdown signals, and ensures graceful termination of the controller modules. This is achieved by creating a signal handler using the signal library.

Methods in CFx.py :

* **submitCBT(cbt)** : This function is exposed to the CFxHandle. When a CM sends a CBT, it is received by its CFxHandle, which then calls this method to submit the CBT. The CBT is analyzed and then placed in the appropriate CM's work queue.

* **createCBT(initiator,recipient,action,data)** : This method returns a CBT object, with initiator, recipient, action and data initialized with the parameters passed. Default value of all these attributes of the CBT is a null string.

* **initialize()** : This method dynamically loads all the CMs specified in the configuration and also initializes the controller by creating the sockets and making the initialization Tincan API calls. This method makes use of load_module(), which is responsible for loading a single module.

* **detect_cyclic_dependency()**: This method checks if there are any cyclic dependencies in the config file.

* **parse_config()** : This method is responsible for updating the default configuration of the controller, by taking the configuration input from the user.

* **waitForShutdownEvent()** : This method blocks the CFx/main thread until a SIGINT signal (Ctrl+C) is received by the process.

* **terminate()** : When a KeyboardInterrupt is received, waitForShutDownEvent() method exits and terminate() method is called. This method empties the worker queue of all the CMs and injects a special 'terminate' cbt in all the CM queues, which informs the CMs to stop processing the CBTs and exit. The terminate() methods of all the CMs are also called , which helps the CM to finish up  before exiting. This method doesn't exit until all the CM threads exit.

#### CFxHandle.py<br/>
    
The CFx creates a CFxHandle object for every controller module as explained previously. CFxHandle is basically an interface between the CM and CFx. The CFxHandle maintains the CBT queue of the CM. CFxHandle creates a different thread where the processCBT() function is called in daemon mode to process the CBTs present in the queue. processCBT() function takes a CBT as a parameter which is given by the CFxHandle by pulling out an element from the CBT queue. The CFxHandle also creates a different thread to execute the timer_method() of a CM at a given frequency. The CFxHandle exposes two functions: submitCBT(), and createCBT() to the CMs to issue a CBT and create a CBT respectively. The CFx initializes the CFxHandles which inturn initialize the CMs.

#### CBT.py
    
This module contains the CBT class. createCBT() calls make an object of this class and returns it to the CM. The constructor of the CBT class takes in the fields also optionally. The unique ID of the CBT is generated using uuid.uuid4()

#### ControllerModule.py

This module contains the abstract class ControllerModule, which all the Controller Modules should inherit, forcing them to override processCBT(), initialize() and terminate().

####  Controller Modules

All the controller modules must inherit from the Abstract Base Class ControllerModule and override processCBT(), initialize(), timer_method() and terminate() functions. If the CM doesn’t need any timer functionality, it can simply “pass” the implementation of the timer_method().

Some modules are integral to the system as they provide fundamental services, as such they can be relied on to be present in a typical system configuration. The following are the CMs that are essential to build a functional controller:

##### GroupVPN

* **AddressMapper**: This CM maintains a mapping of IP address of the node to its UID. The mappings are stored in the dict uid_ip_table where the keys are UIDs and values are the IP addresses of the corresponding nodes. Supported CBT actions:

  * 'ADD_MAPPING': This CBT is generated when an UID-to-IP mapping has to be added.
    cbt.data should be a dict with keys 'uid' and 'ip'. Response CBT is not sent to the source CM in this case.

  * 'DEL_MAPPING': This CBT is generated when a UID-to-IP mapping has to be deleted. 
cbt.data should be equal to the UID of the node to be deleted. Response CBT is not sent to the source CM in this case.

  * 'RESOLVE': This CBT is generated when a CM requires the IP address of a node with a given UID. cbt.data should be equal to the UID of the node, whose IP address is requested. Response CBT with action 'RESOLVE_RESP' is sent to the source CM. cbt.data is the IP address of the node in the response CBT.

  * 'REVERSE_RESOLVE': This CBT is generated when a CM requires the UID of a node, with a given IP address. cbt.data should be equal to the node's IP address. Response CBT with action 'REVERSE_RESOLVE_RESP' is sent back to the CM. cbt.data is the UID of the node in the response CBT.

* **LinkManager**: LinkManager is responsible for creating and trimming connections.   BaseTopologyManager decides the policies for creating/trimming links and leverages the LinkManager CM to   create/trim a Tincan link with another node. Supported CBT actions:

  * 'CREATE_LINK': This CBT is generated by BaseTopologyManager to create a link with a peer. cbt.data is a dict with keys: 'uid', 'fpr', 'nid', 'sec', 'cas'. Response CBT is not sent to the source CM in this case.

  * 'TRIM_LINK': This CBT is generated by BaseTopologyManager to TRIM a link with a node with a given UID. cbt.data is equal to the UID of the node. Response CBT is not sent to the source CM in this case.

* **TincanSender**: This CM is basically a center for making Tincan API calls. Whenever a CM wishes to communicate with IPOP-Tincan, it conveys its intention to do so, by sending a message to TincanSender, which then makes a Tincan API call on behalf of the CM. If the API call has any response, it will be received by the TincanListener, then sent to TincanDispatcher which then dispatches the response to the appropriate CM. Supported CBT actions currently:

  * 'DO_CREATE_LINK': This CBT is generated when a link is to be created with a node. cbt.data is a dict with keys : 'uid', 'fpr', 'nid', 'sec', 'cas'. Response CBT is not sent to the source CM in this case.

  * 'DO_TRIM_LINK': This CBT is generated when a Tincan link has to be trimmed. cbt.data is equal to the UID of the node. Response CBT is not sent to the source CM in this case.

  * 'DO_GET_STATE': This CBT is generated to query Tincan the state of the local node. cbt.data is NULL.
The state of local node is received as a Tincan notification, which will be dispatched to the appropriate CM by TincanDispatcher

  * 'DO_SEND_MSG': This CBT is generated when a CM has to send a message to another node. cbt.data is a dict with keys: 'method', 'overlay_id', 'uid', 'data'. Response CBT is not sent to the source CM in this case.

  * 'DO_SET_REMOTE_IP': This CBT is generated when there is a need to add a UID-to-IP mapping in IPOP-Tincan. cbt.data is a dict with keys: 'uid' and 'ip4'. Response CBT is not sent to the source CM in this case.

  * 'ECHO_REPLY': This CBT is generated when IPOP-Tincan sends a notification for echo request. Response CBT is not sent to the source CM in this case.

* **TincanListener**: TincanListener listens to notification packets sent by IPOP-Tincan. TincanListener sends these packets to TincanDispatcher for further processing.

* **TincanDispatcher**: TincanDispatcher receives Tincan packets from TincanListener, decodes them and dispatches to appropriate CM.

* **BaseTopologyManager**: This CM is responsible for maintaining a desired base(eg. all-to-all, structured p2p etc) topology of the VPN. This CM describes the policies of maintaining Tincan Links and leverages the LinkManager module to create/trim links with other nodes. This CM handles the conn_stat, con_req, con_resp, send_msg notifications from IPOP-Tincan, and also handles the packets that are sent to the controller by IPOP-Tincan, when there is no link with the destination node.

* **Monitor**: This CM maintains the state of peer nodes.
  
  * 'STORE_PEER_STATE': This CBT is generated when the peer state has to be stored in the controller. cbt.data is a JSON object containing information about the peer state. Response CBT is not sent to the source CM in this case.

  * 'QUERY_PEER_STATE': This CBT is generated when a CM needs to know the state of a particular peer. cbt.data contains the UID of the peer. Response cbt with action 'QUERY_PEER_STATE_RESP' is sent to the source CM. cbt.data is the JSON object of the peer state in the response CBT.

  * 'QUERY_PEER_LIST': This CBT is generated when a CM requires the list of peers. Response cbt with action 'QUERY_PEER_LIST_RESP' is sent to the source CM. cbt.data is the list of peers in the response CBT.

  * 'QUERY_CONN_STAT': This CBT is generated when a CM requires the connection status of a particular. cbt.data contains the UID of the peer. Response cbt with action 'QUERY_CONN_STAT_RESP' is sent to the source CM. cbt.data is the connection status of the peer in the response CBT.

  * 'DELETE_CONN_STAT': This CBT is generated when the connection status of a particular peer has to be deleted. cbt.data contains the UID of the peer. Response CBT is not sent to the source CM in this case.

  * 'STORE_CONN_STAT': This CBT is generated when the connection status of a particular peer has to be stored. cbt.data is a dict with keys: 'uid' and 'status'. Response CBT is not sent to the source CM in this case.

  * 'QUERY_IDLE_PEER_LIST': This CBT is generated when a CM requires the state of all the idle peers. Response cbt with action 'QUERY_IDLE_PEER_LIST_RESP' is sent to the source CM. In the response CBT, cbt.data is a dict containing the state of all the idle peers.

  * 'STORE_IDLE_PEER_STATE': This CBT is generated in the case of on-demand-connection, when the peer node is idle. cbt.data is a dict with keys: 'uid' and 'idle_peer_state'

* **Logger**: This CM facilitates and co-ordinate module logging. A CM can send a message to the Logger CM if it needs anything to be logged. Supported CBT actions:

  * 'DEBUG': This CBT is generated when a CM needs to log with 'DEBUG' level

  * 'INFO': This CBT is generated when a CM needs to log with 'INFO' level

  * 'WARNING': This CBT is generated when a CM needs to log with 'WARNING' level

  * 'ERROR': This CBT is generated when a CM needs to log with 'ERROR' level

  * 'PKTDUMP': This CBT is generated when a CM needs to log with packet dump data.

* **Watchdog**: Watchdog maintains the state of the local node. Supported CBT actions:

  * 'STORE_IPOP_STATE': This CBT is generated by TincanDispatcher when it receives a local_state notification from IPOP-Tincan. No Response CBT is generated.

  * 'QUERY_IPOP_STATE': This CBT is generated when a CM requires the current state of the local node. Response CBT with action 'QUERY_IPOP_STATE_RESP' is sent back to the source CM, with the state of local node in cbt.data.

##### SocialVPN

* **AddressMapper**: In SocialVPN, it's possible to statically assign addresses to SocialVPN peers.
It can be done through an additional configuration file that can be loaded with the -p argument (e.g. -p ip_config.json). In this file, you specify the UID of a node, the virtual IP address, and a label, as in the following example:

    ```
    [
        {
            "uid": "54f2b14f80e5374f8af7ad1b4838145ea7eaaf57",
            "ipv4": "172.31.0.101",
            "desc": "Alice"
        },
        {
            "uid": "2561b75dd81575044d9aef9a4db83aa2a7a23a9b",
            "ipv4": "172.31.0.102",
            "desc": "Bob"
        }
    ]
    ```
    AddressMapper CM maintains a mapping of UID to IP address of the nodes, whose IP addresses are specified in the configuration file as shown above. The mappings are stored in the dict ip_map where the keys are UIDs and values are the IP addresses of the corresponding nodes. Supported CBT actions:

      * 'ADD_MAPPING': This CBT is generated when an UID-to-IP mapping has to be added.
    cbt.data should be a dict with keys 'uid' and 'ip'. Response CBT is not sent to the source CM in this case.

      * 'DEL_MAPPING': This CBT is generated when a UID-to-IP mapping has to be deleted. 
cbt.data should be equal to the UID of the node to be deleted. Response CBT is not sent to the source CM in this case.

      * 'RESOLVE': This CBT is generated when a CM requires the IP address of a node with a given UID. cbt.data should be equal to the UID of the node, whose IP address is requested. Response CBT with action 'RESOLVE_RESP' is sent to the source CM. cbt.data is the IP address of the node in the response CBT.

* **LinkManager**: LinkManager is responsible for creating and trimming connections.   BaseTopologyManager decides the policies for creating/trimming links and leverages the LinkManager CM to   create/trim a Tincan link with another node. Supported CBT actions:

  * 'CREATE_LINK': This CBT is generated by BaseTopologyManager to create a link with a peer. cbt.data is a dict with keys: 'uid', 'fpr', 'nid', 'sec', 'cas'. Response CBT is not sent to the source CM in this case.

  * 'TRIM_LINK': This CBT is generated by BaseTopologyManager to TRIM a link with a node with a given UID. cbt.data is equal to the UID of the node. Response CBT is not sent to the source CM in this case.

* **TincanSender**: This CM is basically a center for making Tincan API calls. Whenever a CM wishes to communicate with IPOP-Tincan, it conveys its intention to do so, by sending a message to TincanSender, which then makes a Tincan API call on behalf of the CM. If the API call has any response, it will be received by the TincanListener, then sent to TincanDispatcher which then dispatches the response to the appropriate CM. Supported CBT actions currently:

  * 'DO_CREATE_LINK': This CBT is generated when a link is to be created with a node. cbt.data is a dict with keys : 'uid', 'fpr', 'nid', 'sec', 'cas'. Response CBT is not sent to the source CM in this case.

  * 'DO_TRIM_LINK': This CBT is generated when a Tincan link has to be trimmed. cbt.data is equal to the UID of the node. Response CBT is not sent to the source CM in this case.

  * 'DO_GET_STATE': This CBT is generated to query Tincan the state of the local node. cbt.data is NULL.
The state of local node is received as a Tincan notification, which will be dispatched to the appropriate CM by TincanDispatcher

  * 'DO_SEND_MSG': This CBT is generated when a CM has to send a message to another node. cbt.data is a dict with keys: 'method', 'overlay_id', 'uid', 'data'. Response CBT is not sent to the source CM in this case.

  * 'DO_SET_REMOTE_IP': This CBT is generated when there is a need to add a UID-to-IP mapping in IPOP-Tincan. cbt.data is a dict with keys: 'uid' and 'ip4'. Response CBT is not sent to the source CM in this case.

  * 'ECHO_REPLY': This CBT is generated when IPOP-Tincan sends a notification for echo request. Response CBT is not sent to the source CM in this case.

* **TincanListener**: TincanListener listens to notification packets sent by IPOP-Tincan. TincanListener sends these packets to TincanDispatcher for further processing.

* **TincanDispatcher**: TincanDispatcher receives Tincan packets from TincanListener, decodes them and dispatches to appropriate CM.

* **BaseTopologyManager**: This CM is responsible for maintaining a desired base(eg. all-to-all, structured p2p etc) topology of the VPN. This CM describes the policies of maintaining Tincan Links and leverages the LinkManager module to create/trim links with other nodes. This CM handles the conn_stat, con_req, con_resp, send_msg notifications from IPOP-Tincan.

* **Monitor**: This CM maintains the state of peer nodes.
  
  * 'PEER_STATE': This CBT is generated when the peer state has to be stored in the controller. cbt.data is a JSON object containing information about the peer state. Response CBT is not sent to the source CM in this case.

  * 'QUERY_PEER_STATE': This CBT is generated when a CM needs to know the state of a particular peer. cbt.data contains the UID of the peer. Response cbt with action 'QUERY_PEER_STATE_RESP' is sent to the source CM. cbt.data is the JSON object of the peer state in the response CBT.

  * 'QUERY_PEER_LIST': This CBT is generated when a CM requires the list of peers. Response cbt with action 'QUERY_PEER_LIST_RESP' is sent to the source CM. cbt.data is the list of peers in the response CBT.

  * 'QUERY_CONN_STAT': This CBT is generated when a CM requires the connection status of a particular. cbt.data contains the UID of the peer. Response cbt with action 'QUERY_CONN_STAT_RESP' is sent to the source CM. cbt.data is the connection status of the peer in the response CBT.

  * 'DELETE_CONN_STAT': This CBT is generated when the connection status of a particular peer has to be deleted. cbt.data contains the UID of the peer. Response CBT is not sent to the source CM in this case.

  * 'STORE_CONN_STAT': This CBT is generated when the connection status of a particular peer has to be stored. cbt.data is a dict with keys: 'uid' and 'status'. Response CBT is not sent to the source CM in this case.

* 'QUERY_IDLE_PEER_STATE': This CBT is generated when a CM requires the state of an idle peer. cbt.data is the uid of the idle peer whose state is requested/ Response cbt with action 'QUERY_IDLE_PEER_STATE_RESP' is sent to the source CM. cbt.data is the state of the requested idle peer in the response CBT.

* 'STORE_IDLE_PEER_STATE': This CBT is generated in the case of on-demand-connection, when the peer node is idle. cbt.data is a dict with keys: 'uid' and 'idle_peer_state'

* **Logger**: This CM facilitates and co-ordinate module logging. A CM can send a message to the Logger CM if it needs anything to be logged. Supported CBT actions:

  * 'DEBUG': This CBT is generated when a CM needs to log with 'DEBUG' level

  * 'INFO': This CBT is generated when a CM needs to log with 'INFO' level

  * 'WARNING': This CBT is generated when a CM needs to log with 'WARNING' level

  * 'ERROR': This CBT is generated when a CM needs to log with 'ERROR' level

  * 'PKTDUMP': This CBT is generated when a CM needs to log with packet dump data.

* **Watchdog**: Watchdog maintains the state of the local node. Supported CBT actions:

  * 'STORE_IPOP_STATE': This CBT is generated by TincanDispatcher when it receives a local_state notification from IPOP-Tincan. No Response CBT is generated.

  * 'QUERY_IPOP_STATE': This CBT is generated when a CM requires the current state of the local node. Response CBT with action 'QUERY_IPOP_STATE_RESP' is sent back to the source CM, with the state of local node in cbt.data.


#### Some other possible controller modules

* XMPP messenger: sends and decodes peer message  via XMPP. Send msg, handle msg

* OnDemand Topology Manager (UID received-traffic):
Uses Link-Manager to create/trim on-demand links based on traffic
triggered by outgoing/incoming packet to a destination, timer

* Overlay-Sender (uid, msg):
Handles creation of a payload and initiating send to a remote controller via overlay
triggered by receiving a packet up call from tincan
places event to overlay-route message to destination (unicast or multicast depending on packet)

* Overlay-DSR-Lookup (uid):
Handles discovery of a dynamic source routed path
triggered by Overlay-Sender when a path is not found

* Overlay-Receiver (msg):
Handles receiving an overlay-routed message and passing it down to tin can
triggered by receiving a packet routed from overlay-route

* Overlay-Unicast-Route (uid, [path], msg):
Handles unicast controller-controller messages that go from overlay-unicast-route module to overlay-unicast-route module
triggered by a send (on local module) or receiving controller-controller message from neighbor

* Overlay-Multicast-Route:
handles broadcasts using controller-controller communication - forwards packets to neighboring controllers
can have an optional depth specified when initiating multicast (unbounded when broadcast)

* Neighbor-sender (uid, msg):
handles sending a message to a neighboring controller over IPv6 over tincan
triggered by local module (e.g. overlay-route)
determines the destination, and which module to deliver

* Neighbor-receiver (msg):
handles receiving a message from a neighboring controller over IPv6 over tincan
triggered by a receive on IPv6 socket 
determines the destination, and which module to deliver (e.g. overlay-route)

#### Configuration

This file contains configuration for the CFx as well as the Controller Modules. The CFx parses this file and dynamically loads all the CMs listed in the file. Each module gets its configuration as a parameter in the constructor when the object is created. 

If the CM requires a method to be repeatedly called, it can make use of the timer functionality and also can specify the frequency (in secs) at which the method should be called. 

If the CM requires the CFx to wait for it to process its current CBT before terminating, it can set the joinEnabled value to True. If this value is not set to True, the CM threads are stopped as soon as the CFx terminates.

A CM can also specify the dependencies by setting the value of 'dependencies' parameter. The CFx will ensure that the dependencies are loaded before the module gets loaded. The CFx loads the CMs specified in the config file from top to bottom.

This a sample config shown below:
```
{
    "CFx": {
        "xmpp_username": "gingerninja@jabber.ru",
        "xmpp_password": "ginger123",
        "ip4_mask": 24,
        "xmpp_host": "jabber.ru",
        "stat_report": true,
        "tincan_logging": 0,
        "vpn_type": "GroupVPN"
    },
    "TincanListener" : {
        "socket_read_wait_time": 15,
        "joinEnabled": true,
        "dependencies": ["Logger"]
    },
    "Logger": {
        "controller_logging": "DEBUG",
        "joinEnabled": true
    },
    "TincanDispatcher": {
        "joinEnabled": true,
        "dependencies": ["Logger"]
    },
    "TincanSender":{
        "dependencies": ["Logger"]
    },
    "Monitor": {
        "joinEnabled": true,
        "dependencies": ["Logger"]
    },
    "BaseTopologyManager": {
        "timer_interval": 15,
        "joinEnabled": true,
        "dependencies": ["Logger"]
    },
    "LinkManager": {
        "joinEnabled": true,
        "dependencies": ["Logger"]
    },
    "AddressMapper": {
        "ip4": "192.168.5.1",
        "joinEnabled": true,
        "dependencies": ["Logger"]
    },
    "Watchdog":{
        "timer_interval": 15,
        "joinEnabled": true,
        "dependencies": ["Logger"]
    }
}

```    