import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Heart, Calendar, Pill, Bell, Users, UserCog } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">CareConnect</h1>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Anmelden
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm" className="bg-primary-foreground text-primary">
                  Registrieren
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Willkommen bei CareConnect</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Die umfassende Plattform für Pflegemanagement, die Pflegekräfte, Patienten und Angehörige verbindet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-primary" />
                  Medikamentenverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Verwalten Sie Medikamente, Dosierungen und Einnahmezeiten für Patienten.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Terminplanung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Planen und verwalten Sie Termine für Arztbesuche, Therapien und Pflegemaßnahmen.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Benutzerverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Verwalten Sie Benutzerprofile für Pflegekräfte, Patienten und Angehörige.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="mr-2 h-5 w-5 text-primary" />
                  Pflegekräfte-Zuweisung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Weisen Sie Pflegekräfte Patienten zu und verwalten Sie Pflegebeziehungen.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-primary" />
                  Benachrichtigungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Erhalten Sie wichtige Benachrichtigungen zu Terminen, Medikamenten und mehr.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Patientenbetreuung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Umfassende Patientenbetreuung mit Zugriff für Angehörige und Pflegekräfte.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bereit loszulegen?</h2>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Jetzt registrieren</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Anmelden
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CareConnect. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}

