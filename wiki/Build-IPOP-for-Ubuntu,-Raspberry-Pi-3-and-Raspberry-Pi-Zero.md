# Build IPOP for Ubuntu, Raspberry Pi 3 and Raspberry Pi Zero

| | Description |
|---|---|
| **Tested on** | Ubuntu 14.04 and 16.04 x64<br />Raspbian Stretch on Raspberry Pi 3<br />Raspbian Stretch on Raspberry Pi Zero |
| **Time** | ~ 20 Minutes |
| **Question(s)** | - How to build IPOP? |
| **Objective(s)**| - Build IPOP Source Code |

## Download and Install Dependencies

```shell
sudo apt update -y
sudo apt install -y git make libssl-dev g++-5 python3 python3-pip python3-dev
sudo -H pip3 install --upgrade pip
sudo -H pip3 install sleekxmpp psutil requests 
```

## Build IPOP

Run the following commands as a regular (non-root) user:

```shell
mkdir -p ~/workspace/ipop-project ~/workspace/ipop-vpn/config
cd ~/workspace/ipop-project/
```

### Get Tincan and WebRTC Libraries

**Note:** If you have already built the WebRTC libraries yourself following this Wiki's instructions, this step is already done and you should skip it.

**For `master` branch (Development):**

```
git clone https://github.com/ipop-project/Tincan
```

**For other branches, for instance `bh1` (Latest Stable Release):**

```
git clone -b bh1 --single-branch https://github.com/ipop-project/Tincan
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
git clone -b rpizero-arm6 --single-branch https://github.com/ipop-project/3rd-Party-Libs.git Tincan/external/3rd-Party-Libs
```

### Get Controllers

**For `master` branch (Development):**

```
git clone https://github.com/ipop-project/Controllers
```

**For other branches, for instance `bh1` (Latest Stable Release):**

```
git clone -b bh1 --single-branch https://github.com/ipop-project/Controllers
```

```
cd Tincan/trunk/build/
make
cp -f ../out/release/$(uname -m)/ipop-tincan ../../../../ipop-vpn/
cd ../../../Controllers
cp -rf ./controller/ ../../ipop-vpn/
```

## Copy Configuration File

You will need a valid configuration file (`ipop-config.json`) in `ipop-vpn/config` directory to run IPOP. You may find a sample config file in the `Controllers` repo root which you have already cloned into your machine.