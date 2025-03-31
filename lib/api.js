// API functions for CareConnect application
// Supports both real API calls and mock data for development

// Configuration for API calls
const API_CONFIG = {
  // Base URL for API calls
  baseUrl: "http://careconnect-api.careconnect.svc.cluster.local"
}

// Helper function to get the auth token from storage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
}

// Helper function to make API calls with proper error handling
const apiCall = async (endpoint, options = {}) => {
  // Get the current auth token from storage
  const authToken = getAuthToken();

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    })

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401) {
      // Clear the token
      localStorage.removeItem('authToken');
      // Optionally redirect to login page
      // window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error)
    throw error
  }
}



// Auth API
export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json"
    }
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, options);
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
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
}

export const registerUser = async (userData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json"
    }
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, options);
    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const data = await response.json();
    // Store the token in localStorage if provided after registration
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user || {}));
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  // Optionally redirect to login page
  // window.location.href = '/login';
}

export const isAuthenticated = () => {
  return !!getAuthToken();
}

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

// User API
export const fetchUserData = async (id) => {
  const options = {
    method: "GET",
  }
  return await apiCall(`/users/${id}`, options)
}

export const fetchUsers = async () => {
  const options = {
    method: "GET",
  }
  return await apiCall("/users", options)
}

export const createUser = async (userData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(userData),
  }
  return await apiCall("/users", options)
}

export const updateUser = async (id, userData) => {
  const options = {
    method: "PUT",
    body: JSON.stringify(userData),
  }
  return await apiCall(`/users/${id}`, options)
}

export const deleteUser = async (id) => {
  const options = {
    method: "DELETE",
  }
  return await apiCall(`/users/${id}`, options)
}

// Medication API
export const fetchMedications = async () => {
  const options = {
    method: "GET",
  }
  return await apiCall("/medications", options)
}

export const fetchUserMedications = async (patientId) => {
  const options = {
    method: "GET",
  }
  return await apiCall(`/medications?patientId=${patientId}`, options)
}

export const createMedication = async (medicationData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(medicationData),
  }
  return await apiCall("/medications", options)
}

export const updateMedication = async (id, medicationData) => {
  const options = {
    method: "PUT",
    body: JSON.stringify(medicationData),
  }
  return await apiCall(`/medications/${id}`, options)
}

export const deleteMedication = async (id) => {
  const options = {
    method: "DELETE",
  }
  return await apiCall(`/medications/${id}`, options)
}

// Appointment API
export const fetchAppointments = async () => {
  const options = {
    method: "GET",
  }
  return await apiCall("/appointments", options)
}

export const createAppointment = async (appointmentData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(appointmentData),
  }
  return await apiCall("/appointments", options)
}

export const updateAppointment = async (id, appointmentData) => {
  const options = {
    method: "PUT",
    body: JSON.stringify(appointmentData),
  }
  return await apiCall(`/appointments/${id}`, options)
}

export const deleteAppointment = async (id) => {
  const options = {
    method: "DELETE",
  }
  return await apiCall(`/appointments/${id}`, options)
}

// Notification API
export const fetchNotifications = async () => {
  const options = {
    method: "GET",
  }
  return await apiCall("/notifications", options)
}

export const markNotificationAsRead = async (id) => {
  const options = {
    method: "POST",
  }
  return await apiCall(`/notifications/${id}/read`, options)
}