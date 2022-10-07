#!/bin/bash

# Despligue nodo rosbridge_server

source /opt/ros/foxy/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
