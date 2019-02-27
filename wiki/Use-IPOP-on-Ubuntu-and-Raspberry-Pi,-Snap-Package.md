# Use IPOP on Ubuntu and Raspberry Pi, Snap Package

|  | Description |
|---|---|
| **Tested on** | Ubuntu 16.04 and 18.04 x64<br />Ubuntu Core 16 on Raspberry Pi 3<br />Ubuntu Server 18.10 on Raspberry Pi 3 |
| **Time** | ~ 10 Minutes |

## Install IPOP Snap Package

```
sudo snap install ipopvpn_<package-version>.snap --devmode
```

## Configuration File

A sample configuration file is available [here](https://raw.githubusercontent.com/ipop-project/Controllers/master/controller/sample-multi-overlay-config.json). Copy IPOP config file to `/root/snap/ipopvpn/current/config.json`. Don't forget to edit the following lines:

Under `CFx` add `"NidFileName": "/root/snap/ipopvpn/current/nid"`.

Under `Directory`, change `"Directory": "/root/snap/ipopvpn/logs/"`.

Under `Signal` > `Overlays` , the overlay's `HostAddress`, `Username`, and `Password`.

Under `BridgeController` > `Overlays`, the overlay's `IP4` address.

These changes are mandatory to run IPOP VPN Snap package. You may want to apply further changes to the configuration file. Here is the guide to [Understanding the IPOP Configuration](Understanding-the-IPOP-Configuration).

## Run IPOP

```
sudo ipopvpn.tincan &
sudo ipopvpn.controller &
```