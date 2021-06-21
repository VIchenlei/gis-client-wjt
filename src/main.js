import './login/page-login.html'
import './tags/rs-loading/rs-loading.html'
import './monitor/tags/detail-dialog.html'
// import './style/animate.css'
import './style/base.sass'
import './style/hint.min.css'
import './style/animate.sass'

import './main/sass/animation.sass'
import './main/sass/page-main.sass'
import './main/sass/map.sass'

import './tags/rs-message/rs-message.html'

import Transer from './js/Transer.js'
import { isPC, fontDataChange } from './js/utils/utils.js'
import Draggable from './js/utils/Draggable.js'
import UserService from './user/js/UserService.js'
import HelpmeService from './js/service/HelpmeService.js'
import DataStore from './js/store/DataStore.js'
import Observer from './js/Watch.js'
import { EventMixin } from './js/Mixins.js'
import { getCookie } from './js/cookie'

function initBaseServices () {
  window.transer = new Transer('p_login')
  window.xbus = riot.observable()
  window.xdata = new DataStore()
}

function judgeIsLogin (user) {
  const username = getCookie('username')
  const hostname = window.location.hostname
  if (hostname === 'localhost' && username) {
    xbus.trigger('USER', {
      cmd: 'LOGIN',
      data: {
        md5: username
      }
    })
  } else {
    riot.mount('page-login')
  }
}

function initPageLogin () {
  let user = new UserService()
  xbus.trigger('OPEN-LOCAL-DB')
  // judgeIsLogin(user)
  riot.mount('page-login')
}

function initTools () {
  /** 根据传入的DOM设置拖动 */
  window.setDraggable = (msg) => {
    Draggable(msg.target, msg.handle)
  }

  /** 根据root设置dialog的默认拖动 */
  window.setDialogDraggable = (root) => {
    let dragHandle = root.querySelector('.rs-title')
    let dragTarget = root.querySelector('.dlg-window')
    Draggable(dragTarget, dragHandle)
  }
}

window.initApp = function () {
  window.isPC = isPC()
  initBaseServices()
  initTools()
  initPageLogin()
  fontDataChange()
  riot['observer'] = new Observer()
  riot.mixin('EventMixin', EventMixin)
}

window.initShowDialogUtil = () => {
  let helpmeService = new HelpmeService()

  window.showDetailDialog = (msg) => {
    if (!window.tagDetailDialog) window.tagDetailDialog = riot.mount('detail-dialog')[0]
    let detailDialog = window.tagDetailDialog
    if (detailDialog) detailDialog.updateData(msg)
  }
}

window.xhint = riot.mount('rs-loading', {})[0]
window.xMessage = riot.mount('rs-message', {})[0]
window.initApp()
