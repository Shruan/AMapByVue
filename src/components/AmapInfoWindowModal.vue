<template lang="html">
  <!-- 地图派单 地图弹窗 -->
  <div class="">
    <Modal
      transfer
      scrollable
      title="选择地址"
      v-model="isShowModal"
      :width="960"
      :styles="{width: '80%', height:' 80%'}"
      :loading="madalLoading"
      @on-ok="saveAddress">
      <div class="AMap">
        <div class="amapTips">当前还有{{orderCount}}个工单未指派工单</div>
        <div id="assignContainer" class="mymap" />
      </div>
    </Modal>
  </div>
</template>

<script>
import AMap from 'AMap'

let map = {}
let marker = {}

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    centerPositon: {
      type: Array
    },
    data: {
      type: Object,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      orderList: [],
      isShowModal: false,
      madalLoading: true,
      center: [118.180987, 24.486432],
      cityList: [],
      selectCity: '',
      isClickMap: false,
      routerLink: '',
      startInterval: '',
      orderCount: 0
    }
  },
  watch: {
    isShow (val) {
      this.isShowModal = val
      if (val) {
        this.routerLink = ''
        clearInterval(this.startInterval)
        this.orderList = this.data.data
        this.orderCount = this.data.count
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
      this.$emit('is-show-on-change', val)
      if (!val) {
        if (this.startInterval) clearInterval(this.startInterval)
      }
    },
    'routerLink': {
      handler (val, oldValue) {
        if (this.isShowModal && val && val !== oldValue) {
          this.$emit('on-ok', val)
          this.isShowModal = false
          this.routerLink = window.routerLink = ''
          // this.$router.push({name: 'AssignOrderDetail', params: { orderId: val }})
          clearInterval(this.startInterval)
        }
      },
      deep: true
    }
  },
  methods: {
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
    saveAddress () {
      this.isShowModal = false
    },
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

      this.orderList.forEach((val, index) => {
        if (val.longitude && val.latitude) {
          marker = new AMap.Marker({
            map: map,
            icon: `https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png`,
            position: [val.longitude, val.latitude],
            offset: new AMap.Pixel(-12, -36)
          })

          AMap.event.addListener(marker, 'click', () => {
            this.openInfo(val, marker)
          })
        }
      })
    },
    // 显示信息窗体
    openInfo (val, vMarker) {
      if (this.startInterval) clearInterval(this.startInterval)
      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
      let title = val.title
      let content = []
      content.push('<span style="color:#f54849">预约时间：' + val.estimateArriveTime + '</span>')
      content.push('联系人：' + val.customName)
      content.push('电话：' + val.phone)
      content.push('客户企业：' + val.custom_enterprise_name)
      content.push('地址：' + val.gpsAddr + '(' + val.customDetailAddr + ')')
      content.push(`<Button style="margin-top:10px; float:right"
        class="ivu-btn ivu-btn-primary infoWindowButton"
        onclick="window.routerLink = '${val.orderId}'"
        orderid="${val.orderId}">指派员工</Button>`)
      content.push('<div style="clear:both"></div>')
      infoWindow.setContent(this.createInfoWindow(title, content.join('<br/>')))
      infoWindow.open(map, [val.longitude, val.latitude])

      this.startInterval = setInterval(() => {
        this.routerLink = window.routerLink
        console.log(this.routerLink)
      }, 1500)
    },
    // 构建自定义信息窗体
    createInfoWindow (title, content) {
      var info = document.createElement('div')
      info.className = 'info'

      // 可以通过下面的方式修改自定义窗体的宽高
      // info.style.width = '400px'
      // 定义顶部标题
      let top = document.createElement('div')
      let titleD = document.createElement('div')
      let closeX = document.createElement('img')
      top.className = 'info-top'
      titleD.innerHTML = title
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
    }
  },
  created () {
    this.isShowModal = this.isShow
    this.routerLink = window.routerLink = ''
  },
  mounted () {
  }
}
</script>

<style scoped>

  .AMap {
    position: relative;
    height: 522px;
  }
  .mymap {
    width: 100%;
    height: 522px;
  }
  .amapTips {
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
</style>
