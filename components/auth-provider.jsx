"use client"

import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  loginUser,
  registerUser,
  logoutUser,
  isAuthenticated,
  getCurrentUser,
  hasRole
} from "@/lib/api"

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  can: () => false
})

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Authentifizierungsstatus beim Initialisieren prüfen
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getCurrentUser()
          setUser(userData)
          setRole(userData.role)
        }
      } catch (error) {
        console.error("Auth-Check-Fehler:", error)
        // Bei Authentifizierungsproblemen ausloggen
        logoutUser()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      // Eingabevalidierung
      if (!email || !password) {
        throw new Error("E-Mail und Passwort sind erforderlich")
      }

      const response = await loginUser(email, password)

      // Benutzer und Rolle setzen
      setUser(response.user)
      setRole(response.user.role)

      // Rollenbasierte Weiterleitung
      switch (response.user.role) {
        case 'admin':
          router.push("/users")
          break
        case 'caregiver':
          router.push("/appointments")
          break
        case 'patient':
          router.push("/medications")
          break
        case 'relative':
          router.push("/notifications")
          break
        default:
          router.push("/dashboard")
      }

      toast({
        title: "Anmeldung erfolgreich",
        description: `Willkommen, ${response.user.name}!`
      })

      return response
    } catch (error) {
      console.error("Anmeldefehler:", error)
      toast({
        variant: "destructive",
        title: "Anmeldefehler",
        description: error.message || "Fehler bei der Anmeldung"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      // Eingabevalidierung
      if (!userData.email || !userData.password || !userData.name || !userData.role) {
        throw new Error("Bitte alle erforderlichen Felder ausfüllen")
      }

      const response = await registerUser(userData)

      toast({
        title: "Registrierung erfolgreich",
        description: "Sie können sich jetzt anmelden."
      })

      // Weiterleitung zur Anmeldeseite
      router.push("/login")

      return response
    } catch (error) {
      console.error("Registrierungsfehler:", error)
      toast({
        variant: "destructive",
        title: "Registrierungsfehler",
        description: error.message || "Fehler bei der Registrierung"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()

      // Zustand zurücksetzen
      setUser(null)
      setRole(null)

      // Zur Anmeldeseite weiterleiten
      router.push("/login")

      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      })
    } catch (error) {
      console.error("Abmeldefehler:", error)
      toast({
        variant: "destructive",
        title: "Abmeldefehler",
        description: error.message || "Fehler bei der Abmeldung"
      })
    }
  }

  // Rollenbasierte Zugriffskontrolle
  const can = (allowedRoles) => {
    return hasRole(allowedRoles)
  }

  return (
      <AuthContext.Provider
          value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            role,
            login,
            register,
            logout,
            can
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}