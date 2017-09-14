### NOTE: These instructions are only for building the [source code](https://github.com/ipop-project/Tincan) at the HEAD of the Tincan repository Master branch. We are unable to provide instructions for building previous versions. 
## Install dependencies
1.  On Ubuntu 16.04  
    ```bash   
    sudo apt-get install -y software-properties-common git make libssl-dev g++-4.9  
    sudo rm /usr/bin/g++
    sudo ln -s /usr/bin/g++-4.9 /usr/bin/g++ 
    ```

2.  On CentOS 7

    ```bash
      su
      yum -y update
      yum install -y centos-release-scl-rh
      yum install -y devtoolset-3-gcc-c++ rh-python35
      yum install -y git nss-devel openssl-devel
      scl enable devtoolset-3 bash
    ```

##  Clone Tincan repo and build source code.
If building on CentOS 7 update line 13 of your Makefile.   
`LDIR = ../../external/lib/release/x64/centos`
    
  ```bash
  mkdir -p ~/workspace/ipop-project
  cd ~/workspace/ipop-project/
  git clone https://github.com/ipop-project/Tincan
  cd Tincan
  git checkout master
  cd trunk/build/
  make
  ```

The created binary is at `~/workspace/ipop-project/Tincan/trunk/out/release/x64/ipop-tincan`

The next step is to use this executable to [deploy and run](https://github.com/ipop-project/ipop-project.github.io/wiki/Running-a-development-build) an IPOP-VPN instance.