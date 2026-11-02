const API_BASE = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request(path: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  // Auth
  register(name: string, email: string, password: string) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  }
  login(email: string, password: string) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }
  getMe() {
    return this.request('/auth/me');
  }

  // Goals
  getGoals() { return this.request('/goals'); }
  getGoal(id: string) { return this.request(`/goals/${id}`); }
  createGoal(data: any) { return this.request('/goals', { method: 'POST', body: JSON.stringify(data) }); }
  updateGoal(id: string, data: any) { return this.request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteGoal(id: string) { return this.request(`/goals/${id}`, { method: 'DELETE' }); }

  // Milestones
  getMilestones(goalId: string) { return this.request(`/goals/${goalId}/milestones`); }
  createMilestone(goalId: string, data: any) { return this.request(`/goals/${goalId}/milestones`, { method: 'POST', body: JSON.stringify(data) }); }
  updateMilestone(id: string, data: any) { return this.request(`/goals/milestones/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteMilestone(id: string) { return this.request(`/goals/milestones/${id}`, { method: 'DELETE' }); }

  // Tasks
  getTasks(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/tasks${query}`);
  }
  getTask(id: string) { return this.request(`/tasks/${id}`); }
  createTask(data: any) { return this.request('/tasks', { method: 'POST', body: JSON.stringify(data) }); }
  updateTask(id: string, data: any) { return this.request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteTask(id: string) { return this.request(`/tasks/${id}`, { method: 'DELETE' }); }

  // Profile
  getProfile() { return this.request('/profile'); }
  updateProfile(data: any) { return this.request('/profile', { method: 'PUT', body: JSON.stringify(data) }); }

  // Analytics
  getAnalytics() { return this.request('/profile/analytics'); }

  // Reminders
  getReminders() { return this.request('/reminders'); }
  markReminderRead(id: string) { return this.request(`/reminders/${id}/read`, { method: 'PUT' }); }
  generateReminders() { return this.request('/reminders/generate', { method: 'POST' }); }
}

export const api = new ApiService();
