# Use IPOP on CentOS, Manually

**Warning: This document may be out of date.**

| | Description |
|---|---|
| **Tested on** | CentOS 7 x64 |
| **Estimated** | ~ 10 Minutes |
| **Question(s)** | - How to install IPOP?<br /> - How to run IPOP?<br /> - How to remove IPOP? |
| **Objective(s)**| - Install IPOP<br /> - Run IPOP<br /> - Stop IPOP<br /> - Remove IPOP |

## Download and Install Dependencies

```shell
sudo apt-get update -y
sudo apt-get install -y software-properties-common git make libssl-dev make g++-4.9 
sudo apt-get install -y python3 python-pip python-dev
sudo pip install sleekxmpp psutil pystun
```

## Get IPOP Binary

Download the proper version of IPOP from [our latest release].

Then go to the download directory and extract the file (Put in the actual file name):

```shell
tar -xzvf ipop-vxxx_centos7.tar.gz
cd ipop-vxxx_centos7
```

## Copy Configuration File

You will need a valid configuration file (ipop-config.json) to run IPOP. Go to the directory you have your config file and copy the file to the `config` directory:

```shell
cp PATH/TO/CONFIGFILE/ipop-config.json config/
```

## Run IPOP TinCan

```shell
scl enable rh-python35 bash
sudo ./ipop-tincan &
```

## Run IPOP Controller

```shell
scl enable rh-python35 bash
python -m controller.Controller -c ./config/ipop-config.json &
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
python -m controller.Controller -c ./config/ipop-config.json &
```

- Stop IPOP:

```shell
sudo killall ipop-tincan  
ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9
```


[our latest release]: https://github.com/ipop-project/Downloads/releases