<template>
  <v-navigation-drawer
    id="right-drawer"
    v-model="drawer"
    :width="`${$vuetify.breakpoint.mobile ? '100%' : '40%'}`"
    :temporary="$vuetify.breakpoint.mobile"
    app
    clipped
    right
    stateless
    class="shadow-border"
    @click.native.stop="drawer = true"
  >
    <v-form ref="item_form" @submit.prevent="submitForm">
      <!-- HEADER -->
      <header
        class="d-flex justify-space-between pl-5 pr-6 py-4 gray-bottom-border"
      >
        <v-btn
          text
          outlined
          small
          :disabled="!dirty"
          color="primary"
          class="save-button px-2"
          type="submit"
        >
          <v-icon left small>mdi-check</v-icon>
          <span class="text-capitalize mr-1">Save</span>
          <span class="text-lowercase">changes</span>
        </v-btn>

        <div class="d-flex align-end justify-space-around mr-1">
          <!-- <header-actions></header-actions> -->
          <v-btn
            small
            icon
            class="semi-squared ml-2"
            @click.stop="drawer = false"
          >
            <v-icon size="20">mdi-arrow-collapse-right</v-icon>
          </v-btn>
        </div>
      </header>

      <!-- TITLE -->
      <section class="title-field-container mx-4 mt-5">
        <v-textarea
          v-model="title"
          color="info"
          outlined
          rows="1"
          row-height="40"
          dense
          auto-grow
          no-resize
          placeholder="Untitled item..."
          class="title-field"
          :autofocus="currentItem.id === 0"
        ></v-textarea>
      </section>

      <!-- FIELDS -->
      <section>
        <item-field
          v-for="(field, index) in currentItem.fields"
          :key="`${field.id}_${index}`"
          :field-index="index"
        ></item-field>

        <v-btn
          class="add-field-btn"
          text
          :ripple="false"
          color="primary"
          plain
          small
          @click="addField"
        >
          <v-icon left class="mr-5">mdi-plus-circle</v-icon>
          <span class="text-capitalize">Add&nbsp;</span>
          <span class="text-lowercase">field</span>
        </v-btn>
      </section>

      <v-divider class="mt-2 mb-10"></v-divider>

      <!-- NOTES & TAGS -->
      <section class="mx-5">
        <v-combobox
          v-model="tags"
          :filter="filter"
          :items="currentItem.tags"
          hide-selected
          label="Tags"
          multiple
          small-chips
          outlined
          dense
          color="info"
        >
          <template #selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              small
              pill
              color="primary lighten-1"
              close-icon="mdi-close-circle"
              close
              @click:close="data.parent.selectItem(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>

        <v-textarea
          v-model="currentItem.notes"
          color="info"
          outlined
          rows="1"
          auto-grow
          row-height="100"
          no-resize
          placeholder="Add some notes to this item..."
          label="Notes"
        ></v-textarea>
      </section>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ItemField from '~/components/fields/ItemField'

export default {
  components: {
    ItemField,
  },
  data() {
    return {
      dummyTags: ['tag1', 'tag2'],
    }
  },
  computed: {
    ...mapGetters({
      dirty: 'items/dirty',
      rightDrawer: 'nav/rightDrawer',
      currentItem: 'items/currentItem',
    }),
    drawer: {
      get() {
        return this.rightDrawer
      },
      set(value) {
        if (!value && this.dirty) {
          alert('save first')
        } else {
          this.setRightDrawer(value)
        }
      },
    },
    title: {
      get() {
        return this.currentItem.title
      },
      set(value) {
        this.updateItemProperty('title', value)
      },
    },

    tags: {
      get() {
        return this.currentItem.tags
      },
      set(value) {
        this.updateItemProperty('tags', [...value])
      },
    },
  },
  methods: {
    ...mapMutations({
      setRightDrawer: 'nav/SET_RIGHT_DRAWER',
      setItem: 'items/SET_CURRENT_ITEM',
      addField: 'items/ADD_FIELD',
    }),
    submitForm() {
      if (this.$refs.item_form.validate()) {
        console.log('VALID')
      } else {
        console.log('NOT VALID')
      }
    },

    updateItemProperty(property, value) {
      const newItem = { ...this.currentItem }
      newItem[property] = value
      this.setItem(newItem)
    },
    filter(item, queryText, itemText) {
      if (item.header) return false

      const hasValue = (val) => (val != null ? val : '')

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text
        .toString()
        .toLowerCase()
        .includes(query.toString().toLowerCase())
    },
    closeChip(data) {
      data.parent.selectItem(data.item)
    },
  },
}
</script>

<style lang="scss">
#right-drawer {
  .add-field-btn {
    margin-left: 13px;
  }
  &.shadow-border {
    box-shadow: 0 5px 20px 0 rgb(21 27 38 / 8%);
  }
  .save-button {
    font-weight: 300;
  }

  .title-field {
    font-weight: 400;
    font-size: 1em;
  }
}
</style>
