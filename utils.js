const formatDate = (date) => `Due: ${date.toLocaleDateString()}`;

const validateTask = ({ title, dueDate } = {}) => {
  return Boolean(title) && Boolean(dueDate);
};

const mergeTaskUpdate = (original, ...updates) => {
  return Object.assign({}, original, ...updates);
};

class TaskValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskValidationError";
  }
}

const createTask = (taskData) => {
  if (!validateTask(taskData)) {
    throw new TaskValidationError("Invalid task data");
  }

  return {
    id: Date.now(),
    completed: false,
    ...taskData,
  };
};

const tasks = [
  { id: 1, title: 'Learn Node.js', completed: false },
  { id: 2, title: 'Build Express API', completed: true }
];

async function fetchSampleUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));
}

module.exports = {
  formatDate,
  validateTask,
  mergeTaskUpdate,
  TaskValidationError,
  createTask,
  tasks,
  fetchSampleUsers
};