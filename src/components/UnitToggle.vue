<script setup lang="ts">
import { computed } from "vue";
import type { UnitToggleProps, UnitToggleEmits } from "@/types/types";

const props = defineProps<UnitToggleProps>();
const emit = defineEmits<UnitToggleEmits>();

const units = ["%", "px"] as const;

const selectedUnit = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div
    class="unit-toggle flex rounded overflow-hidden w-full h-full bg-[#212121]"
  >
    <button
      v-for="unit in units"
      :key="unit"
      :class="[
        'flex-1 text-sm font-medium transition-colors h-full cursor-pointer',
        selectedUnit === unit ? 'bg-[#424242] text-white' : 'text-neutral-400',
        unit === '%' ? 'rounded-r' : 'rounded-l',
      ]"
      @click="selectedUnit = unit"
    >
      {{ unit }}
    </button>
  </div>
</template>
