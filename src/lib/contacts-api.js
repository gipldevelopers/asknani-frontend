// contacts-api.js

import API from "./api";

export const contactsAPI = {
  // Get all contacts for the provider
  getContacts: async () => {
    const response = await API.get("/contacts");
    return response.data;
  },
  getContactMessages: async (daycareId, parentId, lastId = 0) => {
    const response = await API.get(
      `/chat/${daycareId}/messages?last_id=${lastId}&parent_id=${parentId}`
    );
    return response.data;
  },
  // Get stats for the provider
  getStats: async () => {
    const response = await API.get("/contacts/stats");
    return response.data;
  },

  // Get messages for a specific contact
  getContactMessages: async (daycareId, parentId, lastId = 0) => {
    const response = await API.get(
      `/chat/${daycareId}/messages?last_id=${lastId}&parent_id=${parentId}`
    );
    return response.data;
  },

  // Send message to a contact
  sendMessage: async (messageData) => {
    const response = await API.post("/chat/send", messageData);
    return response.data;
  },

  // Mark messages as seen for a contact
  markAsSeen: async (daycareId, parentId) => {
    const response = await API.post(`/chat/${daycareId}/seen`, {
      parent_id: parentId,
    });
    return response.data;
  },

  // Upload file for chat
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await API.post("/chat/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
