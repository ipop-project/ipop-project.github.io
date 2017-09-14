Tested on Ubuntu 14.04

These instructions are derived from these links:

* https://sites.google.com/a/chromium.org/dev/developers/how-tos/install-depot-tools
* http://www.webrtc.org/native-code/development/prerequisite-sw
* http://www.webrtc.org/native-code/development
* http://www.html5rocks.com/en/tutorials/webrtc/basics/

## Download dependencies
1.  Install dependencies

    a. For Ubuntu and Debian

    ```bash
    sudo apt-get update
    sudo apt-get install default-jdk pkg-config git subversion make gcc g++ python
    sudo apt-get install libexpat1-dev libgtk2.0-dev libnss3-dev libssl-dev 
    ```

2.  Download depot_tools for chromium repo

    ```bash
    mkdir libjingle; cd libjingle
    git clone --depth 1 https://chromium.googlesource.com/chromium/tools/depot_tools.git
    ```

3.  Set up environmental variables and prepare local environment

    a. For Ubuntu and Debian

    ```bash
    export JAVA_HOME=/usr/lib/jvm/default-java
    export PATH="$(pwd)/depot_tools:$PATH"
    export GYP_DEFINES="use_openssl=1"
    ```

4. (Optional) For 32-bit compilation set target_arch

    ```bash
    export GYP_DEFINES="$GYP_DEFINES target_arch=ia32"
    ```

## Download source code

1.  Configure gclient to download libjingle code. 

    ```bash
    gclient config --name=trunk https://webrtc.googlecode.com/svn/branches/3.52
    ```
    
2.  Download libjingle and dependencies (this may take a while). You may probably see some errors like this: _`Error: Command 'svn checkout http://src.chromium.org/svn/trunk/src/third_party/expat@245382 /users/PengH/libjingle/trunk/third_party/expat --revision 245382 --non-interactive --force --ignore-externals' returned non-zero exit status 1 in /users/PengH/libjingle`_. This is because the chromium has moved the libjingle-3.52 from **http** to **https**. Please ignore it for now and follow the instruction.

    ```bash
    gclient sync --force
    ```

3.  Download ipop-tincan from github.com/ipop-project

    ```bash
    cd trunk/talk; mkdir ipop-project; cd ipop-project
    git clone --depth 1 https://github.com/ipop-project/ipop-tap.git
    git clone --depth 1 https://github.com/ipop-project/ipop-tincan.git
    ```

4.  Return to libjingle trunk directory (/path_to_trunk/trunk/)

    ```bash
    cd ../../
    ```

5.  Copy modified gyp files to trunk/talk directory

    ```bash
    rm -f DEPS all.gyp talk/libjingle.gyp talk/ipop-tincan.gyp
    cp talk/ipop-project/ipop-tincan/build/ipop-tincan.gyp talk/
    cp talk/ipop-project/ipop-tincan/build/libjingle.gyp talk/
    cp talk/ipop-project/ipop-tincan/build/all.gyp .
    cp talk/ipop-project/ipop-tincan/build/DEPS .
    ```

6. Update some configuration files to pull the libjingle-3.52 from https

    ```bash
    nano DEPS
    ```
    
    ```
    line13: "chromium_trunk" : "http://src.chromium.org/svn/trunk", 
    ->
    line13: "chromium_trunk" : "https://src.chromium.org/svn/trunk", 
    ```

7. Run the **gclient sync** command again to continue the downloading libjingle libs and dependencies
    
    ```bash
    gclient sync --force
    ```

8. From step 6, you will get two directories called **chromium_deps** and **chromium_gn** in the /path/to/libjingle/ directory (same dir with trunk). Now enter the chromium_deps dir to make some changes. 
    
    ```bash
    cd ../chromium_deps
    nano DEPS
    ```

    ```
    line20: "llvm_url": "http://src.chromium.org/llvm-project", 
    ->
    line20: "llvm_url": "https://src.chromium.org/llvm-project", 
    ```

9. Now you are good to go. Please run the **gclient sync** again to finish the downloading (this might take a while)
    
    ```bash
    cd ../trunk
    gclient sync --force
    ```

## Build ipop-tincan for Linux

1.  Generate ninja build files

    ```bash
    gclient runhooks --force
    ```

2.  Build tincan for linux (binary localed at out/Release/ipop-tincan)

    ```bash
    ninja -C out/Release ipop-tincan
    ```

3.  To build debug version with gdb symbols (but creates 25 MB binary)

    ```bash
    ninja -C out/Debug ipop-tincan
    ```

4.  The generated binary is located at `out/Release/ipop-tincan` or
    `out/Debug/ipop-tincan`
