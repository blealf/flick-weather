<template>
  <div class="card-comp" :style="{ padding: padding ? padding : '30px'}">
    <slot />
  </div>
</template>

<script setup>
const padding = null;
// const props = defineProps[{
//   padding: type
// }]
</script>

<style lang="scss" scoped>
.card-comp {
  border-radius: 20px;
  background: var(--card-bg);
  box-shadow: var(--shadow);
  width: 100%;
  padding: 30px 30px !important;
  @include xs {
    padding: 30px 15px !important;
  }
}
</style>
