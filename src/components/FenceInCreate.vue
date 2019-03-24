<template>
      <!--增加商家信息-->
  <div>
    <div class='content-title'>
        <el-row style="margin-top:10px" class='hotlineClass'>
          <el-form v-model="filterForm" ref="filterForm" :inline="true">
            <el-form-item label="建筑：">
              <el-select v-model="filterForm.buildName" clearable placeholder="请选择">
                  <el-option
                      v-for="item in buildOptions"
                      :key="item.buildName"
                      :value="item.buildName"
                      :label="item.label">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层：">
              <el-select v-model="filterForm.floor" clearable placeholder="请选择">
                  <el-option
                      v-for="item in floorOptions"
                      :key="item.floor"
                      :value="item.floor"
                      :label="item.label">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float:right;margin-right:20px">
              <el-button type="primary" style="height:30px;width:80px;line-height:5px;" @click="addVisable = true">查询</el-button>
            </el-form-item>
          </el-form>
      </el-row>
      <el-row style="margin-top:0px">
        <div class='' v-show="!addBusLabelVisible">
          <el-col :span="22" style="border:1px;dashed #000">
          <div class='' v-bind:style="{marginLeft: addWidth + 'px'}">
            <el-form :model="addForm" :rules="addRules" ref="addForm"  label-width="148px">
              <div style="clear:both"></div>
              <el-form-item label="围栏POI：" style="margin-top:5px">
                <div></div>
                <div v-show="svgSelect.addpointVisible"> 
                  <span style="display:inline">{{addForm.pointAddress}}</span>
                  <img src='../../static/img/close-point.png' class='close-point' @click="closeAddPoint()"></img>
                </div>
                <label style="fon-size:14px;color:#999999">使用鼠标右键或地图右上角“标记”按钮直接在地图上进行标记</label>
                <!--标记点击，@click为点击事件，@mousedown为鼠标事件（获取当前的鼠标位置）-->
                <div class='svgAdd'  style="position:relative;width:800px;overflow:hidden;height:500px;float:left;border:2px solid #e8e9e9" v-bind:class="{'cursorClass': svgSelect.isCursor}">
                  <div id="svgmap" style="">
                  </div>
                  <div style="position:fixed; top:20;">
                  <svg id="selectShape" xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <circle  cx="23" cy="22" r="40" stroke="black" stroke-width="2" fill="white"/>
                  <!--右上角标记-->
                  </svg>
                  </div>
                  <div id="svgDemo"></div>
                  <div class="floor-list-add">
                    <el-tooltip class="item" effect="dark" content="左键点击选择POI，右键取消" placement="top-start">
                      <img src='../../static/img/图钉.png' @click="markClickButton()" @mousedown="getXY"/>
                      <!-- <img src='../../../static/img/add_location.png' @click="markClickButton()" @mousedown="getXY"/> -->
                    </el-tooltip>
                  </div>
                  <div class="floor-list-size">
                      <ul class="list-bar list-bar2 list-bar-size">
                          <li style="margin-top:5px" @click="changeViewBoxSize(1)">+</li>
                          <li style="margin-top:-10px" @click="changeViewBoxSize(-1)">-</li>
                      </ul>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          </el-col>
          	<el-col :span="2" style="border:1px;dashed #000">
          	<div style="border:10px;dashed #000">
            <div style="margin-left:2px;text-align:center;font-size:20px">工具栏</div>
          	<div style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px"  @click="draw('point')"><i class="fa fa-hand-o-up fa-lg"></i></div>
          	<div style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px" @click="draw('circle')"><i class="fa fa-circle-thin fa-lg"></i></div>
          	<div style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px"  @click="draw('polygon')"><i class="fa fa-square-o fa-lg"></i></div>
          	<!-- <div class="" style="margin-left:2px;margin-top:30px;text-align:center;font-size:30px"><i class="fa fa-eye fa-lg"></i></div> -->
          	<div class="" style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px" @click="draw('clear')"><i class="fa fa-close fa-lg"></i></div>
            </div>
          </el-col>
          <div style='text-align:center;clear:both;margin-top:20px' class='submit-button'>
            <el-button type="primary" style="width:240px;padding:10px 0px" @click="submitAddBus()">保 存</el-button>
          </div>
        </div>
        <div class='addBusLabel' v-show="addBusLabelVisible">
          <div style='text-align:center;clear:both;margin-top:20px' class='submit-button'>
            <el-button type="primary"  style="width:200px;border-radius:4px;padding: 6px 16px" @click="submitAddBus()">保 存</el-button>
          </div>
        </div>
      </el-row>
      </div>
    </div>
</template>
<style>
  .icon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
  }
</style>
<script>
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
import '../../static/js/iconfont.js'
import * as d3 from 'd3'
// 禁用浏览器右击事件
document.oncontextmenu = function (e) {
  e.preventDefault()
}
export default {
  created () {
    this.addBusinessVisible()
    // this.draw = SVG('svgDemo').size('100%', '100%')
    // console.log(document.getElementById('selectShape').currentScale)
    // window.getElementById('selectShape').currentScale = window.documen.getElementById('selectShape').currentScale * 1.5
  },
  data () {
    return {
      options: {
        text: '测试加载',
        target: document.getElementById('el-table')
      },
      pForm: {
        cx: 0,
        cy: 0
      },
      buildOptions: [],
      floorOptions: [],
      addWidth: '', // 增加商家和偏移宽度
      addBusLabelWidth: '', // 增加商家标签偏移宽度
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中,请稍等......',
      addBusVisible: false, // 增加商家是否可见
      loading2: false, // 加载
      loading: false, // 页面加载
      Note: '', // 提交提示
      pointVisible: false, // 加载弹窗是否显示
      svg: function () { // 地图svg对象
        let svgDiv = d3.select(this.$el).selectAll('#svgmap')
        let svg = svgDiv.selectAll('svg')
        return svg
      },
      svgAdd: function () { // 地图svg对象
        let svgDiv = d3.select(this.$el).select('.svgAdd').select('#svgmap')
        let svg = svgDiv.select('svg')
        return svg
      },
      viewBox: function () { // svg中的viewBox属性
        // let svgDiv = d3.select(this.$el).select('#svgmap')
        // let svg = svgDiv.select('svg')
        let viewBox = this.svg().attr('viewBox').split(' ')
        for (let i = 0; i < viewBox.length; i++) {
          viewBox[i] = parseInt(viewBox[i])
        }
        return viewBox
      },
      svgSelect: {
        addpointVisible: true, // 增加商家地图上方坐标位置是否可见
        center: [], // 选到的中心坐标
        centerXList: [], // 中心X坐标数组
        centerYList: [], // 中心Y坐标数组
        isCursor: false, // 是否选择右上角标记
        svgStr: '',
        floorList: [
          {select: 'F1'},
          {select: 'F2'},
          {select: 'F3'}
        ] // 机场楼层数目列表
      },
      markClick: false, // 地图右上角标记点
      clientX: 0, // 存储x的坐标
      clientY: 0, // 存储y的坐标
      fileList: [],
      addVisible: false,
      filterForm: {
        buildName: '',
        floor: 0
      },
      formLabelWidth: '30%',
      addForm: {
        pointAddress: '',
        placeName: '', // 商家名称
        latitude: '',
        longitude: '',
        address: '',
        floor: 1,
        cx: 0,
        cy: 0,
        labelIds: [],
        labelList: [],
        terminalId: [],
        terminalName: []
      },
      addRules: {}
    }
  },
  computed: {
    setAddPoint () {
      return this.addForm.floor + 'F (' + this.addForm.longitude + ',' + this.addForm.latitude + ')'
      /**
       * self.addForm.latitude = self.svgSelect.center[0]
          self.addForm.longitude = self.svgSelect.center[1]
          self.editForm.latitude = self.svgSelect.center[0]
          self.editForm.longitude = self.svgSelect.center[1]
       */
    }
  },
  methods: {
    /** ************************************* 前端显示选择地图等 *************************************** */
    getCenterFun (pointList) {
      function Point (x, y) {
        this.x = x
        this.y = y
      }
      // Contour object
      function Contour (a) {
        this.pts = [] // an array of Point objects defining the contour
      }
      Contour.prototype.area = function () {
        var area = 0
        var pts = this.pts
        var nPts = pts.length
        var j = nPts - 1
        var p1
        var p2
        for (var i = 0; i < nPts; j = i++) {
          p1 = pts[i]
          p2 = pts[j]
          area += p1.x * p2.y
          area -= p1.y * p2.x
        }
        area /= 2
        return area
      }
      Contour.prototype.centroid = function () {
        var pts = this.pts
        var nPts = pts.length
        var x = 0
        var y = 0
        var f
        var j = nPts - 1
        var p1
        var p2
        for (var i = 0; i < nPts; j = i++) {
          p1 = pts[i]
          p2 = pts[j]
          f = p1.x * p2.y - p2.x * p1.y
          x += (p1.x + p2.x) * f
          y += (p1.y + p2.y) * f
        }
        f = this.area() * 6
        return new Point({x: x / f, y: y / f})
      }
      var polygon = pointList
      let con = new Contour()
      con.pts = polygon
      let c = con.centroid()
      c.x.x = c.x.x.toFixed(4)
      c.x.y = c.x.y.toFixed(4)
      return c.x
    },
    // 初始化地图时设置每个地区的地标
    initAllStyle (Form, svgStr) {
      // let floor = svgStr.split('shougang')[1].split('.')[0]
      // let self = this
      d3.selectAll('.businessSelect').remove()
      d3.selectAll('.haveselect').remove()
      let para = {
        header: JSON.stringify({
          token: sessionStorage.getItem('token')
        }),
        body: JSON.stringify({})
      }
      console.log(para)
    },
    // 加载svg地图文件
    loadSvgMap (svgStr, Form) {
      let self = this
      let svgDiv = d3.select(this.$el).selectAll('#svgmap')
      let promise = new Promise(function (resolve, reject) { // 地图加载完之后在执行
        // 载入svg文件
        d3.xml(svgStr,
          function (xml) {
            // 获取xml文件内容，并转化为string字符串
            let strinit = xml.documentElement
            let str = ''
            if (strinit.outerHTML) {
              str = strinit.outerHTML
            } else {
              var div = document.createElement('div')
              div.appendChild(strinit)
              str = div.innerHTML
            }
            // 在div中插入svg地图
            svgDiv.html(str)
            // 选取svg对象
            let svg = svgDiv.selectAll('svg')
            let storage = window.localStorage
            storage.originViewBox = svg.attr('viewBox')
            svg.attr('width', 800)
               .attr('height', 500)
            self.initAllStyle(Form, svgStr) // 初始化地图，设置每个地区的地标，各个样式等
            resolve()
          })
      })
      // 地图加载完成
      promise.then(function () {
        self.bindDrag(Form)
      })
      // promise.then(this.bindDrag)
      promise.then(function () {
        self.bindClick(Form)
      })
    },
    // 绑定拖动事件drag
    bindDrag (Form) {
      let _svg = this.svg()
      if (Form === 'addForm') {
        _svg = this.svgAdd()
      }
      // 获得原始svg的viewBox属性
      let storage = window.localStorage
      let originViewBox = storage.originViewBox.split(' ')
      /**
         * 修改viewBox完成平移缩放
         * **/
      let drag = d3.drag()
        .on('start', function (d) {
        })
        .on('end', function (d) {
        })
        .on('drag', function (d) {
          d3.select(this) // 移动效果就是改变viewBox（0,0,1000,1000）的前两个值
            .attr('viewBox', function (d) {
              let viewBox = _svg.attr('viewBox').split(' ') // 拆分viewBox的值为数组
              let ratio = 500 / viewBox[2]
              let flagx = 1 // 图片水平方向是否能够拖动，1为能
              let flagy = 1 // 图片竖直方向是否能够拖动，0为不能
              // 以下为判断图片水平和竖直方向能否拖动
              if (parseInt(viewBox[0]) + parseInt(viewBox[2]) <= parseInt(viewBox[2]) && (d3.event.dx >= 0)) {
                flagx = 0
                viewBox[0] = 0
              }
              if ((parseInt(viewBox[0]) + parseInt(viewBox[2]) >= parseInt(originViewBox[2])) && (d3.event.dx < 0)) {
                flagx = 0
                viewBox[0] = parseInt(originViewBox[2]) - parseInt(viewBox[2])
              }
              if (parseInt(viewBox[2]) === parseInt(originViewBox[2])) {
                flagx = 0
                viewBox[0] = 0
              }
              if (parseInt(viewBox[1]) + parseInt(viewBox[3]) <= parseInt(viewBox[3])) {
                if (parseInt(viewBox[1]) + parseInt(viewBox[3]) <= parseInt(viewBox[3]) && d3.event.dy <= 0) {
                  flagy = 1
                } else {
                  flagy = 0
                  viewBox[1] = 0
                }
              }
              if (parseInt(viewBox[1]) + parseInt(viewBox[3]) >= parseInt(originViewBox[3])) {
                if (d3.event.dy >= 0 && parseInt(viewBox[1]) + parseInt(viewBox[3]) >= parseInt(originViewBox[3])) {
                  flagy = 1
                } else {
                  flagy = 0
                  viewBox[1] = parseInt(originViewBox[3]) - parseInt(viewBox[3])
                }
              }
              if (parseInt(viewBox[3]) === parseInt(originViewBox[3])) {
                flagy = 0
              }
              if (flagx) {
                viewBox[0] = parseInt(viewBox[0]) - d3.event.dx / ratio
              } else {
              }
              if (flagy) {
                viewBox[1] = parseInt(viewBox[1]) - d3.event.dy / ratio
              } else {
              }
              let viewBoxStr = `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}` // 拼接为viewBox字符串
              return viewBoxStr
            })
        })
      _svg.call(drag)
    },
    // 绑定点击事件
    bindClick (Form) {
      let self = this
      // 选择所有的多边形polygon
      let polygon = this.svg().selectAll('polygon')
      let rect = this.svg().selectAll('rect')
      let pointVisible = ''
      Form === 'addForm' ? pointVisible = 'addpointVisible' : pointVisible = 'editpointVisible'
      // 绑定鼠标按下矩形时事件
      rect.on('mousedown', function () {
        // 获取具体的鼠标事件，0为左键，1为滚轮，2为右键
        let button = d3.event.button
        let selfD3 = d3.select(this)
        // let color = selfD3.attr('fill')
        if ((button === 2 && self.markClick === false) || (button === 0 && self.markClick === true)) {
          self.svgSelect[pointVisible] = true
          // 获得鼠标选取的矩形平均中心点
          self.svgSelect.center = self.getRectCenter(selfD3)
          self[Form].latitude = self.svgSelect.center.y
          self[Form].longitude = self.svgSelect.center.x
          self[Form].pointAddress = self[Form].floor + 'F (' + self[Form].longitude + ', ' + self[Form].latitude + ')'
          self[Form].cx = self[Form].longitude
          self[Form].cy = self[Form].latitude
          console.log(self[Form].cx)
          if (self.svgSelect.center.x) {
            d3.selectAll('.haveselect').remove()
            d3.selectAll('.editselect').remove()
            let location = d3.selectAll('#XMLID_1_')
            .append('g')
            .attr('transform', function (d) {
              // 计算标注点的位置
              return 'translate(' + parseFloat(self.svgSelect.center.x) + ',' + parseFloat(self.svgSelect.center.y) + ')'
            })
            location.append('svg:image')
              .attr('class', 'haveselect')
              .attr('xlink:href', '../../static/img/icon.png')
              .attr('width', 50)
              .attr('height', 50)
              .attr('x', -25)
              .attr('y', -45)
              // .attr('y', -40)
            location.append('svg:circle')
              .attr('cx', -30)
              .attr('cy', -30)
              .attr('r', 20)
          }
          self.svgSelect.center = []
        } else if (button === 2 && self.markClick === true) {
          self.svgSelect[pointVisible] = true
          self.markClick = false
        }
      })
      // 绑定鼠标按下多边形事件
      polygon.on('mousedown', function () {
        // 获取具体的鼠标事件，0为左键，1为滚轮，2为右键
        let button = d3.event.button
        let selfD3 = d3.select(this)
        // let color = selfD3.attr('fill')
        if ((button === 2 && self.markClick === false) || (button === 0 && self.markClick === true)) {
          self.svgSelect[pointVisible] = true
          if (self.markClick === true) {
            // 取消标记
            // self.markClick = false
          }
          // 获得鼠标选取的多边形平均中心点
          self.svgSelect.center = self.getPolygonCenter(selfD3.attr('points').split(' '))
          self[Form].latitude = self.svgSelect.center.y
          self[Form].longitude = self.svgSelect.center.x
          self[Form].pointAddress = self[Form].floor + 'F (' + self[Form].longitude + ', ' + self[Form].latitude + ')'
          self[Form].cx = self[Form].longitude / 10
          self[Form].cy = self[Form].latitude / 10
          console.log(self[Form].cx)
          if (self.svgSelect.center.x) {
            d3.selectAll('.haveselect').remove()
            d3.selectAll('.editselect').remove()
            let location = d3.selectAll('#XMLID_1_')
            .append('g')
            .attr('transform', function (d) {
              // 计算标注点的位置
              return 'translate(' + parseFloat(self.svgSelect.center.x) + ',' + parseFloat(self.svgSelect.center.y) + ')'
            })
            location.append('svg:image')
              .attr('class', 'haveselect')
              .attr('xlink:href', '../../static/img/icon.png')
              .attr('width', 60)
              .attr('height', 60)
              .attr('x', -30)
              .attr('y', -45)
            location.append('svg:circle')
              .attr('cx', -30)
              .attr('cy', -30)
              .attr('r', 20)
          }
        } else if (button === 2 && self.markClick === true) {
          self.svgSelect[pointVisible] = true
          self.markClick = false
        }
      })
      // 整个svg绑定一个右击事件，取消标记的选择状态
      this.svg().on('mousedown', function () {
        let button = d3.event.button
        if (self.markClick === true) {
          if (button === 2) {
            self.markClick = false
          }
        }
      })
    },
    // 获取所选rect中心
    getRectCenter (selfD3) {
      let finalList = [] // 最终中心点
      let initx = parseFloat(selfD3.attr('x')) + parseFloat(selfD3.attr('width')) / 2
      let inity = parseFloat(selfD3.attr('y')) + parseFloat(selfD3.attr('height')) / 2
      if (selfD3.attr('transform')) {
        let pointsAttr = selfD3.attr('transform').split('matrix')[1].split('(')[1].split(')')[0].split(' ')
        let pointsAttrList = [] // 对矩形transform属性进行处理得到的数组
        for (let i = 0; i < pointsAttr.length; i++) {
          if (pointsAttr[i] !== '') {
            pointsAttrList.push(pointsAttr[i])
          }
        }
        // a,b,c,d,e,f为rect中的transform(matrix)属性
        let a = parseFloat(pointsAttrList[0])
        let b = parseFloat(pointsAttrList[1])
        let c = parseFloat(pointsAttrList[2])
        let d = parseFloat(pointsAttrList[3])
        let e = parseFloat(pointsAttrList[4])
        let f = parseFloat(pointsAttrList[5])
        finalList.push({
          'x': (a * initx + inity * c + e).toFixed(4),
          'y': (b * initx + inity * d + f).toFixed(4)
        })
      } else {
        finalList.push({
          'x': initx.toFixed(4),
          'y': inity.toFixed(4)
        })
      }
      return finalList[0]
    },
    // 获得所选polygon中心
    getPolygonCenter (pointsAttr) {
      let pointsAttrList = [] // 对多边形points属性进行处理得到的数组
      for (let i = 0; i < pointsAttr.length; i++) {
        if (pointsAttr[i] !== '') {
          pointsAttrList.push(pointsAttr[i])
        }
      }
      let totalList = []
      let totalCenter = ''
      for (let i = 0; i < pointsAttrList.length; i++) {
        totalList.push({
          'x': parseFloat(pointsAttrList[i].split(',')[0]),
          'y': parseFloat(pointsAttrList[i].split(',')[1])
        })
      }
      // var polygon = [
      //   {'x': 770.3423, 'y': 400.5555},
      //   {'x': 529.3434, 'y': 643.2353},
      //   {'x': 320.3455, 'y': 494.8865},
      //   {'x': 424.3477, 'y': 381.5678},
      //   {'x': 459.3488, 'y': 369.2332}
      // ]
      totalCenter = this.getCenterFun(totalList)
      return totalCenter
    },
    // 改变viewBox的大小，形成地图缩放的效果
    // i<0，扩大viewBox，视觉效果位地图缩小
    changeViewBoxSize (i) {
      // 获取原始viewBox
      let storage = window.localStorage
      let originViewBox = storage.originViewBox.split(' ')
      let viewMax = parseInt(originViewBox[2]) // viewBox最大值
      let viewMin = parseInt(originViewBox[2]) - 100 * 5 // viewBox最小值
      let viewBox = this.viewBox()
      if (i < 0) {
        // 注：viewBox[2]越大，则显得地图越小，所以点击缩小即为增加viewBox[2]和[3]
        // 如果viewBox大小的值大于最大值，直接赋值最大值
        viewBox[2] >= viewMax ? viewBox[2] = viewBox[3] = viewMax : viewBox[2] = viewBox[3] = viewBox[2] + 100
      } else {
        viewBox[2] <= viewMin ? viewBox[2] = viewBox[3] = viewMin : viewBox[2] = viewBox[3] = viewBox[2] - 100
      }
      // 设置viewBox属性
      let viewBoxStr = `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`
      this.svg().attr('viewBox', viewBoxStr)
    },
    // 标记选择状态
    markClickButton () {
      this.markClick = true
    },
    // 获取鼠标当前的坐标
    getXY (event) {
      this.clientX = event.clientX
      this.clientY = event.clientY
    },
    /** ************************************* 前端处理数据格式，显示等 *************************************** */
    // 点击关闭增加商家，取消地图所选商家，
    closeAddPoint () {
      this.addForm.pointAddress = ''
      this.svgSelect.addpointVisible = false
      d3.selectAll('.haveselect').remove()
    },
    // 点击关闭增加商家弹窗时重置addForm数据
    clearAddForm () {
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
        this.svgSelect.floorList.forEach((item) => {
          if (!item.active) {
            this.$set(item, 'active')
          }
          this.$set(item, 'active', false)
        })
      })
      // this.$refs['uploadImg'].uploadFiles = []
      this.setLabelDropDown(this.addForm.allLabelList, 'addForm')
      this.svgSelect.addpointVisible = false
      this.addForm.floor = 1
      // this.addForm.floor = 3
      this.addForm.address = ''
      this.addImgVisible = true
    },
    // 重置表单
    resetForm (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
        if (formName === 'addForm') {
          this.$refs['uploadImg'].clearFiles()
        }
      })
    },
    // 点击弹窗“关闭”提交数据增加商家
    submitAddBus () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.selectLabel('addForm') // 选择标签后再次保存
          let file = this.$refs['uploadImg'].uploadFiles[0]
          if (this.addForm.pointAddress === '') {
            this.$message.warning('请在基本资料中选择商家坐标')
            return false
          }
          if (this.addForm.labelIds.length === 0) {
            this.$message.warning('请在标签设置中选择商家标签')
            return false
          }
          if (file) {
            this.$refs.uploadImg.submit()
          } else {
            this.addBusinessFro()
          }
        }
      })
    },
    // 点击增加商家按钮
    addBusinessVisible () {
      this.addBusVisible = true
      this.BusVisible = false
      this.editBusVisible = false
      this.addBusLabelVisible = false
      // this.addVisible = true
      // 元素加载完成后加载地图
      this.$nextTick(() => {
        let svgStr = '../../static/shougang1.svg'
        // let svgStr = '../../../static/shougang1.svg'
        this.loadSvgMap(svgStr, 'addForm')
        this.addForm.pointAddress = '' // 点击增加商家初始化地图上方选择图标位置，毕竟编辑中的覆盖
      })
    },
    // 增加商家“删除”暂存列表图片
    addhandleRemove (file, fileList) {
      this.addImgVisible = true
    },
    // 重置表单
    resetError (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    /** ************************************* 提交后台相关函数 *************************************** */
    // 向后台和图片一起提交添加商家表单
    addBusinessFro () {
      let file = this.$refs['uploadImg'].uploadFiles[0]
      // let fileValue = document.querySelector('.el-upload-img .el-upload__input')
      let para = new FormData()
      if (file) { // 如果有图片
        para.append('imge', file.raw)
      }
      // this.addForm.labelIds = [1, 2, 3]
      para.append('header', JSON.stringify({
        'token': sessionStorage.getItem('token'),
        'beanId': 'businessManageService_v1'
      }))
      para.append('body', JSON.stringify({
        // 'address': this.addForm.airportName + this.addForm.terminalName + this.addForm.floor + '楼',
        'address': this.addForm.address,
        'airportId': this.addForm.airportId,
        'placeName': this.addForm.placeName,
        'latitude': this.addForm.latitude,
        'longitude': this.addForm.longitude,
        'floor': this.addForm.floor,
        'labelIds': this.addForm.labelIds,
        'terminalId': this.addForm.terminalId[0]
      }))
      this.addForm.file = file
      // apiBus.addBusiness(para).then(res => {
      console.log(para)
    }
  },
  watch: {
    // 监测标记按钮是否点击
    markClick: function (newMark, oldMark) {
      if (newMark === true) {
        // 如果点击，切换鼠标为画笔样式
        this.svgSelect.isCursor = true
        /* let span = d3.select(this.$el).append('span')
        span.text('鼠标左键点击，鼠标右键取消')
          .style('position', 'absolute')
          .style('left', this.clientX + 20 + 'px')
          .style('top', this.clientY + 'px')
          // 绑定鼠标移动事件
        document.onmousemove = function (e) {
          span.style('left', e.clientX + 20 + 'px')
          span.style('top', e.clientY + 'px')
        } */
      } else if (newMark === false) {
        // d3.select(this.$el).select('span').remove()
        this.svgSelect.isCursor = false
      }
    }
  },
  mounted () {
    this.tableWidth = document.body.scrollWidth - 239 - 20
    this.addWidth = (document.body.scrollWidth - 219) / 2 - (800 / 2) - 200
    this.addBusLabelWidth = (document.body.scrollWidth - 219) / 2 - (944 / 2) - 20
  }
}
</script>