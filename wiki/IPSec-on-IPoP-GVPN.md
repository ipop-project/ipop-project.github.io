# Introduction  

This article describes how to deploy IPsec/Racoon on an LXC-Ubuntu/OpenWRT+IPOP device operating in L2-IPOP switch-mode. With IPoP running in recursive mode it is now possible to create certificates, and configure racoon with the OuterIPoP endpoints.The below link demonstrates how to setup IPoP in recursive mode.  
[IPoP in recursive mode](https://github.com/ipop-project/ipop-project.github.io/wiki/Running-IPoP-in-recursive-mode)   

  
## Installation and Configuration 
Default installation of racoon puts the configuration file under '/etc/' folder. To make it work on OpenWRT, you need to install the packages referred below. Below commands are for OpenWRT.

```bash
opkg update
opkg install ipsec-tools
opkg install kmod-ipsec4
```  
A reboot is required to insert the kernel modules.  
For Ubuntu it is straighforward--  
```bash
sudo apt-get install racoon ipsec-tools
```
## racoon.conf  
```bash
path pre_shared_key "/etc/racoon/psk.txt";
path certificate "/etc/racoon/certs";

listen
{   # public IP endpoint for self.
    isakmp 192.168.1.100 [500];
    isakmp_natt 192.168.1.100 [4500];
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
root@OpenWrt:/etc/racoon# cd /etc/racoon/certs/
root@OpenWrt:/etc/racoon/certs# ls
cert.pem    key.pem     rootCA.pem
root@OpenWrt:/etc/racoon/certs# 

```  


To do manual security-association management, the script below script can be used. The controller will otherwise automatically take care of it. 
```bash
#! /bin/bash
setkey -c << EOF
#flush ;
#spdflush ;
spdadd 192.168.1.0/16 192.168.1.0/16 any -P out ipsec esp/transport//require ;
spdadd 192.168.1.0/16 192.168.1.0/16 any -P in  ipsec esp/transport//require ;
EOF
```
Once the racoon daemon is running, you can use execute the script to add security associations. For "out" rule first field is local address range, followed by remote address range on which IPsec is to be enforced. For in the first field is remote followed by local. We use ESP-Transport mode. For Open-WRT replace "bash" by "sh" in the leading line. The above file should have permissions as shown below. 
```bash
-rwx--x--x    1 root     root           219 May 13 14:38 setkey.sh
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
2016-05-22 22:25:50: INFO: @(#)ipsec-tools 0.8.0 (http://ipsec-tools.sourceforge.net)
2016-05-22 22:25:50: INFO: @(#)This product linked OpenSSL 1.0.1f 6 Jan 2014 (http://www.openssl.org/)
2016-05-22 22:25:50: INFO: Reading configuration from "/etc/racoon/racoon.conf"
2016-05-22 22:25:50: INFO: 192.168.1.100[4500] used for NAT-T
2016-05-22 22:25:50: INFO: 192.168.1.100[4500] used as isakmp port (fd=7)
2016-05-22 22:25:50: INFO: 192.168.1.100[500] used for NAT-T
2016-05-22 22:25:50: INFO: 192.168.1.100[500] used as isakmp port (fd=8)
2016-05-22 22:26:14: INFO: unsupported PF_KEY message REGISTER
2016-05-22 22:26:15: INFO: IPsec-SA request for 192.168.1.101 queued due to no phase1 found.
2016-05-22 22:26:15: INFO: initiate new phase 1 negotiation: 192.168.1.100[500]<=>192.168.1.101[500]
2016-05-22 22:26:15: INFO: begin Identity Protection mode.
2016-05-22 22:26:15: INFO: received Vendor ID: RFC 3947
2016-05-22 22:26:15: INFO: received Vendor ID: DPD
2016-05-22 22:26:15: [192.168.1.101] INFO: Selected NAT-T version: RFC 3947
2016-05-22 22:26:15: [192.168.1.101] INFO: Hashing 192.168.1.101[500] with algo #2 
2016-05-22 22:26:15: [192.168.1.100] INFO: Hashing 192.168.1.100[500] with algo #2 
2016-05-22 22:26:15: INFO: Adding remote and local NAT-D payloads.
2016-05-22 22:26:15: [192.168.1.100] INFO: Hashing 192.168.1.100[500] with algo #2 
2016-05-22 22:26:15: INFO: NAT-D payload #0 verified
2016-05-22 22:26:15: [192.168.1.101] INFO: Hashing 192.168.1.101[500] with algo #2 
2016-05-22 22:26:15: INFO: NAT-D payload #1 verified
2016-05-22 22:26:15: INFO: NAT not detected 
2016-05-22 22:26:15: WARNING: unable to get certificate CRL(3) at depth:0 SubjectName:/C=US/ST=FLORIDA/L=GNV/O=IPOP/OU=IPOP/CN=192.168.1.101/emailAddress=IPOP
2016-05-22 22:26:15: WARNING: unable to get certificate CRL(3) at depth:1 SubjectName:/C=US/ST=FLORIDA/L=GNV/O=IPOP/OU=IPOP/CN=IPOP/emailAddress=IPOP
2016-05-22 22:26:15: INFO: ISAKMP-SA established 192.168.1.100[500]-192.168.1.101[500] spi:83b7f873874689f3:07c82b52e1d87598
2016-05-22 22:26:15: [192.168.1.101] INFO: received INITIAL-CONTACT
2016-05-22 22:26:16: INFO: initiate new phase 2 negotiation: 192.168.1.100[500]<=>192.168.1.101[500]
2016-05-22 22:26:21: INFO: respond new phase 2 negotiation: 192.168.1.100[500]<=>192.168.1.101[500]
2016-05-22 22:26:21: INFO: IPsec-SA established: ESP/Transport 192.168.1.100[500]->192.168.1.101[500] spi=89997279(0x55d3fdf)
2016-05-22 22:26:21: INFO: IPsec-SA established: ESP/Transport 192.168.1.100[500]->192.168.1.101[500] spi=184224019(0xafb0913)
2016-05-22 22:26:26: INFO: IPsec-SA established: ESP/Transport 192.168.1.100[500]->192.168.1.101[500] spi=148161029(0x8d4c205)
2016-05-22 22:26:26: INFO: IPsec-SA established: ESP/Transport 192.168.1.100[500]->192.168.1.101[500] spi=136970745(0x82a01f9)

```  
Note both the   "INFO: ISAKMP-SA established 192.168.1.100[500]-192.168.1.101[500] spi:83b7f873874689f3:07c82b52e1d87598" which denotes successful phase1 and "INFO: IPsec-SA established: ESP/Transport 192.168.1.100[500]->192.168.1.101[500] spi=89997279(0x55d3fdf)" phase2 stages respectively.
    
tcp-dump output when sending ICMP messages between client nodes as captured on the Linux node hosting LXC's.
```bash
sam@sam-T520:/etc/racoon$ sudo tcpdump -ni any -v esp
[sudo] password for sam: 
tcpdump: listening on any, link-type LINUX_SLL (Linux cooked), capture size 65535 bytes
22:46:49.928105 IP (tos 0x0, ttl 64, id 5830, offset 0, flags [DF], proto ESP (50), length 176)
    192.168.1.101 > 192.168.1.100: ESP(spi=0x08d4c205,seq=0x1924), length 156
22:46:49.928541 IP (tos 0x0, ttl 64, id 31553, offset 0, flags [DF], proto ESP (50), length 128)
    192.168.1.100 > 192.168.1.101: ESP(spi=0x082a01f9,seq=0x1924), length 108
22:46:49.928911 IP (tos 0x0, ttl 64, id 31554, offset 0, flags [DF], proto ESP (50), length 176)
    192.168.1.100 > 192.168.1.101: ESP(spi=0x082a01f9,seq=0x1925), length 156
22:46:49.930093 IP (tos 0x0, ttl 64, id 5831, offset 0, flags [DF], proto ESP (50), length 128)
    192.168.1.101 > 192.168.1.100: ESP(spi=0x08d4c205,seq=0x1925), length 108
22:46:49.961201 IP (tos 0x0, ttl 64, id 43815, offset 0, flags [DF], proto ESP (50), length 248)
    192.168.1.100 > 192.168.1.101: ESP(spi=0x082a01f9,seq=0x1926), length 228
22:46:49.962749 IP (tos 0x0, ttl 64, id 5832, offset 0, flags [DF], proto ESP (50), length 248)
    192.168.1.101 > 192.168.1.100: ESP(spi=0x08d4c205,seq=0x1926), length 228
22:46:50.408395 IP (tos 0x0, ttl 64, id 5833, offset 0, flags [DF], proto ESP (50), length 176)
    192.168.1.101 > 192.168.1.100: ESP(spi=0x08d4c205,seq=0x1927), length 156
22:46:50.408840 IP (tos 0x0, ttl 64, id 43858, offset 0, flags [DF], proto ESP (50), length 128)
    192.168.1.100 > 192.168.1.101: ESP(spi=0x082a01f9,seq=0x1927), length 108
22:46:50.409299 IP (tos 0x0, ttl 64, id 43859, offset 0, flags [DF], proto ESP (50), length 176)
    192.168.1.100 > 192.168.1.101: ESP(spi=0x082a01f9,seq=0x1928), length 156
22:46:50.410715 IP (tos 0x0, ttl 64, id 5834, offset 0, flags [DF], proto ESP (50), length 128)
    192.168.1.101 > 192.168.1.100: ESP(spi=0x08d4c205,seq=0x1928), length 108

```  
Check Security associations--  
```bash
sam@sam-T520:/etc/racoon$ sudo setkey -DP
192.168.1.0/16[any] 192.168.1.0/16[any] 255
	fwd prio def ipsec
	esp/transport//require
	created: May 22 22:26:14 2016  lastused:                     
	lifetime: 0(s) validtime: 0(s)
	spid=738 seq=1 pid=6763
	refcnt=1
192.168.1.0/16[any] 192.168.1.0/16[any] 255
	in prio def ipsec
	esp/transport//require
	created: May 22 22:26:14 2016  lastused: May 22 22:48:01 2016
	lifetime: 0(s) validtime: 0(s)
	spid=728 seq=2 pid=6763
	refcnt=9
192.168.1.0/16[any] 192.168.1.0/16[any] 255
	out prio def ipsec
	esp/transport//require
	created: May 22 22:26:14 2016  lastused: May 22 22:48:01 2016
	lifetime: 0(s) validtime: 0(s)
	spid=721 seq=3 pid=6763
	refcnt=10
(per-socket policy) 
	out(socket) none
	created: May 22 22:25:50 2016  lastused: May 22 22:26:26 2016
	lifetime: 0(s) validtime: 0(s)
	spid=716 seq=4 pid=6763
	refcnt=1
(per-socket policy) 
	in(socket) none
	created: May 22 22:25:50 2016  lastused: May 22 22:26:26 2016
	lifetime: 0(s) validtime: 0(s)
	spid=707 seq=5 pid=6763
	refcnt=1
(per-socket policy) 
	out(socket) none
	created: May 22 22:25:50 2016  lastused:                     
	lifetime: 0(s) validtime: 0(s)
	spid=700 seq=6 pid=6763
	refcnt=1
(per-socket policy) 
	in(socket) none
	created: May 22 22:25:50 2016  lastused:                     
	lifetime: 0(s) validtime: 0(s)
	spid=691 seq=0 pid=6763
	refcnt=1
sam@sam-T520:/etc/racoon$ 

```

##References:  
1. [Using the Racoon IKE/ISAKMP daemon](http://www.mad-hacking.net/documentation/linux/networking/ipsec/using-racoon-psk.xml)  

2. [Building a tunnelled VPN using ESP (static IPs, through NAT)](http://www.mad-hacking.net/documentation/linux/networking/ipsec/nat-vpn.xml)   
 
3. [Racoon.conf Man page](http://www.kame.net/racoon/racoon.conf.5)



