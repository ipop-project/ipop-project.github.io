# FAQs

1. **What are the main differences between SocialVPN and GroupVPN?**

    These are both social virtual networks, but with different use cases and controller implementations. In SocialVPN, social relationships have an individual perspective: relationships are independently managed by each individual, and VPN links are friend-to-friend. In GroupVPN, social relationships have a group perspective: there is the concept of a group leader or manager, and once a user joins a group, VPN links are established among all devices that belong to the group.

    From a technical standpoint, the main difference between the two controllers is with respect to the allocation and translation of IPv4 address spaces. SocialVPN assigns and translates private IPv4 subnets and addresses dynamically between any two users/nodes such that it can scale to large numbers of users of online social networks without creating address conflicts. GroupVPN assigns a single private subnet to a group of user/nodes, and does not perform any address translation.

1. **Why use IPOP/SocialVPN instead of Tinc?**

    IPOP's SocialVPN uses [Google's libjingle](https://developers.google.com/talk/libjingle/) to create direct P2P connections between nodes behind NATs, handling NAT traversal automatically and transparently to the user, without requiring access to NAT/firewall devices, using standard protocols (STUN and/or TURN). tinc also provides NAT traversal, with a protocol similar to the STUN protocol [as per their manual](http://www.tinc-vpn.org/documentation-1.1/How-connections-work.html), but it does not use STUN/TURN protocols. SocialVPN also automatically handles IP address translation, supporting automatic private IP address assignment in large social networks.

1. **Why use IPOP/SocialVPN instead of Hamachi?**

    Hamachi is no longer free, and it is closed source. Hamachi is very similar to SocialVPN because it creates direct P2P connections whenever possible and uses relaying when direct connections are not possible. However, Hamachi uses its own proprietary server technologies and manages public keys. SocialVPN uses the XMPP protocol to establish P2P connections and users can use Google accounts to connect. For relaying, SocialVPN uses TURN servers. For encryption, SocialVPN uses X.509 certificates and OpenSSL. SocialVPN is implemented on mature, open-source technologies, and can be extended by the community.

1. **Why use IPOP/SocialVPN instead of Pertino?**

    Pertino is not open-source, and it is only free for a limited number of devices (up to 9). Also, Pertino is very similar to Tinc because all IP traffic has to flow through intermediary nodes housed in the cloud. This creates latency and bandwidth overheads. SocialVPN finds a direct P2P Internet path between two nodes, even if nodes are behind NATs.

1. **When should I use GroupVPN in router mode?**

    GroupVPN in router mode is recommended when you wish to connect several nodes behind a wireless router - in which case, you can run GroupVPN in the router itself using OpenWRT.

1. **When should I use GroupVPN in switch mode?**

    GroupVPN in switch mode is recommended when you wish to connect several virtual machines or containers running on the same server to a GroupVPN - in which case, you can run GroupVPN in the host itself in switchmode, and bind the IPOP tap device to a Linux bridge.

1. **How do I configure the IP address of peers in my SocialVPN?**

    If you would like to statically assign addresses to SocialVPN peers, you can do so through an additional configuration file that can be loaded with the -p argument (e.g. -p ip_config.json). In this file, you specify the UID of a node, the virtual IP address, and a label, as in the following example:

    ```
    [
        {
            "uid": "54f2b14f80e5374f8af7ad1b4838145ea7eaaf57",
            "ipv4": "172.31.0.101",
            "desc": "Alice"
        },
        {
            "uid": "2561b75dd81575044d9aef9a4db83aa2a7a23a9b",
            "ipv4": "172.31.0.102",
            "desc": "Bob"
        }
    ]
    ```

1. **How do I enable logging for debugging?**

    Generally you don't need to enable logging unless you are a developer, but if you run into errors/crashes, providing a log file is very useful. **Remember, enabling tincan_logging can reduce
nextwork performance due to I/O overhead in the packet handling thread**. The logging level is 
determined in the JSON configuration file by adding the following parameters:

    ```bash
    "controller_logging" : "DEBUG",
    "tincan_logging": 2
    ```
    * **logging_level** - sets the Python logging module for the controller with possible values
      *DEBUG*, *INFO*, *WARNING*, *ERROR*, *CRITICAL*
    * **logging** - set the logging level for IPOP-Tincan, _0_ = no logging, _1_ = error logging,
      _2_ = info logging (recommended), _3_ = verbose logging   


1. **How do you configure IPOP to restart on its own if there is a failure?**

    Currently, this is supported for the GroupVPN controller in Linux with the use of a watchdog. Check the documentation on [[running GroupVPN on Linux|Running GroupVPN on Linux]] for details.

1. **What XMPP services are known to work with IPOP?**

    It is known to work with Google XMPP service, and with ejabberd-based servers (e.g. www.jabber.org).

1.  **I have two-factor authentication enabled for my Google account, and I can't log in.**

    We currently have no interface to support Google's 2FA. As an alternative, you can set up an "Application Specific Password". This is a long, random password that can be revoked at any time. [Go to your account management page](https://www.google.com/settings/security), and click on the "Security" tab. Click on the "Settings" option for "App passwords". There you should be able to create a new application-specific password for IPOP.

    ![Example 2FA setup page](http://i.imgur.com/DB1YK9X.png)

    Use this password when setting up IPOP, instead of your normal Google password.

1.  **How do I enable IPv6 on Raspberry Pi (and other linux based systems)?**

    Our implementation requires IPv6 to function properly. You can easily enable it with the following command

    ```bash
    sudo modprobe ipv6
    ```

1. **How do I report an issue/bug?**

    We use Github's issue tracker: https://github.com/ipop-project/ipop-project.github.io/issues

    When reporting a bug, please make sure you enable debug logging (as described above) and collect output files from tincan and controller.

1. **How do I reference/acknowledge IPOP in a publication?**

    Please refer to: http://ipop-project.org/learn/#publications
