<template>
  <v-btn
    plain
    :ripple="false"
    color="white"
    :width="width"
    :class="`link-button info--text text-${letterCase} ${
      underline === false
        ? 'text-decoration-none'
        : underline && 'text-decoration-underline'
    } `"
  >
    <slot>Button</slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    letterCase: {
      type: String,
      default: 'uppercase',
    },
    width: {
      type: [String, Number],
      default: 'auto',
    },
    underline: {
      type: Boolean,
      default: undefined, // other values: always, never.
    },
  },
}
</script>
<style lang="scss">
.link-button:hover {
  text-decoration: underline;
}
</style>
