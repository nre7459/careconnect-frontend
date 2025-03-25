"use client"

import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the token
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // For demo purposes, we'll simulate a successful login without making an actual API call
      // In a real app, this would be an API call to validate credentials

      // Mock validation - in a real app this would be done by the server
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Create a mock token
      const mockToken = `mock-jwt-token-${Date.now()}`

      // Store token in localStorage
      localStorage.setItem("token", mockToken)

      // Create a mock user based on the email
      const mockUser = {
        id: 1,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email: email,
        role: "admin",
        phone: "+49 123 456789",
        address: "Musterstraße 1, 12345 Berlin",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // For demo purposes, we'll simulate a successful registration without making an actual API call
      // In a real app, this would be an API call to create a new user

      // Mock validation - in a real app this would be done by the server
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error("Name, email and password are required")
      }

      // Registration successful
      toast({
        title: "Registrierung erfolgreich",
        description: "Sie können sich jetzt anmelden.",
      })

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user data and token
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Redirect to login page
    router.push("/login")

    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

