### Running GVPN Switchmode on Openwrt Routers
This documentation applies to generic Openwrt based routers, has been tested on AR71XX, X86 and CNS3XX based platforms. For a high level view of switch mode refer to the following link--  
[switch-mode](https://github.com/ipop-project/documentation/wiki/Switchmode-%28new%29)  

## Get dependency packages  
```bash  
 opkg update; opkg install python python-mini librt libstdcpp kmod-tun kmod-ipv6 libpthread wget python-pip 
``` 
If you have enough storage, one way is to have extFS on uSD card or USB drive, i would suggest installing the full python package. Also some times a reboot is required to bring kernel modules online.  
Next , you will have to install sleekxmpp  
```bash
pip install sleekxmpp
```  
In order for sleekxmpp to verify the identity of XMPP server using TLS you will have to set up SSL certificates, sleekxmpp tries to look for them in /etc/ssl/certs, you can follow the following link to set them up-  
[SSL and Certificates in wget](https://wiki.openwrt.org/doc/howto/wget-ssl-certs)    
However, it still does not create a ca-certificates.crt file, a quick work around is to copy the file from some other TRUSTED machine.

## Getting things started  

See building code section on wiki page to build the code for your platform, and download the latest controllers, if you have not done it yet (OR) You can use our IPK packages for AR71XX and Gateworks Laguna2388-4 board.  
Once you have the binary and controllers we can start with configuration,to begin with one has to ensure that the subnet in which router allocates addresses to the client and the IPOP subnet and address are in the same range. Also ensure that addresses allocated to clients do not conflict with others in the IPOP network.Below is a sample config file. 
Note that you need to specify "switchmode" . The steps shown below assume that the the installation has been carried out with the IPK packages  
```bash  
  opkg install <IPOP-Pkg>.ipk
```  
 In case you manually built and installed the software-be mindful of the directory structure. Basic commands to execute the setup  will stay the same.

```bash
root@OpenWrt:/etc/controllers/controller/modules# cat gvpn-config.json 
{
    "CFx": {
        "xmpp_username": "xxxx@dukgo.com",
        "xmpp_password": "xxxxx",
        "xmpp_host": "dukgo.com",
        "tincan_logging": 1,
        "vpn_type": "GroupVPN",
        "ip4_mask": 24,  
        "network_ignore_list": ["br-lan"],
        "stat_report": false
    },
        "Logger": {
        "controller_logging": "DEBUG"
    },
        "TincanSender": {
        "switchmode": 1,
        "dependencies": ["Logger"]
    },
        "BaseTopologyManager": {
        "ip4": "192.168.1.201",
        "sec": true,
        "multihop": false,
        "num_successors": 20,
        "num_chords": 0,
        "num_on_demand": 20,
        "num_inbound": 20,
        "ttl_link_initial": 60,
        "ttl_link_pulse": 30,
        "ttl_chord": 180,
        "ttl_on_demand": 60,
        "threshold_on_demand": 128,
        "timer_interval": 1,
        "interval_management": 15,
        "interval_central_visualizer": 5,
        "dependencies": ["Logger", "CentralVisualizer"]
    },
        "LinkManager": {
        "dependencies": ["Logger"]
    },
        "TincanDispatcher": {
        "dependencies": ["Logger"]
    },
        "TincanListener" : {
        "socket_read_wait_time": 15,
        "dependencies": ["Logger", "TincanDispatcher"]
    },
        "StatReport": {
        "stat_report": false,
        "stat_server": "metrics.ipop-project.org",
        "stat_server_port": 5000,
        "timer_interval": 200
    },
        "CentralVisualizer": {
        "central_visualizer": false,
        "central_visualizer_addr": "",
        "central_visualizer_port": 51234,
        "dependencies": ["Logger"]
    }
}

```  
  
 Go back to the "controllers" directory and start tin-can and controller.  
```bash
  root@OpenWrt:/etc/controllers# pwd
  /etc/controllers
  root@OpenWrt:/etc/controllers# ipop-tincan &> tin.log &
  root@OpenWrt:/etc/controllers# python -m controller.Controller -c controller/modules/gvpn-config.json &> log.txt &
```  
Now you should be able to see the below interface up, in a few seconds--  
```bash
ipop      Link encap:Ethernet  HWaddr 86:0B:CB:E6:04:0F  
          inet addr:192.168.1.201  Bcast:192.168.1.255  Mask:255.255.255.0
          inet6 addr: fe80::840b:cbff:fee6:40f/64 Scope:Link
          inet6 addr: fd50:dbc:41f2:4a3c:a0db:c314:a0f1:6d19/64 Scope:Global
          UP BROADCAST RUNNING MULTICAST  MTU:1280  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:7 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:500 
          RX bytes:0 (0.0 B)  TX bytes:698 (698.0 B)
```  

 Attach it to the bridged interface on your router.  
```python
root@OpenWrt:/etc/controllers/src# brctl show
bridge name	bridge id		STP enabled	interfaces
br-lan		7fff.00d01283f0dd	no		eth0
							wlan0
root@OpenWrt:/etc/controllers/src# brctl addif br-lan ipop
root@OpenWrt:/etc/controllers/src# brctl show
bridge name	bridge id		STP enabled	interfaces
br-lan		7fff.00d01283f0dd	no		eth0
							wlan0
							ipop
root@OpenWrt:/etc/controllers/src# 

``` 
Now your connections should be up and running in a few seconds.