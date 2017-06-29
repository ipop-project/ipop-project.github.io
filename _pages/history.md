---
permalink: /history/
title: "Project History"
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(255, 127, 127, 0.75)
excerpt: 'IPOP Project History'
sidebar:
  nav: "about"
---
IPOP started as a research project at the University of Florida in 2006. In its first-generation design and implementation, IPOP was built atop structured P2P links managed by the C# [Brunet] library. In its first design, IPOP relied on Brunet’s structured P2P overlay network for peer-to-peer messaging, notifications, NAT traversal, and IP tunneling. The Brunet-based IPOP is still available as [open-source code]; however, IPOP’s architecture and implementation have evolved.

Starting September 2013, the project has been funded by the National Science Foundation under the SI2 (Software Infrastructure for Sustained Innovation) program to enable it as as open-source “scientific software element” for research in cloud computing. The second-generation design of IPOP incorporates standards (XMPP, STUN, TURN) and libraries (libjingle) that have evolved since the project’s beginning to create P2P tunnels – which we refer to as [TinCan] links. The current TinCan-based IPOP implementation is based on modules written in C/C++ that leverage libjingle to create TinCan links, and exposing a set of APIs to [Controller] modules that manage the setup, creation and management of TinCan links. For enhanced modularity, the controller module runs as a separate process from the C/C++ module that implements TinCan links and communicate through a JSON-based RPC system; thus the controller can be written in other languages such as Python.

[Brunet]: http://github.com/johnynek/brunet
[open-source code]: http://github.com/ptony82/brunet/tree/master
[Tincan]: http://ipop-project.org/learn/tincan
[Controller]: http://ipop-project.org/learn/controllers