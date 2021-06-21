import ol from 'openlayers'
import { getMessage, getRows, clone, trim, inquireDB, messageTip } from '../utils/utils'
import { initInteractions, getPolylineBYPoints } from './OlMapUtils'
import { pointToLineDistance } from '../../manage/js/utils'
import '../../tags/rs-meta-dialog/rs-meta-dialog.html'
export default class OlMapRoutePlan{
  constructor (glayer) {
    this.map = glayer.map
    this.draw = glayer.draw
    this.modify = null
    this.snap = null
    this.source = null
    this.tool = null
    let self = this
    this.isDrawRoutePlan = false
    this.cmd = null
    this.initRoutePlanLayer()

    xbus.on('DRAW-ROUTEPLAN', (msg) => {
      this.isEdit = msg.isEdit // false新增 true从实时界面跳转编辑
      this.cmd = msg.cmd ? msg.cmd : this.cmd
      this.source = new ol.source.Vector()
      initInteractions(this.map, this.draw, this.snap, this.modify, this.addInteractions, this, 'LineString')
    })
    
    //展示预定路线、越界路线
    xbus.on('MAP-SHOW-ROUTEPLAN', (msg) => {
      this.features = this.layerSource.getFeatures()
      if (this.features.length > 0) this.layerSource.clear() //清除已有的人员偏离路线
      this.viewRoutePlan(msg)  //执行展示预定路线函数
      this.viewCrossPath(msg)  //执行展示越界线函数
    })

    xbus.on('REPT-SHOW-RESULT', (ds) => {
      const names = ['rpt_att_staff', 'his_location_staff_']
      if (names.includes(ds.def.name)) {
        window.xhint.close()
        if (!this.checked) return
        if (ds.def.name === 'rpt_att_staff') {
          let times = []
          ds.rows.forEach(e => {
            times.push([Date.parse(e.start_time), Date.parse(e.end_time)])
          })
          
          let startTime = null, endTime = null
          if (times.length > 1) {
            for (let i = 0; i < times.length; i++) {
              if (isNaN(times[i][1])) {
                endTime = new Date().format('yyyy-MM-dd hh:mm:ss')
              }
            }
          } else {
            endTime = new Date(times[0][1]).format('yyyy-MM-dd hh:mm:ss')
          }
          startTime = new Date(times[0][0]).format('yyyy-MM-dd hh:mm:ss')
          const sql = `SELECT id, obj_id, card_type_id, ident, DATE_FORMAT(begin_time,"%Y-%m-%d %H:%i:%s") AS begin_time, DATE_FORMAT(last_time,"%Y-%m-%d %H:%i:%s") AS last_time, begin_pt FROM his_location_staff_ WHERE obj_id=${this.obj_id} AND begin_time >= "${startTime}" AND begin_time <= "${endTime}" ORDER BY begin_time`
          inquireDB('his_location_staff_', sql)
          
        }
        if (ds.def.name === 'his_location_staff_') {
          this.viewCrossLine(ds.rows)
        }
      }
    })

    this.map.addEventListener('dblclick', function (e) {
      if (!self.routePlan) return
      if (!self.isDrawRoutePlan) return
      self.isDrawRoutePlan = false
      if (!self.cmd) {
        self.isEdit = !self.isEdit
        let store = xdata.metaStore
        const name = 'tt_inspection_route_planning'
        const table = {
          def: store.defs[name],
          rows: store.dataInArray.get(name),
          maxid: store.maxIDs[name]
        }
        const { def, maxid } = table
        let rows = getRows(null, def, maxid)
        let msg = getMessage('INSERT', rows, def, maxid)
        msg.rows.forEach(e => {
          if (e.field_name === 'route_planning') e.field_value = self.routePlan
        })
        self.showMetaDialog(msg)
      } else {
        const rows = {
          values: self.routePlan,
          name: 'route_planning',
          isNegate: true
        }
        xbus.trigger('UPDATE-META-ROWS', {rows: rows})
      }
      self.cmd = null
    })
  }

  initRoutePlanLayer() {
    this.layerSource = new ol.source.Vector()
    this.routePlanLayer = new ol.layer.Vector({
      source: this.layerSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#FF6057',
          width: 2
        })
      })
    })
    this.map.addLayer(this.routePlanLayer)
  }

  addInteractions (interaction) {
    interaction.addEventListener('drawend', (evt) => {
      const roadSegments = xdata.metaStore.data.road_segment && Array.from(xdata.metaStore.data.road_segment.values())
      if (!roadSegments || roadSegments.length === 0) {
        this.map.removeInteraction(interaction)
        return messageTip('路径集不存在！', 'warning')
      }
      const pathGather = clone(roadSegments)
      this.feature = evt.feature
      let wkt = new ol.format.WKT()
      let wktGeo = wkt.writeGeometry(this.feature.getGeometry())
      let shortRoads = []
      let coord = []
      let path = wktGeo.slice(11, -2).split(',').map((item, index) => {
        item = item.split(' ')
        item[0] = Number(Number(item[0]).toFixed(1))
        item[1] = Number(Number(item[1]).toFixed(1))
        return item
      })
      for (let i = 0; i < path.length; i++) {
        if (i < path.length - 1) {
          let obj = {
            start_point: {
              x: path[i][0],
              y: path[i][1]
            },
            end_point: {
              x: path[i + 1][0],
              y: path[i + 1][1]
            }
          }
          let a = obj.start_point.x - obj.end_point.x
          let b = obj.start_point.y - obj.end_point.y
          let lineNum = 10 //开始点结束点线段距离等分成n段
          let line = Math.sqrt(a * a + b * b) / lineNum //获取等分线段长度
          for (let j = 0; j < lineNum; j++) {
            if (j === 0) coord.push([obj.start_point.x, obj.start_point.y])
            let x1 = obj.start_point.x + (obj.end_point.x - obj.start_point.x) * (j + 1) / lineNum
            let y1 = obj.start_point.y + (obj.end_point.y - obj.start_point.y) * (j + 1) / lineNum
            coord.push([x1, y1])
          }
          let singleShortPath = this.getCoverLine(coord, pathGather)
          shortRoads = shortRoads.concat(singleShortPath)
        }
      }
      //查找覆盖路径去除重复的路径信息
      const key = 'road_segment_id'
      if (!shortRoads) return
      shortRoads = this.unique(shortRoads, key)
      this.getRoutePlan(path, coord, shortRoads)
      this.isDrawRoutePlan = true
      this.map.removeInteraction(interaction)
    })
  }

  //获取路径信息
  getRoutePlan(path, coord, shortRoads) {
    let routePlan = ''
    for (let i = 0; i < shortRoads.length; i++) {
      if (i === 0) {
        coord = this.getStartAndEndPath(path[i][0], path[i][1], shortRoads[i].bpoint.x, shortRoads[i].bpoint.y, shortRoads[i].epoint.x, shortRoads[i].epoint.y)
        routePlan += `${shortRoads[i].road_segment_id},,${coord.x},${coord.y},${shortRoads[i].epoint.x},${shortRoads[i].epoint.y};`
      } else if (0 < i && i < shortRoads.length - 1) {
        routePlan += `${shortRoads[i].road_segment_id},;`
      } else if (i === shortRoads.length - 1) {
        coord = this.getStartAndEndPath(path[path.length - 1][0], path[path.length - 1][1], shortRoads[i].bpoint.x, shortRoads[i].bpoint.y, shortRoads[i].epoint.x, shortRoads[i].epoint.y)
        if (Number(shortRoads[i].bpoint.x) <= Number(coord.x) || Number(shortRoads[i].bpoint.y) <= Number(coord.y)) {
          routePlan += `${shortRoads[i].road_segment_id},,${shortRoads[i].bpoint.x},${shortRoads[i].bpoint.y},${coord.x},${coord.y}`
        } else {
          routePlan += `${shortRoads[i].road_segment_id},,${coord.x},${coord.y},${shortRoads[i].bpoint.x},${shortRoads[i].bpoint.y}`
        }
      }
    }
    this.routePlan = routePlan
  }

  //计算开始点、结束点到路径的距离
  getStartAndEndPath (xx, yy, x1, y1, x2, y2) {
    return pointToLineDistance (xx, yy, x1, y1, x2, y2)[1]
  }

  //查找一条线段覆盖的多条路径
  getCoverLine(coord, pathGather) {
    let singleShortPath = []
    for (let i = 0; i < coord.length; i++) {
      if (i < coord.length - 1) {
        let obj = {
          start_point: {
            x: coord[i][0],
            y: coord[i][1]
          },
          end_point: {
            x: coord[i + 1][0],
            y: coord[i + 1][1]
          }
        }
        let shortPath = this.getshortPath(obj, pathGather)
        singleShortPath.push(shortPath)
      }
    }
    const key = 'road_segment_id'
    singleShortPath = this.unique(singleShortPath, key)
    return singleShortPath
  }

  unique(list, key) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
      if (i == 0) result.push(list[i]);
      let b = false;
      if (result.length > 0 && i > 0) {
        for (var j = 0; j < result.length; j++) {
          if (result[j][key] == list[i][key]) {
            b = true;
            //break;
          }
        }
        if (!b) {
          result.push(list[i]);
        }
      }
    }
    return result;
  }

  // 获取传入直线的最近的路径
  getshortPath(pointObj, pathGather) {
    let roadPathGather = clone(pathGather)
    roadPathGather = roadPathGather.map(item => {
      let bpoint = item.bpoint.split(',')
      item.bpoint = {
        x: Number(Number(bpoint[0]).toFixed(1)),
        y: -Number(Number(bpoint[1]).toFixed(1)),
      }
      let epoint = item.epoint.split(',')
      item.epoint = {
        x: Number(Number(epoint[0]).toFixed(1)),
        y: -Number(Number(epoint[1]).toFixed(1)),
      }
      let disAS = pointToLineDistance(pointObj.start_point.x, pointObj.start_point.y, item.bpoint.x, item.bpoint.y, item.epoint.x, item.epoint.y)[0]
      let disAE = pointToLineDistance(pointObj.end_point.x, pointObj.end_point.y, item.bpoint.x, item.bpoint.y, item.epoint.x, item.epoint.y)[0]
      item.distance = disAS + disAE
      return item
    })

    roadPathGather.sort(function(a, b) {
      return a.distance - b.distance
    })
    return roadPathGather[0]
  }

  //弹出录入对话框
  showMetaDialog (msg) {
    if (this.rsMetaDialog) this.rsMetaDialog.unmount(true)
    msg.spliceInputs = ['reader_planning', 'route_planning']
    msg.isNegate = true
    this.rsMetaDialog = riot.mount('rs-meta-dialog', { message: msg, parenTag: self })[0]
  }

  createPathStyle (color) {
    const style = {
      stroke: { width: 3, color: color },
      fill: { color: 'rgba(255,255,255,0.2)'},
    }
    return new ol.style.Style({
      stroke: new ol.style.Stroke(style.stroke),
      fill: new ol.style.Fill(style.fill)
    })
  }

  drawOLLine(layerSource, point, name, color) {
    let linestring = new ol.geom.LineString(point)  // 坐标数组
    // let lineLength = linestring.getLength()
    var lineFeature = new ol.Feature({
      geometry: linestring,
      id: name,
      finished: false
    })
    lineFeature.setStyle(this.createPathStyle(color))
    layerSource.addFeature(lineFeature)
    return { lineFeature: lineFeature, lineLength: linestring.getLength()}
  }

  //展示预定路线
  viewRoutePlan (msg) {
    this.checked = msg.checked
    let store = xdata.metaStore
    let staffs = Array.from(store.staffs.values()).filter(item => item.card_id === msg.data.obj_id)[0]
    let staffId = staffs.staff_id
    let lines = store.data.tt_inspection_route_planning.get(staffId)
    let routePlans = lines.route_planning
    let roadIdArr = []
    let routePlan = routePlans.split(';')
    for (let i = 0; i < routePlan.length; i++) {
      roadIdArr.push(trim(routePlan[i].split(',')[0]))
    }
    let roads = []
    roadIdArr.forEach(e => {
      roads.push(store.data.road_segment.get(Number(e)))
    })

    const color = '#ffcc33'
    for (let i = 0; i < roads.length; i++) {
      let singleRoad = []
      for (let j = 0; j < 2; j++) {
        let point = j === 1 ? roads[i].bpoint.split(',') : roads[i].epoint.split(',')
        let obj = {
          road_segment_id: roads[i].road_segment_id,
          x: Number(point[0]),
          y: Number(point[1])
        }
        singleRoad.push(obj)
      }
      if (msg.checked) {
        let path = getPolylineBYPoints(singleRoad)
        this.drawOLLine(this.layerSource, path.pointCol, roads[i].road_segment_id, color)
      }
    }
  }

  //查询考勤表获取下井起始结束时间
  viewCrossPath (msg) {
    this.attDate = new Date(msg.data.cur_time).format('yyyy-MM-dd hh:mm:ss')
    let store = xdata.metaStore
    let staffs = Array.from(store.staffs.values()).filter(item => item.card_id === msg.data.obj_id)[0]
    let staffId = staffs.staff_id
    this.obj_id = staffId
    // 根据日期查找下井起始结束时间 ${attDate.split(' ')[0]}
    let sql = `SELECT card_id, staff_id, shift_id, DATE_FORMAT(start_time,"%Y-%m-%d %H:%i:%s") AS start_time, DATE_FORMAT(end_time,"%Y-%m-%d %H:%i:%s") AS end_time, att_date FROM rpt_att_staff WHERE staff_id=${staffId} AND att_date="${this.attDate.split(' ')[0]}"`
    // console.log(sql)
    inquireDB('rpt_att_staff', sql)
  }
  
  //根据告警时间查找距离告警时间最近的位置
  getWarnPosition (row) {
    let time = null
    let beginTime = Date.parse(row.begin_time)
    let warnTime = Date.parse(this.attDate)
    time = Math.abs(warnTime-beginTime)
    return time
  }

  //展示越界路线
  viewCrossLine (rows) {
    let paths = clone(rows)
    for (let i = 0; i < paths.length; i++) {
      paths[i]['shortime'] = this.getWarnPosition(paths[i])
    }
    let clonePaths = clone(paths)
    clonePaths.sort(function (a, b) {
      return a.shortime - b.shortime
    })
    let index = null
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].shortime === clonePaths[0].shortime) index = i
    }
    let normalPaths =  clone(paths)
    let deviatePaths =  clone(paths)
    let normalRoads = normalPaths.splice(0,index+1)//正常行走路线
    let deviateRoads = deviatePaths.splice(index) //偏离路线
    this.crossAllLinePath(normalRoads,1)
    this.crossAllLinePath(deviateRoads,2)
  }

  crossAllLinePath (rows, index) {
    for (let i = 0; i < rows.length; i++) {
      if (i < rows.length-1) {
        let startPath = rows[i]
        let endPath = rows[i+1]
        let roads = [startPath, endPath]
        this.setCrossLinePath(roads, index)
      }
    }
  }

  setCrossLinePath (roads, index) {
    // index为1真实路线 为2偏离的路线
    const color = index === 1 ? '#804000' : '#FF6057'
    for (let i = 0; i < roads.length; i++) {
      let x = roads[i].begin_pt.split(',')[0]
      let y = roads[i].begin_pt.split(',')[1]
      roads[i]['x'] = Number(x)
      roads[i]['y'] = Number(y)
    }
    if (this.checked) {
      let path = getPolylineBYPoints(roads)
      this.drawOLLine(this.layerSource, path.pointCol, roads[0].id, color)
    }
  }
}