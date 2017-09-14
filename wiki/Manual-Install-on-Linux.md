# Manually Installing IPOP-VPN  
  
### Get IPOP-VPN  
Download the appropriate IPOP-VPN package for your distribution, from the [downloads repository](https://github.com/ipop-project/downloads/releases). The current version is 16.08.0.
### Ubuntu  
```  
sudo apt-get install python-pip
sudo pip install sleekxmpp
wget https://github.com/ipop-project/Downloads/releases/download/v16.08.0/ipop-v16.08.0_ubuntu.tar.gz  
tar xf ipop-v16.08.0_ubuntu.tar.gz  
```  
### CentOS  
```  
sudo yum -y install python-pip  
sudo pip install sleekxmpp  
wget https://github.com/ipop-project/Downloads/releases/download/v16.08.0/ipop-v16.08.0_ubuntu.tar.gz  
tar xf ipop-v16.08.0_centos7.tar.gz  
```  
## Configuring IPOP-VPN  
Configure your controller according to the type of overlay VPN you want to run. See the [[Planning your network]] page for more information.If you have not yet set up your XMPP account you can get some pointers on doing it from [[Installation of pidgin  and creation of account on XMPP server at dukgo.com]]  page. You can either use any of the public XMPP servers or If you are feeling adventurous you can set up your own [[Deploying XMPP STUN TURN Services]]  

### Configure for GroupVPN:  
Create a configuration file for GroupVPN  
```
cp config/sample-gvpn-config.json config/gvpn-config.json  
```  
Update `config/gvpn-config.json` according to your needs. The `ip4`, `xmpp_username`, `xmpp_password`, and `xmpp_host` flags are required; GroupVPN currently supports static IPv4 address assignment and thus `ip4` should be different for each machine. See the [configuration page](https://github.com/ipop-project/ipop-project.github.io/wiki/Configuration) for more information about the configuration options available for GroupVPN.  
```nano config/gvpn-config.json```
```
XmppClient": {
    "enabled": true,
    "xmpp_username": "xyz@dukgo.com",
    "xmpp_password": "xyz",
    "xmpp_host": "dukgo.com",
    "xmpp_port": 5222,
    "xmpp_authentication_method": "password",
    "xmpp_accept_untrusted_server": false,
    "truststore": "/etc/ssl/certs/ca-certificates.crt",
    "timer_interval": 15,
    "dependencies": ["Logger"]
  }
```  
```
CFx": {
    "tincan_logging": 2,
    "vpn_type": "GroupVPN",
    "ip4": "172.31.0.100",
```  
### Configure for SocialVPN:  
Create a configuration file for SocialVPN  
```  
cp config/sample-svpn-config.json config/svpn-config.json  
```  
Update `config/svpn-config.json` according to your needs. The `xmpp_username`, `xmpp_password`, and `xmpp_host` flags are required; SocialVPN currently **doesn't** support static IPv4 address assignment (the IPv4 address here will not be used for actual communication). Please assign every machine the same `ip4` address as a baseline (e.g 172.31.0.100 for everyone) so that a unique address based on this baseline will be assigned to the machine for actual communication. For example, everyone itself is 172.31.0.**100**, then its first peer will be 172.31.0.**101**; the second peer will be 172.31.0.**102**; so on so forth... 
See the [configuration page](Configuration) for more information about the configuration options available for SocialVPN.  
``` 
nano config/svpn-config.json  
```
```  
XmppClient": {
    "enabled": true,
    "xmpp_username": "xyz@dukgo.com",
    "xmpp_password": "xyz",
    "xmpp_host": "dukgo.com",
    "xmpp_port": 5222,
    "xmpp_authentication_method": "password",
    "xmpp_accept_untrusted_server": false,
    "truststore": "/etc/ssl/certs/ca-certificates.crt",
    "timer_interval": 15,
    "dependencies": ["Logger"]
  }
```  
## Running IPOP-VPN  
Launch the ipop-tincan program  
```
sudo sh -c './ipop-tincan &> tin.log &'
```
Run the controller using the appropriate configuration, paths are relative (based on python2).  
```  
cd controllers
python -m controller.Controller -c ../config/gvpn-config.json &> ctl.log &  
```  
OR  
```  
python -m controller.Controller -c ../config/svpn-config.json &> ctl.log &  
```  
Check the network devices and IPv4 address for your device  
```  
ifconfig ipop  
```  
Check on the current status of your network using netcat, works till release 16.01.1  
```  
echo -e '\x02\x01{"m":"get_state"}' | netcat -q 1 -u 127.0.0.1 5800  
```  
Run IPOP-VPN on another machine -- you can use the same credentials -- and they will connect to each other.  
##Terminate IPOP-VPN  
```  
sudo killall ipop-tincan  
ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9 
```

