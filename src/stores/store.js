import { createPinia } from 'pinia';
import { defineStore } from 'pinia';

export const pinia = createPinia();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    token: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
      this.unit_id = user.unit_id;
      this.email = user.email;
      this.authentication_token = user.authentication_token;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout() {
      this.user = null;
      this.email = null;
      this.unit_id = null;
      this.authentication_token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }
});
