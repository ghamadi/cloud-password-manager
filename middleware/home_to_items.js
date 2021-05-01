export default function ({ store, route, redirect }) {
  if (route.name === 'index') redirect({ name: 'items' })
}
