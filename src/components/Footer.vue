<template>
  <v-footer dark padless app inset>
    <v-card class="flex" flat tile color="grey" :elevation="10">
      <v-card-text class="py-2 white--text text-center">
        <strong>My ROS project</strong> — {{ new Date().getFullYear() }}/{{ new Date().getMonth()+1}}/{{ new
        Date().getDate()}}
      </v-card-text>
    </v-card>
  </v-footer>
</template>