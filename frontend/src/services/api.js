const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "token";
const TOKEN_EXP_KEY = "token_expires_at";
const DEFAULT_SESSION_DAYS = 30;

// Helper function to get token from localStorage (with expiry)
const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const exp = Number(localStorage.getItem(TOKEN_EXP_KEY) || 0);
  if (exp && Date.now() > exp) {
    clearAuth();
    return null;
  }
  return token;
};

// Helper function to set token in localStorage (with expiry)
const setToken = (token, ttlDays = DEFAULT_SESSION_DAYS) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    const ttl = Number(ttlDays);
    if (Number.isFinite(ttl) && ttl > 0) {
      const exp = Date.now() + ttl * 24 * 60 * 60 * 1000;
      localStorage.setItem(TOKEN_EXP_KEY, String(exp));
    } else {
      localStorage.removeItem(TOKEN_EXP_KEY);
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXP_KEY);
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
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXP_KEY);
  localStorage.removeItem("user");
};

// Generic fetch wrapper with error handling (requires auth token)
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

// ─── Public fetch wrapper (NO auth token — used for /home page preview) ────
// Used by HomeDummy.jsx to browse artists and opportunities without login.
const fetchPublic = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
  } catch (error) {
    console.error("Public API Error:", error);
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
    if (data.token) {
      setToken(data.token, data.expiresInDays || DEFAULT_SESSION_DAYS);
      setUser(data.user);
    }
    return data;
  },

  login: async (credentials) => {
    const data = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setToken(data.token, data.expiresInDays || DEFAULT_SESSION_DAYS);
      setUser(data.user);
    }
    return data;
  },

  logout: async () => {
    try {
      await fetchAPI("/auth/logout", { method: "POST" });
    } finally {
      clearAuth();
    }
  },

  getCurrentUser: async () => fetchAPI("/auth/me"),

  forgotPassword: async (email) =>
    fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: async (token, password) =>
    fetchAPI("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  changePassword: async (currentPassword, newPassword) =>
    fetchAPI("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  verifyOTP: async (email, otp) =>
    fetchAPI("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
};

// Artist API calls
export const artistAPI = {
  getProfile: async () => fetchAPI("/artist/profile"),

  updateProfile: async (profileData) =>
    fetchAPI("/artist/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  getOpportunities: async () => fetchAPI("/opportunities"),

  getMessages: async () => fetchAPI("/messages"),

  getPortfolio: async () => fetchAPI("/artist/portfolio"),

  addPortfolio: async (portfolioData) =>
    fetchAPI("/artist/portfolio", {
      method: "POST",
      body: JSON.stringify(portfolioData),
    }),

  deletePortfolio: async (id) =>
    fetchAPI(`/artist/portfolio/${id}`, { method: "DELETE" }),

  getPromotions: async () => fetchAPI("/promotions"),

  createPromotion: async (promotionData) =>
    fetchAPI("/promotions", {
      method: "POST",
      body: JSON.stringify(promotionData),
    }),

  updatePromotion: async (id, promotionData) =>
    fetchAPI(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(promotionData),
    }),

  deletePromotion: async (id) =>
    fetchAPI(`/promotions/${id}`, { method: "DELETE" }),

  getPayments: async () => fetchAPI("/artist/payments"),

  getNearbyArtists: async () => fetchAPI("/dashboard/nearby-artists"),

  getDashboard: async () => fetchAPI("/dashboard/artist"),
};

// Hirer API calls
export const hirerAPI = {
  getProfile: async () => fetchAPI("/hirer/profile"),

  updateProfile: async (profileData) =>
    fetchAPI("/hirer/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  getArtists: async () => fetchAPI("/dashboard/nearby-artists"),

  getArtistProfile: async (id) => fetchAPI(`/artist/${id}`),

  postOpportunity: async (opportunityData) =>
    fetchAPI("/hirer/opportunity", {
      method: "POST",
      body: JSON.stringify(opportunityData),
    }),

  getOpportunities: async () => fetchAPI("/hirer/opportunities"),

  updateOpportunity: async (id, opportunityData) =>
    fetchAPI(`/opportunities/${id}`, {
      method: "PUT",
      body: JSON.stringify(opportunityData),
    }),

  deleteOpportunity: async (id) =>
    fetchAPI(`/opportunities/${id}`, { method: "DELETE" }),

  getMessages: async () => fetchAPI("/messages"),

  getPayments: async () => fetchAPI("/hirer/payments"),

  getPromotions: async () => fetchAPI("/promotions"),

  createPromotion: async (promotionData) =>
    fetchAPI("/promotions", {
      method: "POST",
      body: JSON.stringify(promotionData),
    }),

  updatePromotion: async (id, promotionData) =>
    fetchAPI(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(promotionData),
    }),

  deletePromotion: async (id) =>
    fetchAPI(`/promotions/${id}`, { method: "DELETE" }),

  getBookings: async () => fetchAPI("/hirer/tasks"),

  updateTask: async (id, payload) =>
    fetchAPI(`/hirer/task/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  releaseTaskPayment: async (id) =>
    fetchAPI(`/hirer/task/${id}/release-payment`, { method: "POST" }),

  getDashboard: async () => fetchAPI("/dashboard/hirer"),

  getApplications: async () => fetchAPI("/hirer/applications"),

  updateApplicationStatus: async (id, payload) =>
    fetchAPI(`/hirer/application/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

// Opportunities API calls (shared, authenticated)
export const opportunitiesAPI = {
  getAll: async () => fetchAPI("/opportunities"),

  getById: async (id) => fetchAPI(`/opportunities/${id}`),

  apply: async (opportunityId, applicationData) =>
    fetchAPI("/applications", {
      method: "POST",
      body: JSON.stringify({ opportunityId, ...applicationData }),
    }),
};

// Applications API calls
export const applicationsAPI = {
  getAll: async () => fetchAPI("/applications/my"),

  getById: async (id) => fetchAPI(`/applications/${id}`),

  updateStatus: async (id, status) =>
    fetchAPI(`/hirer/application/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Payments (Razorpay)
export const paymentsAPI = {
  createOrder: async (payload) =>
    fetchAPI("/payments/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verify: async (payload) =>
    fetchAPI("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Categories API calls
export const categoriesAPI = {
  getAll: async () => fetchAPI("/categories"),
};

// Dashboard API calls
export const dashboardAPI = {
  getArtistDashboard: async () => fetchAPI("/dashboard/artist"),
  getHirerDashboard: async () => fetchAPI("/dashboard/hirer"),
};

export const messagesAPI = {
  getConversations: async () => fetchAPI("/messages"),

  getThread: async (userId) => fetchAPI(`/messages/${userId}`),

  sendMessage: async (payload) =>
    fetchAPI("/messages", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─── Public API — no auth needed, used by /home preview page ─────────────────
// Matches the /api/public/* routes in routes/public.js
export const publicAPI = {
  /**
   * Browse artists for the hirer view on /home
   * @param {object} params - { search, artCategory, page, limit }
   */
  getArtists: async ({
    search = "",
    artCategory = "",
    page = 1,
    limit = 12,
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (artCategory && artCategory !== "All")
      params.set("artCategory", artCategory);
    if (search.trim()) params.set("search", search.trim());
    return fetchPublic(`/public/artists?${params}`);
  },

  /**
   * Browse open opportunities for the artist view on /home
   * @param {object} params - { search, category, page, limit }
   */
  getOpportunities: async ({
    search = "",
    category = "",
    page = 1,
    limit = 10,
  } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (category && category !== "All") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    return fetchPublic(`/public/opportunities?${params}`);
  },
};

// Export utility functions
export { getToken, setToken, getUser, setUser, clearAuth, fetchAPI };

// Upload file to S3 via Presigned URL
export const uploadFile = async (file, options = {}) => {
  const token = getToken();
  
  // 1. Request Presigned URL from Backend
  const bucketName = options.bucket || (options.context === "cover" ? "covers" : "uploads");
  const fileName = file.name || "upload.file";
  const fileType = file.type || "application/octet-stream";
  
  const presignedRes = await fetch(`${API_BASE_URL}/upload/url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}&bucket=${encodeURIComponent(bucketName)}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  const presignedData = await presignedRes.json();
  if (!presignedRes.ok) throw new Error(presignedData.message || "Failed to get upload URL");
  
  const { presignedUrl, publicUrl, key } = presignedData;

  // 2. Upload directly to S3
  const s3Res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": fileType,
    },
    body: file,
  });

  if (!s3Res.ok) {
    throw new Error("Failed to upload file to S3");
  }

  // 3. Return the URL format expected by the frontend components
  return {
    url: publicUrl,
    public_id: key,
    message: "File uploaded successfully"
  };
};
