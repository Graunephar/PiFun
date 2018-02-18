const sensorLib = require('node-dht-sensor')
sensorLib.initialize(22, 12) // #A
const interval = setInterval(() => { // #B
  read()
}, 2000)
function read () {
  let readout = sensorLib.read() // #C
  console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' + // #D
    'humidity: ' + readout.humidity.toFixed(2) + '%')
};
process.on('SIGINT', () => {
  clearInterval(interval)
  console.log('Bye, bye!')
  process.exit()
})
