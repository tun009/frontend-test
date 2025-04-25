export type Unit = '%' | 'px'

export interface StepperProps {
  modelValue: number
  unit: Unit
  min?: number
  max?: number
  step?: number
}

export interface StepperEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'update:unit', unit: Unit): void
}

export interface NumberInputProps {
  modelValue: number
  unit: Unit
}

export interface NumberInputEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'focus-change', isFocused: boolean): void
  (e: 'hover-change', isHovering: boolean): void
}

export interface StepperButtonProps {
  type: 'increase' | 'decrease'
  disabled?: boolean
}

export interface UnitToggleProps {
  modelValue: Unit
}

export interface UnitToggleEmits {
  (e: 'update:modelValue', unit: Unit): void
}

