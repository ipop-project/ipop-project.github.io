# Build WebRTC Libraries for Linux

| | Description |
|---|---|
| **Tested on** | Ubuntu 14.04 and 16.04 x64 |
| **Time** | ~ 45 Minutes |
| **Question(s)** | - How to build WebRTC on Linux?<br /> - How to extract WebRTC static libraries for building IPOP? |
| **Objective(s)**| - Build the WebRTC Libraries<br /> - Extract required WebRTC Static Libraries for Building IPOP |

## Install Toolchain

```shell
mkdir -p ~/workspace/ && cd ~/workspace/
```

Install the Chromium depot tools

  First, get the repository of `depot_tools`:
  
  ```shell
  git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
  ```
  Then, add `depot_tools` to your PATH:

  ```shell
  export PATH=`pwd`/depot_tools:"$PATH"
  ```

## Download the WebRTC source code
1.  Create a working directory, enter it, and run `fetch webrtc`:

  ```shell
  mkdir webrtc-checkout
  cd webrtc-checkout
  fetch --nohooks webrtc
  ```

2.  These instructions work on branch-heads/57.
  ```shell
  cd src
  git checkout branch-heads/57
  ```

3.  Download the code
  ```shell
  gclient sync
  ```

**Note:** _The download will take a while, but it no longer downloads the Chromium repository after branch-head/57. Do not interrupt this step or you may need to start all over again (a new gclient sync may be enough, but you might also need to wipe your webrtc_checkout\src folder and start over)._


## (Optional) Update your checkout
To update an existing checkout, you can run
```
git rebase-update
gclient sync
```
The first command updates the primary Chromium source repository and rebases any of your local branches on top of tip-of-tree (aka the Git branch origin/master). If you don't want to use this script, you can also just use git pull or other common Git commands to update the repo.

The second command syncs the sub-repositories to the appropriate versions and re-runs the hooks as needed.

## Build WebRTC libraries
These gn flags are critical for compatiabilty with tincan. Turn off iterator_debugging or the mangled symbol names will not match; it causes a debug prefix to added to STL container names. Also, all the pieces of libboringssl do not get assembled. My approach to was to turn off component builds and switch from a shared to a static library and then manually create the libboringssl_asm.a file. The default configuration is for a 64-bit debug build:
  ```shell
  gn gen out/debug-x64 "--args=enable_iterator_debugging=false is_component_build=false"
  ninja -C out/debug-x64/ boringssl field_trial_default protobuf_lite p2p base jsoncpp
  ```  
  To create a 64-bit release build you must set is_debug = false
  ```shell
  gn gen out/release-x64 "--args=enable_iterator_debugging=false is_component_build=false is_debug=false"
  ninja -C out/release-x64/ boringssl field_trial_default protobuf_lite p2p base jsoncpp
  ```

## Extract the static libraries 

### Get TinCan Source Code

Switch to the workspace directory:

```shell
cd ~/workspace/
```
Create `ipop-project` directory and download the TinCan repository there:

```shell
mkdir -p ipop-project/ && git clone https://github.com/ipop-project/Tincan.git ipop-project/Tincan
mkdir -p ipop-project/Tincan/external/3rd-Party-Libs/release ipop-project/Tincan/external/3rd-Party-Libs/debug
```

### Copy the WebRTC Libraries to TinCan

These freshly built libraries will replace the existing libraries.

Currently, the libraries we need from out/Debug_x64 and out/Release_x64 are: 

**Release**

```
ar -rcs ipop-project/Tincan/external/3rd-Party-Libs/release/libboringssl_asm.a webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/aes-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/aesni-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/bsaes-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/vpaes-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/rsaz-avx2.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/x86_64-mont.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/x86_64-mont5.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/chacha-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/p256-x86_64-asm.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/md5-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/aesni-gcm-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/ghash-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/rdrand-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/sha1-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/sha256-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/sha512-x86_64.o webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/boringssl_asm/x25519-asm-x86_64.o

ar -rcs ipop-project/Tincan/external/3rd-Party-Libs/release/libjsoncpp.a webrtc-checkout/src/out/release-x64/obj/third_party/jsoncpp/jsoncpp/json_reader.o webrtc-checkout/src/out/release-x64/obj/third_party/jsoncpp/jsoncpp/json_value.o webrtc-checkout/src/out/release-x64/obj/third_party/jsoncpp/jsoncpp/json_writer.o

cp webrtc-checkout/src/out/release-x64/obj/third_party/boringssl/libboringssl.a ipop-project/Tincan/external/3rd-Party-Libs/release
cp webrtc-checkout/src/out/release-x64/obj/webrtc/system_wrappers/libfield_trial_default.a ipop-project/Tincan/external/3rd-Party-Libs/release
cp webrtc-checkout/src/out/release-x64/obj/webrtc/base/librtc_base.a ipop-project/Tincan/external/3rd-Party-Libs/release
cp webrtc-checkout/src/out/release-x64/obj/webrtc/base/librtc_base_approved.a ipop-project/Tincan/external/3rd-Party-Libs/release
cp webrtc-checkout/src/out/release-x64/obj/webrtc/p2p/librtc_p2p.a ipop-project/Tincan/external/3rd-Party-Libs/release
cp webrtc-checkout/src/out/release-x64/obj/third_party/protobuf/libprotobuf_lite.a ipop-project/Tincan/external/3rd-Party-Libs/release
```

**Debug**

```shell
ar -rcs ipop-project/Tincan/external/3rd-Party-Libs/debug/libboringssl_asm.a webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/aes-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/aesni-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/bsaes-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/vpaes-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/rsaz-avx2.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/x86_64-mont.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/x86_64-mont5.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/chacha-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/p256-x86_64-asm.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/md5-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/aesni-gcm-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/ghash-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/rdrand-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/sha1-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/sha256-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/sha512-x86_64.o webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/boringssl_asm/x25519-asm-x86_64.o

ar -rcs ipop-project/Tincan/external/3rd-Party-Libs/debug/libjsoncpp.a webrtc-checkout/src/out/debug-x64/obj/third_party/jsoncpp/jsoncpp/json_reader.o webrtc-checkout/src/out/debug-x64/obj/third_party/jsoncpp/jsoncpp/json_value.o webrtc-checkout/src/out/debug-x64/obj/third_party/jsoncpp/jsoncpp/json_writer.o

cp webrtc-checkout/src/out/debug-x64/obj/third_party/boringssl/libboringssl.a ipop-project/Tincan/external/3rd-Party-Libs/debug
cp webrtc-checkout/src/out/debug-x64/obj/webrtc/system_wrappers/libfield_trial_default.a ipop-project/Tincan/external/3rd-Party-Libs/debug
cp webrtc-checkout/src/out/debug-x64/obj/webrtc/base/librtc_base.a ipop-project/Tincan/external/3rd-Party-Libs/debug
cp webrtc-checkout/src/out/debug-x64/obj/webrtc/base/librtc_base_approved.a ipop-project/Tincan/external/3rd-Party-Libs/debug
cp webrtc-checkout/src/out/debug-x64/obj/webrtc/p2p/librtc_p2p.a ipop-project/Tincan/external/3rd-Party-Libs/debug
cp webrtc-checkout/src/out/debug-x64/obj/third_party/protobuf/libprotobuf_lite.a ipop-project/Tincan/external/3rd-Party-Libs/debug
```

---

*These instructions are derived from following links and through experimentation with WebRTC itself. They may change as depot_tools and WebRTC are updated by their respective developers.

* [https://webrtc.org/native-code/development/](https://webrtc.org/native-code/development/)
* [https://webrtc.org/native-code/development/prerequisite-sw/](https://webrtc.org/native-code/development/prerequisite-sw/)
* [http://dev.chromium.org/developers/how-tos/install-depot-tools](http://dev.chromium.org/developers/how-tos/install-depot-tools)
* [https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md](https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md)