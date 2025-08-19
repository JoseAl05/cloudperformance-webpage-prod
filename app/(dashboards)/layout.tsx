import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/Sidebar"


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <SidebarProvider>
                <SidebarComponent />
                <div>
                    <SidebarTrigger />
                    <div className='m-10'>
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </main>
    );
}
