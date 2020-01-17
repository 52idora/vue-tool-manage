<template>
  <div class="logo">
    <router-link :to="{name:'monitor'}">
      <!-- <LogoSvg alt="logo" /> -->
      <img src="@/assets/logo.png" alt />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '资源系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
