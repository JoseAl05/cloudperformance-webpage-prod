'use client'

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import {
    Grid2X2,
    PieChart,
    Zap,
    Box,
    Computer,
    Database,
    Pyramid,
    ChevronDown,
    HandCoins,
    LineChart,
    TrendingUp,
    Server,
    HardDrive,
    Clock,
    Map,
    TrendingDown,
    Cylinder,
    Puzzle,
    MapPin,
    LayoutDashboard,
    Globe2,
    Monitor,
    ShoppingCart,
    Receipt,
    Boxes,
    Stars,
    Layers,
    Table,
    Diff,
    Scale,
    Workflow,
    CircleDollarSign,
    ShipWheel
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'
const useMenuStyles = () => {
    const { resolvedTheme } = useTheme()

    const getMenuItemClasses = (isActive: boolean) => {
        if (isActive) {
            return resolvedTheme === 'dark'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 text-white'
        }
        return resolvedTheme === 'dark'
            ? 'hover:bg-blue-800 hover:text-blue-100 text-gray-300'
            : 'hover:bg-blue-50 hover:text-blue-900 text-gray-700'
    }
    const getIconClasses = (isActive: boolean, defaultColor: string = 'text-blue-500') => {
        if (isActive) {
            return 'text-white'
        }
        return defaultColor
    }

    return { getMenuItemClasses, getIconClasses }
}

export const SidebarComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname();
    const { state, open } = useSidebar()
    const isExpanded = open || state === 'mobile'
    const { getMenuItemClasses, getIconClasses } = useMenuStyles();
    const [isMounted, setIsMounted] = useState(false);
    const [isAzure, setIsAzure] = useState(false);
    const [isAws, setIsAws] = useState(false);
    const [isGcp, setIsGcp] = useState(false);

    const provider = useMemo(() => {
        if (!pathname) return null
        if (pathname.startsWith('/aws')) return 'aws'
        if (pathname.startsWith('/azure')) return 'azure'
        if (pathname.startsWith('/gcp')) return 'gcp'
        return null
    }, [pathname])


    const topFacturaciones = [
        { label: 'Top Facturaciones por Región', href: '/aws/funciones/top-dolares-region', icon: Globe2, color: 'text-purple-500' },
        { label: 'Top Facturaciones por SO', href: '/aws/funciones/top-dolares-so', icon: Monitor, color: 'text-purple-500' },
        { label: 'Top Facturaciones por Tipo de Instancia', href: '/aws/funciones/top-dolares-por-tipo-de-instancia', icon: Server, color: 'text-teal-600' },
        { label: 'Top Facturaciones por Familia de Instancias', href: '/aws/funciones/top-dolares-por-familia-de-instancia', icon: Layers, color: 'text-indigo-600' },
        { label: 'Top Facturaciones por Tipo de Compra', href: '/aws/funciones/top-dolares-por-tipo-de-compra', icon: ShoppingCart, color: 'text-amber-600' },
        { label: 'Top Facturaciones por Tipo de Cobro', href: '/aws/funciones/top-dolares-por-tipo-de-cobro', icon: Receipt, color: 'text-red-500' },
        { label: 'Top Facturaciones por Recursos', href: '/aws/funciones/top-dolares-por-id-recurso', icon: Boxes, color: 'text-blue-500' },
        { label: 'Top Recursos', href: '/aws/funciones/top-recursos', icon: Stars, color: 'text-blue-500' },
    ]

    const consumoHorario = [
        { label: 'Instancias EC2', href: '/aws/funciones/consumo-ec2-horario-habil-vs-no-habil', icon: Clock, color: 'text-green-500' },
        { label: 'Instancias EC2 AutoscalingGroups', href: '/aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil', icon: TrendingUp, color: 'text-green-500' },
        { label: 'Instancias EC2 Nodos EKS', href: '/aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil', icon: Boxes, color: 'text-green-500' },
        { label: 'Instancias RDS Postgresql', href: '/aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS Mysql', href: '/aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS SQL Server', href: '/aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS Oracle', href: '/aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS MariaDB', href: '/aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil', icon: Database, color: 'text-green-500' },
    ]

    const consumoLoc = [
        { label: 'Instancias EC2', href: '/aws/funciones/avg-uso-loc-inst-ec2', icon: MapPin, color: 'text-green-500' },
        { label: 'Instancias RDS Postgresql', href: '/aws/funciones/avg-uso-loc-inst-rds-pg', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS Mysql', href: '/aws/funciones/avg-uso-loc-inst-rds-mysql', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS SQL Server', href: '/aws/funciones/avg-uso-loc-inst-rds-sqlserver', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS Oracle', href: '/aws/funciones/avg-uso-loc-inst-rds-oracle', icon: Database, color: 'text-green-500' },
        { label: 'Instancias RDS MariaDB', href: '/aws/funciones/avg-uso-loc-inst-rds-mariadb', icon: Database, color: 'text-green-500' },
    ]

    const infrausedAws = [
        { label: 'Instancias EC2 Antiguo', icon: Computer, href: '/aws/recursos/infrautilizadas/ec2' },
        { label: 'Instancias EC2', icon: Computer, href: '/aws/funciones/ec2-no-utilizados' },
        { label: 'Instancias EC2 AutoscalingGroups', icon: Computer, href: '/aws/recursos/infrautilizadas/autoscaling' },
        { label: 'Instancias EC2 Nodos EKS', icon: Computer, href: '/aws/recursos/infrautilizadas/eks' },
        { label: 'Vólumenes EBS', icon: HardDrive, href: '/aws/funciones/ebs-no-utilizados' },
        { label: 'Nat Gateways', icon: Workflow, href: '/aws/funciones/nat-gateways-no-utilizados' },
        { label: 'Loadbalancers V2', icon: Workflow, href: '/aws/funciones/elbv2-no-utilizados' },
        { label: 'Route 53', icon: Workflow, href: '/aws/funciones/routes53-no-utilizados' }
    ]

    const consumeSubItems = [
        { label: 'Instancias EC2', icon: Computer, href: '/aws/consumos/ec2' },
        { label: 'Instancias EC2 AutoscalingGroups', icon: Computer, href: '/aws/consumos/asg' },
        { label: 'Instancias EC2 Nodos EKS', icon: Computer, href: '/aws/consumos/eks' },
        { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/consumos/rds/postgresql' },
        { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/consumos/rds/mysql' },
        { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/consumos/rds/oracle' },
        { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/consumos/rds/sqlserver' },
        { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/consumos/rds/mariadb' },
        { label: 'Nat Gateways', icon: Workflow, href: '/aws/consumos/nat_gateways' },
        { label: 'Loadbalancers V2', icon: Workflow, href: '/aws/consumos/elbv2' }
    ]

    const AwsRoutes = {
        routes: [
            { label: 'Inicio', icon: LayoutDashboard, href: '/aws' },
            { label: 'Tendencia Facturación', icon: Grid2X2, href: '/aws/facturacion/tendencia-facturacion' },
            { label: 'Quotas', icon: PieChart, href: '/aws/quotas' },
            { label: 'Eventos', icon: Zap, href: '/aws/eventos' },
            { label: 'Vista Advisor', icon: Pyramid, href: '/aws/advisor' },
            { label: 'Vista Saving Plans', icon: HandCoins, href: '/aws/saving-plan' },
        ],
        recursos: [
            { label: 'Instancias EC2', icon: Computer, href: '/aws/recursos/instancias-ec2', color: 'text-orange-500' },
            { label: 'Auto Scaling groups', icon: TrendingUp, href: '/aws/recursos/autoscaling-groups', color: 'text-emerald-500' },
            { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/recursos/instancias-rds-pg', color: 'text-blue-600' },
            { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/recursos/instancias-rds-mysql', color: 'text-emerald-600' },
            { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/recursos/instancias-rds-sqlserver', color: 'text-purple-600' },
            { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/recursos/instancias-rds-oracle', color: 'text-red-600' },
            { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/recursos/instancias-rds-mariadb', color: 'text-amber-600' },
        ],
        consumes: [{ label: 'Consumos', subItems: consumeSubItems, icon: Zap }],
        funciones: [
            { label: 'Top Facturaciones', subItems: topFacturaciones, icon: Zap },
            { label: 'Consumo horario hábil vs no hábil', subItems: consumoHorario, icon: Clock },
            { label: 'Consumo por Localización', subItems: consumoLoc, icon: Map },
            { label: 'Recursos no utilizados', subItems: infrausedAws, icon: TrendingDown },
            { label: 'Spot vs Vm', href: '/aws/funciones/spot-vs-vm', icon: Zap },
            { label: 'Top S3 Buckets', href: '/aws/funciones/top-s3-buckets', icon: Box },
            { label: 'Variación consumo de recursos', href: '/aws/funciones/variacion-tendencia-uso-de-recursos', icon: Diff },
        ],
    }

    const infrausedAzure = [
        { label: 'VM', icon: Computer, href: '/azure/funciones/unused-resources/vm' },
        { label: 'VMSS', icon: Computer, href: '/azure/funciones/unused-resources/vmss' },
        { label: 'Extensiones VM', icon: Puzzle, href: '/azure/funciones/unused-resources/extensions' },
        { label: 'Loadbalancers', icon: Scale, href: '/azure/funciones/loadbalancers-infrautilizados' },
        { label: 'Applications Gateway', icon: Workflow, href: '/azure/funciones/apps-gateway-infrautilizados' },
        { label: 'Traffic Managers', icon: Workflow, href: '/azure/funciones/traffic-managers-infrautilizados' }
    ]
    const consumeSubItemsAzure = [
        { label: 'Maquinas Virtuales', icon: Computer, href: '/azure/consumo-vm' },
        { label: 'Base de Datos', icon: Database, href: '/azure/consumo-db' },
        { label: 'Nodos', icon: Server, href: '/azure/consumo-nodos' },
        { label: 'Applications Gateway', icon: Workflow, href: '/azure/consumo-apps-gateway' }
    ]

    const AzureRoutes = {

        routes: [
            { label: 'Inicio', icon: LayoutDashboard, href: '/azure' },
            { label: 'Tendencia Facturación', icon: Grid2X2, href: '/azure/facturacion/tendencia-pago-por-uso' },
            { label: 'Quotas', icon: PieChart, href: '/azure/quotas' },
            { label: 'Deployments', icon: Zap, href: '/azure/deployments' },
            { label: 'Items Azure', icon: Table, href: '/azure/tables-azure/tablas-item-azure' },
            { label: 'Vista Advisor', icon: Pyramid, href: '/azure/advisor' },
            { label: 'Vista Saving Plans', icon: HandCoins, href: '/azure/saving-plan' },
            { label: 'Presupuestos', icon: CircleDollarSign, href: '/azure/presupuesto' },
        ],
        recursos: [
            { label: 'Maquinas Virtuales', icon: Computer, href: '/azure/recursos-vm' },
            { label: 'Traffic Managers', icon: Workflow, href: '/azure/recursos-traffic-manager' }
        ],
        consumes: [{ label: 'Consumos', subItems: consumeSubItemsAzure, icon: Zap }],
        funciones: [
            { label: 'Blob Storage vs Storage General', icon: Cylinder, href: '/azure/funciones/blob-vs-storage-general' },
            { label: 'Variación Storage', icon: Cylinder, href: '/azure/funciones/variacion-storage' },
            { label: 'Top 10 uso de recursos', icon: LineChart, href: '/azure/funciones/top-10-recursos-uso' },
            { label: 'Incremento Uso de Recursos', icon: LineChart, href: '/azure/funciones/incremento-top-recursos-uso' },
            { label: 'Spot vs Regular VMs', icon: Computer, href: '/azure/funciones/spot-vs-regular-vm' },
            { label: 'Promedio de uso por localización', icon: MapPin, href: '/azure/funciones/promedio-por-localizacion' },
            { label: 'Consumo horario hábil vs no hábil', icon: Clock, href: '/azure/funciones/analisis-vms-horario' },
            { label: 'Recursos no utilizados', subItems: infrausedAzure, icon: TrendingDown }
        ],
    }

    // CORREGIDO: Rutas apuntando a /gcp en lugar de /gpc
    const infrausedGCP = [
        { label: 'Compute Engine', icon: Computer, href: '/gcp/funciones/unused-resources/compute-engine' },
        { label: 'Instance Groups', icon: Boxes, href: '/gcp/funciones/unused-resources/instance-groups' },
        { label: 'Clusters GKE', icon: Boxes, href: '/gcp/funciones/unused-resources/clusters-gke' },
        { label: 'Discos Persistentes', icon: HardDrive, href: '/gcp/funciones/unused-resources/persistent-disks' },
        // { label: 'Load Balancers', icon: Scale, href: '/gcp/funciones/loadbalancers-infrautilizados' },
        // { label: 'HTTP(S) LB (Ingress)', icon: Workflow, href: '/gcp/funciones/https-lb-infrautilizados' },
        // { label: 'Cloud DNS', icon: Globe2, href: '/gcp/funciones/cloud-dns-infrautilizados' }
    ]

    const consumeSubItemsGCP = [
        { label: 'Compute Engine', icon: Computer, href: '/gcp/consumos/compute-engine' },
        { label: 'Instances Group', icon: Boxes, href: '/gcp/consumos/instances-group' },
        { label: 'Clusters GKE', icon: Server, href: '/gcp/consumos/clusters-gke' },
        { label: 'Cloud SQL / Spanner', icon: Database, href: '/gcp/consumos/cloud-sql' },
        // { label: 'Cloud Load Balancing', icon: Workflow, href: '/gcp/consumo-clb' }
    ]

    const workingNonWorkingItemsGCP = [
        { label: 'Compute Engine', icon: Computer, href: '/gcp/funciones/uso-horario-habil-no-habil/compute-engines' },
        { label: 'Instance Groups', icon: Boxes, href: '/gcp/funciones/uso-horario-habil-no-habil/instance-group' },
        { label: 'Clusters GKE', icon: Server, href: '/gcp/funciones/uso-horario-habil-no-habil/cluster-gke' },
        { label: 'Cloud SQL Postgres', icon: Database, href: '/gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql' },
        { label: 'Cloud SQL Mysql', icon: Database, href: '/gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql' },
        { label: 'Cloud SQL Sql Server', icon: Database, href: '/gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver' },

    ]

    const GCPRoutes = {
        routes: [
            { label: 'Inicio', icon: LayoutDashboard, href: '/gcp' },
            { label: 'Tendencia Facturación', icon: Grid2X2, href: '/gcp/facturacion/tendencia-facturacion' },
            { label: 'Quotas', icon: PieChart, href: '/gcp/quotas' },
            //{ label: 'Deployments', icon: Zap, href: '/gcp/deployments' },
            //{ label: 'Items GCP', icon: Table, href: '/gcp/tables-gcp/tablas-item-gcp' },
            { label: 'Recommender', icon: Pyramid, href: '/gcp/recommender' },
            // { label: 'Vista Saving Plans', icon: HandCoins, href: '/gcp/saving-plan' },
            // { label: 'Presupuestos', icon: CircleDollarSign, href: '/gcp/presupuesto' },
        ],
        recursos: [
            { label: 'Compute Engine', icon: Computer, href: '/gcp/recursos/compute-engine' },
            { label: 'Instance Groups', icon: Workflow, href: '/gcp/recursos/instance-groups' },
            { label: 'Clusters GKE', icon: ShipWheel, href: '/gcp/recursos/clusters-gke' },
            { label: 'Cloud SQL Postgres', icon: Database, href: '/gcp/recursos/cloudsql/postgresql' },
            { label: 'Cloud SQL Mysql', icon: Database, href: '/gcp/recursos/cloudsql/mysql' },
            { label: 'Cloud SQL Sql Server', icon: Database, href: '/gcp/recursos/cloudsql/sqlserver' },
        ],
        consumes: [{ label: 'Consumos', subItems: consumeSubItemsGCP, icon: Zap }],
        funciones: [
            // { label: 'Storage Class Analysis', icon: Cylinder, href: '/gcp/funciones/storage-classes-analysis' },
            // { label: 'Variación Storage', icon: Cylinder, href: '/gcp/funciones/variacion-storage' },
            // { label: 'Top 10 uso de recursos', icon: LineChart, href: '/gcp/funciones/top-10-recursos-uso' },
            { label: 'Top Cloud Storage Buckets', icon: LineChart, href: '/gcp/funciones/top-cloud-storage-buckets' },
            // { label: 'Incremento Uso de Recursos', icon: LineChart, href: '/gcp/funciones/incremento-top-recursos-uso' },
            { label: 'Spot vs Standard VMs', icon: Computer, href: '/gcp/funciones/spot-vs-standard-vm' },
            { label: 'Promedio de uso por región', icon: MapPin, href: '/gcp/funciones/uso-costo-por-localizacion' },
            { label: 'Consumo horario hábil vs no hábil', subItems: workingNonWorkingItemsGCP, icon: Clock },
            // { label: 'Promedio de uso por región', icon: MapPin, href: '/gcp/funciones/promedio-por-localizacion' },
            // { label: 'Consumo horario hábil vs no hábil', icon: Clock, href: '/gcp/funciones/analisis-vms-horario' },
            { label: 'Recursos no utilizados', subItems: infrausedGCP, icon: TrendingDown }
        ],
    }


    const { routes, recursos, consumes, funciones } = useMemo(() => {
        if (isAws) return AwsRoutes
        if (isAzure) return AzureRoutes
        if (isGcp) return GCPRoutes
        return { routes: [], recursos: [], consumes: [], funciones: [] }
    }, [isAws, isAzure, isGcp]);

    const defaultOpenRecursos = useMemo(
        () => recursos.some((r) => r.href === pathname),
        [recursos, pathname]
    )
    const [isRecursosOpen, setIsRecursosOpen] = useState(defaultOpenRecursos)

    const defaultOpenFunciones = useMemo(
        () => funciones.some((f) => (f.href && f.href === pathname) || f.subItems?.some((s) => s.href === pathname)),
        [funciones, pathname]
    )
    const [isFuncionesOpen, setIsFuncionesOpen] = useState(defaultOpenFunciones)

    const defaultOpenConsumes = useMemo(
        () => consumes.some((c) => c.subItems?.some((s) => s.href === pathname)),
        [consumes, pathname]
    )
    const [isConsumesOpen, setIsConsumesOpen] = useState(defaultOpenConsumes)

    const funcionesConSub = funciones.filter((f) => f.subItems?.length)
    const funcionesSimples = funciones.filter((f) => f.href)

    const initialOpenByGroup = useMemo(() => {
        return funcionesConSub.reduce<Record<string, boolean>>((acc, grupo) => {
            acc[grupo.label] = grupo.subItems?.some((sub) => sub.href === pathname) ?? false
            return acc
        }, {})
    }, [funcionesConSub, pathname])


    const [openByGroup, setOpenByGroup] = useState<Record<string, boolean>>(initialOpenByGroup)

    useEffect(() => {
        if (state === 'collapsed' && state !== 'mobile') {
            setIsRecursosOpen(false)
            setIsFuncionesOpen(false)
            setOpenByGroup(prev => {
                const closed = Object.fromEntries(Object.keys(prev).map(k => [k, false]))
                return closed
            })
        }
    }, [state])

    useEffect(() => {
        setIsAws(pathname.startsWith('/aws'))
        setIsAzure(pathname.startsWith('/azure'))
        setIsGcp(pathname.startsWith('/gcp'))
    }, [pathname])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex flex-col items-center gap-2 py-4">
                <Image
                    width={100}
                    height={100}
                    alt="Logo Intac"
                    src="/logo-intac.svg"
                    className="object-cover"
                />
                {open && (
                    <span className="text-xl font-bold tracking-wide">
                        Cloud Performance
                    </span>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {routes.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150',
                                                getMenuItemClasses(isActive)
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5", getIconClasses(isActive))} />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        {isExpanded && (
                            <>
                                <SidebarMenuItem className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                                    <Collapsible open={isConsumesOpen} onOpenChange={setIsConsumesOpen}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <LineChart className="h-5 w-5 text-blue-500" />
                                                    <span className="text-sm font-medium">Consumos</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isConsumesOpen && 'rotate-180'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
                                                "mt-1 space-y-1",
                                            )}
                                        >
                                            {(consumes[0]?.subItems ?? []).map((sub) => {
                                                const isSubActive = pathname === sub.href
                                                return (
                                                    <Link
                                                        key={sub.label}
                                                        href={sub.href}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-8 border-l transition-all duration-200 ease-in-out transform",
                                                            getMenuItemClasses(isSubActive),
                                                            "border-blue-200 dark:border-blue-800",
                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                        )}
                                                    >
                                                        <sub.icon className={cn("h-4 w-4 transition-transform duration-200 group-hover:scale-110", getIconClasses(isSubActive, "text-blue-400"))} />
                                                        <span className="text-sm">{sub.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                                <SidebarMenuItem className="mt-2">
                                    <Collapsible open={isFuncionesOpen} onOpenChange={setIsFuncionesOpen}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-5 w-5 text-blue-500" />
                                                    <span className="text-sm font-medium">Funciones</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isFuncionesOpen && 'rotate-180'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            {funcionesConSub.map((grupo) => {
                                                const isGroupOpen = openByGroup[grupo.label] ?? false
                                                return (
                                                    <Collapsible
                                                        key={grupo.label}
                                                        open={isGroupOpen}
                                                        onOpenChange={(open) =>
                                                            setOpenByGroup(prev => ({ ...prev, [grupo.label]: open }))
                                                        }
                                                    >
                                                        <CollapsibleTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="w-full flex items-center justify-between px-3 py-2 pl-6 rounded-md cursor-pointer bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:translate-x-1"
                                                                variant='default'
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <grupo.icon className="h-5 w-5 text-blue-400" />
                                                                    <span className="text-sm font-medium">
                                                                        {grupo.label}
                                                                    </span>
                                                                </div>
                                                                <ChevronDown
                                                                    className={cn(
                                                                        'h-4 w-4 transition-transform duration-300 ease-in-out',
                                                                        isGroupOpen && 'rotate-180'
                                                                    )}
                                                                />
                                                            </button>
                                                        </CollapsibleTrigger>

                                                        <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                            {grupo.subItems!.map((sub) => {
                                                                const isSubActive = pathname === sub.href
                                                                return (
                                                                    <Link
                                                                        key={sub.label}
                                                                        href={sub.href}
                                                                        className={cn(
                                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-10 border-l-2 transition-all duration-200 ease-in-out transform border-current",
                                                                            sub.color,
                                                                            getMenuItemClasses(isSubActive),
                                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                                        )}
                                                                    >
                                                                        <sub.icon className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                                                                        <span className="text-sm">{sub.label}</span>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                )
                                            })}
                                            {funcionesSimples.map((f) => {
                                                const isActive = pathname === f.href
                                                return (
                                                    <Link
                                                        key={f.label}
                                                        href={f.href!}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-6 transition-all duration-200 ease-in-out transform",
                                                            getMenuItemClasses(isActive),
                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                        )}
                                                    >
                                                        <f.icon className={cn("h-4 w-4", getIconClasses(isActive, "text-blue-400"))} />
                                                        <span className="text-sm">{f.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                                <SidebarMenuItem className="mt-2">
                                    <Collapsible open={isRecursosOpen} onOpenChange={setIsRecursosOpen}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="w-full justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Box className="h-5 w-5 text-blue-500" />
                                                    <span className="text-sm font-medium">Recursos</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isRecursosOpen && 'rotate-180'
                                                    )}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            {recursos.map((subItem) => {
                                                const isActive = pathname === subItem.href
                                                return (
                                                    <Link
                                                        key={subItem.label}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer pl-8 border-l transition-all duration-200 ease-in-out transform",
                                                            getMenuItemClasses(isActive),
                                                            "border-blue-200 dark:border-blue-800",
                                                            "hover:scale-[1.02] hover:translate-x-1",
                                                        )}
                                                    >
                                                        <subItem.icon className={cn("h-4 w-4 transition-transform duration-200 hover:scale-110", getIconClasses(isActive, subItem.color || "text-blue-400"))} />
                                                        <span className="text-sm">{subItem.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
