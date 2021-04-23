<template>
  <nuxt-link
    class="nav-link d-flex align-center"
    exact
    exact-active-class="active-nav-link"
    :to="to"
  >
    <v-icon size="20" class="mx-5"> {{ icon }} </v-icon>
    <span> {{ title }} </span>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
a.nav-link {
  text-decoration: none;
  height: 35px;
  font-size: 0.85em;

  &:hover {
    background-color: #f5f5f517;
  }

  & * {
    color: white;
  }

  &.active-nav-link {
    background-color: #ffffff29;
    &,
    & > * {
      color: #ff6b5d;
    }
  }
}
</style>
