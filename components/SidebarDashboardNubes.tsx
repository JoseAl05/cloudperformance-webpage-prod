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

type Provider = 'aws' | 'azure' | 'gcp'

const NAV: Record<Provider, NavItem[]> = {
    aws: [
        { label: 'Inicio', icon: LayoutDashboard, href: '/cloud-aws' },
        { label: 'Tendencia Facturación', icon: Grid2X2, href: '/cloud-aws/facturacion/tendencia-facturacion' },
        { label: 'Quotas', icon: PieChart, href: '/cloud-aws/quotas' },
        { label: 'Eventos', icon: Zap, href: '/cloud-aws/eventos' },
        { label: 'Vista Advisor', icon: Pyramid, href: '/cloud-aws/advisor' },
        { label: 'Vista Ejecuciones de Recomendaciones', icon: Pyramid, href: '/cloud-aws/advisor/rec-statuses' },
        { label: 'Vista Saving Plans', icon: HandCoins, href: '/cloud-aws/saving-plan' },
        { label: 'Presupuestos', icon: CircleDollarSign, href: '/cloud-aws/presupuesto' },
        { label: 'Métricas Finops', icon: ChartNetwork, href: '/cloud-aws/finops-metrics-ai' },
        { label: 'Mantenedor de Etiquetas (Tags)', icon: Tags, href: '/cloud-aws/tags' },
        {
            label: 'Consumos',
            icon: LineChart,
            items: [
                { label: 'Instancias EC2', icon: Computer, href: '/cloud-aws/consumos/ec2' },
                { label: 'Instancias EC2 AutoscalingGroups', icon: Computer, href: '/cloud-aws/consumos/asg' },
                { label: 'Instancias EC2 Nodos EKS', icon: Computer, href: '/cloud-aws/consumos/eks' },
                { label: 'Instancias RDS Postgresql', icon: Database, href: '/cloud-aws/consumos/rds/postgresql' },
                { label: 'Instancias RDS Mysql', icon: Database, href: '/cloud-aws/consumos/rds/mysql' },
                { label: 'Instancias RDS Oracle', icon: Database, href: '/cloud-aws/consumos/rds/oracle' },
                { label: 'Instancias RDS SQL Server', icon: Database, href: '/cloud-aws/consumos/rds/sqlserver' },
                { label: 'Instancias RDS MariaDB', icon: Database, href: '/cloud-aws/consumos/rds/mariadb' },
                { label: 'Nat Gateways', icon: Workflow, href: '/cloud-aws/consumos/nat_gateways' },
                { label: 'Loadbalancers V2', icon: Workflow, href: '/cloud-aws/consumos/elbv2' },
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
                        { label: 'Top Facturaciones por Región', icon: Globe2, href: '/cloud-aws/funciones/top-dolares-region', color: 'text-purple-500' },
                        { label: 'Top Facturaciones por SO', icon: Monitor, href: '/cloud-aws/funciones/top-dolares-so', color: 'text-purple-500' },
                        { label: 'Top Facturaciones por Tipo de Instancia', icon: Server, href: '/cloud-aws/funciones/top-dolares-por-tipo-de-instancia', color: 'text-teal-600' },
                        { label: 'Top Facturaciones por Familia de Instancias', icon: Layers, href: '/cloud-aws/funciones/top-dolares-por-familia-de-instancia', color: 'text-indigo-600' },
                        { label: 'Top Facturaciones por Tipo de Compra', icon: ShoppingCart, href: '/cloud-aws/funciones/top-dolares-por-tipo-de-compra', color: 'text-amber-600' },
                        { label: 'Top Facturaciones por Tipo de Cobro', icon: Receipt, href: '/cloud-aws/funciones/top-dolares-por-tipo-de-cobro', color: 'text-red-500' },
                        { label: 'Top Facturaciones por Recursos', icon: Boxes, href: '/cloud-aws/funciones/top-dolares-por-id-recurso', color: 'text-blue-500' },
                        { label: 'Top Recursos', icon: Stars, href: '/cloud-aws/funciones/top-recursos', color: 'text-blue-500' },
                    ],
                },
                {
                    label: 'Consumo horario hábil vs no hábil',
                    icon: Clock,
                    items: [
                        { label: 'Instancias EC2', icon: Clock, href: '/cloud-aws/funciones/consumo-ec2-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias EC2 AutoscalingGroups', icon: TrendingUp, href: '/cloud-aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias EC2 Nodos EKS', icon: Boxes, href: '/cloud-aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS Postgresql', icon: Database, href: '/cloud-aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS Mysql', icon: Database, href: '/cloud-aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS SQL Server', icon: Database, href: '/cloud-aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS Oracle', icon: Database, href: '/cloud-aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil', color: 'text-green-500' },
                        { label: 'Instancias RDS MariaDB', icon: Database, href: '/cloud-aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil', color: 'text-green-500' },
                    ],
                },
                {
                    label: 'Consumo por Localización',
                    icon: Map,
                    items: [
                        { label: 'Instancias EC2', icon: MapPin, href: '/cloud-aws/funciones/avg-uso-loc-inst-ec2', color: 'text-green-500' },
                        { label: 'Instancias RDS Postgresql', icon: Database, href: '/cloud-aws/funciones/avg-uso-loc-inst-rds-pg', color: 'text-green-500' },
                        { label: 'Instancias RDS Mysql', icon: Database, href: '/cloud-aws/funciones/avg-uso-loc-inst-rds-mysql', color: 'text-green-500' },
                        { label: 'Instancias RDS SQL Server', icon: Database, href: '/cloud-aws/funciones/avg-uso-loc-inst-rds-sqlserver', color: 'text-green-500' },
                        { label: 'Instancias RDS Oracle', icon: Database, href: '/cloud-aws/funciones/avg-uso-loc-inst-rds-oracle', color: 'text-green-500' },
                        { label: 'Instancias RDS MariaDB', icon: Database, href: '/cloud-aws/funciones/avg-uso-loc-inst-rds-mariadb', color: 'text-green-500' },
                    ],
                },
                {
                    label: 'Recursos no utilizados',
                    icon: TrendingDown,
                    items: [
                        { label: 'Instancias EC2', icon: Computer, href: '/cloud-aws/funciones/ec2-no-utilizados' },
                        { label: 'Instancias EC2 AutoscalingGroups', icon: Computer, href: '/cloud-aws/funciones/ec2-no-utilizados/autoscaling' },
                        { label: 'Instancias EC2 Nodos EKS', icon: Computer, href: '/cloud-aws/funciones/ec2-no-utilizados/eks' },
                        { label: 'Vólumenes EBS', icon: HardDrive, href: '/cloud-aws/funciones/ebs-no-utilizados' },
                        { label: 'Nat Gateways', icon: Workflow, href: '/cloud-aws/funciones/nat-gateways-no-utilizados' },
                        { label: 'Loadbalancers V2', icon: Workflow, href: '/cloud-aws/funciones/elbv2-no-utilizados' },
                        { label: 'Route 53', icon: Workflow, href: '/cloud-aws/funciones/routes53-no-utilizados' },
                    ],
                },
                { label: 'Spot vs Vm', icon: Zap, href: '/cloud-aws/funciones/spot-vs-vm' },
                { label: 'Top S3 Buckets', icon: Box, href: '/cloud-aws/funciones/top-s3-buckets' },
                { label: 'Variación consumo de recursos', icon: Diff, href: '/cloud-aws/funciones/variacion-tendencia-uso-de-recursos' },
            ],
        },
        {
            label: 'Recursos',
            icon: Box,
            items: [
                { label: 'Instancias EC2', icon: Computer, href: '/cloud-aws/recursos/instancias-ec2', color: 'text-orange-500' },
                { label: 'Auto Scaling groups', icon: TrendingUp, href: '/cloud-aws/recursos/autoscaling-groups', color: 'text-emerald-500' },
                { label: 'Instancias RDS Postgresql', icon: Database, href: '/cloud-aws/recursos/instancias-rds-pg', color: 'text-blue-600' },
                { label: 'Instancias RDS Mysql', icon: Database, href: '/cloud-aws/recursos/instancias-rds-mysql', color: 'text-emerald-600' },
                { label: 'Instancias RDS SQL Server', icon: Database, href: '/cloud-aws/recursos/instancias-rds-sqlserver', color: 'text-purple-600' },
                { label: 'Instancias RDS Oracle', icon: Database, href: '/cloud-aws/recursos/instancias-rds-oracle', color: 'text-red-600' },
                { label: 'Instancias RDS MariaDB', icon: Database, href: '/cloud-aws/recursos/instancias-rds-mariadb', color: 'text-amber-600' },
            ],
        },
    ],
    azure: [
        { label: 'Inicio', icon: LayoutDashboard, href: '/cloud-azure' },
        { label: 'Tendencia Facturación', icon: Grid2X2, href: '/cloud-azure/facturacion/tendencia-pago-por-uso' },
        { label: 'Quotas', icon: PieChart, href: '/cloud-azure/quotas' },
        { label: 'Deployments', icon: Zap, href: '/cloud-azure/deployments' },
        { label: 'Items Azure', icon: Table, href: '/cloud-azure/tables-azure/tablas-item-azure' },
        { label: 'Vista Advisor', icon: Pyramid, href: '/cloud-azure/advisor' },
        { label: 'Vista Ejecuciones de Recomendaciones', icon: Pyramid, href: '/cloud-azure/advisor/rec-statuses' },
        { label: 'Vista Saving Plans', icon: HandCoins, href: '/cloud-azure/saving-plan' },
        { label: 'Presupuestos', icon: CircleDollarSign, href: '/cloud-azure/presupuesto' },
        { label: 'Métricas Finops', icon: ChartNetwork, href: '/cloud-azure/finops-metrics-ai' },
        { label: 'Mantenedor de Etiquetas (Tags)', icon: Tags, href: '/cloud-azure/tags' },
        {
            label: 'Consumos',
            icon: LineChart,
            items: [
                { label: 'Maquinas Virtuales', icon: Computer, href: '/cloud-azure/consumo-vm' },
                { label: 'Base de Datos', icon: Database, href: '/cloud-azure/consumo-db' },
                { label: 'Nodos', icon: Server, href: '/cloud-azure/consumo-nodos' },
                { label: 'Applications Gateway', icon: Workflow, href: '/cloud-azure/consumo-apps-gateway' },
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
                        { label: 'Maquinas Virtuales', icon: Computer, href: '/cloud-azure/funciones/analisis-vms-horario' },
                        { label: 'Base de Datos', icon: Database, href: '/cloud-azure/funciones/consumo-bds-horario-habil-vs-no-habil' },
                        { label: 'Nodos', icon: Server, href: '/cloud-azure/funciones/consumo-nodes-horario-habil-vs-no-habil' },
                    ],
                },
                {
                    label: 'Recursos no utilizados',
                    icon: TrendingDown,
                    items: [
                        { label: 'VM', icon: Computer, href: '/cloud-azure/funciones/unused-resources/vm' },
                        { label: 'VMSS', icon: Computer, href: '/cloud-azure/funciones/unused-resources/vmss' },
                        { label: 'Extensiones VM', icon: Puzzle, href: '/cloud-azure/funciones/unused-resources/extensions' },
                        { label: 'Loadbalancers', icon: Scale, href: '/cloud-azure/funciones/loadbalancers-infrautilizados' },
                        { label: 'Applications Gateway', icon: Workflow, href: '/cloud-azure/funciones/apps-gateway-infrautilizados' },
                        { label: 'Traffic Managers', icon: Workflow, href: '/cloud-azure/funciones/traffic-managers-infrautilizados' },
                    ],
                },
                { label: 'Blob Storage vs Storage General', icon: Cylinder, href: '/cloud-azure/funciones/blob-vs-storage-general' },
                { label: 'Variación Storage', icon: Cylinder, href: '/cloud-azure/funciones/variacion-storage' },
                { label: 'Top 10 uso de recursos', icon: LineChart, href: '/cloud-azure/funciones/top-10-recursos-uso' },
                { label: 'Incremento Uso de Recursos', icon: LineChart, href: '/cloud-azure/funciones/incremento-top-recursos-uso' },
                { label: 'Spot vs Regular VMs', icon: Computer, href: '/cloud-azure/funciones/spot-vs-regular-vm' },
                { label: 'Promedio de uso por localización', icon: MapPin, href: '/cloud-azure/funciones/promedio-por-localizacion' },
            ],
        },
        {
            label: 'Recursos',
            icon: Box,
            items: [
                { label: 'Maquinas Virtuales', icon: Computer, href: '/cloud-azure/recursos-vm' },
                { label: 'Nodos', icon: Computer, href: '/cloud-azure/recursos-nodos' },
                { label: 'Base de Datos MySQL', icon: Database, href: '/cloud-azure/recursos-db-mysql' },
                { label: 'Base de Datos PostgreSQL', icon: Database, href: '/cloud-azure/recursos-db-postgresql' },
                { label: 'Traffic Managers', icon: Workflow, href: '/cloud-azure/recursos-traffic-manager' },
            ],
        },
    ],
    gcp: [
        { label: 'Inicio', icon: LayoutDashboard, href: '/cloud-gcp' },
        { label: 'Tendencia Facturación', icon: Grid2X2, href: '/cloud-gcp/facturacion/tendencia-facturacion' },
        { label: 'Quotas', icon: PieChart, href: '/cloud-gcp/quotas' },
        { label: 'Recommender', icon: Pyramid, href: '/cloud-gcp/recommender' },
        { label: 'Vista Ejecuciones de Recomendaciones', icon: Pyramid, href: '/cloud-gcp/recommender/rec-statuses' },
        { label: 'Métricas Finops', icon: ChartNetwork, href: '/cloud-gcp/finops-metrics-ai' },
        { label: 'Reservations', icon: Server, href: '/cloud-gcp/reservas' },
        { label: 'Committed Use Discounts', icon: HandCoins, href: '/cloud-gcp/cuds/spend-based-cuds' },
        { label: 'Presupuestos', icon: CircleDollarSign, href: '/cloud-gcp/presupuesto' },
        { label: 'Mantenedor de Etiquetas (Tags)', icon: Tags, href: '/cloud-gcp/tags' },
        {
            label: 'Consumos',
            icon: LineChart,
            items: [
                { label: 'Compute Engine', icon: Computer, href: '/cloud-gcp/consumos/compute-engine' },
                { label: 'Instances Group', icon: Boxes, href: '/cloud-gcp/consumos/instances-group' },
                { label: 'Clusters GKE', icon: Server, href: '/cloud-gcp/consumos/clusters-gke' },
                { label: 'Cloud SQL / Spanner', icon: Database, href: '/cloud-gcp/consumos/cloud-sql' },
                { label: 'Zonas DNS: Consumo y Estado', icon: Globe, href: '/cloud-gcp/consumos/dns/zonas-consumo-estado' },
                { label: 'Load Balancers: Consumo y Uso', icon: Share2, href: '/cloud-gcp/consumos/load-balancers/consumo-uso' },
                { label: 'Cloud Filestore', icon: Box, href: '/cloud-gcp/consumos/filestore' },
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
                        { label: 'Compute Engine', icon: Computer, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/compute-engines' },
                        { label: 'Instance Groups', icon: Boxes, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/instance-group' },
                        { label: 'Clusters GKE', icon: Server, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/cluster-gke' },
                        { label: 'Cloud SQL Postgres', icon: Database, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql' },
                        { label: 'Cloud SQL Mysql', icon: Database, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql' },
                        { label: 'Cloud SQL Sql Server', icon: Database, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver' },
                        { label: 'Cloud Filestore', icon: Box, href: '/cloud-gcp/funciones/uso-horario-habil-no-habil/filestore' },
                    ],
                },
                {
                    label: 'Recursos no utilizados',
                    icon: TrendingDown,
                    items: [
                        { label: 'Compute Engine', icon: Computer, href: '/cloud-gcp/funciones/unused-resources/compute-engine' },
                        { label: 'Instance Groups', icon: Boxes, href: '/cloud-gcp/funciones/unused-resources/instance-groups' },
                        { label: 'Clusters GKE', icon: Boxes, href: '/cloud-gcp/funciones/unused-resources/clusters-gke' },
                        { label: 'Discos Persistentes', icon: HardDrive, href: '/cloud-gcp/funciones/unused-resources/persistent-disks' },
                        { label: 'Filestore – Sin Uso', icon: HardDrive, href: '/cloud-gcp/recursos/filestore-sin-uso' },
                    ],
                },
                {
                    label: 'Networking',
                    icon: Network,
                    items: [
                        { label: 'IPs Externas sin Uso', icon: Globe2, href: '/cloud-gcp/funciones/networking/ips-sin-uso' },
                        { label: 'Subnets sin Recursos Asociados', icon: Split, href: '/cloud-gcp/funciones/networking/subnets-sin-recursos' },
                    ],
                },
                { label: 'Top Cloud Storage Buckets', icon: LineChart, href: '/cloud-gcp/funciones/top-cloud-storage-buckets' },
                { label: 'Top Filestore Sub-Utilizados', icon: TrendingDown, href: '/cloud-gcp/funciones/top-filestore-sub-utilizado' },
                { label: 'Spot vs Standard VMs', icon: Computer, href: '/cloud-gcp/funciones/spot-vs-standard-vm' },
                { label: 'Promedio de uso por región', icon: MapPin, href: '/cloud-gcp/funciones/uso-costo-por-localizacion' },
                { label: 'Top Facturación por Región', icon: DollarSign, href: '/cloud-gcp/funciones/top-facturacion-region' },
            ],
        },
        {
            label: 'Recursos',
            icon: Box,
            items: [
                { label: 'Compute Engine', icon: Computer, href: '/cloud-gcp/recursos/compute-engine' },
                { label: 'Instance Groups', icon: Workflow, href: '/cloud-gcp/recursos/instance-groups' },
                { label: 'Clusters GKE', icon: ShipWheel, href: '/cloud-gcp/recursos/clusters-gke' },
                { label: 'Cloud SQL Postgres', icon: Database, href: '/cloud-gcp/recursos/cloudsql/postgresql' },
                { label: 'Cloud SQL Mysql', icon: Database, href: '/cloud-gcp/recursos/cloudsql/mysql' },
                { label: 'Cloud SQL Sql Server', icon: Database, href: '/cloud-gcp/recursos/cloudsql/sqlserver' },
            ],
        },
    ],
}

export const SidebarDashboardNubesComponent = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const pathname = usePathname() ?? ''
    const items = useMemo(() => resolveNav(NAV, pathname), [pathname])

    return <SidebarNav items={items} {...props} />
}