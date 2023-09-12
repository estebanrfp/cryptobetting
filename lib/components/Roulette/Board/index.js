import $ from 'jquery'
import Web3 from 'web3'
import {
  // spinner,
  // changeUpdate,
  createAlert
} from '../../utils'

import html from './index.html'
import './styles.css'
import './wheel.css'


function Board () {
  document.querySelector('#board').innerHTML = html

  const web3 = new Web3(Web3.givenProvider)

  function getBalance () {
    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error)
      }
      web3.eth.getBalance(accounts[0], (err, wei) => web3.utils.fromWei(wei, 'ether'))
    })
  }

  (function () {
    // "use strict"
    function getButtonCells (btn) {
      let cells = btn.data('cells')
      if (!cells || !cells.length) {
        cells = []
        switch (btn.data('type')) {
          case 'sector':
            var nums = sectors[btn.data('sector')]
            for (var i = 0, len = nums.length; i < len; i++) {
              cells.push(tableNums[nums[i]])
            }
            return cells
            // break
          case 'num':
          default:
            var nums = String(btn.data('num')).split(',')
            for (var i = 0, len = nums.length; i < len; i++) {
              cells.push(tableNums[nums[i]])
            }
            btn.data('cells', cells)
            return btn.data('cells')
            // break
        }
      }
      return cells
    }

    // props
    const active = true
    const selectors = {
      roulette: '.roulette',
      num: '.num',
      sector: '.sector',
      table_btns: '.controlls .btn'
    }
    const classes = {
      red: 'red',
      black: 'black',
      green: 'green',
      hover: 'hover'
    }
    const numbers = {
      red: [],
      black: [],
      green: []
    }
    let sectors = {
      1: [], // 1st row
      2: [], // 2nd row
      3: [], // 3rd row
      4: [], // 1st 12
      5: [], // 2nd 12
      6: [], // 3rd 12
      7: [], // 1 to 18
      8: [], // EVEN
      9: [], // RED
      10: [], // BLACK
      11: [], // ODD
      12: [] // 19 to 36
    }
    const tableNums = {}
    const tableSectors = {}

    // init
    $(selectors.num).each(function () {
      const $this = $(this)
      const num = Number($this.text())
      // add to instances array
      tableNums[num] = $this
      // add to colors array
      // let color
      for (const color in numbers) {
        if ($this.hasClass(classes[color])) {
          numbers[color].push(num)
          $this.data('color', color)
        }
      }
    })

    $(selectors.sector).each(function () {
      const $this = $(this)
      let color
      if ($this.hasClass(classes.red)) {
        color = 'red'
      } else if ($this.hasClass(classes.black)) {
        color = 'black'
      } else {
        color = 'sector'
      }
      $this.data('color', color)
      tableSectors[$this.data('sector')] = $this
    })

    // sort numbers
    for (var color in numbers) {
      numbers[color].sort(function (a, b) { return a - b })
    }

    // populate sectors
    for (var i = 1; i <= 36; i++) {
      // 1st row, 2nd row, 3rd row
      switch (i % 3) {
        case 0:
          sectors['1'].push(i)
          break
        case 1:
          sectors['3'].push(i)
          break
        case 2:
          sectors['2'].push(i)
          break
      }

      // 1st 12, 2nd 12, 3rd 12
      if (i <= 12) {
        sectors['4'].push(i)
      } else if (i <= 24) {
        sectors['5'].push(i)
      } else {
        sectors['6'].push(i)
      }

      // 1 to 18, 19 to 36
      if (i <= 18) {
        sectors['7'].push(i)
      } else {
        sectors['12'].push(i)
      }

      // ODD, EVEN
      if (i % 2) {
        sectors['11'].push(i)
      } else {
        sectors['8'].push(i)
      }

      if (numbers.red.indexOf(i) != -1) {
        sectors['9'].push(i)
      } else if (numbers.black.indexOf(i) != -1) {
        sectors['10'].push(i)
      }
    }

    // buttons
    var table_btns = $(selectors.table_btns).hover(
      function () {
        hovering = 1
        if (active) {
          var $this = $(this),
            cells = getButtonCells($this)
          for (var i = 0, len = cells.length; i < len; i++) {
            cells[i].addClass(classes.hover)
          }
          var sector = $this.data('sector')
          if (sector) {
            tableSectors[sector].addClass(classes.hover)
          }
        }
      },
      function () {
        hovering = 0
        var $this = $(this),
          cells = getButtonCells($this)
        for (var i = 0, len = cells.length; i < len; i++) {
          cells[i].removeClass(classes.hover)
        }
        var sector = $this.data('sector')
        if (sector) {
          tableSectors[sector].removeClass(classes.hover)
        }
      }
    ).mousedown(function (e) {
      var numbers = []
      if (typeof $(this).data('sector') != 'undefined') {
        console.log(`SECTOR ${ $(this).data('sector') }`)

        if (e.button == 2) ChangeBet(36 + $(this).data('sector'), -1)
        else ChangeBet(36 + $(this).data('sector'), +1)
      }
      else {
        numbers = $(this).data('num')

        if (typeof numbers.length === 'undefined') numbers = [numbers]
        else numbers = numbers.split(',')

        if (e.button == 2) for (var i = 0; i < numbers.length; i++)ChangeBet(numbers[i], -1)
        else for (var i = 0; i < numbers.length; i++)ChangeBet(numbers[i], +1)
      }
    })

    document.oncontextmenu = function () { if (hovering) return false }
  }())

  let balance = 1

  const CurrentTier = 0.01

  // const tiers = [
  //   0.0001,
  //   0.0002,
  //   0.001,
  //   0.002,
  //   0.01,
  //   0.02
  // ]

  const sectors = [
    '3rd columna',
    '2nd columna',
    '1st columna',
    '1st 12',
    '2nd 12',
    '3rd 12',
    '1 al 18',
    'Par',
    'Rojo',
    'Negro',
    'Impar',
    '19 al 36'
  ]

  let hovering = 0
  const bets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const sectormultipliers = [
    [0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3], // 3rd column
    [0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0], // 2nd column
    [0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0], // 1st column
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1st 12
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2nd 12
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 3rd 12
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1 to 18
    [0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // even
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2], // Red
    [0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0], // Black
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // odd
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] // 19 to 36
  ]


  const squares = new Array(48)
  const divs = document.getElementsByTagName('div')

  for (let i = 0; i < divs.length; i++) {
    let attr = divs[i].getAttribute('data-num')
    const rekt = divs[i].getBoundingClientRect()
    if (attr == null) {
      attr = divs[i].getAttribute('data-sector')
      if (attr == null) continue
      const index = 36 + parseInt(attr)

      // var rekt = divs[i].getBoundingClientRect()
      squares[index] = new Array(2)
      squares[index][1] = rekt.top + 10
      squares[index][0] = rekt.left + 16
    } else {
      if (attr.indexOf(',') !== -1) continue
      // var rekt = divs[i].getBoundingClientRect()
      squares[attr] = new Array(2)
      squares[attr][1] = rekt.top + 10
      squares[attr][0] = rekt.left + 16
    }
  }

  function UpdateBets () {
    const betdiv = document.getElementById('bets')
    betdiv.innerHTML = ''
    for (var i = 37; i < bets.length; i++)if (bets[i] > 0) betdiv.innerHTML += `${ sectors[i - 37] }: ${ (bets[i] * CurrentTier).toFixed(2) } eth<br>`
    for (var i = 0; i < 37; i++)if (bets[i] > 0) betdiv.innerHTML += `Número ${ i }: ${ (bets[i] * CurrentTier).toFixed(2) } eth<br>`
  }

  function TotalBets () {
    let r = 0
    for (let i = 0; i < bets.length; i++)r += bets[i]
    return r
  }

  function UpdateBalance () {
    const e = document.getElementById('balance')
    e.innerHTML = `Balance: ${ balance.toFixed(2) } ETH`
    const tb = TotalBets()
    if (tb > 0) e.innerHTML += ` (${ (tb * CurrentTier).toFixed(2) })`
  }

  const chips = new Array(48)

  function Reset () {
    for (let i = 0; i < bets.length; i++) {
      bets[i] = 0
      if (chips[i] != null) for (var j = 0; chips[i].length > 0; j++)document.querySelector('table').removeChild(chips[i].pop())
    }
    balance = 1

    UpdateBets()
    UpdateBalance()
    $('.roulette .num').css('animation', '')
  }

  function rInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function ChangeBet (id, amount) {
    if (amount > 0 && TotalBets() === 50) {
      // maybe some beep
      return
    }

    if (amount > 0) {
      const randomColor = `#${ Math.floor(Math.random() * 16777215).toString(16) }`
      const img = document.createElement('img')
      // img.class = 'coin'
      img.src = './images/ficha.png' // https://image.flaticon.com/icons/png/128/138/
      img.style.zIndex = '0'
      img.style.position = 'absolute'
      // img.style.transform = 'matrix3d(1, 0, 0, 0, 0, 0.819152, 0.573576, -0.000955961, 0, -0.573576, 0.819152, -0.00136525, 0, 0, 0, 1)'
      img.style.backgroundColor = randomColor
      img.style.borderRadius = '50%'
      img.style.padding = '4px'
      img.style.filter = 'drop-shadow(0 10px 5px rgba(0, 0, 0, 0.5))'
      // img.style.filter="hue-rotate(125deg)"
      // var rX=rInt(-16,16);
      // var rY=rInt(-16,16);

      const rX = rInt(0, 14)
      const rY = rInt(0, 14)

      const x = window.event.pageX - $('table').offset().left
      const y = window.event.pageY - $('table').offset().top
      // var x = window.event.clientX;
      // var y = window.event.clientY;

      img.style.left = `${ x - 10 - rX }px`
      img.style.top = `${ y - 8 - rY }px`

      // img.style.left=(squares[id][0]+rX)+"px";
      // img.style.top=(squares[id][1]+rY)+"px";
      // img.style.left=(squares[id][0])+"px";
      // img.style.top=(squares[id][1])+"px";

      img.style.width = '20px'
      img.style.pointerEvents = 'none'

      document.querySelector('table').appendChild(img)
      // document.body.appendChild(img);

      if (chips[id] == null) chips[id] = new Array(0)
      chips[id].push(img)
    }
    if (amount < 0 && chips[id] != null && chips[id].length > 0) document.querySelector('table').removeChild(chips[id].pop())

    bets[id] += amount
    if (bets[id] < 0) bets[id] = 0
    UpdateBets()
    UpdateBalance()
  }

  function Place (result) {
    let bet = 0
    for (var i = 0; i < bets.length; i++)if (bets[i] != 0) bet += bets[i]
    bet *= CurrentTier

    if (bet > balance) {
      createAlert('', 'Atención', 'balance insuficiente!', 'info', true, true)
      return
    }

    let win = 0
    if (bets[result] != 0) win += bets[result] * 36
    for (var i = 37; i < bets.length; i++)if (bets[i] != 0) win += bets[i] * sectormultipliers[i - 37][result]

    win *= CurrentTier
    win -= bet

    console.log(`BET: ${ bet } WIN: ${ win }`)

    if (win >= bet) {
      createAlert('', 'Atención', `Ha salido el ${ result }, has ganado ${ win.toFixed(2) } ETH`, 'info', true, true)
      document.getElementById('winner').play()
    } else {
      createAlert('', 'Atención', `Ha salido el ${ result }, has perdido ${ win.toFixed(2) } ETH`, 'info', true, true)
      document.getElementById('looser').play()
    }

    balance += win
    UpdateBalance()

    $('.roulette .num').css('animation', '')
    $(`.roulette .num[data="${ result }"]`).css('animation', 'pulse .5s infinite')
    // setTimeout(() => $mask.text('¡ Hagan sus apuestas !'), 100)
  }

  // // WEEL

  const $inner = $('.inner')
  const $data = $('.data')
  const $mask = $('.mask')
  const timer = 9000

  const red = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3]

  $mask.text('¡ Bienvenido !')

  function spin (randomNumber) { // get a random number between 0 and 36 and apply it to the nth-child selector
    document.getElementById('start').pause()
    document.getElementById('ambient').play()

    let color = null
    $inner.attr('data-spinto', randomNumber).find(`li:nth-child(${ randomNumber }) input`).prop('checked', 'checked')
    // prevent repeated clicks on the spin button by hiding it

    document.getElementById('roullette-snd').play()
    // document.getElementById("test").play();

    $('.placeholder').remove()

    $mask.text('¡ No más apuestas !') // No More Bets
    $('.roulette').addClass('disabledbutton')

    document.querySelector('.roulette').disabled = true

    // remove the disabled attribute when the ball has stopped
    setTimeout(() => {
      document.getElementById('ambient').pause()
      document.getElementById('start').play()

      if ($.inArray(randomNumber, red) !== -1) { color = 'red' } else { color = 'black' }
      if (randomNumber === 0) { color = 'green' }

      $('.result-number').text(randomNumber)
      $('.result-color').text(color)
      $('.result').css({ 'background-color': `${ color }` })
      $data.addClass('reveal')
      $inner.addClass('rest')

      // const $thisResult = `<li class="previous-result color-${ color }"><span class="previous-number">${ randomNumber }</span><span class="previous-color">${ color }</span></li>`
      const $thisResult = `<li class="previous-result color-${ color }"><span class="previous-number">${ randomNumber }</span></li>`
      // $('.previous-list').prepend($thisResult)
      $('.previous-list').html($thisResult)

      Place(randomNumber)
      // setTimeout(() => $mask.text('¡ Hagan sus apuestas !'), timer + 500)
    }, timer)
  }

  function reset () { // remove the spinto data attr so the ball 'resets'
    $inner.attr('data-spinto', '').removeClass('rest')

    $data.removeClass('reveal')
    $('.roulette .num').css('animation', '')
    $mask.text('¡ Hagan sus apuestas !') // Place Your Bets
    $('.roulette').removeClass('disabledbutton')
    // document.querySelector('.roulette').disabled = false
  }

  // window.gun.get('notify').on(async data => $mask.text(data.msg))
  window.gun.get('start').on(async data => {
    console.log(data.number)
    reset()
    setTimeout(() => spin(data.number), 10000)
  })

  // $('.roulette')
  //   .on('mouseover', function () {
  //     $(this).children('table').css({ transform: `scale(${ $(this).attr('data-scale') })` })
  //   })
  //   .on('mouseout', function () {
  //     $(this).children('table').css({ transform: 'scale(1)' })
  //   })
  //   .on('mousemove', function (e) {
  //     $(this).children('table').css({ 'transform-origin': `${ ((e.pageX - $(this).offset().left) / $(this).width()) * 100 }% ${ ((e.pageY - $(this).offset().top) / $(this).height()) * 100 }%` })
  //   })

  // MUSIC

  const worldMusic = document.getElementById('start')
  const btnMusic = document.querySelector('.toggle-music')
  let playMusic = true
  worldMusic.play()
  btnMusic.addEventListener('click', () => {
    playMusic = !playMusic
    btnMusic.classList.toggle('music-off')
    // eslint-disable-next-line no-unused-expressions
    playMusic ? worldMusic.play() : worldMusic.pause()
  }, false)
  // worldMusic.volume = 0.3;
  worldMusic.loop = true
  // document.getElementById('reset2').addEventListener('click', Reset)
  document.querySelector('#reset').addEventListener('click', Reset)
}

export default Board
