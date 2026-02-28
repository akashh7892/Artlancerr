const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper function to set token in localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Helper function to get user data from localStorage
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Helper function to set user data in localStorage
const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

// Clear auth data (for logout)
const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add token to headers if available
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  signup: async (userData) => {
    const data = await fetchAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    // Store token and user data on successful signup
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  login: async (credentials) => {
    const data = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    // Store token and user data on successful login
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  logout: async () => {
    try {
      await fetchAPI("/auth/logout", {
        method: "POST",
      });
    } finally {
      clearAuth();
    }
  },

  getCurrentUser: async () => {
    return fetchAPI("/auth/me");
  },

  forgotPassword: async (email) => {
    return fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, password) => {
    return fetchAPI("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return fetchAPI("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  verifyOTP: async (email, otp) => {
    return fetchAPI("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },
};

// Artist API calls
export const artistAPI = {
  getProfile: async () => {
    return fetchAPI("/artist/profile");
  },

  updateProfile: async (profileData) => {
    return fetchAPI("/artist/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  getOpportunities: async () => {
    return fetchAPI("/opportunities");
  },

  getMessages: async () => {
    return fetchAPI("/messages");
  },

  getPortfolio: async () => {
    return fetchAPI("/artist/portfolio");
  },

  addPortfolio: async (portfolioData) => {
    return fetchAPI("/artist/portfolio", {
      method: "POST",
      body: JSON.stringify(portfolioData),
    });
  },

  deletePortfolio: async (id) => {
    return fetchAPI(`/artist/portfolio/${id}`, {
      method: "DELETE",
    });
  },

  getPromotions: async () => {
    return fetchAPI("/promotions");
  },

  createPromotion: async (promotionData) => {
    return fetchAPI("/promotions", {
      method: "POST",
      body: JSON.stringify(promotionData),
    });
  },

  updatePromotion: async (id, promotionData) => {
    return fetchAPI(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(promotionData),
    });
  },

  deletePromotion: async (id) => {
    return fetchAPI(`/promotions/${id}`, {
      method: "DELETE",
    });
  },

  getPayments: async () => {
    return fetchAPI("/artist/payments");
  },

  getNearbyArtists: async () => {
    return fetchAPI("/dashboard/nearby-artists");
  },

  getDashboard: async () => {
    return fetchAPI("/dashboard/artist");
  },
};

// Hirer API calls
export const hirerAPI = {
  getProfile: async () => {
    return fetchAPI("/hirer/profile");
  },

  updateProfile: async (profileData) => {
    return fetchAPI("/hirer/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  getArtists: async () => {
    return fetchAPI("/dashboard/nearby-artists");
  },

  getArtistProfile: async (id) => {
    return fetchAPI(`/artist/${id}`);
  },

  postOpportunity: async (opportunityData) => {
    return fetchAPI("/hirer/opportunity", {
      method: "POST",
      body: JSON.stringify(opportunityData),
    });
  },

  getOpportunities: async () => {
    return fetchAPI("/hirer/opportunities");
  },

  updateOpportunity: async (id, opportunityData) => {
    return fetchAPI(`/opportunities/${id}`, {
      method: "PUT",
      body: JSON.stringify(opportunityData),
    });
  },

  deleteOpportunity: async (id) => {
    return fetchAPI(`/opportunities/${id}`, {
      method: "DELETE",
    });
  },

  getMessages: async () => {
    return fetchAPI("/messages");
  },

  getPayments: async () => {
    return fetchAPI("/hirer/payments");
  },

  getPromotions: async () => {
    return fetchAPI("/promotions");
  },

  createPromotion: async (promotionData) => {
    return fetchAPI("/promotions", {
      method: "POST",
      body: JSON.stringify(promotionData),
    });
  },

  updatePromotion: async (id, promotionData) => {
    return fetchAPI(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(promotionData),
    });
  },

  deletePromotion: async (id) => {
    return fetchAPI(`/promotions/${id}`, {
      method: "DELETE",
    });
  },

  getBookings: async () => {
    return fetchAPI("/hirer/tasks");
  },

  updateTask: async (id, payload) => {
    return fetchAPI(`/hirer/task/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  releaseTaskPayment: async (id) => {
    return fetchAPI(`/hirer/task/${id}/release-payment`, {
      method: "POST",
    });
  },

  getDashboard: async () => {
    return fetchAPI("/dashboard/hirer");
  },
};

// Opportunities API calls (shared)
export const opportunitiesAPI = {
  getAll: async () => {
    return fetchAPI("/opportunities");
  },

  getById: async (id) => {
    return fetchAPI(`/opportunities/${id}`);
  },

  apply: async (opportunityId, applicationData) => {
    return fetchAPI("/applications", {
      method: "POST",
      body: JSON.stringify({ opportunityId, ...applicationData }),
    });
  },
};

// Applications API calls
export const applicationsAPI = {
  getAll: async () => {
    return fetchAPI("/applications/my");
  },

  getById: async (id) => {
    return fetchAPI(`/applications/${id}`);
  },

  updateStatus: async (id, status) => {
    return fetchAPI(`/hirer/application/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Payments (Razorpay)
export const paymentsAPI = {
  createOrder: async (payload) => {
    return fetchAPI("/payments/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  verify: async (payload) => {
    return fetchAPI("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Categories API calls
export const categoriesAPI = {
  getAll: async () => {
    return fetchAPI("/categories");
  },
};

// Dashboard API calls
export const dashboardAPI = {
  getArtistDashboard: async () => {
    return fetchAPI("/dashboard/artist");
  },

  getHirerDashboard: async () => {
    return fetchAPI("/dashboard/hirer");
  },
};

export const messagesAPI = {
  getConversations: async () => {
    return fetchAPI("/messages");
  },

  getThread: async (userId) => {
    return fetchAPI(`/messages/${userId}`);
  },

  sendMessage: async (payload) => {
    return fetchAPI("/messages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Export utility functions
export { getToken, setToken, getUser, setUser, clearAuth, fetchAPI };

// Upload file (multipart/form-data) — do not set Content-Type so browser sets boundary
export const uploadFile = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
};
