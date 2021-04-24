import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  console.log('plugin')
  new VuexPersistence({
    /* your options */
    reducer: (state) => {
      if (state.auth.keyGen) {
        console.log('TYPE', typeof state.auth.keyGen.vaultKey)
      }
      return {
        auth: {
          keyGen: state.auth.keyGen
            ? {
                vaultKey: state.auth.keyGen.vaultKey,
                publicKey: state.auth.keyGen.publicKey,
              }
            : { vaultKey: null, publicKey: null },
        },
      }
    }, // sample reducer
    // modules: ['auth'],
  }).plugin(store)

  // new VuexPersistence({
  //   /* your options */
  //   // key: 'session',
  //   // modules: ['projects', 'payments', 'clients', 'alerts'],
  //   // storage: window.sessionStorage,
  // }).plugin(store)
}
