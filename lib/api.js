// API functions for CareConnect application
// Integration with CareConnect API according to specifications
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://careconnect.laendletech.at/api";

const API_CONFIG = {
  baseUrl,
  defaultHeaders: {
    "Content-Type": "application/json"
  }
};

// Enhanced error handling
const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response) {
    // Server responded with a status code outside of 2xx range
    switch (error.response.status) {
      case 400:
        throw new Error("Invalid request. Please check your inputs.");
      case 401:
        throw new Error("Not authenticated. Please log in again.");
      case 403:
        throw new Error("You are not authorized to perform this action.");
      case 404:
        throw new Error("The requested resource was not found.");
      case 500:
        throw new Error("Internal server error. Please try again later.");
      default:
        throw new Error(error.response.data?.message || defaultMessage);
    }
  } else if (error.request) {
    // Request was sent but no response received
    throw new Error("No server response. Please check your internet connection.");
  } else {
    // Something went wrong while setting up the request
    throw new Error(defaultMessage);
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }

    // For empty responses (like DELETE operations)
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// Auth API methods
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
      method: "POST",
      headers: API_CONFIG.defaultHeaders,
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }

    const data = await response.json();

    // Store the token and user data
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role
    }));

    return data;
  } catch (error) {
    handleApiError(error, "Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
      method: "POST",
      headers: API_CONFIG.defaultHeaders,
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Registration failed");
  }
};

export const logoutUser = async () => {
  const authToken = getAuthToken();

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        ...API_CONFIG.defaultHeaders,
        "Authorization": `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        }
      };
    }

    // Clear token and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    return true;
  } catch (error) {
    handleApiError(error, "Logout failed");
  }
};

// Authentication and Authorization Helpers
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export const hasRole = (allowedRoles) => {
  const userRole = getUserRole();
  return userRole && allowedRoles.includes(userRole);
};

// User API
export const fetchCurrentUserProfile = async () => {
  return await apiCall('/users/me', { method: 'GET' });
};

export const updateCurrentUserProfile = async (userData) => {
  return await apiCall('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

export const fetchUsers = async () => {
  return await apiCall("/users", { method: "GET" });
};

export const fetchUserData = async (id) => {
  return await apiCall(`/users/${id}`, { method: "GET" });
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