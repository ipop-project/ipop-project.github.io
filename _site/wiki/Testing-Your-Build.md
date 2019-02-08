This page discusses the methodology for testing and evaluating IPOP. Visit the [testing repository](https://github.com/ipop-project/Release-Management/tree/master/Test) for the source of the test suite.

### Objectives

The objectives of the test suite are to provide the following:

* Automated and scalable deployment of IPOP instances
* Productivity
	+ Test and visualize the correctness of the IPOP source
* Performance evaluation
	+ The latency and throughput of the network
* Dependability evaluation
	+ The robustness of a dynamic network

### Design

The test-suite was designed using a two-level *master-worker* model, as shown in __Figure 1__. In the first level, a host computer (*master*) orchestrates a set of physical nodes (*workers*) via SSH/SFTP. In the second level, each physical node (*master*) commands a set of Linux containers (LXCs) (*workers*). Collectively, the host computer controls a large number of LXCs that scales with the number of physical nodes. Each LXC runs an instance of IPOP to collectively realize an IPOP network.

To eliminate dependencies that are external to this system, one physical node assumes the role of *server* and deploys ejabberd (for XMPP/STUN) and turnserver (for TURN) to service the IPOP instances.

The host computer is able to command specific IPOP instances for network stimulation. For example, an IPOP instance can be run or stopped to simulate nodes entering or leaving the network; IPOP instances can be instructed to interact with other instances to simulate inter-node communication. Additionally, the IPOP instances provide local information about the network to the host computer to interpret the state of the network. For example, each IPOP instance can provide a list of its neighbouring peers so that the host computer can visualize the network topology; individual IPOP instances can report details such as transmission latency, packet loss, or resource utilization for performance and dependability analysis.

![](https://github.com/ipop-project/ipop-project.github.io/blob/master/wiki-images/ipop-scale-test-architecture.png)

__Figure 1.__ IPOP scale-test architecture

### Example

To improve the dependability of IPOP GroupVPN, a recovery mechanism is implemented to restore the structured peer-to-peer topology after the network has been partitioned. Using the test suite, we are able to test the correctness of this mechanism, as shown in __Figure 2__. In (*a*), the network topology is well formed. In (*b*), four IPOP instances are stopped to simulate the partitioning of the network into two halves. In (*c*), after some time, the two network partitions have reunited and will eventually restore the network topology.

![](https://github.com/ipop-project/ipop-project.github.io/blob/master/wiki-images/ipop-topology-recovery.png)

__Figure 2.__ Simulation of the IPOP GroupVPN recovery mechanism