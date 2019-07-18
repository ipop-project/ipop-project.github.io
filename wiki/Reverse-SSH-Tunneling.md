## Reverse SSH Tunneling

**Step 1:** Install `autossh` on the local node:

https://www.linuxhelp.com/how-to-install-autossh-on-ubuntu-16-04

**Step 2:** Run the following script on the local node (pick a different `LOCAL_PORT` for each node, if they are more than one):
```
#!/bin/sh

# This forwards all requests to the local port to the remote port on the server.
LOCAL_PORT=20001 #pick a different `LOCAL_PORT` for each node, if they are more than one. `20001` for the first node, `20002` for the second node, etc.
BASE_PORT=30001 #BASE_PORT and BASE_PORT+1 will be used for monitoring and echo service on the local node.
REMOTE_PORT=22 #Server SSH Port
NAT_PORT=2222 #If You Want to Use a Management Node
LOCALHOST=localhost
SERVER=<server_public_IP_address>
USER=<local_username>
LOGFILE=<path_to_log_file>
AUTOSSH_DEBUG=1 AUTOSSH_LOGFILE=$LOGFILE autossh -f -M $BASE_PORT -N -R $LOCAL_PORT:$LOCALHOST:$REMOTE_PORT $USER@$SERVER -p $NAT_PORT -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no
echo "Reverse SSH Tunnel has been established. autossh tries to keep the tunnel alive while the machines are up..."
```

To make sure the SSH tunnel stays open, you should run the following script as a cron job frequently, like every 10 minutes:

Run:
```
crontab -e
```

Add this:
```
*/10 * * * * <path_to_script>
```

**Step 3:** On the server node, run:
```
ssh -vvv -p <local_port> <local_username>@localhost
```

## Using a Management Node instead of Directly Connecting to the Server

**Step 1:** Set the `NAT_PORT` in the script.

**Step 2:** On the Server Node:

```
sysctl net.ipv4.ip_forward=1
iptables -t nat -A PREROUTING -p tcp -d <server_ip> --dport <server_NAT_port> -j DNAT --to-destination <management_node_ip>:22
```
**Step 3:** Accessing the Management Node:

```
ssh -p <server_NAT_port> <management_username>@<server_ip>
```

## autossh Documentation

https://www.harding.motd.ca/autossh/README.txt