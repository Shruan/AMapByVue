<template lang="html">
  <!-- 二级菜单 -->
  <div
    class="smy__second-menu"
    :class="{'smy__second-menu-hide': false}"
    :style="{'z-index': false ? '99' : ''}"
  >
    <div class="logo-text">
      Vue高德地图
    </div>
    <Menu
      ref="secondMenu"
      theme="light"
      style="width: 160px;height: 100%;overflow-x: hidden;"
      @on-select="$router.push({path: $event})">
      <Submenu name="1">
          <template slot="title">
              <Icon type="ios-paper"></Icon>
              内容管理
          </template>
          <MenuItem name="/homePage">首页</MenuItem>
          <MenuItem name="/no_UI_Amap">无UI高德地图</MenuItem>
          <MenuItem name="1-3">举报管理</MenuItem>
      </Submenu>
      <Submenu name="2">
          <template slot="title">
              <Icon type="ios-people"></Icon>
              用户管理
          </template>
          <MenuItem name="2-1">新增用户</MenuItem>
          <MenuItem name="2-2">活跃用户</MenuItem>
      </Submenu>
    </Menu>
    <!-- <Menu
      ref="secondMenu"
      theme="light"
      style="width: 160px;height: 100%;overflow-x: hidden;"
      @on-select="onSelect"
      :open-names="openNames"
      :active-name="tag"
    >
        <Submenu
          :name="menu.id + ''"
          v-for="(menu, index) in secondMenuList[firstMenu]"
          :key="menu.name"
        >
          <template slot="title">
            <span class="title-text">
              <Icon
                :type="menu.icon"
                :size="menu.size ? menu.size : '16'"
                style="vertical-align: baseline;"
              ></Icon>
              {{menu.name}}
            </span>
          </template>
          <MenuItem
            :name="menu.id + '-' + item.id"
            v-for="(item, i) in thirdMenuList[menu.id]"
            :key="item.name"
          >
          <span style="color:#80848F; font-size: 13px; margin-left: 5px;">
            {{item.name}}
          </span>
          </MenuItem>
      </Submenu>
    </Menu> -->
  </div>
</template>

<script>
// import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },
  // computed: {
  //   ...mapState('menu', [
  //     'isVisibleSecondMenu',
  //     'firstMenu',
  //     'firstMenuList',
  //     'secondMenuList',
  //     'thirdMenuList',
  //     'tag',
  //     'menuIsLoadingOver'
  //   ]),
  //   // 获取应展开的二级菜单
  //   openNames () {
  //     if (this.menuIsLoadingOver) {
  //       let openNames = []
  //       this.secondMenuList[this.firstMenu].forEach(val => {
  //         openNames.push(val.id + '')
  //       })
  //       return openNames
  //     }
  //   }
  // },
  // watch: {
  //   // 刷新二级菜单的展开状态
  //   openNames () {
  //     if (this.menuIsLoadingOver) {
  //       this.$nextTick(() => {
  //         let menu = this.$refs.secondMenu
  //         menu.updateOpened()
  //         menu.updateActiveName()
  //       })
  //     }
  //   },
  //   tag () {
  //     if (this.menuIsLoadingOver) {
  //       this.$nextTick(() => {
  //         let menu = this.$refs.secondMenu
  //         menu.updateOpened()
  //         menu.updateActiveName()
  //       })
  //     }
  //   },
  //   menuIsLoadingOver (val) {
  //     if (val) this.$Spin.hide()
  //   }
  // },
  // methods: {
  //   ...mapMutations('menu', [
  //     '_secondMenu'
  //   ]),
  //   ...mapActions('menu', [
  //     '_AddTag'
  //   ]),
  //   onSelect (name) {
  //     this._AddTag(name)
  //   }
  // },
  created () {
  }
}
</script>

<style scoped>
/* // 不显示滚轮 */
::-webkit-scrollbar{
  display:none;
}

.smy__second-menu{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  box-shadow: 2px 0 6px #EDEDED;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.title-text {
  color: #80848F;
}

.logo-text {
  flex-shrink: 0;
  display: flex;
  height: 60px;
  width: 160px;
  color: #495060;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  background: #FFF;
  box-shadow: 0 2px 6px #EDEDED;
  z-index: 999;
}
.smy__second-menu-hide{
  width: 0px;
  opacity: 0;
}
</style>
