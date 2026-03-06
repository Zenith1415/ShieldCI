#!/bin/bash

kali-server-mcp --ip 127.0.0.1 --port 5000 > /dev/null 2>&1 &


sleep 2


exec mcp-server --server http://127.0.0.1:5000
