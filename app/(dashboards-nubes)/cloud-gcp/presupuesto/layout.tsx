import { PresupuestoClientLayout } from './PresupuestoClientLayout';

export default function PresupuestoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <PresupuestoClientLayout>{children}</PresupuestoClientLayout>;
}
