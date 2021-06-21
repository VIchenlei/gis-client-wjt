// function Observer (data) {
//   this.data = data
//   this.walk(data)
//   this.eventsBus = new Events()
// }
class Observer {
  watchData (data) {
    this.data = data
    this.walk(data)
    this.eventsBus = new Events()
  }
}

// 给data中的每一个属性增加get和set属性
Observer.prototype.walk = function (obj) {
  var val
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      val = obj[key]

      if (obj[key] instanceof Object) {
        new Observer(obj[key])
      }

      this.convert(key, val)
    }
  }
}

Observer.prototype.convert = function (key, val) {
  var self = this
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      self.eventsBus.emit(key, newVal, val)
      val = newVal
    }
  })
}

Observer.prototype.$watch = function (key, callback) {
  this.eventsBus.on(key, callback)
}

// 实现事件的发布-订阅
function Events () {
  this.events = {}
}
Events.prototype = {
  constructor: Events,
  on: function (eventType, callback) {
    if (!this.events[eventType]) {
      this.events[eventType] = []
    }
    this.events[eventType].push(callback)
    return this
  },
  remove: function (eventType) {
    for (var key in this.events) {
      if (this.events.hasOwnProperty(key) && key === eventType) {
        delete this.events[eventType]
      }
    }
  },
  emit: function (eventType) {
    if (!this.events[eventType]) {
      return this
    }
    var args = Array.prototype.slice.call(arguments, 1)
    for (var i = 0; i < this.events[eventType].length; i++) {
      this.events[eventType][i].apply(this, args)
    }
    return this
  }
}

export default Observer
