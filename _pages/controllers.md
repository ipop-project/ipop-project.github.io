---
permalink: /controllers/
title: "Controllers Architecture"
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(255, 127, 127, 0.75)
excerpt: 'IPOP Controllers Architecture'
sidebar:
  nav: "learn"
---
The TinCan-based IPOP architecture supports different controllers to implement different virtual networks.

There are two controllers under active development – GroupVPN and SocialVPN. These are both social-based virtual private networks, but with different use cases and controller implementations. In SocialVPN, social relationships have an individual perspective: relationships are independently managed by each individual, and VPN links are friend-to-friend. In GroupVPN, social relationships have a group perspective: there is the concept of a group leader or manager, and once a user joins a group, VPN links are established among all devices that belong to the group.

SocialVPN – this is a controller for the creation of virtual private networks connecting an Internet user’s to their friend’s devices. Each user has its own view of a personal IPv4 virtual address space, and devices of friends are mapped to this address space dynamically.

GroupVPN – this is a controller for the creation of clusters where machines belonging to the cluster’s group are able to communicate to all other machines under a private virtual address space subnet (e.g. 10.10.x.y/16) that is not translated. Example use cases include user-defined virtual private clusters, inter-cloud computing, and virtual LANs for gaming.

Since version 15.01, IPOP GroupVPN can also be executed in “switch mode”, allowing it to handle Ethernet frames as a virtual layer-2 switch. Use case scenarios of switch mode include support for Linux container virtual networks (where multiple container endpoints can be bound to a single IPOP instance through a bridge), and GroupVP on OpenWRT-enabled wireless routers allowing multiple devices across multiple LANs to connect to each other without the need to run GroupVPN software on each device.

From a technical standpoint, the main difference between the two controllers is with respect to the allocation and translation of IPv4 address spaces. SocialVPN assigns and translates private IPv4 subnets and addresses dynamically between any two users/nodes such that it can scale to large numbers of users of online social networks without creating address conflicts. GroupVPN assigns a single private subnet to a group of user/nodes, and does not perform any address translation.