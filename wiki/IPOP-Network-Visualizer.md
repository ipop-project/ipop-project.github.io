# IPOP Network Visualizer

A Web-service that visualizes the current state of the Peers in the IPOP Network. A Graphical view of the actual state of all the nodes and links in the IPOP Network is dynamically rendered as and when there are changes in the Network.  

## Architecture of Overlay Visualizer

**1. Collector:** The functionality of this module is to aggregate the data required for visualization from each of the nodes in the network. This module collects data periodically and stores them in the database.  

**2. MongoDB Database:** The database is implemented using the NoSQL MongoDB database. This stores the data from the Collector module.  

**3. Central Visualizer:** This module is responsible for fetching the data from MongoDB and sending them to the client side. The browser requests these data periodically from this module and renders the visualization layout using those data.  
  
## Setting up a Visualizer Web-service

The steps given below will install the required dependencies and starts up the Visualizer :  

1. `git clone https://github.com/ipop-project/Network-Visualizer`  
2. `cd Network-Visualizer/Setup`    
3. To install the dependencies, Run :    
    `./setup.sh`    
4. Change back to its parent directory (Network-Visualizer)
5. To start the visualizer, Run 
    `./visualizer start`  
6. The modules will be started on your machine and the Network layout can be viewed in the browser on any machine at:  
   `https://xx.xx.xx.xx:8888/IPOP`  
`where xx.xx.xx.xx stands for the ip4 address of the machine hosting the web-service`  
7. The data from the nodes based on which the Network layout is rendered can be viewed at:  
    `https://xx.xx.xx.xx:8888/nodedata`  
`where xx.xx.xx.xx stands the same as in step 6`  
8. To stop the visualizer, go to the Network-Visualizer directory and Run :  
    `./visualizer stop`