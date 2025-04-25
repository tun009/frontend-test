import { ref, watch } from "vue";
import type { Unit } from "@/types/types";
import {
  DECIMAL_PLACES,
  MIN_VALUE,
  MAX_PERCENTAGE,
} from "@/constants/constants";

export function useNumberInput(
  props: { modelValue: number; unit: Unit },
  emit: any
) {
  const isFocused = ref(false);
  const isHovering = ref(false);
  const inputValue = ref(formatDisplayNumber(props.modelValue));
  const previousValidValue = ref(props.modelValue);
  const previousUnit = ref(props.unit);

  const processInput = (value: string): string => {
    let processed = value.replace(/,/g, ".");
    processed = processed.replace(/[^\d.\-]/g, "");
    const dotCount = (processed.match(/\./g) || []).length;
    if (dotCount > 1) {
      const parts = processed.split(".");
      processed = parts[0] + "." + parts.slice(1).join("");
    }
    if (processed.includes("-")) {
      if (processed.indexOf("-") !== 0) {
        processed = processed.replace(/-/g, "");
      } else {
        processed = "-" + processed.substring(1).replace(/-/g, "");
      }
    }
    if (
      processed.startsWith("0") &&
      processed.length > 1 &&
      processed[1] !== "."
    ) {
      processed = processed.replace(/^0+/, "");
    }
    if (processed === "-0") {
      processed = "0";
    }

    return processed;
  };

  function formatDisplayNumber(value: number): string {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(DECIMAL_PLACES);
  }

  function updateDisplayFromModel(newValue: number) {
    if (!isFocused.value) {
      inputValue.value = formatDisplayNumber(newValue);
    }
  }

  watch(() => props.modelValue, updateDisplayFromModel);

  watch(
    () => props.unit,
    (newUnit, oldUnit) => {
      if (newUnit === "%" && oldUnit === "px") {
        if (props.modelValue > MAX_PERCENTAGE) {
          inputValue.value = MAX_PERCENTAGE.toString();
        }
      }
      previousUnit.value = newUnit;
    }
  );

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    const cursorPosition = input.selectionStart || 0;
    let filteredValue = value.replace(/[^\d,.\-]/g, "");
    const dotCount = (filteredValue.match(/\./g) || []).length;
    const commaCount = (filteredValue.match(/,/g) || []).length;

    if (dotCount + commaCount > 1) {
      const dotIndex = filteredValue.indexOf(".");
      const commaIndex = filteredValue.indexOf(",");

      let firstSeparatorIndex = -1;
      let separator = "";

      if (dotIndex >= 0 && (commaIndex < 0 || dotIndex < commaIndex)) {
        firstSeparatorIndex = dotIndex;
        separator = ".";
      } else if (commaIndex >= 0) {
        firstSeparatorIndex = commaIndex;
        separator = ",";
      }

      if (firstSeparatorIndex >= 0) {
        const before = filteredValue.substring(0, firstSeparatorIndex);
        const after = filteredValue
          .substring(firstSeparatorIndex + 1)
          .replace(/[.,]/g, "");
        filteredValue = before + separator + after;
      }
    }
    const minusCount = (filteredValue.match(/-/g) || []).length;
    if (
      minusCount > 1 ||
      (minusCount === 1 && filteredValue.indexOf("-") !== 0)
    ) {
      filteredValue = filteredValue.replace(/-/g, "");
      if (minusCount > 0 && filteredValue.length > 0) {
        filteredValue = "-" + filteredValue;
      }
    }
    if (
      filteredValue.startsWith("0") &&
      filteredValue.length > 1 &&
      filteredValue[1] !== "." &&
      filteredValue[1] !== ","
    ) {
      const withoutLeadingZeros = filteredValue.replace(/^0+/, "");
      filteredValue = withoutLeadingZeros || "0";
    }

    if (filteredValue !== value) {
      input.value = filteredValue;
      const positionAdjustment = value.length - filteredValue.length;
      const newPosition = Math.max(0, cursorPosition - positionAdjustment);
      input.setSelectionRange(newPosition, newPosition);

      e.preventDefault();
    }

    inputValue.value = filteredValue;
    const processedValue = processInput(filteredValue);
    let numericValue = parseFloat(processedValue);

    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    emit("update:modelValue", numericValue);
  };

  const handleFocus = () => {
    previousValidValue.value = props.modelValue;
    isFocused.value = true;
    emit("focus-change", true);
  };

  const handleBlur = () => {
    let currentValue = inputValue.value;
    if (currentValue.includes(",")) {
      currentValue = currentValue.replace(/,/g, ".");
      const numericValue = parseFloat(currentValue);
      if (!isNaN(numericValue)) {
        emit("update:modelValue", numericValue);
      }
    }
    inputValue.value = formatDisplayNumber(props.modelValue);
    if (props.modelValue < MIN_VALUE) {
      emit("update:modelValue", MIN_VALUE);
      inputValue.value = MIN_VALUE.toString();
    } else if (props.unit === "%" && props.modelValue > MAX_PERCENTAGE) {
      emit("update:modelValue", previousValidValue.value);
      inputValue.value = formatDisplayNumber(previousValidValue.value);
    }

    isFocused.value = false;
    emit("focus-change", false);
  };

  const handleMouseEnter = () => {
    isHovering.value = true;
    emit("hover-change", true);
  };

  const handleMouseLeave = () => {
    isHovering.value = false;
    emit("hover-change", false);
  };

  return {
    inputValue,
    isFocused,
    isHovering,
    handleInput,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    formatDisplayNumber,
  };
}
