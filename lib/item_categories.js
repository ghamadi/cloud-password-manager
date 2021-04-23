import Field from './models/field'

export const categoryIDs = {
  bank: 'bank',
  password: 'password',
  note: 'note',
  payment: 'payment',
  driverLicense: 'driver',
  wifi: 'wifi',
  passport: 'passport',
}

export const categories = [
  {
    categoryID: categoryIDs.password,
    label: 'Password',
    icon: 'mdi-form-textbox-password',
    fields: passwordFields(),
  },
  {
    categoryID: categoryIDs.note,
    label: 'Secure Note',
    icon: 'mdi-script-text-key',
    fields: notesFields(),
  },
  {
    categoryID: categoryIDs.bank,
    label: 'Bank Account',
    icon: 'mdi-bank',
    fields: bankFields(),
  },
  {
    categoryID: categoryIDs.payment,
    label: 'Payment Card',
    icon: 'mdi-credit-card-outline',
    fields: paymentFields(),
  },
  {
    categoryID: categoryIDs.wifi,
    label: 'Wifi Password',
    icon: 'mdi-router-wireless',
    fields: wifiFields(),
  },
  {
    categoryID: categoryIDs.driverLicense,
    label: "Driver's License",
    icon: 'mdi-card-account-details',
    fields: driverFields(),
  },
  {
    categoryID: categoryIDs.passport,
    label: 'Passport',
    icon: 'mdi-passport',
    fields: passportFields(),
  },
]

function passwordFields() {
  const fields = [
    { label: 'URL' },
    { label: 'Name' },
    { label: 'Username' },
    { label: 'Password', type: 'password' },
  ]
  return buildFields(categoryIDs.password, fields)
}

function notesFields() {
  // the secure note only needs a 'notes' field which is a default in every item
  return buildFields(categoryIDs.note, [])
}

function bankFields() {
  const fields = [
    { label: 'Bank Name' },
    { label: 'Name on Account' },
    { label: 'Account Number' },
    { label: 'Routing Number' },
    { label: 'SWIFT' },
    { label: 'IBAN' },
    { label: 'PIN', type: 'password' },
    { label: 'Branch Address' },
    { label: 'Branch Phone' },
  ]
  return buildFields(categoryIDs.bank, fields)
}
function paymentFields() {
  const fields = [
    { label: 'Name on Card' },
    { label: 'Type' },
    { label: 'Card Number' },
    { label: 'Expiration Date', type: 'date' },
    { label: 'Valid from', type: 'date' },
    { label: 'PIN', type: 'password' },
  ]
  return buildFields(categoryIDs.payment, fields)
}
function driverFields() {
  const fields = [
    { label: 'Number' },
    { label: 'Expiration Date', type: 'date' },
    { label: 'Licence Class' },
    { label: 'Full Name' },
    { label: 'Sex' },
    { label: 'Height' },
    { label: 'Date of Birth', type: 'long-text' },
    { label: 'Address', type: 'long-text' },
  ]
  return buildFields(categoryIDs.driverLicense, fields)
}
function wifiFields() {
  const fields = [
    { label: 'SSID' },
    { label: 'Password', type: 'password' },
    { label: 'Security Type' },
  ]
  return buildFields(categoryIDs.wifi, fields)
}
function passportFields() {
  const fields = [
    { label: 'Type' },
    { label: 'Issuing Authority' },
    { label: 'Number' },
    { label: 'Full Name' },
    { label: 'Sex' },
    { label: 'Nationality' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Issuance on', type: 'date' },
    { label: 'Expiration Date', type: 'date' },
  ]
  return buildFields(categoryIDs.passport, fields)
}

function buildFields(categoryID, objectsArray) {
  return objectsArray.map((obj) => new Field({ categoryID, ...obj }))
}
