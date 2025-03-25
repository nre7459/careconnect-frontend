"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { Users, PlusCircle, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchUsers, createUser, updateUser, deleteUser } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "patient",
  })
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, activeTab, searchQuery])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Benutzer",
        description: "Bitte versuchen Sie es später erneut.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let result = [...users]

    // Filter by role
    if (activeTab !== "all") {
      result = result.filter((user) => user.role === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
    }

    setFilteredUsers(result)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "patient",
    })
    setIsEditing(false)
    setCurrentUser(null)
  }

  const handleOpenDialog = (user) => {
    resetForm()

    if (user) {
      setIsEditing(true)
      setCurrentUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Don't show password
        phone: user.phone,
        address: user.address,
        role: user.role,
      })
    }

    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing && currentUser) {
        await updateUser(currentUser.id, formData)
        toast({
          title: "Benutzer aktualisiert",
          description: "Der Benutzer wurde erfolgreich aktualisiert.",
        })
      } else {
        await createUser(formData)
        toast({
          title: "Benutzer erstellt",
          description: "Der Benutzer wurde erfolgreich erstellt.",
        })
      }

      setIsDialogOpen(false)
      loadUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Der Benutzer konnte nicht gespeichert werden.",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?")) {
      try {
        await deleteUser(id)
        toast({
          title: "Benutzer gelöscht",
          description: "Der Benutzer wurde erfolgreich gelöscht.",
        })
        loadUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          variant: "destructive",
          title: "Fehler beim Löschen",
          description: "Der Benutzer konnte nicht gelöscht werden.",
        })
      }
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Admin</span>
      case "caregiver":
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Pflegekraft</span>
      case "patient":
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Patient</span>
      case "relative":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Angehöriger</span>
        )
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{role}</span>
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Benutzerverwaltung</h1>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuer Benutzer
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Suche nach Namen oder E-Mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button variant="outline" onClick={loadUsers} disabled={isLoading}>
              Aktualisieren
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Alle</TabsTrigger>
              <TabsTrigger value="caregiver">Pflegekräfte</TabsTrigger>
              <TabsTrigger value="patient">Patienten</TabsTrigger>
              <TabsTrigger value="relative">Angehörige</TabsTrigger>
              <TabsTrigger value="admin">Administratoren</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Benutzer werden geladen...</div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Keine Benutzer gefunden</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Keine Benutzer entsprechen Ihrer Suche." : "Es wurden keine Benutzer gefunden."}
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Benutzer hinzufügen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    {getRoleBadge(user.role)}
                  </div>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="text-muted-foreground">Telefon: {user.phone}</div>
                    <div className="text-muted-foreground">Adresse: {user.address}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(user)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Bearbeiten
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
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
              <DialogTitle>{isEditing ? "Benutzer bearbeiten" : "Neuen Benutzer erstellen"}</DialogTitle>
              <DialogDescription>
                Füllen Sie das Formular aus, um{" "}
                {isEditing ? "den Benutzer zu aktualisieren" : "einen neuen Benutzer zu erstellen"}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {!isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Passwort</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!isEditing}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rolle</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rolle auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="caregiver">Pflegekraft</SelectItem>
                      <SelectItem value="relative">Angehöriger</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button type="submit">{isEditing ? "Aktualisieren" : "Erstellen"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

