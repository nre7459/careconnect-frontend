"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Pill, Calendar, Bell, Users, Settings, LogOut, Menu, Moon, Sun } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Medikamente", href: "/medications", icon: Pill },
    { name: "Termine", href: "/appointments", icon: Calendar },
    { name: "Benachrichtigungen", href: "/notifications", icon: Bell },
    { name: "Benutzer", href: "/users", icon: Users },
  ]

  const userNavigation = [
    { name: "Einstellungen", href: "/settings", icon: Settings },
    { name: "Abmelden", href: "#", icon: LogOut, onClick: logout },
  ]

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r pt-5 bg-card overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold">CareConnect</span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="px-2 pb-4 space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={item.onClick}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
              >
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" />
                    Heller Modus
                  </>
                ) : (
                  <>
                    <Moon className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" />
                    Dunkler Modus
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={user?.name || "Benutzer"} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "Benutzer"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 pt-10">
            <div className="flex flex-col h-full">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <span className="text-xl font-bold">CareConnect</span>
              </div>
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="px-2 pb-4 space-y-1">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      closeMobileMenu()
                      item.onClick && item.onClick(e)
                    }}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    toggleTheme()
                    closeMobileMenu()
                  }}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
                >
                  {mounted && theme === "dark" ? (
                    <>
                      <Sun className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" />
                      Heller Modus
                    </>
                  ) : (
                    <>
                      <Moon className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" />
                      Dunkler Modus
                    </>
                  )}
                </button>
              </div>
              <div className="flex-shrink-0 flex border-t p-4 mt-auto">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user?.name || "Benutzer"} />
                    <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.name || "Benutzer"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="w-full h-16 flex items-center justify-between border-b px-4 md:px-6">
          <div className="md:hidden w-6" /> {/* Spacer for mobile */}
          <div className="hidden md:block">
            <h1 className="text-lg font-medium">CareConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border"
            >
              {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">{theme === "dark" ? "Heller Modus" : "Dunkler Modus"}</span>
            </button>
            <Avatar className="h-8 w-8 md:hidden">
              <AvatarImage src="" alt={user?.name || "Benutzer"} />
              <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/40">{children}</main>
      </div>
    </div>
  )
}

