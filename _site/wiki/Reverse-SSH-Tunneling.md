## Reverse SSH Tunneling

**Step 1:** Install `autossh` on the local node:

https://www.linuxhelp.com/how-to-install-autossh-on-ubuntu-16-04

**Step 2:** Run the following script on the local node (pick a different `LOCAL_PORT` for each node, if they are more than one):
```
#!/bin/sh

# This forwards all requests to the local port to the remote port on the server.
LOCAL_PORT=20001
BASE_PORT=30001
REMOTE_PORT=22
LOCALHOST=localhost
SERVER=<server_public_IP_address>
USER=<local_username>
LOGFILE=<path_to_log_file>
AUTOSSH_DEBUG=1 AUTOSSH_LOGFILE=$LOGFILE autossh -f -M $BASE_PORT -N -R $LOCAL_PORT:$LOCALHOST:$REMOTE_PORT $USER@$SERVER -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no
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

