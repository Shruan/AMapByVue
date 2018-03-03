<template lang="html">
  <!-- 首页 -->
  <div class="smy__card-full-box">
    <Card :bordered="false" class="smy__card-full">
      <br>
      <br>
      <Button
        type="primary"
        class="search-button"
        @click="isShowMapModal = true"
      >地图信息窗体</Button>
      <br>
      <br>
      <div class="border">{{ JSON.stringify(getMessage)}}</div>
    </Card>
    <!-- 信息窗体弹出框 -->
    <AMapInfoWindowModal
      :data="infoWindowData"
      :isShow="isShowMapModal"
      @is-show-on-change="isShowMapModal = $event"
      @on-ok="getMessage = $event"
    />
  </div>
</template>

<script>
import InfoWindowData from '@/assets/AMapInfoWindow'
import AMapInfoWindowModal from '@/components/AMapInfoWindowModal'

export default {
  components: {
    AMapInfoWindowModal
  },
  data () {
    return {
      isShowMapModal: false,
      getMessage: {},
      infoWindowData: InfoWindowData
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ededed;
  height: 200px;
  width: 300px;
  padding: 20px;
}
</style>
