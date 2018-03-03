<template lang="html">
  <div class="">
    <Modal
      transfer
      scrollable
      title="选择地址"
      v-model="isShowModal"
      :width="920"
      :loading="madalLoading"
      @on-ok="saveAddress">
      <div class="AMap">
        <div class="AMap-left">
          <div class="Amap-search">
            <Select
              transfer
              clearable
              filterable
              placeholder="请选择目标城市"
              v-model="selectCity"
              style="width: 260px; margin-bottom: 20px;"
              @on-change="selectCityChange"
            >
              <Option
                v-for="item in cityList"
                :key="item.adcode"
                :value="item.adcode"
              >{{item.name}}</Option>
            </Select>
            <Input
              id="tipinput"
              ref="tipinput"
              v-model="searchKey"
              placeholder="请输入搜索地址"
              style="width: 260px">
              <Button slot="append" icon="ios-search" @click="seachAddress"></Button>
            </Input>
          </div>
          <div class="search-result">
            <ul>
              <li v-if="isClickMap"  class="addressList">{{nowAddress}}</li>
              <li
                :class="{'addressList': true, 'address-active': index === nowClickIndex}"
                v-for="(item, index) in searchResult"
                @click="clickAddress(item, index)"
              >
                <p class="name">{{item.name}}</p>
                <p class="address">{{item.address}}</p>
              </li>
            </ul>
          </div>
          <div :id="panelId" class="panel" />
        </div>
        <div :id="containerId" class="mymap" />
      </div>
    </Modal>
  </div>
</template>

<script>
import AMap from 'AMap'

let map = {}
let marker = {}
let placeSearch = {}
let geocoder = {}

export default {
  props: {
    containerId: {
      type: String,
      required: true
    },
    isShowMapModal: {
      type: Boolean,
      required: true
    },
    centerPositon: {
      type: Array,
      default: [118.180987, 24.486432]
    },
    panelId: {
      type: String,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      nowClickIndex: 0,
      isShowModal: false,
      madalLoading: true,
      center: [118.180987, 24.486432],
      nowAddress: '',
      searchKey: '',
      searchResult: [],
      cityList: [],
      selectCity: '',
      isClickMap: false
    }
  },
  watch: {
    centerPositon (val, oldValue) {
      if (val[0] && val[1]) {
        if (val[0] !== 0 && val[1] !== 0 && val[0] !== this.center[0] && val[1] !== this.center[1]) {
          this.center[0] = val[0]
          this.center[1] = val[1]
          this.loadmap()
          marker.setPosition(this.center)
          map.panTo(this.center)
          this.getNowAddress()
        }
      }
    },
    isShowMapModal (val) {
      if (val) {
        if (!this.centerPositon) {
          this.getCenterPosition()
        } else {
          if (!this.centerPositon[0] || !this.centerPositon[1] || !this.centerPositon[0] === 0 || !this.centerPositon[1] === 0) {
            this.getCenterPosition()
          }
        }
        this.loadmap()   // 加载地图和相关组件
      }
      this.isShowModal = val
    },
    isShowModal (val) {
      this.$emit('is-show-on-change', val)
    }
  },
  methods: {
    getCenterPosition () {
      let url = 'http://restapi.amap.com/v3/ip?ip=&output=xml&key=43202ac9c4bbbe5ef5d65478de3617be'
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
        this.getNowAddress()
      })
    },
    saveAddress () {
      this.madalLoading = false
      setTimeout(() => { this.madalLoading = true })
      let data = {}
      data.address = this.nowAddress
      data.position = this.center
      if (data.address && data.position.length === 2) {
        this.$emit('select-address', data)
        this.isShowModal = false
      } else {
        this.$Message.warning('请选择地址后再试')
      }
    },
    loadmap () {
      map = new AMap.Map(this.containerId, {
        resizeEnable: true,
        center: this.center,
        zoom: 13
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Marker', 'AMap.Geocoder', 'AMap.InfoWindow'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      // let tipinput = new AMap.Autocomplete({
      //   input: 'tipinput'
      // })
      marker = new AMap.Marker({
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: this.center
        // title: provinces[i].name
      })
      AMap.service('AMap.Geocoder', () => {
        // 实例化Geocoder
        geocoder = new AMap.Geocoder({
          city: '020' // 城市，默认：“全国”
        })
      })
      marker.setMap(map)
      map.on('click', (e) => {
        this.isClickMap = true
        this.searchResult = []
        this.center = [e.lnglat.getLng(), e.lnglat.getLat()]
        marker.setPosition(this.center)
        map.panTo(this.center)
        // map.setFitView()
        this.getNowAddress()
      })
      // 点击marker事件
      AMap.event.addListener(marker, 'click', () => {
        this.getNowAddress()
      })
      setTimeout(() => {
        placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          // pageSize: 5,
          // pageIndex: 1,
          city: '010' // 城市
          // map: map
          // panel: 'panel'
        })
        // 监听点击搜索结果标签事件
        AMap.event.addListener(placeSearch, 'markerClick', (e) => {
          this.center = [e.data.location.lng, e.data.location.lat]
          marker.setPosition(this.center)
          map.panTo(this.center)
          this.getNowAddress()
        })
      }, 1000)
      // 输入提示
    },
    // 根据地址获取地理编码
    getNowCode (address) {
      geocoder.getLocation('address', function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
        }
      })
    },
    // 获取中心点的详细地址
    getNowAddress () {
      // 地理编码返回详细地址
      geocoder.getAddress(this.center, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
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
      this.isClickMap = false
      this.searchKey = this.$refs.tipinput.value
      AMap.service(['AMap.PlaceSearch'], () => {
        // 关键字查询
        placeSearch.search(this.searchKey, (status, result) => {
          if (result.info === 'OK' || result.info) {
            this.nowClickIndex = 0
            let data = result.poiList.pois[0].location
            this.searchResult = result.poiList.pois
            this.center = [data.lng, data.lat]
            marker.setPosition(this.center)
            map.panTo(this.center)
            this.getNowAddress()
          } else {
            this.nowAddress = '未搜索到数据'
            this.searchResult = []
          }
        })
      })
    },
    // 显示信息窗体
    openInfo (address) {
      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
      infoWindow.setContent(address)
      infoWindow.open(map, this.center)
    },
    clickAddress (val, index) {
      this.isClickMap = false
      if (val.location) {
        this.nowClickIndex = index
        this.center = [val.location.lng, val.location.lat]
        marker.setPosition(this.center)
        map.panTo(this.center)
        this.getNowAddress()
      }
    },
    selectCityChange (val) {
      if (!val) {
        this.selectCity = '010'
      }
      placeSearch.setCity(this.selectCity)
    }
  },
  created () {
    this.isShowModal = this.isShowMapModal
    this.$http.get('/area/list?pid=1').then(res => {
      this.cityList = res.data
    })
  },
  mounted () {
  }
}
</script>

<style scoped>
  .search-result {
    width: 300px;
    height: 400px;;
    font-size: 14px;
    color: #80848F;
  }
  .search-result ul {
    overflow-x: hidden;
    height: 400px;
    box-sizing: border-box;
  }
  .search-result ul li {
    padding: 10px;
    line-height: 30px;
    border-bottom: 1px solid #ededed;
    cursor: pointer;
  }

  .Amap-search {
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #ededed;
  }

  .mymap {
    width: 620px;
    height: 450px;
  }

  .AMap-left {
    align-self: stretch;
  }

  .AMap {
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .addressList {
    min-height: 80px;
  }

  .addressList .name {
    font-size: 14px;
  }

  .addressList  .address {
    font-size: 12px;
  }

  .address-active {
    color: #3ccba6;
  }

  .panel {
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    width: 280px;
 }
</style>
