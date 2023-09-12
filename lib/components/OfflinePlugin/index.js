import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { createAlert } from '../utils'

// const manifest = JSON.parse(fs.readFileSync(`${path.resolve(process.env.PUBLIC)}/manifest.json`, 'utf8'))

// function loadScript(location) {
//   document.body.removeChild(location)
//   // Check for existing script element and delete it if it exists
//   var js = document.getElementById("sandboxScript");
//   if(js !== null) {
//       document.body.removeChild(js);
//       console.info("---------- Script refreshed ----------");
//   }

//   // Create new script element and load a script into it
//   js = document.createElement("script");
//   js.src = location;
//   js.id = "sandboxScript";
//   document.body.appendChild(js);
// }


// function loadjscssfile (filename, filetype) {
//   if (filetype === 'js') { // if filename is a external JavaScript file
//     let fileref = document.createElement('script')
//     fileref.setAttribute('type', 'text/javascript')
//     fileref.setAttribute('src', filename)
//   } else if (filetype === 'css') { // if filename is an external CSS file
//     let fileref = document.createElement('link')
//     fileref.setAttribute('rel', 'stylesheet')
//     fileref.setAttribute('type', 'text/css')
//     fileref.setAttribute('href', filename)
//   }
//   if (typeof fileref !== 'undefined') {
//     document.getElementsByTagName('head')[0].appendChild(fileref)
//   }
// }

// loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
// loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
// loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file

function OfflinePlugin () {
  OfflinePluginRuntime.install({
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating')
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady')
      // Tells to new SW to take control immediately
      OfflinePluginRuntime.applyUpdate()
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated')
      // // loadjscssfile('./sw.js', "js")
      // for (const el of document.querySelectorAll("script[src]")) {
      //   el.remove()
      //   loadjscssfile(el.src, "js")
      // }
      // for (const el of document.querySelectorAll("link[href]")) {
      //   el.remove()
      //   loadjscssfile(el.href, "css")
      //   console.log(el.href)
      // }
      // Reload the webpage to load into the new version
      // window.location.reload()
      // createAlert('Atención!', 'Actualización [OTA]', 'Nueva actualización', 'success', true, true)
      // pushNotify('actualización, recarge la página !')
      // window.location.reload()

      createAlert('', 'Actualización', `Refresce su navegador para visualizar los cambios !
      <span class="actions">
        <input type="button" value="refrescar la página" onClick="location.reload();">
      </span>
      `, 'info', true, false)
    },

    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed')
    }
  })
}

export default OfflinePlugin

// const MAXAGE = 3600; // seconds until recheck
// const URL = `/sw.js?q=${Math.floor(Date.now() / (MAXAGE * 1000))}`;
// navigator.serviceWorker.register(URL);
