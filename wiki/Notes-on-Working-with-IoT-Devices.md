# Notes on Working with IoT Devices

## Find IP Address of a Device in the Network without a Monitor

For instance, if you want to find a Raspberry Pi connected to the local network without a connection to a monitor:

```bash
sudo nmap -sn 10.244.19.0/24
```

In the output, you should find it. For instance:

```
Nmap scan report for 10.244.19.227
Host is up (0.00027s latency).
MAC Address: B8:27:EB:82:48:A0 (Raspberry Pi Foundation)
```

Remember to run it with `sudo` to get the platform details. Do NOT repeat it multiple times or for a very large subnet. The system may get blocked in the network because of spamming.

## Install Packages on OpenWRT

For instance, `gcc`:

```
opkg update && opkg install gcc
```

[OpenWrt » Technical Reference » OPKG Package Manager](https://wiki.openwrt.org/doc/techref/opkg)

## Compile a Simple C Code on OpenWRT

```
gcc -mfloat-abi=hard hello.c -o hello
```

## Determine File Type

For instance, a file which is built for running on Raspberry Pi 1:

```
file ipop-tincan-rpi1
```
Output:

```
ipop-tincan-rpi1: ELF 32-bit LSB executable, ARM, EABI5 version 1 (GNU/Linux), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, for GNU/Linux 2.6.32, BuildID[sha1]=c24056bbd7c9f90660087db2c1296ae3b7dca93b, not stripped
```

## Cross-compile Code for OpenWRT

Requirement:

```
sudo apt update && sudo apt install ccache libncursesw5-dev
```

## Git on OpenWRT

```
opkg install git-http
opkg install ca-bundle
```

## Expand the Root Partition on OpenWRT

By default, the root partition on the OpenWRT SD card is very small. You can expand it to using "GParted" or other tools on Linux or other operating systems.

## Ubuntu 17.10 and CiscoAnyconnect for UF VPN

If you are running Ubuntu 17.10 and fail to install/start Cisco Anyconnect (version 4.5.0.2033):

```
sudo apt install libpangox-1.0-0
```

[Source](https://zngguvnf.org/2017-12-04--ubuntu-17-10-and-cisco-anyconnect.html)

## Error in Installing Ubuntu or Linux Mint: The grub-efi-amd64-signed package failed to install into /target/.

[Create an EFI system Partition](https://help.ubuntu.com/community/UEFI#Creating_an_EFI_System_Partition) before installing the OS.

## Add Menu Entry to GRUB

[Source](https://help.ubuntu.com/community/Grub2/CustomMenus)

## Change GRUB Timeout

In `/etc/default/grub`:

```
GRUB_TIMEOUT=3
GRUB_RECORDFAIL_TIMEOUT=3
```

Then:

```
sudo update_grub2
```

[Source](https://askubuntu.com/questions/932595/where-to-change-30-seconds-for-grub-on-forced-reset?answertab=active#tab-top)