<template>
  <div class="side-nav">
    <div class="logo">
      <logo class="logo-svg" @click="router.push('/')" />
    </div>
    <div  class="nav-items">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        :class="{ active: route.path === item.path }
      ">
        <Component :is="item.icon" class="icon-svg" />
        <p>{{ item.name }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const fetchSvg = (icon) => defineAsyncComponent(() => import(`../assets/images/nav/${icon}.svg`));

const logo = fetchSvg('logo');
const navItems = shallowRef([
  {
    name: 'Weather',
    path: '/',
    icon: fetchSvg('weather'),
  },
  {
    name: 'Cities',
    path: '/cities',
    icon: fetchSvg('menu'),
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: fetchSvg('gear'),
  },
]);
</script>

<style lang="scss" scoped>

.side-nav {
  margin: 0 auto;
  margin-top: 1px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  background: var(--card-bg);
  min-height: 95vh;
  border-radius: 20px;
  box-shadow: var(--shadow);
  @include md {
    position: fixed;
    width: calc(100vw - 40px);
    height: 60px;
    min-height: 60px;
    margin: 0;
    flex-direction: row;
    bottom: 0;
    border-radius: 10px;
  }
  .logo {
    margin-top: 30px;
    animation: spin 10s linear infinite;
    .logo-svg {
      cursor: pointer;
      height: 40px;
    }
    @include md {
      margin-top: 0;
      margin-left: 20px;
    }
  }
  @include md {
    margin-top: 12px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
  }
  .nav-items {
    margin-top: 200px;
    margin-bottom: auto;
    @include md {
      margin-top: 10px;
      margin-bottom: 0;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 90%;
    }
    .icon-svg {
      height: 30px;
    }
    a {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 15px;
      p {
        margin-top: 2px;
        margin-bottom: 40px;
        color: var(--alt-color);
      }
      @include md {
        p {
          display: none;
        }
      }
    }
    .active {
      p {
        font-weight: bold;
        color: var(--active-color);
        font-size: 20px;
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
