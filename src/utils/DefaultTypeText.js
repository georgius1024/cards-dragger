export default function defaultTypeText(type) {
  switch (type) {
    case 'email':
      return 'Email subject';
    case 'delay':
      return 'Delay duration';
    case 'fork':
      return 'Fork condition';
    case 'flash':
      return 'Workflow description';
  }
}
