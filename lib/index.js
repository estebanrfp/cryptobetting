import Gun from 'gun/gun'
import 'gun/sea'

import 'gun/lib/shim'
import 'gun/lib/then'
import 'gun/lib/not'
import 'gun/lib/bye'
import 'gun/lib/webrtc'
import 'gun/lib/time'

// import './ipfs'
// import './email'
// import './chains'

import './index.css'
// import OfflinePlugin from './components/OfflinePlugin'
import Layout from './components/Layout'
import { createAlert } from './components/utils'

// window.localStorage.clear()

// const peers = ['http://18.222.4.31:8765/gun'/* ,'https://notabug.io/gun' */]
// window.gun = Gun({ peers, localStorage: false, radisk: false })

const peers = ['http://localhost:8765/gun'/* ,'https://notabug.io/gun' */]

window.gun = Gun({ peers, localStorage: true, radisk: true })

// window.gun.get('users').get({ userId: window.location.hash }).put(thisUser)
window.gun.get('users').map().once(data => console.log(data.userId))

window.gun.connected(boo => {
  if (boo) {
    // createAlert('', '', 'CONNECTED TO SUPERPEER IN REALTIME', 'info', true, true)
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(registration => registration.update())
    } else if (window.applicationCache) {
      applicationCache.update()
    }
    window.gun.get('status').onDisconnect().put('offline')
  } else {
    createAlert('', '', 'OFFLINE FIRST MODE', 'info', true, true)
  }
})

// window.gun.get('status').put('online').later(data => console.log('Status: ', data), 10)
// window.gun.get('marknadal').get('status').put("I'm online!")
// window.gun.get('marknadal').get('status').bye().put("I'm offline. :(")

// OfflinePlugin()
Layout()

const gun = Gun(`${ window.location.host }/gun`)

gun.on('hi', peer => console.log('connect peer to', peer)) // peer connect
gun.on('bye', peer => console.log('disconnected from', peer)) // peer disconnect

setInterval(() => {
  // setTimeout(() => gun.get('notify').put({ msg: '¡ Hagan sus apuestas !' }), 2500)
  const randomNumber = Math.floor(Math.random() * 36)
  gun.get('start').put({ number: randomNumber })
}, 35000)

// console.log(":-) IPFS PLUGIN NOT OFFICIALLY MAINTAINED! PROBABLY WON'T WORK! USE AT YOUR OWN RISK! PLEASE CONTRIBUTE FIXES!")

// const node = new IPFS()

// // once the node is ready
// node.once('ready', () => {
//   // convert your data to a Buffer and add it to IPFS
//   node.add(IPFS.Buffer.from(data), (err, files) => {
//     if (err) return console.error(err)

//     // 'hash', known as CID, is a string uniquely addressing the data
//     // and can be used to get it again. 'files' is an array because
//     // 'add' supports multiple additions, but we only added one entry
//     console.log(files[0].hash)
//   })
// })

// IPFS

// const opt = window.gun._.opt
// let u

// if (u === opt.ipfs.directory) {
//   opt.ipfs.directory = '/gun'
// }

// opt.store = {}
// opt.store.put = (file, data, cb) => {
//   const uri = `${ opt.ipfs.directory }/${ file }`
//   opt.ipfs.instance.files.write(uri, Buffer.from(JSON.stringify(data)), { create: true })
//     .then(res => {
//       console.log('File written to IPFS directory', uri, res)
//       return opt.ipfs.instance.files.stat(opt.ipfs.directory, { hash: true })
//     })
//     .then(res => {
//       console.log('Directory hash:', res.hash)
//       return opt.ipfs.instance.name.publish(res.hash)
//     // currently throws "This command must be run in online mode. Try running 'ipfs daemon' first." for some reason, maybe js-ipfs IPNS not ready yet
//     })
//     .then(res => {
//       console.log('IPFS put request successful:', res)
//       cb(undefined, 1)
//     })
//     .catch(error => {
//       console.error('IPFS put request failed', error)
//     })
// }

// opt.store.get = (file, cb) => {
//   const uri = `${ opt.ipfs.directory }/${ file }`
//   opt.ipfs.instance.files.read(uri, {})
//     .then(res => {
//       const data = JSON.parse(res.toString())
//       console.log(`${ uri } was loaded from ipfs:`, data)
//       cb(data)
//     })
// }

// opt.store.list = cb => {
//   const stream = opt.ipfs.files.lsReadableStream(opt.ipfs.directory)

//   stream.on('data', file => {
//     console.log('ls', file.name)
//     if (cb(file.name)) {
//       stream.destroy()
//     }
//   })

//   stream.on('finish', () => cb())
// }
