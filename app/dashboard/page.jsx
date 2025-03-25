"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { fetchUserMedications, fetchNotifications } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Calendar, Clock, Pill, Bell } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [medications, setMedications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated) return

      setIsLoading(true)
      try {
        // In a real app, these would be actual API calls
        const userMedications = await fetchUserMedications()
        setMedications(userMedications)

        const userNotifications = await fetchNotifications()
        setNotifications(userNotifications)

        // Mock appointments data
        setAppointments([
          {
            id: 1,
            title: "Arzttermin Dr. Schmidt",
            date: "2023-11-15",
            time: "14:30",
            location: "Praxis Dr. Schmidt, Hauptstraße 1",
          },
          {
            id: 2,
            title: "Physiotherapie",
            date: "2023-11-18",
            time: "10:00",
            location: "Physiotherapie Zentrum, Parkstraße 12",
          },
        ])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          variant: "destructive",
          title: "Fehler beim Laden der Daten",
          description: "Bitte versuchen Sie es später erneut.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [isAuthenticated, toast])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p>Bitte melden Sie sich an, um auf das Dashboard zuzugreifen.</p>
            <Button asChild className="mt-4">
              <Link href="/login">Zum Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Pill className="mr-2 h-5 w-5" />
                Medikamente
              </CardTitle>
              <CardDescription>Ihre aktuellen Medikamente</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Wird geladen...</p>
              ) : medications.length > 0 ? (
                <ul className="space-y-2">
                  {medications.slice(0, 3).map((med) => (
                    <li key={med.id} className="p-2 border rounded-md">
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-muted-foreground">{med.dosage}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Keine Medikamente gefunden</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/medications">Alle Medikamente anzeigen</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Termine
              </CardTitle>
              <CardDescription>Ihre nächsten Termine</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Wird geladen...</p>
              ) : appointments.length > 0 ? (
                <ul className="space-y-2">
                  {appointments.map((appointment) => (
                    <li key={appointment.id} className="p-2 border rounded-md">
                      <div className="font-medium">{appointment.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {appointment.date}
                        <Clock className="h-3 w-3 ml-2 mr-1" />
                        {appointment.time}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Keine Termine gefunden</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/appointments">Alle Termine anzeigen</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Benachrichtigungen
              </CardTitle>
              <CardDescription>Ihre neuesten Benachrichtigungen</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Wird geladen...</p>
              ) : notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.slice(0, 3).map((notification) => (
                    <li key={notification.id} className="p-2 border rounded-md">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">{notification.message}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Keine Benachrichtigungen gefunden</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/notifications">Alle Benachrichtigungen anzeigen</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Willkommen, {user?.name || "Benutzer"}</CardTitle>
            <CardDescription>Hier finden Sie eine Übersicht Ihrer wichtigsten Informationen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Persönliche Informationen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{user?.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
                    <p>{user?.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                    <p>{user?.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p>{user?.address || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href="/profile">Profil bearbeiten</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

