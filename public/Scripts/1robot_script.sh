#!/bin/bash

# Despligue nodo ros2_rb1

source /opt/ros/foxy/setup.bash
cd /home/mfernm30/Documents/ros_ws/dev_ws
source install/setup.bash
ros2 launch rb1_gazebo granny.launch.py
