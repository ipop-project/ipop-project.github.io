---
permalink: /about/
title: "About IPOP"
header:
  overlay_color: "#3C829B"
---
{% include toc %}

# <i class="fa fa-cubes" aria-hidden="true"></i>What is IPOP?

IPOP (IP-Over-P2P) is an open-source user-centric software virtual network allowing end users to define and create their own virtual private networks (VPNs). IPOP virtual networks provide end-to-end tunneling of IP or Ethernet over “Tincan” links setup and managed through a control API to create various software-defined VPN overlays.

# <i class="fa fa-cubes" aria-hidden="true"></i>Architecture

IPOP’s architecture and design have evolved since the project’s inception from one based on a structured P2P library (Brunet) connecting all peers into a global overlay, to the current design based on Tincan links connecting users to trusted peers (e.g. from online social networks) through mediation of a decoupled controller. At its core, IPOP leverages existing technologies (Jingle/WebRTC) and standards (STUN, TURN, XMPP) to tunnel IP packets over P2P links between computers – even when they are behind firewalls and/or Network Address Translators (NATs).

# <i class="fa fa-cubes" aria-hidden="true"></i>Use Cases

IPOP is useful in many applications where you need virtual networks:

## Cloud computing

IPOP GroupVPN brings together VMs distributed over multiple providers into virtual private clusters that can run unmodified platforms, services and applications.

## Mobile computing

IPOP SocialVPN can seamlessly connect Android mobile devices to cloud instances or other  devices for computation off-loading and private data sharing.

## Social networking

IPOP SocialVPN can connect a user’s PC, mobile device and cloud servers to devices of friends in their social network, enabling them to communicate directly and privately with each other to share data, stream media, play video games using existing applications.

# <i class="fa fa-cubes" aria-hidden="true"></i>Unique Features

- In contrast to typical VPN technologies, which require complex setup, management and a gateway to relay VPN traffic, IPOP is straightforward to configure, because:
- It runs on existing Internet infrastructure, without requiring any specialized networking infrastructure (e.g. hardware switches/routers, or virtual routers);
- It uses online social network (OSN) infrastructures to allow users to define their own networks;
- It seamlessly traverses firewalls, NATs, and create VPN tunnels in a peer-to-peer fashion, avoiding the need for centralized VPN gateways.

# <i class="fa fa-cubes" aria-hidden="true"></i>Project History

IPOP started as a research project at the University of Florida in 2006. In its first-generation design and implementation, IPOP was built atop structured P2P links managed by the C# [Brunet] library. In its first design, IPOP relied on Brunet’s structured P2P overlay network for peer-to-peer messaging, notifications, NAT traversal, and IP tunneling. The Brunet-based IPOP is still available as [open-source code]; however, IPOP’s architecture and implementation have evolved.

Starting September 2013, the project has been funded by the National Science Foundation under the SI2 (Software Infrastructure for Sustained Innovation) program to enable it as as open-source “scientific software element” for research in cloud computing. The second-generation design of IPOP incorporates standards (XMPP, STUN, TURN) and libraries (libjingle) that have evolved since the project’s beginning to create P2P tunnels – which we refer to as [Tincan] links. The current Tincan-based IPOP implementation is based on modules written in C/C++ that leverage libjingle to create Tincan links, and exposing a set of APIs to [Controller] modules that manage the setup, creation and management of Tincan links. For enhanced modularity, the controller module runs as a separate process from the C/C++ module that implements Tincan links and communicate through a JSON-based RPC system; thus the controller can be written in other languages such as Python.

# <i class="fa fa-cubes" aria-hidden="true"></i>Usage Scenarios

There are various usage scenarios for IPOP-based VPNs that we have encountered; some of the relevant ones are highlighted below. If you are using IPOP in a different scenario, we’d like to hear from you!

## Private networks with family and friends for gaming, data sharing, and streaming
Alice wants to play a “LAN-party” game with a group of friends, share data in her computer with her friends, stream music and video – essentially connecting her computer to her friends’ as if they were all on the same location. But creating virtual private networks is very complex for the typical Internet user, and commercial services are expensive and restrictive. Here she can use IPOP’s SocialVPN. With SocialVPN, it becomes easy to create a VPN with her friends – for example using her Google account, or running her own private server that is dedicated to her group. It is even possible to run GroupVPN on her wireless routers (using OpenWRT), and then, all her devices (gaming console, PC, mobile, TV) can join the SocialVPN.

## Virtual clusters across multiple clouds
Bob wants to deploy virtual clusters on demand to create elastic platforms (e.g. “bag-of-tasks” high-throughput computing, content distribution, Web services) across multiple cloud providers – so his application can be distributed geographically and he is not locked-in to any particular cloud provider. But cloud providers do not provide support for seamless inter-networking, and the traversal of NATs/firewalls and configuration of secure VPN links is complex and error-prone. Here he can use IPOP’s GroupVPN. With GroupVPN, it becomes easy to connect virtual machines together to form virtual private clusters that are all on the same flat virtual IP address space – even if virtual machines migrate.

## Trusted collaborative environments linking private clouds
A group of researchers across multiple academic institutions wish to create a collaborative environment where they share resources (e.g. computing clusters, datasets, sensors) with trusted peers. The configuration of servers, firewalls, NATs quickly becomes very complex as the number of institutions/users grow. Here, the collaborators can use IPOP’s GroupVPN, allowing them to bring trusted resources together in a virtual private network without worrying about the configuration of NATs, firewalls, VPN servers, or virtual network routers.

## Next-generation P2P-based social applications
Carol wants to develop the next social networking app that actually links user devices privately with their friends. But with typical social network applications, the “middle-man” online social network provider is always on the way of communications – being able to peek at (and store) all of it – and the kinds of applications users can run are restricted by what APIs the social network provider offers. Here Carol can start with IPOP’s SocialVPN. With SocialVPN, an application developer can write next-generation peer-to-peer, friend-to-friend social apps using the familiar TCP/IP network stack – for both IPv4 and IPv6. SocialVPN also can run on Android-based mobile devices.

## Sensor networks
Dave wants to deploy sensor networks so his devices can connect securely across multiple geographically dispersed locations over the Internet as if they were all on the same network. But the setup and configuration of VPNs for sensor devices is challenging and error-prone. Here Dave can again use IPOP’s GroupVPN. It supports Android-based and Raspberry Pi devices – bringing VPN endpoints to the sensors themselves. Or, alternatively, GroupVPN can also run on a variety of wireless routers using OpenWRT. With OpenWRT, it is not necessary to run the VPN software on resource-constrained sensors – all Dave needs is for the sensors to run IP over Wi-Fi, and the distributed sensor network can join a GroupVPN by connecting to a local area wireless router running OpenWRT GroupVPN, and from there connect securely to other GroupVPN/OpenWRT routers.

# <i class="fa fa-cubes" aria-hidden="true"></i>Sponsors

![NSF Logo](../assets/images/nsf.png){: .profile-img} This material is based upon work supported in part by the National Science Foundation under Grant No. [1339737] (under the Division of Advanced Cyberinfrastructure’s SI2 program) and [1234983] (SAVI – PRAGMA). Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.

We also gratefully acknowledge support from the US Department of Defense, Google Summer of Code, and Microsoft Azure.

---
{: .clear-both}

![UF Logo](../assets/images/uf.png){: .profile-img} IPOP is a project led by the [Advanced Computing and Information Systems (ACIS) Laboratory] at the [University of Florida].

---
{: .clear-both}

Please help us continue being supported by our sponsors by [referencing our work in your publications].


[Brunet]: http://github.com/johnynek/brunet
[open-source code]: http://github.com/ptony82/brunet/tree/master
[Tincan]: ../learn/#Tincan
[Controller]: ../learn/#controllers
[1339737]: http://nsf.gov/awardsearch/showAward?AWD_ID=1339737
[1234983]: http://nsf.gov/awardsearch/showAward?AWD_ID=1234983
[Advanced Computing and Information Systems (ACIS) Laboratory]: https://www.acis.ufl.edu/
[University of Florida]: https://www.ufl.edu/
[referencing our work in your publications]: ../publications/