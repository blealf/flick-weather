<template>
  <div class="card" :style="{ padding: padding ? padding : '30px'}">
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
.card {
  border-radius: 20px;
  background: var(--card-bg);
  width: 100%;
}
</style>
