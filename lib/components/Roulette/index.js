import html from './index.html'
import './styles.styl'
import Board from './Board'

function Roulette () {
  document.querySelector('.Layout').innerHTML = html
  Board()
}

export default Roulette
