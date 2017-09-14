# Build IPOP, Intro

## Supported Operating Systems and Platforms

We currently support the following operating systems and platforms:
- Ubuntu 14.04 and 16.04 - x64
- Raspbian Jessie and Stretch on Raspberry Pi 3 - ARM7
- CentOS 7 - x64
- Microsoft Windows 10 - x64

## Other Operating Systems and Platforms

If the requirements are met, for other versions and flavors of Ubuntu or other Debian-based Linux distros, our Ubuntu release should work out-of-the-box. Other versions of Raspberry Pi such as Raspberry Pi 2 and Raspberry Pi Zero and also other Debian-based operating systems on ARM architecture, such as Orange Pi, will most probably work with our Raspberry Pi 3 release. If it didn't work, you may need to build IPOP code manually on that machine. There is a chance you also need to build WebRTC static libraries before that.

For Debian-based operating systems on x64 machines, the building process would be very similar to Ubuntu and for Debian-based operating systems on ARM machines, it'd be like Raspberry Pi 3.

### Downgrading GCC to 4.9

The IPOP code build process currently just works with `gcc-4.9` and you may need to downgrade your `gcc`. `g++-4.9` is not available on Debian releases after Debian 8, "Jessie", and you need to build it from the source code or add "Jessie" repositories to your source list:
Open `/etc/apt/source.list/` and add the following line to the file and save it:
```shell
deb http://http.debian.net/debian jessie main
```
You may need to remove `gcc-4.9-base` before continuing:
```shell
sudo apt update && sudo apt remove -y gcc-4.9-base
```
Then you need to run the update and install `g++-4.9`:
```shell
sudo apt update && sudo apt install -y g++-4.9
```
After you built the code successfully, it is safe to undo the changes to the source list and upgrade `gcc` to the latest version.