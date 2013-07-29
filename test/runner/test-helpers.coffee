'use strict'
trashcan = undefined

createTrashcan = ->
  trashcan = document.createElement 'div'
  trashcan.style.display = 'none'
  document.body.appendChild trashcan

window.destroyElement = (el)->
  createTrashcan() unless trashcan
  trashcan.appendChild el
  trashcan.innerHTML = ''