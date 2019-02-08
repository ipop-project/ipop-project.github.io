# Build IPOP for CentOS

**Warning: This document may be out of date.**

| | Description |
|---|---|
| **Tested on** | CentOS 7 x64 |
| **Time** | ~ 10 Minutes |
| **Question(s)** | - How to build IPOP? |
| **Objective(s)**| - Build IPOP Source Code |

## Download and Install Dependencies

```
su
yum -y update
yum install -y centos-release-scl-rh
yum install -y devtoolset-3-gcc-c++ rh-python35
yum install -y git nss-devel openssl-devel
scl enable devtoolset-3 bash
scl enable rh-python35 bash
curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
python get-pip.py
yum install -y python-devel.x86_64
pip install sleekxmpp psutil pystun
```

## Build IPOP

Run the following commands as a regular (non-root) user:

```
scl enable rh-python35 bash
scl enable devtoolset-3 bash
mkdir -p ~/workspace/ipop-project ~/workspace/ipop-vpn/config
cd workspace/ipop-project/
git clone https://github.com/ipop-project/Tincan
git clone https://github.com/ipop-project/Controllers
cd Tincan
cd trunk/build/
make
cp -f ../out/release/x64/ipop-tincan ../../../../ipop-vpn/
cd ../../../Controllers
cp -rf ./controller/ ../../ipop-vpn/
```

## Copy Configuration File

You will need a valid configuration file (ipop-config.json) to run IPOP. Go to the directory you have your config file and copy the file to the `config` directory:
```
cp ipop-config.json ~/workspace/ipop-vpn/config
```