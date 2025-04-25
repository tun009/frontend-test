import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import StepperButton from '../../components/StepperButton.vue';

describe('StepperButton.vue', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(StepperButton, {
      props: {
        type: 'increase',
        disabled: false
      }
    });
  });

  it('should render correctly with increase type', () => {
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('+');
  });

  it('should render correctly with decrease type', async () => {
    await wrapper.setProps({ type: 'decrease' });
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('-');
  });

  it('should apply disabled classes when disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').classes()).toContain('opacity-50');
    expect(wrapper.find('button').classes()).toContain('cursor-not-allowed');
  });

  it('should emit click event when button is clicked and not disabled', async () => {
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted().click).toBeTruthy();
  });

  it('should not emit click event when button is clicked and disabled', async () => {
    await wrapper.setProps({ disabled: true });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted().click).toBeFalsy();
  });
}); 