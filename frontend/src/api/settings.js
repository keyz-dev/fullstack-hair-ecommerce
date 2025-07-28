import api from './index';

export const settingsApi = {
  // Get all settings (admin)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update settings (admin)
  updateSettings: async (settingsArray) => {
    const response = await api.put('/settings', { settings: settingsArray });
    return response.data;
  },
}; 