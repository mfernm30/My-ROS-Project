<template>
  <v-app>
    <Navbar />
    <v-main class="ma-4">
      <router-view></router-view>
    </v-main>
    <Footer />
  </v-app>

</template>

<script>

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


export default {
  name: 'App',

  components: {
    Navbar,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>

<style>
@import './assets/styles/joystick.css';
</style>