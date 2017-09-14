# Configuration

An external configuration file is needed when running IPOP. A
[sample configuration file](https://github.com/ipop-project/Controllers/blob/master/controller/sample-gvpn-config.json) is provided with the Controllers source code. Default configuration settings are provided in [fxlib.py](https://github.com/ipop-project/Controllers/blob/master/controller/framework/fxlib.py).

The external configuration file and the settings in fxlib.py are merged. If a key is provided in both files, the key in the external configuration file will take precedence.

## Required External Configuration File Keys

| Qualified Name | Description |
| -------------- |------------ |
| XmppClient.XmppDetails[0].AddressHost | XMPP server domain or IP address |
| XmppClient.XmppDetails[0].Port | XMPP port |
| XmppClient.XmppDetails[0].TapName | Tap device name used matching one specified in TincanInterface.Vnets |
| XmppClient.XmppDetails[0].AuthenticationMethod | Node authentication mode (values: "password" or "x509") |
| XmppClient.XmppDetails[0].Username | XMPP credential user ID (AuthenticationMethod="password") |
| XmppClient.XmppDetails[0].Password | XMPP credential password (AuthenticationMethod="password") |
| XmppClient.XmppDetails[0].TrustStore | Truststore path containing XMPP server certificate file (AuthenticationMethod="x509") |
| XmppClient.XmppDetails[0].CertDirectory | IPOP node certificate directory (AuthenticationMethod="x509") |
| XmppClient.XmppDetails[0].CertFile | IPOP node public key filename (AuthenticationMethod="x509") |
| XmppClient.XmppDetails[0].keyfile | IPOP node private key filename (AuthenticationMethod="x509") |
| XmppClient.XmppDetails[0].AcceptUntrustedServer | Trusted XMPP server |
| TincanInterface.Vnets[0].Name | Name of Tap Device |
| TincanInterface.Vents[0].IP4 | Virtual ipv4 address given to the node |
| TincanInterface.Vnets[0].IP4PrefixLen | Virtual ipv4 address prefix |
| TincanInteface.Vnets[0].MTU4 | Maximum Transmission Unit for Virtual net |
| TincanInteface.Vnets[0].XMPPModuleName | Name of XMPP Module to use |
| TincanInteface.Vnets[0].TapName | Name of Tap Device |
| TincanInteface.Vnets[0].Description | |
| TincanInteface.Vnets[0].IgnoredNetworkInterfaces | |
| TincanInteface.Vnets[0].L2TunnellingEnabled | |
| CFx.Model | Type of VPN ("SocialVPN" or "GroupVPN") |

## Optional/Default Keys

| Qualified Name | Default Value | Description |
|----------------|---------------|-------------|
| XmppClient.Enabled |  true | Enable XmppClient module(Required by current codebase) |
| XmppClient.TimerInterval |  10 | Timer thread interval in seconds |
| XmppClient.MessagePerIntervalDelay | 10 | No. of XMPP messages after which the delay has to be increased |
| XmppClient.InitialAdvertismentDelay | 5 | Intitial delay for Peer XMPP messages |
| XmppClient.XmppAdvrtDelay | 5 | Incremental delay for XMPP messages |
| XmppClient.MaxAdvertismentDelay | 30 | Max XMPP Message delay |
| XmppClient.dependencies | `["Logger", "TincanInterface", "XmppClient"]` | XMPP module dependencies |
| TincanInterface.buf_size | 65507 | Max buffer size for Tincan Messages |
| TincanInterface.SocketReadWaitTime | 15 | Socket read wait time for Tincan Messages |
| TincanInterface.ctr_recv_port | 5801 | Controller UDP Listening Port |
| TincanInterface.ip6_prefix | "fd50:0dbc:41f2:4a3c" | |
| TincanInterface.ctrl_send_port | 5800 | Tincan UDP Listening Port |
| TincanInterface.localhost | "127.0.0.1" | |
| TincanInterface.localhost6 | "::1" | |
| TincanInterface.dependencies | `["Logger"]`| dependencies of TincanInterface module |
| TincanInterface.Stun | None | List of usable STUN servers e.g.: `["stun.l.google.com:19302"]`
| TincanInterface.Turn | None | List of usable TURN servers with transport address, username, and password in format `[{ "Address": "***:19302", "User": "***", "Password": "***"}]` |
| Logger.LogLevel | "WARNING" | Level of logging verbosity (values: "ERROR", "INFO", "DEBUG", "WARNING") |
| Logger.LogOption | "FILE" | Method of Logging output (values: "FILE", "CONSOLE") |
| Logger.LogFilePath | "./logs/" | If LogOption="FILE", specify path log files will output |
| Logger.CtrlLogFileName | "ctrl.log" | If LogOption="FILE", specify file name of Controller log |
| Logger.TincanLogFileName | "tincan.log" | If LogOption="FILE", specify file name of Tincan log |
| Logger.LogFileSize | 1000000 | Log file size specified in bytes |
| Logger.ConsoleLevel | None | |
| Logger.BackupFileCount | 5 | # of files to hold logging history |
| CFx.local_uid | "" | Attribute to store node UID needed by Statereport and SVPN |
| CFx.uid_size | 40 | # of bytes for node UID |
| CFx.ipopVerRel | ipopVerRel (Variable in fxlib.py) | Release Version String |
| LinkManager.Enabled | true |  Enables LinkManager module (Required by current  codebase)|
| LinkManager.TimerInterval | 10 | Timer thread interval in seconds |
| LinkManager.InitialLinkTTL | 120 | Intial Time to Live for a p2p link in seconds |
| LinkManager.LinkPulse | 180 | Time to Live for an online p2p link in seconds |
| LinkManager.MaxConnRetry | 5 | Max connection retry attempts for each p2p link |
| LinkManager.dependencies | `["Logger", "TincanInterface"]` | LinkManager module dependencies |
| BroadcastForwarder.Enabled | true | Enables BroadcastForwarder module |
| BroadcastForwarder.TimerInterval | 10 | Timer thread interval in seconds |
| BroadcastForwarder.dependencies | `["Logger", "TincanInterface", "LinkManager"]` | BroadcastForwarder module dependencies
| ArpCache.Enabled | true | Enables ArpCache module |
| ArpCache.dependencies | `["Logger", "TincanInterface", "LinkManager"]` | ArpCache module dependencies |
| IPMulticast.Enabled | false | Enables IPMulticast module |
| IPMulticast.dependencies | `["Logger", "TincanInterface", "LinkManager"]` | IPMulticast module dependencies |
| BaseTopologyManager.Enabled | true | Enables BaseTopologyManager module |
| BaseTopologyManager.TimerInterval | 10 | Timer thread interval in seconds |
| BaseTopologyManager.dependencies | `["Logger", "TincanInterface", "XmppClient"]` | BaseTopologyManager module dependencies |
| OverlayVisualizer.Enabled | false | Enables OverlayVisualizer module |
| OverlayVisualizer.TimerInterval | 5 | Timer thread interval in seconds |
| OverlayVisualizer.WebServiceAddress | ":8080/insertdata" | Visualizer webservice URL |
| OverlayVisualizer.NodeName | "" | Interval to send data to the visualizer |
| OverlayVisualizer.dependencies | `["Logger", "BaseTopologyManager"]` | OverlayVisualizer module dependencies |
| StatReport.Enabled | false | Enables StatReport module |
| StatReport.TimerInterval | 200 |  Timer thread interval in seconds |
| StatReport.StatServerAddress | "metrics.ipop-project.org" | Webservice to send stats |
| StatReport.StatServerPort | 8080 | Port of StatReport webservice|
| StatReport.dependencies | `["Logger"]` | StatReport module dependencies |