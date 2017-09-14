# Build IPOP for Ubuntu

| | Description |
|---|---|
| **Tested on** | Ubuntu 14.04 and 16.04 x64 |
| **Time** | ~ 10 Minutes |
| **Question(s)** | - How to build IPOP? |
| **Objective(s)**| - Build IPOP Source Code |

## Download and Install Dependencies

```shell
sudo apt-get update -y
sudo apt-get install -y software-properties-common git make libssl-dev make g++-4.9 
sudo apt-get install -y python3 python-pip python-dev
sudo pip install sleekxmpp psutil pystun
sudo rm /usr/bin/g++
sudo ln -s /usr/bin/g++-4.9 /usr/bin/g++ 
```

## Build IPOP

Run the following commands as a regular (non-root) user:

```shell
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
```shell
cp ipop-config.json ~/workspace/ipop-vpn/config
```

---

# Key Points Summary

- Build IPOP:

```shell
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