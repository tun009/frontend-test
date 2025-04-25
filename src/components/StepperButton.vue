<script setup lang="ts">
import { computed } from "vue";
import type { StepperButtonProps } from "@/types/types";
import Tooltip from "./Tooltip.vue";

const props = defineProps<StepperButtonProps>();

const icon = computed(() => (props.type === "increase" ? "+" : "-"));
const buttonClass = computed(() => [
  "w-8 h-full flex items-center justify-center transition-colors text-lg font-medium",
  "text-white hover:bg-neutral-700",
  props.type === "increase" ? "rounded-r" : "rounded-l",
  props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
]);

const tooltipMessage = computed(() =>
  props.type === "increase"
    ? "Value must be smaller than 100"
    : "Value must be greater than 0"
);
</script>

<template>
  <Tooltip v-if="disabled" :title="tooltipMessage">
    <button :class="buttonClass" :disabled="disabled">
      {{ icon }}
    </button>
  </Tooltip>
  <button v-else :class="buttonClass" :disabled="disabled">
    {{ icon }}
  </button>
</template>
