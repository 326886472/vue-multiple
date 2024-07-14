<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 13:45:34
 * @LastEditTime: 2024-02-04 15:28:15
 * @LastEditors: wenshuang
 * @Description 标签
 * @FilePath: /mobile-server/src/components/tag/index.vue
-->
<template>
  <span class="custom-tag" :class="type">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'primary',
  },
})
</script>

<style lang="scss" scoped>
.custom-tag {
  height: 16.5px;
  border-radius: 8.5px;
  border: 1px solid #B8B8B8;
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #B8B8B8;
  line-height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;

  &.primary {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}
</style>
