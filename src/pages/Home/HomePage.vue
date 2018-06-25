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
      >地图派单</Button>
      <br>
      <br>
      <div class="border">{{getMessage}}</div>
    </Card>
    <!-- 地图弹窗 -->
    <AMapModal
      :panelId="'createOrderPanel'"
      :containerId="'createOrderContainer'"
      :centerPositon="[]"
      v-model="isShowMapModal"
      @select-address="getMessage = $event"
    />
  </div>
</template>

<script>
import AMapModal from '@/components/AMapModal'

export default {
  components: {
    AMapModal
  },
  data () {
    return {
      isShowMapModal: false,
      getMessage: {}
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
