<template>
  <v-card>
    <v-card-title style="font-size: 1.5em">
      {{ alertObject.title }}
    </v-card-title>
    <v-card-text class="mt-5 font-weight-light" style="font-size: 1.1em">
      <slot> {{ alertObject.message }}</slot>
    </v-card-text>
    <v-card-actions v-if="alertObject.actions">
      <v-row style="width: 100%" class="py-0 my-0">
        <v-col
          v-for="(action, index) in alertObject.actions"
          :key="index"
          :cols="12 / (alertObject.actions && alertObject.actions.length)"
        >
          <v-btn
            width="100%"
            :color="action.color"
            :class="action.class || ''"
            :text="action.style.text"
            :outlined="action.style.outlined"
            :depressed="action.style.depressed"
            :dark="action.style.dark"
            @click="action.handler"
          >
            {{ action.label }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      alertObject: 'dialogs/currentAlert',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
