<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="tooltip-container">
    <slot></slot>
    <div class="tooltip-content">
      {{ title }}
    </div>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
  height: 100%;
}

.tooltip-content {
  visibility: hidden;
  width: auto;
  min-width: 120px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 6px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.tooltip-content::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip-container:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}
</style>
