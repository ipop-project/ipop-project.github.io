# Use IPOP on Ubuntu and Raspberry Pi, Manually

|  | Description |
|---|---|
| **Tested on** | Ubuntu 16.04 and 18.04 x64<br />Raspbian Jessie and Stretch on Raspberry Pi 3<br />Raspbian Stretch on Raspberry Pi Zero |
| **Time** | ~ 10 Minutes |
| **Question(s)** | - How to install IPOP?<br /> - How to run IPOP?<br /> - How to remove IPOP? |
| **Objective(s)**| - Install IPOP<br /> - Run IPOP<br /> - Stop IPOP<br /> - Remove IPOP |

## Download and Install Dependencies

```shell
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip iproute2 openvswitch-switch 
sudo -H pip3 install psutil sleekxmpp requests
```

## Get IPOP Binary

Download the proper version of IPOP from [our latest release].

Then go to the download directory and extract the file (Put in the actual file name):

```shell
tar -xzvf ipop-vxxx.tar.gz
cd ipop-vxxx
```

## Copy Configuration File

You will need a valid configuration file (ipop-config.json) to run IPOP. Go to the directory you have your config file and copy the file to the `config` directory:

```shell
cp PATH/TO/CONFIGFILE/ipop-config.json config/
```

## Run IPOP

### Run IPOP TinCan

```shell
sudo ./ipop-tincan &
```

### Run IPOP Controller

```shell
python3 -m controller.Controller -c ./config/ipop-config.json &
```

Now, if everything is going well, IPOP should be run.

## Stop IPOP

### Stop IPOP Tincan

```shell
sudo killall ipop-tincan  
```

### Stop IPOP Controller

```shell
ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9
```

## Remove IPOP

To uninstall IPOP, its is safe to stop it first and then remove the IPOP execution directory.

---

# Key Points Summary

- Run IPOP:

```shell
sudo ./ipop-tincan &
python3 -m controller.Controller -c ./config/ipop-config.json &
```
- Stop IPOP:

```shell
sudo killall ipop-tincan  
ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9
```

[our latest release]: https://github.com/ipop-project/Downloads/releases