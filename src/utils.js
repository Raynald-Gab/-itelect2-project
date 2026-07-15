export const formatDate = (date) => `Due: ${date.toLocaleDateString()}`;

export const validateTask = ({ title, dueDate } = {}) => {
  return Boolean(title) && Boolean(dueDate);
};

export const mergeTaskUpdate = (original, ...updates) => {
  return Object.assign({}, original, ...updates);
};