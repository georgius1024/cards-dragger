export function initialize(snapshot) {
  return {
    states: [snapshot],
    position: 1
  };
}

export function addState(history, snapshot) {
  const states = [...history.states.slice(0, history.position), snapshot];
  const position = states.length;
  return {
    ...history,
    states,
    position
  };
}

export function replaceState({ states, position }, replaceWith) {

  const replacedStates = states.map((state, index) => {
    if (index === position - 1) {
      return replaceWith
    }
    return state
  })
  return {
    states: replacedStates,
    position
  };
}

export function getCurrent({ states, position }) {
  return states[position - 1];
}

export function undoable({position}) {
  return position > 1
}

export function redoable({states, position}) {
  return position < states.length
}

export function undo(history) {
  if (!undoable(history)) {
    throw new Error('Can\'t undo!')
  }
  return { ...history, position:  history.position - 1};
}

export function redo(history) {
  if (!redoable(history)) {
    throw new Error('Can\'t redo!')
  }
  return { ...history, position:  history.position + 1};
}
