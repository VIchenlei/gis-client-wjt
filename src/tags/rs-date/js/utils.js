const utils = {
  addClass: function(target, className) {
    let classArray = target.getAttribute('class') ?
      target.getAttribute('class').split(' ') : []
    classArray.push(className)
    target.setAttribute('class', classArray.join(' '))
    return target
  },
  hasClass: function(target, className) {
    let classArray = target.getAttribute('class') ?
      target.getAttribute('class').split(' ') : []
    return classArray.indexOf(className) > -1
  },
  attr: function(target, prop, value) {
    if (value) {
      target.setAttribute(prop, value)
      return target
    } else {
      return target.getAttribute(prop)
    }
  },
  /*在行间添加样式*/
  css: function(target, cssObj) {
    for (var prop in cssObj) {
      target.style[prop] = cssObj[prop]
    }
    return target
  },
  show: function(target) {
    this.attr(target, 'isShow', 'on')
    clearInterval(target.timer)
    this.css(target, {
      display: 'block',
      opacity: 1
    })
  },
  hide: function(target) {
    this.attr(target, 'isShow', 'off')
    this.css(target, {
      display: 'none'
    })
  },
  formatDate: function(num) {
    return num < 10 ? '0' + num : num
  },
  fadeOut: function(target) {
    if (this.attr(target, 'isShow') == 'off') return
    this.attr(target, 'isShow', 'off')
    var opacity = 100
    var self = this
    target.timer = setInterval(function() {
      opacity -= opacity / 20
      opacity < 80 &&
        self.css(target, {
          opacity: opacity / 100
        })
      if (opacity <= 5) {
        clearInterval(target.timer)
        self.css(target, {
          display: 'none',
          opacity: 1
        })
      }
    }, 10)
  },
  PrefixZero: function(i, n) {
    return (Array(n).join(0) + i).slice(-n);
  },
  hourList: function() {
    let hours = []
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        hours.push(this.PrefixZero(i, 2))
      } else {
        hours.push(i.toString())
      }
    }
    return hours
  },
  minuteList: function() {
    let minutes = []
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        minutes.push(this.PrefixZero(i, 2))
      } else {
        minutes.push(i.toString())
      }
    }
    return minutes
  },
  secondList: function() {
    let seconds = []
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        seconds.push(this.PrefixZero(i, 2))
      } else {
        seconds.push(i.toString())
      }
    }
    return seconds
  },
}
export default utils