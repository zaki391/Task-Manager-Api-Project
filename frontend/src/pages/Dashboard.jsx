import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Filter/Sort state
  const [filter, setFilter] = useState('All'); // 'All', 'pending', 'done'
  const [sort, setSort] = useState(''); // '' means newest, 'createdAt' means oldest/earliest

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (filter !== 'All') params.status = filter;
      if (sort) params.sort = sort;

      const response = await api.get('/tasks', { params });
      if (response.data.success) {
        let fetchedTasks = response.data.data;
        // The backend's default when sort is missing is insertion (oldest first).
        // If sort='' is supposed to be 'newest', we should reverse it like the old script did.
        if (!sort) {
          fetchedTasks = [...fetchedTasks].reverse();
        }
        setTasks(fetchedTasks);
      } else {
        setError(response.data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Error fetching tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, sort]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = { title, description };

      if (editingId) {
        const response = await api.put(`/tasks/${editingId}`, payload);
        if (response.data.success) {
          setTitle('');
          setDescription('');
          setEditingId(null);
          fetchTasks();
        } else {
          setError(response.data.message || 'Failed to update task');
        }
      } else {
        const response = await api.post('/tasks', payload);
        if (response.data.success) {
          setTitle('');
          setDescription('');
          fetchTasks();
        } else {
          setError(response.data.message || 'Failed to create task');
        }
      }
    } catch (err) {
      setError('Error saving task');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200 || response.status === 204 || response.data?.success) {
        setTasks(tasks.filter(t => t.id !== id));
      } else {
        alert(response.data?.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleMarkDone = async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/done`);
      if (response.data.success) {
        fetchTasks();
      } else {
        alert(response.data.message || 'Failed to mark done');
      }
    } catch (err) {
      alert('Error updating task status');
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="main-title">Task Manager</h1>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={saving}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details"
              rows="3"
              disabled={saving}
            />
          </div>
          <div className="flex gap-10">
             <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
               {saving ? 'Saving...' : (editingId ? 'Update Task' : 'Add Task')}
             </button>
             {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-outline" style={{ marginTop: '16px', marginLeft: '10px' }} disabled={saving}>
                  Cancel
                </button>
             )}
          </div>
        </form>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <button 
            className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >All</button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >Pending</button>
          <button 
            className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >Done</button>
        </div>
        <button 
          className={`filter-btn sort-btn ${sort === 'createdAt' ? 'active' : ''}`}
          onClick={() => setSort(sort === 'createdAt' ? '' : 'createdAt')}
        >
          {sort === 'createdAt' ? 'Sort latest' : 'Sort earliest'}
        </button>
      </div>

      {loading ? (
        <div className="loader">Loading tasks...</div>
      ) : (
        <>
          {tasks.length === 0 && !error ? (
            <div className="empty-state">
              <p>No tasks found.</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.status === 'done' ? 'done' : ''}`}>
                  <div className="task-content">
                    <span className={`status-badge status-${task.status === 'done' ? 'done' : 'pending'}`}>
                      {task.status === 'done' ? 'Done' : 'Pending'}
                    </span>
                    <h3 className="task-title" style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="task-desc" style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="task-actions">
                    {task.status !== 'done' && (
                      <button onClick={() => handleMarkDone(task.id)} className="btn btn-sm btn-outline-success">
                        Mark Done
                      </button>
                    )}
                    <button onClick={() => handleEdit(task)} className="btn btn-sm btn-outline-primary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
