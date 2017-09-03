# Deploying XMPP STUN TURN Services

IPOP uses XMPP, STUN, and TURN services to connect with other peers. You can deploy your own private Online Social Network and NAT traversal services using the opensource ejabberd (XMPP/STUN) and turnserver (TURN) software.

The following instructions are for Ubuntu 14.04 or higher.

## Using IPOP Scale-Test (XMPP/STUN/TURN)

IPOP scale test installs and configures an instance of ejabberd and a
turnserver to provide support for the internal IPOP Nodes (IPOP inside LXC containers) in addition to external nodes. The `configure` step provides the installation and configuration
of these services automatically. Full Instructions for running the scale test 
can be found here:
https://github.com/ipop-project/ipop-project.github.io/wiki/Introduction-to-the-scale-test-script-usage.

## Using ejabberd (XMPP/STUN)

1. Install ejabberd

	```bash
	sudo apt-get update
	sudo apt-get install ejabberd
	```

2. Determine the version of ejabberd for later parts of this guide

	```bash
	sudo ejabberdctl status
	```

3. Update the ejabberd configuration file. For this example, we define the admin user *ipopuser* and ejabberd hostname *ejabberd*.


	1. For ejabberd before ejabberd 14.07:

		```bash
		sudo nano /etc/ejabberd/ejabberd.cfg
		```


		```data
		...
		%% Admin user
		{acl, admin, {user, "ipopuser", "ejabberd"}}.
		...
		%% Hostname
		{hosts, ["localhost", "ejabberd"]}.
		...
		```

	2. For ejabberd 14.07 or later:

		```bash
		sudo nano /etc/ejabberd/ejabberd.yml
		```

		```yml
		...
 		   #in the served hostnames section
 		   hosts:
 		     - "localhost"
 		     - "ejabberd"
		...
		   #in the access control lists section
		      admin:
		        user:
		            - "": "localhost"
		            - "ipopuser": "ejabberd
		...
		```

4. Add the following section to the configuration file to enable STUN on UDP port 3478

	1. For ejabberd before ejabberd 14.07:

		```bash
		sudo nano /etc/ejabberd/ejabberd.cfg
		```

		```data
		...
		{listen,
		 [
		  {5222, ejabberd_c2s, [
		                        {access, c2s},
		                        {shaper, c2s_shaper},
		                        {max_stanza_size, 65536},
		                        %%zlib,
		                        starttls, {certfile, "/etc/ejabberd/ejabberd.pem"}
		                       ]},

		  { {3478, udp}, ejabberd_stun, [] },
		...
		```
		Note: only add ```{ {3478, udp}, ejabberd_stun, [] },```.

	2. For ejabberd 14.07 or later:

		```bash
		sudo nano /etc/ejabberd/ejabberd.yml
		```

		```yml
		...
		#in the listening ports section
		listen:
		  -
		    port: 3478
		    transport: udp
		    module: ejabberd_stun
		...
		```

5. (For ejabberd 14.07 or later only) Enable mod_admin_extra for extra ejabberd commands

	```bash
	sudo nano /etc/ejabberd/ejabberd.yml
	```

	```yml
	...
	#in the modules section
	modules:
	  mod_admin_extra: {}
	...
	```

6. (Optional) Create a self-signed certificate. Note if you change the ejabberd hostname from *ejabberd* to something else, you must create a new self-signed certificate and set the common name (CN) to the new ejabberd hostname.

	```bash
	openssl req -x509 -nodes -days 3650 -newkey rsa:1024 -keyout ejabberd.pem -out ejabberd.pem
	sudo cp ejabberd.pem /etc/ejabberd/
	```
7. Restart the ejabberd service

	1. For Ubuntu before Ubuntu 15.04 (with Upstart):

		```bash
		sudo service ejabberd restart
		```

	2. For Ubuntu 15.04 or later (with systemd):

		```bash
		sudo systemctl restart ejabberd.service
		```

8. Create your admin user

	```bash
	sudo ejabberdctl register ipopuser ejabberd password
	```

9. Useful ejabberd commands, features, and notes

	1. Create users

		```bash
		sudo ejabberdctl register alice ejabberd password
		sudo ejabberdctl register bob ejabberd password
		```

	2. Create user-to-user relationships (using rosteritems). Note: rosteritems are directed; you must run the command twice (i.e. add Alice to Bob's roster, and add Bob to Alice's roster).

		```bash
		sudo ejabberdctl add-rosteritem alice ejabberd bob ejabberd bob svpn both
		sudo ejabberdctl add-rosteritem bob ejabberd alice ejabberd alice svpn both
		```

	3. (For ejabberd 14.07 or later only) Create user-to-user relationships (using shared roster groups). All users in a shared roster group have a relationship with each other.

		```bash
		sudo ejabberdctl srg_create ipop_vpn ejabberd ipop_vpn ipop_vpn ipop_vpn
		sudo ejabberdctl srg_user_add @all@ ejabberd ipop_vpn ejabberd
		```
	Note: `@all@` adds all users to the shared roster group

	4. Check which users are online

		```bash
		sudo ejabberdctl connected-users
		```

	5. Visit `http://<ip-address-of-ejabberd>:5280/admin` to manage your ejabberd service. Click Virtual Hosts -> ejabberd -> Users).

		```bash
		username: ipopuser@ejabberd
		password: password
		```

	6. Note: open port the following ports

		```bash
		TCP/5222  (XMPP client-to-server)
		TCP/5269 (XMPP server-to-server)
		TCP/5280
		UDP/3478  (STUN)
		```

## Using turnserver (TURN)

1. Install turnserver

	```bash
	sudo apt-get update
	sudo apt-get install libconfuse0 turnserver
	```

2. If you are running on the cloud (i.e. EC2 or CloudLab), you must use IP aliasing to allow the TURN server to bind your public IP address

	```bash
	sudo ifconfig eth0:0 <public-ip-of-turnserver> up
	```

3. Update the turnserver configuration file with the public IP address

	```bash
	VM_IPv4="<public-ip-of-turnserver>"
	sudo sed -i "s/listen_address = .*/listen_address = { \"$VM_IPv4\" }/g" /etc/turnserver/turnserver.conf
	```

4. (Optional) Set the number of sessions per user

	```bash
	sudo nano /etc/turnserver/turnserver.conf
	```

	```data
	## Max relay per username.
	max_relay_per_username = 100000

	## Allocation lifetime.
	allocation_lifetime = 720000
	```

5. (Optional) Set the file descriptor limit to allow for thousands of TURN connections. Note: you must re-login for these changes to take effect.

	```bash
	sudo nano /etc/security/limits.conf
	```

	```data
	ubuntu    hard    nofile    100000
	ubuntu    soft    nofile    100000
	```

6. (Optional) To control user accesses to the TURN service, you can create turnserver user credentials by modifying the `/etc/turnserver/turnusers.txt` file.

	```bash
	sudo nano /etc/turnserver/turnusers.txt
	```

	```data
	...
	ipopuser:password:<public-ip-of-turnserver>:authorized
	...
	```
	Note: entries must be of the form: `<username>:<password>:<public-ip-of-turnserver>:<authorizatization level>`

7. Run turnserver

	```bash
	sudo turnserver -c /etc/turnserver/turnserver.conf
	```

8. Verify that turnserver is running

	```bash
	netstat -aupn | grep 19302
	```

## IPOP Configuration for SocialVPN and GroupVPN

1. Modify the `xmpp_username`, `xmpp_password`, `xmpp_host`, and `stun` flags to use the XMPP/STUN services provided by ejabberd

	```json
	...
	    "CFx": {
	        "xmpp_username": "ipopuser@ejabberd",
	        "xmpp_password": "password",
	        "xmpp_host": "<ip-address-of-ejabberd>",
	```
	```json
	...
	    "TincanSender": {
	        "stun": ["<ip-address-of-ejabberd>:3478"],
	```

2. If you want to use your own STUN service independent from ejabberd, just change the address to your STUN server address. For example, TURN itself supports STUN service, so just use the turnserver for STUN.

	```json
	...
	    "TincanSender": {
		"stun": ["<ip-address-of-your-turnserver>:19302"],
	```

2. Modify the `turn` flag to use the TURN service provided by turnserver

	```json
	...
	    "TincanSender": {
	        "turn": [{"server": "<turnserver>:19302", "user": "ipopuser", "pass": "password"}],
	```
