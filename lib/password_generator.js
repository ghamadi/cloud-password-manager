import Seedrandom from 'seedrandom/seedrandom.js'

export default function generatePassword(
  length,
  { numbers = true, upper = true, symbols = true }
) {
  const arr = []
  for (let i = 0; i < length; i++) {
    // insert random character at random position
    const index = randIntInRange(0, arr.length + 1)
    arr.splice(index, 0, randomCharacter({ numbers, upper, symbols }))
  }
  return arr.join('')
}

const randRng = new Seedrandom()

function randomCharacter({ numbers = true, upper = true, symbols = true }) {
  const charChoices = [randomLower]
  if (numbers) charChoices.push(randomNumber)
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
  const symbols = '!@#$%^&*(){}[]=<>/;:,.\\" \'_'
  return symbols[randIntInRange(0, symbols.length)]
}

// range [min, max)
function randIntInRange(min, max) {
  return Math.floor((max - min) * randRng() + min)
}
