<!-- 复杂信息窗体 -->

<template lang="html">
  <!-- 地图派单 地图弹窗 -->
  <div>
    <Modal
      transfer
      scrollable
      title="地图派单"
      class="assign-modal"
      v-model="isShowModal"
      :width="'auto'"
      :padding="0"
      :styles="{width: '90%', height:' 95%', padding: 0}"
      :loading="madalLoading"
      @on-ok="isShowModal = false">
      <div class="AMap">

        <!-- 选中信息 -->
        <div class="select-status-body">
          <div>
            <div class="select-order-body">
              <span class="selct-label">
                选中工单
              </span>
              <Tag
                closable
                type="border"
                v-for="item in selectOrder"
                :key="item.orderId"
                @on-close="closeTag(item.orderId, 'order')">
                {{item.order_no}}
              </Tag>
            </div>
            <div class="select-persoin-body">
              <span class="selct-label">
                服务人员
              </span>
              <!-- 服务人员标签 -->
              <Tag
                v-if="selectService.id"
                closable
                type="border"
                @on-close="closeTag(selectService.id, 'service')">
                {{selectService.name || ''}}
              </Tag>
              <span class="selct-label">
                协同人员
              </span>
              <!-- 协同人员标签 -->
              <Tag
                closable
                type="border"
                v-for="item in selectCooperation"
                :key="item.id"
                @on-close="closeTag(item.id, 'cooperation')">
                {{item.name}}
              </Tag>
            </div>
          </div>
          <Button
            type="primary"
            @click="submit"
            >确定
          </Button>
        </div>
        <div class="amap-detail">
          <!-- 工单列表 -->
          <div
            class="left-body"
            :style="{width: isShowLeft ? '220px' : '0px'}">
            <div
              class="left-show-btn left-position"
              @click="isShowLeft = !isShowLeft">
              <Icon
                size="16"
                :type="isShowLeft ? 'arrow-left-b' : 'arrow-right-b'"
              />
            </div>
            <div class="amap-list-body">
              <div
                class="order-list"
                :class="{'select-active': selectIndex === item.orderId}"
                v-for="(item, index) in orderList"
                :key="item.orderId"
                @click="selectMapFunc(item)">
                <Checkbox v-model="item.checked" @on-change="$set(orderList, index, item)"/>
                <div class="order-detail">
                  <p class="smy__text-overflow-one-line title">{{item.title}}</p>
                  <p>{{item.order_no}}</p>
                  <p>客户电话：{{item.phone}}</p>
                </div>
              </div>
            </div>
            <div class="page-body">
              <span>共 {{orderCount}} 条</span>
              <Page
                simple
                show-total
                size="small"
                :total="orderCount"
                @on-change="changePage($event, 'order')"
              />
            </div>
          </div>

          <!-- 地图 -->
          <div id="assignContainer" class="mymap" />
          <!-- 服务人员列表 -->
          <div
            class="right-body"
            :style="{width: isShowRight ? '220px' : '0px'}">
            <div
              class="left-show-btn right-position"
              @click="isShowRight = !isShowRight">
              <Icon
                size="16"
                :type="isShowRight ? 'arrow-right-b' : 'arrow-left-b'"
              />
            </div>
            <div class="amap-list-body">
              <div
                class="order-list"
                :class="{'select-active': selectIndex === item.id}"
                v-for="(item, index) in serviceList"
                :key="item.id"
                @click="selectServiceFunc(item.id)">
                <div style="width: 60px">
                  <Radio
                    v-model="item.radio"
                    @click.native="radioChange(item.id)">指派</Radio>
                  <Checkbox v-model="item.checked" @on-change="$set(serviceList, index, item)">&nbsp;协同</Checkbox>
                </div>
                <div class="order-detail">
                  <p class="smy__text-overflow-one-line title">{{item.name}}&nbsp;{{item.mobile}}</p>
                  <p>
                    <Icon type="record" :color="item.state_color_rgb ? item.state_color_rgb : '#ccc'"></Icon>
                    {{item.state_label || '未设置'}}&nbsp;
                    当前{{item.work_num}}单
                  </p>
                  <p
                    class="smy__text-overflow-one-line"
                    style="max-width: 130px">
                    <span
                      class="assign-skill-tag"
                      v-for="tag in item.skillList"
                      :key="tag.id"
                      :style="{background: tag.color_rgb}">
                      {{tag.name}}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="page-body">
              <span>共 {{serviceCount}} 条</span>
              <Page
                @on-change="changePage($event, 'service')"
                :total="serviceCount"
                size="small"
                show-total
                simple
              />
            </div>
          </div>
        </div>
        <!-- <div class="amapTips">
          当前还有{{orderCount}}个工单未指派工单
        </div> -->
      </div>
      <div slot="footer">
        <Button
          type="ghost"
          @click="isShowModal = false"
          >关闭
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import AmapInfoWindow from '@/assets/AmapInfoWindow'
import ServerPerson from '@/assets/ServerPerson'
import AMap from 'AMap'

let map = {}
let marker = {}

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    centerPositon: {
      type: Array
    }
  },
  data () {
    return {
      orderList: [],  // 工单列表
      orderCount: 0,
      orderPage: 0,
      amapOrderList: [],  // 地图显示工单列表
      amapServiceList: [],
      isShowLeft: true,
      isShowRight: true,
      serviceMarker: {},
      orderMarker: {},
      selectOrder: [],  // 选中工单列表
      serviceList: [], // 人员列表
      serviceCount: 0,
      servicePage: 0,
      selectService: {},  // 选中服务人员
      selectCooperation: [],  // 选中协同人列表
      isShowModal: this.value,
      madalLoading: true,
      center: [118.180987, 24.486432],
      cityList: [],
      selectCity: '',
      isClickMap: false,
      routerLink: '',
      startInterval: '',
      selectIndex: ''
    }
  },
  watch: {
    orderList: {
      handler (val) {
        // 选中添加同步
        let select = val.filter(item => item.checked)
        select.forEach(item => {
          if (!this.selectOrder.some(item2 => item2.orderId === item.orderId)) {
            this.changeOrderMarker(item, 'add')
            this.selectOrder.push(item)
          }
        })
        // 未选中同步
        let unSelect = val.filter(item => !item.checked)
        this.selectOrder.forEach((item, index) => {
          if (unSelect.some(item2 => item2.orderId === item.orderId)) {
            this.changeOrderMarker(item, 'remove')
            this.selectOrder.splice(index, 1)
          }
        })
      },
      deep: true
    },
    serviceList: {
      handler (val) {
        // 选中添加同步
        let select = val.filter(item => item.checked)
        select.forEach(item => {
          if (!this.selectCooperation.some(item2 => item2.id === item.id)) {
            this.changeServiceMarker(item, 'add')
            this.selectCooperation.push(item)
          }
        })
        // 未选中同步
        let unSelect = val.filter(item => !item.checked)
        this.selectCooperation.forEach((item, index) => {
          if (unSelect.some(item2 => item2.id === item.id)) {
            if (this.selectService.id !== item.id) {
              this.changeServiceMarker(item, 'remove')
            }
            this.selectCooperation.splice(index, 1)
          }
        })
      },
      deep: true
    },
    value (val) {
      this.isShowModal = val
      if (val) {
        this.getAmapMessageList()
        this.getOrderList()
        this.getServerList()
        if (!this.centerPositon) {
          this.getCenterPosition()
        } else {
          if (!this.centerPositon[0] || !this.centerPositon[1] || !this.centerPositon[0] === 0 || !this.centerPositon[1] === 0) {
            this.getCenterPosition()
          }
        }
        this.loadmap()   // 加载地图和相关组件
      }
    },
    isShowModal (val) {
      this.$emit('input', val)
      // 关闭弹窗后初始化数据
      if (!val) {
        this.serviceMarker = {}
        this.orderMarker = {}
        this.selectOrder = []  // 选中工单列表
        this.serviceList = [] // 人员列表
        this.selectService = {}  // 选中服务人员
        this.selectCooperation = []  // 选中协同人列表
        if (this.startInterval) clearInterval(this.startInterval)
      }
    },
    'routerLink': {
      handler (val, oldValue) {
        if (val && val !== oldValue) {
          this.$router.push({name: 'AssignOrderDetail', params: { orderId: val }})
          clearInterval(this.startInterval)
        }
      },
      deep: true
    }
  },
  methods: {
    // ip定位
    getCenterPosition () {
      let url = 'https://restapi.amap.com/v3/ip?ip=&output=xml&key=43202ac9c4bbbe5ef5d65478de3617be'
      this.$http.post(url).then(res => {
        let rectangle = res.rectangle.split(';')
        let position1 = rectangle[0].split(',')
        let position2 = rectangle[1].split(',')
        let longitude = ((Number(position1[0]) + Number(position2[0])) / 2).toFixed(7)
        let latitude = ((Number(position1[1]) + Number(position2[1])) / 2).toFixed(8)
        let center = [longitude, latitude]
        this.center = center
        marker.setPosition(this.center)
        map.panTo(this.center)
      })
    },

    // 加载地图
    loadmap () {
      map = new AMap.Map('assignContainer', {
        resizeEnable: true,
        center: this.center,
        zoom: 13
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Marker', 'AMap.Geocoder', 'AMap.InfoWindow'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      // 地图生成标签
      this.amapOrderList.forEach((val, index) => {
        if (val.longitude && val.latitude) {
          marker = new AMap.Marker({
            map: map,
            icon: `/static/mapIcon/3-02.png`,
            position: [val.longitude, val.latitude],
            offset: new AMap.Pixel(-12, -36)
          })
          this.orderMarker[val.orderId] = marker
          AMap.event.addListener(marker, 'click', () => {
            this.openInfo(val, marker)
          })
        }
      })

      // 地图生成标签
      this.amapServiceList.forEach((val, index) => {
        if (val.longitude && val.latitude) {
          let content = ''
          if (val.avatar) {
            content = `<div class="markIcon-background"
              style="background-image: url(/static/mapIcon/3-05.png); width: 36px; height: 36px">
              <img class="service-img" src="${val.avatar}">
            </div>`
          } else {
            content = `<div class="markIcon-background"
              style="background-image: url(/static/mapIcon/3-05.png); width: 36px; height: 36px">
              <i class="ivu-icon ivu-icon-person" style="font-size: 20px; color: #BBBEC4"></i>
            </div>`
          }
          marker = new AMap.Marker({
            map: map,
            icon: `/static/mapIcon/3-01.png`,
            position: [val.longitude, val.latitude],
            offset: new AMap.Pixel(-12, -36),
            content: content
          })

          this.serviceMarker[val.id] = marker
          AMap.event.addListener(marker, 'click', () => {
            this.openServiceInfo(val.id, marker)
          })
        }
      })
    },

    // 获取所有工单和用户信息
    getAmapMessageList () {
      // this.$http.all([
      //   this.$http.get('/order/unDeliverOrderList', {
      //     params: {
      //       pageIndex: 0,
      //       pageSize: 999
      //     }
      //   }),
      //   this.$http.get('/worker/list', {
      //     params: {
      //       pageIndex: 0,
      //       pageSize: 999
      //     }
      //   })
      // ]).then(this.$http.spread((res1, res2) => {
      //   this.amapOrderList = res1.data
      //   this.amapServiceList = res2.data
      //   this.loadmap()   // 加载地图和相关组件
      // }))
      this.amapOrderList = AmapInfoWindow.data
      this.amapServiceList = ServerPerson.data
      this.loadmap()   // 加载地图和相关组件
    },

    // 移除旧标签 显示新标签
    changeOrderMarker (val, state, Pixel) {
      let x = -12
      let y = -36
      if (Pixel) {
        x = Pixel[0]
        y = Pixel[1]
      }
      let img = state === 'add' ? '3-03' : '3-02'
      let content = ''
      if (state === 'add') {
        if (val.img_url) {
          content = `<div class="markIcon-background" style="background-image: url(/static/mapIcon/${img}.png)">
            <img class="tmpl-img" src="${val.img_url}">
          </div>`
        } else {
          content = `<div class="markIcon-background" style="background-image: url(/static/mapIcon/${img}.png)">
            <i style="font-size: 20px; color: #BBBEC4" class="ivu-icon ivu-icon-cube"></i>
          </div>`
        }
      }
      this.orderMarker[val.orderId].setMap(null)
      let marker = new AMap.Marker({
        map: map,
        icon: `/static/mapIcon/${img}.png`,
        position: [val.longitude, val.latitude],
        offset: new AMap.Pixel(x, y),
        content: content
      })
      this.orderMarker[val.orderId] = marker

      AMap.event.addListener(marker, 'click', () => {
        this.openInfo(val, marker)
      })
    },

    changeServiceMarker (val, state, Pixel) {
      let x = -12
      let y = -36
      if (Pixel) {
        x = Pixel[0]
        y = Pixel[1]
      }
      let img = state === 'add' ? '3-04' : '3-01'
      let content = ''
      if (state === 'add') {
        if (val.avatar) {
          content = `<div class="markIcon-background" style="background-image: url(/static/mapIcon/${img}.png)">
            <img class="service-img" src="${val.avatar}">
          </div>`
        } else {
          content = `<div class="markIcon-background" style="background-image: url(/static/mapIcon/${img}.png)">
            <i class="ivu-icon ivu-icon-person" style="font-size: 20px; color: #BBBEC4"></i>
          </div>`
        }
      } else {
        if (val.avatar) {
          content = `<div class="markIcon-background"
            style="background-image: url(/static/mapIcon/3-05.png); width: 36px; height: 36px">
            <img class="service-img" src="${val.avatar}">
          </div>`
        } else {
          content = `<div class="markIcon-background"
            style="background-image: url(/static/mapIcon/3-05.png); width: 36px; height: 36px">
            <i class="ivu-icon ivu-icon-person" style="font-size: 20px; color: #BBBEC4"></i>
          </div>`
        }
      }
      if (val.longitude && val.latitude) {
        this.serviceMarker[val.id].setMap(null)
        let marker = new AMap.Marker({
          map: map,
          icon: `/static/mapIcon/${img}.png`,
          position: [val.longitude, val.latitude],
          offset: new AMap.Pixel(x, y),
          content: content
        })
        this.serviceMarker[val.id] = marker

        AMap.event.addListener(marker, 'click', () => {
          this.openServiceInfo(val.id, marker)
        })
      }
    },

    // 聚焦服务人员 显示信息窗体
    selectServiceFunc (id) {
      this.selectIndex = id
      this.openServiceInfo(id)
    },

    // 聚焦工单 显示信息窗体
    selectMapFunc (val) {
      this.selectIndex = val.orderId
      this.openInfo(val)
    },

    // 信息窗体
    openServiceInfo (id, vMarker) {
      this.$http.get(`/v2/user/serviceInfo/${id}`).then(res => {
        res = res.data
        let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
        let name = res.name
        let content = []
        // <i class="ivu-icon ivu-icon-record" style="color: ${res.state_color_rgb ? res.state_color_rgb : '#ccc'}"></i>
        // ${res.state_label || '未设置'}
        content.push(`<p class="amap-assign-label style="color:#f54849">
          工作状态：
          <span class="ivu-tag ivu-tag-default ivu-tag-dot ivu-tag-checked" style="height: 28px; line-height: 28px">
            <span class="ivu-tag-dot-inner" style="background: ${res.state_color_rgb ? res.state_color_rgb : '#ccc'}"></span>
            <span class="ivu-tag-text">${res.state_label || '未设置'}</span>
          </span>
        </p>`)
        content.push(`<p class="amap-assign-label">未完成工单数：${res.work_num || ''}</p>`)
        let skillList = []
        res.skillList.forEach(item => {
          let span = `<span class="assign-skill-tag" style="background: ${item.color_rgb}">${item.name}</span>`
          skillList.push(span)
        })
        content.push(`<p class="amap-assign-label">${skillList.join('')}</p></br>`)
        content.push(`<p class="amap-assign-time" style="border-top: 1px solid #ededed; padding-top: 10px">记录位置时间：${res.loc_update_time || ''}</p>`)
        content.push(`<p class="amap-assign-label">地址：${res.mapname || ''}</p>`)
        content.push(`<p class="amap-assign-label">服务团队：${res.workerGroup || ''}</p>`)
        // content.push(`<Button style="margin-top:10px; float:right"
        // class="ivu-btn ivu-btn-primary infoWindowButton"
        // onclick="window.routerLink = '${res.orderId}'"
        // orderid="${res.orderId}">指派员工</Button>`)
        content.push('<div style="clear:both"></div>')
        infoWindow.setContent(this.createInfoWindow(name, content.join(''), res))
        if (res.longitude && res.latitude) {
          infoWindow.open(map, [res.longitude, res.latitude])
          map.panTo([res.longitude, res.latitude])
        } else {
          infoWindow.open(map, this.center)
          map.panTo(this.center)
        }
      })
    },
    // 显示信息窗体
    openInfo (val, vMarker) {
      if (this.startInterval) clearInterval(this.startInterval)

      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})

      let content = []
      content.push(`<p class="amap-assign-time" style="color:#f54849">预约时间：${val.estimateArriveTime || ''}</p>`)
      content.push(`<p class="amap-assign-label">联系人：${val.customName || ''}</p>`)
      content.push(`<p class="amap-assign-label">联系电话：${val.phone || ''}</p>`)
      // content.push(`<p class="amap-assign-label">客户企业：${val.custom_enterprise_name}</p>`)
      content.push(`<p class="amap-assign-label">服务地址：${val.gpsAddr || ''}${val.customDetailAddr || ''}</p>`)
      // content.push(`<Button style="margin-top:10px; float:right"
      //   class="ivu-btn ivu-btn-primary infoWindowButton"
      //   onclick="window.routerLink = '${val.orderId}'"
      //   orderid="${val.orderId}">指派员工</Button>`)
      content.push('<div style="clear:both"></div>')
      infoWindow.setContent(this.createInfoWindow(val.title, content.join(''), val))
      infoWindow.open(map, [val.longitude, val.latitude])
      map.panTo([val.longitude, val.latitude])

      // this.startInterval = setInterval(() => {
      //   this.routerLink = window.routerLink
      // }, 1500)
    },
    // 构建自定义信息窗体
    createInfoWindow (title, content, data) {
      var info = document.createElement('div')
      info.className = 'info'
      info.style.lineHeight = '10px'
      info.style.marginTop = '5px'
      // 可以通过下面的方式修改自定义窗体的宽高
      info.style.width = '250px'
      info.style.minWidth = '250px'
      info.style.maxWidth = '250px'
      info.style.borderRadio = '250px'
      // 定义顶部标题
      let top = document.createElement('div')
      let titleD = document.createElement('div')
      titleD.className = 'amap-assign-top'
      let closeX = document.createElement('img')
      top.className = 'info-top'

      titleD.innerHTML = `<div class="amap-assign-title">${title}</div>
        <p class="amap-assign-order">${data.order_no ? '工单号：' + data.order_no : ''}</p>`

      // closeX.src = ctx + '/static/img/close2.gif'
      closeX.onclick = this.closeInfoWindow()

      top.appendChild(titleD)
      top.appendChild(closeX)
      info.appendChild(top)

      // 定义中部内容
      let middle = document.createElement('div')
      middle.className = 'info-middle'
      middle.style.backgroundColor = 'white'
      middle.innerHTML = content
      info.appendChild(middle)

      // 定义底部内容
      let bottom = document.createElement('div')
      bottom.className = 'info-bottom'
      bottom.style.position = 'relative'
      bottom.style.top = '0px'
      bottom.style.margin = '0 auto'
      // var sharp = document.createElement('img')
      // sharp.src = ctx + '/static/img/sharp.png'
      // bottom.appendChild(sharp)
      info.appendChild(bottom)
      return info
    },
    closeInfoWindow () {
      if (this.startInterval) clearInterval(this.startInterval)
      map.clearInfoWindow()
    },
    // 获取工单列表
    getOrderList () {
      // this.$http.all([
      //   this.$http.get('/order/unDeliverOrderList', {
      //     params: {
      //       pageIndex: this.orderPage,
      //       pageSize: 10
      //     }
      //   }),
      //   this.$http.get('/order/unDeliverOrderListCount')
      // ]).then(this.$http.spread((res1, res2) => {
      //   this.orderList = res1.data.map(item => {
      //     if (this.selectOrder.some(item2 => item2.orderId === item.orderId)) {
      //       item.checked = true
      //     } else {
      //       item.checked = false
      //     }
      //     return item
      //   })
      //   this.orderCount = res2.data
      // }))
      let data = AmapInfoWindow.data.filter((item, index) => index > (this.orderPage * 10) && index < ((this.orderPage + 1) * 10))
      this.orderList = data.map(item => {
        if (this.selectOrder.some(item2 => item2.orderId === item.orderId)) {
          item.checked = true
        } else {
          item.checked = false
        }
        return item
      })
      this.orderCount = AmapInfoWindow.count
    },
    // 加载列表数据
    getServerList () {
      // this.$http.all([
      //   this.$http.get('/worker/list', {
      //     params: {
      //       pageIndex: this.servicePage,
      //       pageSize: 10
      //     }
      //   }),
      //   this.$http.get('/worker/workerListCount')
      // ]).then(this.$http.spread((res1, res2) => {
      //   this.serviceList = res1.data.map(item => {
      //     if (this.selectCooperation.some(item2 => item2.id === item.id)) {
      //       item.checked = true
      //     } else {
      //       item.checked = false
      //     }
      //     if (this.selectService.id === item.id) {
      //       item.radio = true
      //     } else {
      //       item.radio = false
      //     }
      //     return item
      //   })
      //   this.serviceCount = res2.data
      // }))
      let data = ServerPerson.data.filter((item, index) => index > (this.servicePage * 10) && index < ((this.servicePage + 1) * 10))
      this.serviceList = data.map(item => {
        if (this.selectCooperation.some(item2 => item2.id === item.id)) {
          item.checked = true
        } else {
          item.checked = false
        }
        if (this.selectService.id === item.id) {
          item.radio = true
        } else {
          item.radio = false
        }
        return item
      })
      this.serviceCount = ServerPerson.count
    },
    changePage (page, name) {
      if (name === 'order') {
        this.orderPage = page - 1
        this.getOrderList()
      } else if (name === 'service') {
        this.servicePage = page - 1
        this.getServerList()
      }
    },
    // 单选
    radioChange (id) {
      this.serviceList.forEach(item => {
        if (item.id === id) {
          this.changeServiceMarker(item, 'add')
          this.selectService = item
          item.radio = true
        } else {
          item.radio = false
          if (this.serviceMarker[item.id] && !this.selectCooperation.some(item2 => item2.id === item.id)) {
            this.changeServiceMarker(item, 'remove')
          }
        }
      })
    },
    // 关闭标签
    closeTag (id, name) {
      if (name === 'order') {
        new Promise((resolve, reject) => {
          this.orderList.forEach((item, index) => {
            if (item.orderId === id) {
              this.changeOrderMarker(item, 'remove')
              item.checked = false
            }
          })
          resolve()
        }).then(() => {
          this.selectOrder.forEach((item, index) => {
            if (item.orderId === id) {
              this.selectOrder.splice(index, 1)
            }
          })
        })
      } else if (name === 'cooperation') {
        new Promise((resolve, reject) => {
          this.serviceList.forEach((item, index) => {
            if (item.id === id) {
              if (this.selectService.id !== item.id) {
                this.changeServiceMarker(item, 'remove')
              }
              item.checked = false
            }
          })
          resolve()
        }).then(() => {
          this.selectCooperation.forEach((item, index) => {
            if (item.id === id) {
              this.selectCooperation.splice(index, 1)
            }
          })
        })
      } else if (name === 'service') {
        this.selectService = {}
        this.serviceList.forEach(item => {
          if (item.id === id) {
            if (!this.selectCooperation.some(item => item.id === id)) {
              this.changeServiceMarker(item, 'remove')
            }
            item.radio = false
          }
        })
      }
    },
    submit () {
      if (this.selectOrder.length === 0) {
        this.$Message.warning('请选择要指派的工单')
        return false
      }
      if (Object.keys(this.selectService).length === 0) {
        this.$Message.warning('请选择要指派服务人员')
        return false
      }
      // let url = 'worker/batchDesignate'
      let data = {
        oidList: this.selectOrder.map(item => item.orderId),
        workerId: this.selectService.id,
        coordinations: this.selectCooperation.map(item => item.id)
      }
      // this.$http.post(url, data).then(res => {
      //   if (res.success) {
      //     this.$Message.success('指派成功')
      //     this.$emit('on-success')
      this.isShowModal = false
      //   } else {
      //     this.$Message.error(res.message)
      //   }
      // })
      this.$emit('on-ok', data)
    }
  },
  created () {
    this.routerLink = window.routerLink = ''
  }
}
</script>

<style lang="css">
  .AMap {
    position: relative;
  }

  .AMap .select-status-body {
    padding: 10px 20px;
    min-height: 80px;
    background: #E8F9F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px #EDEDED;
  }

  .AMap .selct-label {
    line-height: 28px;
    font-size: 14px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .amap-detail {
    display: flex;
  }

  .amap-detail .left-body {
    transition: .5s;
    position: relative;
    box-shadow: 2px 1px 4px #EDEDED;
  }
  .amap-detail .left-position {
    position: absolute;
    right: -20px;
    top: 45%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .amap-detail .right-body {
    transition: .5s;
    position: relative;
    box-shadow: -2px 1px 4px #EDEDED;
  }
  .amap-detail .right-position {
    position: absolute;
    left: -20px;
    top: 45%;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .amap-detail .left-show-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 35px;
    background: #3CCBA6;
    z-index: 2;
    // box-shadow: 2px 0 4px #EDEDED;
    color: #FFF;
    font-size: 12px;
    transition: .5s;
    cursor: pointer;
  }

  .amap-detail .amap-list-body {
    position: relative;
    width: 100%;
    max-height: 100%;
    height: 480px;
    flex-shrink: 0;
    overflow-x: hidden;
  }

  .amap-detail .order-list {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 90px;
    width: 220px;
    line-height: 24px;
    padding-left: 15px;
    border-bottom: 1px solid #ededed;
  }

  .amap-detail .order-list .order-detail {
    overflow: hidden;
    flex: 1;
  }

  .amap-detail .order-list .title {
    font-size: 13px;
    color: #3ccba6;
  }

  .amap-detail .select-active {
    background: #F5F7F9
  }

  .amap-detail .amap-person-body {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
  }

  .amap-detail .mymap {
    width: 100%;
    height: 522px;
    flex: 1;
  }

  .amap-detail .page-body {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-top: 10px;
    padding-bottom: 10px;
    background: #fff;
    border-top: 1px solid #ededed;
    width: 100%;
    bottom: 0;
  }

  .amap-detail .amapTips {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    background-color: #fff;
    height: 35px;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 3px;
    border: 1px solid #ccc;
    line-height: 30px;
    z-index: 999;
  }

  .amap-detail .smy__text-overflow-one-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
<style media="screen">
  .amap-list-body::-webkit-scrollbar{
    display:none;
  }
  .assign-modal .ivu-modal .ivu-modal-content .ivu-modal-body {
    padding: 0;
  }
  .markIcon-background {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 46px;
    height: 46px;
  }
  .markIcon-background .tmpl-img {
    position: relative;
    top: -3px;
    width: 70%;
    height: 70%;
    border-radius: 50%;
  }

  .markIcon-background .service-img {
    position: relative;
    top: -2px;
    width: 75%;
    height: 75%;
    border-radius: 50%;
  }

  .amap-info-content {
    border-radius: 4px;
  }

  .amap-info-outer, .amap-menu-outer {
    box-shadow: 1px 1px 12px rgba(0, 0, 0, .2);
  }

  .amap-info-outer:hover, .amap-menu-outer:hover {
    box-shadow: 1px 1px 12px rgba(0, 0, 0, .4);
  }

  .amap-assign-top {
    border-bottom: 1px solid #ededed;
  }

  .amap-assign-title {
    font-size: 16px;
    color: #3ccba6;
    line-height: 24px;
  }

  .amap-assign-order {
    line-height: 24px;
  }

  .amap-assign-time {
    font-size: 13px;
    line-height: 18px;
    padding-bottom: 6px;
    margin-bottom: 5px;
    color: #999;
    border-bottom: 1px solid #ededed;
  }

  .amap-assign-label {
    color: #999;
    font-size: 13px;
    line-height: 24px;
  }

  .assign-skill-tag {
    display: inline-block;
    line-height: 14px;
    padding: 3px 5px;
    color: #fff;
    border-radius: 20px;
    font-size: 10px;
    margin-right: 5px;
    margin-bottom: 2px;
  }
</style>
