"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Settings, Bell, User } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'

export const Navbar = () => {
    const { setTheme, theme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 gap-4">
                {/* Sidebar trigger for mobile */}
                {/* <SidebarTrigger className="cursor-pointer" /> */}

                {/* Logo/Brand - hidden on mobile when sidebar is present */}
                <div className="hidden md:flex items-center gap-2">
                    <Image
                        alt='logo-cloudperformance'
                        src='/logo-cloudperformance.png'
                        width={60}
                        height={60}
                    />
                    <span className="font-semibold text-foreground">Cloud Performance</span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-9 h-9 p-0 cursor-pointer"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Notifications */}
                    {/* <Button variant="ghost" size="sm" className="w-9 h-9 p-0 relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="sr-only">Notifications</span>
                    </Button> */}

                    {/* Settings */}
                    {/* <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                    </Button> */}

                    {/* User menu */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                                <User className="h-4 w-4" />
                                <span className="sr-only">User menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </div>
            </div>
        </header>
    )
}
