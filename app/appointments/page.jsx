"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { Calendar, PlusCircle, Pencil, Trash2, MapPin, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  })
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Termine",
        description: "Bitte versuchen Sie es später erneut.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
    })
    setIsEditing(false)
    setCurrentAppointment(null)
  }

  const handleOpenDialog = (appointment) => {
    resetForm()

    if (appointment) {
      setIsEditing(true)
      setCurrentAppointment(appointment)
      setFormData({
        title: appointment.title,
        description: appointment.description || "",
        date: appointment.date,
        time: appointment.time,
        location: appointment.location,
      })
    }

    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing && currentAppointment) {
        await updateAppointment(currentAppointment.id, formData)
        toast({
          title: "Termin aktualisiert",
          description: "Der Termin wurde erfolgreich aktualisiert.",
        })
      } else {
        await createAppointment(formData)
        toast({
          title: "Termin hinzugefügt",
          description: "Der Termin wurde erfolgreich hinzugefügt.",
        })
      }

      setIsDialogOpen(false)
      loadAppointments()
    } catch (error) {
      console.error("Error saving appointment:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Der Termin konnte nicht gespeichert werden.",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Sind Sie sicher, dass Sie diesen Termin löschen möchten?")) {
      try {
        await deleteAppointment(id)
        toast({
          title: "Termin gelöscht",
          description: "Der Termin wurde erfolgreich gelöscht.",
        })
        loadAppointments()
      } catch (error) {
        console.error("Error deleting appointment:", error)
        toast({
          variant: "destructive",
          title: "Fehler beim Löschen",
          description: "Der Termin konnte nicht gelöscht werden.",
        })
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Terminverwaltung</h1>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuer Termin
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Termine werden geladen...</div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Keine Termine gefunden</h3>
              <p className="text-muted-foreground mb-4">Sie haben noch keine Termine hinzugefügt.</p>
              <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Termin hinzufügen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{appointment.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {appointment.date}
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    {appointment.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointment.description && <p className="text-sm mb-2">{appointment.description}</p>}
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                    <span>{appointment.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(appointment)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Bearbeiten
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(appointment.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Löschen
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Termin bearbeiten" : "Neuen Termin hinzufügen"}</DialogTitle>
              <DialogDescription>
                Füllen Sie das Formular aus, um{" "}
                {isEditing ? "den Termin zu aktualisieren" : "einen neuen Termin hinzuzufügen"}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="z.B. Arzttermin"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Uhrzeit</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ort</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="z.B. Praxis Dr. Schmidt, Hauptstraße 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Zusätzliche Informationen zum Termin"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button type="submit">{isEditing ? "Aktualisieren" : "Hinzufügen"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

