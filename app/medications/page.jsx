"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { Pill, PlusCircle, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { fetchMedications, createMedication, updateMedication, deleteMedication } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function MedicationsPage() {
  const [medications, setMedications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentMedication, setCurrentMedication] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    description: "",
    patientId: "",
  })
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    loadMedications()
  }, [])

  const loadMedications = async () => {
    setIsLoading(true)
    try {
      const data = await fetchMedications()
      setMedications(data)
    } catch (error) {
      console.error("Error loading medications:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Medikamente",
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
      name: "",
      dosage: "",
      description: "",
      patientId: user?.id?.toString() || "",
    })
    setIsEditing(false)
    setCurrentMedication(null)
  }

  const handleOpenDialog = (medication) => {
    resetForm()

    if (medication) {
      setIsEditing(true)
      setCurrentMedication(medication)
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        description: medication.description,
        patientId: medication.patientId.toString(),
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        patientId: user?.id?.toString() || "",
      }))
    }

    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing && currentMedication) {
        await updateMedication(currentMedication.id, {
          ...formData,
          patientId: Number.parseInt(formData.patientId),
        })
        toast({
          title: "Medikament aktualisiert",
          description: "Das Medikament wurde erfolgreich aktualisiert.",
        })
      } else {
        await createMedication({
          ...formData,
          patientId: Number.parseInt(formData.patientId),
        })
        toast({
          title: "Medikament hinzugefügt",
          description: "Das Medikament wurde erfolgreich hinzugefügt.",
        })
      }

      setIsDialogOpen(false)
      loadMedications()
    } catch (error) {
      console.error("Error saving medication:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Das Medikament konnte nicht gespeichert werden.",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Sind Sie sicher, dass Sie dieses Medikament löschen möchten?")) {
      try {
        await deleteMedication(id)
        toast({
          title: "Medikament gelöscht",
          description: "Das Medikament wurde erfolgreich gelöscht.",
        })
        loadMedications()
      } catch (error) {
        console.error("Error deleting medication:", error)
        toast({
          variant: "destructive",
          title: "Fehler beim Löschen",
          description: "Das Medikament konnte nicht gelöscht werden.",
        })
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Medikamentenverwaltung</h1>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Neues Medikament
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Medikamente werden geladen...</div>
        ) : medications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Pill className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Keine Medikamente gefunden</h3>
              <p className="text-muted-foreground mb-4">Sie haben noch keine Medikamente hinzugefügt.</p>
              <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Medikament hinzufügen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Pill className="mr-2 h-5 w-5" />
                    {medication.name}
                  </CardTitle>
                  <CardDescription>{medication.dosage}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{medication.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(medication)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Bearbeiten
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(medication.id)}>
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
              <DialogTitle>{isEditing ? "Medikament bearbeiten" : "Neues Medikament hinzufügen"}</DialogTitle>
              <DialogDescription>
                Füllen Sie das Formular aus, um{" "}
                {isEditing ? "das Medikament zu aktualisieren" : "ein neues Medikament hinzuzufügen"}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="z.B. Ibuprofen"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosierung</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="z.B. 400mg, 3x täglich"
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
                    placeholder="Beschreibung und Hinweise"
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

