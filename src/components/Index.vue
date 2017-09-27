<template>
  <div class="AMap">
    <div class="AMap-left">
      <div class="">
        <input id="tipinput" ref="tipinput" v-model="searchKey" :value="searchKey"/>
        <button type="button" name="button" @click="seachAddress">搜索</button>
      </div>
      <div class="">
        {{nowAddress}}
      </div>
      <div id="panel"></div>
    </div>
    <div id="container" class="mymap">

    </div>

  </div>
</template>

<script>
import AMap from 'AMap'
let map = {}
let marker = {}
export default {
  name: 'AMap',
  data () {
    return {
      center: [118.180987, 24.486432],
      nowAddress: '',
      searchKey: ''
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
      map = new AMap.Map('container', {
        resizeEnable: true,
        center: this.center,
        zoom: 13
      })
      let _this = this
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      let tipinput = new AMap.Autocomplete({
        input: 'tipinput'
      })
      console.log('tipinput')
      console.log(tipinput)
      marker = new AMap.Marker({
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
      // 输入提示
    },
    // 获取中心点的详细地址
    getNowAddress () {
      let geocoder = {}
      AMap.service('AMap.Geocoder', () => {
        // 实例化Geocoder
        geocoder = new AMap.Geocoder({
          city: '010' // 城市，默认：“全国”
        })
      })
      // 地理编码返回详细地址
      geocoder.getAddress(this.center, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result.regeocode.formattedAddress)
          this.nowAddress = result.regeocode.formattedAddress
          this.openInfo(this.nowAddress)
           // 获得了有效的地址信息:
           // 即，result.regeocode.formattedAddress
        } else {
          // 获取地址失败

        }
      })
    },
    // 搜索详细地址
    seachAddress () {
      let _this = this
      this.searchKey = this.$refs.tipinput.value
      AMap.service(['AMap.PlaceSearch'], function () {
        let placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          // pageSize: 5,
          // pageIndex: 1,
          city: '010', // 城市
          map: map
          // panel: 'panel'
        })
        // 关键字查询
        placeSearch.search(_this.searchKey, (status, result) => {
          console.log(result)
          if (result.info === 'OK') {
            let data = result.poiList.pois[0].location
            _this.center = [data.lng, data.lat]
            marker.setPosition(_this.center)
            map.panTo(_this.center)
            _this.getNowAddress()
            console.log(data)
            console.log(result)
          } else {
            _this.nowAddress = '未搜索到数据'
          }
        })
      })
    },
    // 显示信息窗体
    openInfo (address) {
      // let info = []
      // info.push('地址')
      // info.push(address)
      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
      infoWindow.setContent(address)
      infoWindow.open(map, this.center)
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
    width: 300px;
  }
  .AMap {
    display: flex;
  }
  #panel {
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    width: 280px;
}
</style>
