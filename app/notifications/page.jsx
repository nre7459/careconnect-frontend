"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { Bell, CheckCircle } from "lucide-react"
import { fetchNotifications, markNotificationAsRead } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await fetchNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Benachrichtigungen",
        description: "Bitte versuchen Sie es später erneut.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
      toast({
        title: "Als gelesen markiert",
        description: "Die Benachrichtigung wurde als gelesen markiert.",
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Benachrichtigung konnte nicht als gelesen markiert werden.",
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Benachrichtigungen</h1>
          <Button variant="outline" onClick={loadNotifications} disabled={isLoading}>
            Aktualisieren
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Benachrichtigungen werden geladen...</div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Keine Benachrichtigungen</h3>
              <p className="text-muted-foreground">Sie haben keine neuen Benachrichtigungen.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.isRead ? "opacity-75" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                    </div>
                    {!notification.isRead && <Badge variant="default">Neu</Badge>}
                  </div>
                  <CardDescription>{formatDate(notification.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{notification.message}</p>
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Als gelesen markieren
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

