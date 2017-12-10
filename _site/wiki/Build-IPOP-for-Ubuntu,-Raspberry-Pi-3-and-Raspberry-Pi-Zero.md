# Build IPOP for Ubuntu, Raspberry Pi 3 and Raspberry Pi Zero

| | Description |
|---|---|
| **Tested on** | Ubuntu 14.04 and 16.04 x64<br />Raspbian Stretch on Raspberry Pi 3<br />Raspbian Stretch on Raspberry Pi Zero |
| **Time** | ~ 20 Minutes |
| **Question(s)** | - How to build IPOP? |
| **Objective(s)**| - Build IPOP Source Code |

## Download and Install Dependencies

```shell
sudo apt-get update -y
sudo apt-get install -y software-properties-common git make libssl-dev make g++-4.9 
sudo apt-get install -y python3 python-pip python-dev
sudo pip install sleekxmpp psutil pystun
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.9 10 
```

## Build IPOP

Run the following commands as a regular (non-root) user:

```shell
mkdir -p ~/workspace/ipop-project ~/workspace/ipop-vpn/config
cd workspace/ipop-project/
git clone https://github.com/ipop-project/Tincan
```

**Ubuntu, x86_64:**
```
git clone -b ubuntu-x64 --single-branch https://github.com/ipop-project/3rd-Party-Libs.git Tincan/external/3rd-Party-Libs
```

**Raspberry Pi 3, ARMv7:**
```
git clone -b rpi3-arm7 --single-branch https://github.com/ipop-project/3rd-Party-Libs.git Tincan/external/3rd-Party-Libs
```

**Raspberry Pi Zero, ARMv6:**
```
git clone -b rpi0-arm6 --single-branch https://github.com/ipop-project/3rd-Party-Libs.git Tincan/external/3rd-Party-Libs
```

Then:

```
git clone https://github.com/ipop-project/Controllers
cd Tincan/trunk/build/
make
cp -f ../out/release/$(uname -m)/ipop-tincan ../../../../ipop-vpn/
cd ../../../Controllers
cp -rf ./controller/ ../../ipop-vpn/
```

## Copy Configuration File

You will need a valid configuration file (ipop-config.json) to run IPOP. Go to the directory you have your config file and copy the file to the `config` directory:
```shell
cp ipop-config.json ~/workspace/ipop-vpn/config
```