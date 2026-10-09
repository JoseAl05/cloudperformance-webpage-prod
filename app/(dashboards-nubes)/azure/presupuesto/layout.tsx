import { PresupuestoClientLayout } from './PresupuestoClientLayout';

// Control por plan (canAccessPresupuesto). La barra lateral y el navbar ya los pone el layout de la nube.
export default function PresupuestoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <PresupuestoClientLayout>{children}</PresupuestoClientLayout>;
}
