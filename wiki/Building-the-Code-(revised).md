You will need a valid configuration file (ipop-config.json) to run ipop!


## Download Dependencies

1. Install Dependencies

 a. For Ubuntu 14

      sudo add-apt-repository ppa:ubuntu-toolchain-r/test
      sudo apt-get update -y
      sudo apt-get -y upgrade
      sudo apt-get install -y software-properties-common git make libssl-dev make g++-4.9 
      sudo apt-get install -y python3 python-pip python-dev
      sudo pip install sleekxmpp psutil pystun
      sudo rm /usr/bin/g++
      sudo ln -s /usr/bin/g++-4.9 /usr/bin/g++ 

 b. For CentOS 7

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


Open a new terminal as the regular (non-root) user

If on CentOS 7
```
      scl enable rh-python35 bash
      scl enable devtoolset-3 bash
```

```
  mkdir -p workspace/ipop-project
  mkdir -p workspace/ipop-vpn/config
  cd workspace/ipop-project/
  git clone https://github.com/ipop-project/ipop-tincan
  git clone https://github.com/ipop-project/controllers
  cd ipop-tincan
  git checkout v2_wip
  cd trunk/build/
  make
  cp -f ../out/debug/ipop-tincan ../../../../ipop-vpn/
  cd ../../../controllers
  git checkout v2_wip
  cp -rf ./controller/ ../../ipop-vpn/
  cd ../../ipop-vpn
  sudo ./ipop-tincan
```


In another new terminal

If on CentOS 7
```
      scl enable rh-python35 bash
```


Copy over your config file


```
  cd workspace/ipop-vpn/
  python -m controller.Controller -c ./config/ipop-config.json
```

Check your firewall, both host and guest if virtualized.


Terminate IPOP-VPN
```
sudo killall ipop-tincan  
ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9 
```


On Windows 10
Requires Visual Studio 15 Community Ed or greater with C++ tools.
If using community edition you must install C++ tools separately from VS add/remove programs.
Install Win 10 SDK, depending on the build revision you get you may have to retarget solution from project solution.


```
  mkdir -p workspace/ipop-project
  mkdir -p workspace/ipop-vpn/config
  cd workspace/ipop-project/
  git clone https://github.com/ipop-project/ipop-tincan
  git clone https://github.com/ipop-project/controllers
  cd ipop-tincan
  git checkout v2_wip
  cd ../controllers
  git checkout v2_wip
```

Open the VS Tincan solution located at workspace/ipop-project/ipop-tincan/trunk/build/tincan.sln

Grab this [zip](https://www.dropbox.com/s/1tonispv0autc91/ipop-vpn_windlls.zip?dl=0)

and extract to workspace/ipop-vpn.

Run power shell window as admin
```
PowerShell.exe -ExecutionPolicy Unrestricted
ipop-setup.ps1
```
Copy your config file when prompted.

