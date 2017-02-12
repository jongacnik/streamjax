var x = require('xtend')
var delegate = require('delegate')
var parseHTML = require('parseHTML')
var emitter = require('tiny-emitter')

module.exports = streamjax

function streamjax (opts) {
  if (typeof new XMLHttpRequest().responseType !== 'string') {
    console.warn('streamjax not supported in this browser')
    return
  }

  opts = x({
    container: 'main'
  }, opts)

  var container = document.querySelector(opts.container)
  var events = new emitter()

  function stream (url) {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    var iframeReady = new Promise(function (resolve) {
      iframe.onload = function() {
        iframe.onload = null
        resolve()
      }
      iframe.src = ''
    })

    container.innerHTML = ''
    iframeReady.then(function() {
      var xhr = new XMLHttpRequest()
      var pos = 0
      iframe.contentDocument.write('<streaming-element-inner>')
      container.appendChild(iframe.contentDocument.querySelector('streaming-element-inner'))

      xhr.onprogress = function() {
        iframe.contentDocument.write(xhr.response.slice(pos))
        pos = xhr.response.length
      }

      xhr.onload = function() {
        iframe.contentDocument.write('</streaming-element-inner>')
        iframe.contentDocument.close()
        document.body.removeChild(iframe)
        events.emit('load', {
          url: url
        })
      }

      xhr.responseType = 'text'
      xhr.open('GET', url)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      xhr.send()
    })
  }

  function getLocation (href) {
    var l = document.createElement('a')
    l.href = href
    return l
  }

  function sameOrigin (href) {
    var l = getLocation(href)
    return l.hostname === window.location.hostname
  }

  delegate(document.body, 'a', 'click', function (e) {
    if (
      e.which > 1
      || e.metaKey
      || e.ctrlKey
      || e.shiftKey
      || e.altKey
      || !sameOrigin(e.target.href)
      || e.target.getAttribute('rel') === 'external'
      || e.target.href.indexOf('#') === 0
      || e.target.classList.contains('no-ajax')
    ) return

    e.preventDefault()
    stream(e.target.href)
    history.pushState(null, null, e.target.href)
  })

  window.addEventListener('popstate', function () {
    stream(location.pathname)
  })

  return {
    on: function (ev, cb) { events.on(ev, cb); return this }
  }
}
