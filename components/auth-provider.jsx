"use client"

import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { loginUser, registerUser, logoutUser, isAuthenticated, getCurrentUser } from "@/lib/api"

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
        if (isAuthenticated()) {
          const userData = getCurrentUser()
          setUser(userData)
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
      // Validate inputs before sending to the API
      if (!email || !password) {
        throw new Error("Email und Passwort sind erforderlich")
      }

      // Echte API-Anmeldung statt der simulierten
      const response = await loginUser(email, password)

      // Setzen des Benutzers aus der API-Antwort
      setUser(response.user)

      toast({
        title: "Erfolgreich angemeldet",
        description: "Sie wurden erfolgreich angemeldet.",
      })

      return response
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Anmeldefehler",
        description: error.message || "Fehler bei der Anmeldung. Bitte überprüfen Sie Ihre Anmeldedaten.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      // Validate inputs before sending to the API
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error("Name, E-Mail und Passwort sind erforderlich")
      }

      // Echte API-Registrierung statt der simulierten
      const response = await registerUser(userData)

      toast({
        title: "Registrierung erfolgreich",
        description: "Sie können sich jetzt anmelden.",
      })

      return response
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registrierungsfehler",
        description: error.message || "Fehler bei der Registrierung. Bitte versuchen Sie es erneut.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Echte API-Abmeldung statt der simulierten
      await logoutUser()

      // Aktualisieren des lokalen Zustands
      setUser(null)

      // Weiterleitung zur Anmeldeseite
      router.push("/login")

      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Abmeldefehler",
        description: "Fehler bei der Abmeldung. Bitte versuchen Sie es erneut.",
      })
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