This guide is specific to the WebRTC release that is being compiled. It has been tested on 64-bit Windows 10 to build WebRTC branch-head/57.

These instructions are derived from following links:

* [https://webrtc.org/native-code/development/](https://webrtc.org/native-code/development/)
* [https://webrtc.org/native-code/development/prerequisite-sw/](https://webrtc.org/native-code/development/prerequisite-sw/)
* [http://dev.chromium.org/developers/how-tos/install-depot-tools](http://dev.chromium.org/developers/how-tos/install-depot-tools)
* [https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md](https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md)
* [https://chromium.googlesource.com/chromium/src/+/master/tools/gn/docs/quick_start.md](https://chromium.googlesource.com/chromium/src/+/master/tools/gn/docs/quick_start.md)


## Download dependencies
1.  Install Visual Studio 2015 Update 2 or later - Community Edition should work if its license is appropriate for you. Use the Custom Install option and select:

    * Visual C++, which will select three sub-categories including MFC
    * Universal Windows Apps Development Tools > Tools
    * Universal Windows Apps Development Tools > Windows 10 SDK (10.0.10586)


1.  Install the Chromium depot tolls

  1. Download [depot_tools.zip](https://storage.googleapis.com/chrome-infra/depot_tools.zip) and decompress it.
  2. Add depot_tools to the end of your PATH:
    * With Administrator access:

      * `Control Panel > System and Security > System > Advanced system settings`

      * Modify the PATH system variable to include depot_tools

    * Without Administrator access:

      * `Control Panel > User Accounts > User Accounts > Change my environment variables`

      * Add a PATH user variable: `%PATH%;C:\path\to\depot_tools`

  3. Run `gclient` from the cmd shell. The first time it is run, it will install its own copy various tools.


## Download the source code
1.  Create a working directory, enter it, and run fetch webrtc. This guide assumes a specific working folder structure. This operation starts from a base directory, eg., workspace and proceeds from there. References made later on expect the Tincan repo to be cloned into workspace/ipop-project/

  ```bash
  mkdir webrtc-checkout
  cd webrtc-checkout
  fetch --nohooks webrtc
  ```

2.  Choose the stable release 57 rather than the most recent release by entering:
  ```bash
  cd src
  git branch -r
  git checkout branch-heads/57
  ```

3.  Download the code
  ```bash
  gclient sync
  ```

  **Note:** _The download will take a while, but it no longer downloads the Chromium repository after branch-head/57. Do not interrupt this step or you may need to start all over again (a new gclient sync may be enough, but you might also need wipe your webrtc_checkout\src folder and start over)._

## Update your checkout
To update an existing checkout, you can run
```
git rebase-update
gclient sync
```
The first command updates the primary Chromium source repository and rebases any of your local branches on top of tip-of-tree (aka the Git branch origin/master). If you don't want to use this script, you can also just use git pull or other common Git commands to update the repo.

The second command syncs the subrepositories to the appropriate versions and re-runs the hooks as needed.

## Building WebRTC library
1.  After downloading the code, you can start you can optionally edit build/config/compiler/BUILD.gn and set use_rtti = true. You can also set build/config/BUILDCONFIG.gn is_debug=false for a release build.

  The default configuration is for a 64-bit debug build:
  ```bash
  gn gen out/debug-x64 "--args=use_rtti=true"
  ninja -C out/debug-x64 boringssl field_trial_default protobuf_full p2p
  ```  
  To create a 64-bit release build you must edit the GN args and set is_debug = true
  ```bash
  gn gen out/release-x64 "--args=is_debug = false use_rtti=true"
  ninja -C out/release-x64 boringssl field_trial_default protobuf_full p2p
  ```


## Extract the static libraries 

Currently the libraries we need from out/Debug_x64 and out/Release_x64 are:  
boringssl.lib;field_trial_default.lib;protobuf_lite.lib;rtc_base.lib;boringssl_asm.lib;
rtc_base_approved.lib;rtc_p2p.lib;json_writer.obj;json_value.obj;json_reader.obj
  ```bash
cp ./out/debug-x64/boringssl.dll.lib ../../ipop-project/Tincan/external/lib/debug_x64/win/boringssl.lib
cp ./out/debug-x64/obj/webrtc/system_wrappers/field_trial_default.lib ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/base/rtc_base.lib ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/base/rtc_base_approved.lib ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/p2p/rtc_p2p.lib ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/third_party/protobuf/protobuf_full.lib ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/third_party/jsoncpp/jsoncpp/json_reader.obj ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/third_party/jsoncpp/jsoncpp/json_writer.obj ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/third_party/jsoncpp/jsoncpp/json_value.obj ../../ipop-project/Tincan/external/lib/debug_x64/win/

cp ./out/debug-x64/boringssl.dll.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/boringssl.pdb
cp ./out/debug-x64/obj/third_party/jsoncpp/jsoncpp_cc.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/third_party/protobuf/protobuf_full_cc.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/p2p/rtc_p2p_cc.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/base/rtc_base_cc.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/base/rtc_base_approved_cc.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/
cp ./out/debug-x64/obj/webrtc/system_wrappers/field_trial_default_cc.pdb ../../ipop-project/Tincan/external/lib/debug_x64/win/

cp ./out/release-x64/obj/third_party/boringssl/boringssl.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/boringssl/boringssl_asm.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/system_wrappers/field_trial_default.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/base/rtc_base.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/base/rtc_base_approved.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/p2p/rtc_p2p.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/protobuf/protobuf_full.lib ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/jsoncpp/jsoncpp/json_reader.obj ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/jsoncpp/jsoncpp/json_writer.obj ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/jsoncpp/jsoncpp/json_value.obj ../../ipop-project/Tincan/external/lib/release_x64/win/

cp ./out/release-x64/obj/third_party/boringssl/boringssl_c.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/system_wrappers/field_trial_default_cc.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/jsoncpp/jsoncpp_cc.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/base/rtc_base_cc.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/base/rtc_base_approved_cc.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/webrtc/p2p/rtc_p2p_cc.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
cp ./out/release-x64/obj/third_party/protobuf/protobuf_full_cc.pdb ../../ipop-project/Tincan/external/lib/release_x64/win/
  ```
## Copy the header files for this branch-head

  ```bash
mkdir ..\..\ipop-project\Tincan\external\include\webrtc\base
mkdir ..\..\ipop-project\Tincan\external\include\webrtc\p2p\client
mkdir ..\..\ipop-project\Tincan\external\include\webrtc\p2p\base
mkdir ..\..\ipop-project\Tincan\external\include\webrtc\api\video
mkdir ..\..\ipop-project\Tincan\external\include\webrtc\system_wrappers
mkdir ..\..\ipop-project\Tincan\external\include\json

cp ./webrtc/*.h ../../ipop-project/Tincan/external/include/webrtc/
cp ./webrtc/base/*.h ../../ipop-project/Tincan/external/include/webrtc/base
cp ./webrtc/p2p/client/*.h ../../ipop-project/Tincan/external/include/webrtc/p2p/client
cp ./webrtc/p2p/base/*.h ../../ipop-project/Tincan/external/include/webrtc/p2p/base
cp ./third_party/jsoncpp/source/include/json/*.h ../../ipop-project/Tincan/external/include/json
cp ./webrtc/api/video/video_rotation.h ../../ipop-project/Tincan/external/include/webrtc/api/video/
cp ./webrtc/system_wrappers/include/stringize_macros.h ../../ipop-project/Tincan/external/include/webrtc/system_wrappers/include
  ```

*These instructions are derived from following links:

* [https://webrtc.org/native-code/development/](https://webrtc.org/native-code/development/)
* [https://webrtc.org/native-code/development/prerequisite-sw/](https://webrtc.org/native-code/development/prerequisite-sw/)
* [http://dev.chromium.org/developers/how-tos/install-depot-tools](http://dev.chromium.org/developers/how-tos/install-depot-tools)
* [https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md](https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md)
* [https://chromium.googlesource.com/chromium/src/+/master/tools/gn/docs/quick_start.md](https://chromium.googlesource.com/chromium/src/+/master/tools/gn/docs/quick_start.md)