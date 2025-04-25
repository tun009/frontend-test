import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import NumberInput from '../../components/NumberInput.vue';
import { nextTick } from 'vue';

// Mock useNumberInput composable
vi.mock('../../composables/useNumberInput', () => ({
  useNumberInput: vi.fn().mockImplementation((_, emit) => {
    return {
      inputValue: {
        value: '0'
      },
      handleInput: (e: Event) => {
        const input = e.target as HTMLInputElement;
        emit('update:modelValue', parseFloat(input.value) || 0);
      },
      handleFocus: () => {
        emit('focus-change', true);
      },
      handleBlur: () => {
        emit('focus-change', false);
      },
      handleMouseEnter: () => {
        emit('hover-change', true);
      },
      handleMouseLeave: () => {
        emit('hover-change', false);
      }
    };
  })
}));

describe('NumberInput.vue', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        unit: '%'
      }
    });
  });

  it('should render correctly with initial value', () => {
    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('should call handleInput when input value changes', async () => {
    const input = wrapper.find('input');
    await input.setValue('42');
    await input.trigger('input');
    await nextTick();
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const updateEvents = wrapper.emitted('update:modelValue');
    expect(updateEvents && updateEvents[0]).toEqual([42]);
  });

  it('should call handleFocus when input is focused', async () => {
    const input = wrapper.find('input');
    await input.trigger('focus');
    await nextTick();
    
    expect(wrapper.emitted('focus-change')).toBeTruthy();
    const focusEvents = wrapper.emitted('focus-change');
    expect(focusEvents && focusEvents[0]).toEqual([true]);
  });

  it('should call handleBlur when input loses focus', async () => {
    const input = wrapper.find('input');
    await input.trigger('blur');
    await nextTick();
    
    expect(wrapper.emitted('focus-change')).toBeTruthy();
    const focusEvents = wrapper.emitted('focus-change');
    expect(focusEvents && focusEvents[0]).toEqual([false]);
  });

  it('should call handleMouseEnter when hovering over component', async () => {
    await wrapper.find('.number-input').trigger('mouseenter');
    await nextTick();
    
    expect(wrapper.emitted('hover-change')).toBeTruthy();
    const hoverEvents = wrapper.emitted('hover-change');
    expect(hoverEvents && hoverEvents[0]).toEqual([true]);
  });

  it('should call handleMouseLeave when mouse leaves component', async () => {
    await wrapper.find('.number-input').trigger('mouseleave');
    await nextTick();
    
    expect(wrapper.emitted('hover-change')).toBeTruthy();
    const hoverEvents = wrapper.emitted('hover-change');
    expect(hoverEvents && hoverEvents[0]).toEqual([false]);
  });
}); 