<template>
  <v-row class="item-field mb-2" justify="start" align="center" no-gutters>
    <v-col cols="1">
      <v-btn
        icon
        small
        color="primary lighten-1"
        class="mt-1 ml-4"
        @click="deleteField(fieldIndex)"
      >
        <v-icon small>mdi-minus-circle</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="11" md="auto" class="mb-2 mb-md-0">
      <!-- LABEL -->
      <v-text-field
        :ref="`field_label_${fieldIndex}`"
        v-model="label"
        dense
        :class="`field-input field-label shrink mr-2 ml-4 ml-md-0  ${
          $vuetify.breakpoint.mobile ? 'text--left' : 'text--right'
        }`"
        placeholder="label"
        hide-details
        color="info"
        :outlined="focused"
        :rules="[$rules.required]"
        @focus="onFocus"
        @blur="focused = false"
      />
    </v-col>

    <v-col cols="9" md="7" class="ml-4 ml-md-0 d-flex align-center">
      <!-- TEXTAREA INPUT (if type == long-text) -->
      <v-textarea
        v-if="type == 'long-text'"
        v-model="value"
        color="info"
        class="field-input"
        rows="1"
        row-height="40"
        dense
        outlined
        auto-grow
        no-resize
        hide-details
      ></v-textarea>

      <!-- DATE INPUT (if type == date) -->
      <v-menu
        v-else-if="type == 'date'"
        v-model="datePicker"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            :value="value"
            outlined
            color="info"
            dense
            v-bind="attrs"
            placeholder="Click to pick a date"
            hide-details
            class="field-input"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="value"
          @input="datePicker = false"
        ></v-date-picker>
      </v-menu>

      <!-- TEXT INPUT (default) -->
      <v-text-field
        v-else
        v-model="value"
        :type="type"
        color="info"
        dense
        :outlined="!typeIsPassword"
        :loading="typeIsPassword"
        :class="`field-input ${typeIsPassword ? 'password-input' : ''}`"
        hide-details
      >
        <template #progress>
          <v-progress-linear
            v-if="typeIsPassword"
            :value="passwordStrength.strength"
            :color="passwordStrength.color"
            background-opacity="0.2"
            :indeterminate="false"
            absolute
            height="4"
            rounded
            style="top: 26px"
          ></v-progress-linear>
        </template>

        <template #append>
          <v-btn
            v-if="typeIsPassword"
            icon
            x-small
            :ripple="false"
            class="mr-3 mt-1"
            @click="showPass = !showPass"
          >
            <v-icon color="info">{{ inputAppendIcon }}</v-icon>
          </v-btn>
        </template>
      </v-text-field>

      <v-btn v-if="typeIsPassword" icon small @click="openPassGen">
        <v-icon small>mdi-key-variant</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="auto">
      <!-- TYPE PICKER -->
      <v-menu v-model="fieldActions">
        <template #activator="{ on, attrs }">
          <v-btn icon small v-bind="attrs" class="mr-3" v-on="on">
            <v-icon small>mdi-dots-horizontal-circle-outline</v-icon>
          </v-btn>
        </template>
        <v-list dense shaped>
          <v-list-item-group v-model="type" color="primary">
            <v-list-item
              v-for="(fieldType, i) in fieldTypes"
              :key="i"
              dense
              :value="fieldType.value"
            >
              <v-list-item-icon>
                <v-icon v-text="fieldType.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="fieldType.label"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { categories } from '~/lib/item_categories'
import { AlertObject, CancelButton, OkButton } from '~/lib/models/alert_data'
import { scorePassword } from '~/lib/password_generator'

export default {
  props: {
    fieldIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      categories,
      datePicker: false,
      fieldActions: false,
      focused: false,
      showPassGen: false,
      showPass: false,
      fieldTypes: [
        { icon: 'mdi-text', label: 'Text', value: 'text' },
        { icon: 'mdi-text-subject', label: 'Long text', value: 'long-text' },
        { icon: 'mdi-calendar', label: 'Date', value: 'date' },
        {
          icon: 'mdi-form-textbox-password',
          label: 'Password',
          value: 'password',
        },
      ],
    }
  },

  computed: {
    ...mapGetters({
      item: 'items/currentItem',
      passGenDialog: 'dialogs/passGenDialog',
      randomPass: 'pass/randomPass',
    }),

    inputAppendIcon() {
      if (this.typeIsPassword) {
        return this.showPass ? 'mdi-eye' : 'mdi-eye-off'
      }
      return ''
    },

    typeIsPassword() {
      return this.getFieldProperty('type') === 'password'
    },

    currentField() {
      return this.item.fields[this.fieldIndex]
    },
    label: {
      get() {
        return this.getFieldProperty('label') || ''
      },
      set(value) {
        this.updateFieldProperty('label', value)
      },
    },
    value: {
      get() {
        return this.getFieldProperty('value') || ''
      },
      set(value) {
        this.updateFieldProperty('value', value)
      },
    },
    type: {
      get() {
        const val = this.getFieldProperty('type')
        if (val === 'password') {
          return (!this.showPass && val) || 'text'
        }
        return val || 'text'
      },
      set(value) {
        if (value === 'date') this.value = ''
        this.updateFieldProperty('type', value)
      },
    },
    passwordStrength() {
      const { score, gaugeColor } = scorePassword(this.value)
      return { strength: score, color: gaugeColor }
    },
  },

  methods: {
    ...mapMutations({
      updateField: 'items/UPDATE_FIELD_BY_INDEX',
      deleteField: 'items/REMOVE_FIELD_BY_INDEX',
      setCurrentAlert: 'dialogs/SET_CURRENT_ALERT',
      setPassGenDialog: 'dialogs/SET_PASS_GEN_DIALOG',
      setRandomPass: 'pass/SET_RANDOM_PASS',
    }),

    updateFieldProperty(property, value) {
      const obj = {}
      obj[property] = value
      const oldField = { ...this.currentField }
      const newField = Object.assign(oldField, obj)
      this.updateField({ newField, index: this.fieldIndex })
    },
    getFieldProperty(property) {
      return this.item.fields[this.fieldIndex][property]
    },
    onFocus(event) {
      event.target.select()
      this.focused = true
    },
    openPassGen() {
      const okHandler = () => {
        this.value = this.randomPass
        this.setPassGenDialog(false)
        this.setRandomPass(null)
      }
      const cancelHandler = () => {
        this.setPassGenDialog(false)
        this.setRandomPass(null)
      }

      const ok = new OkButton(okHandler)
      const cancel = new CancelButton(cancelHandler)

      const alertObject = new AlertObject({
        title: 'Password Generator',
        message: 'test',
        actions: [ok, cancel],
      })
      this.setRandomPass(this.value)
      this.setCurrentAlert(alertObject)
      this.setPassGenDialog(true)
    },
  },
}
</script>

<style scoped>
.item-field {
  position: relative;
}
.field-label >>> .v-input__slot {
  width: 150px;
}

.field-label >>> .v-input__slot,
.field-input >>> .v-input__slot {
  min-height: 30px !important;
}

.field-label >>> .v-input__slot::before,
.field-label >>> .v-input__slot::after {
  border: 1px solid transparent !important;
}

.field-label >>> .v-input__slot:hover {
  border: 1px solid grey;
  border-radius: 5px;
}

.field-label >>> input,
.field-input >>> input {
  font-size: 0.9em;
  padding: 0;
}

.field-input.password-input {
  border: 1px solid #6f7782;
  border-radius: 5px;
}

.field-input.password-input >>> input {
  padding-left: 5px;
}

.field-label >>> input {
  overflow: none;
  text-overflow: ellipsis;
}

.text--right >>> input {
  text-align: right;
}
</style>
