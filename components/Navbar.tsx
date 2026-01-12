"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"

interface NavbarProps {
    payload: unknown
}

export const Navbar = ({ payload }: NavbarProps) => {
    const { setTheme, theme } = useTheme()
    const username = (payload as unknown)?.username as string | undefined

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto w-full px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-9 w-9 rounded-2xl ring-1 ring-border shadow-sm overflow-hidden">
                            <Image
                                alt="logo-cloudperformance"
                                src="/logo-cloudperformance.png"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="font-semibold tracking-tight">Cloud Performance</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="h-9 rounded-full px-3 cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-4 w-4 dark:hidden" />
                            <Moon className="h-4 w-4 hidden dark:block" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {username ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-full pl-2 pr-3 gap-2"
                                    >
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                            {username.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className="text-sm">{username}</span>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 shadow-lg z-70"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href="/perfil" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <form action="/api/auth/logout" method="post" className="w-full">
                                            <button type="submit" className="w-full text-left py-1.5">
                                                Cerrar sesión
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="h-9 rounded-full">
                                    Iniciar sesión
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-px w-full bg-border" />
        </header>
    )
}
