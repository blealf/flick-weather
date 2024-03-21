<template>
  <div class="no-city">
    <h2>Enter a city:</h2>
    <slot />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.no-city {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  height: 50vh;
  text-align: center;
}
</style>
