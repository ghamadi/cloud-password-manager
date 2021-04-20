export default function ({ store, route, redirect }) {
  const user = store.state.auth.currentUser
  if (user && user.emailVerified) {
    if (route.name === 'auth') {
      redirect({ name: 'home' })
    }
  } else if (route.name !== 'auth') {
    redirect({ name: 'auth' })
    store.dispatch('auth/logout')
    // store.commit('auth/SET_CURRENT_USER', null)
  }
}
