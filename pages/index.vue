<template>
  <v-row style="height: 90vh" justify="center" align="center">
    <v-btn x-large color="primary" @click="logout">LOGOUT</v-btn>
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
