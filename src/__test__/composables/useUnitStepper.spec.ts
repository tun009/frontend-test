import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUnitStepper } from '../../composables/useUnitStepper';

vi.mock('../../constants/constants', () => ({
  DEFAULT_STEP: 1,
  MIN_VALUE: 0,
  MAX_PERCENTAGE: 100
}));

describe('useUnitStepper', () => {
  let unitStepper: ReturnType<typeof useUnitStepper>;

  beforeEach(() => {
    unitStepper = useUnitStepper();
  });

  describe('Basic functionality', () => {
    it('should initialize with default values % and 0', () => {
      expect(unitStepper.currentUnit.value).toBe('%');
      expect(unitStepper.currentValue.value).toBe(0);
    });

    it('should return true for isAtMin when value is 0', () => {
      unitStepper.currentValue.value = 0;
      expect(unitStepper.isAtMin.value).toBe(true);
    });

    it('should return false for isAtMin when value is greater than 0', () => {
      unitStepper.currentValue.value = 5;
      expect(unitStepper.isAtMin.value).toBe(false);
    });

    it('should return true for isAtMax when value is 100 and unit is %', () => {
      unitStepper.currentUnit.value = '%';
      unitStepper.currentValue.value = 100;
      expect(unitStepper.isAtMax.value).toBe(true);
    });

    it('should return false for isAtMax when value is 100 and unit is px', () => {
      unitStepper.currentUnit.value = 'px';
      unitStepper.currentValue.value = 100;
      expect(unitStepper.isAtMax.value).toBe(false);
    });
  });

  describe('Button click functionality', () => {
    it('should increase value by 1 when increase button is clicked', () => {
      unitStepper.currentValue.value = 5;
      unitStepper.updateValue(true);
      expect(unitStepper.currentValue.value).toBe(6);
    });

    it('should decrease value by 1 when decrease button is clicked', () => {
      unitStepper.currentValue.value = 5;
      unitStepper.updateValue(false);
      expect(unitStepper.currentValue.value).toBe(4);
    });

    it('should limit at MIN_VALUE (0) when decreasing below 0', () => {
      unitStepper.currentValue.value = 0;
      unitStepper.updateValue(false);
      expect(unitStepper.currentValue.value).toBe(0);
    });

    it('should limit at MAX_PERCENTAGE (100) when increasing above 100 with % unit', () => {
      unitStepper.currentUnit.value = '%';
      unitStepper.currentValue.value = 100;
      unitStepper.updateValue(true);
      expect(unitStepper.currentValue.value).toBe(100);
    });

    it('should allow values > 100 when unit is px', () => {
      unitStepper.currentUnit.value = 'px';
      unitStepper.currentValue.value = 100;
      unitStepper.updateValue(true);
      expect(unitStepper.currentValue.value).toBe(101);
    });
  });

  describe('Unit conversion functionality', () => {
    it('should set correct unit when changing units', () => {
      unitStepper.currentUnit.value = 'px';
      unitStepper.handleUnitChange('%');
      expect(unitStepper.currentUnit.value).toBe('%');
    });

    it('should limit value to 100 when changing from px to % and value > 100', () => {
      unitStepper.currentUnit.value = 'px';
      unitStepper.currentValue.value = 150;
      unitStepper.handleUnitChange('%');
      expect(unitStepper.currentValue.value).toBe(100);
    });

    it('should keep value unchanged when changing from px to % and value <= 100', () => {
      unitStepper.currentUnit.value = 'px';
      unitStepper.currentValue.value = 75;
      unitStepper.handleUnitChange('%');
      expect(unitStepper.currentValue.value).toBe(75);
    });

    it('should keep value unchanged when changing from % to px', () => {
      unitStepper.currentUnit.value = '%';
      unitStepper.currentValue.value = 50;
      unitStepper.handleUnitChange('px');
      expect(unitStepper.currentValue.value).toBe(50);
    });
  });
}); 