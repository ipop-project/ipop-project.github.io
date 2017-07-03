---
layout: splash
permalink: /contribute/
title: "Contribute"
---
{% include toc %}

# Contribute

We welcome developers to contribute code to the open-source IPOP project, as well as contributions in porting/building executables for various platforms, packaging for different O/S distributions, and documentation.

Our software repository is on GitHub, which many developers are familiar with. We follow a review process – pull requests are thoroughly reviewed by one or more experienced peer developers before being incorporated in the code base. Therefore, we expect code of good quality that is thoroughly tested before a pull request is accepted.

You should feel free to clone our repositories and work on your own branch; if you would like to commit code to our branch, the actual steps of this process are outlined in a Wiki entry for our development workflow. Contributors interested in embarking on implementing a project that may require significant changes to IPOP modules are encouraged to contact us before doing so to make sure we understand the scope of the project.

Laundry list of projects/topics for contributions:

- Packaging for various Linux distributions
- Support for other forms of XMPP authentication (x.509, oauth2)
- Decentralized XMPP messaging (psycd?)
- Prioritization and management of multiple STUN/TURN services
- Support for OS/X
- Support for scalable overlay topologies and routing for GroupVPN (e.g. structured P2P)
- Social routing for SocialVPN
- Policies for efficient proactive/on-demand creation/trimming of TinCan links based on traffic demand
- Efficient handling of multicast packets
- Social NAT traversal (STUN/TURN over social peers)
- Packet capture/injection on OpenvSwitch
- IPOP supports existing IPv4/IPv6 applications, and enables new ones as well. We are very interested in new, creative applications that layer upon IPOP – in particular, applications that use SocialVPN in mobile device environments.

# Code Repository

[Code Repository - GitHub]

# Reporting Issue

[Reporting Issue - IPOP Wiki]

# Submitting Code

[Submitting Code - IPOP Wiki]


[Code Repository - GitHub]: https://github.com/ipop-project
[Reporting Issue - IPOP Wiki]: https://github.com/ipop-project/ipop-tincan/issues
[Submitting Code - IPOP Wiki]: https://github.com/ipop-project/ipop-project.github.io/wiki/How-to-Contribute