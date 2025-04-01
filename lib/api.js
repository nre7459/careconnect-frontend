// API functions for CareConnect application
// Integration mit der CareConnect API gemäß der Spezifikation

// Configuration for API calls
const API_CONFIG = {
  // Base URL for API calls - Kubernetes service name
  baseUrl: "http://careconnect-api",

  // For local development (wenn nötig)
  // baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",

  // Default headers for API calls
  defaultHeaders: {
    "Content-Type": "application/json"
  }
};

// Helper function to get the auth token from storage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to make API calls with proper error handling
const apiCall = async (endpoint, options = {}) => {
  // Get the current auth token from storage
  const authToken = getAuthToken();

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...API_CONFIG.defaultHeaders,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    });

    // Handle different status codes
    switch (response.status) {
      case 401:
        // Clear the token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Redirect to login page if in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Authentication failed. Please login again.');

      case 403:
        throw new Error('You do not have permission to perform this action.');

      case 404:
        throw new Error('The requested resource was not found.');

      case 400:
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bad request: Invalid data.');
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // For empty responses (like DELETE operations)
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};

// Auth API
export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: API_CONFIG.defaultHeaders
  };

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const data = await response.json();
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user || {}));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(userData),
    headers: API_CONFIG.defaultHeaders
  };

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  const authToken = getAuthToken();

  if (authToken) {
    try {
      // Call the logout endpoint
      await fetch(`${API_CONFIG.baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          ...API_CONFIG.defaultHeaders,
          "Authorization": `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Always clear local storage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Get current user profile from the API
export const fetchCurrentUserProfile = async () => {
  return await apiCall('/users/me', { method: 'GET' });
};

// Update current user profile
export const updateCurrentUserProfile = async (userData) => {
  return await apiCall('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

// User API
export const fetchUserData = async (id) => {
  return await apiCall(`/users/${id}`, { method: "GET" });
};

export const fetchUsers = async () => {
  return await apiCall("/users", { method: "GET" });
};

export const createUser = async (userData) => {
  return await apiCall("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id, userData) => {
  return await apiCall(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id) => {
  return await apiCall(`/users/${id}`, { method: "DELETE" });
};

// Appointment API
export const fetchAppointments = async () => {
  return await apiCall("/appointments", { method: "GET" });
};

export const fetchAppointmentById = async (id) => {
  return await apiCall(`/appointments/${id}`, { method: "GET" });
};

export const fetchAppointmentLocation = async (id) => {
  return await apiCall(`/appointments/${id}/location`, { method: "GET" });
};

export const fetchAppointmentParticipants = async (id) => {
  return await apiCall(`/appointments/${id}/participants`, { method: "GET" });
};

export const createAppointment = async (appointmentData) => {
  return await apiCall("/appointments", {
    method: "POST",
    body: JSON.stringify(appointmentData),
  });
};

export const updateAppointment = async (id, appointmentData) => {
  return await apiCall(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(appointmentData),
  });
};

export const deleteAppointment = async (id) => {
  return await apiCall(`/appointments/${id}`, { method: "DELETE" });
};

// Medication API
export const fetchMedications = async () => {
  return await apiCall("/medications", { method: "GET" });
};

export const fetchMedicationById = async (id) => {
  return await apiCall(`/medications/${id}`, { method: "GET" });
};

export const fetchPatientMedications = async (patientId) => {
  return await apiCall(`/medications/patient/${patientId}`, { method: "GET" });
};

export const createMedication = async (medicationData) => {
  return await apiCall("/medications", {
    method: "POST",
    body: JSON.stringify(medicationData),
  });
};

export const updateMedication = async (id, medicationData) => {
  return await apiCall(`/medications/${id}`, {
    method: "PUT",
    body: JSON.stringify(medicationData),
  });
};

export const deleteMedication = async (id) => {
  return await apiCall(`/medications/${id}`, { method: "DELETE" });
};

// Notification API
export const fetchNotifications = async () => {
  return await apiCall("/notifications", { method: "GET" });
};

export const markNotificationAsRead = async (id) => {
  return await apiCall(`/notifications/${id}/read`, { method: "POST" });
};

// Caregiver-Patient Assignments API
export const fetchCaregiverPatients = async (caregiverId) => {
  return await apiCall(`/caregivers/${caregiverId}/patients`, { method: "GET" });
};

export const assignPatientToCaregiver = async (caregiverId, patientId) => {
  return await apiCall(`/caregivers/${caregiverId}/patients/${patientId}`, { method: "POST" });
};