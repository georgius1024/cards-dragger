'dist/assets/vendor.2eebf196';

function isVisible(element) {
  const smokeTest =
    element &&
    element.offsetWidth &&
    element.offsetHeight &&
    element.style.display !== 'none';
  if (smokeTest) {
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.display !== 'none';
  } else {
    return false;
  }
}
export default {
  created(element, binding) {
    if (typeof binding.value !== 'function') {
      console.error('Please provide callback for v-click-outside');
    }
  },
  mounted(element, binding) {
    const clickHandler = (event) => {
      if (event.buttons === 1) {
        if (
          ![event.altKey, event.ctrlKey, event.metaKey, event.shiftKey].filter(
            Boolean
          ).length
        ) {
          const clickInside =
            element.contains(event.target) && isVisible(element);
          if (!clickInside) {
            binding.value(event);
          }
        }
      }
    };
    binding.instance.$clickOutsideHandler = clickHandler;

    document.addEventListener('mousedown', clickHandler);
  },
  beforeUnmount(el) {
    document.removeEventListener(
      'mousedown',
      binding.instance.$clickOutsideHandler
    );
  }
};
