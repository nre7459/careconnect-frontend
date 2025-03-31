"use client"

import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { loginUser, registerUser, logoutUser, fetchUserData } from "@/lib/api" // Import API functions

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

  // Update the useEffect to check authentication status on mount
  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (token) {
          // If token exists, get user data
          const userData = await fetchUserData()
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // If there's an error, clear token and user data
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Update the login function to directly use the API
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Call the API for login
      const response = await loginUser(email, password)

      // Store user data
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update the register function to directly use the API
  const register = async (userData) => {
    setIsLoading(true)
    try {
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error("Name, email and password are required")
      }

      // Call the API for registration
      const response = await registerUser(userData)
      console.log("Registering user with data:", userData)
      console.log("Registration response:", response)
      toast({
        title: "Registrierung erfolgreich",
        description: "Sie können sich jetzt anmelden.",
      })
      return response
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update the logout function to use the logoutUser API call
  const logout = async () => {
    try {
      // Call the API for logout
      await logoutUser()

      // Clear user data
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")

      // Redirect to login page
      router.push("/login")

      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Abmelden",
        description: "Es gab ein Problem beim Abmelden.",
      })

      // Still clear user data on error
      setUser(null)
      router.push("/login")
    }
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

