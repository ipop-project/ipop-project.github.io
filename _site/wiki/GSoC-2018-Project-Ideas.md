# Project Ideas for IPOP @ GSoC 2018

## Project 1: Security enhancements to IPOP

### Task: Dynamic VPN node revocation

In addition to a username/password authentication option, IPOP also allows nodes to authenticate to an XMPP service using X.509 public key certificates. This enables nodes to be dynamically added to an VPN by installing an X.509 certificate signed by a trusted CA into the VPN node. 

Revoking a node (Alice) requires not only removing Alice from the list of users in the XMPP server, but also terminating any peer-to-peer links that any other node (Bob, Carol, Dave) may have with Alice. 

This task is to implement a mechanism to disseminate and incorporate certificate revocation lists on IPOP nodes.

### Task: IPSEC end-to-end encryption

Individual IPOP links are secured with TLS/DTLS; in some applications, it is necessary to also support end-to-end encryption. It is possible to encapsulate IPOP over IPOP to provide both TLS/DTLS security per link, and end-to-end security using IPsec.

This project is to implement a module to programmatically configure IPsec endpoints of a virtual network using StrongSwan Versatile Internet Key Exchange (VICI)

## Project 2: Scalable IP multicast support

This project is to implement IGMP-based IP multicast support in IPOP. IP multicast is used in several streaming applications, and needs to be supported in an efficient, scalable manner. This project will implement support for one-to-many IP multicasting across IPOP overlay links. 

### Task: Enhance IPOP controller to support scalable multicast

This task will focus on coding a topology management module the IPOP controller that creates and maintains peer-to-peer WebRTC overlay links according to a scalable topology. The task will focus on a structured overlay topology (Chord- or Symphony-based). Programming will be in Python, using the IPOP controller framework.

### Task: Develop SDN controller to support scalable overlay multicast

This task will focus on coding an SDN controller that implements layer-2 unicast, broadcast, and L3 IP multicast across the scalable topology developed above. The SDN controller (programmed according to the OpenFlow specification) will program SDN switches to forward packets across the overlay using identifier-based routing. Programming will be in Python, using the Ryu SDN controller framework.

## Project 3: Visualization enhancements to IPOP

We have developed a data collection, reporting, storage and visualization system to enable administrators of an IPOP virtual network to better monitor and manage their virtual infrastructure. The existing system is implemented using contemporary WEB technologies, some of which are: React, Cytoscape, MongoDB and Flask. 

This project will develop code to improve upon various aspects of this system.

### Task: UI authentication

The visualizer's Web UI is required to support authentication of users. A user must successfully authenticate against a credentialing system before any data regarding the IPOP network is transmitted. Subsequent transactions between the webservice and the web client are to use HTTPS.  

### Task: Flexible reporting of metrics

All IPOP controller modules are able to report arbitrary data, and it is desirable to add support for per node ad-hoc reporting using modern UI elements.

### Task: UI improvements
There are several additional UI improvements which are desirable enhancing the user's interaction with the system. Some of these are:
* Implement themes which define color codes, sizes, layout which can vary according to IPOP controller model. 

* Represent the nodes in the IPOP network, overlayed on a map based on their geographical coordinates.

* Use representative icons for node according to their types, e.g., ipop-router, processing node, leaf-node/sensor.

## Project 4: IoT gateway BLE bridge

An emerging application of IPOP is to create VPNs that span all the way to IoT devices. While some IoT devices may be able to run an entire Linux/TCP-IP stack where IPOP can run (e.g. Raspberry Pi), other devices may only have low-power wireless interfaces (e.g. Bluetooth low energy, BLE), and will not be able to run a full VPN stack. Such devices may be connected to the Internet via an IoT gateway (e.g. a Linux switch/router with a 4G interface), where IPOP VPN nodes can be deployed. 

This project will develop code to bridge IoT devices to the VPN through their IPOP-enabled gateways. The approach is to virtualize the IoT device such that it can be accessible with an Ethernet or IP address on the virtual network, while the "last-mile" link is a wireless protocol such as BLE.

## Project 5: Low latency data streaming

This project will develop code to enable IPOP nodes to function as sources and sinks of steaming data. It will use caching techniques to ensure that latency requirements of next generation edge computing application are adequately satisfied. Approaches include categorizing data by its latency, persistence and availability.