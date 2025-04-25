<script setup lang="ts">
import UnitToggle from "./components/UnitToggle.vue";
import NumberInput from "./components/NumberInput.vue";
import StepperButton from "./components/StepperButton.vue";
import FormRow from "./components/FormRow.vue";
import { useUnitStepper } from "./composables/useUnitStepper";
import { ref, computed } from "vue";

const {
  currentUnit,
  currentValue,
  isAtMin,
  isAtMax,
  updateValue,
  handleUnitChange,
} = useUnitStepper();

const isInputFocused = ref(false);
const isInputHovering = ref(false);

const valueContainerClass = computed(() => {
  return [
    "flex items-center h-full rounded-[5px] transition-all duration-200",
    isInputFocused.value
      ? "bg-[#212121] ring-1 ring-blue-500"
      : isInputHovering.value
      ? "bg-[#3B3B3B]"
      : "bg-[#212121]",
  ];
});

const handleFocusChange = (isFocused: boolean) => {
  isInputFocused.value = isFocused;
};

const handleHoverChange = (isHovering: boolean) => {
  isInputHovering.value = isHovering;
};
</script>

<template>
  <div
    class="w-screen h-screen bg-[#1c1c1c] flex items-center justify-center text-neutral-100"
  >
    <div class="w-[280px] bg-[#111111] p-[16px] rounded-lg">
      <div class="flex flex-col gap-[16px]">
        <FormRow label="Unit">
          <UnitToggle
            v-model="currentUnit"
            @update:modelValue="handleUnitChange"
          />
        </FormRow>

        <FormRow label="Value">
          <div :class="valueContainerClass">
            <StepperButton
              type="decrease"
              :disabled="isAtMin"
              @click="updateValue(false)"
            />
            <NumberInput
              v-model="currentValue"
              :unit="currentUnit"
              @focus-change="handleFocusChange"
              @hover-change="handleHoverChange"
            />
            <StepperButton
              type="increase"
              :disabled="isAtMax"
              @click="updateValue(true)"
            />
          </div>
        </FormRow>
      </div>
    </div>
  </div>
</template>
