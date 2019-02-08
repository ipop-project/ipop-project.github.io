## Introduction

IPOP allows you to connect to existing XMPP/STUN/TURN services available on the Internet - for instance, Google runs XMPP and STUN services, and there are commercial TURN services.

It is also possible - and in many environments, desirable - for you to deploy your own private XMPP and NAT traversal services using the ejabberd open-source software and an open-source TURN implementation. This document overviews the process of deploying these services; other documents in the Wiki provide details on how to deploy these services.

## Online Social Network (OSN) and XMPP

The XMPP service is used to store information about users and their social network relationships. These are used by IPOP to determine who to establish links with. The ejabberd open-source XMPP server allows you to create a private OSN where you have the flexibility of creating your own users and managing your own relationships. These can be done either through a command-line interface, or a Web interface.

Creating your private XMPP service entails the following tasks - for example, [here are instructions for Ubuntu](https://github.com/ipop-project/ipop-project.github.io/wiki/Deploying-XMPP-STUN-TURN-Services#using-ejabberd-xmppstun)

1. Installing ejabberd on a Linux server that is going to be accessible by all IPOP nodes
2. Configuring ejabberd with users and relationships
3. Optionally configuring ejabberd to also serve as a STUN server

## NAT Traversal and STUN/TURN

Network Address Translators - [NATs](https://en.wikipedia.org/wiki/Network_address_translation) - are very common on the Internet today, and creating end-to-end links when nodes are "behind" a NAT adds complexity to any VPN system. While the XMPP service is concerned with users and their relationships, the NAT traversal services are concerned with ensuring that it is possible for users behind NATs to communicate with each other using IPOP. There are two NAT traversal services that can be used by IPOP: 

1. The STUN service allows IPOP nodes behind a common kind of NAT (cone - the majority of NATs deployed in the Internet are of this type).
2. The TURN service allows IPOP nodes behind more restrictive NATs (symmetric) to communicate


The STUN service is the preferred method of NAT traversal, because it is light-weight allows two nodes to communicate in a peer-to-peer fashion. The TURN service is more expensive - it requires the TURN service to serve as a "relay" for all communications between two peers. Hence, when possible, STUN should be used; when not possible, TURN is a fall-back. It is possible to deploy several STUN and TURN servers to balance the load of NAT traversal in your deployment - if you are deploying your own NAT traversal services, it is useful to be aware of the general behavior of STUN and TURN services, and the kinds of NATs that your users will be subject to to help configure these services.

## Deploying STUN

A simple way of deploying a STUN service for a small-scale IPOP network is to enable ejabberd's built-in STUN service. For example, [here are instructions for Ubuntu](https://github.com/ipop-project/ipop-project.github.io/wiki/Deploying-XMPP-STUN-TURN-Services#using-ejabberd-xmppstun).

If you want to deploy more than one STUN server - for load-balancing or fault tolerance - it is recommended to deploy STUN services that are not tied to ejabberd. For example, [use your TURN server which supports the STUN service itself](https://github.com/ipop-project/ipop-project.github.io/wiki/Deploying-XMPP-STUN-TURN-Services#ipop-configuration-for-socialvpn-and-groupvpn).

## Deploying TURN

Public TURN services are not as easy to find, because they tend to consume more resources (bandwidth) than STUN. Depending on your NAT characteristics (e.g. if all nodes are behind cone NATs), you may not need a TURN service. But if you have nodes behind NATs, or restrictive firewalls (e.g. that only allow outgoing connections through certain ports, such as TCP/80 TCP/443), you will need TURN services.

There exist more than one open-source TURN service that you can use. For example, [here are instructions on how to setup a STUN+TURN server](https://github.com/ipop-project/ipop-project.github.io/wiki/Deploying-XMPP-STUN-TURN-Services#using-turnserver-turn). The configuration is more complex than STUN - e.g. it requires username/password associated with TURN "users" in the server; but again, as in STUN, you are able to deploy multiple TURN servers for improved load balancing and fault tolerance. IPOP will choose STUN/TURN servers from a list you provide in the configuration file, at random.

If you would like to use the IPOP project's public TURN service for a project, please contact us so we can determine if it's possible to accommodate your case based on bandwidth demands.

## Configuring IPOP

Once you have your own XMPP, STUN, TURN services deployed, configuring IPOP to use them is simple - all the information is provided in the config.json file used by SocialVPN or GroupVPN controllers.

