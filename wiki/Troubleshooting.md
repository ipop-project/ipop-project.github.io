# Troubleshooting

If you run into errors/crashes, please proceed as follows:

Try to recreate the problem and obtain log files:

Providing a log file is very useful. The logging level is determined in the JSON configuration file by adding the following parameters:

"controller_logging" : "DEBUG",
"tincan_logging": 2
logging_level - sets the Python logging module for the controller with possible values DEBUG, INFO, WARNING, ERROR, CRITICAL
logging - set the logging level for IPOP-Tincan, 0 = no logging, 1 = error logging, 2 = info logging (recommended), 3 = verbose logging

Additionally, provide the IPOP-VPN version and the platform being used.