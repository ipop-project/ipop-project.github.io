# Build IPOP for Windows

**Warning: This document may be out of date.**

| | Description |
|---|---|
| **Tested on** | Microsoft Windows 10 x64 |
| **Time** | ~ 10 Minutes |
| **Question(s)** | - How to build IPOP? |
| **Objective(s)**| - Build IPOP Source Code |

Requires Visual Studio 15 Community Ed or greater with C++ tools.
If using community edition you must install C++ tools separately from VS add/remove programs.
Install Win 10 SDK, depending on the build revision you get you may have to retarget solution from project solution.

```
  mkdir -p workspace/ipop-project
  mkdir -p workspace/ipop-vpn/config
  cd workspace/ipop-project/
  git clone https://github.com/ipop-project/Tincan -b bh1
  git clone https://github.com/ipop-project/Controllers -b bh1
  git clone https://github.com/ipop-project/Release-Management.git
  cp Release-Management\Deployment\win\ipop-setup.ps1 ..\ipop-vpn
  cp Release-Management\Deployment\win\ipop-start.bat ..\ipop-vpn
  cp Controllers\controller ..\ipop-vpn
```

Open the Visual Studio Tincan solution located at workspace/ipop-project/ipop-tincan/trunk/build/tincan.sln. The supported build configurations are debug x64 and release x64. After a successful build, the ipop-tincan executable is located in workspace\ipop-project\ipop-tincan\trunk\out\debug\x64 or workspace\ipop-project\ipop-tincan\trunk\out\release\x64 for debug and release builds, respectively.
```
   cp Tincan\trunk\out\release ..\ipop-vpn
```
Run power shell window as admin
```
PowerShell.exe -ExecutionPolicy Unrestricted
ipop-setup.ps1
```
Copy your config file when prompted.