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
  git clone https://github.com/ipop-project/Tincan
  git clone https://github.com/ipop-project/Controllers
  cd Tincan
  cd ../Controllers
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