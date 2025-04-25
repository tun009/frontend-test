import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import App from '../../App.vue';
import { nextTick } from 'vue';

describe('Stepper System - Integration Tests', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(App);
  });

  describe('Component Interactions', () => {
    it('should increase value when increase button is clicked', async () => {
      const initialValue = wrapper.find('input').element.value;
      
      await wrapper.findAll('button').filter(btn => btn.text().includes('+'))[0].trigger('click');
      await nextTick();
      
      const newValue = wrapper.find('input').element.value;
      expect(parseInt(newValue)).toBe(parseInt(initialValue) + 1);
    });

    it('should decrease value when decrease button is clicked', async () => {
      const input = wrapper.find('input');
      await input.setValue('5');
      await nextTick();
      
      await wrapper.findAll('button').filter(btn => btn.text().includes('-'))[0].trigger('click');
      await nextTick();
      
      expect(parseInt(input.element.value)).toBe(4);
    });

    it('should disable decrease button when value is 0', async () => {
      const input = wrapper.find('input');
      await input.setValue('0');
      await nextTick();
      
      const decreaseButton = wrapper.findAll('button').filter(btn => btn.text().includes('-'))[0];
      expect(decreaseButton.attributes('disabled')).toBeDefined();
    });

    it('should disable increase button when value is 100 and unit is %', async () => {
      const input = wrapper.find('input');
      await input.setValue('100');
      await nextTick();
      
      const increaseButton = wrapper.findAll('button').filter(btn => btn.text().includes('+'))[0];
      expect(increaseButton.attributes('disabled')).toBeDefined();
    });

    it('should not disable increase button when value is 100 and unit is px', async () => {
      const pxButton = wrapper.findAll('button').filter(btn => btn.text().includes('px'))[0];
      await pxButton.trigger('click');
      await nextTick();
      
      const input = wrapper.find('input');
      await input.setValue('100');
      await nextTick();
      
      const increaseButton = wrapper.findAll('button').filter(btn => btn.text().includes('+'))[0];
      expect(increaseButton.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Input and Unit Conversion', () => {
    it('should maintain value when switching units if value <= 100', async () => {
      const input = wrapper.find('input');
      await input.setValue('50');
      await nextTick();
      
      const pxButton = wrapper.findAll('button').filter(btn => btn.text().includes('px'))[0];
      await pxButton.trigger('click');
      await nextTick();
      
      expect(input.element.value).toBe('50');
      
      const percentButton = wrapper.findAll('button').filter(btn => btn.text().includes('%'))[0];
      await percentButton.trigger('click');
      await nextTick();
      
      expect(input.element.value).toBe('50');
    });

    it('should adjust value to 100 when switching from px to % with value > 100', async () => {
      const pxButton = wrapper.findAll('button').filter(btn => btn.text().includes('px'))[0];
      await pxButton.trigger('click');
      await nextTick();
      
      const input = wrapper.find('input');
      await input.setValue('150');
      await nextTick();
      
      const percentButton = wrapper.findAll('button').filter(btn => btn.text().includes('%'))[0];
      await percentButton.trigger('click');
      await nextTick();
      
      expect(input.element.value).toBe('100');
    });

    it('should handle comma input correctly instead of dot', async () => {
      const input = wrapper.find('input');
      await input.setValue('12,5');
      await nextTick();
      
      await input.trigger('blur');
      await nextTick();
      
      expect(parseFloat(input.element.value.replace(',', '.'))).toBeCloseTo(12.5);
    });
  });
}); 
