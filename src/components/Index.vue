<template>
  <div class="AMap">
    <div class="AMap-left">
      <div>
        <input id="tipinput" ref="tipinput" v-model="searchKey" :value="searchKey"/>
        <button type="button" name="button" @click="seachAddress">搜索</button>
      </div>
      <div style="margin-top:10px;height:50px;">
        {{nowAddress}}
      </div>
      <div>
        <ul style="height: 300px;
        overflow-x: hidden;margin-top:50px">
          <h2 v-if="searchResult.length">搜索结果</h2>
          <li v-for="item in searchResult"  @click="clickAddress(item)" class="addressList">{{item.name}}</li>
        </ul>
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
let placeSearch = {}
let geocoder = {}
export default {
  name: 'AMap',
  data () {
    return {
      center: [118.180987, 24.486432],
      nowAddress: '',
      searchKey: '',
      searchResult: []
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
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Marker', 'AMap.Geocoder', 'AMap.InfoWindow'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      let tipinput = new AMap.Autocomplete({
        input: 'tipinput'
      })
      // console.log('tipinput')
      console.log(tipinput)
      marker = new AMap.Marker({
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: this.center
        // title: provinces[i].name
      })
      AMap.service('AMap.Geocoder', () => {
        // 实例化Geocoder
        geocoder = new AMap.Geocoder({
          city: '010' // 城市，默认：“全国”
        })
      })
      placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        // pageSize: 5,
        // pageIndex: 1,
        city: '010' // 城市
        // map: map
        // panel: 'panel'
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
      // 点击marker事件
      AMap.event.addListener(marker, 'click', () => {
        _this.getNowAddress()
      })
      // 监听点击搜索结果标签事件
      AMap.event.addListener(placeSearch, 'markerClick', (e) => {
        console.log(e)
        this.center = [e.data.location.lng, e.data.location.lat]
        marker.setPosition(this.center)
        map.panTo(this.center)
        _this.getNowAddress()
      })
      // 输入提示
    },
    // 根据地址获取地理编码
    getNowCode (address) {
      geocoder.getLocation('address', function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result)
        }
      })
    },
    // 获取中心点的详细地址
    getNowAddress () {
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
      if (_this.searchKey === '') {
        _this.searchResult = ''
        return false
      }
      AMap.service(['AMap.PlaceSearch'], function () {
        // 关键字查询
        placeSearch.search(_this.searchKey, (status, result) => {
          console.log(result)
          if (result.info === 'OK') {
            let data = result.poiList.pois[0].location
            _this.searchResult = result.poiList.pois
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
    },
    clickAddress (index) {
      console.log(index)
      this.center = [index.location.lng, index.location.lat]
      console.log(this.center)
      marker.setPosition(this.center)
      map.panTo(this.center)
      this.getNowAddress()
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
    justify-content: center;
    align-items: center;
  }
  .addressList {
    min-height: 50px;
  }
  #panel {
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    width: 280px;
 }

</style>
