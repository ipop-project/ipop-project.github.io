In switchmode, IPOP supports handling of layer-2 (L2) Ethernet frames. In this mode, IPOP nodes function as a switch and make all the connected IPOP nodes and associated virtual network interface be on the same Layer 2 network.
Note that IP and MAC address should be carefully assigned to avoid address conflicts.


# IPOP Switchmode Tutorial

The configuration of IPOP in L2/switchmode is to a large extent the same as the default L3 IPOP setup - so first, make sure you are able to run two IPOP nodes and ping each other in the default L3 configuration before trying out switchmode. [You can follow this tutorial as a starting point](https://github.com/ipop-project/ipop-project.github.io/wiki/Manual-Install-on-Linux), run two IPOP nodes on two VMs, and make sure they get connected. 

The main difference is that IPOP's configuration needs to enable switchmode, and the tap device should be bound to a bridge on the L2 segments that you plan to inter-connect.

To test IPOP with switchmode test, we recommend following the example below using LXC containers with ubuntu 14.04 or 15.04 - this is the easiest way to run containers in VM. But, since switchmode works with Linux bridge, it works with any other cloud solutions such as openstack, ec2. 

First, bring up a Ubuntu VM and install LXC in it:

```
sudo apt-get update
sudo apt-get install lxc
```

If this command:
```
sudo lxc-ls --fancy
```
emits an error, update packages with:

```
sudo apt-get upgrade
```
Then, create an LXC instance and clone it:
```
sudo lxc-create -t ubuntu -n c0
sudo lxc-clone c0 c1
sudo lxc-clone c0 c2
...
```

The following diagram illustrates an example where you'd repeat this process in two VMs: 

![](http://www.acis.ufl.edu/~xetron/ipop-project/switchmode0.png)


Then restart lxc network

Add below fields at controller config file. 
```
   "switchmode": 1
```
Run ipop-tincan and controller. 
Then, attach ipop tap device to lxcbr0 at both ends. 

```
sudo brctl addif lxcbr0 ipop
```

(OPTIONAL)If you need to change the IP address of lxcbr0, then modify below files and restart the network service
```
sudo vi /etc/default/lxc-net
sudo vi /etc/init/lxc-net.conf
sudo service lxc-net restart
```
If the lxcbr0 address does not update, reboot your machine. 

Make sure you run LXC containers on both VMs, and change their MTUs to 1280:
```
sudo lxc-attach --name c1
ifconfig eth0 mtu 1280
```

Check the IP addresses assigned to the eth0 interfaces of both containers (e.g. 10.0.3.5 and 10.0.3.7 in the diagram). After the IPOP tincan connection is established, you should be able to ping from 10.0.3.5 to ping 10.0.3.7.  

# Stand alone Switchmode 

Although switchmode was intended to bind to multiple virtual network interface of the guest machine, IPOP switchmode can also run by itself providing layer 2 virutal network environment to the host machine. 
By simply setting below fields, and run IPOP without attaching to the bridge.
```
   "switchmode": 1
```

# Switchmode under the hood

Unlike host mode, which maps IP address with TinCan link by controller. Switchmode maps MAC address to the TinCan link by the ARP traffic in the tap device. Conside a case when a node 10.0.3.5 sends packets to 10.0.3.4 of above figure. Host of 10.0.3.5 first broadcasts ARP message looking for 10.0.3.4. IPOP observe this broadcast frame(destination address ff:ff:ff:ff:ff:ff) then sends to every TInCan link it has. On receipient of the ARP message from the remote side, it updates MAC t able to associate the source MAC address to TinCan link it came from. Then, host 10.0.3.4 replies with ARP reply message, then it traverses (since the destination MAC address already link to its TinCan tunnel) back to the LAN of host 10.0.3.5. Then the source LAN also updates MAC table of this ARP reply message. 


