<template>
  <div id="app" v-cloak>
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #F8F8F9;
  /* margin-top: 60px; */
}

html {
  min-width: 1200px;
}

html,body,#app{
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0px;
}

[v-cloak]{
  display: 'none';
}

/* 旋转动画 */
.loading-load-c {
  animation:myfirst 1s linear infinite;
}

@keyframes myfirst
{
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
