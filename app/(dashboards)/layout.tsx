import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/Sidebar"
import { ModeToggle } from '@/components/ModeToggle';


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
            <SidebarComponent variant="sidebar" />
            <SidebarInset>
                <SidebarTrigger />
                <ModeToggle />
                <div className='p-10'>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
