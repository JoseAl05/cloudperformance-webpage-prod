import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from 'next/image'

export function HeroSection() {
    return (
        <section className="relative py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
                        Observabilidad, Análisis y Ahorro en un solo sitio.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
                        [Subheading describing how your platform helps detect savings opportunities across different cloud providers
                        and improves observability for engineering teams]
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" className="text-base">
                            [Start Free Trial]
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="text-base bg-transparent">
                            <Play className="mr-2 h-4 w-4" />
                            [Watch Demo]
                        </Button>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="mt-16 lg:mt-20">
                    <div className="mx-auto max-w-5xl">
                        <div className="rounded-xl bg-muted/50 p-2 ring-1 ring-border">
                            <div className="rounded-lg bg-card shadow-2xl">
                                <Image
                                    src="/cloudperformance-billing-region-example.png"
                                    alt="[Platform Dashboard Preview]"
                                    className="w-full rounded-lg"
                                    width={500}
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
