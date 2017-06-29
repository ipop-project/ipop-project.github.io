---
permalink: /usage/
title: "Usage Scenarios"
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(255, 127, 127, 0.75)
excerpt: 'IPOP Usage Scenarios'
sidebar:
  nav: "about"
---
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