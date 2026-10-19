const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const errorBox = document.getElementById('error');

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

function render(tasks) {
  list.innerHTML = '';

  for (const task of tasks) {
    const item = document.createElement('li');
    if (task.completed) {
      item.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    item.append(checkbox, title, deleteButton);
    list.appendChild(item);
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  counter.textContent = `${completedCount} of ${tasks.length} completed`;
}

async function loadTasks() {
  try {
    const tasks = await request('/api/tasks');
    clearError();
    render(tasks);
  } catch (err) {
    showError(`Could not load tasks: ${err.message}`);
  }
}

async function addTask(title) {
  try {
    await request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    input.value = '';
  } catch (err) {
    showError(`Could not add task: ${err.message}`);
    return;
  }
  await loadTasks();
}

async function toggleTask(id, completed) {
  try {
    await request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  } catch (err) {
    showError(`Could not update task: ${err.message}`);
  }
  await loadTasks();
}

async function deleteTask(id) {
  try {
    await request(`/api/tasks/${id}`, { method: 'DELETE' });
  } catch (err) {
    showError(`Could not delete task: ${err.message}`);
  }
  await loadTasks();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    showError('Please enter a task title.');
    return;
  }
  addTask(title);
});

loadTasks();
