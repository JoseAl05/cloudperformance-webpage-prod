'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
    Box,
    Boxes,
    ChartNetwork,
    CircleDollarSign,
    Clock,
    Computer,
    Cylinder,
    Database,
    Diff,
    DollarSign,
    Globe,
    Globe2,
    Grid2X2,
    HandCoins,
    HardDrive,
    Layers,
    LayoutDashboard,
    LineChart,
    Map,
    MapPin,
    Monitor,
    Network,
    PieChart,
    Puzzle,
    Pyramid,
    Receipt,
    Scale,
    Server,
    Share2,
    ShipWheel,
    ShoppingCart,
    Split,
    Stars,
    Table,
    Tags,
    TrendingDown,
    TrendingUp,
    Workflow,
    Zap,
} from 'lucide-react'
import { SidebarNav, resolveNav, type NavItem } from '@/components/SidebarNav'
import type { Sidebar } from '@/components/ui/sidebar'

type Provider = 'aws' | 'azure' | 'gcp' | 'amazon-bedrock'

const NAV: Record<Provider, NavItem[]> = {
    aws: [
        { label: 'Inicio', icon: LayoutDashboard, href: '/aws' },
        { label: 'Tendencia Facturación', icon: Grid2X2, href: '/aws/facturacion/tendencia-facturacion' },
        { label: 'Quotas', icon: PieChart, href: '/aws/quotas' },
        { label: 'Eventos', icon: Zap, href: '/aws/eventos' },
        { label: 'Vista Advisor', icon: Pyramid, href: '/aws/advisor' },
        { label: 'Vista Ejecuciones de Recomendaciones', icon: Pyramid, href: '/aws/advisor/rec-statuses' },
        { label: 'Vista Saving Plans', icon: HandCoins, href: '/aws/saving-plan' },
        { label: 'Presupuestos', icon: CircleDollarSign, href: '/aws/presupuesto' },
        { label: 'Métricas Finops', icon: ChartNetwork, href: '/aws/finops-metrics-ai' },
        { label: 'Mantenedor de Etiquetas (Tags)', icon: Tags, href: '/aws/tags' },
        {
            label: 'Consumos',
            icon: LineChart,
            items: [
                { label: 'Instancias EC2', icon: Computer, href: '/aws/consumos/ec2' },
                { label: 'Instancias EC2 AutoscalingGroups', icon: Computer, href: '/aws/consumos/asg' },
                { label: 'Instancias EC2 Nodos EKS', icon: Computer, href: '/aws/consumos/eks' },
                { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/consumos/rds/postgresql' },
                { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/consumos/rds/mysql' },
                { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/consumos/rds/oracle' },
                { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/consumos/rds/sqlserver' },
                { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/consumos/rds/mariadb' },
                { label: 'Nat Gateways', icon: Workflow, href: '/aws/consumos/nat_gateways' },
                { label: 'Loadbalancers V2', icon: Workflow, href: '/aws/consumos/elbv2' },
            ],
        },
        {
            label: 'Funciones',
            icon: Zap,
            items: [
                {
                    label: 'Top Facturaciones',
                    icon: Zap,
                    items: [
                        { label: 'Top Facturaciones por Región', icon: Globe2, href: '/aws/funciones/top-dolares-region', color: 'text-purple-500' },
                        { label: 'Top Facturaciones por SO', icon: Monitor, href: '/aws/funciones/top-dolares-so', color: 'text-purple-500' },
                        { label: 'Top Facturaciones por Tipo de Instancia', icon: Server, href: '/aws/funciones/top-dolares-por-tipo-de-instancia', color: 'text-teal-600' },
                        { label: 'Top Facturaciones por Familia de Instancias', icon: Layers, href: '/aws/funciones/top-dolares-por-familia-de-instancia', color: 'text-indigo-600' },
                        { label: 'Top Facturaciones por Tipo de Compra', icon: ShoppingCart, href: '/aws/funciones/top-dolares-por-tipo-de-compra', color: 'text-amber-600' },
                        { label: 'Top Facturaciones por Tipo de Cobro', icon: Receipt, href: '/aws/funciones/top-dolares-por-tipo-de-cobro', color: 'text-red-500' },
                        { label: 'Top Facturaciones por Recursos', icon: Boxes, href: '/aws/funciones/top-dolares-por-id-recurso', color: 'text-blue-500' },
                        { label: 'Top Recursos', icon: Stars, href: '/aws/funciones/top-recursos', color: 'text-blue-500' },
                    ],
                },
                {
                    label: 'Consumo horario hábil vs no hábil',
                    icon: Clock,
                    items: [
                        { label: 'Instancias EC2', icon: Clock, href: '/aws/funciones/consumo-ec2-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias EC2 AutoscalingGroups', icon: TrendingUp, href: '/aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias EC2 Nodos EKS', icon: Boxes, href: '/aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil', color: 'text-green-500' },
                    ],
                },
                {
                    label: 'Consumo por Localización',
                    icon: Map,
                    items: [
                        { label: 'Instancias EC2', icon: MapPin, href: '/aws/funciones/avg-uso-loc-inst-ec2', color: 'text-green-500' },
                        { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/funciones/avg-uso-loc-inst-rds-pg', color: 'text-green-500' },
                        { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/funciones/avg-uso-loc-inst-rds-mysql', color: 'text-green-500' },
                        { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/funciones/avg-uso-loc-inst-rds-sqlserver', color: 'text-green-500' },
                        { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/funciones/avg-uso-loc-inst-rds-oracle', color: 'text-green-500' },
                        { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/funciones/avg-uso-loc-inst-rds-mariadb', color: 'text-green-500' },
                    ],
                },
                {
                    label: 'Recursos no utilizados',
                    icon: TrendingDown,
                    items: [
                        { label: 'Instancias EC2', icon: Computer, href: '/aws/funciones/ec2-no-utilizados' },
                        { label: 'Instancias EC2 AutoscalingGroups', icon: Computer, href: '/aws/funciones/ec2-no-utilizados/autoscaling' },
                        { label: 'Instancias EC2 Nodos EKS', icon: Computer, href: '/aws/funciones/ec2-no-utilizados/eks' },
                        { label: 'Vólumenes EBS', icon: HardDrive, href: '/aws/funciones/ebs-no-utilizados' },
                        { label: 'Nat Gateways', icon: Workflow, href: '/aws/funciones/nat-gateways-no-utilizados' },
                        { label: 'Loadbalancers V2', icon: Workflow, href: '/aws/funciones/elbv2-no-utilizados' },
                        { label: 'Route 53', icon: Workflow, href: '/aws/funciones/routes53-no-utilizados' },
                    ],
                },
                { label: 'Spot vs Vm', icon: Zap, href: '/aws/funciones/spot-vs-vm' },
                { label: 'Top S3 Buckets', icon: Box, href: '/aws/funciones/top-s3-buckets' },
                { label: 'Variación consumo de recursos', icon: Diff, href: '/aws/funciones/variacion-tendencia-uso-de-recursos' },
            ],
        },
        {
            label: 'Recursos',
            icon: Box,
            items: [
                { label: 'Instancias EC2', icon: Computer, href: '/aws/recursos/instancias-ec2', color: 'text-orange-500' },
                { label: 'Auto Scaling groups', icon: TrendingUp, href: '/aws/recursos/autoscaling-groups', color: 'text-emerald-500' },
                { label: 'Instancias RDS Postgresql', icon: Database, href: '/aws/recursos/instancias-rds-pg', color: 'text-blue-600' },
                { label: 'Instancias RDS Mysql', icon: Database, href: '/aws/recursos/instancias-rds-mysql', color: 'text-emerald-600' },
                { label: 'Instancias RDS SQL Server', icon: Database, href: '/aws/recursos/instancias-rds-sqlserver', color: 'text-purple-600' },
                { label: 'Instancias RDS Oracle', icon: Database, href: '/aws/recursos/instancias-rds-oracle', color: 'text-red-600' },
                { label: 'Instancias RDS MariaDB', icon: Database, href: '/aws/recursos/instancias-rds-mariadb', color: 'text-amber-600' },
            ],
        },
    ],
    azure: [
        { label: 'Inicio', icon: LayoutDashboard, href: '/azure' },
        { label: 'Tendencia Facturación', icon: Grid2X2, href: '/azure/facturacion/tendencia-pago-por-uso' },
        { label: 'Quotas', icon: PieChart, href: '/azure/quotas' },
        { label: 'Deployments', icon: Zap, href: '/azure/deployments' },
        { label: 'Items Azure', icon: Table, href: '/azure/tables-azure/tablas-item-azure' },
        { label: 'Vista Advisor', icon: Pyramid, href: '/azure/advisor' },
        { label: 'Vista Ejecuciones de Recomendaciones', icon: Pyramid, href: '/azure/advisor/rec-statuses' },
        { label: 'Vista Saving Plans', icon: HandCoins, href: '/azure/saving-plan' },
        { label: 'Presupuestos', icon: CircleDollarSign, href: '/azure/presupuesto' },
        { label: 'Métricas Finops', icon: ChartNetwork, href: '/azure/finops-metrics-ai' },
        { label: 'Mantenedor de Etiquetas (Tags)', icon: Tags, href: '/azure/tags' },
        {
            label: 'Consumos',
            icon: LineChart,
            items: [
                { label: 'Maquinas Virtuales', icon: Computer, href: '/azure/consumo-vm' },
                { label: 'Base de Datos', icon: Database, href: '/azure/consumo-db' },
                { label: 'Nodos', icon: Server, href: '/azure/consumo-nodos' },
                { label: 'Applications Gateway', icon: Workflow, href: '/azure/consumo-apps-gateway' },
            ],
        },
        {
            label: 'Funciones',
            icon: Zap,
            items: [
                {
                    label: 'Recursos no utilizados',
                    icon: TrendingDown,
                    items: [
                        { label: 'VM', icon: Computer, href: '/azure/funciones/unused-resources/vm' },
                        { label: 'VMSS', icon: Computer, href: '/azure/funciones/unused-resources/vmss' },
                        { label: 'Extensiones VM', icon: Puzzle, href: '/azure/funciones/unused-resources/extensions' },
                        { label: 'Loadbalancers', icon: Scale, href: '/azure/funciones/loadbalancers-infrautilizados' },
                        { label: 'Applications Gateway', icon: Workflow, href: '/azure/funciones/apps-gateway-infrautilizados' },
                        { label: 'Traffic Managers', icon: Workflow, href: '/azure/funciones/traffic-managers-infrautilizados' },
                    ],
                },
                { label: 'Blob Storage vs Storage General', icon: Cylinder, href: '/azure/funciones/blob-vs-storage-general' },
                { label: 'Variación Storage', icon: Cylinder, href: '/azure/funciones/variacion-storage' },
                { label: 'Top 10 uso de recursos', icon: LineChart, href: '/azure/funciones/top-10-recursos-uso' },
                { label: 'Incremento Uso de Recursos', icon: LineChart, href: '/azure/funciones/incremento-top-recursos-uso' },
                { label: 'Spot vs Regular VMs', icon: Computer, href: '/azure/funciones/spot-vs-regular-vm' },
                { label: 'Promedio de uso por localización', icon: MapPin, href: '/azure/funciones/promedio-por-localizacion' },
                { label: 'Consumo horario hábil vs no hábil', icon: Clock, href: '/azure/funciones/analisis-vms-horario' },
            ],
        },
        {
            label: 'Recursos',
            icon: Box,
            items: [
                { label: 'Maquinas Virtuales', icon: Computer, href: '/azure/recursos-vm' },
                { label: 'Traffic Managers', icon: Workflow, href: '/azure/recursos-traffic-manager' },
            ],
        },
    ],
    gcp: [
        { label: 'Inicio', icon: LayoutDashboard, href: '/gcp' },
        { label: 'Tendencia Facturación', icon: Grid2X2, href: '/gcp/facturacion/tendencia-facturacion' },
        { label: 'Quotas', icon: PieChart, href: '/gcp/quotas' },
        { label: 'Recommender', icon: Pyramid, href: '/gcp/recommender' },
        { label: 'Vista Ejecuciones de Recomendaciones', icon: Pyramid, href: '/gcp/recommender/rec-statuses' },
        { label: 'Métricas Finops', icon: ChartNetwork, href: '/gcp/finops-metrics-ai' },
        { label: 'Reservations', icon: Server, href: '/gcp/reservas' },
        { label: 'Committed Use Discounts', icon: HandCoins, href: '/gcp/cuds/spend-based-cuds' },
        { label: 'Presupuestos', icon: CircleDollarSign, href: '/gcp/presupuesto' },
        { label: 'Mantenedor de Etiquetas (Tags)', icon: Tags, href: '/gcp/tags' },
        {
            label: 'Consumos',
            icon: LineChart,
            items: [
                { label: 'Compute Engine', icon: Computer, href: '/gcp/consumos/compute-engine' },
                { label: 'Instances Group', icon: Boxes, href: '/gcp/consumos/instances-group' },
                { label: 'Clusters GKE', icon: Server, href: '/gcp/consumos/clusters-gke' },
                { label: 'Cloud SQL / Spanner', icon: Database, href: '/gcp/consumos/cloud-sql' },
                { label: 'Zonas DNS: Consumo y Estado', icon: Globe, href: '/gcp/consumos/dns/zonas-consumo-estado' },
                { label: 'Load Balancers: Consumo y Uso', icon: Share2, href: '/gcp/consumos/load-balancers/consumo-uso' },
                { label: 'Cloud Filestore', icon: Box, href: '/gcp/consumos/filestore' },
            ],
        },
        {
            label: 'Funciones',
            icon: Zap,
            items: [
                {
                    label: 'Consumo horario hábil vs no hábil',
                    icon: Clock,
                    items: [
                        { label: 'Compute Engine', icon: Computer, href: '/gcp/funciones/uso-horario-habil-no-habil/compute-engines' },
                        { label: 'Instance Groups', icon: Boxes, href: '/gcp/funciones/uso-horario-habil-no-habil/instance-group' },
                        { label: 'Clusters GKE', icon: Server, href: '/gcp/funciones/uso-horario-habil-no-habil/cluster-gke' },
                        { label: 'Cloud SQL Postgres', icon: Database, href: '/gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql' },
                        { label: 'Cloud SQL Mysql', icon: Database, href: '/gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql' },
                        { label: 'Cloud SQL Sql Server', icon: Database, href: '/gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver' },
                        { label: 'Cloud Filestore', icon: Box, href: '/gcp/funciones/uso-horario-habil-no-habil/filestore' },
                    ],
                },
                {
                    label: 'Recursos no utilizados',
                    icon: TrendingDown,
                    items: [
                        { label: 'Compute Engine', icon: Computer, href: '/gcp/funciones/unused-resources/compute-engine' },
                        { label: 'Instance Groups', icon: Boxes, href: '/gcp/funciones/unused-resources/instance-groups' },
                        { label: 'Clusters GKE', icon: Boxes, href: '/gcp/funciones/unused-resources/clusters-gke' },
                        { label: 'Discos Persistentes', icon: HardDrive, href: '/gcp/funciones/unused-resources/persistent-disks' },
                        { label: 'Filestore – Sin Uso', icon: HardDrive, href: '/gcp/recursos/filestore-sin-uso' },
                    ],
                },
                {
                    label: 'Networking',
                    icon: Network,
                    items: [
                        { label: 'IPs Externas sin Uso', icon: Globe2, href: '/gcp/funciones/networking/ips-sin-uso' },
                        { label: 'Subnets sin Recursos Asociados', icon: Split, href: '/gcp/funciones/networking/subnets-sin-recursos' },
                    ],
                },
                { label: 'Top Cloud Storage Buckets', icon: LineChart, href: '/gcp/funciones/top-cloud-storage-buckets' },
                { label: 'Top Filestore Sub-Utilizados', icon: TrendingDown, href: '/gcp/funciones/top-filestore-sub-utilizado' },
                { label: 'Spot vs Standard VMs', icon: Computer, href: '/gcp/funciones/spot-vs-standard-vm' },
                { label: 'Promedio de uso por región', icon: MapPin, href: '/gcp/funciones/uso-costo-por-localizacion' },
                { label: 'Top Facturación por Región', icon: DollarSign, href: '/gcp/funciones/top-facturacion-region' },
            ],
        },
        {
            label: 'Recursos',
            icon: Box,
            items: [
                { label: 'Compute Engine', icon: Computer, href: '/gcp/recursos/compute-engine' },
                { label: 'Instance Groups', icon: Workflow, href: '/gcp/recursos/instance-groups' },
                { label: 'Clusters GKE', icon: ShipWheel, href: '/gcp/recursos/clusters-gke' },
                { label: 'Cloud SQL Postgres', icon: Database, href: '/gcp/recursos/cloudsql/postgresql' },
                { label: 'Cloud SQL Mysql', icon: Database, href: '/gcp/recursos/cloudsql/mysql' },
                { label: 'Cloud SQL Sql Server', icon: Database, href: '/gcp/recursos/cloudsql/sqlserver' },
            ],
        },
    ],
    'amazon-bedrock': [
        { label: 'Inicio', icon: LayoutDashboard, href: '/amazon-bedrock' },
        { label: 'Costo y Optimización', icon: Grid2X2, href: '/amazon-bedrock/costo-optimización' },
    ],
}

export const SidebarDashboardNubesComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname() ?? ''
    const items = useMemo(() => resolveNav(NAV, pathname), [pathname])

    return <SidebarNav items={items} {...props} />
}