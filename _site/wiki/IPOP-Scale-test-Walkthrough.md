# IPOP Scale-test Walkthrough

|  | Description |
|---|---|
| **Tested on** | Ubuntu 16.04 Desktop x64 |
| **Time** | ~ 40 Minutes |
| **Objective**| - Install and execute Ipop scale test for validating functionality and debugging. <br /> - Visualize topology based on configuration parameters.|  
  
## Description

This tutorial guides you through the deployment IPOP scale test, a handy tool to validate functionality and performance of an IPOP network deployed locally. This tool can be used for debugging post modifications made to the source code and to visualize behavioral aspects of topology based on set topology parameters. It is pre-configured to work within a single Ubuntu 16.04 VMware/VirtualBox VM to make it easy for anyone to reproduce it on their own computers and test-drive IPOP network. The tutorial deploys all services IPOP uses (XMPP, STUN, TURN), as well as 10 IPOP nodes on 10 LXC containers within the VM. 

## Usage

#### Preparing your virtual machine

You will need a 64-bit Ubuntu 16.04 VM to run this tutorial. It has been tested on [this osboxes.org VMware image](http://www.osboxes.org/ubuntu/#ubuntu-16-04-vmware)

#### Download the automated test script on Host
(note: if you use the osboxes.org VMware Ubuntu 16.04 image, the default root password is: osboxes.org )
This tutorial uses scale-test, an automated test script that install and configures all software needed to run a test IPOP network of a few nodes.

    cd
    git clone https://github.com/ipop-project/Release-Management
  
##### Scale test - setting up the environment
```
cd ./Release-Management/Test/ipop-scale-test
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ ./scale_test.sh
Enter from the following options:
    configure                      : install/prepare default container
    containers-create              : create and start containers
    containers-start               : start stopped containers
    containers-stop                : stop containers
    containers-del                 : delete containers
    ipop-run                       : to run IPOP node
    ipop-kill                      : to kill IPOP node
    ipop-tests                     : open scale test shell to test ipop
    ipop-status                    : show statuses of IPOP processes
    visualizer-start               : install and start up visualizer
    visualizer-stop                : stop visualizer processes
    visualizer-status              : show statuses of visualizer processes
    logs                           : aggregate ipop logs under ./logs
    mode                           : show or change ipop mode to test
     
> configure
```
##### Scale test - starting execution  
This step will   
* Create and start containers.
* Download and build IPOP tincan binary.  
* Download controller repository.  
* Register ejabberd user for every container and establish relationships between them on the ejabberd server.  
* Configure topology parameters such as successor links, chords, on-demand and inbound links.  

```
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ ./scale_test.sh
Enter from the following options:
    configure                      : install/prepare default container
    containers-create              : create and start containers
    containers-start               : start stopped containers
    containers-stop                : stop containers
    containers-del                 : delete containers
    ipop-run                       : to run IPOP node
    ipop-kill                      : to kill IPOP node
    ipop-tests                     : open scale test shell to test ipop
    ipop-status                    : show statuses of IPOP processes
    visualizer-start               : install and start up visualizer
    visualizer-stop                : stop visualizer processes
    visualizer-status              : show statuses of visualizer processes
    logs                           : aggregate ipop logs under ./logs
    mode                           : show or change ipop mode to test
     
> containers-create
No of containers to be created: 10
Controllers repo already present in the current path. Continue with existing repo? (Y/N) 
y
Using existing Tincan binary...
Enable visualization? (Y/N): 
y
Network defaults:
No of Successor links: 4
Max No of Chords: 4
Max No of Ondemand links: 0
Max No of Inbound links: 4
Do you want to use IPOP network defaults? (Y/N): 
y
Starting containers. Please wait... 
Container node1 started.
User node1@ejabberd successfully registered
Container node2 started.
User node2@ejabberd successfully registered
Container node3 started.
User node3@ejabberd successfully registered
Container node4 started.
User node4@ejabberd successfully registered
Container node5 started.
User node5@ejabberd successfully registered
Container node6 started.
User node6@ejabberd successfully registered
Container node7 started.
User node7@ejabberd successfully registered
Container node8 started.
User node8@ejabberd successfully registered
Container node9 started.
User node9@ejabberd successfully registered
Container node10 started.
User node10@ejabberd successfully registered
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ 

```   

#### Start IPOP network and query for its status
In this phase we will start IPOP processes inside the containers we created in the previous step and then query for the status of those processes.
```
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ ./scale_test.sh
Enter from the following options:
    configure                      : install/prepare default container
    containers-create              : create and start containers
    containers-start               : start stopped containers
    containers-stop                : stop containers
    containers-del                 : delete containers
    ipop-run                       : to run IPOP node
    ipop-kill                      : to kill IPOP node
    ipop-tests                     : open scale test shell to test ipop
    ipop-status                    : show statuses of IPOP processes
    visualizer-start               : install and start up visualizer
    visualizer-stop                : stop visualizer processes
    visualizer-status              : show statuses of visualizer processes
    logs                           : aggregate ipop logs under ./logs
    mode                           : show or change ipop mode to test
     
> ipop-run
Enter # To RUN all containers or Enter the container number.  (e.g. Enter 1 to start node1)
#
Running node1
nohup: ignoring input and appending output to 'nohup.out'
Running node2
nohup: ignoring input and appending output to 'nohup.out'
Running node3
nohup: ignoring input and appending output to 'nohup.out'
Running node4
nohup: ignoring input and appending output to 'nohup.out'
Running node5
nohup: ignoring input and appending output to 'nohup.out'
Running node6
nohup: ignoring input and appending output to 'nohup.out'
Running node7
nohup: ignoring input and appending output to 'nohup.out'
Running node8
nohup: ignoring input and appending output to 'nohup.out'
Running node9
nohup: ignoring input and appending output to 'nohup.out'
Running node10
nohup: ignoring input and appending output to 'nohup.out'
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ 
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ ./scale_test.sh
Enter from the following options:
    configure                      : install/prepare default container
    containers-create              : create and start containers
    containers-start               : start stopped containers
    containers-stop                : stop containers
    containers-del                 : delete containers
    ipop-run                       : to run IPOP node
    ipop-kill                      : to kill IPOP node
    ipop-tests                     : open scale test shell to test ipop
    ipop-status                    : show statuses of IPOP processes
    visualizer-start               : install and start up visualizer
    visualizer-stop                : stop visualizer processes
    visualizer-status              : show statuses of visualizer processes
    logs                           : aggregate ipop logs under ./logs
    mode                           : show or change ipop mode to test
     
> ipop-status
node1 is not running
Controller is UP && Tincan is UP on node2
Controller is UP && Tincan is UP on node3
Controller is UP && Tincan is UP on node4
Controller is UP && Tincan is UP on node5
Controller is UP && Tincan is UP on node6
Controller is UP && Tincan is UP on node7
Controller is UP && Tincan is UP on node8
Controller is UP && Tincan is UP on node9
Controller is UP && Tincan is UP on node10
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ 

```   
#### Validation and testing tools.  
This phase entails use of features for validating functional correctness and performance metrics under a tool suite called ipop-tests. We are going to go through some of its features.

```
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ ./scale_test.sh
Enter from the following options:
    configure                      : install/prepare default container
    containers-create              : create and start containers
    containers-start               : start stopped containers
    containers-stop                : stop containers
    containers-del                 : delete containers
    ipop-run                       : to run IPOP node
    ipop-kill                      : to kill IPOP node
    ipop-tests                     : open scale test shell to test ipop
    ipop-status                    : show statuses of IPOP processes
    visualizer-start               : install and start up visualizer
    visualizer-stop                : stop visualizer processes
    visualizer-status              : show statuses of visualizer processes
    logs                           : aggregate ipop logs under ./logs
    mode                           : show or change ipop mode to test
     
> ipop-tests
(scale-test) help

Documented commands (type help <topic>):
========================================
EOF  churn  exit  exportdata  help  iperf  ping  pingall  status

``` 

As seen above, with the use of this tool one can verify all to all connectivity (pingall), pairwise connectivity (ping), query for IPOP addresses on individual nodes (status) and collect performance metrics (iperf).  

##### status
```
(scale-test) status
Container: node1 is running | ip addresses: (u'10.0.3.243', u'10.254.0.1')
Container: node10 is running | ip addresses: (u'10.0.3.192', u'10.254.0.10')
Container: node2 is running | ip addresses: (u'10.0.3.253', u'10.254.0.2')
Container: node3 is running | ip addresses: (u'10.0.3.176', u'10.254.0.3')
Container: node4 is running | ip addresses: (u'10.0.3.250', u'10.254.0.4')
Container: node5 is running | ip addresses: (u'10.0.3.191', u'10.254.0.5')
Container: node6 is running | ip addresses: (u'10.0.3.97', u'10.254.0.6')
Container: node7 is running | ip addresses: (u'10.0.3.160', u'10.254.0.7')
Container: node8 is running | ip addresses: (u'10.0.3.75', u'10.254.0.8')
Container: node9 is running | ip addresses: (u'10.0.3.215', u'10.254.0.9')
(scale-test) 
```
##### all to all connectivity
```
(scale-test) pingall
Staring pingall with default packet count of 2.
node1 -> node10 with packet loss 0.0%
node1 -> node2 with packet loss 0.0%
node1 -> node3 with packet loss 0.0%
node1 -> node4 with packet loss 0.0%
node1 -> node5 with packet loss 0.0%
node1 -> node6 with packet loss 0.0%
node1 -> node7 with packet loss 0.0%
node1 -> node8 with packet loss 0.0%
node1 -> node9 with packet loss 0.0%
node10 -> node1 with packet loss 0.0%
node10 -> node2 with packet loss 0.0%
node10 -> node3 with packet loss 0.0%
node10 -> node4 with packet loss 0.0%
node10 -> node5 with packet loss 0.0%
node10 -> node6 with packet loss 0.0%
node10 -> node7 with packet loss 0.0%
node10 -> node8 with packet loss 0.0%
node10 -> node9 with packet loss 0.0%
node2 -> node1 with packet loss 0.0%
node2 -> node10 with packet loss 0.0%
node2 -> node3 with packet loss 0.0%
node2 -> node4 with packet loss 0.0%
node2 -> node5 with packet loss 0.0%
node2 -> node6 with packet loss 0.0%
node2 -> node7 with packet loss 0.0%
node2 -> node8 with packet loss 0.0%
node2 -> node9 with packet loss 0.0%
node3 -> node1 with packet loss 0.0%
node3 -> node10 with packet loss 0.0%
node3 -> node2 with packet loss 0.0%
node3 -> node4 with packet loss 0.0%
node3 -> node5 with packet loss 0.0%
node3 -> node6 with packet loss 0.0%
node3 -> node7 with packet loss 0.0%
node3 -> node8 with packet loss 0.0%
node3 -> node9 with packet loss 0.0%
node4 -> node1 with packet loss 0.0%
node4 -> node10 with packet loss 0.0%
node4 -> node2 with packet loss 0.0%
node4 -> node3 with packet loss 0.0%
node4 -> node5 with packet loss 0.0%
node4 -> node6 with packet loss 0.0%
node4 -> node7 with packet loss 0.0%
node4 -> node8 with packet loss 0.0%
node4 -> node9 with packet loss 0.0%
node5 -> node1 with packet loss 0.0%
node5 -> node10 with packet loss 0.0%
node5 -> node2 with packet loss 0.0%
node5 -> node3 with packet loss 0.0%
node5 -> node4 with packet loss 0.0%
node5 -> node6 with packet loss 0.0%
node5 -> node7 with packet loss 0.0%
node5 -> node8 with packet loss 0.0%
node5 -> node9 with packet loss 0.0%
node6 -> node1 with packet loss 0.0%
node6 -> node10 with packet loss 0.0%
node6 -> node2 with packet loss 0.0%
node6 -> node3 with packet loss 0.0%
node6 -> node4 with packet loss 0.0%
node6 -> node5 with packet loss 0.0%
node6 -> node7 with packet loss 0.0%
node6 -> node8 with packet loss 0.0%
node6 -> node9 with packet loss 0.0%
node7 -> node1 with packet loss 0.0%
node7 -> node10 with packet loss 0.0%
node7 -> node2 with packet loss 0.0%
node7 -> node3 with packet loss 0.0%
node7 -> node4 with packet loss 0.0%
node7 -> node5 with packet loss 0.0%
node7 -> node6 with packet loss 0.0%
node7 -> node8 with packet loss 0.0%
node7 -> node9 with packet loss 0.0%
node8 -> node1 with packet loss 0.0%
node8 -> node10 with packet loss 0.0%
node8 -> node2 with packet loss 0.0%
node8 -> node3 with packet loss 0.0%
node8 -> node4 with packet loss 0.0%
node8 -> node5 with packet loss 0.0%
node8 -> node6 with packet loss 0.0%
node8 -> node7 with packet loss 0.0%
node8 -> node9 with packet loss 0.0%
node9 -> node1 with packet loss 0.0%
node9 -> node10 with packet loss 0.0%
node9 -> node2 with packet loss 0.0%
node9 -> node3 with packet loss 0.0%
node9 -> node4 with packet loss 0.0%
node9 -> node5 with packet loss 0.0%
node9 -> node6 with packet loss 0.0%
node9 -> node7 with packet loss 0.0%
node9 -> node8 with packet loss 0.0%
(scale-test) 
```
##### pair-wise connectivity
```
(scale-test) ping node1 node2 10
PING 10.254.0.2 (10.254.0.2) 56(84) bytes of data.
64 bytes from 10.254.0.2: icmp_seq=1 ttl=64 time=30.7 ms
64 bytes from 10.254.0.2: icmp_seq=2 ttl=64 time=1.94 ms
64 bytes from 10.254.0.2: icmp_seq=3 ttl=64 time=1.76 ms
64 bytes from 10.254.0.2: icmp_seq=4 ttl=64 time=1.60 ms
64 bytes from 10.254.0.2: icmp_seq=5 ttl=64 time=1.84 ms
64 bytes from 10.254.0.2: icmp_seq=6 ttl=64 time=1.80 ms
64 bytes from 10.254.0.2: icmp_seq=7 ttl=64 time=1.61 ms
64 bytes from 10.254.0.2: icmp_seq=8 ttl=64 time=0.909 ms
64 bytes from 10.254.0.2: icmp_seq=9 ttl=64 time=0.790 ms
64 bytes from 10.254.0.2: icmp_seq=10 ttl=64 time=0.754 ms

--- 10.254.0.2 ping statistics ---
10 packets transmitted, 10 received, 0% packet loss, time 9059ms
rtt min/avg/max/mdev = 0.754/4.376/30.733/8.796 ms

(scale-test) 

```  
##### Performance metrics via iperf
```
(scale-test) iperf node3 node8
{
	"start":	{
		"connected":	[{
				"socket":	4,
				"local_host":	"10.254.0.3",
				"local_port":	49164,
				"remote_host":	"10.254.0.8",
				"remote_port":	5201
			}],
		"version":	"iperf 3.0.11",
		"system_info":	"Linux node3 4.10.0-32-generic #36~16.04.1-Ubuntu SMP Wed Aug 9 09:19:02 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux\n",
		"timestamp":	{
			"time":	"Wed, 16 Aug 2017 14:32:13 GMT",
			"timesecs":	1502893933
		},
		"connecting_to":	{
			"host":	"10.254.0.8",
			"port":	5201
		},
		"cookie":	"node3.1502893933.268437.34d12d0f6321",
		"tcp_mss_default":	524,
		"test_start":	{
			"protocol":	"TCP",
			"num_streams":	1,
			"blksize":	131072,
			"omit":	0,
			"duration":	5,
			"bytes":	0,
			"blocks":	0,
			"reverse":	0
		}
	},
	"intervals":	[{
			"streams":	[{
					"socket":	4,
					"start":	0,
					"end":	1.00017,
					"seconds":	1.00017,
					"bytes":	3770180,
					"bits_per_second":	3.01563e+07,
					"retransmits":	10,
					"snd_cwnd":	60784,
					"omitted":	false
				}],
			"sum":	{
				"start":	0,
				"end":	1.00017,
				"seconds":	1.00017,
				"bytes":	3770180,
				"bits_per_second":	3.01563e+07,
				"retransmits":	10,
				"omitted":	false
			}
		}, {
			"streams":	[{
					"socket":	4,
					"start":	1.00017,
					"end":	2.00022,
					"seconds":	1.00005,
					"bytes":	3118848,
					"bits_per_second":	2.49496e+07,
					"retransmits":	1,
					"snd_cwnd":	53972,
					"omitted":	false
				}],
			"sum":	{
				"start":	1.00017,
				"end":	2.00022,
				"seconds":	1.00005,
				"bytes":	3118848,
				"bits_per_second":	2.49496e+07,
				"retransmits":	1,
				"omitted":	false
			}
		}, {
			"streams":	[{
					"socket":	4,
					"start":	2.00022,
					"end":	3.00011,
					"seconds":	0.99989,
					"bytes":	3118848,
					"bits_per_second":	2.49535e+07,
					"retransmits":	0,
					"snd_cwnd":	67596,
					"omitted":	false
				}],
			"sum":	{
				"start":	2.00022,
				"end":	3.00011,
				"seconds":	0.99989,
				"bytes":	3118848,
				"bits_per_second":	2.49535e+07,
				"retransmits":	0,
				"omitted":	false
			}
		}, {
			"streams":	[{
					"socket":	4,
					"start":	3.00011,
					"end":	4.00007,
					"seconds":	0.999966,
					"bytes":	3118848,
					"bits_per_second":	2.49516e+07,
					"retransmits":	2,
					"snd_cwnd":	61308,
					"omitted":	false
				}],
			"sum":	{
				"start":	3.00011,
				"end":	4.00007,
				"seconds":	0.999966,
				"bytes":	3118848,
				"bits_per_second":	2.49516e+07,
				"retransmits":	2,
				"omitted":	false
			}
		}, {
			"streams":	[{
					"socket":	4,
					"start":	4.00007,
					"end":	5.00008,
					"seconds":	1.00001,
					"bytes":	3118848,
					"bits_per_second":	2.49507e+07,
					"retransmits":	1,
					"snd_cwnd":	53972,
					"omitted":	false
				}],
			"sum":	{
				"start":	4.00007,
				"end":	5.00008,
				"seconds":	1.00001,
				"bytes":	3118848,
				"bits_per_second":	2.49507e+07,
				"retransmits":	1,
				"omitted":	false
			}
		}],
	"end":	{
		"streams":	[{
				"sender":	{
					"socket":	4,
					"start":	0,
					"end":	5.00008,
					"seconds":	5.00008,
					"bytes":	16245572,
					"bits_per_second":	2.59925e+07,
					"retransmits":	14
				},
				"receiver":	{
					"socket":	4,
					"start":	0,
					"end":	5.00008,
					"seconds":	5.00008,
					"bytes":	15641924,
					"bits_per_second":	2.50267e+07
				}
			}],
		"sum_sent":	{
			"start":	0,
			"end":	5.00008,
			"seconds":	5.00008,
			"bytes":	16245572,
			"bits_per_second":	2.59925e+07,
			"retransmits":	14
		},
		"sum_received":	{
			"start":	0,
			"end":	5.00008,
			"seconds":	5.00008,
			"bytes":	15641924,
			"bits_per_second":	2.50267e+07
		},
		"cpu_utilization_percent":	{
			"host_total":	0.869463,
			"host_user":	0.0783283,
			"host_system":	0.783283,
			"remote_total":	9.95959,
			"remote_user":	0.0773897,
			"remote_system":	9.82849
		}
	}
}

(scale-test) 

```
#### Consolidated logs for debugging  
```
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ ./scale_test.sh
Enter from the following options:
    configure                      : install/prepare default container
    containers-create              : create and start containers
    containers-start               : start stopped containers
    containers-stop                : stop containers
    containers-del                 : delete containers
    ipop-run                       : to run IPOP node
    ipop-kill                      : to kill IPOP node
    ipop-tests                     : open scale test shell to test ipop
    ipop-status                    : show statuses of IPOP processes
    visualizer-start               : install and start up visualizer
    visualizer-stop                : stop visualizer processes
    visualizer-status              : show statuses of visualizer processes
    logs                           : aggregate ipop logs under ./logs
    mode                           : show or change ipop mode to test
     
> logs
[sudo] password for osboxes: 
node1 is not running
View ./logs/ to see ctrl and tincan logs
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test$ cd logs/
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test/logs$ ls -ltr
total 40
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node1
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node2
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node3
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node4
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node5
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node6
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node7
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node8
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node9
drwxrwxr-x 2 osboxes osboxes 4096 Aug 16 10:37 node10
osboxes@osboxes:~/Release-Management/Test/ipop-scale-test/logs$ 

```

#### References

[1] [IPOP](http://ipop-project.org/) 

[2] [IPOP GitHub](https://github.com/ipop-project) 

[3] [Scale-Test concept](https://github.com/ipop-project/ipop-project.github.io/wiki/Testing-Your-Build) 

[4] [More about scale-test](https://github.com/ipop-project/Release-Management/tree/master/Test/ipop-scale-test)