<template>
  <div class="AMap">
    <div class="AMap-left">
      {{nowAddress}}
    </div>
    <div id="container" class="mymap">

    </div>

  </div>
</template>

<script>
import AMap from 'AMap'
export default {
  name: 'AMap',
  data () {
    return {
      center: [118.180987, 24.486432],
      nowAddress: ''
    }
  },
  mounted () {
    this.loadmap()   // 加载地图和相关组件
  },
  created () {
    // var map = new AMap.Map('container', {
    //   resizeEnable: true,
    //   zoom: 11,
    //   center: [116.397428, 39.90923],
    //   height: 300
    // })
  },
  methods: {
    loadmap () {
      let _this = this
      const map = new AMap.Map('container', {
        resizeEnable: true,
        center: this.center,
        zoom: 13
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      let marker = new AMap.Marker({
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: this.center
        // title: provinces[i].name
      })
      marker.setMap(map)
      map.on('click', (e) => {
        console.log('您在[ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ]的位置点击了地图！')
        this.center = [e.lnglat.getLng(), e.lnglat.getLat()]
        marker.setPosition(this.center)
        map.panTo(this.center)
        // map.setFitView()
        _this.getNowAddress()
      })
    },
    getNowAddress () {
      let geocoder = {}
      AMap.service('AMap.Geocoder', () => {
        // 实例化Geocoder
        geocoder = new AMap.Geocoder({
          city: '010' // 城市，默认：“全国”
        })
      })
      geocoder.getAddress(this.center, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result.regeocode.formattedAddress)
          this.nowAddress = result.regeocode.formattedAddress
           // 获得了有效的地址信息:
           // 即，result.regeocode.formattedAddress
        } else {
           // 获取地址失败
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mymap {
    width: 500px;
    height: 500px;
  }
  .AMap-left {
    width: 200px;
  }
  .AMap {
    display: flex;
  }
</style>
