The following instructions are for Ubuntu 12.04/Debian Wheezy (64-bit) or higher. Visit the [downloads repository](https://github.com/ipop-project/downloads/releases) to obtain IPOP builds for additional platforms.

### Obtaining SocialVPN

1. Download GroupVPN from the [downloads repository](https://github.com/ipop-project/downloads/releases).

	```bash
	wget https://github.com/ipop-project/Downloads/releases/download/v16.01.0/ipop-v16.01.0_ubuntu.tar.gz
	tar xf ipop-v16.01.0_ubuntu.tar.gz
	```

### Configuring SocialVPN

1. Create a configuration file for SocialVPN

	```bash
	cp config/sample-svpn-config.json config/svpn-config.json
	```

2. Update `config/svpn-config.json` according to your needs. The `ip4`, `xmpp_username`, `xmpp_password`, and `xmpp_host` flags are required. See the [configuration page](https://github.com/ipop-project/ipop-project.github.io/wiki/Controller-Configuration) for more information about the configuration options available for SocialVPN.

	```bash
	nano config/svpn-config.json
	```

	```json
	...
	    "CFx": {
	        "xmpp_username": "username@dukgo.com",
	        "xmpp_password": "password123",
	        "xmpp_host": "dukgo.com",
	```
	```json
	...
	    "AddressMapper": {
	         "ip4": "172.31.0.100",
	```

### Running SocialVPN

1.  Launch the ipop-tincan program

	```bash
	sudo ./ipop-tincan &> tin.log &
	```

2.  Run the controller using the `config/svpn-config.json` configuration

	```bash
	cd controllers
	python -m controller.Controller -c config/svpn-config.json &> ctl.log &
	```

3.  Check on the current status of your network using netcat

    ```bash
    echo -e '\x02\x01{"m":"get_state"}' | netcat -q 1 -u 127.0.0.1 5800
    ```

4.  Check the network devices and IPv4 address for your device

    ```bash
    ifconfig ipop
    ```

    [[ifconfig.png]]

**Run SocialVPN on another machine using the same credentials and they will connect to each other.**

### Stopping SocialVPN

1.  Kill SocialVPN

	```bash
	sudo killall ipop-tincan
	ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9
	```