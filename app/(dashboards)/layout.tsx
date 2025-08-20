import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/Sidebar"


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
            <SidebarComponent variant="inset" />
            <SidebarInset>
                <SidebarTrigger />
                {children}
            </SidebarInset>
        </SidebarProvider>
        // <SidebarProvider>
        //     <SidebarComponent />
        //     <main>
        //         <SidebarTrigger />
        //         <div className='m-10 w-full h-full'>
        //             {children}
        //         </div>
        //     </main>
        // </SidebarProvider>
    );
}
