const Gpio = require('onoff').Gpio // #A
const led = new Gpio(4, 'out') // #17, 27, or 22 wired
let interval
interval = setInterval(() => { // #C
  let value = (led.readSync() + 1) % 2 // #D
  led.write(value, () => { // #E
    console.log('Changed LED state to: ' + value)
  })
}, 2000)
process.on('SIGINT', () => { // #F
  clearInterval(interval)
  led.writeSync(0) // #G
  led.unexport()
  console.log('Bye, bye!')
  process.exit()
})
