import { h } from 'preact'

const handleClick = async e => {
  e.preventDefault()
  const url = '/'
  window.route({ tpl: url }, 'Post', url)
  window.page(url)
  return false
}

const ErrorPage = () => (
  <a class="button centrado" href="/" onClick={ handleClick }>404 | Regresar</a>
)

export default ErrorPage
