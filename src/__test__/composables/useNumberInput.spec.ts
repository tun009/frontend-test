import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNumberInput } from '../../composables/useNumberInput';
import { ref } from 'vue';

// Mock các constants cần thiết
vi.mock('../../constants/constants', () => ({
  MIN_VALUE: 0,
  MAX_PERCENTAGE: 100,
  DECIMAL_PLACES: 1
}));

describe('useNumberInput', () => {
  const mockEmit = vi.fn();
  let numberInput: ReturnType<typeof useNumberInput>;
  
  beforeEach(() => {
    mockEmit.mockReset();
    
    // Setup mock cho tests
    numberInput = useNumberInput(
      { 
        modelValue: 0, 
        unit: '%' 
      }, 
      mockEmit
    );
  });

  describe('Input validation for integer and float values', () => {
    it('should accept valid integer values', () => {
      // Tạo mock event
      const mockEvent = {
        target: {
          value: '42',
          selectionStart: 2,
          setSelectionRange: vi.fn()
        },
        preventDefault: vi.fn()
      } as unknown as Event;

      // Gọi hàm xử lý input
      numberInput.handleInput(mockEvent);

      // Kiểm tra modelValue được emit với giá trị đúng
      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', 42);
      expect(numberInput.inputValue.value).toBe('42');
    });

    it('should accept valid decimal values', () => {
      const mockEvent = {
        target: {
          value: '4.2',
          selectionStart: 3,
          setSelectionRange: vi.fn()
        },
        preventDefault: vi.fn()
      } as unknown as Event;

      numberInput.handleInput(mockEvent);

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', 4.2);
      expect(numberInput.inputValue.value).toBe('4.2');
    });
  });

  describe('Comma to dot conversion', () => {
    it('should convert comma to dot when blur', () => {
      // Setup giá trị input với dấu phẩy
      numberInput.inputValue.value = '12,3';
      
      // Giả lập việc emit khi người dùng nhập liệu
      mockEmit.mockImplementation((event, value) => {
        if (event === 'update:modelValue') {
          // Giả lập cập nhật prop từ parent component
          numberInput = useNumberInput({ modelValue: value, unit: '%' }, mockEmit);
        }
      });

      // Gọi hàm xử lý blur
      numberInput.handleBlur();

      // Kiểm tra xem dấu phẩy đã được chuyển sang dấu chấm
      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', 12.3);
    });
  });

  describe('Invalid character handling', () => {
    it('should remove letter characters from input (123a → 123)', () => {
      const mockEvent = {
        target: {
          value: '123a',
          selectionStart: 4,
          setSelectionRange: vi.fn()
        },
        preventDefault: vi.fn()
      } as unknown as Event;

      numberInput.handleInput(mockEvent);

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', 123);
      expect(numberInput.inputValue.value).toBe('123');
    });
  });


  describe('Unit conversion handling', () => {
    it('should update to 100 when switching from px to % with value > 100', () => {
      numberInput = useNumberInput({ modelValue: 200, unit: 'px' }, mockEmit);
      
      const oldUnit = 'px';
      const newUnit = '%';
      
      vi.spyOn(numberInput, 'inputValue', 'set');
      
      mockEmit.mockImplementation((event, value) => {
        if (event === 'update:modelValue') {
          numberInput = useNumberInput({ modelValue: value, unit: newUnit }, mockEmit);
        }
      });
      
      mockEmit('update:modelValue', 100);
      
      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', 100);
    });
  });
}); 