## Overview:

[IPOP](http://ipop-project.org) is an open-source user-centric software virtual network allowing end users to define and create their own virtual private networks (VPNs). IPOP virtual networks provide end-to-end IP tunneling over “TinCan” links setup and managed through a control API to create various software-defined VPN overlays. IPOP builds upon the Jingle WebRTC library to create such links, which are then use as a basis to create a P2P routing overlay for easy-to-deploy VPNs with P2P links.

The IPOP project has a very successful participation in the undergrad and graduate volunteer community, and we are looking forward to working with bright, motivated students for another summer.

One of the key outcomes of the GSoC'15 was a complete overhaul of the IPOP ``controller`` framework, where the logic related to configuration, creation, management of P2P VPN links, overlay construction and routing, virtual network address assignment/mapping, among others, is implemented (in Python). This is now part of the release 16.01 of the IPOP codebase. 

This summers projects fall largely into the category of design of useful modules that can plug into this new framework. These modules have different levels of complexity/expected coding time, and volunteers are free to take on one or more modules. These include:

## 1) Overlay multicast and routing modules

**Summary**: IPOP virtual networks form overlays connecting nodes in a peer-to-peer fashion with libjingle-based tunnels. For scalability reasons, it is necessary to allow routing across multiple overlay ``hops`` - in particular, for multicast messages (e.g. the ARP protocol when IPOP is configured to run in Layer-2 mode). IPOP needs to be extended with modules to support multicasting - with possibly different multicasting approaches tailored to different overlay topologies 

**Requirements**: The overlay multicast modules needs to implement the following primitives:

### Core multicast module (CMM)
* The CMM is implemented as a module loaded to the IPOP controller framework
* The CMM takes as inputs a unique message ID, a payload, a list of neighbors to deliver to, and the name of a destination multicast module (DMM) to deliver to handle multicast messages
* The CMM sends messages to the CMM modules of immediate-neighbor IPOP nodes, using Inter-Controller Communication (ICC), where they are delivered to the DMM 

### Structured multicast module (SMM)
* SMM multicasts messages across a structured P2P overlay network (e.g. Chord topology)
* SMM is implemented as a module loaded to the IPOP controller framework
* The SMM module takes as inputs a unique message ID, a payload, and a range of UUIDs of nodes to deliver to
* The SMM module partitions the range of the UUIDs it receives across `n' sub-ranges, one for each of its `n' neighbors, and uses CMM to forward multicast messages to each neighbor with each appropriate sub-range

### Token-limited flooding module (TLFM)
* TLFM multicasts messages across an arbitrary P2P overlay network (e.g. social network graph)
* TLFM is implemented as a module loaded to the IPOP controller framework
* The TLFM module takes as inputs a unique message ID, a payload, and a a number of tokens
* The TLFM module records processing of this message ID, selects `k<=n` out of its `n` neighbors, and uses CMM to forward multicast messages to each `k` neighbor 

### Source-routed path discovery module (SPDM)
* SPDM uses multicast messages to discover intermediary nodes in a path between a source and a destination
* SPDM is used as a basis for implementing source-based routing for unstructured overlays
* SPDM uses TLFM to token-limited flood a message with the destination node's UUID
* SPDM modules append the payload with the UUIDi of a node visited before forwarding, so when the destination UUID is reached, it can send the path back to the source

### Source-routing unicast module (SRUM)
* SRUM sends unicast messages to a destination by explicitly identifying the path to be traversed
* SRUM can be used as a basis for implementing routing in unstructured overlay networks such as SocialVPN
* SRUM uses SPDM to discover a path to a destination UUID (if it exists)
* SRUM also manages a UUID-indexed path cache to avoid the need for continuous discovery - the policies for invalidation/eviction of cache entries need to be defined 
* SRUM forwards unicast messages to the next SRUM hop in the source-routes path, towards the destination

**Mentor**:  
Saumitra Aditya

**Skills needed**:  
Strong command over Python, basic understanding of computer networks and software design.

**Deliverables**:  
Various IPOP controller modules (CMM, SMM, TLFM, SPDM, SRUM), covering the above listed requirements.

## 2) Traffic Based Upcall / Traffic Statistics Modules

Ipop-tap resides in lowest level in ipop-tincan handling byte level logic operation and modification. It is hard for controller to know what kind of traffic (TCP or UDP) streams and how intense the stream is running through ipop-tap. This task is implementing configurable flow table in ipop-tap. This module should be configured through controller. 

Features
 - Required to be configured through controller 
 - Statistics can be retrieved tincan-controller API
 - Upon programmed, ipop-tap counts the number of packets passed, byte size and table idle time. 
 - Theoretically, unlimited number of flow table can be programmed. 
 - Requires separate thread to update table idle time and mean time traffic

e.g.
 ![](https://cloud.githubusercontent.com/assets/3869507/13115070/592f5420-d564-11e5-908a-1801f4eda7fd.png)

**Skills needed**:  
* C : 80% of code work. Mostly on network programming with byte-level operations
* C++ : 5% of coding
* Python : 15% of coding
* Understanding on network protocols such as ARP, NDP, ICMP, TCP and UDP
* A little understanding on software defined system

**Deliverable**
* Designing flow table structure
* APIs for controller
* Separate thread for update the flow table traffic statistics (n_bytes, n_packets and Mbps)
* Unit-test alongside with any implementation
 


