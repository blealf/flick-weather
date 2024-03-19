<template>
  <div class="air-skeleton">
    <div v-for="item in [1,2,3,4]" :key="item" class="air-skeleton__item">
      <div class="icon"><div class="loading-skeleton"></div></div>
      <div>
        <div class="name"><p class="loading-skeleton"></p></div>
        <div class="value"><p class="loading-skeleton"></p></div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.air-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10px;

  &__item {
    display: flex;
    justify-content: start;
    align-items: flex-start;
    text-align: left;
    margin-top: 15px;

    .name {
      height: 15px;
      width: 50px;
      background: var(--main-bg);
    }

    .value {
      margin-top: 10px;
      height: 35px;
      width: 70px;
      background: var(--main-bg);
    }

    .icon {
      height: 60px;
      width: 30px;
      background: var(--main-bg);
      margin-right: 40px;
    }
  }
}
</style>
