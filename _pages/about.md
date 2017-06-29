---
layout: single
permalink: /about/
title: "About IPOP"
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(127, 0, 255, 0.75)
excerpt: "Open-source User-centric Software Virtual Network"
sidebar:
  nav: "about"
---
## What is IPOP?

IPOP (IP-Over-P2P) is an open-source user-centric software virtual network allowing end users to define and create their own virtual private networks (VPNs). IPOP virtual networks provide end-to-end tunneling of IP or Ethernet over “TinCan” links setup and managed through a control API to create various software-defined VPN overlays.

## Architecture

IPOP’s architecture and design have evolved since the project’s inception from one based on a structured P2P library (Brunet) connecting all peers into a global overlay, to the current design based on TinCan links connecting users to trusted peers (e.g. from online social networks) through mediation of a decoupled controller. At its core, IPOP leverages existing technologies (Jingle/WebRTC) and standards (STUN, TURN, XMPP) to tunnel IP packets over P2P links between computers – even when they are behind firewalls and/or Network Address Translators (NATs).

## Use Cases

IPOP is useful in many applications where you need virtual networks:

### Cloud computing

IPOP GroupVPN brings together VMs distributed over multiple providers into virtual private clusters that can run unmodified platforms, services and applications.

### Mobile computing

IPOP SocialVPN can seamlessly connect Android mobile devices to cloud instances or other  devices for computation off-loading and private data sharing.

### Social networking

IPOP SocialVPN can connect a user’s PC, mobile device and cloud servers to devices of friends in their social network, enabling them to communicate directly and privately with each other to share data, stream media, play video games using existing applications.

## Unique Features

- In contrast to typical VPN technologies, which require complex setup, management and a gateway to relay VPN traffic, IPOP is straightforward to configure, because:
- It runs on existing Internet infrastructure, without requiring any specialized networking infrastructure (e.g. hardware switches/routers, or virtual routers);
- It uses online social network (OSN) infrastructures to allow users to define their own networks;
- It seamlessly traverses firewalls, NATs, and create VPN tunnels in a peer-to-peer fashion, avoiding the need for centralized VPN gateways.