import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    /* your options */
    reducer: (state) => {
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
