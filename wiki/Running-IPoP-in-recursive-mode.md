## Introduction  
This page details the process of setting up a environment with two IPoP networks, with one of them being tunneled via the other. This approach might be warranted in scenarios where extra layer of security is needed, for example - The outer network can be secured via static IPSec policies. In the following paragraphs we will walk through the set-up but before we do that, let us lay down some terminologies.  
**OuterIPoP** - As the name suggests all the traffic of the second IPoP network is tunneled through this network.  
**InnerIpoP** - The inner virtual network, switch-mode can be enabled on this one, providing a gateway like environment.   
**svpn_port** - This is the port on which tincan listens for UDP messages coming from the controller.  
**contr_port** - port on which controller listens for udp messages coming from tincan.    
**network_ignore_list** - interfaces which are not considered while establishing p2p connection by IPoP.   
  
## Setting up the Network  
It should be borne in mind that the inner and outer networks are two independent identities having separate XMPP relations and IP address range. We are going to setup two instances of IPoP differing only in configuration.  
### Start OuterIPoP  
```bash
 sudo sh -c './ipop-tincan tunnel-tap 5800 1> out.log 2> err.log &'
```   
The above command sets up a tap interface, with tincan listening on port 5800 and the name of interface being tunnel-tap.  
```bash
tunnel-tap Link encap:Ethernet  HWaddr 42:c0:41:21:31:b3  
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:500 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```  
Next we need to configure the controller, setting up the xmpp credentias, IPv4 address/range , svpn_port, contr_port and network ignore list. The network ignore list should contain the name of the InnerIPoP tap interface, it's ok to do it even before the InnerIPoP tap interface instantiated. The controller file for gvpn is as shown below-  
```bash
{
  "CFx": {
    "xmpp_username": "xxxx@xxxx.com",
    "xmpp_password": "xxxx",
    "xmpp_host": "xxxx.com",
    "xmpp_port": 5222,
    "tincan_logging": 2,
    "vpn_type": "GroupVPN",
    "ip4_mask": 16,
    "network_ignore_list":["ipop", "lxcbr0"],
    "contr_port": 5801
  },
  "Logger": {
    "controller_logging": "DEBUG"
  },
  "TincanDispatcher": {
    "dependencies": ["Logger"]
  },
  "TincanListener" : {
    "socket_read_wait_time": 15,
    "dependencies": ["Logger", "TincanDispatcher"]
  },
  "TincanSender": {
    "switchmode": 0,
    "svpn_port": 5800,
    "dependencies": ["Logger"]
  },
  "BaseTopologyManager": {
    "ip4": "192.168.1.100",
    "sec": true,
    "multihop": false,
    "num_successors": 20,
    "num_chords": 10,
    "num_on_demand": 20,
    "num_inbound": 50,
    "ttl_link_initial": 60,
    "ttl_link_pulse": 30,
    "ttl_chord": 180,
    "ttl_on_demand": 240,
    "threshold_on_demand": 128,
    "timer_interval": 1,
    "interval_management": 15,
    "use_central_visualizer": false,
    "interval_central_visualizer": 5,
    "num_pings": 5,
    "interval_ping": 300,
    "dependencies": ["Logger"]
  },
  "LinkManager": {
    "dependencies": ["Logger"]
  },
  "StatReport": {
    "enabled": true,
    "stat_server": "metrics.ipop-project.org",
    "stat_server_port": 8080,
    "timer_interval": 200,
    "dependencies": ["Logger"]
  },
  "CentralVisualizer": {
    "enabled": false,
    "name": "",
    "central_visualizer_addr": "",
    "central_visualizer_port": 51234,
    "dependencies": ["Logger"]
  }
}
```   
Next start the controller.   
 
```bash  
python -m controller.Controller -c config/gvpn-config.json &> ctl.log &
```   
Now the outer interface should have the IP and range assigned to it. 
  
```bash
tunnel-tap Link encap:Ethernet  HWaddr 42:c0:41:21:31:b3  
          inet addr:192.168.1.100  Bcast:192.168.255.255  Mask:255.255.0.0
          inet6 addr: fd50:dbc:41f2:4a3c:25c9:651:c297:fef3/64 Scope:Global
          inet6 addr: fe80::40c0:41ff:fe21:31b3/64 Scope:Link
          UP BROADCAST RUNNING NOARP MULTICAST  MTU:1280  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:42 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:500 
          RX bytes:0 (0.0 B)  TX bytes:7676 (7.6 KB)
```  
### Start InnerIPoP  
Please note OuterIPoP has to be started before InnerIPoP, Start tincan for InnerIPoP  
```bash
sudo sh -c './ipop-tincan ipop 5805 1> out.log 2> err.log &'
```  
tap interface name "ipop" is created and tincan listens on UDP port 5805.  
Next we are going to start the controller, To force InnerIPoP to use the tap interface set up by OuterIPoP as the only gateway we need to put all other gateway interfaces like eth0 etc in the Network_Ignore_List. Also note that if switch-mode is being used the IPv4 address/range for this interface has to match with that of the bridged network. In this example we are using switchmode in LXC setup. 

Note that the lxcbr0 and eth0 interfaces are ignored, and that the address given to the STUN service is simply pointing to a dummy endpoint in the tunnel-tap address space - there does not need to be any STUN server running, this configuration entry is just to ensure that InnerIPOP nodes only advertise endpoints in the tunnel-tap address space to peers. Since these address are not NATed, there is no need for a STUN service.

Below is the configuration file for gvpn. Make sure that svpn_port and contr_port do not conflict with OuterIPoP or any other applications.--  
```bash  
{
  "CFx": {
    "xmpp_username": "yyyy@yyyy",
    "xmpp_password": "yyyy",
    "xmpp_host": "yyyy",
    "xmpp_port": 5222,
    "tincan_logging": 2,
    "vpn_type": "GroupVPN",
    "ip4_mask": 24,
    "network_ignore_list":["eth0", "lxcbr0"],
    "contr_port": 5806
  },
  "Logger": {
    "controller_logging": "DEBUG"
  },
  "TincanDispatcher": {
    "dependencies": ["Logger"]
  },
  "TincanListener" : {
    "socket_read_wait_time": 15,
    "dependencies": ["Logger", "TincanDispatcher"]
  },
  "TincanSender": {
    "switchmode": 1,
    "svpn_port": 5805,
    "stun": ["192.168.1.100:19302"],
    "dependencies": ["Logger"]
  },
  "BaseTopologyManager": {
    "ip4": "10.0.3.100",
    "sec": true,
    "multihop": false,
    "num_successors": 20,
    "num_chords": 10,
    "num_on_demand": 20,
    "num_inbound": 50,
    "ttl_link_initial": 60,
    "ttl_link_pulse": 30,
    "ttl_chord": 180,
    "ttl_on_demand": 240,
    "threshold_on_demand": 128,
    "timer_interval": 1,
    "interval_management": 15,
    "use_central_visualizer": false,
    "interval_central_visualizer": 5,
    "num_pings": 5,
    "interval_ping": 300,
    "dependencies": ["Logger"]
  },
  "LinkManager": {
    "dependencies": ["Logger"]
  },
  "StatReport": {
    "enabled": true,
    "stat_server": "metrics.ipop-project.org",
    "stat_server_port": 8080,
    "timer_interval": 200,
    "dependencies": ["Logger"]
  },
  "CentralVisualizer": {
    "enabled": false,
    "name": "",
    "central_visualizer_addr": "",
    "central_visualizer_port": 51234,
    "dependencies": ["Logger"]
  }
}
```   
Start the controller-  
```bash
python -m controller.Controller -c config/gvpn-config.json &> ctl.log &
```   
Both the interfaces should be up and configured--
```bash
sam@sam-T520:~/ipopRecursive/innerIpop$ ifconfig -a
eth0      Link encap:Ethernet  HWaddr f0:de:f1:54:d2:2e  
          inet addr:10.244.19.126  Bcast:10.244.19.255  Mask:255.255.255.0
          inet6 addr: fe80::f2de:f1ff:fe54:d22e/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:513099 errors:0 dropped:0 overruns:0 frame:0
          TX packets:339390 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:490211613 (490.2 MB)  TX bytes:55530744 (55.5 MB)
          Interrupt:20 Memory:d2600000-d2620000 

ipop      Link encap:Ethernet  HWaddr f2:53:d1:ce:5f:83  
          inet addr:10.0.3.100  Bcast:10.0.3.255  Mask:255.255.255.0
          inet6 addr: fe80::f053:d1ff:fece:5f83/64 Scope:Link
          inet6 addr: fd50:dbc:41f2:4a3c:f46d:6281:ae45:f92e/64 Scope:Global
          UP BROADCAST RUNNING MULTICAST  MTU:1280  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:45 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:500 
          RX bytes:0 (0.0 B)  TX bytes:7801 (7.8 KB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:24747 errors:0 dropped:0 overruns:0 frame:0
          TX packets:24747 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:16871525 (16.8 MB)  TX bytes:16871525 (16.8 MB)

lxcbr0    Link encap:Ethernet  HWaddr fe:8a:63:90:a8:4e  
          inet addr:10.0.3.1  Bcast:10.0.3.255  Mask:255.255.255.0
          inet6 addr: fe80::d858:87ff:fef6:1b4e/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1280  Metric:1
          RX packets:54 errors:0 dropped:0 overruns:0 frame:0
          TX packets:115 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:4572 (4.5 KB)  TX bytes:13573 (13.5 KB)

tunnel-tap Link encap:Ethernet  HWaddr 42:c0:41:21:31:b3  
          inet addr:192.168.1.100  Bcast:192.168.255.255  Mask:255.255.0.0
          inet6 addr: fd50:dbc:41f2:4a3c:25c9:651:c297:fef3/64 Scope:Global
          inet6 addr: fe80::40c0:41ff:fe21:31b3/64 Scope:Link
          UP BROADCAST RUNNING NOARP MULTICAST  MTU:1280  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:68 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:500 
          RX bytes:0 (0.0 B)  TX bytes:11048 (11.0 KB)

vethCBS7KX Link encap:Ethernet  HWaddr fe:8a:63:90:a8:4e  
          inet6 addr: fe80::fc8a:63ff:fe90:a84e/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:91 errors:0 dropped:0 overruns:0 frame:0
          TX packets:155 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:10798 (10.7 KB)  TX bytes:17187 (17.1 KB)

vmnet1    Link encap:Ethernet  HWaddr 00:50:56:c0:00:01  
          inet addr:172.16.42.1  Bcast:172.16.42.255  Mask:255.255.255.0
          inet6 addr: fe80::250:56ff:fec0:1/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:73 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

vmnet8    Link encap:Ethernet  HWaddr 00:50:56:c0:00:08  
          inet addr:172.16.215.1  Bcast:172.16.215.255  Mask:255.255.255.0
          inet6 addr: fe80::250:56ff:fec0:8/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:86 errors:0 dropped:0 overruns:0 frame:0
          TX packets:76 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

wlan0     Link encap:Ethernet  HWaddr a0:88:b4:18:a0:b0  
          inet6 addr: fe80::a288:b4ff:fe18:a0b0/64 Scope:Link
          UP BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:61 errors:0 dropped:0 overruns:0 frame:0
          TX packets:54 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:31163 (31.1 KB)  TX bytes:5568 (5.5 KB)

```  
Now attach the bridged interface to InnerIPoP tap interface   
```bash
sudo brctl addif lxcbr0 ipop
``` 

Repeat the same procedure , with corresponding IPv4 addresses on the peer machine. If everything worked fine the bridged instances should be able to connect to each other successfully. As pointed out before now you can choose a IPSec framework of your choice to enforce IPSec policies on IPv4 addresses of the OuterIPoP interfaces, static outer IPv4 addresses makes the process of making configurations for IPSec much more convenient and hassle free. To verify if traffic is being encapsulated try to capture the traffic on OuterIPoP interface while sending traffic between the containers/bridged nodes on either sides, you would see something like below--  
```bash
sudo tcpdump -i tunnel-tap
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on looptap, link-type EN10MB (Ethernet), capture size 65535 bytes
15:31:33.873408 IP 192.168.1.101 > 192.168.1.100: ESP(spi=0x0d54f597,seq=0x1a3a), length 156
15:31:33.953127 IP 192.168.1.100 > 192.168.1.101: ESP(spi=0x0bc67d72,seq=0x1a44), length 108
15:31:33.978360 IP 192.168.1.100 > 192.168.1.101: ESP(spi=0x0bc67d72,seq=0x1a45), length 156
15:31:33.978527 IP 192.168.1.101 > 192.168.1.100: ESP(spi=0x0d54f597,seq=0x1a3b), length 108
15:31:34.354032 IP 192.168.1.101 > 192.168.1.100: ESP(spi=0x0d54f597,seq=0x1a3c), length 156
15:31:34.434340 IP 192.168.1.100 > 192.168.1.101: ESP(spi=0x0bc67d72,seq=0x1a46), length 108
15:31:34.459079 IP 192.168.1.100 > 192.168.1.101: ESP(spi=0x0bc67d72,seq=0x1a47), length 156
15:31:34.459236 IP 192.168.1.101 > 192.168.1.100: ESP(spi=0x0d54f597,seq=0x1a3d), length 108
15:31:34.508294 IP 192.168.1.100 > 192.168.1.101: ESP(spi=0x0bc67d72,seq=0x1a48), length 100
15:31:34.508376 IP 192.168.1.101 > 192.168.1.100: ESP(spi=0x0d54f597,seq=0x1a3e), length 100
15:31:34.833661 IP 192.168.1.101 > 192.168.1.100: ESP(spi=0x0d54f597,seq=0x1a3f), length 156
```  
Here 192.168.1.101 and 192.168.1.100 are the IPv4 addresses of outer IPoP network.  
The page below shows the procedure to configure IPSec using Racoon in recursive IPoP environment.  
[IPSec on IPoP GVPN](https://github.com/ipop-project/ipop-project.github.io/wiki/IPSec-on-IPoP-GVPN)



