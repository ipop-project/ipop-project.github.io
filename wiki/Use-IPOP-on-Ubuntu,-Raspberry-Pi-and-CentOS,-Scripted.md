# Use IPOP on Ubuntu, Raspberry Pi and CentOS, Scripted

| | Description |
|---|---|
| **Tested on** | Ubuntu 14.04 and 16.04 x64, Raspbian Stretch and Jessie on Raspberry Pi 3 and CentOS 7 |
| **Time** | ~ 10 Minutes |
| **Question(s)** | - How to install IPOP?<br /> - How to setup IPOP basic configuration?<br /> - How to run IPOP?<br /> - How to remove IPOP? |
| **Objective(s)**| - Install IPOP<br /> - Run IPOP<br /> - Stop IPOP<br /> - Remove IPOP |

**Note:** You need to have root access to run some of the following commands. Running the IPOP Installer with just adding `sudo` to the beginning of the command is NOT enough. Switch to interactive root shell: 

```shell
sudo -i
```

## Prerequisite

If the `wget` package is not installed, you will need to install it:

**In Ubuntu:**

```shell
apt-get install wget
```
 
**In CentOS:**

```shell
yum install wget
```

## Launching the IPOP-VPN Installer

To start the IPOP Installer, run the following command:

```shell
wget -O - https://raw.githubusercontent.com/ipop-project/Release-Management/master/Deployment/linux/installer | /bin/bash
```

The default installation directory will be `/opt/ipop` and you can use `ipop` executable script to control IPOP.

Note: Make sure you have already switched to interactive root shell using `sudo -i` before running the above command. Running it with just adding `sudo` to the beginning is NOT enough.

## Using IPOP

First, change current directory to the installation directory:

```shell
cd /opt/ipop
```

Execute IPOP which is `ipop` executable script right in the installation directory with following parameters:

**Install IPOP:** (If you have already installed IPOP using IPOP Installer, you don't need to re-install it. So just skip this command.)

```shell
./ipop install
```

**Configure IPOP:**

```shell
./ipop config
```

**Start IPOP:**

```shell
./ipop start
```

**Get IPOP Node Status:**

```shell
./ipop status (This option is not available in this release, yet.)
```

**Stop IPOP:**

```shell
./ipop stop
```

**Remove IPOP:**

```shell
./ipop remove
```

## Log Files

If anything went wrong while using IPOP, the log files are located at `/opt/ipop/log`.

## Manual Configuration

If you ever need to change the configurations manually, the sample configuration files are located in `/opt/ipop/sample-gvpn-config`. IPOP reads the configurations from `/opt/ipop/config/ipop-config.json` which will automatically be created after running `./ipop config` and following the prompts. Keep in mind you need to stop IPOP and then start it again after changing the configurations.
See the [configuration page](Configuration) for more information about the configuration options available for IPOP-VPN.

---

# Key Points Summary

- Start the IPOP Installer:

```shell
wget -O - https://raw.githubusercontent.com/ipop-project/Release-Management/master/Deployment/linux/installer | /bin/bash
```
- Usage:

```shell
./ipop config
./ipop start
./ipop stop
./ipop remove
```