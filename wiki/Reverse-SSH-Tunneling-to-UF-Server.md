## Reverse SSH Tunneling to UF Server

**Step 1:** Install `autossh` on the local node:

https://www.linuxhelp.com/how-to-install-autossh-on-ubuntu-16-04

**Step 2:** Run the following script on the local node (You need to change the LOCAL_PORT for each node, if there are more than one node to connect to the server.):

```
#!/bin/sh

# This forwards all requests to the local port to the remote port on the server.
LOCAL_PORT=20001 #pick a different `LOCAL_PORT` for each node, if they are more than one. `20001` for the first node, `20002` for the second node, etc.
BASE_PORT=30001 #BASE_PORT and BASE_PORT+1 will be used for monitoring and echo service on the local node.
REMOTE_PORT=22 #Server SSH Port
NAT_PORT=2222 #Server NAT Port
LOCALHOST=localhost
SERVER=128.227.150.20 #Server Public IP Address
USER=rpicluster #Server Username
LOGFILE=autossh.log #Path to the Log File
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