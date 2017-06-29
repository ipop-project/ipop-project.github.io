---
permalink: /groupvpn/
title: "GroupVPN"
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(0, 127, 127, 0.75)
excerpt: 'IPOP GroupVPN'
sidebar:
  nav: "learn"
---
*GroupVPN* is an IPOP controller for virtual private network tailored to use cases where you want to bring together groups of machines into a virtual network that is logically connected all-to-all. With the GroupVPN controller, machines that join a group are assigned virtual addresses within an IP subnet, each node has connectivity to all other nodes in the group, and IP addresses are not translated. GroupVPN also supports a “switch mode” where Ethernet frames are tunneled, and IPOP behaves as a virtual L2 switch. These are some of the ways you can use GroupVPN:

## Multi-cloud computing

GroupVPN allows you to connect virtual machines across multiple cloud providers (private or commercial) for enhanced fault tolerance content distribution. You do not need any support from the cloud provider to run GroupVPN – all you need is a VM!

## Collaborative environments

GroupVPN allows you to create virtual private networks that span across multiple sites that need to collaborate – e.g. universities, branches and roaming workers in small/medium businesses. It is easy to setup and automatically traverses NATs/firewalls.

## Virtual LANs for gaming

GroupVPN allows gamers to create virtual networks connecting them together for multi-player gaming. In the typical configuration, GroupVPN runs on end devices (e.g. a PC), but it’s also possible to run GroupVPN on OpenWRT routers to connect all devices of a LAN to a GroupVPN.