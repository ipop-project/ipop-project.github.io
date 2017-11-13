# Configuration, Intro

## Basic Configuration

Watch [Use IPOP, Demonstration Video](https://screencast-o-matic.com/watch/cbjXbPlmdl) to find out how you can apply the basic configuration for IPOP.

In short, for basic configuration, you need to have an XMPP account. You can setup an XMPP server yourself on your machine or use a free public XMPP service. There is a list of free popular XMPP services in the [XMPP official website](https://xmpp.org/getting-started/).

Setup your account and make a copy of the sample configuration file:

```
cp config/sample-gvpn-config.json config/ipop-config.json
```

Then enter the account information in `config/ipop-config.json`. If you want to use IPOP with the default configuration, you just need to edit the file and enter "Username", "Password" and "AddressHost" in "XmppDetails" under "XmppClient". For instance, the last part of the configuration file will look like this:

```json
.
.
.
  "XmppClient": {
    "XmppDetails": [
      {
        "Username": "<your_account_username>@<xmpp-server.ext>",
        "Password": "<your_account_password>",
        "AddressHost": "<xmpp-server.ext>",
        "Port": "5222",
        "TapName": "ipop_tap0",
        "AuthenticationMethod": "password",
        "AcceptUntrustedServer": true
      }
    ],
    "TimerInterval": 10
  }
}
```

**Note:** Remember to add "@<xmpp-server.ext>" to the end of "<your_account_username>".

You may also want to change the default IP which is currently "IP4": "10.254.0.10" in "Vnets" under "TincanInterface". Each IPOP node must have a unique IP address in the network.

## Advanced Configuration

For documentation on advanced configuration go to [Configuration wiki page](Configuration).

## Sample Configuration File

There is a sample configuration file at `config/sample-gvpn-config.json`:

```json
{
  "CFx": {
    "Model": "GroupVPN"
  },
  "Logger": {
    "Enabled": true,
    "LogLevel": "WARNING",
    "LogOption": "File",
    "LogFilePath": "./logs/",
    "CtrlLogFileName": "ctrl.log",
    "TincanLogFileName": "tincan.log",
    "LogFileSize": 5000000,
    "BackupLogFileCount": 5
  },
  "TincanInterface": {
    "ctrl_recv_port": 5801,  
    "localhost": "127.0.0.1",
    "ctrl_send_port": 5800,  
    "localhost6": "::1",
    "dependencies": ["Logger"],
    "Vnets": [
      {
        "Name" : "ipop_tap0",
        "IP4": "10.254.0.10",
        "IP4PrefixLen": 16,
        "MTU4": 1200,
        "XMPPModuleName": "XmppClient",
        "TapName": "ipop_tap0",
        "Description": "Beta 2 Test Network",
        "IgnoredNetInterfaces": [ "ipop_tap0" ],
        "L2TunnellingEnabled": true
      }
    ],
    "Stun": [ "stun.l.google.com:19302" ]
  },
  "XmppClient": {
    "XmppDetails": [
      {
        "Username": "***",
        "Password": "***",
        "AddressHost": "***",
        "Port": "5222",
        "TapName": "ipop_tap0",
        "AuthenticationMethod": "password",
        "AcceptUntrustedServer": true
      }
    ],
    "TimerInterval": 10
  }
}
```