import { initialize, addState, undo, redo } from '../utils/history';

export default {
  initialize: (state, initial) => (state.history = initialize(initial)),
  update: (state, updated) =>
    (state.history = addState(state.history, updated)),
  undo: (state) => (state.history = undo(state.history)),
  redo: (state) => (state.history = redo(state.history))
};
