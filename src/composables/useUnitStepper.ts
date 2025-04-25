import { ref, computed } from 'vue'
import type { Unit } from '../types/types'
import { DEFAULT_STEP, MIN_VALUE, MAX_PERCENTAGE } from '../constants/constants'

export function useUnitStepper() {
  const currentUnit = ref<Unit>('%')
  const currentValue = ref<number>(0)

  const isAtMin = computed(() => currentValue.value <= MIN_VALUE)
  const isAtMax = computed(() => {
    if (currentUnit.value === '%') {
      return currentValue.value >= MAX_PERCENTAGE
    }
    return false
  })

  const updateValue = (increment: boolean) => {
    const step = DEFAULT_STEP
    const newValue = increment 
      ? currentValue.value + step 
      : currentValue.value - step

    if (newValue < MIN_VALUE) {
      currentValue.value = MIN_VALUE
      return
    }

    if (currentUnit.value === '%' && newValue > MAX_PERCENTAGE) {
      currentValue.value = MAX_PERCENTAGE
      return
    }

    currentValue.value = newValue
  }

  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit === '%' && currentUnit.value === 'px' && currentValue.value > MAX_PERCENTAGE) {
      currentValue.value = MAX_PERCENTAGE
    }
    
    currentUnit.value = newUnit
  }

  return {
    currentUnit,
    currentValue,
    isAtMin,
    isAtMax,
    updateValue,
    handleUnitChange
  }
}


