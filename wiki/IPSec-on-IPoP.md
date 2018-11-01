# Introduction  

This article describes how to deploy IPsec using Racoon framework to add another layer of security in addition to DTLS encryption provided by IPoP. The setup described in this article needs two OVS bridges, one setup by IPoP by default and another one to serve as gateway for IPsec protected traffic. We leverage GRE encapsulation by creating GRE tunnels using IPoP addresses as endpoints and configure IPsec policies based on IPoP subnet range. This approach simplifies the process of setting up IPsec policies, a single policy can be used to cover all data traffic bridged to gateway switch .   
  
In the following article we go over the steps to create, configure and test this setup using two hosts and network namspaces emulating devices on each of them. In the first stage we create a GRE tunnel over IPoP and check the connectivity between network namespaces which are bridged to gateway switches on their respective hosts. Once we have verified connectivity between the namespaces over GRE we proceed with configuring IPSec.

  
## Installation and Configuration 
First step is to install and activate IPoP on the hosts. Once done, make sure that the hosts can connect with each other over IPoP overlay. The following steps detail the process of installing additional packages.  

```bash
# create gateway bridge
sudo ovs-vsctl add-br GRE-BR
# create a GRE tunnel with remote endpoint as IPoP address of the remote peer (192.168.1.121).
sudo ovs-vsctl add-port GRE-BR gre1 -- set interface gre1 type=gre options:remote_ip=192.168.1.121
# create a network namespace named D1
sudo ip netns add D1
# create a veth pair
sudo ip link add veth0 type veth peer name veth1
# assign one end of veth pair to namespace D1
sudo ip link set veth1 netns D1
# configure the veth endpoint in namespace D1 with a IP address
sudo ip netns exec D1 ifconfig veth1 10.10.10.100/24 up
# Bring up the veth interface in namespace UP
sudo ip netns exec D1 ip link set veth1 up
# Attach veth interface on host to gateway bridge
sudo ovs-vsctl add-port GRE-BR veth0
# Bring up the veth interface in host UP
sudo ip link set veth0 up
```    
Repeat similar process on the second host, assuming IPoP endpoint on the host is 192.168.1.121.  
```bash  
sudo ovs-vsctl add-br GRE-BR
sudo ovs-vsctl add-port GRE-BR gre1 -- set interface gre1 type=gre options:remote_ip=192.168.1.120
sudo ip netns add D2
sudo ip link add veth0 type veth peer name veth1
sudo ip link set veth1 netns D2
sudo ip netns exec D2 ifconfig veth1 10.10.10.101/24 up
sudo ip netns exec D2 ip link set veth1 up
sudo ovs-vsctl add-port GRE-BR veth0
sudo ip link set veth0 up
```   
Now verify connectivity between the network namespaces.  
```bash
sam@node-0:~$ sudo ip netns exec D1 ping 10.10.10.101
PING 10.10.10.101 (10.10.10.101) 56(84) bytes of data.
64 bytes from 10.10.10.101: icmp_seq=3 ttl=64 time=3.09 ms
64 bytes from 10.10.10.101: icmp_seq=4 ttl=64 time=2.43 ms
64 bytes from 10.10.10.101: icmp_seq=5 ttl=64 time=2.30 ms
64 bytes from 10.10.10.101: icmp_seq=6 ttl=64 time=2.33 ms
64 bytes from 10.10.10.101: icmp_seq=7 ttl=64 time=2.34 ms
64 bytes from 10.10.10.101: icmp_seq=8 ttl=64 time=2.29 ms
64 bytes from 10.10.10.101: icmp_seq=9 ttl=64 time=2.32 ms
```  
If this step is successful proceed with installation and configuration of Racoon framework on the hosts.  
```bash
sudo apt-get install racoon ipsec-tools
```  
Before proceeding further we will need to create keys and certificates for our hosts.  

## Creating certificates  
Root key  

```bash
 openssl genrsa -out rootCA.key 2048
```  
Root certificate  
```bash
openssl req -x509 -new -nodes -key rootCA.key -days 1024 -out rootCA.pem
```  
Once we have rootCA and rootCA-key, we can attest certificates for peers.  
create a private key for the peer.  
```bash
openssl genrsa -out key.pem 2048
```  
create a certificate signing request.  
```bash
openssl req -new -key key.pem -out device.csr
```    
Point to be noted-- The CN (Common Name) should be your public IP endpoint, or your DNS Hostname. 
The entity owning the rootCA can than service this request and create a signed certificate  
```bash
openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out cert.pem -days 500
```  
Now place the rootCA.pem, peer certificate and key in "/etc/racoon/certs", create the path if it does not exist. It must look like:
```bash
sam@node-0:/etc/racoon/certs$ ls
cert.pem  device.csr  key.pem  rootCA.pem
```   
Next step is to configure racoon by making changes to racoon.conf file found in /etc/racoon 

## racoon.conf   
On host-1 
```bash
path pre_shared_key "/etc/racoon/psk.txt";
path certificate "/etc/racoon/certs";

listen
{   # public IP endpoint for self.
    isakmp 192.168.1.120 [500];
    isakmp_natt 192.168.1.120 [4500];
}

remote anonymous {
        proposal {
                encryption_algorithm 3des;
                hash_algorithm sha1;
                authentication_method rsasig;
        dh_group modp1024;
        }
        certificate_type x509 "cert.pem" "key.pem";
        ca_type x509 "rootCA.pem" ;
        my_identifier asn1dn ;
        verify_identifier off;
        exchange_mode main;
        nat_traversal on;
}
sainfo anonymous {
     authentication_algorithm hmac_sha1;
     compression_algorithm deflate;
        pfs_group modp1024;
        encryption_algorithm 3des;
}
```  
On host-2  
```bash  
path pre_shared_key "/etc/racoon/psk.txt";
path certificate "/etc/racoon/certs";

listen
{   # public IP endpoint for self.
    isakmp 192.168.1.121 [500];
    isakmp_natt 192.168.1.121 [4500];
}

remote anonymous {
        proposal {
                encryption_algorithm 3des;
                hash_algorithm sha1;
                authentication_method rsasig;
        dh_group modp1024;
        }
        certificate_type x509 "cert.pem" "key.pem";
        ca_type x509 "rootCA.pem" ;
        my_identifier asn1dn ;
        verify_identifier off;
        exchange_mode main;
        nat_traversal on;
}
sainfo anonymous {
     authentication_algorithm hmac_sha1;
     compression_algorithm deflate;
        pfs_group modp1024;
        encryption_algorithm 3des;
}

```
To do manual security-association management, the script below script can be used. The controller will otherwise automatically take care of it. 
```bash
#! /bin/bash
setkey -c << EOF
#flush ;
#spdflush ;
spdadd 192.168.1.0/24 192.168.1.0/24 any -P out ipsec esp/transport//require ;
spdadd 192.168.1.0/24 192.168.1.0/24 any -P in  ipsec esp/transport//require ;
EOF
```
Once the racoon daemon is running, you can use execute the script to add security associations. For "out" rule first field is local address range, followed by remote address range on which IPsec is to be triggered. For "in" the first field is remote followed by local. We use ESP-Transport mode. The above file should have permissions as shown below. 
```bash
-rwxr-xr-x 1 root root             213 Oct 18 14:21 ipsec.sh
``` 
## Assumptions
IPsec racoon daemon is already running, ensure that no un-wanted security associations are active. This can be done on command line by using  

Start racoon in Foreground
```bash
 /usr/sbin/racoon -F
```
OR   
Start racoon in background.
```bash
sudo /etc/init.d/racoon start
```   
To check current security associations.  
```bash
 setkey -DP
```  
In case you made a mistake while setting up configuration, you can purge the policies by using  
```bash
echo "spdflush; flush;" | sudo setkey -c
```    
 The below IPsec logs depict successful set up of IPsec
```bash
sam@sam-T520:/etc/racoon$ sudo /usr/sbin/racoon -F
[sudo] password for sam: 
Foreground mode.
sam@node-0:~$ sudo /usr/sbin/racoon -F
Foreground mode.
2018-10-18 14:22:43: INFO: @(#)ipsec-tools 0.8.2 (http://ipsec-tools.sourceforge.net)
2018-10-18 14:22:43: INFO: @(#)This product linked OpenSSL 1.0.2n  7 Dec 2017 (http://www.openssl.org/)
2018-10-18 14:22:43: INFO: Reading configuration from "/etc/racoon/racoon.conf"
2018-10-18 14:22:43: INFO: 192.168.1.120[4500] used for NAT-T
2018-10-18 14:22:43: INFO: 192.168.1.120[4500] used as isakmp port (fd=7)
2018-10-18 14:22:43: INFO: 192.168.1.120[500] used for NAT-T
2018-10-18 14:22:43: INFO: 192.168.1.120[500] used as isakmp port (fd=8)
2018-10-18 14:25:02: INFO: unsupported PF_KEY message REGISTER
2018-10-18 14:26:33: INFO: IPsec-SA request for 192.168.1.121 queued due to no phase1 found.
2018-10-18 14:26:33: INFO: initiate new phase 1 negotiation: 192.168.1.120[500]<=>192.168.1.121[500]
2018-10-18 14:26:33: INFO: begin Identity Protection mode.
2018-10-18 14:26:33: INFO: received Vendor ID: RFC 3947
2018-10-18 14:26:33: INFO: received Vendor ID: DPD
2018-10-18 14:26:33: [192.168.1.121] INFO: Selected NAT-T version: RFC 3947
2018-10-18 14:26:33: [192.168.1.121] INFO: Hashing 192.168.1.121[500] with algo #2 
2018-10-18 14:26:33: [192.168.1.120] INFO: Hashing 192.168.1.120[500] with algo #2 
2018-10-18 14:26:33: INFO: Adding remote and local NAT-D payloads.
2018-10-18 14:26:33: [192.168.1.120] INFO: Hashing 192.168.1.120[500] with algo #2 
2018-10-18 14:26:33: INFO: NAT-D payload #0 verified
2018-10-18 14:26:33: [192.168.1.121] INFO: Hashing 192.168.1.121[500] with algo #2 
2018-10-18 14:26:33: INFO: NAT-D payload #1 verified
2018-10-18 14:26:33: INFO: NAT not detected 
2018-10-18 14:26:33: WARNING: unable to get certificate CRL(3) at depth:0 SubjectName:/C=US/ST=FL/L=GNV/O=Internet Widgits Pty Ltd/CN=192.168.1.121
2018-10-18 14:26:33: WARNING: unable to get certificate CRL(3) at depth:1 SubjectName:/C=US/ST=Florida/L=gainesville/O=IPOP/OU=IPOP/CN=IPOP
2018-10-18 14:26:33: INFO: ISAKMP-SA established 192.168.1.120[500]-192.168.1.121[500] spi:b0c0a9fc47480115:21942c95b1bbfdbe
2018-10-18 14:26:33: [192.168.1.121] INFO: received INITIAL-CONTACT
2018-10-18 14:26:34: INFO: initiate new phase 2 negotiation: 192.168.1.120[500]<=>192.168.1.121[500]
2018-10-18 14:26:34: INFO: IPsec-SA established: ESP/Transport 192.168.1.120[500]->192.168.1.121[500] spi=252339908(0xf0a66c4)
2018-10-18 14:26:34: INFO: IPsec-SA established: ESP/Transport 192.168.1.120[500]->192.168.1.121[500] spi=212878123(0xcb0432b)



```  
Note both the   "2018-10-18 14:26:34: INFO: IPsec-SA established: ESP/Transport 192.168.1.120[500]->192.168.1.121[500] spi=252339908(0xf0a66c4)" which denotes successful phase1 and "2018-10-18 14:26:34: INFO: IPsec-SA established: ESP/Transport 192.168.1.120[500]->192.168.1.121[500] spi=212878123(0xcb0432b)" phase2 stages respectively.
    
tcp-dump output when sending ICMP messages between network namespaces as captured on the Linux node hosting namespaces.
```bash
sam@node-1:~$ sudo tcpdump -ni any -v esp
tcpdump: listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
14:27:26.317303 IP (tos 0x0, ttl 64, id 2328, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x38), length 132
14:27:26.317303 IP (tos 0x0, ttl 64, id 2328, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x38), length 132
14:27:26.317462 IP (tos 0x0, ttl 64, id 21351, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.121 > 192.168.1.120: ESP(spi=0x0f0a66c4,seq=0x38), length 132
14:27:26.317467 IP (tos 0x0, ttl 64, id 21351, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.121 > 192.168.1.120: ESP(spi=0x0f0a66c4,seq=0x38), length 132
14:27:27.318861 IP (tos 0x0, ttl 64, id 2426, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x39), length 132
14:27:27.318861 IP (tos 0x0, ttl 64, id 2426, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x39), length 132
14:27:27.319004 IP (tos 0x0, ttl 64, id 21517, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.121 > 192.168.1.120: ESP(spi=0x0f0a66c4,seq=0x39), length 132
14:27:27.319010 IP (tos 0x0, ttl 64, id 21517, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.121 > 192.168.1.120: ESP(spi=0x0f0a66c4,seq=0x39), length 132
14:27:28.320513 IP (tos 0x0, ttl 64, id 2574, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x3a), length 132
14:27:28.320513 IP (tos 0x0, ttl 64, id 2574, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x3a), length 132
14:27:28.320652 IP (tos 0x0, ttl 64, id 21618, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.121 > 192.168.1.120: ESP(spi=0x0f0a66c4,seq=0x3a), length 132
14:27:28.320657 IP (tos 0x0, ttl 64, id 21618, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.121 > 192.168.1.120: ESP(spi=0x0f0a66c4,seq=0x3a), length 132
14:27:29.322088 IP (tos 0x0, ttl 64, id 2677, offset 0, flags [DF], proto ESP (50), length 152)
    192.168.1.120 > 192.168.1.121: ESP(spi=0x0cb0432b,seq=0x3b), length 132


```  
Check Security associations--  
```bash
sam@node-1:~$ sudo setkey -DP
192.168.1.0/24[any] 192.168.1.0/24[any] 255
	fwd prio def ipsec
	esp/transport//require
	created: Oct 18 14:25:10 2018  lastused:                     
	lifetime: 0(s) validtime: 0(s)
	spid=370 seq=1 pid=24623
	refcnt=1
192.168.1.0/24[any] 192.168.1.0/24[any] 255
	in prio def ipsec
	esp/transport//require
	created: Oct 18 14:25:10 2018  lastused: Oct 18 15:00:25 2018
	lifetime: 0(s) validtime: 0(s)
	spid=360 seq=2 pid=24623
	refcnt=1
192.168.1.0/24[any] 192.168.1.0/24[any] 255
	out prio def ipsec
	esp/transport//require
	created: Oct 18 14:25:10 2018  lastused: Oct 18 14:45:08 2018
	lifetime: 0(s) validtime: 0(s)
	spid=353 seq=3 pid=24623
	refcnt=4
(per-socket policy) 
	out(socket) none
	created: Oct 18 14:22:47 2018  lastused: Oct 18 14:26:34 2018
	lifetime: 0(s) validtime: 0(s)
	spid=348 seq=4 pid=24623
	refcnt=1
(per-socket policy) 
	in(socket) none
	created: Oct 18 14:22:47 2018  lastused: Oct 18 14:26:34 2018
	lifetime: 0(s) validtime: 0(s)
	spid=339 seq=5 pid=24623
	refcnt=1
(per-socket policy) 
	out(socket) none
	created: Oct 18 14:22:47 2018  lastused:                     
	lifetime: 0(s) validtime: 0(s)
	spid=332 seq=6 pid=24623
	refcnt=1

sam@sam-T520:/etc/racoon$ 

```

##References:  
1. [Using the Racoon IKE/ISAKMP daemon](http://www.mad-hacking.net/documentation/linux/networking/ipsec/using-racoon-psk.xml)  

2. [Building a tunnelled VPN using ESP (static IPs, through NAT)](http://www.mad-hacking.net/documentation/linux/networking/ipsec/nat-vpn.xml)   
 
3. [Racoon.conf Man page](http://www.kame.net/racoon/racoon.conf.5)



