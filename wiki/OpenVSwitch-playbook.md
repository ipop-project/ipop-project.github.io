# Installation  
```bash
sudo apt-get install openvswitch-switch
```   
# Check status
```bash
sudo ovs-vsctl show
```   
# Create a bridge   
```bash
sudo ovs-vsctl add-br <bridge name>
```  
# Delete a bridge  
```bash
sudo ovs-vsctl del-br <bridge name>  
```  
# Create a virtual tap interface  
```bash
sudo ip tuntap add mode tap <name of interface>
```  
# Add IPv4 address to tap interface  
```bash  
sudo ip addr add <address/subnet> dev <name of interface>  
```  
# Bring the interface up  
```bash
sudo ifconfig <name of interface> up  
```  
# Add interface to a port on Vswitch  
```bash
sudo ovs-vsctl add-port <name of bridge> <name of interface>  
```
# Delete a interface from port on Vswitch  
```bash
sudo ovs-vsctl del-port <name of interface>  
```  

# Example run
```bash
sam@ubuntu:~$ sudo apt-get install openvswitch-switch
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  openvswitch-common
The following NEW packages will be installed:
  openvswitch-common openvswitch-switch
0 upgraded, 2 newly installed, 0 to remove and 545 not upgraded.
Need to get 1,811 kB of archives.  
```  
```bash
sam@ubuntu:~$ sudo ovs-vsctl show
389b9d31-1859-4044-9a8d-a2884367f2a6
    ovs_version: "2.5.2"
```  
```bash  
sam@ubuntu:~$ sudo ovs-vsctl add-br br-int
```  
```bash  
sam@ubuntu:~$ sudo ovs-vsctl show
389b9d31-1859-4044-9a8d-a2884367f2a6
    Bridge br-int
        Port br-int
            Interface br-int
                type: internal
    ovs_version: "2.5.2"  
```
```bash
sam@ubuntu:~$ sudo ip tuntap add mode tap vport1
sam@ubuntu:~$ ifconfig -a
br-int    Link encap:Ethernet  HWaddr 72:e4:a1:2a:e7:4b  
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

eth0      Link encap:Ethernet  HWaddr 00:0c:29:7a:f2:d9  
          inet addr:192.168.37.131  Bcast:192.168.37.255  Mask:255.255.255.0
          inet6 addr: fe80::c6c5:146c:f6c5:d9c3/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:6310 errors:0 dropped:0 overruns:0 frame:0
          TX packets:3257 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:9212660 (9.2 MB)  TX bytes:218619 (218.6 KB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:473 errors:0 dropped:0 overruns:0 frame:0
          TX packets:473 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:39028 (39.0 KB)  TX bytes:39028 (39.0 KB)

ovs-system Link encap:Ethernet  HWaddr 7a:1a:19:5d:6b:97  
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

vport1    Link encap:Ethernet  HWaddr 1a:9c:76:55:f1:8a  
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```  
```bash
sam@ubuntu:~$ sudo ip addr add 10.10.10.100/24 dev vport1
sam@ubuntu:~$ ifconfig -a
br-int    Link encap:Ethernet  HWaddr 72:e4:a1:2a:e7:4b  
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

eth0      Link encap:Ethernet  HWaddr 00:0c:29:7a:f2:d9  
          inet addr:192.168.37.131  Bcast:192.168.37.255  Mask:255.255.255.0
          inet6 addr: fe80::c6c5:146c:f6c5:d9c3/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:6321 errors:0 dropped:0 overruns:0 frame:0
          TX packets:3262 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:9213870 (9.2 MB)  TX bytes:218983 (218.9 KB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:481 errors:0 dropped:0 overruns:0 frame:0
          TX packets:481 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:40010 (40.0 KB)  TX bytes:40010 (40.0 KB)

ovs-system Link encap:Ethernet  HWaddr 7a:1a:19:5d:6b:97  
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

vport1    Link encap:Ethernet  HWaddr 1a:9c:76:55:f1:8a  
          inet addr:10.10.10.100  Bcast:0.0.0.0  Mask:255.255.255.0
          BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```
```bash
sam@ubuntu:~$ sudo ifconfig vport1 up
```  
```bash
sam@ubuntu:~$ sudo ovs-vsctl add-port br-int vport1
sam@ubuntu:~$ 
sam@ubuntu:~$ 
sam@ubuntu:~$ 
sam@ubuntu:~$ sudo ovs-vsctl show
389b9d31-1859-4044-9a8d-a2884367f2a6
    Bridge br-int
        Port br-int
            Interface br-int
                type: internal
        Port "vport1"
            Interface "vport1"
    ovs_version: "2.5.2"
sam@ubuntu:~$ 
sam@ubuntu:~$ sudo ovs-vsctl del-port vport1
sam@ubuntu:~$ 
sam@ubuntu:~$ sudo ovs-vsctl show
389b9d31-1859-4044-9a8d-a2884367f2a6
    Bridge br-int
        Port br-int
            Interface br-int
                type: internal
    ovs_version: "2.5.2"
sam@ubuntu:~$ 
```