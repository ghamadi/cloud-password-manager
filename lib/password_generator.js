import Seedrandom from 'seedrandom/seedrandom.js'

export function generatePassword(length, { numbers, lower, upper, symbols }) {
  const arr = []
  for (let i = 0; i < length; i++) {
    // insert random character at random position
    const index = randIntInRange(0, arr.length + 1)
    arr.splice(index, 0, randomCharacter({ numbers, lower, upper, symbols }))
  }
  return arr.join('')
}

export function scorePassword(pass) {
  let score = 0

  if (pass) {
    // award every unique letter until 5 repetitions
    const letters = {}
    for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1
      score += 5.0 / letters[pass[i]]
    }

    // bonus points for mixing it up
    const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    }

    let variationCount = 0
    for (const check in variations) {
      variationCount += variations[check] === true ? 1 : 0
    }
    score += (variationCount - 1) * 10
  }

  score = parseInt(score)

  const gaugeColor = ((score) => {
    if (score > 90) return 'success darken-2'
    if (score > 80) return 'success darken-1'
    if (score > 70) return 'success'
    if (score > 50) return 'warning dakren-2'
    if (score > 30) return 'warning'
    return 'error'
  })(score)

  return { score, gaugeColor }
}

const randRng = new Seedrandom()

function randomCharacter({ numbers, lower, upper, symbols }) {
  const charChoices = []
  if (numbers) charChoices.push(randomNumber)
  if (lower) charChoices.push(randomLower)
  if (upper) charChoices.push(randomUpper)
  if (symbols) charChoices.push(randomSymbol)
  return charChoices[randIntInRange(0, charChoices.length)]()
}

function randomLower() {
  const asciia = 97
  return String.fromCharCode(randIntInRange(asciia, asciia + 26))
}

function randomUpper() {
  const asciiA = 65
  return String.fromCharCode(randIntInRange(asciiA, asciiA + 26))
}

function randomNumber() {
  const asciiZero = 48
  return +String.fromCharCode(randIntInRange(asciiZero, asciiZero + 10))
}

function randomSymbol() {
  const symbols = `!";#$%&'()*+,-./:;<=>?@[]^_\`{|}~`
  return symbols[randIntInRange(0, symbols.length)]
}

// range [min, max)
function randIntInRange(min, max) {
  return Math.floor((max - min) * randRng() + min)
}
