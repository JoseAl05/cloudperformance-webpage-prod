
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/Sidebar"
import { ModeToggle } from '@/components/ModeToggle';
import { Navbar } from '@/components/Navbar';


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <SidebarComponent />
            <SidebarInset className="min-w-0">
                <div className='flex items-center gap-3 p-5'>
                    <SidebarTrigger />
                    <Navbar />
                </div>
                <div className="flex flex-col">
                    <div className="@container/main flex flex-col gap-2">
                        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
