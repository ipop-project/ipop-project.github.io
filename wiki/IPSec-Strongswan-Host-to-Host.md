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
```  
Before proceeding further we will need to create keys and certificates for our hosts.  

## Creating pre-shared key  

```bash
sam@node-0:/etc/swanctl$ openssl rand -base64 64
ouAKCbLHzkOrVQs+raneWwaxaMW7T+0jpdYfmv7uAFiPaomCa8XnUQ2rqLQBRcPA
1m+l1dEfb+gXyTR/vAE1qg==
```  

Once we have pre-shared key it should be installed (just paste the key like below) on all the hosts.  
```bash
sam@node-0:/etc$ sudo cat ipsec.secrets 
# This file holds shared secrets or RSA private keys for authentication.

# RSA private key for this host, authenticating it to any other host
# which knows the public part.
: PSK ouAKCbLHzkOrVQs+raneWwaxaMW7T+0jpdYfmv7uAFiPaomCa8XnUQ2rqLQBRcPA1m+l1dEfb+gXyTR/vAE1qg==
sam@node-0:/etc$
```    

Next step is to configure Strongswan by making changes to ipsec.conf file found in /etc and swanctl.conf in /etc/swanctl

## ipsec.conf   
Same configuration on all the hosts. 
```bash
sam@node-0:/etc$ sudo cat ipsec.conf
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
    authby=psk
    auto=route
```  
  
## swanctl.conf     
Identical file on all hosts.  
 
```bash
  sam@node-0:/etc$ sudo cat swanctl/swanctl.conf 
connections {
    trap-any {
        remote_addrs = %any
        local {
            auth = psk
        }
        remote {
            auth = psk
        }

        children {
            trap-yn {
                remote_ts = 192.168.1.0/24
                local_ts = 192.168.1.0/24
                mode = transport
                start_action = trap
            }
        }
    }
}
sam@node-0:/etc$ 


``` 
Restart Ipsec and check the status. 
```bash
sam@node-0:/etc$ sudo ipsec restart
Stopping strongSwan IPsec...
Starting strongSwan 5.6.2 IPsec [starter]...
sam@node-0:/etc$ sudo systemctl status strongswan
● strongswan.service - strongSwan IPsec IKEv1/IKEv2 daemon using ipsec.conf
   Loaded: loaded (/lib/systemd/system/strongswan.service; enabled; vendor preset: enabled)
   Active: inactive (dead) since Wed 2019-01-02 10:14:33 EST; 20s ago
  Process: 22099 ExecStart=/usr/sbin/ipsec start --nofork (code=exited, status=0/SUCCESS)
 Main PID: 22099 (code=exited, status=0/SUCCESS)

Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: 00[CFG] loading crls from '/etc/ipsec.d/crls'
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: 00[CFG] loading secrets from '/etc/ipsec.secrets'
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: 00[LIB] loaded plugins: charon aesni aes rc2 sha2 sha1 md4 md5 mgf1 random nonce x509 revocation constraints pubkey pkcs1 p
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: 00[LIB] dropped capabilities, running as uid 0, gid 0
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: 00[JOB] spawning 16 worker threads
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: 00[DMN] signal of type SIGINT received. Shutting down
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: charon stopped after 200 ms
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec[22099]: ipsec starter stopped
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec_starter[22099]: charon stopped after 200 ms
Jan 02 10:14:33 node-0.saumitraaditya.ipop-pg0.clemson.cloudlab.us ipsec_starter[22099]: ipsec starter stopped

```

Check status of IPsec association  
```bash
sam@node-0:/etc$ sudo ipsec statusall
Status of IKE charon daemon (strongSwan 5.6.2, Linux 4.15.0-39-generic, x86_64):
  uptime: 2 minutes, since Jan 02 10:14:36 2019
  malloc: sbrk 1744896, mmap 0, used 504064, free 1240832
  worker threads: 11 of 16 idle, 5/0/0/0 working, job queue: 0/0/0/0, scheduled: 0
  loaded plugins: charon aesni aes rc2 sha2 sha1 md4 md5 mgf1 random nonce x509 revocation constraints pubkey pkcs1 pkcs7 pkcs8 pkcs12 pgp dnskey sshkey pem openssl fips-prf gmp agent xcbc hmac gcm attr kernel-netlink resolve socket-default connmark stroke vici updown eap-mschapv2 xauth-generic counters
Listening IP addresses:
  172.17.74.1
  192.168.1.120
Connections:
    trap-any:  %any...%any  IKEv1/2
    trap-any:   local:  uses pre-shared key authentication
    trap-any:   remote: uses pre-shared key authentication
    trap-any:   child:  192.168.1.0/24 === 192.168.1.0/24 TRANSPORT
Routed Connections:
    trap-any{1}:  ROUTED, TRANSPORT, reqid 1
    trap-any{1}:   192.168.1.0/24 === 192.168.1.0/24
Security Associations (0 up, 0 connecting):
  none
```  
As visible in logs above their are no active associations, however we can see that the configuration changes made through the files have been picked up.  
After repeating the same step on all hosts, try sending a ICMP echo request again and check the status again.  
```bash
sam@node-0:/etc$ sudo ip netns exec D1 ping 10.10.10.101
PING 10.10.10.101 (10.10.10.101) 56(84) bytes of data.
64 bytes from 10.10.10.101: icmp_seq=2 ttl=64 time=1.72 ms
64 bytes from 10.10.10.101: icmp_seq=3 ttl=64 time=1.10 ms
64 bytes from 10.10.10.101: icmp_seq=4 ttl=64 time=1.12 ms
64 bytes from 10.10.10.101: icmp_seq=5 ttl=64 time=1.07 ms
64 bytes from 10.10.10.101: icmp_seq=6 ttl=64 time=1.07 ms
64 bytes from 10.10.10.101: icmp_seq=7 ttl=64 time=1.09 ms
64 bytes from 10.10.10.101: icmp_seq=8 ttl=64 time=1.08 ms
64 bytes from 10.10.10.101: icmp_seq=9 ttl=64 time=1.07 ms
64 bytes from 10.10.10.101: icmp_seq=10 ttl=64 time=1.06 ms
64 bytes from 10.10.10.101: icmp_seq=11 ttl=64 time=1.12 ms
64 bytes from 10.10.10.101: icmp_seq=12 ttl=64 time=1.08 ms
^C
--- 10.10.10.101 ping statistics ---
12 packets transmitted, 11 received, 8% packet loss, time 11033ms
rtt min/avg/max/mdev = 1.060/1.148/1.722/0.186 ms
sam@node-0:/etc$ sudo ipsec statusall
Status of IKE charon daemon (strongSwan 5.6.2, Linux 4.15.0-39-generic, x86_64):
  uptime: 2 minutes, since Jan 02 10:14:36 2019
  malloc: sbrk 2285568, mmap 0, used 586528, free 1699040
  worker threads: 11 of 16 idle, 5/0/0/0 working, job queue: 0/0/0/0, scheduled: 3
  loaded plugins: charon aesni aes rc2 sha2 sha1 md4 md5 mgf1 random nonce x509 revocation constraints pubkey pkcs1 pkcs7 pkcs8 pkcs12 pgp dnskey sshkey pem openssl fips-prf gmp agent xcbc hmac gcm attr kernel-netlink resolve socket-default connmark stroke vici updown eap-mschapv2 xauth-generic counters
Listening IP addresses:
  172.17.74.1
  192.168.1.120
Connections:
    trap-any:  %any...%any  IKEv1/2
    trap-any:   local:  uses pre-shared key authentication
    trap-any:   remote: uses pre-shared key authentication
    trap-any:   child:  192.168.1.0/24 === 192.168.1.0/24 TRANSPORT
Routed Connections:
    trap-any{1}:  ROUTED, TRANSPORT, reqid 1
    trap-any{1}:   192.168.1.0/24 === 192.168.1.0/24
Security Associations (1 up, 0 connecting):
    trap-any[1]: ESTABLISHED 13 seconds ago, 192.168.1.120[192.168.1.120]...192.168.1.121[192.168.1.121]
    trap-any[1]: IKEv2 SPIs: f34b6d34b3d5865a_i* 1e0b571581dbec85_r, pre-shared key reauthentication in 52 minutes
    trap-any[1]: IKE proposal: AES_CBC_128/HMAC_SHA2_256_128/PRF_AES128_XCBC/ECP_256
    trap-any{2}:  INSTALLED, TRANSPORT, reqid 1, ESP SPIs: cd870f9f_i c53fb053_o
    trap-any{2}:  AES_CBC_128/HMAC_SHA2_256_128, 1214 bytes_i (13 pkts, 3s ago), 1214 bytes_o (13 pkts, 8s ago), rekeying in 13 minutes
    trap-any{2}:   192.168.1.120/32 === 192.168.1.121/32
sam@node-0:/etc$ sudo ipsec statusall

```  
Now we can see that the security association is up and active, the process gets triggered when a connection is set up.  
We can verify that ipsec ESP mode is active by using tcpdump  
```bash
sam@node-1:/etc$ sudo tcpdump -i any -v esp
tcpdump: listening on any, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
10:29:18.080544 IP (tos 0x0, ttl 64, id 58233, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xc53fb053,seq=0xf), length 152
10:29:18.080800 IP (tos 0x0, ttl 64, id 58233, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.120 > 192.168.1.121: ESP(spi=0xc53fb053,seq=0xf), length 152
10:29:18.081231 IP (tos 0x0, ttl 64, id 30788, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcd870f9f,seq=0xe), length 152
10:29:18.081388 IP (tos 0x0, ttl 64, id 30788, offset 0, flags [DF], proto ESP (50), length 172)
    192.168.1.121 > 192.168.1.120: ESP(spi=0xcd870f9f,seq=0xe), length 152
```


## References  
1. [Strongswan documentation](https://wiki.strongswan.org/projects/strongswan/wiki/UsableExamples)  

2. [Setting up site to site strongswan on Ubuntu](https://sysadmins.co.za/setup-a-site-to-site-ipsec-vpn-with-strongswan-on-ubuntu/)   
 
3. [Strongswan host to host sample config files](https://www.strongswan.org/testing/testresults/ikev2/trap-any/)  
  
4. [Understanding IPSec tunnel and transport mode](http://www.firewall.cx/networking-topics/protocols/870-ipsec-modes.html)



