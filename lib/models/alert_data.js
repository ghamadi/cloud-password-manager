export function AlertAction({ label, color, style, btnClass, handler }) {
  this.label = label
  this.color = color
  this.btnClass = btnClass
  this.handler = handler || (() => {})
  this.style = style || {}
}

export function AlertObject({ title, message, actions }) {
  this.title = title
  this.message = message
  this.actions =
    !actions || !actions.length ? [] : actions.map((a) => new AlertAction(a))
}

export function OkButton(handler) {
  AlertAction.call(this, {
    label: 'Ok',
    color: 'primary',
    style: { depressed: true, dark: true },
    handler,
  })
}

export function CancelButton(handler) {
  AlertAction.call(this, {
    label: 'Cancel',
    color: 'primary',
    style: { text: true, outlined: true },
    handler,
  })
}
