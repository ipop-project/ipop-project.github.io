# Build WebRTC Libraries for Raspberry Pi Zero (Cross compile on Ubuntu)

| | Description |
|---|---|
| **Tested on** | Raspbian Stretch on Raspberry Pi Zero |
| **Time** | ~ 45 Minutes |
| **Question(s)** | - How to build WebRTC for Raspberry Pi Zero?<br /> - How to extract WebRTC static libraries for building IPOP? |
| **Objective(s)**| - Build the WebRTC Libraries<br /> - Extract required WebRTC Static Libraries for Building IPOP |

**Note 1:** If you want to run IPOP right away, use the proper version of IPOP from [our latest release](https://github.com/ipop-project/Downloads/releases).

**Note 2:** There are some WebRTC libraries needed to build IPOP Tincan binary. They are already built and located in [Tincan/external/lib/](https://github.com/ipop-project/Tincan/tree/master/external/lib). You can use them to [build IPOP Tincan binary](Build-IPOP,-Intro) yourself.

If you want to build WebRTC libraries for IPOP yourself, follow the instructions.

## Install Toolchain

```shell
sudo apt update && sudo apt install -y debootstrap qemu-user-static git python3-dev

mkdir -p ~/workspace/webrtc-checkout && cd ~/workspace/webrtc-checkout/

sudo git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git /opt/depot_tools
echo "export PATH=/opt/depot_tools:\$PATH" | sudo tee /etc/profile.d/depot_tools.sh

sudo git clone https://github.com/raspberrypi/tools.git /opt/rpi_tools
echo "export PATH=/opt/rpi_tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin:\$PATH" | sudo tee /etc/profile.d/rpi_tools.sh

sudo chown `whoami`:`whoami` /opt/depot_tools /opt/rpi_tools
source /etc/profile

sudo debootstrap --arch armhf --foreign --include=g++,libasound2-dev,libpulse-dev,libudev-dev,libexpat1-dev,libnss3-dev,libgtk2.0-dev wheezy rootfs
sudo cp /usr/bin/qemu-arm-static rootfs/usr/bin/
sudo chroot rootfs /debootstrap/debootstrap --second-stage
find rootfs/usr/lib/arm-linux-gnueabihf -lname '/*' -printf '%p %l\n' | while read link target; do sudo ln -snfv "../../..${target}" "${link}"; done
find rootfs/usr/lib/arm-linux-gnueabihf/pkgconfig -printf "%f\n" | while read target; do sudo ln -snfv "../../lib/arm-linux-gnueabihf/pkgconfig/${target}" rootfs/usr/share/pkgconfig/${target}; done
```
## Get WebRTC

**Note:** BoringSSL in branch-heads/57 has a bug preventing the code to get compiled for ARM6. A workaround would be using the updated BoringSSL from branch-heads/61.

```shell
fetch webrtc
cd src/
git checkout branch-heads/61
gclient sync
cp -r third_party/boringssl ../
git checkout branch-heads/57
gclient sync
rm -rf third_party/boringssl
mv ../boringssl third_party/
```

## Build WebRTC

```shell
./build/install-build-deps.sh
./build/linux/sysroot_scripts/install-sysroot.py --arch=arm

gn gen out/debug --args='target_os="linux" target_cpu="arm" enable_iterator_debugging=false is_component_build=false arm_version=6 arm_arch="armv6" arm_float_abi="hard" arm_fpu="vfp" is_debug=true'
ninja -C out/debug boringssl field_trial_default protobuf_lite p2p base jsoncpp

gn gen out/release --args='target_os="linux" target_cpu="arm" enable_iterator_debugging=false is_component_build=false arm_version=6 arm_arch="armv6" arm_float_abi="hard" arm_fpu="vfp" is_debug=false'
ninja -C out/release boringssl field_trial_default protobuf_lite p2p base jsoncpp
```
## Extract the Static Libraries for Building IPOP Tincan

### Get Tincan Codebase

Switch to the workspace directory:
```shell
cd ~/workspace/
```
Create `ipop-project` directory and download the Tincan repository there:
```shell
mkdir -p ipop-project/ && git clone https://github.com/ipop-project/Tincan.git ipop-project/Tincan
```
### Copy the WebRTC Libraries to Tincan

These freshly built libraries will replace the existing libraries.

**Debug Libraries**
```shell
ar -rcs ipop-project/Tincan/external/lib/debug/arm6/rpi/libboringssl_asm.a webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/aes-armv4.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/bsaes-armv7.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/ghashv8-armx32.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/sha256-armv4.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/aesv8-armx32.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/chacha-armv4.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/poly1305_arm_asm.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/sha512-armv4.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/armv4-mont.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/ghash-armv4.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/sha1-armv4-large.o webrtc-checkout/src/out/debug/obj/third_party/boringssl/boringssl_asm/x25519-asm-arm.o

ar -rcs ipop-project/Tincan/external/lib/debug/arm6/rpi/libjsoncpp.a webrtc-checkout/src/out/debug/obj/third_party/jsoncpp/jsoncpp/json_reader.o webrtc-checkout/src/out/debug/obj/third_party/jsoncpp/jsoncpp/json_value.o webrtc-checkout/src/out/debug/obj/third_party/jsoncpp/jsoncpp/json_writer.o

cp webrtc-checkout/src/out/debug/obj/third_party/boringssl/libboringssl.a ipop-project/Tincan/external/lib/debug/arm6/rpi/
cp webrtc-checkout/src/out/debug/obj/webrtc/system_wrappers/libfield_trial_default.a ipop-project/Tincan/external/lib/debug/arm6/rpi/
cp webrtc-checkout/src/out/debug/obj/webrtc/base/librtc_base.a ipop-project/Tincan/external/lib/debug/arm6/rpi/
cp webrtc-checkout/src/out/debug/obj/webrtc/base/librtc_base_approved.a ipop-project/Tincan/external/lib/debug/arm6/rpi/
cp webrtc-checkout/src/out/debug/obj/webrtc/p2p/librtc_p2p.a ipop-project/Tincan/external/lib/debug/arm6/rpi/
cp webrtc-checkout/src/out/debug/obj/third_party/protobuf/libprotobuf_lite.a ipop-project/Tincan/external/lib/debug/arm6/rpi/
```
**Release Libraries**
```shell
ar -rcs ipop-project/Tincan/external/lib/release/arm6/rpi/libboringssl_asm.a webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/aes-armv4.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/bsaes-armv7.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/ghashv8-armx32.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/sha256-armv4.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/aesv8-armx32.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/chacha-armv4.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/poly1305_arm_asm.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/sha512-armv4.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/armv4-mont.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/ghash-armv4.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/sha1-armv4-large.o webrtc-checkout/src/out/release/obj/third_party/boringssl/boringssl_asm/x25519-asm-arm.o

ar -rcs ipop-project/Tincan/external/lib/release/arm6/rpi/libjsoncpp.a webrtc-checkout/src/out/release/obj/third_party/jsoncpp/jsoncpp/json_reader.o webrtc-checkout/src/out/release/obj/third_party/jsoncpp/jsoncpp/json_value.o webrtc-checkout/src/out/release/obj/third_party/jsoncpp/jsoncpp/json_writer.o

cp webrtc-checkout/src/out/release/obj/third_party/boringssl/libboringssl.a ipop-project/Tincan/external/lib/release/arm6/rpi/
cp webrtc-checkout/src/out/release/obj/webrtc/system_wrappers/libfield_trial_default.a ipop-project/Tincan/external/lib/release/arm6/rpi/
cp webrtc-checkout/src/out/release/obj/webrtc/base/librtc_base.a ipop-project/Tincan/external/lib/release/arm6/rpi/
cp webrtc-checkout/src/out/release/obj/webrtc/base/librtc_base_approved.a ipop-project/Tincan/external/lib/release/arm6/rpi/
cp webrtc-checkout/src/out/release/obj/webrtc/p2p/librtc_p2p.a ipop-project/Tincan/external/lib/release/arm6/rpi/
cp webrtc-checkout/src/out/release/obj/third_party/protobuf/libprotobuf_lite.a ipop-project/Tincan/external/lib/release/arm6/rpi/
```

Now you can [build IPOP Tincan binary](Build-IPOP,-Intro) on the Raspberry Pi Zero, itself.