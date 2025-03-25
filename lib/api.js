// Mock API functions for demonstration purposes
// In a real application, these would make actual API calls

// Configuration for API calls
const API_CONFIG = {
  // Set this to true to use mock data instead of actual API calls
  useMockData: false,
  // Base URL for API calls
  baseUrl: "http://localhost:4000",
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
  await delay(500)
  // In a real app, this would validate credentials and return a token
  return { token: "mock-jwt-token" }
}

export const registerUser = async (userData) => {
  await delay(500)
  // In a real app, this would create a new user
  return { success: true }
}

// User API
export const fetchUserData = async () => {
  await delay(500)
  // In a real app, this would fetch the current user's data
  return mockUsers[0]
}

export const fetchUsers = async () => {
  await delay(500)
  return [...mockUsers]
}

export const createUser = async (userData) => {
  await delay(500)
  // In a real app, this would create a new user
  return { id: Math.floor(Math.random() * 1000), ...userData }
}

export const updateUser = async (id, userData) => {
  await delay(500)
  // In a real app, this would update the user
  return { id, ...userData }
}

export const deleteUser = async (id) => {
  await delay(500)
  // In a real app, this would delete the user
  return { success: true }
}

// Medication API
export const fetchMedications = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNjQ2OTgyLCJleHAiOjE3NDMyNTE3ODJ9.4TeHjhpbaNDmU2o17cpD3h5n-EPgoF53cxpJLM0MjB0',
      'Content-Type': 'application/json'
    }
  }
  return await apiCall("/medications", options)
}


export const fetchUserMedications = async () => {
  await delay(500)
  // we do not have to implement this rn, because the application is currently only for admin user

  return mockMedications.filter((med) => med.patientId === 101)
}

export const createMedication = async (medicationData) => {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNjQ2OTgyLCJleHAiOjE3NDMyNTE3ODJ9.4TeHjhpbaNDmU2o17cpD3h5n-EPgoF53cxpJLM0MjB0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(medicationData)
  }
  return await apiCall("/medications", options)
}

export const updateMedication = async (id, medicationData) => {
  const options = {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNjQ2OTgyLCJleHAiOjE3NDMyNTE3ODJ9.4TeHjhpbaNDmU2o17cpD3h5n-EPgoF53cxpJLM0MjB0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(medicationData)
  }
  return await apiCall(`/medications/${id}`, options)
}

export const deleteMedication = async (id) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNjQ2OTgyLCJleHAiOjE3NDMyNTE3ODJ9.4TeHjhpbaNDmU2o17cpD3h5n-EPgoF53cxpJLM0MjB0',
      'Content-Type': 'application/json'
    },
  }
  return await apiCall(`/medications/${id}`, options)
}

// Appointment API
export const fetchAppointments = async () => {
  await delay(500)
  return [...mockAppointments]
}

export const createAppointment = async (appointmentData) => {
  await delay(500)
  // In a real app, this would create a new appointment
  return { id: Math.floor(Math.random() * 1000), ...appointmentData }
}

export const updateAppointment = async (id, appointmentData) => {
  await delay(500)
  // In a real app, this would update the appointment
  return { id, ...appointmentData }
}

export const deleteAppointment = async (id) => {
  await delay(500)
  // In a real app, this would delete the appointment
  return { success: true }
}

// Notification API
export const fetchNotifications = async () => {
  await delay(500)
  return [...mockNotifications]
}

export const markNotificationAsRead = async (id) => {
  await delay(500)
  // In a real app, this would mark the notification as read
  return { success: true }
}

