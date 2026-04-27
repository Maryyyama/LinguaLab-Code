const API_URL = 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const headers = { ...options.headers };
  
  // Если тело - FormData, не устанавливаем Content-Type (браузер сделает это сам)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Добавляем заголовки для предотвращения кэширования для запросов к данным преподавателей
  if (endpoint.includes('/teachers/') && (!options.method || options.method === 'GET')) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Ошибка запроса');
  }
  
  return data;
};

const api = {
  // Auth
  register(userData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Проверка существования пользователя по email и логину
  checkUserExists(email, login) {
    return request('/auth/check-user', {
      method: 'POST',
      body: JSON.stringify({ email, login })
    });
  },

  // Проверка пароля пользователя
  verifyPassword(login, password) {
    return request('/auth/verify-password', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
  },

  getCurrentUser() {
    return request('/auth/me');
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Courses
  getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/courses${query ? `?${query}` : ''}`);
  },
  
  getCourse(id) {
    return request(`/courses/${id}`);
  },
  
  createCourse(courseData) {
    return request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  },
  
  updateCourse(id, courseData) {
    return request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
  },
  
  deleteCourse(id) {
    return request(`/courses/${id}`, {
      method: 'DELETE'
    });
  },

  addReview(courseId, reviewData) {
    return request(`/courses/${courseId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  deleteReview(courseId, reviewId) {
    return request(`/courses/${courseId}/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  },
  
  // Teachers
  getTeachers() {
    return request('/teachers');
  },
  
  getTeacher(id, force = false) {
    const url = force ? `/teachers/${id}?_=${Date.now()}` : `/teachers/${id}`;
    return request(url);
  },

  getTeacherById(id, force = false) {
    const url = force ? `/teachers/${id}?_=${Date.now()}` : `/teachers/${id}`;
    return request(url);
  },
  
  createTeacher(teacherData) {
    const body = teacherData instanceof FormData ? teacherData : JSON.stringify(teacherData);
    return request('/teachers', {
      method: 'POST',
      body
    });
  },
  
  updateTeacher(id, teacherData) {
    const body = teacherData instanceof FormData ? teacherData : JSON.stringify(teacherData);
    return request(`/teachers/${id}`, {
      method: 'PUT',
      body
    });
  },

  updateTeacherPrivacy(id, privacySettings) {
    return request(`/teachers/${id}/privacy`, {
      method: 'PUT',
      body: JSON.stringify({ privacySettings })
    });
  },
  
  deleteTeacher(id) {
    return request(`/teachers/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Students
  getStudentProfile() {
    return request('/students/profile');
  },
  
  updateStudentProfile(data) {
    return request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  enrollInCourse(courseId) {
    return request('/students/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId })
    });
  },
  
  // Payments
  createPayment(paymentData) {
    return request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  getUserPayments() {
    return request('/payments/my');
  },

  getAllPayments() {
    return request('/payments');
  },

  updatePaymentStatus(id, status) {
    return request(`/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deletePayment(id) {
    return request(`/payments/${id}`, {
      method: 'DELETE'
    });
  },

  // Content (news, blog, faq)
  getContent(type, category) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    return request(`/content${params.toString() ? `?${params}` : ''}`);
  },
  
  getContentById(id) {
    return request(`/content/${id}`);
  },
  
  createContent(contentData) {
    return request('/content', {
      method: 'POST',
      body: JSON.stringify(contentData)
    });
  },
  
  updateContent(id, contentData) {
    return request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData)
    });
  },
  
  deleteContent(id) {
    return request(`/content/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin
  getAdminStats() {
    return request('/admin/stats');
  },

  getAdminUsers() {
    return request('/admin/users');
  },

  updateUserRole(userId, role) {
    return request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  // Бан пользователя
  banUser(userId, duration) {
    return request(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ duration })
    });
  },

  // Разбан пользователя
  unbanUser(userId) {
    return request(`/admin/users/${userId}/unban`, {
      method: 'POST'
    });
  },

  // Получить курсы студента
  getStudentCourses(studentId) {
    return request(`/admin/students/${studentId}/courses`);
  },

  // Удалить курс у студента
  deleteStudentCourse(studentId, courseId) {
    return request(`/admin/students/${studentId}/courses/${courseId}`, {
      method: 'DELETE'
    });
  },

  // Requests (заявки)
  getRequests() {
    return request('/requests');
  },

  getMyRequests() {
    return request('/requests/my');
  },

  createRequest(data) {
    return request('/requests', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  answerRequest(id, answer) {
    return request(`/requests/${id}/answer`, {
      method: 'PUT',
      body: JSON.stringify({ answer })
    });
  },

  deleteRequest(id) {
    return request(`/requests/${id}`, {
      method: 'DELETE'
    });
  },

  // Проверка статуса бана
  checkBanStatus() {
    return request('/auth/ban-status');
  },

  // Сбросить нарушения пользователя (админ)
  resetViolations(userId) {
    return request(`/admin/users/${userId}/reset-violations`, {
      method: 'POST'
    });
  },

  // Удалить пользователя (админ)
  deleteUser(userId) {
    return request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }
};

// Вспомогательная функция для проверки бана пользователя
export const checkUserBan = async () => {
  try {
    const userData = await api.getCurrentUser();
    if (userData.user.isBanned || (userData.user.bannedUntil && new Date(userData.user.bannedUntil) > new Date())) {
      const message = userData.user.bannedUntil
        ? `Ваш аккаунт заблокирован до ${new Date(userData.user.bannedUntil).toLocaleString('ru-RU')}`
        : 'Ваш аккаунт заблокирован навсегда';
      alert(message);
      if (userData.user.isBanned && !userData.user.bannedUntil) {
        // бан навсегда — разлогиниваем
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/entrance';
      }
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export default api;