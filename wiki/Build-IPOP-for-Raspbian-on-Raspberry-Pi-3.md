# Build IPOP for Raspbian on Raspberry Pi 3

| | Description |
|---|---|
| **Tested on** | Raspbian Jessie and Stretch on Raspberry Pi 3 |
| **Time** | ~ 20 Minutes |
| **Question(s)** | - How to build IPOP? |
| **Objective(s)**| - Build IPOP Source Code |

## Download and Install Dependencies

```
sudo apt-get update -y
sudo apt-get install -y software-properties-common git make libssl-dev g++-4.9
sudo pip3 install --upgrade pip
sudo pip3 install sleekxmpp psutil requests
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.9 10
```

## Build IPOP

Run the following commands as a regular (non-root) user:

```
mkdir -p ~/workspace/ipop-project ~/workspace/ipop-vpn/config
cd ~/workspace/ipop-project/
git clone https://github.com/ipop-project/Tincan
git clone https://github.com/ipop-project/3rd-Party-Libs.git ~/workspace/ipop-project/Tincan/external
git clone https://github.com/ipop-project/Controllers
```

```
cd Tincan/trunk/build/
make
cp -f ../out/release/arm7/ipop-tincan ../../../../ipop-vpn/
cd ../../../Controllers
cp -rf ./controller/ ../../ipop-vpn/
```

## Copy Configuration File

You will need a valid configuration file (ipop-config.json) to run IPOP. Go to the directory you have your config file and copy the file to the `config` directory:
```
cp ipop-config.json ~/workspace/ipop-vpn/config
```