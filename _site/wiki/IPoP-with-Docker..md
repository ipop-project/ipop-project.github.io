Following the steps given below one would be able to run IPoP inside a docker container utilizing the containers network and process namespace. Provided docker image runs December 2018 release of IPoP in a Ubuntu 16.04 container.  
1. Create a IPv6 enabled docker network.  
```bash
sudo docker network create --ipv6 --driver=bridge --subnet=172.20.0.0/24 --subnet=2002:ac14:0000::/48 --gateway=172.20.0.1 my_ipv6_bridge
```  
ensure you do not have any IP conflicts while creating this network.
  
2. Create and run a docker container   
We are going to mount a directory on the host inside the container, so that the configuration file can stay on the host, also to enable us to view controller and tincan logs, log directory is also mounted on the host. In the example shown below configuration file on host is at the location "/home/osboxes/dockerfiles/ipop_overlay/configs" which is mounted inside the container. Make sure the configuration file is called "config.json". For logging to work properly directory for logging  in ipop config file is configured to be like below  
```bash
"Directory": "./logs/",
```  

```bash
sudo docker run -ti -d --privileged  -v /home/osboxes/dockerfiles/ipop_overlay/configs:/home/ipop-vpn/config --network my_ipv6_bridge saumitraaditya/ipop_release_dec18_ub16.04:1.2
```    
   
 
3. Either you can name the container in the previous command and use it for addressing the container or use docker ps to find its containerID  
```bash
osboxes@osboxes:~/dockerfiles$ docker ps -a
CONTAINER ID        IMAGE                                           COMMAND                  CREATED             STATUS                           PORTS               NAMES
dec5f3d214a1        saumitraaditya/ipop_release_dec18_ub16.04:1.0   "./overlay.sh"           43 minutes ago      Up 43 minutes                                        condescending_khayyam
```  
Here the containerID for desired container is dec5f3d214a1.    

4. Next we launch a shell inside the container to verify its working.  
```bash
osboxes@osboxes:~/dockerfiles$ docker exec -it dec5f3d214a1 /bin/bash
root@dec5f3d214a1:~# ifconfig -a
eth0      Link encap:Ethernet  HWaddr 02:42:ac:14:00:03  
          inet addr:172.20.0.3  Bcast:172.20.0.255  Mask:255.255.255.0
          inet6 addr: fe80::42:acff:fe14:3/64 Scope:Link
          inet6 addr: 2002:ac14::3/48 Scope:Global
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:12691 errors:0 dropped:0 overruns:0 frame:0
          TX packets:12789 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:1556595 (1.5 MB)  TX bytes:1545971 (1.5 MB)

ipop062d95e Link encap:Ethernet  HWaddr c2:18:2a:c5:e9:d3  
          UP BROADCAST RUNNING MULTICAST  MTU:1410  Metric:1
          RX packets:2785 errors:0 dropped:0 overruns:0 frame:0
          TX packets:2761 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:167414 (167.4 KB)  TX bytes:207399 (207.3 KB)

ipop1806d56 Link encap:Ethernet  HWaddr 1e:39:86:18:d5:6d  
          UP BROADCAST RUNNING MULTICAST  MTU:1410  Metric:1
          RX packets:1368 errors:0 dropped:0 overruns:0 frame:0
          TX packets:1370 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:30556 (30.5 KB)  TX bytes:71605 (71.6 KB)

ipopbr0   Link encap:Ethernet  HWaddr 1e:39:86:18:d5:6d  
          inet addr:10.245.0.1  Bcast:0.0.0.0  Mask:255.255.0.0
          UP BROADCAST RUNNING MULTICAST  MTU:1410  Metric:1
          RX packets:1376 errors:0 dropped:0 overruns:0 frame:0
          TX packets:1370 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:116150 (116.1 KB)  TX bytes:134431 (134.4 KB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:259 errors:0 dropped:0 overruns:0 frame:0
          TX packets:259 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:719560 (719.5 KB)  TX bytes:719560 (719.5 KB)

root@dec5f3d214a1:~# ping 10.245.1.1
PING 10.245.1.1 (10.245.1.1) 56(84) bytes of data.
64 bytes from 10.245.1.1: icmp_seq=1 ttl=64 time=1.62 ms
64 bytes from 10.245.1.1: icmp_seq=2 ttl=64 time=1.69 ms
^C
--- 10.245.1.1 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 1.629/1.662/1.696/0.052 ms
root@dec5f3d214a1:~# 
```    

5. Logs from tincan and controller can be checked on host, by locating the volume location for the container  
```bash
docker inspect dec5f3d214a1 `  
from the output the relevant snippet is as below  
`{
                "Type": "volume",
                "Name": "d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3",
                "Source": "/var/lib/docker/volumes/d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3/_data",
                "Destination": "/home/ipop-vpn/logs",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
``` 
On the host we will find the logs at the locations "/var/lib/docker/volumes/d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3/_data" like below   
```bash
osboxes@osboxes:~/dockerfiles$ sudo su -
root@osboxes:~# cd /var/lib/docker/volumes/d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3/_data
root@osboxes:/var/lib/docker/volumes/d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3/_data# ls
ctrl.log  tincan_log_0
root@osboxes:/var/lib/docker/volumes/d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3/_data# ls -ltr
total 2996
-rw-r--r-- 1 root root 1042144 Mar 13 16:38 ctrl.log
-rw-r--r-- 1 root root 2019328 Mar 13 16:39 tincan_log_0
root@osboxes:/var/lib/docker/volumes/d70d94be69367a230c9751b56c0a4a103d92f217856cec98551ad42f54a553d3/_data# 
```
