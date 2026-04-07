import { createSlice, nanoid } from '@reduxjs/toolkit';

const sample = [
  { id: '1', title: 'Design new landing page', priority: 'High', due: '2026-04-10', column: 'todo' },
  { id: '2', title: 'Fix auth bug in login flow', priority: 'Medium', due: '2026-04-12', column: 'inprogress' },
  { id: '3', title: 'Write unit tests for API', priority: 'Low', due: '2026-04-15', column: 'done' },
  { id: '4', title: 'Update project README', priority: 'Low', due: '2026-04-09', column: 'todo' },
  { id: '5', title: 'Deploy staging environment', priority: 'High', due: '2026-04-08', column: 'inprogress' },
];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: sample },
  reducers: {
    addTask: {
      reducer: (state, action) => { state.items.push(action.payload); },
      prepare: ({ title, priority, due, column }) => ({
        payload: { id: nanoid(), title, priority, due: due || '', column: column || 'todo' },
      }),
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    cloneTask: {
      reducer: (state, action) => { state.items.push(action.payload); },
      prepare: (task) => ({
        payload: { ...task, id: nanoid(), title: task.title + ' (copy)' },
      }),
    },
    editTask: (state, action) => {
      const idx = state.items.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    moveTask: (state, action) => {
      const { id, column } = action.payload;
      const task = state.items.find(t => t.id === id);
      if (task) task.column = column;
    },
  },
});

export const { addTask, deleteTask, cloneTask, editTask, moveTask } = tasksSlice.actions;
export default tasksSlice.reducer;