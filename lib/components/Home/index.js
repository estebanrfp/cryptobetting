import template from './template.html?raw'
import './styles.css'
// import { gun } from '../utils'

function Todo () {
  document.querySelector('.Layout').innerHTML = 'hello world'

  // document.querySelector('.Layout').innerHTML = template()

  // const list = window.gun.get('list')

  // document.getElementById('form').addEventListener('submit', e => {
  //   e.preventDefault()
  //   const data = document.getElementById('input').value
  //   list.set(data)
  //   document.getElementById('input').value = ''
  // })

  // list.map().on((thought, id) => {
  //   const li = document.getElementById(id) || document.getElementById('parentList').insertAdjacentHTML('beforeend', `<li id=${ id }> ${ thought }</li>`)
  //   // attach the event listener to the selected li items
  //   const links = document.querySelector('#parentList').getElementsByTagName('li')

  //   for (const link of links) {
  //     // console.log(link.innerHTML);
  //     link.ondblclick = () => {
  //       list.get(link.id).put(null)
  //       link.innerHTML = document.getElementById(link.id.innerHTML)
  //       if (link.innerHTML === ' null' || link.innerHTML === ' ' || link.innerHTML === '') {
  //         link.style.display = 'none'
  //       } else {
  //         link.style.display = 'list-item'
  //       }
  //     }

  //     if (link.innerHTML === ' null' || link.innerHTML === ' ' || link.innerHTML === '') {
  //       link.style.display = 'none'
  //     } else {
  //       link.style.display = 'list-item'
  //     }
  //   }
  // })

  // // users.map().on(cb)

  // // var user = list.get('alice').put({name: "Alice"});
  // // list.get('users').set(user);

  // // list.get('users').get(user).on(function(user){ // update in real-time
  // //     if (user.online) {
  // //       console.log('hello ' + user.name)
  // //     } else {
  // //       console.log('bye ' + user.name)
  // //     }
  // // })

  // // list.get('random/aaa').put({hello: "world"});
  // // var ref = list.get('random/4do0iCsbI');
  // // ref.on(function(data){
  // // document.body.innerHTML = JSON.stringify(data)
  // // });
}

export default Todo
