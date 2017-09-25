<template>
  <div class="AMap">
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
      const map = new AMap.Map('container', {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 11
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
      console.log(map)
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
</style>
