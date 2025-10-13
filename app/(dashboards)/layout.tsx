
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/Sidebar"
import { ModeToggle } from '@/components/ModeToggle';
import { Navbar } from '@/components/Navbar';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken } from '@/lib/auth';
import Link from 'next/link';


export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    const payload = token ? await verifyAuthToken(token) : null;
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <SidebarComponent/>
            <SidebarInset className="min-w-0 ">
                <div className='flex items-center gap-3 p-5'>
                    {
                        payload ? (
                            <SidebarTrigger />
                        ) : (
                            <></>
                        )
                    }
                    <Navbar
                        payload={payload}
                    />
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
