# Installing IPOP-VPN on Linux (Ubuntu or CentOS)

Note: You need to have root access to run some of the following commands. Running the IPOP Installer with just adding `sudo` to the beginning of the command is NOT enough. Switch to interactive root shell: 

    sudo -i

## Prerequisite

If the 'wget' package is not installed, you will need to install it:

**In Ubuntu:**

    apt-get install wget
 
**In CentOS:**

    yum install wget

## Launching the IPOP-VPN Installer

To start the IPOP Installer, run the following command:

    wget -O - https://raw.githubusercontent.com/ipop-project/Release-Management/v16.08.0/Deployment/linux/installer | /bin/bash

The default installation directory will be `/opt/ipop` and you can use `ipop` executable script to control IPOP.

Note: Make sure you have already switched to interactive root shell using `sudo -i` before running the above command. Running it with just adding `sudo` to the beginning is NOT enough.

## Using IPOP

First, change current directory to the installation directory:

    cd /opt/ipop

Execute IPOP which is `ipop` executable script right in the installation directory with following parameters:

**Install IPOP:** (If you have already installed IPOP using IPOP Installer, you don't need to re-install it. So just skip this command.)

    ./ipop install

**Configure IPOP:**

    ./ipop config

**Start IPOP:**

    ./ipop start

**Get IPOP Node Status:**

    ./ipop status (This option is not available in this release.)

**Stop IPOP:**

    ./ipop stop

## Log Files

If anything went wrong while using IPOP, the log files are located at `/opt/ipop/log`.

## Manual Configuration

If you ever need to change the configurations manually, the sample configuration files are located in `/opt/ipop/config`. IPOP reads the configurations from `/opt/ipop/config/config.json` which will automatically be created after running `./ipop config` and following the prompts. Keep in mind you need to stop IPOP and then start it again after changing the configurations.
See the [configuration page](https://github.com/ipop-project/ipop-project.github.io/wiki/Controller-Configuration) for more information about the configuration options available for IPOP-VPN.

## Manual Installation
If you need to perform a manual installation of IPOP-VPN, detailed instructions are available on the [Manual Installation Page | Manual Install on Linux](https://github.com/ipop-project/ipop-project.github.io/wiki/Manual-Install-on-Linux).
