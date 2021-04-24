import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - cloud-password-manager',
    title: 'cloud-password-manager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@200;300;400;600&family=Noto+Sans+TC:wght@100;300;400;500;700&family=PT+Mono&family=Megrim&display=swap',
      },
    ],
  },

  server: {
    port: 8080, // default: 3000
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/globals', '@/plugins/vuex-persist'],

  router: {
    middleware: 'authenticate',
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/firebase',
  ],

  firebase: {
    config: {
      apiKey: 'AIzaSyBas2i8-CujAaohMnTbrz07CPT1au6ij6E',
      authDomain: 'cloud-password-manager-1.firebaseapp.com',
      projectId: 'cloud-password-manager-1',
      storageBucket: 'cloud-password-manager-1.appspot.com',
      messagingSenderId: '582333801360',
      appId: '1:582333801360:web:2b08e49324524acd2b8915',
      measurementId: 'G-97LJ7J9M0Z',
    },
    services: {
      auth: {
        persistence: 'local', // default
        initialize: {
          onAuthStateChangedMutation: 'auth/SET_CURRENT_USER',
          subscribeManually: false,
        },
      },
      firestore: {
        enablePersistence: true,
      },
      analytics: true,
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#d12f2e',
          secondary: '#151b26',

          darkGray: '#4A4A4A',
          toggled: '#939393',
          // accent: colors.shades.white,
          // info: '#00a3e0',
          accent: '#0089bb',
          info: '#6f7782',
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
