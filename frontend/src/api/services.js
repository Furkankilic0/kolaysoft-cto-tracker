import client from "./client";

export const userApi = {
  getAll: () => client.get("/users"),
  getById: (id) => client.get(`/users/${id}`),
  getByRole: (role) => client.get("/users/by-role", { params: { role } }),
  create: (data) => client.post("/users", data),
};

export const projectApi = {
  getAll: () => client.get("/projects"),
  getById: (id) => client.get(`/projects/${id}`),
  getByManager: (managerId) => client.get(`/projects/by-manager/${managerId}`),
  create: (data) => client.post("/projects", data),
  update: (id, data) => client.put(`/projects/${id}`, data),
  changeStatus: (id, status) => client.patch(`/projects/${id}/status`, null, { params: { status } }),
  remove: (id) => client.delete(`/projects/${id}`),
};

export const reportApi = {
  getAll: () => client.get("/reports"),
  getById: (id) => client.get(`/reports/${id}`),
  getByProject: (projectId) => client.get(`/reports/by-project/${projectId}`),
  getByWeek: (year, weekNumber) => client.get("/reports/by-week", { params: { year, weekNumber } }),
  create: (data) => client.post("/reports", data),
  update: (id, data) => client.put(`/reports/${id}`, data),
  submit: (id) => client.patch(`/reports/${id}/submit`),
  review: (id, data) => client.patch(`/reports/${id}/review`, data),
  remove: (id) => client.delete(`/reports/${id}`),
};

export const dashboardApi = {
  get: (filters = {}) => client.get("/dashboard", { params: filters }),
};