import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, cloneTask, editTask } from '../reducers/tasksSlice';

const PRIORITY_STYLES = {
  High:   { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
  Medium: { bg: '#fef9c3', color: '#92400e', dot: '#f59e0b' },
  Low:    { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
};

export default function Task({ task, onDragStart }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task);
  const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;

  const saveEdit = () => {
    if (draft.title.trim()) dispatch(editTask(draft));
    setEditing(false);
  };

  const formatDate = (d) => {
    if (!d) return null;
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.due && new Date(task.due) < new Date() && task.column !== 'done';

  if (editing) {
    return (
      <div className="task-card editing">
        <input
          className="edit-input"
          value={draft.title}
          onChange={e => setDraft({ ...draft, title: e.target.value })}
          autoFocus
        />
        <div className="edit-row">
          <select
            className="edit-select"
            value={draft.priority}
            onChange={e => setDraft({ ...draft, priority: e.target.value })}
          >
            {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
          </select>
          <input
            type="date"
            className="edit-date"
            value={draft.due}
            onChange={e => setDraft({ ...draft, due: e.target.value })}
          />
        </div>
        <div className="edit-actions">
          <button className="btn-cancel-sm" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn-save" onClick={saveEdit}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={onDragStart}
    >
      <div className="task-top">
        <span
          className="priority-badge"
          style={{ background: p.bg, color: p.color }}
        >
          <span className="priority-dot" style={{ background: p.dot }} />
          {task.priority}
        </span>
        <div className="task-actions">
          <button className="icon-btn" title="Edit" onClick={() => setEditing(true)}>✏️</button>
          <button className="icon-btn" title="Clone" onClick={() => dispatch(cloneTask(task))}>⧉</button>
          <button className="icon-btn danger" title="Delete" onClick={() => dispatch(deleteTask(task.id))}>✕</button>
        </div>
      </div>

      <p className="task-title">{task.title}</p>

      {task.due && (
        <div className={`task-due ${isOverdue ? 'overdue' : ''}`}>
          📅 {formatDate(task.due)}{isOverdue ? ' — Overdue' : ''}
        </div>
      )}
    </div>
  );
}