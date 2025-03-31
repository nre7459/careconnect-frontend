// API functions for CareConnect application
// Supports both real API calls and mock data for development

// Configuration for API calls
const API_CONFIG = {
  // Set this to true to use mock data instead of actual API calls
  useMockData: false,
  // Base URL for API calls
  baseUrl: "http://localhost:4000",
  // Auth token for API calls
  authToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQzNDI0ODM0LCJleHAiOjE3NDQwMjk2MzR9.kEoYHSHTYNuc8oNSX9W3hagaM42bDQ9PwOonDJr-Dto",
}

// Helper function to make API calls with proper error handling
const apiCall = async (endpoint, options = {}) => {
  if (API_CONFIG.useMockData) {
    // If using mock data, simulate API delay and return mock data
    await delay(500)
    return null // The specific mock data will be handled by each function
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.authToken}`,
        ...options.headers,
      },
    })
    console.log("repsones" + response)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error)
    throw error
  }
}

// Mock data
const mockMedications = [
  {
    id: 1,
    name: "Ibuprofen",
    dosage: "400mg, 3x täglich",
    description: "Schmerz- und Entzündungshemmer",
    patientId: 101,
  },
  {
    id: 2,
    name: "Paracetamol",
    dosage: "500mg, bei Bedarf",
    description: "Schmerzmittel und Fiebermittel",
    patientId: 101,
  },
  {
    id: 3,
    name: "Amlodipin",
    dosage: "5mg, 1x täglich morgens",
    description: "Blutdrucksenker",
    patientId: 102,
  },
]

const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@careconnect.de",
    phone: "+49 123 4567890",
    address: "Hauptstraße 1, 10115 Berlin",
    role: "admin",
  },
  {
    id: 2,
    name: "Maria Schmidt",
    email: "maria@careconnect.de",
    phone: "+49 123 4567891",
    address: "Pflegeweg 5, 10115 Berlin",
    role: "caregiver",
  },
  {
    id: 3,
    name: "Hans Müller",
    email: "hans@careconnect.de",
    phone: "+49 123 4567892",
    address: "Seniorenallee 10, 10115 Berlin",
    role: "patient",
  },
  {
    id: 4,
    name: "Lisa Müller",
    email: "lisa@careconnect.de",
    phone: "+49 123 4567893",
    address: "Familienstraße 15, 10115 Berlin",
    role: "relative",
  },
]

const mockNotifications = [
  {
    id: 1,
    title: "Medikamentenerinnerung",
    message: "Bitte nehmen Sie Ihre Medikamente um 14:00 Uhr ein.",
    isRead: false,
    createdAt: "2023-11-10T14:00:00Z",
  },
  {
    id: 2,
    title: "Neuer Termin",
    message: "Sie haben einen neuen Termin am 15.11.2023 um 10:30 Uhr bei Dr. Schmidt.",
    isRead: false,
    createdAt: "2023-11-09T09:15:00Z",
  },
  {
    id: 3,
    title: "Medikament fast aufgebraucht",
    message: "Ihr Vorrat an Ibuprofen reicht nur noch für 3 Tage. Bitte besorgen Sie Nachschub.",
    isRead: true,
    createdAt: "2023-11-08T11:30:00Z",
  },
]

const mockAppointments = [
  {
    id: 1,
    title: "Arzttermin Dr. Schmidt",
    description: "Routineuntersuchung",
    date: "2023-11-15",
    time: "14:30",
    location: "Praxis Dr. Schmidt, Hauptstraße 1",
  },
  {
    id: 2,
    title: "Physiotherapie",
    description: "Behandlung der Rückenschmerzen",
    date: "2023-11-18",
    time: "10:00",
    location: "Physiotherapie Zentrum, Parkstraße 12",
  },
]

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth API
export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }
  return await apiCall("/auth/login", options)
}

export const registerUser = async (userData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(userData),
  }
  return await apiCall("/auth/register", options)
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

