<template>

    <div class="container">

        <div class="d-flex flex-column h-100">
            <!-- header of the page -->
            <header class="header">
                <div class="container">
                    <div class="jumbotron text-center">
                        <h1>Videocam example</h1>
                        <p>Hellow from my webpage.</p>
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
                        <v-btn class="success" v-if="connected" @click="disconnect">Connected</v-btn>
                        <v-btn class="primary" v-else @click="connect">Connect</v-btn>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h2 class="text-center">Joystick</h2>
                        <hr>
                        <p>Some actions for the robot</p>
                        <div id="dragstartzone" @mousedown="startDrag" @mousemove="doDrag">
                        </div>
                        <div id="dragCircle" :style="dragCircleStyle"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h2 class="text-center">Joystick values</h2>
                        <hr />
                        <p>Vertical: {{ joystick.vertical.toFixed(3) }}</p>
                        <br />
                        <p>Horizontal: {{ joystick.horizontal.toFixed(3) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-10">
            <div class="col-md-6 col-sm-6 text-center">
                <div id="divCamera"></div>
            </div>
            <div class="col-md-6 col-sm-6 text-center">
                <div id="divCamera2"></div>
            </div>
        </div>
    </div>

</template>

<script>
import ROSLIB from 'roslib'

export default {
    data() {
        return {
            // ros connection
            ros: null,
            rosbridge_address: "ws://localhost:9090",
            web_video_server_address: 'ws://localhost:8080',
            connected: false,
            // page content
            menu_title: "Connection",
            // dragging data
            dragging: false,
            x: "no",
            y: "no",
            dragCircleStyle: {
                margin: "0px",
                top: "0px",
                left: "0px",
                display: "none",
                width: "75px",
                height: "75px",
            },
            // joystick valules
            joystick: {
                vertical: 0,
                horizontal: 0,
            },
            // publisher
            pubInterval: null,
        };
    },
    methods: {
        connect: function () {
            // define ROSBridge connection object
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            });
            // define callbacks
            this.ros.on("connection", () => {
                this.connected = true;
                console.log("Connection to ROSBridge established!");
                this.pubInterval = setInterval(this.publish, 100);
                this.setCamera()
                this.setCamera2()
            });
            this.ros.on("error", (error) => {
                console.log("Something went wrong when trying to connect");
                console.log(error);
            });
            this.ros.on("close", () => {
                this.connected = false;
                console.log("Connection to ROSBridge was closed!");
                clearInterval(this.pubInterval);
                document.getElementById('divCamera').innerHTML = ''
                document.getElementById('divCamera2').innerHTML = ''
            });
        },
        publish: function () {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                //name: "/mobile_base_controller/cmd_vel",// Tiago Compatibility
                name: "/cmd_vel",// RB1 Compatibility
                messageType: "geometry_msgs/Twist"
            });
            let message = new ROSLIB.Message({
                linear: { x: this.joystick.vertical, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: this.joystick.horizontal, },
            });
            topic.publish(message);
        },
        disconnect: function () {
            this.ros.close();
        },
        sendCommand: function () {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: "/cmd_vel",
                messageType: "geometry_msgs/Twist"
            });
            let message = new ROSLIB.Message({
                linear: { x: 1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0.5, },
            });
            topic.publish(message);
        },
        startDrag() {
            this.dragging = true;
            this.x = this.y = 0;
        },
        stopDrag() {
            this.dragging = false;
            this.x = this.y = "no";
            this.dragCircleStyle.display = "none";
            this.resetJoystickVals();
        },
        doDrag(event) {
            if (this.dragging) {
                this.x = event.offsetX;
                this.y = event.offsetY;
                let ref = document.getElementById("dragstartzone");
                this.dragCircleStyle.display = "inline-block";
                let minTop = ref.offsetTop - parseInt(this.dragCircleStyle.height) / 2;
                let top = this.y + minTop;
                this.dragCircleStyle.top = `${top}px`;
                let minLeft = ref.offsetLeft - parseInt(this.dragCircleStyle.width) / 2;
                let left = this.x + minLeft;
                this.dragCircleStyle.left = `${left}px`;
                this.setJoystickVals();
            }
        },
        setJoystickVals() {
            this.joystick.vertical = -1 * ((this.y / 200) - 0.5);
            this.joystick.horizontal = +1 * ((this.x / 200) - 0.5);
        },
        resetJoystickVals() {
            this.joystick.vertical = 0;
            this.joystick.horizontal = 0;
        },
        setCamera: function () {
            let without_ws = this.web_video_server_address.split('ws://')[1]
            let domain = without_ws.split('/')[0]
            // eslint-disable-next-line 
            let viewer = new MJPEGCANVAS.Viewer({
                divID: 'divCamera',
                host: domain,
                width: 500,
                height: 300,
                //topic: '/xtion/rgb/image_raw',// Tiago Compatibility
                topic: '/camera/image_raw',// RB1 Compatibility
                ssl: false,
            })
        },
        setCamera2: function () {
            let without_ws = this.web_video_server_address.split('ws://')[1]
            let domain = without_ws.split('/')[0]
            // eslint-disable-next-line 
            let viewer = new MJPEGCANVAS.Viewer({
                divID: 'divCamera2',
                host: domain,
                width: 500,
                height: 300,
                type: 'vp8',
                //topic: '/xtion/depth/image', // Tiago Compatibility
                topic: '/camera/depth/image_raw',
                ssl: false,
            })
        },
    },
    mounted() {
        // page is ready
        window.addEventListener("mouseup", this.stopDrag);
    }
}
</script>

