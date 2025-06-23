import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    dueDate: '',
    priority: 2,
    completed: false,
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    let url = `${API_URL}/advanced?sortBy=${sortBy}&search=${search}`;
    if (filterCompleted !== 'all') url += `&completed=${filterCompleted}`;
    url += '&page=0&size=100';
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data.content || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [search, sortBy, filterCompleted]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_URL}/${form.id}` : API_URL;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ id: null, title: '', description: '', dueDate: '', priority: 2, completed: false });
    fetchTasks();
  };

  const handleEdit = task => {
    setForm(task);
  };

  const handleDelete = async id => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const handleToggle = async task => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    fetchTasks();
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input name="dueDate" value={form.dueDate} onChange={handleChange} type="date" />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
        <label>
          Completed
          <input name="completed" type="checkbox" checked={form.completed} onChange={handleChange} />
        </label>
        <button type="submit">{form.id ? 'Update' : 'Add'} Task</button>
        {form.id && <button type="button" onClick={() => setForm({ id: null, title: '', description: '', dueDate: '', priority: 2, completed: false })}>Cancel</button>}
      </form>
      <div className="filters">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <select value={filterCompleted} onChange={e => setFilterCompleted(e.target.value)}>
          <option value="all">All</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className="todo-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className={task.completed ? 'completed' : ''}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate}</td>
                <td>{['High', 'Medium', 'Low'][task.priority - 1]}</td>
                <td>
                  <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task)} />
                </td>
                <td>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
