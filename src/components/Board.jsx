import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, moveTask } from '../reducers/tasksSlice';
import Task from './Task';

const COLUMNS = [
  { id: 'todo',       label: 'To Do',       accent: '#6366f1' },
  { id: 'inprogress', label: 'In Progress',  accent: '#f59e0b' },
  { id: 'done',       label: 'Done',         accent: '#10b981' },
];

const EMPTY_FORM = { title: '', priority: 'Medium', due: '', column: 'todo' };

export default function Board() {
  const dispatch = useDispatch();
  const allTasks = useSelector(s => s.tasks.items);

  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const filtered = allTasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    dispatch(addTask(form));
    setForm(EMPTY_FORM);
    setShowModal(false);
  };

  const handleDrop = (colId) => {
    if (dragId) dispatch(moveTask({ id: dragId, column: colId }));
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">⬡ Taskflow</div>
          <span className="header-sub">Project Board</span>
        </div>
        <div className="header-right">
          <input
            className="search-input"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            {['All', 'High', 'Medium', 'Low'].map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="board">
        {COLUMNS.map(col => {
          const tasks = filtered.filter(t => t.column === col.id);
          const isDragTarget = dragOver === col.id;
          return (
            <div
              key={col.id}
              className={`column ${isDragTarget ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="column-header" style={{ '--accent': col.accent }}>
                <span className="column-label">{col.label}</span>
                <span className="column-count">{tasks.length}</span>
              </div>
              <div className="task-list">
                {tasks.map(task => (
                  <Task
                    key={task.id}
                    task={task}
                    onDragStart={() => setDragId(task.id)}
                  />
                ))}
                {tasks.length === 0 && (
                  <div className="empty-col">Drop tasks here</div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">New Task</h3>
            <input
              className="modal-input"
              placeholder="Task title…"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
            <div className="modal-row">
              <select
                className="modal-select"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
              <select
                className="modal-select"
                value={form.column}
                onChange={e => setForm({ ...form, column: e.target.value })}
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input
                type="date"
                className="modal-input"
                value={form.due}
                onChange={e => setForm({ ...form, due: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleAdd}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}