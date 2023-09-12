// import { h, render } from 'preact'
import Web3 from 'web3'
// import Eth from 'ethjs'

import {
  spinner,
  // changeUpdate,
  createAlert
} from '../utils'

export default () => {
  const $layout = document.querySelector('.Layout')

  window.addEventListener('load', async () => {
    if (window.ethereum) {
      // // const web3 = new Web3(web3.currentProvider)
      // const web3 = new Web3(Web3.givenProvider)

      // web3.eth.getAccounts((error, accounts) => {
      //   if (error) {
      //     console.log(error)
      //   }
      //   web3.eth.getBalance(accounts[0], (err, wei) => {
      //     document.querySelector('#balance').innerHTML = `Balance : ${ web3.utils.fromWei(wei, 'ether') }`
      //   })
      // })
    } else {
      createAlert('', 'Metamask', 'Para jugar debes instalar Metamask !', 'info', true, true)
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  })


  // window.addEventListener('load', async () => {
  //   // Modern dapp browsers...
  //   if (window.ethereum) {
  //     window.web3 = new Web3(ethereum)
  //     window.ethereum.autoRefreshOnNetworkChange = false

  //     try {
  //       // Request account access if needed
  //       await ethereum.enable()

  //       // this.web3.eth.getBalance(this.account, (err, balance) => {
  //       //   this.balance = this.web3.fromWei(balance, "ether") + " ETH"
  //       // })

  //       // web3.eth.getBalance('0xC9f9b6d99d605880C8dD85DBCbBE94E83af738A5', (err, wei) => {
  //       //   console.log(web3.utils.fromWei(wei, 'ether'))
  //       // })
  //       // Acccounts now exposed
  //       web3.eth.sendTransaction({/* ... */ })
  //       console.log(web3.eth)
  //     } catch (error) {
  //       // User denied account access...
  //     }
  //   }
  //   // Legacy dapp browsers...
  //   else if (window.web3) {
  //     window.web3 = new Web3(web3.currentProvider)
  //     // Acccounts always exposed

  //     web3.eth.sendTransaction({/* ... */ })
  //   }
  //   // Non-dapp browsers...
  //   else {
  //     createAlert('', 'Metamask', 'Para jugar debes instalar Metamask !', 'info', true, true)
  //     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
  //   }
  // })
  // const SEA = window.Gun.SEA
  // const user = window.gun.user()

  // SEA.throw = true

  // window.renderUser = profile => {
  //   const mainlogo = document.querySelector('.mainlogo')
  //   if (profile) {
  //     render(
  //       (
  //         <a class="userLink" href="/profile/" onClick={ window.handleClick }>
  //           <img class="userImage" src={ profile.image || 'https://desarrolloactivo.ams3.cdn.digitaloceanspaces.com/images/icon-user-default.svg' } alt={ profile.username } title={ profile.username } />
  //         </a>
  //       ), mainlogo, mainlogo.lastChild
  //     )
  //   } else {
  //     render(
  //       (
  //         <a class="userLink" href="/">
  //           <img class="userImage" src="https://desarrolloactivo.ams3.cdn.digitaloceanspaces.com/images/icon-user-default.svg" alt="default" />
  //         </a>
  //       ), mainlogo, mainlogo.lastChild
  //     )
  //   }

  //   render(<Menu />, menuLeft, menuLeft.lastChild)
  // }

  // const alias = sessionStorage.getItem('alias') || null
  // const tmp = sessionStorage.getItem('tmp') || null

  // if (alias && tmp) {
  //   user.auth(alias, tmp, () => {
  //     // console.log(user.is.pub)
  //     if (user.is) {
  //       user.get('profile').once(profile => window.renderUser(profile))
  //       // pub = user.is.pub
  //     } else {
  //       window.renderUser(null)
  //     }
  //   })
  // }

  // window.gun.on('auth', () => user.get('profile').once(profile => window.renderUser(profile)))

  window.handleClick = e => {
    const url = e.currentTarget.getAttribute('href')
    window.route({ tpl: url }, 'List', url)
    window.page(url)
    e.preventDefault()
  }

  const spas = document.querySelectorAll('.spa')
  for (const el of spas) {
    // console.log(el.getAttribute('href'))
    el.addEventListener('click', window.handleClick, false)
    // const url = spa.getAttribute('href')
    // window.route({ tpl: url }, 'List', url)
    // window.page(url)
  }

  async function Page (url) {
    try {
      spinner('show')
      window.gun.get('start').off()
      // window.gun.get('notify').off()
      switch (url) {
        case '/': {
          await import('../Home').then(module => module.default())
          break
        }
        case '/roulette': {
          await import('../Roulette').then(module => module.default())
          break
        }
        case '/welcome': {
          await import('../Welcome1').then(module => module.default())
          break
        }
        case '/login': {
          await import('../Login').then(module => module.default())
          break
        }
        case '/login2': {
          await import('../Login2').then(module => module.default())
          break
        }
        // case '/game': {
        //   await import('../Game').then(module => module.default())
        //   break
        // }
        default: {
          // const Notfound = await import('../Notfound').then(module => module.default)
          // $layout.innerHTML = ''
          // render(<Notfound />, $layout, $layout.lastChild)
          break
        }
      }
      spinner('hide')
    } catch (err) {
      spinner('hide')
      createAlert('', 'GLOBAL ERROR', err.message, 'warning', true, true)
    }
  }

  function Router (obj, title, url) {
    window.history.pushState(obj, title, url)
  }

  window.page = Page
  window.route = Router
  window.onpopstate = e => {
    if (e) {
      Page(e.state.tpl)
    }
  }

  Page(document.location.pathname)
}
