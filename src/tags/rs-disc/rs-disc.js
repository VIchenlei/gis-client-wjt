function Circle (x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.isSelected = false
}

// 计算天线角度
function getAantennaAngle (x1, y1, x2, y2) { // x y 为(bx-ax,by-ay)
  if ((x1 === y1) && x1 === 60) {
    y2 = -y2
    y1 = -y1
  }
  var angle = Math.floor(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) // 将弧度转换成角度
  return angle
}

// 点击圆球获取鼠标点击距弹窗外边距的可视距离
function getOffsetLeft (el) {
  let l = el.getBoundingClientRect().left
  return l
}

function getOffsetTop (el) {
  let t = el.getBoundingClientRect().top
  return t
}

// 限制天线圆盘鼠标拖动有效范围
// 限制可拖动范围
function check (x, y) {
  var xx = x * x
  var yy = y * y
  // var rr = 50 * 50 // 最小
  var rrr = 55 * 55 // 最大
  if (xx + yy < rrr) return true
  return false
}

// canvas内坐标转化为圆形坐标
function spotchange (a) {
  var target = {}
  if (a.x < 60 && a.y < 60) {
    target.x = -(60 - a.x)
    target.y = 60 - a.y
  } else if (a.x > 60 && a.y < 60) {
    target.x = a.x - 60
    target.y = 60 - a.y
  } else if (a.x > 60 && a.y > 0) {
    target.x = a.x - 60
    target.y = -(a.y - 60)
  } else if (a.x < 60 && a.y > 60) {
    target.x = -(60 - a.x)
    target.y = -(a.y - 60)
  }
  return target
}

function getmoveto (lx, ly, isDragging, pathRadius) {
  if (!isDragging) return false
  var tem = {}
  tem.o = Math.atan(ly / lx) // 鼠标移动点圆形角
  tem.x = pathRadius * Math.cos(tem.o)
  tem.y = pathRadius * Math.sin(tem.o)
  if (lx < 0) { // 坐标点处理
    tem.x = -tem.x
    tem.y = -tem.y
  }
  if (lx > 0) { // 弧度值处理
    tem.z = -Math.atan(tem.y / tem.x) + Math.PI * 2
  } else {
    tem.z = -Math.atan(tem.y / tem.x) + Math.PI
  }
  return tem
}

// 圆心坐标转换为canvas内坐标
function respotchange (a) {
  var target = {}
  if (a.x > 0 && a.y > 0) {
    target.x = 60 + a.x
    target.y = (60 - a.y)
  } else if (a.x < 0 && a.y > 0) {
    target.x = 60 + a.x
    target.y = 60 - a.y
  } else if (a.x < 0 && a.y < 0) {
    target.x = 60 + a.x
    target.y = -(a.y - 60)
  } else if (a.x > 0 && a.y < 0) {
    target.x = 60 + a.x
    target.y = -(a.y - 60)
  }
  return target
}

/**
 * @description: 根据天线坐标获取转换后canvas坐标集合
 */
function getCanvasList (rcoords, antenna, cmd) {
  let angleZeroCoord = []
  let canCoords = []
  if (antenna && antenna.length > 0) {
    antenna.forEach((e, i) => {
      let coords = []
      e.rows.forEach(el => {
        if (el.field_name === 'x' || el.field_name === 'y') {
          if (cmd !== 'INSERT') {
            coords.push(el.field_name === 'x' ? el.field_value : -el.field_value)
          } else {
            coords.push(el.field_value)
          }
        }
      })
      angleZeroCoord.push(getAantennaAngle(rcoords[0], rcoords[1], coords[0], coords[1]))

      canCoords.push(getAntennaCoord(60, 60, 50, angleZeroCoord[i]))
    })
  }
  return canCoords
}

/**
 * @description: 根据角度为0时计算 以分站为中心点圆上的坐标点
 */
function getReaderCoord (x, y, r, angle) {
  // y = y
  let al = angle ? Number(angle) : 0
  let _r = r/2 // 天线半径默认2米,换算到地图上比例尺为1
  let x1 = x + _r * Math.cos((al * Math.PI) / 180)
  let y1 = y + _r * Math.sin((al * Math.PI) / 180)
  x1 = x1.toFixed(1)
  y1 = y1.toFixed(1)
  return {
    x: Number(x1),
    y: Number(y1)
  }
}
/**
 * @description: 根据角度转换canvas坐标 根据分站天线获得初始化角度需要减去90度
 */
function getAntennaCoord (x, y, r, angle) {
  angle = angle ? Number(angle) : 0
  if ((x === y) && x === 60) angle = -angle
  let _r = r || 2 // 天线半径默认2米
  let x1 = x + _r * Math.cos((angle * Math.PI) / 180)
  let y1 = y + _r * Math.sin((angle * Math.PI) / 180)
  x1 = x1.toFixed(1)
  y1 = y1.toFixed(1)
  return {
    x: Number(x1),
    y: Number(y1)
  }
}
export { Circle, getAantennaAngle, getOffsetLeft, getOffsetTop, check, spotchange, getmoveto, respotchange, getCanvasList, getReaderCoord }
