<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="flex items-center gap-[8px] h-[36px]">
    <span class="text-neutral-400 text-xs w-[100px]">{{ label }}</span>
    <div class="flex-1 h-[34px] py-0">
      <slot></slot>
    </div>
  </div>
</template>
