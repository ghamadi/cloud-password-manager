<template>
  <v-dialog v-model="dialog" persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({ loading: 'loading' }),
    dialog: {
      get() {
        console.log('getter')
        return this.loading
      },
      set(value) {
        this.setLoading(value)
      },
    },
  },

  methods: {
    ...mapMutations({ setLoading: 'SET_LOADING' }),
  },
}
</script>
