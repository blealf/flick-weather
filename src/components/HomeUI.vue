<template>
  <div class="home">
    <div class="home__grid">
      <CurrentWeather class="current" />
      <HourlyForecast class="hourly" />
      <DetailedHourlyForecast class="seven" />
      <AirConditions class="air"/>
    </div>
  </div>
</template>

<script setup>
import CurrentWeather from './CurrentWeather.vue';
import HourlyForecast from './HourlyForecast.vue';
import AirConditions from './AirConditions.vue';
import DetailedHourlyForecast from './DetailedHourlyForecast.vue';

</script>

<style lang="scss" scoped>
.home {
  @include md {
    width: calc(100vw - 40px);
    margin: 0 auto;
    padding-bottom: 60px;
  }
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;

    .current {
      grid-column: 1/2;
      grid-row: 1/2;
    }
    .hourly {
      grid-column: 1/2;
      grid-row: 2/3;
    }
    .seven {
      grid-column: 2/3;
      grid-row: 1/4;
    }
    .air {
      grid-column: 1/2;
      grid-row: 3/4;
    }
    @include lg {
      grid-template-columns: 1fr;
      .current {
        grid-column: 1/2;
        grid-row: 1/2;
      }
      .hourly {
        grid-column: 1/2;
        grid-row: 2/3;
      }
      .seven {
        grid-column: 1/2;
        grid-row: 3/4;
      }
      .air {
        grid-column: 1/2;
        grid-row: 4/5;
      }
    }
  }
}
</style>
