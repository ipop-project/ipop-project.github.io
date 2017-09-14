### NOTE: This guide is for running the current development build. If you are interested in the existing stable release please use this [installation](https://github.com/ipop-project/ipop-project.github.io/wiki/Installation) guide.

1.  See the [instructions](https://github.com/ipop-project/ipop-project.github.io/wiki/Building-the-Code) for building Tincan

1.  Install dependencies
    ```bash
    sudo apt-get install -y python3 python-pip python-dev
    sudo pip install --upgrade pip
    sudo pip install sleekxmpp psutil
    ```

1.  Clone Controller
    ```bash
    mkdir -p ~/workspace/ipop-project
    mkdir -p ~/workspace/ipop-vpn/config
    cd ~/workspace/ipop-project/
    git clone https://github.com/ipop-project/Controllers
    cd ./Controllers
    git checkout master
    cp -rf ./controller/ ../../ipop-vpn/
    cd ../../ipop-vpn
    ```
1.  Copy the Tincan executable you previously created.  
    `cp -f ~/workspace/ipop-project/Tincan/trunk/out/release/x64/ipop-tincan ~/workspace/ipop-vpn`

1.  Copy and edit your config file.  
See [Configuring](https://github.com/ipop-project/ipop-project.github.io/wiki/Configuration) your network more details, but the only the XMPP details are necessary to get started.  
    `cp ~/workspace/ipop-project/Controllers/controller/sample-gvpn-config.json ~/workspace/ipop-vpn/config/ipop-config.json`  

1.  Start the IPOP-VPN processes
Check your firewall, both host and guest if virtualized.  
    ```bash
    sudo ./ipop-tincan &
    python -m controller.Controller -c ./config/ipop-config.json &
    ```

1.  Terminate IPOP-VPN
    ```bash
    sudo killall ipop-tincan  
    ps aux | grep -v grep | grep controller.Controller | awk '{print $2}' | xargs sudo kill -9 
    ```