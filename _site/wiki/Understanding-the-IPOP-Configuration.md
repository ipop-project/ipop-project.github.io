# Understanding the IPOP Configuration

## Quickstart

There are only two required modification to the IPOP configuration file that is necessary to get started. You must add your XMPP server host/IP address, username and password to the "Signal" section of the configuration JSON file. You will also want to set an appropriate IP4 address value in BridgeController. Example:
```json
  "Signal": {
    "Enabled": true,
    "Overlays": {
      "101000F": {
        "HostAddress": "xmpp.host.addr",
        "Port": "5222",
        "Username": "xmpp-id@ejabberd",
        "Password": "a_secure-pswd",
        "AuthenticationMethod": "PASSWORD"
      }
    }
  },
  "BridgeController": {
    "Enabled": true,
    "Overlays": {
      "101000F": {
        "Type": "OVS",
        "BridgeName": "ipopbr0",
        "IP4": "10.10.100.101",
        "PrefixLen": 24,
        "MTU": 1410,
        "AutoDelete": true
      }
    }
  }
```
A template can be found in the ipop installation directory /opt/ipop-vpn/sample-config.json, and should be completed and copied to /etc/opt/ipop-vpn/config.json.


## Advanced Configuration

The IPOP configuration file uses the JSON format, and specifies the parameterized options for the various controller modules that make up the IPOP controller. A valid config.json file is required to run IPOP. The options that are of most interest and/or need to be changed are stored in this file. The controller/framework/fxlib.py contains the full set of default values in the CONFIG dictionary. This dictionary is loaded first and any values specified in config file will override them. Therefore, changes should always be made to the config.json file and not the fxlib.py file.
The configurations tells the controller framework which modules to load and with what parameters. If a module is not specified in the configuration it is not loaded. Certain keys occur in multiple modules with the same meaning and effect. Each module has an _Enabled_ key that when set to false will cause the framework to skip loading it. _TimerInterval_ specifies how often a module’s timer event fires in seconds. _Dependencies_ specify which modules are used a module and must be loaded before hand.

**CFx** - Used by the framework
* _NodeId_ - hexadecimal UUID for the local node. One can specified here or left blank for the framework to generate its own.
* _Model_ - A mnemonic  to describe customized IPOP controllers. You can develop and add your own modules, or remove or replace existing modules.
* _Overlays_ - List of overlays UUIDs that your controller creates and manages. By default there is only one but you can add more. Each overlay is a separate L2 network and must be configured separately throughout the config file1.
* _NidFileName_ - Fully qualified filename for storing generated Node Id.

**Logger** - The controller logger module. Used by all other modules for logging. Supports disk file and console streams.
* _LogLevel_ - The detail of information to log. Values: NONE/ERROR/WARNING/INFO/DEBUG.
* _ConsoleLevel_ - Separate logging level used for the console when device is all
* _Device_ - The output stream to be used. Values: File/Console/All.
* _Directory_ - The filesystem directory path to store the log files.
* _CtrlLogFileName_ - Controller log file name
* _TincanLogFileName_ - Tincan (data plane) log file name
* _MaxFileSize_ - Maximum individual log file size
* _MaxArchives_ - no of log files to archive before overwriting

**TincanInterface** - Module to abstract interacting with Tincan process
* _MaxReadSize_ - Max buffer size for Tincan Messages
* _SocketReadWaitTime_ - Socket read wait time for Tincan Messages
* _RcvServiceAddress_ - Controller server address
* _SndServiceAddress_ - Tincan server address
* _RcvServiceAddress6_ - Controller server IPv6 address
* _SndServiceAddress6_ - Tincan server IPv6 address
* _CtrlRecvPort_ - Controller Listening Port
* _CtrlSendPort_ - Tincan Listening Port

**Signal** - Provides signalling services for bootstrapping tunnel connections.
* _CacheExpiry_ - Minimum duration in seconds that an entry remains in the Node ID -> JID cache
* _Overlays_ - A configuration for each overlay being managed by this controller
  * _Overlay UUID_ - A hexadecimal value matching one in the CFx Overlays list (see above 1)
  * _HostAddress_ - A compliant XMPP server (eg ejabberd) host/IP address
  * _Port_: XMPP server listening network port
  * _Username_ - XMPP user name in user@host format
  * _Password_ - corresponding XMPP password, can be blank if password is stored in keyring.
  * _AuthenticationMethod_ - Use password or asymmetric key for authentication. Values: Password/x509
  * _TrustStore_ - Directory to the local root trust store
  * _CertDirectory_ - Directory where the client certificates
  * _CertFile_ - Client certificate filename
  * _KeyFile_ - Client key filename

**Topology** - Module that defines and enforces the overlay topology.
* _Overlays_ - A configuration for each overlay being managed by this controller
  * _Overlay UUID_ - A hexadecimal value matching one in the CFx Overlays list (see above 1)
  * _Name_ - Descriptive mnemonic .
  * _Description_ - Descriptive mnemonic .
  * _EnforcedEdges_ - Peer Ids that a tunnel should be created to.
  * _ManualTopology_ - Should the topology only create enforced edges. Values true/false (default)
  * _PeerDiscoveryCoalesce_ - The number of new peer notifications to wait on before attempting to update the overlay edges. If this threshold is not reached the overlay will be refreshed on its periodic _TimerInterval_.
  * _MaxSuccessors_ - Maximum number of successors links to create. These are outgoing links to the next peer in the overlay's ring.
  * _MaxLongDistEdges_ - Maximum number of outgoing long distance edges to initiate. 

**LinkManager** - Creates and manages the WebRTC based links between peers.
* _Stun_ - List of STUN server addresses in format address:port
* _Turn_ - List of dictionaries which specify the TURN server and corresponding credentials.
  * _Address_ - TURN server host/IP address and port in format address:port
  * _User_ - TURN user name
  * _Password_ - Corresponding TURN password.
* _Overlays_ - A configuration for each overlay being managed by this controller
  * _Overlay UUID_ - A hexadecimal value matching one in the CFx Overlays list (see above 1)
  * _Type_ - Should only be TUNNEL
  * _TapName_ - The prefix used for creating the IPOP TAP devices. The first 7 chars of the link ID are appended.
  * _IgnoredNetInterfaces_ - List of TAP device names that should not be used for tunneling. No CAS endpoints points bound to these network interfaces will be generated.

**BridgeController** - Module that manages the network bridge interaction with the IPOP TAP devices.
* _Overlays_ - A configuration for each overlay being managed by this controller
  * _Overlay UUID_ - A hexadecimal value matching one in the CFx Overlays list (see above 1)
  *  _Type_ - The type of network bridge to instantiate, the Linux bridge and Openvswitch are supported. Values: LXBR/OVS
  *  _BridgeName_ - Mnemonic used for naming the bridge instance.
  *  _IP4_ - The IPv4 address to assign to the bridge. This is an optional parameter, if your deployment does not require assigning an IP configuration to the bridge it can be omitted.
  *  _PrefixLen_ - The network prefix length to apply to the bridge. (Optional parameter)
  *  _MTU_ - The maximum transmission unit size to be applied to the bridge. Optional parameter, IPOP sets an MTU of 1410.
  *  _AutoDelete_ - Remove the bridge device that was specified when the controller shuts down. Values: True/False (default)

**OverlayVisualizer** - Module which collects overlay network status and metrics and transmits it to the collector web service.
*  _WebServiceAddress_ - The host/IP address of the collector and visualization web service, in the format address:port.
*  _NodeName_ - A user provided descriptive mnemonic that is used for labeling the node in the visualization browser UI.

**UsageReport** - Module that collects and transmits anonymized usage data necessary for reporting to NSF per funding agreement. If you do not wish to participate, set the module’s Enabled key to false. There is no other parameter to configure.

## Sample Configuration File

A sample configuration file is available [here](https://raw.githubusercontent.com/ipop-project/Controllers/master/controller/sample-multi-overlay-config.json).
