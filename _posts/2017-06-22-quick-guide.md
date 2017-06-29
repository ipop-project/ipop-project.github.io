---
layout: single
permalink: /quick-guide/
title: "Quick Guide"
date: 2017-05-24
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(0, 127, 255, 0.75)
excerpt: 'GRAPLE Quick Guide'
sidebar:
  nav: "sidebar"
categories:
  - Documents
tags:
  - v3.1.0
---
## Install RStudio
Download and install [RStudio] on your machine

## Install GRAPLEr and Prerequisites
Run the following commands in RStudio:

```
install.packages("httr")
install.packages("RCurl")
install.packages("jsonlite")
install.packages("devtools")
library("devtools")
devtools::install_github("GRAPLE/GRAPLEr")
```

## Run a Sample Experiment
You can go through the [Project EDDIE] module to test-drive the execution of hundreds of GLM model runs through GRAPLEr during the Part C activity of the module, and learn many different GRAPLEr commands with detailed annotation.

## Any Problem?
Contact [Technical Support].


[RStudio]: https://www.rstudio.com/products/rstudio/download2/
[Project EDDIE]: https://serc.carleton.edu/enviro_data/activities/lake_modeling.html
[Technical Support]: ../contact