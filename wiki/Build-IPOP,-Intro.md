# Build IPOP, Intro

## Supported Operating Systems and Platforms

We currently support the following operating systems and platforms:
- [Ubuntu 14.04 and 16.04, 64-bit](Build-IPOP-for-Ubuntu)
- [Raspbian Stretch on Raspberry Pi 3, ARMv7](Build-IPOP-for-Raspbian-on-Raspberry-Pi-3)
- [Raspbian Stretch on Raspberry Pi Zero, ARMv6](Build-IPOP-for-Raspbian-on-Raspberry-Pi-Zero)
- [Microsoft Windows 10, 64-bit](Build-IPOP-for-Windows)
- [CentOS 7, 64-bit](Build-IPOP-for-CentOS)

## Other Operating Systems and Platforms

If the requirements are met, for other versions and flavors of Ubuntu or other Debian-based Linux distros, our Ubuntu release should work out-of-the-box. Raspberry Pi 2 and other Debian-based ARMv7 devices should work with Raspberry Pi 3 release, and Raspberry Pi 1 and other Debian-based ARMv6 devices should work with Raspberry Pi Zero release. If not, you may need to build IPOP code manually on that machine. There is a chance you also need to build WebRTC static libraries before that.

For Debian-based operating systems on x64 machines, the building process would be very similar to Ubuntu, and for Debian-based operating systems on ARM7 and ARM6 machines, it'd be like Raspberry Pi 3 and raspberry Pi Zero.