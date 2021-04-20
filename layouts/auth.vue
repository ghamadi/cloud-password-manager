<template>
  <v-app class="auth-layout">
    <v-app-bar app dense color="white">
      <div class="logo primary--text">CPass</div>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {}
</script>

<style lang="scss">
html {
  overflow-y: auto;
}

.auth-layout {
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 14pt;
  font-weight: 300;
}

.logo {
  font-family: 'Megrim', cursive;
  display: flex;
  justify-content: center;
  font-size: 1.4em;
  font-weight: bold;
}
</style>
