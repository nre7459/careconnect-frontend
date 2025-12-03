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
  TrendingUp,
  Stethoscope,
  UserCheck,
  ClipboardCheck
} from "lucide-react"

export default function PflegerPage() {
  const surveySectionRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSurveySubmit(e) {
    e.preventDefault()
    surveySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
    const formData = new FormData(e.target)
    const data = {
      years_experience: formData.get('years_experience'),
      education_level: formData.get('education_level'),
      work_setting: formData.get('work_setting'),
      communication_challenges: formData.getAll('communication_challenges'),
      time_for_documentation: formData.get('time_for_documentation'),
      app_usage: formData.get('app_usage'),
      desired_features: formData.getAll('desired_features'),
      app_interest: formData.get('app_interest'),
      email: formData.get('email'),
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      workplace: formData.get('workplace'),
      timestamp: new Date().toISOString(),
      target_group: 'pfleger'
    }
    
    // Validierung
    if (!data.years_experience || !data.education_level || !data.work_setting || !data.time_for_documentation || !data.app_usage || !data.app_interest) {
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
        e.target.reset()
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
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="CareConnect Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-[#0B57C2]">
                CareConnect
              </h1>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-[#0B57C2] font-medium transition-colors">
                Für Angehörige
              </Link>
              <Link href="/pfleger" className="text-[#0B57C2] font-semibold">
                Für Pflegekräfte
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B57C2] to-[#084A9E] text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Für Pflegekräfte
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Dokumentieren Sie einmal – informieren Sie alle
                </h1>
                <p className="text-xl text-blue-50 leading-relaxed">
                  Weniger Anrufe, mehr Pflegezeit. Ihre Dokumentation wird automatisch mit Angehörigen geteilt.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#survey-section">
                  <Button size="lg" className="h-14 px-8 bg-white text-[#0B57C2] hover:bg-blue-50 font-semibold text-lg shadow-xl">
                    Jetzt an Umfrage teilnehmen
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">Zeit sparen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">Rechtssicher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">Einfach bedienbar</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hero_pfleger.png"
                  alt="Pflegerin unterstützt Senior liebevoll"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              
              {/* Smartphone Mockup with Dashboard */}
              <div className="absolute -bottom-12 -right-12 lg:-bottom-12 lg:-right-12">
                {/* Phone Frame */}
                <div className="relative w-[220px] h-[440px] bg-gray-900 rounded-[2.5rem] shadow-2xl border-[6px] border-gray-800 p-2.5">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-10"></div>
                  
                  {/* Screen */}
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-white rounded-[1.8rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-9 bg-white/80 backdrop-blur-sm px-4 flex items-center justify-between text-[10px] font-semibold text-gray-900 z-20">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-2.5 border border-gray-900 rounded-sm">
                          <div className="w-1.5 h-full bg-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="absolute top-9 left-0 right-0 bg-white border-b border-gray-200 p-3 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0B57C2] rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xs">CareConnect Pro</h3>
                          <p className="text-[10px] text-gray-500">Dashboard</p>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="absolute top-24 left-0 right-0 bottom-0 p-3 space-y-2 overflow-hidden">
                      <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100 animate-slide-in">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserCheck className="w-4 h-4 text-[#0B57C2]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 text-[11px]">Patienten</p>
                              <span className="text-[9px] text-gray-500">12 aktiv</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                              <div className="flex-1 h-1 bg-[#0B57C2] rounded-full"></div>
                              <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="font-semibold text-gray-900 text-[11px]">Aufgaben</p>
                              <span className="text-[9px] text-gray-500">8 / 12</span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-tight">Vitalwerte • Medikamente</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="font-semibold text-gray-900 text-[11px]">Nachrichten</p>
                              <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">3</span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-tight">Angehörige haben Fragen</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#0B57C2] to-[#084A9E] rounded-xl p-3 shadow-md text-white">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-[11px]">Zeit gespart</p>
                          <Clock className="w-4 h-4 text-white/80" />
                        </div>
                        <p className="text-xl font-bold">45 Min</p>
                        <p className="text-[9px] text-white/80 mt-0.5">Heute</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition with Image */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1">
              <img
                src="/cc_3.png"
                alt="Pflegerin und Seniorin in herzlicher Umarmung"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Mehr Zeit für das Wesentliche: Ihre Patienten
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Wir wissen, wie viel Sie täglich leisten. CareConnect reduziert Ihren administrativen Aufwand und gibt Ihnen mehr Zeit für die Pflege.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#0B57C2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Zeit sparen</h3>
                    <p className="text-gray-600">Bis zu 60 Minuten pro Schicht durch weniger Anrufe und doppelte Dokumentation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#0B57C2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Asynchrone Kommunikation</h3>
                    <p className="text-gray-600">Beantworten Sie Nachrichten, wenn es in Ihren Arbeitsablauf passt</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#0B57C2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rechtssichere Dokumentation</h3>
                    <p className="text-gray-600">Alle Kommunikation ist nachvollziehbar und rechtssicher dokumentiert</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works with Image */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                So funktioniert CareConnect
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Integrieren Sie CareConnect nahtlos in Ihren Arbeitsalltag – ohne zusätzlichen Aufwand.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#0B57C2] text-white rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">Dokumentieren wie gewohnt</h3>
                    <p className="text-gray-600">Erfassen Sie Vitalwerte, Medikamente und Notizen in CareConnect</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#0B57C2] text-white rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">Automatisch teilen</h3>
                    <p className="text-gray-600">Relevante Informationen werden automatisch mit Angehörigen geteilt</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#0B57C2] text-white rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">Konzentrieren Sie sich auf Pflege</h3>
                    <p className="text-gray-600">Weniger Unterbrechungen, mehr Zeit für Ihre wichtige Arbeit</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/cc_4.png"
                alt="Gemeinsame Zeit zwischen Generationen"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Vorteile für Pflegekräfte</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-[#0B57C2]/10 text-[#0B57C2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Zeit sparen</h3>
              <p className="text-gray-600">Keine Unterbrechungen mehr durch Anrufe. Dokumentieren Sie einmal und alle werden informiert.</p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-[#0B57C2]/10 text-[#0B57C2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rechtssicherheit</h3>
              <p className="text-gray-600">Lückenlose Dokumentation und nachvollziehbare Kommunikation mit Zeitstempeln.</p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-blue-100">
              <div className="w-12 h-12 bg-[#0B57C2]/10 text-[#0B57C2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mehr Zeit für Pflege</h3>
              <p className="text-gray-600">Weniger administrative Aufgaben bedeutet mehr Zeit für Ihre Patienten.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section id="survey-section" ref={surveySectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Ihre Meinung als Pflegekraft ist wertvoll
              </h2>
              <p className="text-lg text-gray-600">
                Helfen Sie uns, CareConnect optimal auf Ihre Bedürfnisse abzustimmen.
              </p>
            </div>

            <Card className="p-8 shadow-lg bg-white border border-blue-100">
              <form className="space-y-8" onSubmit={handleSurveySubmit}>
                {/* Personal Information */}
                <div className="space-y-6 p-6 bg-blue-50/40 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Persönliche Angaben</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">
                        Name (optional)
                      </label>
                      <Input 
                        type="text" 
                        placeholder="Ihr vollständiger Name" 
                        className="w-full h-12 text-base border-2 border-gray-300 focus:border-[#0B57C2]"
                        name="full_name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">
                        Arbeitsort (optional)
                      </label>
                      <Input 
                        type="text" 
                        placeholder="Name der Pflegeeinrichtung" 
                        className="w-full h-12 text-base border-2 border-gray-300 focus:border-[#0B57C2]"
                        name="workplace"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900">
                      Telefonnummer (optional)
                    </label>
                    <Input 
                      type="tel" 
                      placeholder="Ihre Telefonnummer" 
                      className="w-full h-12 text-base border-2 border-gray-300 focus:border-[#0B57C2]"
                      name="phone"
                    />
                  </div>
                </div>

                {/* Question 1 - Experience */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    1. Wie lange arbeiten Sie bereits im Pflegebereich? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="years_experience" value="unter_1" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Unter 1 Jahr</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="years_experience" value="1_3" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">1-3 Jahre</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="years_experience" value="4_7" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">4-7 Jahre</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="years_experience" value="8_15" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">8-15 Jahre</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="years_experience" value="ueber_15" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Über 15 Jahre</span>
                    </label>
                  </div>
                </div>

                {/* Question 2 - Education */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    2. Welche Ausbildung haben Sie absolviert? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="education_level" value="pflegehelfer" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Pflegehelfer/in</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="education_level" value="pflegefachkraft" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Pflegefachkraft (3-jährige Ausbildung)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="education_level" value="bachelor" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Bachelor Pflegewissenschaft/Pflegemanagement</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="education_level" value="master" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Master oder höher</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="education_level" value="in_ausbildung" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Aktuell in Ausbildung/Studium</span>
                    </label>
                  </div>
                </div>

                {/* Question 3 - Work Setting */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    3. In welchem Bereich arbeiten Sie hauptsächlich? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="work_setting" value="pflegeheim" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Pflegeheim/Seniorenresidenz</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="work_setting" value="krankenhaus" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Krankenhaus</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="work_setting" value="ambulant" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Ambulanter Pflegedienst</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="work_setting" value="tagespflege" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Tagespflege</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="work_setting" value="sonstiges" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Sonstiges</span>
                    </label>
                  </div>
                </div>

                {/* Question 4 - Communication Challenges */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    4. Welche Herausforderungen erleben Sie bei der Kommunikation mit Angehörigen?
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="communication_challenges" value="zeitaufwand" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Zu zeitaufwändig</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="communication_challenges" value="unterbrechungen" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Ständige Unterbrechungen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="communication_challenges" value="wiederholungen" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Wiederholte Erklärungen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="communication_challenges" value="erreichbarkeit" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Schwierige Erreichbarkeit</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="communication_challenges" value="dokumentation" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Doppelte Dokumentation</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="communication_challenges" value="keine" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Keine Herausforderungen</span>
                    </label>
                  </div>
                </div>

                {/* Question 5 - Time for Documentation */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    5. Wie viel Zeit verbringen Sie täglich mit Dokumentation? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="time_for_documentation" value="unter_30min" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Unter 30 Minuten</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="time_for_documentation" value="30_60min" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">30-60 Minuten</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="time_for_documentation" value="1_2std" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">1-2 Stunden</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="time_for_documentation" value="ueber_2std" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Über 2 Stunden</span>
                    </label>
                  </div>
                </div>

                {/* Question 6 - App Usage */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    6. Wie sicher fühlen Sie sich im Umgang mit digitalen Tools/Apps? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_usage" value="sehr_sicher" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Sehr sicher - ich nutze täglich verschiedene Apps</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_usage" value="sicher" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Sicher - ich komme gut zurecht</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_usage" value="etwas_unsicher" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Etwas unsicher - ich brauche manchmal Hilfe</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_usage" value="unsicher" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Unsicher - neue Apps sind eine Herausforderung</span>
                    </label>
                  </div>
                </div>

                {/* Question 7 - Desired Features */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    7. Welche Funktionen wären für Sie am wichtigsten?
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="desired_features" value="schnelle_dokumentation" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Schnelle Dokumentation</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="desired_features" value="automatische_updates" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Automatische Updates an Angehörige</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="desired_features" value="chat_funktion" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Chat-Funktion</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="desired_features" value="spracherkennung" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Spracherkennung für Notizen</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="desired_features" value="medikamentenplan" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Digitaler Medikamentenplan</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input type="checkbox" name="desired_features" value="dienstplanung" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Dienstplanung & Übergaben</span>
                    </label>
                  </div>
                </div>

                {/* Question 8 - App Interest */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900">
                    8. Würden Sie eine App wie CareConnect in Ihrem Arbeitsalltag nutzen? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="definitiv" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Definitiv - das würde meine Arbeit erleichtern</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="wahrscheinlich" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Wahrscheinlich - wenn es intuitiv ist</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="vielleicht" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Vielleicht - ich müsste es ausprobieren</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="app_interest" value="unwahrscheinlich" className="w-4 h-4 text-[#0B57C2]" />
                      <span className="text-gray-700">Unwahrscheinlich - ich bevorzuge bisherige Methoden</span>
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
                    E-Mail-Adresse für Ergebnisse und Updates (Optional)
                  </label>
                  <Input 
                    type="email" 
                    placeholder="Ihre E-Mail-Adresse" 
                    className="w-full h-12 text-lg border-2 border-gray-300 focus:border-[#0B57C2]"
                    name="email"
                  />
                  <p className="text-sm text-gray-500">
                    Wir informieren Sie über die Umfrage-Ergebnisse und den Start von CareConnect.
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
                    Vielen Dank für Ihre Teilnahme! Ihre Expertise hilft uns, die beste Lösung zu entwickeln.
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
                  Ihre Erfahrungen aus der Praxis sind entscheidend für die Entwicklung einer Lösung, die wirklich funktioniert und Ihren Arbeitsalltag erleichtert.
                </p>
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
              <h4 className="font-semibold mb-4">Zielgruppen</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Für Angehörige</Link></li>
                <li><Link href="/pfleger" className="hover:text-white">Für Pflegekräfte</Link></li>
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

