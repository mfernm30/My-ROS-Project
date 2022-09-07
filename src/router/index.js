import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoystickView from '../views/JoystickView.vue'
import GamepadView from '../views/GamepadView.vue'
import VideocamView from '../views/VideocamView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/JoystickView',
    name: 'JoystickView',
    component: JoystickView
  },
  {
    path: '/GamepadView',
    name: 'GamepadView',
    component: GamepadView
  },
  {
    path: '/VideocamView',
    name: 'VideocamView',
    component: VideocamView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
