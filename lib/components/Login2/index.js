import html from './index.html'
import './styles.styl'

function Login () {
  document.querySelector('.Layout').innerHTML = html

  const questions = [
    { question: 'Nombre de usuario' },
    { question: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    // { question: 'Dirección de Ethereum', pattern: /^[13][a-zA-Z0-9]{26,33}/ },
    { question: 'Dirección de Ethereum' },
    { question: 'Password', type: 'password' }
  ]

  const onComplete = () => { // do something after the questions have been answered
    const h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode(`Bienvenido ${ questions[0].answer }!`))
    setTimeout(() => {
      register.parentElement.appendChild(h1)
      setTimeout(() => { h1.style.opacity = 1 }, 50)
    }, 1000)
  }

  // ; (function (questions, onComplete) {

  const tTime = 100 // transition transform time from #register in ms
  const wTime = 200 // transition width time from #register in ms
  const eTime = 1000 // transition width time from inputLabel in ms

  // init
  // --------------
  if (questions.length == 0) return

  let position = 0

  putQuestion()

  forwardButton.addEventListener('click', validate)
  inputField.addEventListener('keyup', e => {
    transform(0, 0) // ie hack to redraw
    if (e.keyCode === 13) validate()
  })

  previousButton.addEventListener('click', e => {
    if (position === 0) return
    position -= 1
    hideCurrent(putQuestion)
  })


  // functions
  // --------------

  // load the next question
  function putQuestion () {
    inputLabel.innerHTML = questions[position].question
    inputField.type = questions[position].type || 'text'
    inputField.value = questions[position].answer || ''
    inputField.focus()

    // set the progress of the background
    progress.style.width = `${ position * 100 / questions.length }%`

    previousButton.className = position ? 'ion-android-arrow-back' : '' // ion-person

    showCurrent()
  }

  // when submitting the current question
  function validate () {
    const validateCore = () => inputField.value.match(questions[position].pattern || /.+/)

    if (!questions[position].validate) questions[position].validate = validateCore

    // check if the pattern matches
    if (!questions[position].validate()) wrong(inputField.focus.bind(inputField))
    else ok(() => {
      // execute the custom end function or the default value set
      if (questions[position].done) questions[position].done()
      else questions[position].answer = inputField.value

      ++position

      // if there is a new question, hide current and load next
      if (questions[position]) hideCurrent(putQuestion)
      else hideCurrent(() => {
        // remove the box if there is no next question
        register.className = 'close'
        progress.style.width = '100%'

        onComplete()
      })
    })
  }


  // helper
  // --------------

  function hideCurrent (callback) {
    inputContainer.style.opacity = 0
    inputLabel.style.marginLeft = 0
    inputProgress.style.width = 0
    inputProgress.style.transition = 'none'
    inputContainer.style.border = null
    setTimeout(callback, wTime)
  }

  function showCurrent (callback) {
    inputContainer.style.opacity = 1
    inputProgress.style.transition = ''
    inputProgress.style.width = '100%'
    setTimeout(callback, wTime)
  }

  function transform (x, y) {
    register.style.transform = `translate(${ x }px ,  ${ y }px)`
  }

  function ok (callback) {
    register.className = ''
    setTimeout(transform, tTime * 0, 0, 10)
    setTimeout(transform, tTime * 1, 0, 0)
    setTimeout(callback, tTime * 2)
  }

  function wrong (callback) {
    register.className = 'wrong'
    for (let i = 0; i < 6; i++) // shaking motion
      setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0)
    setTimeout(transform, tTime * 6, 0, 0)
    setTimeout(callback, tTime * 7)
  }

  // }(questions, onComplete))
}

export default Login
