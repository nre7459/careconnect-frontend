'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Heart, 
  Bell, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  Smartphone, 
  Users, 
  Clock,
  Shield,
  TrendingUp
} from "lucide-react"

export default function Home() {
  async function handleSurveySubmit(e) {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const data = {
      information_frequency: formData.get('information_frequency'),
      update_importance: formData.get('update_importance'),
      calling_frequency: formData.get('calling_frequency'),
      info_types: formData.getAll('info_types'),
      app_interest: formData.get('app_interest'),
      email: formData.get('email'),
      timestamp: new Date().toISOString()
    }
    
    // Validierung
    if (!data.information_frequency || !data.update_importance || !data.calling_frequency || !data.app_interest) {
      alert('Bitte beantworten Sie alle Pflichtfragen.')
      return
    }
    
    try {
      const response = await fetch('/api/send-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Vielen Dank für Ihre Teilnahme! Ihre Antworten wurden erfolgreich übermittelt.')
        e.target.reset() // Formular zurücksetzen
      } else {
        throw new Error(result.error || 'Unbekannter Fehler')
      }
    } catch (error) {
      console.error('Fehler beim Senden:', error)
      alert('Es gab einen Fehler beim Senden Ihrer Antworten. Bitte versuchen Sie es erneut.')
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                CareConnect
              </h1>
            </div>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Anmelden
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Kostenlos testen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            🚀 Neu: Proaktive Updates für Angehörige
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-green-900 bg-clip-text text-transparent leading-tight">
            Endlich wieder informiert sein
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sie fühlen sich unzureichend über den Zustand Ihrer Familienmitglieder informiert? 
            <span className="font-semibold text-blue-700"> CareConnect sorgt für regelmäßige, proaktive Updates</span> 
            direkt vom Pflegepersonal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="h-14 px-12 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
              onClick={() => document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="mr-2">Kurze Umfrage starten</span>
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="text-sm text-gray-500 mb-8">
            ✨ Nur 2 Minuten • ✨ Anonym • ✨ Hilft uns zu verstehen, was Sie wirklich brauchen
          </div>

          {/* Mock Screenshot Placeholder */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-200 shadow-glow">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">CareConnect Updates</h3>
                    <p className="text-blue-100">Maria Schmidt (Mama)</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white animate-pulse">Live</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="font-semibold">Täglicher Gesundheitsbericht</span>
                    <span className="text-sm text-blue-100">• Heute 14:30</span>
                  </div>
                  <p className="text-blue-50 leading-relaxed">
                    "Mama hat heute gut geschlafen und das Frühstück vollständig zu sich genommen. 
                    Der Blutdruck ist stabil bei 125/80. Sie freut sich auf Ihren Besuch morgen!"
                  </p>
                  <div className="flex items-center mt-3 text-sm text-blue-200">
                    <Users className="w-4 h-4 mr-1" />
                    Von: Pflegeteam Station 2
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold">Medikamenten-Update</span>
                    <span className="text-sm text-blue-100">• Heute 16:00</span>
                  </div>
                  <p className="text-blue-50 leading-relaxed">
                    "Medikament XYZ wurde heute pünktlich um 16:00 eingenommen. 
                    Keine Nebenwirkungen beobachtet."
                  </p>
                  <div className="flex items-center mt-3 text-sm text-blue-200">
                    <Clock className="w-4 h-4 mr-1" />
                    Nächste Einnahme: 20:00
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Antworten möglich</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-300">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-sm">Pflegeteam online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section id="survey-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Helfen Sie uns zu verstehen, was Sie wirklich brauchen
              </h2>
              <p className="text-lg text-gray-600">
                Nur 5 kurze Fragen - Ihre Antworten helfen uns, die beste Lösung für Angehörige zu entwickeln.
              </p>
            </div>

            <Card className="p-8 shadow-lg bg-white">
              <form className="space-y-8" onSubmit={handleSurveySubmit}>
                {/* Question 1 */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    1. Wie oft fühlen Sie sich über den Zustand Ihres Familienmitglieds in der Pflegeeinrichtung informiert?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="sehr_haeufig" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Sehr häufig - ich weiß immer, was los ist</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="haefig" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Häufig - meistens bin ich informiert</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="manchmal" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Manchmal - ich erfahre wichtige Dinge</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="selten" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Selten - ich fühle mich oft uninformiert</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="nie" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Nie - ich bin meist uninformiert</span>
                    </label>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    2. Wie wichtig wären Ihnen regelmäßige Updates vom Pflegepersonal?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="sehr_wichtig" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Sehr wichtig - das würde mir sehr helfen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="wichtig" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Wichtig - das wäre eine gute Ergänzung</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="neutral" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Neutral - ich bin unentschieden</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="weniger_wichtig" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Weniger wichtig - ich komme gut ohne aus</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="unwichtig" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Unwichtig - ich brauche das nicht</span>
                    </label>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    3. Wie oft rufen Sie das Pflegepersonal an, um nach Ihrem Familienmitglied zu fragen?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="taeglich" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Täglich oder fast täglich</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="mehrmals_woche" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Mehrmals pro Woche</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="einmal_woche" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Einmal pro Woche</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="selten" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Selten - nur bei besonderen Anlässen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="nie" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Nie - ich rufe nicht an</span>
                    </label>
                  </div>
                </div>

                {/* Question 4 */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    4. Welche Art von Informationen würden Sie am meisten schätzen?
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="gesundheitszustand" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Gesundheitszustand und Vitalwerte</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="medikamente" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Medikamenten-Einnahme</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="aktivitaeten" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Tägliche Aktivitäten und Mahlzeiten</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="besuche" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Besuche und soziale Kontakte</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="stimmung" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Stimmung und Wohlbefinden</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="notfaelle" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Notfälle und wichtige Ereignisse</span>
                    </label>
                  </div>
                </div>

                {/* Question 5 */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    5. Würden Sie eine App oder Website nutzen, die Ihnen automatisch Updates vom Pflegepersonal sendet?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="definitiv" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Definitiv - das würde mir sehr helfen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="wahrscheinlich" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Wahrscheinlich - das klingt gut</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="vielleicht" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Vielleicht - ich müsste es ausprobieren</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="unwahrscheinlich" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Unwahrscheinlich - ich bevorzuge Anrufe</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="nein" className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Nein - das wäre nichts für mich</span>
                    </label>
                  </div>
                </div>

                {/* Email for Results */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <label className="text-lg font-semibold text-gray-900">
                    Möchten Sie über die Ergebnisse informiert werden? (Optional)
                  </label>
                  <Input 
                    type="email" 
                    placeholder="Ihre E-Mail-Adresse (optional)" 
                    className="w-full h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                    name="email"
                  />
                  <p className="text-sm text-gray-500">
                    Wir senden Ihnen die Umfrage-Ergebnisse und informieren Sie, wenn CareConnect verfügbar ist.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-12 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
                  >
                    <span className="mr-2">Umfrage absenden</span>
                    <CheckCircle className="w-6 h-6" />
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Vielen Dank für Ihre Teilnahme! Ihre Antworten helfen uns, die beste Lösung zu entwickeln.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Das Problem, das wir lösen
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-red-200 bg-red-50">
              <CardHeader>
                  <CardTitle className="text-red-800 flex items-center">
                    <MessageSquare className="mr-2 h-6 w-6" />
                    Aktuelle Situation
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-3 text-red-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Unregelmäßige oder gar keine Informationen
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Ständiges Anrufen beim Pflegepersonal
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Sorgen und Unsicherheit über den Gesundheitszustand
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Verpasste wichtige Entwicklungen
                    </li>
                  </ul>
              </CardContent>
            </Card>

              <Card className="border-green-200 bg-green-50">
              <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <CheckCircle className="mr-2 h-6 w-6" />
                    Mit CareConnect
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-3 text-green-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Proaktive Updates direkt vom Pflegepersonal
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Regelmäßige Gesundheitsberichte
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Sofortige Benachrichtigungen bei wichtigen Ereignissen
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Direkter Chat mit dem Pflegeteam
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Wie CareConnect funktioniert
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="mb-4">1. Einfache Anmeldung</CardTitle>
              <CardDescription className="text-lg">
                Registrieren Sie sich kostenlos und verbinden Sie sich mit dem Pflegeteam Ihres Familienmitglieds.
                </CardDescription>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="mb-4">2. Automatische Updates</CardTitle>
              <CardDescription className="text-lg">
                Erhalten Sie regelmäßige Updates über den Gesundheitszustand, Medikamente und Aktivitäten.
                </CardDescription>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="mb-4">3. Direkte Kommunikation</CardTitle>
              <CardDescription className="text-lg">
                Chatten Sie direkt mit dem Pflegepersonal und stellen Sie Fragen zu jeder Zeit.
                </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">weniger Sorgen</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Erreichbarkeit</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3x</div>
              <div className="text-blue-100">schnellere Kommunikation</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Datenschutz</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-gray-900">
              Was Angehörige sagen
            </h2>
            
            <Card className="p-8 bg-white shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <blockquote className="text-xl text-gray-700 mb-6 italic">
                "Endlich weiß ich, wie es Mama geht, ohne ständig anrufen zu müssen. 
                Die täglichen Updates geben mir so viel Ruhe und Sicherheit."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M.S.
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Schmidt</div>
                  <div className="text-gray-600">Tochter von Pflegeheimbewohnerin</div>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Bereit für regelmäßige Updates?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Schließen Sie sich bereits 500+ zufriedenen Angehörigen an und 
            erhalten Sie proaktive Updates über Ihre Familienmitglieder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/register">
              <Button size="lg" className="h-14 px-12 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <span className="mr-2">Kostenlos registrieren</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-12 text-lg border-2">
                Bereits registriert?
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              DSGVO-konform
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              500+ Nutzer
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Immer aktuell
            </div>
          </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">CareConnect</h3>
              </div>
              <p className="text-gray-400">
                Die innovative Kommunikationsplattform für Pflegeeinrichtungen und Angehörige.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Preise</Link></li>
                <li><Link href="#" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Hilfe</Link></li>
                <li><Link href="#" className="hover:text-white">Kontakt</Link></li>
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Datenschutz</Link></li>
                <li><Link href="#" className="hover:text-white">AGB</Link></li>
                <li><Link href="#" className="hover:text-white">Impressum</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 CareConnect. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

