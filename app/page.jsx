'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
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
  const surveySectionRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSurveySubmit(e) {
    e.preventDefault()
    surveySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
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
      setIsSubmitting(true)
      const response = await fetch('/survey-api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const contentType = response.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')

      if (!response.ok) {
        if (isJson) {
          const payload = await response.json()
          throw new Error(payload?.error || `Serverfehler (${response.status})`)
        }

        const text = await response.text()
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error('Server hat HTML zurückgegeben. Prüfen Sie die Deployment-URL oder Middleware-Konfiguration.')
        }

        throw new Error(text.slice(0, 200) || `Serverfehler (${response.status})`)
      }

      if (!isJson) {
        const text = await response.text()
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error('Server hat HTML zurückgegeben. Prüfen Sie die Deployment-URL oder Middleware-Konfiguration.')
        }

        throw new Error(text.slice(0, 200) || `Unerwartetes Antwortformat (${contentType || 'unbekannt'})`)
      }

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
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="CareConnect Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-[#0B57C2]">
                CareConnect
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0B57C2] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Pflege verbindet Menschen.
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Doch oft fehlt der direkte Draht zwischen Pflegeheimen und Angehörigen aufgrund von alltäglichen Aufgaben. Viele Familien fühlen sich uninformiert und machen sich Sorgen um ihre Liebsten.
              </p>
              <div className="bg-white/15 border border-white/20 rounded-2xl p-6 text-base md:text-lg font-medium text-white shadow-lg">
                <strong>CareConnect schafft Nähe, Vertrauen und Transparenz.</strong>
                <p className="mt-2">Eine digitale Plattform, die Pflegeteams und Angehörige durch einfache Kommunikation, Benachrichtigungen und Updates verbindet – jederzeit und überall erreichbar.</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-5 text-base">
                <p className="flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Ihre Meinung zählt!</strong> Mit unserer Umfrage möchten wir herausfinden, ob Angehörige wirklich ein Bedürfnis nach regelmäßigen Updates haben. Ihre Antworten helfen uns, CareConnect genau auf Ihre Bedürfnisse abzustimmen.
                  </span>
                </p>
              </div>
              <div className="pt-4">
                <Link href="#survey-section">
                  <Button size="lg" className="h-12 px-8 bg-white text-[#0B57C2] hover:bg-blue-50 font-semibold">
                    An Umfrage teilnehmen
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
                  alt="Pflegekraft mit Smartphone"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-4 w-64 bg-white text-gray-900 rounded-3xl shadow-2xl border border-blue-100 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Benachrichtigungen</p>
                    <p className="text-lg font-bold">Heute <span className="text-sm font-normal">15:00</span></p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-[#0B57C2] rounded-md flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">To Do</p>
                    </div>
                    <p className="text-gray-600 text-xs">Medikamenteneinnahme</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-[#0B57C2] rounded-md flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">Chat</p>
                    </div>
                    <p className="text-gray-600 text-xs">Nachricht von Angehörigen</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-[#0B57C2] rounded-md flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">Medizinnotizen</p>
                    </div>
                    <p className="text-gray-600 text-xs">Agenda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Das Problem, das wir lösen
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border border-blue-100 bg-blue-50/60">
              <CardHeader>
                  <CardTitle className="text-[#0B57C2] flex items-center">
                    <MessageSquare className="mr-2 h-6 w-6" />
                    Aktuelle Situation
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-3 text-[#0B57C2]">
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">•</span>
                      Unregelmäßige oder gar keine Informationen
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">•</span>
                      Ständiges Anrufen beim Pflegepersonal
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">•</span>
                      Sorgen und Unsicherheit über den Gesundheitszustand
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">•</span>
                      Verpasste wichtige Entwicklungen
                    </li>
                  </ul>
              </CardContent>
            </Card>

              <Card className="border border-blue-100 bg-white">
              <CardHeader>
                  <CardTitle className="text-[#0B57C2] flex items-center">
                    <CheckCircle className="mr-2 h-6 w-6" />
                    Mit CareConnect
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">✓</span>
                      Proaktive Updates direkt vom Pflegepersonal
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">✓</span>
                      Regelmäßige Gesundheitsberichte
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">✓</span>
                      Sofortige Benachrichtigungen bei wichtigen Ereignissen
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57C2] mr-2">✓</span>
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
      <section className="py-16 bg-blue-50/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Warum CareConnect?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-[#0B57C2]/10 text-[#0B57C2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aktuelle Informationen</h3>
              <p className="text-gray-600">Pflege-Updates, Termine und Berichte landen automatisch bei den Angehörigen.</p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-[#0B57C2]/10 text-[#0B57C2] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direkter Austausch</h3>
              <p className="text-gray-600">Chat-Funktionen bringen Pflegeteam und Angehörige jederzeit zusammen.</p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-[#0B57C2]/10 text-[#0B57C2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Einfach starten</h3>
              <p className="text-gray-600">Intuitive Oberfläche, kein Installationsaufwand – sofort einsatzbereit.</p>
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
                Ihre Meinung zählt
              </h2>
              <p className="text-lg text-gray-600">
                Die Umfrage hilft uns, die Bedürfnisse von Angehörigen besser zu verstehen.
              </p>
            </div>

            <Card className="p-8 shadow-lg bg-white border border-blue-100">
              <form className="space-y-8" onSubmit={handleSurveySubmit}>
                {/* Question 1 */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    1. Wie oft fühlen Sie sich über den Zustand Ihres Familienmitglieds in der Pflegeeinrichtung informiert?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="sehr_haeufig" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Sehr häufig - ich weiß immer, was los ist</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="haefig" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Häufig - meistens bin ich informiert</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="manchmal" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Manchmal - ich erfahre wichtige Dinge</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="selten" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Selten - ich fühle mich oft uninformiert</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="information_frequency" value="nie" className="w-4 h-4 text-[#0B57C2]" />
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
                      <input type="radio" name="update_importance" value="sehr_wichtig" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Sehr wichtig - das würde mir sehr helfen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="wichtig" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Wichtig - das wäre eine gute Ergänzung</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="neutral" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Neutral - ich bin unentschieden</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="weniger_wichtig" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Weniger wichtig - ich komme gut ohne aus</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="update_importance" value="unwichtig" className="w-4 h-4 text-[#0B57C2]" />
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
                      <input type="radio" name="calling_frequency" value="taeglich" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Täglich oder fast täglich</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="mehrmals_woche" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Mehrmals pro Woche</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="einmal_woche" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Einmal pro Woche</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="selten" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Selten - nur bei besonderen Anlässen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="calling_frequency" value="nie" className="w-4 h-4 text-[#0B57C2]" />
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
                      <input type="checkbox" name="info_types" value="gesundheitszustand" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Gesundheitszustand und Vitalwerte</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="medikamente" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Medikamenten-Einnahme</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="aktivitaeten" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Tägliche Aktivitäten und Mahlzeiten</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="besuche" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Besuche und soziale Kontakte</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="stimmung" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Stimmung und Wohlbefinden</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="info_types" value="notfaelle" className="w-4 h-4 text-[#0B57C2]" />
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
                      <input type="radio" name="app_interest" value="definitiv" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Definitiv - das würde mir sehr helfen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="wahrscheinlich" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Wahrscheinlich - das klingt gut</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="vielleicht" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Vielleicht - ich müsste es ausprobieren</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="unwahrscheinlich" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Unwahrscheinlich - ich bevorzuge Anrufe</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="nein" className="w-4 h-4 text-[#0B57C2]" />
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
                    className="w-full h-12 text-lg border-2 border-gray-300 focus:border-[#0B57C2]"
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
                    className="h-14 px-12 text-lg bg-[#0B57C2] hover:bg-[#09419A] shadow-lg disabled:opacity-60 disabled:pointer-events-none"
                    disabled={isSubmitting}
                  >
                    <span className="mr-2">{isSubmitting ? 'Wird gesendet…' : 'Umfrage absenden'}</span>
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

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Wer sind wir?
            </h2>
            <Card className="p-8 bg-blue-50/60 border border-blue-100">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Wir sind drei Studenten an der <strong>FH Vorarlberg</strong> im Studiengang <strong>Digital Innovations</strong> (5. Semester).
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  CareConnect ist unser <strong>Innovationsprojekt</strong>, mit dem wir die Kommunikation zwischen Pflegeeinrichtungen und Angehörigen verbessern möchten.
                </p>
                <p className="text-base text-gray-600">
                  Ihre Teilnahme an dieser Umfrage hilft uns, die tatsächlichen Bedürfnisse von Angehörigen zu verstehen und eine Lösung zu entwickeln, die wirklich einen Unterschied macht.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-blue-50/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-gray-900">
              Was Angehörige sagen
            </h2>
            
            <Card className="p-8 bg-white shadow-lg border border-blue-100">
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
                <div className="w-12 h-12 bg-[#0B57C2] rounded-full flex items-center justify-center text-white font-bold mr-4">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="CareConnect Logo" className="w-8 h-8 brightness-0 invert" />
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
