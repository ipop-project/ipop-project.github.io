# Use IPOP on Windows, Manually

**Warning: This document may be out of date.**

| | Description |
|---|---|
| **Tested on** | Microsoft Windows 10 x64 |
| **Time** | ~ 10 Minutes |
| **Question(s)** | - How to install IPOP?<br /> - How to run IPOP?<br /> - How to remove IPOP? |
| **Objective(s)**| - Install IPOP<br /> - Run IPOP<br /> - Stop IPOP<br /> - Remove IPOP |

## Installing IPOP-VPN on Windows

### Quick start Installation
The most convenient way to get IPOP installed on Windows 10 is run the _ipop-set.ps1_ powershell script included in the IPOP ZIP file. Note that you need to have Administrator privileges to install IPOP-VPN.

1. Download [IPOP-VPN for Windows](https://github.com/ipop-project/Downloads/releases/download/v16.08.1/ipop-v16.08.1_win.zip).

1. Extract the contents of the archive to a directory, e.g., ipop-vpn

1. Start an Admin Windows Powershell and change to the ipop-vpn directory previously created

1. Enter the following commands:
    ```
    PowerShell -ExecutionPolicy Unrestricted
    .\ipop-setup
    ```
1. Follow the prompts to install and setup IPOP


1. While installing Social VPN, copy the "ip4" entry from "AddressMapper" to "CFx", e.g.,
    ```
    ip4": "172.31.0.100" 
    ```
1. Finally, double click ipop-start to run IPOP. Closing this console window will terminate IPOP.

Note: A Windows Firewall exception is created for IPOP-VPN, but you have to create your own for exceptions for other services such as ICMP Echo (ping).

### TLDR
If you are using an earlier version of Windows such as 7, 8, Server 2008, or 2012, you will need to manually setup IPOP. Below are the necessary steps to accomplish this.

### Manual Setup
1. Install [MS Visual C++ x86 Redistributable Packages for Visual Studio 2010](https://download.microsoft.com/download/5/B/C/5BC5DBB3-652D-4DCE-B14A-475AB85EEF6E/vcredist_x86.exe').

1. Install [Python 3.5 for Windows](https://www.python.org/ftp/python/3.5.2/python-3.5.2-amd64-webinstall.exe).

1. Install [tap-installer from OpenVPN](https://swupdate.openvpn.org/community/releases/tap-windows-9.21.2.exe).

1. Download [IPOP-VPN for Windows](https://github.com/ipop-project/Downloads/releases/download/v16.08.1/ipop-v16.08.1_win.zip).

1. Extract the contents of the archive to a directory, e.g., ipop-vpn

1. Decide if you want to run [GroupVPN or Social VPN](Planning Your Network) and copy the appropriate sample config to the ipop-vpn directory. Use one of the following for group or social VPN respectively:
```
    cp .\controller\modules\sample-gvpn-config.json .\config.json
```
```
    cp .\controller\modules\sample-svpn-config.json .\config.json
```
1. Update your [config file](Configuration) with your XMPP credentials and other details. For SocialVPN you only need to add the XMPP server IP, your XMPP client user id and password. For GroupVPN you will need to add your static virtual IP. 

1. Install Sleek XMPP. Python will have to be in your PATH environment or you will need to provide the path to the pip executable.
   pip install sleekxmpp

1. Rename the TAP-Windows Adapter to _ipop_. From the Control Panel choose _View network status and tasks_ under Network and Internet. On the right side-bar click _change adapter settings_. Select the _TAP Windows Adapter V9_ and rename it to "ipop".

1. Configure the IPOP Adapter IPv4 interface with a static IP address and subnet mask that will be use for the virtual network. Alternatively you can download download [set_interface](https://github.com/ipop-project/Release-Management/blob/master/Deployment/win/setup_interface.bat) and [win32_netsh_setup] (https://github.com/ipop-project/Release-Management/blob/master/Deployment/win/win32_netsh_setup.py) to your IPOP directory and run the _setup_interface.bat _ batch file as Admin.

1. Finally, double click ipop-start to run IPOP


---

# Key Points Summary

Enter the following commands:

```
PowerShell -ExecutionPolicy Unrestricted
.\ipop-setup
```