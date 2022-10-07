#!/bin/bash

# Despligue ros2_web_video_server

source /opt/ros/foxy/setup.bash
cd /home/mfernm30/Documents/ros_ws/dev_ws
source install/web_video_server/share/web_video_server/local_setup.bash
ros2 run web_video_server web_video_server
