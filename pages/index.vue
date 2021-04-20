<template>
  <v-row justify="center" align="center">
    <v-btn @click="logout">LOGOUT</v-btn>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions({ logout: 'auth/logout' }),
  },
}
</script>
