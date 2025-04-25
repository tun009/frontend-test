<script setup lang="ts">
import type { NumberInputProps, NumberInputEmits } from "@/types/types";
import { useNumberInput } from "@/composables/useNumberInput";

const props = defineProps<NumberInputProps>();
const emit = defineEmits<NumberInputEmits>();

const {
  inputValue,
  handleInput,
  handleFocus,
  handleBlur,
  handleMouseEnter,
  handleMouseLeave
} = useNumberInput(props, emit);
</script>

<template>
  <div
    class="number-input relative flex-1 h-full"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <input
      type="text"
      :value="inputValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      class="w-full h-full bg-transparent text-white px-3 py-0 text-center text-sm focus:outline-none"
    />
  </div>
</template>
