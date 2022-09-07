<template>

    <div id="app" class="container">

        <div class="d-flex flex-column h-100">
            <!-- header of the page -->
            <header class="header">
                <div class="container">
                    <div class="jumbotron text-center">
                        <h1>Gamepad example</h1>
                        <p>Hellow from my webpage</p>
                    </div>
                </div>
            </header>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h3>{{ menu_title }}</h3>
                        <hr>
                        <label>ROSBridge address</label>
                        <br>
                        <input class="mb-5" type="text" v-model="rosbridge_address" />
                        <br>
                        <v-btn v-if="connected" @click="disconnect" color="success">Connected</v-btn>
                        <v-btn v-else @click="connect" color="primary">Connect</v-btn>
                    </div>
                </div>
            </div>

            <div class="card col-md-4">
                <div class="card-body">
                    <h3>Position</h3>
                    <hr>
                    <p>
                        <span>X: {{ position.x.toFixed(2) }}</span>
                        <br>
                        <span>Y: {{ position.y.toFixed(2) }}</span>
                        <br>
                        <span>Z: {{ position.z.toFixed(2) }}</span>
                    </p>
                </div>
            </div>
        </div>

        <div class="card mt-5  ">
            <div class="col-md-12 col-sm-6" style="overflow:auto;">
                <div class="row">

                    <!-- 1st row -->
                    <div class="col-md-12 text-center my-2">
                        <v-btn @click="forward" :disabled="loading || !connected" color="primary">Forward</v-btn>
                    </div>

                    <!-- 2nd row -->
                    <div class="col-md-4 text-center my-2">
                        <v-btn @click="turnLeft" :disabled="loading || !connected" class="primary">Left</v-btn>
                    </div>
                    <div class="col-md-4 text-center my-2">
                        <v-btn @click="stop" :disabled="loading || !connected" class="error">Stop</v-btn>
                    </div>
                    <div class="col-md-4 text-center my-2">
                        <v-btn @click="turnRight" :disabled="loading || !connected" class="primary">Right</v-btn>
                    </div>

                    <!-- 3rd row -->
                    <div class="col-md-12 text-center my-2">
                        <v-btn @click="backward" :disabled="loading || !connected" class="primary">Backward</v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import ROSLIB from 'roslib'

export default {
    data: () => ({
        connected: false,
        ros: null,
        logs: [],
        loading: false,
        rosbridge_address: 'ws://localhost:9090',
        port: '9090',
        mapViewer: null,
        mapGridClient: null,
        interval: null,
        menu_title: "Connection",
        position: { x: 0, y: 0, z: 0},
    }),
    // helper methods to connect to ROS
    methods: {
        connect: function () {
            this.loading = true
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })
            this.ros.on('connection', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Connected!')
                this.connected = true
                this.loading = false

                let topic = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/odom',
                    messageType: 'nav_msgs/Odometry'
                })
                topic.subscribe((message) => {
                    this.position = message.pose.pose.position
                })
            })
            this.ros.on('error', (error) => {
                this.logs.unshift((new Date()).toTimeString() + ` - Error: ${error}`)
            })
            this.ros.on('close', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Disconnected!')
                this.connected = false
                this.loading = false
                document.getElementById('map').innerHTML = ''
            })
        },
        disconnect: function () {
            this.ros.close()
        },
        setTopic: function () {
            this.topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
        },
        forward: function () {
            this.message = new ROSLIB.Message({
                linear: { x: 1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0, },
            })
            this.setTopic()
            this.topic.publish(this.message)
        },
        stop: function () {
            this.message = new ROSLIB.Message({
                linear: { x: 0, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0, },
            })
            this.setTopic()
            this.topic.publish(this.message)
        },
        backward: function () {
            this.message = new ROSLIB.Message({
                linear: { x: -1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0, },
            })
            this.setTopic()
            this.topic.publish(this.message)
        },
        turnLeft: function () {
            this.message = new ROSLIB.Message({
                linear: { x: 0.5, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0.5, },
            })
            this.setTopic()
            this.topic.publish(this.message)
        },
        turnRight: function () {
            this.message = new ROSLIB.Message({
                linear: { x: 0.5, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: -0.5, },
            })
            this.setTopic()
            this.topic.publish(this.message)
        }
    },
    mounted() {

    },
}
</script>