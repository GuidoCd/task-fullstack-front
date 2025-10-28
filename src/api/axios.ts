import axios from 'axios';

function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

const apiClient = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const xsrfToken = getCookieValue('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 419].includes(error.response.status)) {
      import('@/stores/authStore').then(storeModule => {
        const authStore = storeModule.useAuthStore();
        if (authStore.isAuthenticated) {
          authStore.logout();
        }
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;