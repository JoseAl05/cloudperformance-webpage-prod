import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Image from 'next/image'

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <Image
                        alt='cloudperformance-logo'
                        src='/logo-cloudperformance.png'
                        width={60}
                        height={60}
                    />
                    <span className="text-xl font-bold text-foreground">
                        Cloud Performance
                    </span>
                </div>

                <nav className="hidden md:flex items-center space-x-8">
                    <a
                        href="#features"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Características
                    </a>
                    {/* <a
                        href="#pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        [Pricing]
                    </a> */}
                    {/* <a
                        href="#about"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        [About]
                    </a> */}
                    <a
                        href="#contact"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contacto
                    </a>
                </nav>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" className="hidden cursor-pointer md:inline-flex">
                        Iniciar Sesión
                    </Button>
                    {/* <Button>[Get Started]</Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button> */}
                </div>
            </div>
        </header>
    )
}
