import { defineStore } from 'pinia';

const useData = defineStore('data', {
  state: () => ({
    theme: 'dark',
  }),

  getters: {
    getTheme() {
      return this.theme;
    },
  },

  actions: {
    toggleTheme() {
      setTimeout(() => {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
      }, 100);
    },
    setTheme(value) {
      this.theme = value;
    },
  },
});

export default useData;
