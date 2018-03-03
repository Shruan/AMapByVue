<template lang="html">
  <!-- 首页五模块拼接入口 -->
  <div class="smy__box">
    <div class="smy__left">
      <!-- <FirstMenu/> -->
      <SecondMenu />
    </div>
    <div class="smy__right">
      <!-- <HeadNav/> -->
      <!-- <HeadTags/> -->
      <div class="smy__content">
        <transition :name="transitionName">
          <router-view class="router"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
// import FirstMenu from './FirstMenu'
import SecondMenu from './Skeleton/SecondMenu'
// import HeadNav from './HeadNav'
// import HeadTags from './HeadTags'
// import { mapState, mapMutations, mapActions } from 'vuex'
// import Error404 from './Error404'
// import Error403 from './Error403'
// import Login from './Login'

export default {
  components: {
    // FirstMenu,
    SecondMenu
    // HeadNav,
    // HeadTags,
    // Error404,
    // Error403,
    // Login,
  },
  data () {
    return {
      transitionName: '',
      // 更新说明
      updateInfo: {},
      updateEditModal: false
    }
  },
  computed: {
    // ...mapState('menu', [
    //   'tag',
    //   'thirdMenuList',
    //   'allOrderKeyword'
    // ])
  },
  // watch: {
  //   '$route' (to, from) {
  //     const toDepth = to.path.split('/').length
  //     const fromDepth = from.path.split('/').length
  //     this.transitionName = toDepth < fromDepth ? 'slider-right' : 'slider-left'
  //   },
  //   // 监听选中的标签，进行页面跳转
  //   tag (val) {
  //     if (val === '-1') {
  //       this.$router.push({name: 'Index'})
  //     } else if (val === '-2' || val === -2) {
  //       this.$router.push({ name: 'Help' })
  //     } else {
  //       let tagName = val.split('-')
  //       this.thirdMenuList[tagName[0]].forEach(val => {
  //         if (val.id === Number(tagName[1])) {
  //           if (val.routerName === 'AllOrder') {
  //             if (this.allOrderKeyword) {
  //               this.$router.push({ name: 'AllOrder', query: { keyword: this.allOrderKeyword } })
  //               this._allOrderKeyword('')
  //             } else {
  //               let name = val.routerName[0].toLowerCase() + val.routerName.substring(1)
  //               if (window.location.href.indexOf(name) === -1) {
  //                 this.$router.push({name: val.routerName})
  //               }
  //             }
  //           } else {
  //             let name = val.routerName[0].toLowerCase() + val.routerName.substring(1)
  //             if (window.location.href.indexOf(name) === -1) {
  //               this.$router.push({name: val.routerName})
  //             }
  //           }
  //         }
  //       })
  //     }
  //   }
  // },
  methods: {
    // ...mapMutations('menu', [
    //   '_orderMenuList',
    //   '_allOrderKeyword'
    // ]),
    // ...mapActions('menu', [
    //   '_FirstMenuList',
    //   '_SecondMenuList',
    //   '_ThirdMenuList'
    // ]),
    // ...mapMutations('user', [
    //   '_user' // 同步筛选列
    // ]),
    // ...mapActions('user', [
    //   '_RoleList'
    // ]),
    getUser () {
      // this.$http.get('/v2/sessionUser/info').then(res => {
      //   this._user(res.data)
      //   this._RoleList(res.data.allRoles)
      // })
    }
  },
  created () {
    // this.$http.get('product/version/1').then(res => {
    //   if (res.success) {
    //     let info = res.data
    //     if (info) {
    //       this.updateInfo = info
    //       this.updateEditModal = true
    //     }
    //   }
    // })
    // this.getUser()
  },
  beforeRouteEnter (to, from, next) {
    // axios.get('/v2/menu/list').then(res => {
    //   if (res.success) {
    //     let menuList = res.data
    //     next(vm => {
    //       // vm._FirstMenuList(menuList)
    //       // vm._SecondMenuList(menuList.secondList)
    //       // vm._ThirdMenuList(menuList.thirdList)
    //     })
    //   }
    // })
    next()
  }
}
</script>
<style scoped>
  .smy__text-overflow-one-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .router {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all .5s ease;
    -webkit-transition: all .5s ease;
  }

  .slider-parent {
    position: relative;
  }

  .slider{
    transition: all .5s ease;
    -webkit-transition: all .5s ease;
    position: absolute;
  }

  .slider-enter-left-active, .slider-left-leave-active {
    transition: all .3s;
    -webkit-transition: all .3s;
  }
  .slider-left-enter, .slider-left-leave-active {
    opacity: 0;
  }
  .slider-left-enter {
    transform: translateX(20px);
  }
  .slider-left-leave-active {
    transform: translateX(-20px);
  }

  .slider-enter-right-active, .slider-right-leave-active {
    transition: all .3s;
    -webkit-transition: all .3s;
  }
  .slider-right-enter, .slider-right-leave-active {
    opacity: 0;
  }
  .slider-right-enter {
    transform: translateX(-20px);
  }
  .slider-right-leave-active {
    transform: translateX(20px);
  }

  .smy__box {
    display: flex;
    height: 100%;
  }
  .smy__left {
    display: flex;
    height: 100%;
  }

  .smy__right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .smy__content {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    position: relative;
  }
  .smy__card-full-box {
    padding: 10px;
    height: 100%;
  }
  .smy__card-full {
    margin-bottom: 10px;
    min-height: 100%;
  }
  .extra {
    font-size: 12px;
    color: #80848F;
  }
</style>
