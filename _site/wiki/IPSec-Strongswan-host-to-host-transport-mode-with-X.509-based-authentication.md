# Introduction  

This article describes how to deploy IPsec using Strongswan framework to add another layer of security in addition to DTLS encryption provided by IPoP. The setup described in this article needs two OVS bridges, one setup by IPoP by default and another one to serve as gateway for IPsec protected traffic. We leverage GRE encapsulation by creating GRE tunnels using IPoP addresses as endpoints and configure IPsec policies based on IPoP subnet range. This approach simplifies the process of setting up IPsec policies, a single policy can be used to cover all data traffic bridged to gateway switch .   
  
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
If this step is successful proceed with installation and configuration of Strongswan framework on the hosts.  
```bash
sudo apt-get install strongswan -y  
sudo apt-get install strongswan-swanctl  
sudo apt-get install strongswan-pki
```  
Before proceeding further we will need to create keys and certificates for our hosts.  

## Creating CA key and certificate  

```bash
root@node-0:/etc/ipsec.d# ipsec pki --gen --type rsa --size 4096 --outform pem > private/strongswanKey.pem   
root@node-0:/etc/ipsec.d# ipsec pki --self --ca --lifetime 3650 --in private/strongswanKey.pem --type rsa --dn "C=CH, O=strongSwan, CN=Root CA" --outform pem > cacerts/strongswanCert.pem
```    
## Create private key for Host-1
```bash
root@node-0:/etc/ipsec.d# ipsec pki --gen --type rsa --size 2048 --outform pem > private/client1Key.pem
```  
## Generate the certificate for Host-1 and get it attested by CA  
```bash
root@node-0:/etc/ipsec.d# ipsec pki --pub --in private/client1Key.pem --type rsa | ipsec pki --issue --lifetime 730 --cacert cacerts/strongswanCert.pem --cakey private/strongswanKey.pem --dn "C=CH, O=strongSwan, CN=192.168.1.120" --san 192.168.1.120 --flag serverAuth --flag ikeIntermediate --outform pem > certs/client1Cert.pem
```  
repeat similar steps for generating key and certificates for other hosts, point to note here is that the common name and alternate name must either be the IP address or DNS name of the host, in this case we used IPOP IP 192.168.1.120 as the common and alternate name. Keys, Certificates can be generated on the same machine that houses the RootCA key. Subsequently rootCACert, host private key and certificate can be distributed to respective hosts. 

Once we have rootCAcert, private key and public cert in the correct folders as can be seen in the code snip above we can proceed by specifying the same in ipsec.secrets file as shown below.  
```bash
root@node-0:/etc# cat ipsec.secrets
# This file holds shared secrets or RSA private keys for authentication.

# RSA private key for this host, authenticating it to any other host
# which knows the public part.
: RSA client1Key.pem
root@node-0:/etc#
```  
    

Next step is to configure Strongswan by making changes to ipsec.conf file found in /etc
## ipsec.conf   
Same configuration on all the hosts except leftcert and leftid fields will have to be modified to point to the cert file and the common name of the respective host. 
```bash
root@node-0:/etc# cat ipsec.conf
conn %default
        keyingtries=1
        keyexchange=ikev2

conn host-to-host
        ikelifetime=60m
        keylife=20m
        rekeymargin=3m
        keyingtries=1

conn trap-any
        also=host-to-host
        right=%any
        leftsubnet=192.168.1.0/24
        rightsubnet=192.168.1.0/24
        type=transport
        leftcert=client1Cert.pem
        leftid="C=CH, O=strongSwan, CN=192.168.1.120"
        auto=route
```  
  

Restart Ipsec and check the status. 
```bash
root@node-0:~# ipsec restart
Stopping strongSwan IPsec...
Starting strongSwan 5.6.2 IPsec [starter]...
root@node-0:~# 
root@node-0:/etc# ipsec statusall
Status of IKE charon daemon (strongSwan 5.6.2, Linux 4.15.0-39-generic, x86_64):
  uptime: 10 seconds, since Jan 03 20:35:28 2019
  malloc: sbrk 1613824, mmap 0, used 519632, free 1094192
  worker threads: 11 of 16 idle, 5/0/0/0 working, job queue: 0/0/0/0, scheduled: 0
  loaded plugins: charon aesni aes rc2 sha2 sha1 md4 md5 mgf1 random nonce x509 revocation constraints pubkey pkcs1 pkcs7 pkcs8 pkcs12 pgp dnskey sshkey pem openssl fips-prf gmp agent xcbc hmac gcm attr kernel-netlink resolve socket-default connmark stroke vici updown eap-mschapv2 xauth-generic counters
Listening IP addresses:
  172.16.251.1
  192.168.1.120
Connections:
    trap-any:  %any...%any  IKEv2
    trap-any:   local:  [C=CH, O=strongSwan, CN=192.168.1.120] uses public key authentication
    trap-any:    cert:  "C=CH, O=strongSwan, CN=192.168.1.120"
    trap-any:   remote: uses public key authentication
    trap-any:   child:  192.168.1.0/24 === 192.168.1.0/24 TRANSPORT
Routed Connections:
    trap-any{1}:  ROUTED, TRANSPORT, reqid 1
    trap-any{1}:   192.168.1.0/24 === 192.168.1.0/24
Security Associations (0 up, 0 connecting):
  none
root@node-0:/etc#
```

As visible in logs above their are no active associations, however we can see that the configuration changes made through the files have been picked up.  
After repeating the same step on all hosts, try sending a ICMP echo request again and check the status again.  
```bash
root@node-0:/etc# sudo ip netns exec D1 ping 10.10.10.101
PING 10.10.10.101 (10.10.10.101) 56(84) bytes of data.
64 bytes from 10.10.10.101: icmp_seq=1 ttl=64 time=5.38 ms
64 bytes from 10.10.10.101: icmp_seq=2 ttl=64 time=2.21 ms
64 bytes from 10.10.10.101: icmp_seq=3 ttl=64 time=2.10 ms
64 bytes from 10.10.10.101: icmp_seq=4 ttl=64 time=2.04 ms
^C
--- 10.10.10.101 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 2.047/2.937/5.388/1.417 ms
root@node-0:/etc# 

root@node-0:/etc# ipsec statusall
Status of IKE charon daemon (strongSwan 5.6.2, Linux 4.15.0-39-generic, x86_64):
  uptime: 64 minutes, since Jan 03 20:35:27 2019
  malloc: sbrk 2695168, mmap 0, used 784128, free 1911040
  worker threads: 11 of 16 idle, 5/0/0/0 working, job queue: 0/0/0/0, scheduled: 3
  loaded plugins: charon aesni aes rc2 sha2 sha1 md4 md5 mgf1 random nonce x509 revocation constraints pubkey pkcs1 pkcs7 pkcs8 pkcs12 pgp dnskey sshkey pem openssl fips-prf gmp agent xcbc hmac gcm attr kernel-netlink resolve socket-default connmark stroke vici updown eap-mschapv2 xauth-generic counters
Listening IP addresses:
  172.16.251.1
  192.168.1.120
Connections:
    trap-any:  %any...%any  IKEv2
    trap-any:   local:  [C=CH, O=strongSwan, CN=192.168.1.120] uses public key authentication
    trap-any:    cert:  "C=CH, O=strongSwan, CN=192.168.1.120"
    trap-any:   remote: uses public key authentication
    trap-any:   child:  192.168.1.0/24 === 192.168.1.0/24 TRANSPORT
Routed Connections:
    trap-any{1}:  ROUTED, TRANSPORT, reqid 1
    trap-any{1}:   192.168.1.0/24 === 192.168.1.0/24
Security Associations (1 up, 0 connecting):
    trap-any[2]: ESTABLISHED 12 minutes ago, 192.168.1.120[C=CH, O=strongSwan, CN=192.168.1.120]...192.168.1.121[C=CH, O=strongSwan, CN=192.168.1.121]
    trap-any[2]: IKEv2 SPIs: 4e844bcea06af37c_i* 380b1a276f4e4270_r, public key reauthentication in 39 minutes
    trap-any[2]: IKE proposal: AES_CBC_128/HMAC_SHA2_256_128/PRF_AES128_XCBC/ECP_256
    trap-any{6}:  INSTALLED, TRANSPORT, reqid 1, ESP SPIs: cf3e6d65_i ccbce565_o
    trap-any{6}:  AES_CBC_128/HMAC_SHA2_256_128, 574 bytes_i (7 pkts, 32s ago), 500 bytes_o (6 pkts, 32s ago), rekeying in 107 seconds
    trap-any{6}:   192.168.1.120/32 === 192.168.1.121/32
root@node-0:/etc# 
```  
Now we can see that the security association is up and active, the process gets triggered when a connection is set up.  
We can verify that ipsec ESP mode is active by using tcpdump  
```bash
sam@node-1:~$ sudo tcpdump -i any -v esp
tcpdump: listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
21:40:57.578499 IP (tos 0x0, ttl 64, id 24042, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xccbce565,seq=0x7), length 152
21:40:57.578982 IP (tos 0x0, ttl 64, id 24042, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xccbce565,seq=0x7), length 152
21:40:57.580040 IP (tos 0x0, ttl 64, id 59734, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcf3e6d65,seq=0x8), length 152
21:40:57.580396 IP (tos 0x0, ttl 64, id 59734, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcf3e6d65,seq=0x8), length 152
21:40:58.579856 IP (tos 0x0, ttl 64, id 24160, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xccbce565,seq=0x8), length 152
21:40:58.579856 IP (tos 0x0, ttl 64, id 24160, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xccbce565,seq=0x8), length 152
21:40:58.580017 IP (tos 0x0, ttl 64, id 59881, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcf3e6d65,seq=0x9), length 152
21:40:58.580022 IP (tos 0x0, ttl 64, id 59881, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcf3e6d65,seq=0x9), length 152
21:40:59.581648 IP (tos 0x0, ttl 64, id 24241, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xccbce565,seq=0x9), length 152
21:40:59.581648 IP (tos 0x0, ttl 64, id 24241, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xccbce565,seq=0x9), length 152
21:40:59.581781 IP (tos 0x0, ttl 64, id 59918, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcf3e6d65,seq=0xa), length 152
```


## References  
1. [Strongswan documentation](https://wiki.strongswan.org/projects/strongswan/wiki/UsableExamples)  

2. [Setting up site to site strongswan on Ubuntu](https://sysadmins.co.za/setup-a-site-to-site-ipsec-vpn-with-strongswan-on-ubuntu/)   
 
3. [Strongswan host to host sample config files](https://www.strongswan.org/testing/testresults/ikev2/trap-any/)  
  
4. [Understanding IPSec tunnel and transport mode](http://www.firewall.cx/networking-topics/protocols/870-ipsec-modes.html)  

5. [Some more ipsec configuration](https://wiki.strongswan.org/projects/strongswan/wiki/Ipsecconf)  

6. [IPSec CA](https://wiki.strongswan.org/projects/strongswan/wiki/SimpleCA)  

7. [IPSec VPN using certificates](https://www.howtoforge.com/tutorial/strongswan-based-ipsec-vpn-using-certificates-and-pre-shared-key-on-ubuntu-16-04/)



