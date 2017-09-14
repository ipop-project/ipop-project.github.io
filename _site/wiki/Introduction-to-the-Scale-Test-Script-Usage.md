# Introduction to the Scale Test Script Usage

Scale-Test can be found in Release Management repo under test directory: https://github.com/ipop-project/Release-Management

**Note: Current version only tested on Ubuntu 16.04 VM**

### Modes
* IPOP GroupVPN test
    * Create a separate instance of IPOP-VPN in GroupVPN Mode in each specified lxc container
* IPOP Switch-Mode test (In Development) 
   * Create instance of IPOP-VPN on host machine which is added to lxc-bridge to connect un-managed containers to IPOP-VPN
### Setup for IPOP GroupVPN test
1. `git clone https://github.com/ipop-project/Release-Management`
2. `cd  ./Release-Management/Test/ipop-scale-test`
2. Run scale test script, Enter `./scale_test.sh`
3. When prompted for mode selection, type `classic`
4. Run `configure` (Install dependencies needed on host machine and for default container from which nodes are cloned from with the `containers-create` command)
5. Next `containers-create` (Create and start specified number of containers, build IPOP src, choose IPOP network topology configuration and copy built IPOP files to each container)
6. If visualizer option was enabled while running `containers-create` command run `visualizer-start` (Starts up two processes on host machine one running Net Visualizer found at http://localhost:8888/IPOP)
7. Run `ipop-run`(Start up IPOP processes on lxc nodes)
### Setup for IPOP Switch-Mode
* The steps for setting up IPOP-VPN in scale test environment are the same as setting up the scale test for GroupVPN Mode with exception to:
    * When prompted for mode selection, type `switch`
    * Between `configure` and `containers-create` commands run `configure-external-node`. This command will setup an instance of IPOP switch-mode on the specified host. A xmpp server address must be given which should be the ip address of the current server reachable by the external host.
    * After IPOP has been run, the ipop-tap network interface must be added to the lxc bridge with `brctl addif lxcbr0 ipop_tap0`

### Testing Environment
*  `logs` aggregates controller and tincan logs on host machine under logs directory along with a file with information on the status of each lxc container
* `ipop-test` begins a IPOP scale testing shell to carry out connectivity and performance testing built on tools such as iperf and ping (Currently only for group-vpn testing between lxc-containers). Once in the interactive shell type `help` for more information about the commands available. Data from tests are stored in local mongodb program.
   * Instructions for viewing data from tests with Robomongo GUI
       1. To download and run 
          ```bash
          wget https://download.robomongo.org/1.1.1/linux/robo3t-1.1.1-linux-x86_64-c93c6b0.tar.gz #Download zipped src
          tar -xf robo3t-1.1.1-linux-x86_64-c93c6b0.tar.gz #Unzip src to sub directory
          ./robo3t-1.1.1-linux-x86_64-c93c6b0/bin/robo3t #Run Robomongo
          ```
       4. Create new connection to localhost:27017 and connect. Data will be in ipopdb database under iperf and ping collections


### Tear Down
* Run `containers-del` (Destroy all lxc node labeled containers)
* Run `visualizer-stop` (Stop visualizer processes)

#### Note: ejabberd and mongodb will be installed on host machine as daemons which will start up automatically. Removal/Disabling of these services must be done manually.

### Full Command List
All commands/arguments are optional upon script call. If no command/argument is entered, required input shall be prompted. Arguments are required to be entered in the order they are listed.
* `configure`
    * Install dependencies required for scale-test environment. Also sets up a default lxc-container that will be base for node containers
    * Arguments:
        1. [is_external] - Skips installation of mongodb and ejabberd services if true. If not specified or false services will be installed
* `configure-external-node`
    * Install and run instance of IPOP-VPN on remote host
    * Arguments:
        1. [username] - username for user on remote host
        2. [hostname] - address of remote host
        3. [xmpp_address] - address of xmpp server
* `containers-create`
    * Download IPOP-VPN sources, create node containers configure IPOP network topology (default: max successors-> 4, max cords-> 4, max on-demand-links-> 0, max in-bound-links ->4) and start run each container
    * Arguments:
        1. [container_count] - number of containers to create and run
        2. [controller_repo_url] - URL of Controllers repo to clone
        3. [tincan_repo_url] - URL of Tincan repo to clone
        4. [visualizer] - T to enable visualizer F to disable
        5. [is_external] - true for use on remote
* `containers-start`
    * Start up all defined stopped containers.
* `containers-del`
    * Delete all node containers. Default container is kept
* `containers-stop`
    * Stop all defined running containers
* `ipop-run`
    * In group-vpn mode runs selected nodes. In switch-mode runs IPOP-VPN on host
    * Arguments:
        1. [container_to_run] - Only for group-vpn mode. Enter number of node to run IPOP on or # to run IPOP on all nodes.
* `ipop-kill`
    * Kill IPOP processes on specified node for group-vpn or on host for switch-mode
    * Arguments:
        1. [container_to_kill] - Only for group-vpn mode. Enter number of node to kill IPOP on or # to kill IPOP on all nodes.
* `ipop-status`
    * View status of ipop processes for each container. Currently only for group-vpn mode
* `ipop-tests`
    * Run testing shell. Currently only for testing group-vpn mode
* `logs`
   * Gives IPOP processes status and aggregates IPOP logs under log directory on host for group-vpn mode
* `visualizer-start`
    * Start visualizer on host machine
* `visualizer-stop`
    * Stop visualizer process on host machine
* `visualizer-status`
    * View status of visualizer