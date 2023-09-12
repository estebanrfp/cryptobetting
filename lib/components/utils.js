import createAlert from './Alerts'

function spinner (mode) {
  const _spinner = document.querySelector('.spinner')
  if (mode === 'load') {
    _spinner.classList.add('fadeout')
  } else if (mode === 'show') {
    _spinner.classList.remove('fadeout')
  } else if (mode === 'hide') {
    _spinner.classList.add('fadeout')
  }
}

function loadjsfile (url) {
  const el = document.querySelectorAll(`script[src='${ url }']`)
  return new Promise((resolve, reject) => {
    if (!el.length) {
      const script = document.createElement('script')
      // script.setAttribute("type", "text/javascript")
      script.setAttribute('src', url)
      script.setAttribute('data-timestamp', +new Date())
      script.onload = resolve
      script.onerror = reject
      // script.src = url;
      if (typeof script !== 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    } else {
      resolve()
    }
  })
}

function jsonp (url, callback) {
  const callbackName = `jsonp_callback_${ Math.round(100000 * Math.random()) }`
  const script = document.createElement('script')
  window[callbackName] = data => {
    delete window[callbackName]
    document.body.removeChild(script)
    callback(data)
  }

  script.src = `${ url + (url.indexOf('?') >= 0 ? '&' : '?') }callback=${ callbackName }`
  script.onerror = () => {
    delete window[callbackName]
    document.body.removeChild(script)
    callback(null)
  }
  document.body.appendChild(script)
}

function loadcssfile (url) {
  const el = document.querySelectorAll(`link[href='${ url }']`)
  return new Promise((resolve, reject) => {
    if (!el.length) {
      const link = document.createElement('link')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', url)
      link.setAttribute('data-timestamp', new Date())
      link.onload = resolve
      link.onerror = reject
      if (typeof link !== 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(link)
      }
    } else {
      resolve()
    }
  })
}

// async function notify (message, time = 1800) {
//   const sidebarTop = document.querySelector('.Sidebar-top')
//   const mainContainer = document.querySelector('.main-container')
//   const appContainer = document.querySelector('.app-container')
//   sidebarTop.innerText = message

//   return new Promise(resolve => { // dont use reject
//     mainContainer.classList.add('opacity')
//     appContainer.classList.remove('show-nav-left', 'show-nav-right')
//     appContainer.classList.add('show-nav-top')
//     setTimeout(() => {
//       appContainer.classList.remove('show-nav-top')
//       mainContainer.classList.remove('opacity')
//       appContainer.classList.remove('show-nav-left', 'show-nav-right')
//       resolve()
//     }, time)
//   })
// }

function changeUpdate (selector, fnc, time) {
  let typingTimer
  const doneTypingInterval = time || 1500
  const el = document.querySelector(selector)

  el.onkeyup = () => {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(fnc, doneTypingInterval)
  }
}

function scrollTo (element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10

  setTimeout(() => {
    element.scrollTop += perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

function xhr (type, url, obj, json = true) {
  return new Promise((resolve, reject) => {
    const _xhr = new XMLHttpRequest()
    _xhr.open(type, url)
    _xhr.setRequestHeader('Content-Type', 'application/json')

    const token = window.localStorage.getItem('token')
    if (token) {
      _xhr.setRequestHeader('Authorization', `Bearer ${ token }`)
    }
    spinner('show')
    _xhr.onload = () => {
      spinner('hide')
      if (_xhr.status === 200) {
        if (json === true) {
          resolve(JSON.parse(_xhr.responseText))
        } else {
          resolve(_xhr.responseText)
        }
      } else {
        json = JSON.parse(_xhr.response)

        if (json.type === 'invalid' || json.type === 'tokenexpired') {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('user')
          window.localStorage.setItem('access', 'normal')

          window.page('/login/')
        }

        // if (json.type === 'noaccess') {
        //   window.localStorage.setItem('access', 'normal')
        //   window.page('/')
        // }

        // if (json.type === 'noheader') {
        //   console.log(json.message)
        // }
        reject(json)
      }
    }
    _xhr.send(JSON.stringify(obj))
  })
}

export { 
  xhr,
  spinner,
  createAlert,
  changeUpdate,
  scrollTo,
  loadjsfile,
  loadcssfile,
  jsonp 
}
