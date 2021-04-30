export default class SnackbarObject {
  constructor({ message, actionColor, color, top, timeout, multiLine }) {
    Object.assign(this, {
      message,
      actionColor: actionColor || 'primary',
      color: color || 'secondary',
      top,
      timeout: timeout || 2000,
      multiLine,
    })
  }
}
