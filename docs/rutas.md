# Rutas (páginas y layouts de `app/`)

[← Índice](README.md)

Páginas y layouts del App Router. Cada página suele limitarse a leer los filtros de la URL y montar el componente `MainView…` de su vista; los layouts arman la barra lateral y el control de acceso de cada sección.

| Ruta | Archivo | Tipo |
|---|---|---|
| `/` | [`(alertas)/layout.tsx`](#app-alertas-layout-tsx) | layout |
| `/` | [`(dashboards-ia)/layout.tsx`](#app-dashboards-ia-layout-tsx) | layout |
| `/` | [`(dashboards-nubes)/layout.tsx`](#app-dashboards-nubes-layout-tsx) | layout |
| `/` | [`(profile)/layout.tsx`](#app-profile-layout-tsx) | layout |
| `/` | [`layout.tsx`](#app-layout-tsx) | layout |
| `/` | [`page.tsx`](#app-page-tsx) | page |
| `/alertas` | [`(alertas)/alertas/page.tsx`](#app-alertas-alertas-page-tsx) | page |
| `/alertas/[nube]` | [`(alertas)/alertas/[nube]/page.tsx`](#app-alertas-alertas-nube-page-tsx) | page |
| `/amazon-bedrock` | [`(dashboards-ia)/amazon-bedrock/layout.tsx`](#app-dashboards-ia-amazon-bedrock-layout-tsx) | layout |
| `/amazon-bedrock` | [`(dashboards-ia)/amazon-bedrock/page.tsx`](#app-dashboards-ia-amazon-bedrock-page-tsx) | page |
| `/amazon-bedrock/comparacion` | [`(dashboards-ia)/amazon-bedrock/comparacion/page.tsx`](#app-dashboards-ia-amazon-bedrock-comparacion-page-tsx) | page |
| `/amazon-bedrock/costo-optimizacion` | [`(dashboards-ia)/amazon-bedrock/costo-optimizacion/page.tsx`](#app-dashboards-ia-amazon-bedrock-costo-optimizacion-page-tsx) | page |
| `/amazon-bedrock/costo-optimizacion/custom-models` | [`(dashboards-ia)/amazon-bedrock/costo-optimizacion/custom-models/page.tsx`](#app-dashboards-ia-amazon-bedrock-costo-optimizacion-custom-models-page-tsx) | page |
| `/amazon-bedrock/costo-optimizacion/foundation-models` | [`(dashboards-ia)/amazon-bedrock/costo-optimizacion/foundation-models/page.tsx`](#app-dashboards-ia-amazon-bedrock-costo-optimizacion-foundation-models-page-tsx) | page |
| `/amazon-bedrock/costo-optimizacion/inference-profiles` | [`(dashboards-ia)/amazon-bedrock/costo-optimizacion/inference-profiles/page.tsx`](#app-dashboards-ia-amazon-bedrock-costo-optimizacion-inference-profiles-page-tsx) | page |
| `/amazon-bedrock/prompt-opt` | [`(dashboards-ia)/amazon-bedrock/prompt-opt/page.tsx`](#app-dashboards-ia-amazon-bedrock-prompt-opt-page-tsx) | page |
| `/cloud-aws` | [`(dashboards-nubes)/cloud-aws/layout.tsx`](#app-dashboards-nubes-cloud-aws-layout-tsx) | layout |
| `/cloud-aws` | [`(dashboards-nubes)/cloud-aws/page.tsx`](#app-dashboards-nubes-cloud-aws-page-tsx) | page |
| `/cloud-aws/compromisos/saving-plans` | [`(dashboards-nubes)/cloud-aws/compromisos/saving-plans/page.tsx`](#app-dashboards-nubes-cloud-aws-compromisos-saving-plans-page-tsx) | page |
| `/cloud-aws/consumos/asg` | [`(dashboards-nubes)/cloud-aws/consumos/asg/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-asg-page-tsx) | page |
| `/cloud-aws/consumos/ec2` | [`(dashboards-nubes)/cloud-aws/consumos/ec2/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-ec2-page-tsx) | page |
| `/cloud-aws/consumos/eks` | [`(dashboards-nubes)/cloud-aws/consumos/eks/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-eks-page-tsx) | page |
| `/cloud-aws/consumos/elbv2` | [`(dashboards-nubes)/cloud-aws/consumos/elbv2/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-elbv2-page-tsx) | page |
| `/cloud-aws/consumos/nat_gateways` | [`(dashboards-nubes)/cloud-aws/consumos/nat_gateways/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-nat-gateways-page-tsx) | page |
| `/cloud-aws/consumos/rds/mariadb` | [`(dashboards-nubes)/cloud-aws/consumos/rds/mariadb/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-rds-mariadb-page-tsx) | page |
| `/cloud-aws/consumos/rds/mysql` | [`(dashboards-nubes)/cloud-aws/consumos/rds/mysql/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-rds-mysql-page-tsx) | page |
| `/cloud-aws/consumos/rds/oracle` | [`(dashboards-nubes)/cloud-aws/consumos/rds/oracle/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-rds-oracle-page-tsx) | page |
| `/cloud-aws/consumos/rds/postgresql` | [`(dashboards-nubes)/cloud-aws/consumos/rds/postgresql/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-rds-postgresql-page-tsx) | page |
| `/cloud-aws/consumos/rds/sqlserver` | [`(dashboards-nubes)/cloud-aws/consumos/rds/sqlserver/page.tsx`](#app-dashboards-nubes-cloud-aws-consumos-rds-sqlserver-page-tsx) | page |
| `/cloud-aws/eventos` | [`(dashboards-nubes)/cloud-aws/eventos/page.tsx`](#app-dashboards-nubes-cloud-aws-eventos-page-tsx) | page |
| `/cloud-aws/facturacion/tendencia-facturacion` | [`(dashboards-nubes)/cloud-aws/facturacion/tendencia-facturacion/page.tsx`](#app-dashboards-nubes-cloud-aws-facturacion-tendencia-facturacion-page-tsx) | page |
| `/cloud-aws/finops-metrics-ai` | [`(dashboards-nubes)/cloud-aws/finops-metrics-ai/page.tsx`](#app-dashboards-nubes-cloud-aws-finops-metrics-ai-page-tsx) | page |
| `/cloud-aws/funciones/avg-uso-loc-inst-ec2` | [`(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-ec2/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-ec2-page-tsx) | page |
| `/cloud-aws/funciones/avg-uso-loc-inst-rds-mariadb` | [`(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-mariadb/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-mariadb-page-tsx) | page |
| `/cloud-aws/funciones/avg-uso-loc-inst-rds-mysql` | [`(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-mysql/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-mysql-page-tsx) | page |
| `/cloud-aws/funciones/avg-uso-loc-inst-rds-oracle` | [`(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-oracle/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-oracle-page-tsx) | page |
| `/cloud-aws/funciones/avg-uso-loc-inst-rds-pg` | [`(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-pg/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-pg-page-tsx) | page |
| `/cloud-aws/funciones/avg-uso-loc-inst-rds-sqlserver` | [`(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-sqlserver/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-sqlserver-page-tsx) | page |
| `/cloud-aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-ec2-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-ec2-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-mariadb-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-mysql-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-oracle-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-postgresql-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-sql-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-aws/funciones/ebs-no-utilizados` | [`(dashboards-nubes)/cloud-aws/funciones/ebs-no-utilizados/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-ebs-no-utilizados-page-tsx) | page |
| `/cloud-aws/funciones/ec2-no-utilizados` | [`(dashboards-nubes)/cloud-aws/funciones/ec2-no-utilizados/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-page-tsx) | page |
| `/cloud-aws/funciones/ec2-no-utilizados/autoscaling` | [`(dashboards-nubes)/cloud-aws/funciones/ec2-no-utilizados/autoscaling/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-autoscaling-page-tsx) | page |
| `/cloud-aws/funciones/ec2-no-utilizados/eks` | [`(dashboards-nubes)/cloud-aws/funciones/ec2-no-utilizados/eks/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-eks-page-tsx) | page |
| `/cloud-aws/funciones/elbv2-no-utilizados` | [`(dashboards-nubes)/cloud-aws/funciones/elbv2-no-utilizados/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-elbv2-no-utilizados-page-tsx) | page |
| `/cloud-aws/funciones/nat-gateways-no-utilizados` | [`(dashboards-nubes)/cloud-aws/funciones/nat-gateways-no-utilizados/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-nat-gateways-no-utilizados-page-tsx) | page |
| `/cloud-aws/funciones/routes53-no-utilizados` | [`(dashboards-nubes)/cloud-aws/funciones/routes53-no-utilizados/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-routes53-no-utilizados-page-tsx) | page |
| `/cloud-aws/funciones/spot-vs-vm` | [`(dashboards-nubes)/cloud-aws/funciones/spot-vs-vm/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-spot-vs-vm-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-por-familia-de-instancia` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-familia-de-instancia/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-familia-de-instancia-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-por-id-recurso` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-id-recurso/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-id-recurso-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-por-tipo-de-cobro` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-tipo-de-cobro/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-cobro-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-por-tipo-de-compra` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-tipo-de-compra/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-compra-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-por-tipo-de-instancia` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-tipo-de-instancia/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-instancia-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-region` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-region/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-region-page-tsx) | page |
| `/cloud-aws/funciones/top-dolares-so` | [`(dashboards-nubes)/cloud-aws/funciones/top-dolares-so/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-dolares-so-page-tsx) | page |
| `/cloud-aws/funciones/top-recursos` | [`(dashboards-nubes)/cloud-aws/funciones/top-recursos/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-recursos-page-tsx) | page |
| `/cloud-aws/funciones/top-s3-buckets` | [`(dashboards-nubes)/cloud-aws/funciones/top-s3-buckets/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-top-s3-buckets-page-tsx) | page |
| `/cloud-aws/funciones/variacion-tendencia-uso-de-recursos` | [`(dashboards-nubes)/cloud-aws/funciones/variacion-tendencia-uso-de-recursos/page.tsx`](#app-dashboards-nubes-cloud-aws-funciones-variacion-tendencia-uso-de-recursos-page-tsx) | page |
| `/cloud-aws/presupuesto` | [`(dashboards-nubes)/cloud-aws/presupuesto/PresupuestoClientLayout.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-presupuestoclientlayout-tsx) | PresupuestoClientLayout |
| `/cloud-aws/presupuesto` | [`(dashboards-nubes)/cloud-aws/presupuesto/layout.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-layout-tsx) | layout |
| `/cloud-aws/presupuesto` | [`(dashboards-nubes)/cloud-aws/presupuesto/page.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-page-tsx) | page |
| `/cloud-aws/presupuesto/centro-de-costo` | [`(dashboards-nubes)/cloud-aws/presupuesto/centro-de-costo/page.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-centro-de-costo-page-tsx) | page |
| `/cloud-aws/presupuesto/costos-vs-presupuesto` | [`(dashboards-nubes)/cloud-aws/presupuesto/costos-vs-presupuesto/page.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-costos-vs-presupuesto-page-tsx) | page |
| `/cloud-aws/presupuesto/presupuesto-anual` | [`(dashboards-nubes)/cloud-aws/presupuesto/presupuesto-anual/page.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-presupuesto-anual-page-tsx) | page |
| `/cloud-aws/presupuesto/presupuesto-mensual` | [`(dashboards-nubes)/cloud-aws/presupuesto/presupuesto-mensual/page.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-presupuesto-mensual-page-tsx) | page |
| `/cloud-aws/quotas` | [`(dashboards-nubes)/cloud-aws/quotas/page.tsx`](#app-dashboards-nubes-cloud-aws-quotas-page-tsx) | page |
| `/cloud-aws/recomendaciones` | [`(dashboards-nubes)/cloud-aws/recomendaciones/page.tsx`](#app-dashboards-nubes-cloud-aws-recomendaciones-page-tsx) | page |
| `/cloud-aws/recomendaciones/rec-statuses` | [`(dashboards-nubes)/cloud-aws/recomendaciones/rec-statuses/page.tsx`](#app-dashboards-nubes-cloud-aws-recomendaciones-rec-statuses-page-tsx) | page |
| `/cloud-aws/recursos/autoscaling-groups` | [`(dashboards-nubes)/cloud-aws/recursos/autoscaling-groups/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-autoscaling-groups-page-tsx) | page |
| `/cloud-aws/recursos/infrautilizadas/autoscaling` | [`(dashboards-nubes)/cloud-aws/recursos/infrautilizadas/autoscaling/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-autoscaling-page-tsx) | page |
| `/cloud-aws/recursos/infrautilizadas/ec2` | [`(dashboards-nubes)/cloud-aws/recursos/infrautilizadas/ec2/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-ec2-page-tsx) | page |
| `/cloud-aws/recursos/infrautilizadas/eks` | [`(dashboards-nubes)/cloud-aws/recursos/infrautilizadas/eks/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-eks-page-tsx) | page |
| `/cloud-aws/recursos/instancias-ec2` | [`(dashboards-nubes)/cloud-aws/recursos/instancias-ec2/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-instancias-ec2-page-tsx) | page |
| `/cloud-aws/recursos/instancias-rds-mariadb` | [`(dashboards-nubes)/cloud-aws/recursos/instancias-rds-mariadb/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-mariadb-page-tsx) | page |
| `/cloud-aws/recursos/instancias-rds-mysql` | [`(dashboards-nubes)/cloud-aws/recursos/instancias-rds-mysql/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-mysql-page-tsx) | page |
| `/cloud-aws/recursos/instancias-rds-oracle` | [`(dashboards-nubes)/cloud-aws/recursos/instancias-rds-oracle/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-oracle-page-tsx) | page |
| `/cloud-aws/recursos/instancias-rds-pg` | [`(dashboards-nubes)/cloud-aws/recursos/instancias-rds-pg/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-pg-page-tsx) | page |
| `/cloud-aws/recursos/instancias-rds-sqlserver` | [`(dashboards-nubes)/cloud-aws/recursos/instancias-rds-sqlserver/page.tsx`](#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-sqlserver-page-tsx) | page |
| `/cloud-aws/tags` | [`(dashboards-nubes)/cloud-aws/tags/page.tsx`](#app-dashboards-nubes-cloud-aws-tags-page-tsx) | page |
| `/cloud-azure` | [`(dashboards-nubes)/cloud-azure/layout.tsx`](#app-dashboards-nubes-cloud-azure-layout-tsx) | layout |
| `/cloud-azure` | [`(dashboards-nubes)/cloud-azure/page.tsx`](#app-dashboards-nubes-cloud-azure-page-tsx) | page |
| `/cloud-azure/compromisos/saving-plans` | [`(dashboards-nubes)/cloud-azure/compromisos/saving-plans/page.tsx`](#app-dashboards-nubes-cloud-azure-compromisos-saving-plans-page-tsx) | page |
| `/cloud-azure/consumos/apps-gateway` | [`(dashboards-nubes)/cloud-azure/consumos/apps-gateway/page.tsx`](#app-dashboards-nubes-cloud-azure-consumos-apps-gateway-page-tsx) | page |
| `/cloud-azure/consumos/db` | [`(dashboards-nubes)/cloud-azure/consumos/db/page.tsx`](#app-dashboards-nubes-cloud-azure-consumos-db-page-tsx) | page |
| `/cloud-azure/consumos/nodos` | [`(dashboards-nubes)/cloud-azure/consumos/nodos/page.tsx`](#app-dashboards-nubes-cloud-azure-consumos-nodos-page-tsx) | page |
| `/cloud-azure/consumos/vm` | [`(dashboards-nubes)/cloud-azure/consumos/vm/page.tsx`](#app-dashboards-nubes-cloud-azure-consumos-vm-page-tsx) | page |
| `/cloud-azure/deployments` | [`(dashboards-nubes)/cloud-azure/deployments/page.tsx`](#app-dashboards-nubes-cloud-azure-deployments-page-tsx) | page |
| `/cloud-azure/facturacion/tendencia-pago-por-uso` | [`(dashboards-nubes)/cloud-azure/facturacion/tendencia-pago-por-uso/page.tsx`](#app-dashboards-nubes-cloud-azure-facturacion-tendencia-pago-por-uso-page-tsx) | page |
| `/cloud-azure/facturacion/top-dolares-facturados` | [`(dashboards-nubes)/cloud-azure/facturacion/top-dolares-facturados/page.tsx`](#app-dashboards-nubes-cloud-azure-facturacion-top-dolares-facturados-page-tsx) | page |
| `/cloud-azure/finops-metrics-ai` | [`(dashboards-nubes)/cloud-azure/finops-metrics-ai/page.tsx`](#app-dashboards-nubes-cloud-azure-finops-metrics-ai-page-tsx) | page |
| `/cloud-azure/funciones/analisis-vms-horario` | [`(dashboards-nubes)/cloud-azure/funciones/analisis-vms-horario/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-analisis-vms-horario-page-tsx) | page |
| `/cloud-azure/funciones/apps-gateway-infrautilizados` | [`(dashboards-nubes)/cloud-azure/funciones/apps-gateway-infrautilizados/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-apps-gateway-infrautilizados-page-tsx) | page |
| `/cloud-azure/funciones/blob-vs-storage-general` | [`(dashboards-nubes)/cloud-azure/funciones/blob-vs-storage-general/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-blob-vs-storage-general-page-tsx) | page |
| `/cloud-azure/funciones/consumo-bds-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-azure/funciones/consumo-bds-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-consumo-bds-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-azure/funciones/consumo-nodes-horario-habil-vs-no-habil` | [`(dashboards-nubes)/cloud-azure/funciones/consumo-nodes-horario-habil-vs-no-habil/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-consumo-nodes-horario-habil-vs-no-habil-page-tsx) | page |
| `/cloud-azure/funciones/incremento-top-recursos-uso` | [`(dashboards-nubes)/cloud-azure/funciones/incremento-top-recursos-uso/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-incremento-top-recursos-uso-page-tsx) | page |
| `/cloud-azure/funciones/loadbalancers-infrautilizados` | [`(dashboards-nubes)/cloud-azure/funciones/loadbalancers-infrautilizados/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-loadbalancers-infrautilizados-page-tsx) | page |
| `/cloud-azure/funciones/promedio-por-localizacion` | [`(dashboards-nubes)/cloud-azure/funciones/promedio-por-localizacion/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-promedio-por-localizacion-page-tsx) | page |
| `/cloud-azure/funciones/spot-vs-regular-vm` | [`(dashboards-nubes)/cloud-azure/funciones/spot-vs-regular-vm/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-spot-vs-regular-vm-page-tsx) | page |
| `/cloud-azure/funciones/top-10-recursos-uso` | [`(dashboards-nubes)/cloud-azure/funciones/top-10-recursos-uso/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-top-10-recursos-uso-page-tsx) | page |
| `/cloud-azure/funciones/traffic-managers-infrautilizados` | [`(dashboards-nubes)/cloud-azure/funciones/traffic-managers-infrautilizados/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-traffic-managers-infrautilizados-page-tsx) | page |
| `/cloud-azure/funciones/unused-resources/extensions` | [`(dashboards-nubes)/cloud-azure/funciones/unused-resources/extensions/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-unused-resources-extensions-page-tsx) | page |
| `/cloud-azure/funciones/unused-resources/vm` | [`(dashboards-nubes)/cloud-azure/funciones/unused-resources/vm/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-unused-resources-vm-page-tsx) | page |
| `/cloud-azure/funciones/unused-resources/vmss` | [`(dashboards-nubes)/cloud-azure/funciones/unused-resources/vmss/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-unused-resources-vmss-page-tsx) | page |
| `/cloud-azure/funciones/variacion-storage` | [`(dashboards-nubes)/cloud-azure/funciones/variacion-storage/page.tsx`](#app-dashboards-nubes-cloud-azure-funciones-variacion-storage-page-tsx) | page |
| `/cloud-azure/presupuesto` | [`(dashboards-nubes)/cloud-azure/presupuesto/PresupuestoClientLayout.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-presupuestoclientlayout-tsx) | PresupuestoClientLayout |
| `/cloud-azure/presupuesto` | [`(dashboards-nubes)/cloud-azure/presupuesto/layout.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-layout-tsx) | layout |
| `/cloud-azure/presupuesto` | [`(dashboards-nubes)/cloud-azure/presupuesto/page.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-page-tsx) | page |
| `/cloud-azure/presupuesto/centro-de-costo` | [`(dashboards-nubes)/cloud-azure/presupuesto/centro-de-costo/page.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-centro-de-costo-page-tsx) | page |
| `/cloud-azure/presupuesto/costos-vs-presupuesto` | [`(dashboards-nubes)/cloud-azure/presupuesto/costos-vs-presupuesto/page.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-costos-vs-presupuesto-page-tsx) | page |
| `/cloud-azure/presupuesto/presupuesto-anual` | [`(dashboards-nubes)/cloud-azure/presupuesto/presupuesto-anual/page.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-presupuesto-anual-page-tsx) | page |
| `/cloud-azure/presupuesto/presupuesto-mensual` | [`(dashboards-nubes)/cloud-azure/presupuesto/presupuesto-mensual/page.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-presupuesto-mensual-page-tsx) | page |
| `/cloud-azure/quotas` | [`(dashboards-nubes)/cloud-azure/quotas/page.tsx`](#app-dashboards-nubes-cloud-azure-quotas-page-tsx) | page |
| `/cloud-azure/recomendaciones` | [`(dashboards-nubes)/cloud-azure/recomendaciones/page.tsx`](#app-dashboards-nubes-cloud-azure-recomendaciones-page-tsx) | page |
| `/cloud-azure/recomendaciones/rec-statuses` | [`(dashboards-nubes)/cloud-azure/recomendaciones/rec-statuses/page.tsx`](#app-dashboards-nubes-cloud-azure-recomendaciones-rec-statuses-page-tsx) | page |
| `/cloud-azure/recursos/db-mysql` | [`(dashboards-nubes)/cloud-azure/recursos/db-mysql/page.tsx`](#app-dashboards-nubes-cloud-azure-recursos-db-mysql-page-tsx) | page |
| `/cloud-azure/recursos/db-postgresql` | [`(dashboards-nubes)/cloud-azure/recursos/db-postgresql/page.tsx`](#app-dashboards-nubes-cloud-azure-recursos-db-postgresql-page-tsx) | page |
| `/cloud-azure/recursos/nodos` | [`(dashboards-nubes)/cloud-azure/recursos/nodos/page.tsx`](#app-dashboards-nubes-cloud-azure-recursos-nodos-page-tsx) | page |
| `/cloud-azure/recursos/top-recursos-general` | [`(dashboards-nubes)/cloud-azure/recursos/top-recursos-general/page.tsx`](#app-dashboards-nubes-cloud-azure-recursos-top-recursos-general-page-tsx) | page |
| `/cloud-azure/recursos/traffic-manager` | [`(dashboards-nubes)/cloud-azure/recursos/traffic-manager/page.tsx`](#app-dashboards-nubes-cloud-azure-recursos-traffic-manager-page-tsx) | page |
| `/cloud-azure/recursos/vm` | [`(dashboards-nubes)/cloud-azure/recursos/vm/page.tsx`](#app-dashboards-nubes-cloud-azure-recursos-vm-page-tsx) | page |
| `/cloud-azure/tables-azure/tablas-item-azure` | [`(dashboards-nubes)/cloud-azure/tables-azure/tablas-item-azure/page.tsx`](#app-dashboards-nubes-cloud-azure-tables-azure-tablas-item-azure-page-tsx) | page |
| `/cloud-azure/tags` | [`(dashboards-nubes)/cloud-azure/tags/page.tsx`](#app-dashboards-nubes-cloud-azure-tags-page-tsx) | page |
| `/cloud-gcp` | [`(dashboards-nubes)/cloud-gcp/layout.tsx`](#app-dashboards-nubes-cloud-gcp-layout-tsx) | layout |
| `/cloud-gcp` | [`(dashboards-nubes)/cloud-gcp/page.tsx`](#app-dashboards-nubes-cloud-gcp-page-tsx) | page |
| `/cloud-gcp/compromisos/resource-based-cuds` | [`(dashboards-nubes)/cloud-gcp/compromisos/resource-based-cuds/page.tsx`](#app-dashboards-nubes-cloud-gcp-compromisos-resource-based-cuds-page-tsx) | page |
| `/cloud-gcp/compromisos/spend-based-cuds` | [`(dashboards-nubes)/cloud-gcp/compromisos/spend-based-cuds/page.tsx`](#app-dashboards-nubes-cloud-gcp-compromisos-spend-based-cuds-page-tsx) | page |
| `/cloud-gcp/consumos/cloud-sql` | [`(dashboards-nubes)/cloud-gcp/consumos/cloud-sql/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-cloud-sql-page-tsx) | page |
| `/cloud-gcp/consumos/clusters-gke` | [`(dashboards-nubes)/cloud-gcp/consumos/clusters-gke/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-clusters-gke-page-tsx) | page |
| `/cloud-gcp/consumos/compute-engine` | [`(dashboards-nubes)/cloud-gcp/consumos/compute-engine/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-compute-engine-page-tsx) | page |
| `/cloud-gcp/consumos/dns/zonas-consumo-estado` | [`(dashboards-nubes)/cloud-gcp/consumos/dns/zonas-consumo-estado/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-dns-zonas-consumo-estado-page-tsx) | page |
| `/cloud-gcp/consumos/filestore` | [`(dashboards-nubes)/cloud-gcp/consumos/filestore/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-filestore-page-tsx) | page |
| `/cloud-gcp/consumos/instances-group` | [`(dashboards-nubes)/cloud-gcp/consumos/instances-group/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-instances-group-page-tsx) | page |
| `/cloud-gcp/consumos/load-balancers/consumo-uso` | [`(dashboards-nubes)/cloud-gcp/consumos/load-balancers/consumo-uso/page.tsx`](#app-dashboards-nubes-cloud-gcp-consumos-load-balancers-consumo-uso-page-tsx) | page |
| `/cloud-gcp/facturacion/tendencia-facturacion` | [`(dashboards-nubes)/cloud-gcp/facturacion/tendencia-facturacion/page.tsx`](#app-dashboards-nubes-cloud-gcp-facturacion-tendencia-facturacion-page-tsx) | page |
| `/cloud-gcp/finops-metrics-ai` | [`(dashboards-nubes)/cloud-gcp/finops-metrics-ai/page.tsx`](#app-dashboards-nubes-cloud-gcp-finops-metrics-ai-page-tsx) | page |
| `/cloud-gcp/funciones/networking/ips-sin-uso` | [`(dashboards-nubes)/cloud-gcp/funciones/networking/ips-sin-uso/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-networking-ips-sin-uso-page-tsx) | page |
| `/cloud-gcp/funciones/networking/subnets-sin-recursos` | [`(dashboards-nubes)/cloud-gcp/funciones/networking/subnets-sin-recursos/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-networking-subnets-sin-recursos-page-tsx) | page |
| `/cloud-gcp/funciones/spot-vs-standard-vm` | [`(dashboards-nubes)/cloud-gcp/funciones/spot-vs-standard-vm/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-spot-vs-standard-vm-page-tsx) | page |
| `/cloud-gcp/funciones/top-cloud-storage-buckets` | [`(dashboards-nubes)/cloud-gcp/funciones/top-cloud-storage-buckets/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-top-cloud-storage-buckets-page-tsx) | page |
| `/cloud-gcp/funciones/top-facturacion-region` | [`(dashboards-nubes)/cloud-gcp/funciones/top-facturacion-region/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-top-facturacion-region-page-tsx) | page |
| `/cloud-gcp/funciones/top-filestore-sub-utilizado` | [`(dashboards-nubes)/cloud-gcp/funciones/top-filestore-sub-utilizado/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-top-filestore-sub-utilizado-page-tsx) | page |
| `/cloud-gcp/funciones/unused-resources/clusters-gke` | [`(dashboards-nubes)/cloud-gcp/funciones/unused-resources/clusters-gke/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-clusters-gke-page-tsx) | page |
| `/cloud-gcp/funciones/unused-resources/compute-engine` | [`(dashboards-nubes)/cloud-gcp/funciones/unused-resources/compute-engine/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-compute-engine-page-tsx) | page |
| `/cloud-gcp/funciones/unused-resources/filestore` | [`(dashboards-nubes)/cloud-gcp/funciones/unused-resources/filestore/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-filestore-page-tsx) | page |
| `/cloud-gcp/funciones/unused-resources/instance-groups` | [`(dashboards-nubes)/cloud-gcp/funciones/unused-resources/instance-groups/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-instance-groups-page-tsx) | page |
| `/cloud-gcp/funciones/unused-resources/persistent-disks` | [`(dashboards-nubes)/cloud-gcp/funciones/unused-resources/persistent-disks/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-persistent-disks-page-tsx) | page |
| `/cloud-gcp/funciones/uso-costo-por-localizacion` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-costo-por-localizacion/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-costo-por-localizacion-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-mysql-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-postgresql-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-sqlserver-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/cluster-gke` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cluster-gke/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cluster-gke-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/compute-engines` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/compute-engines/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-compute-engines-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/filestore` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/filestore/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-filestore-page-tsx) | page |
| `/cloud-gcp/funciones/uso-horario-habil-no-habil/instance-group` | [`(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/instance-group/page.tsx`](#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-instance-group-page-tsx) | page |
| `/cloud-gcp/presupuesto` | [`(dashboards-nubes)/cloud-gcp/presupuesto/PresupuestoClientLayout.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-presupuestoclientlayout-tsx) | PresupuestoClientLayout |
| `/cloud-gcp/presupuesto` | [`(dashboards-nubes)/cloud-gcp/presupuesto/layout.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-layout-tsx) | layout |
| `/cloud-gcp/presupuesto` | [`(dashboards-nubes)/cloud-gcp/presupuesto/page.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-page-tsx) | page |
| `/cloud-gcp/presupuesto/centro-de-costo` | [`(dashboards-nubes)/cloud-gcp/presupuesto/centro-de-costo/page.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-centro-de-costo-page-tsx) | page |
| `/cloud-gcp/presupuesto/costos-vs-presupuesto` | [`(dashboards-nubes)/cloud-gcp/presupuesto/costos-vs-presupuesto/page.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-costos-vs-presupuesto-page-tsx) | page |
| `/cloud-gcp/presupuesto/presupuesto-anual` | [`(dashboards-nubes)/cloud-gcp/presupuesto/presupuesto-anual/page.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-presupuesto-anual-page-tsx) | page |
| `/cloud-gcp/presupuesto/presupuesto-mensual` | [`(dashboards-nubes)/cloud-gcp/presupuesto/presupuesto-mensual/page.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-presupuesto-mensual-page-tsx) | page |
| `/cloud-gcp/quotas` | [`(dashboards-nubes)/cloud-gcp/quotas/page.tsx`](#app-dashboards-nubes-cloud-gcp-quotas-page-tsx) | page |
| `/cloud-gcp/recomendaciones` | [`(dashboards-nubes)/cloud-gcp/recomendaciones/page.tsx`](#app-dashboards-nubes-cloud-gcp-recomendaciones-page-tsx) | page |
| `/cloud-gcp/recomendaciones/rec-statuses` | [`(dashboards-nubes)/cloud-gcp/recomendaciones/rec-statuses/page.tsx`](#app-dashboards-nubes-cloud-gcp-recomendaciones-rec-statuses-page-tsx) | page |
| `/cloud-gcp/recursos/cloudsql/mysql` | [`(dashboards-nubes)/cloud-gcp/recursos/cloudsql/mysql/page.tsx`](#app-dashboards-nubes-cloud-gcp-recursos-cloudsql-mysql-page-tsx) | page |
| `/cloud-gcp/recursos/cloudsql/postgresql` | [`(dashboards-nubes)/cloud-gcp/recursos/cloudsql/postgresql/page.tsx`](#app-dashboards-nubes-cloud-gcp-recursos-cloudsql-postgresql-page-tsx) | page |
| `/cloud-gcp/recursos/cloudsql/sqlserver` | [`(dashboards-nubes)/cloud-gcp/recursos/cloudsql/sqlserver/page.tsx`](#app-dashboards-nubes-cloud-gcp-recursos-cloudsql-sqlserver-page-tsx) | page |
| `/cloud-gcp/recursos/clusters-gke` | [`(dashboards-nubes)/cloud-gcp/recursos/clusters-gke/page.tsx`](#app-dashboards-nubes-cloud-gcp-recursos-clusters-gke-page-tsx) | page |
| `/cloud-gcp/recursos/compute-engine` | [`(dashboards-nubes)/cloud-gcp/recursos/compute-engine/page.tsx`](#app-dashboards-nubes-cloud-gcp-recursos-compute-engine-page-tsx) | page |
| `/cloud-gcp/recursos/instance-groups` | [`(dashboards-nubes)/cloud-gcp/recursos/instance-groups/page.tsx`](#app-dashboards-nubes-cloud-gcp-recursos-instance-groups-page-tsx) | page |
| `/cloud-gcp/reservas` | [`(dashboards-nubes)/cloud-gcp/reservas/page.tsx`](#app-dashboards-nubes-cloud-gcp-reservas-page-tsx) | page |
| `/cloud-gcp/tags` | [`(dashboards-nubes)/cloud-gcp/tags/page.tsx`](#app-dashboards-nubes-cloud-gcp-tags-page-tsx) | page |
| `/comparacion-nubes` | [`(profile)/(comparacion)/comparacion-nubes/page.tsx`](#app-profile-comparacion-comparacion-nubes-page-tsx) | page |
| `/comparacion-nubes/internube` | [`(profile)/(comparacion)/comparacion-nubes/internube/page.tsx`](#app-profile-comparacion-comparacion-nubes-internube-page-tsx) | page |
| `/comparacion-nubes/intranube` | [`(profile)/(comparacion)/comparacion-nubes/intranube/page.tsx`](#app-profile-comparacion-comparacion-nubes-intranube-page-tsx) | page |
| `/comparacion-nubes/intranube/computo` | [`(profile)/(comparacion)/comparacion-nubes/intranube/computo/page.tsx`](#app-profile-comparacion-comparacion-nubes-intranube-computo-page-tsx) | page |
| `/comparacion-nubes/intranube/facturacion` | [`(profile)/(comparacion)/comparacion-nubes/intranube/facturacion/page.tsx`](#app-profile-comparacion-comparacion-nubes-intranube-facturacion-page-tsx) | page |
| `/comparacion-nubes/intranube/storage` | [`(profile)/(comparacion)/comparacion-nubes/intranube/storage/page.tsx`](#app-profile-comparacion-comparacion-nubes-intranube-storage-page-tsx) | page |
| `/comparacion-nubes/multinube` | [`(profile)/(comparacion)/comparacion-nubes/multinube/page.tsx`](#app-profile-comparacion-comparacion-nubes-multinube-page-tsx) | page |
| `/forgot-password` | [`(auth)/forgot-password/page.tsx`](#app-auth-forgot-password-page-tsx) | page |
| `/google-vertex` | [`(dashboards-ia)/google-vertex/layout.tsx`](#app-dashboards-ia-google-vertex-layout-tsx) | layout |
| `/google-vertex` | [`(dashboards-ia)/google-vertex/page.tsx`](#app-dashboards-ia-google-vertex-page-tsx) | page |
| `/google-vertex/comparacion` | [`(dashboards-ia)/google-vertex/comparacion/page.tsx`](#app-dashboards-ia-google-vertex-comparacion-page-tsx) | page |
| `/google-vertex/costo-optimizacion` | [`(dashboards-ia)/google-vertex/costo-optimizacion/page.tsx`](#app-dashboards-ia-google-vertex-costo-optimizacion-page-tsx) | page |
| `/google-vertex/costo-optimizacion/vertex-models` | [`(dashboards-ia)/google-vertex/costo-optimizacion/vertex-models/page.tsx`](#app-dashboards-ia-google-vertex-costo-optimizacion-vertex-models-page-tsx) | page |
| `/google-vertex/prompt-opt` | [`(dashboards-ia)/google-vertex/prompt-opt/page.tsx`](#app-dashboards-ia-google-vertex-prompt-opt-page-tsx) | page |
| `/login` | [`(auth)/login/page.tsx`](#app-auth-login-page-tsx) | page |
| `/microsoft-foundry` | [`(dashboards-ia)/microsoft-foundry/layout.tsx`](#app-dashboards-ia-microsoft-foundry-layout-tsx) | layout |
| `/microsoft-foundry` | [`(dashboards-ia)/microsoft-foundry/page.tsx`](#app-dashboards-ia-microsoft-foundry-page-tsx) | page |
| `/microsoft-foundry/comparacion` | [`(dashboards-ia)/microsoft-foundry/comparacion/page.tsx`](#app-dashboards-ia-microsoft-foundry-comparacion-page-tsx) | page |
| `/microsoft-foundry/costo-optimizacion` | [`(dashboards-ia)/microsoft-foundry/costo-optimizacion/page.tsx`](#app-dashboards-ia-microsoft-foundry-costo-optimizacion-page-tsx) | page |
| `/microsoft-foundry/costo-optimizacion/foundation-models` | [`(dashboards-ia)/microsoft-foundry/costo-optimizacion/foundation-models/page.tsx`](#app-dashboards-ia-microsoft-foundry-costo-optimizacion-foundation-models-page-tsx) | page |
| `/microsoft-foundry/prompt-opt` | [`(dashboards-ia)/microsoft-foundry/prompt-opt/page.tsx`](#app-dashboards-ia-microsoft-foundry-prompt-opt-page-tsx) | page |
| `/op-licencias` | [`(profile)/op-licencias/page.tsx`](#app-profile-op-licencias-page-tsx) | page |
| `/op-licencias/estado` | [`(profile)/op-licencias/estado/page.tsx`](#app-profile-op-licencias-estado-page-tsx) | page |
| `/op-licencias/generar` | [`(profile)/op-licencias/generar/page.tsx`](#app-profile-op-licencias-generar-page-tsx) | page |
| `/op-licencias/historial` | [`(profile)/op-licencias/historial/page.tsx`](#app-profile-op-licencias-historial-page-tsx) | page |
| `/op-licencias/importar` | [`(profile)/op-licencias/importar/page.tsx`](#app-profile-op-licencias-importar-page-tsx) | page |
| `/op-licencias/partner` | [`(profile)/op-licencias/partner/page.tsx`](#app-profile-op-licencias-partner-page-tsx) | page |
| `/op-licencias/solicitudes` | [`(profile)/op-licencias/solicitudes/page.tsx`](#app-profile-op-licencias-solicitudes-page-tsx) | page |
| `/open-ia` | [`(dashboards-ia)/open-ia/layout.tsx`](#app-dashboards-ia-open-ia-layout-tsx) | layout |
| `/open-ia` | [`(dashboards-ia)/open-ia/page.tsx`](#app-dashboards-ia-open-ia-page-tsx) | page |
| `/open-ia/costo-optimizacion` | [`(dashboards-ia)/open-ia/costo-optimizacion/page.tsx`](#app-dashboards-ia-open-ia-costo-optimizacion-page-tsx) | page |
| `/open-ia/costo-optimizacion/foundation-models` | [`(dashboards-ia)/open-ia/costo-optimizacion/foundation-models/page.tsx`](#app-dashboards-ia-open-ia-costo-optimizacion-foundation-models-page-tsx) | page |
| `/perfil` | [`(profile)/perfil/page.tsx`](#app-profile-perfil-page-tsx) | page |
| `/perfil/conectores` | [`(profile)/perfil/conectores/page.tsx`](#app-profile-perfil-conectores-page-tsx) | page |
| `/perfil/nubes` | [`(profile)/perfil/nubes/page.tsx`](#app-profile-perfil-nubes-page-tsx) | page |
| `/perfil/servicios-ia` | [`(profile)/perfil/servicios-ia/page.tsx`](#app-profile-perfil-servicios-ia-page-tsx) | page |
| `/perfilamiento` | [`(profile)/(perfilamiento)/perfilamiento/page.tsx`](#app-profile-perfilamiento-perfilamiento-page-tsx) | page |
| `/perfilamiento/licencias` | [`(profile)/(perfilamiento)/perfilamiento/licencias/page.tsx`](#app-profile-perfilamiento-perfilamiento-licencias-page-tsx) | page |
| `/perfilamiento/licencias/crear` | [`(profile)/(perfilamiento)/perfilamiento/licencias/crear/page.tsx`](#app-profile-perfilamiento-perfilamiento-licencias-crear-page-tsx) | page |
| `/perfilamiento/usuarios` | [`(profile)/(perfilamiento)/perfilamiento/usuarios/page.tsx`](#app-profile-perfilamiento-perfilamiento-usuarios-page-tsx) | page |
| `/perfilamiento/usuarios/crear` | [`(profile)/(perfilamiento)/perfilamiento/usuarios/crear/page.tsx`](#app-profile-perfilamiento-perfilamiento-usuarios-crear-page-tsx) | page |
| `/presupuesto` | [`(presupuesto)/presupuesto/PresupuestoClientLayout.tsx`](#app-presupuesto-presupuesto-presupuestoclientlayout-tsx) | PresupuestoClientLayout |
| `/presupuesto` | [`(presupuesto)/presupuesto/layout.tsx`](#app-presupuesto-presupuesto-layout-tsx) | layout |
| `/presupuesto` | [`(presupuesto)/presupuesto/page.tsx`](#app-presupuesto-presupuesto-page-tsx) | page |
| `/presupuesto/centro-de-costo` | [`(presupuesto)/presupuesto/centro-de-costo/page.tsx`](#app-presupuesto-presupuesto-centro-de-costo-page-tsx) | page |
| `/presupuesto/costos-vs-presupuesto` | [`(presupuesto)/presupuesto/costos-vs-presupuesto/page.tsx`](#app-presupuesto-presupuesto-costos-vs-presupuesto-page-tsx) | page |
| `/presupuesto/presupuesto-anual` | [`(presupuesto)/presupuesto/presupuesto-anual/page.tsx`](#app-presupuesto-presupuesto-presupuesto-anual-page-tsx) | page |
| `/presupuesto/presupuesto-mensual` | [`(presupuesto)/presupuesto/presupuesto-mensual/page.tsx`](#app-presupuesto-presupuesto-presupuesto-mensual-page-tsx) | page |
| `/reset-password` | [`(auth)/reset-password/page.tsx`](#app-auth-reset-password-page-tsx) | page |
| `/verify-2fa` | [`(auth)/verify-2fa/page.tsx`](#app-auth-verify-2fa-page-tsx) | page |

<a id="app-alertas-alertas-nube-page-tsx"></a>
## `app/(alertas)/alertas/[nube]/page.tsx`

**Página · ruta `/alertas/[nube]`**

Exporta:

- (default) componente `AlertasNubePage` `async ({ params }: { params: Promise<{ nube: string }> })`

Internos:

- constante `PROVIDER_NAMES`

- Usa: [`AlertsManager.tsx`](components/alertas.md#components-alertas-alertsmanager-tsx)

---

<a id="app-alertas-alertas-page-tsx"></a>
## `app/(alertas)/alertas/page.tsx`

**Página · ruta `/alertas`**

Exporta:

- constante `metadata` = `{ title: 'Alertas - Cloud Performance', }`
- (default) componente `AlertasLandingPage` `()`

- Usa: [`SelectAlertsCloud.tsx`](components/alertas.md#components-alertas-selectalertscloud-tsx)

---

<a id="app-alertas-layout-tsx"></a>
## `app/(alertas)/layout.tsx`

**Layout · ruta `/`**

Exporta:

- (default) componente `ProfileLayout` `async ({ children, }: Readonly<{ children: React.ReactNode; }>)`

- Usa: [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx), [`Navbar.tsx`](components/generales.md#components-navbar-tsx), [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts), [`SidebarProfile.tsx`](components/profile.md#components-profile-sidebarprofile-tsx)

---

<a id="app-auth-forgot-password-page-tsx"></a>
## `app/(auth)/forgot-password/page.tsx`

**Página (cliente) · ruta `/forgot-password`**

Exporta:

- (default) componente `ForgotPasswordPage` `()`

- API: `/api/auth/forgot-password`

---

<a id="app-auth-login-page-tsx"></a>
## `app/(auth)/login/page.tsx`

**Página · ruta `/login`**

Exporta:

- (default) componente `LoginPage` `()`

- Usa: [`LoginFormComponent.tsx`](components/auth.md#components-auth-loginformcomponent-tsx)

---

<a id="app-auth-reset-password-page-tsx"></a>
## `app/(auth)/reset-password/page.tsx`

**Página (cliente) · ruta `/reset-password`**

Exporta:

- (default) componente `ResetPasswordPage` `()`

Internos:

- componente `ResetPasswordForm` `()`

- API: `/api/auth/reset-password`, `/api/auth/validate-reset-token`
- Hooks: `useRouter`, `useSearchParams`

Notas de implementación:

- _ResetPasswordForm_: VALIDAR TOKEN ANTES DE MOSTRAR FORMULARIO
- _ResetPasswordForm_: Token expirado
- _ResetPasswordForm_: JSX — Campo contraseña
- _ResetPasswordForm_: Actualizar requisitos
- _ResetPasswordForm_: JSX — REQUISITOS
- _ResetPasswordForm_: JSX — FUERZA
- _ResetPasswordForm_: JSX — Confirmar contraseña

---

<a id="app-auth-verify-2fa-page-tsx"></a>
## `app/(auth)/verify-2fa/page.tsx`

**Página · ruta `/verify-2fa`**

Exporta:

- (default) componente `Verify2FaPage` `()`

- Usa: [`Verify2FaComponent.tsx`](components/auth.md#components-auth-verify2facomponent-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-comparacion-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/comparacion/page.tsx`

**Página · ruta `/amazon-bedrock/comparacion`**

Exporta:

- (default) componente `DashboardAmazonBedrockComparisonPage` `()`

- Usa: [`MainViewBMComparisonComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-mainviewbmcomparisoncomponent-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-costo-optimizacion-custom-models-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/costo-optimizacion/custom-models/page.tsx`

**Página · ruta `/amazon-bedrock/costo-optimizacion/custom-models`**

Exporta:

- (default) componente `CostOptimizationCustomModelsPage` `()`

- Usa: [`MainViewCOCustomModelsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-mainviewcocustommodelscomponent-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-costo-optimizacion-foundation-models-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/costo-optimizacion/foundation-models/page.tsx`

**Página · ruta `/amazon-bedrock/costo-optimizacion/foundation-models`**

Exporta:

- (default) componente `CostOptimizationCustomModelsPage` `()`

- Usa: [`MainViewCOFoundationComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-mainviewcofoundationcomponent-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-costo-optimizacion-inference-profiles-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/costo-optimizacion/inference-profiles/page.tsx`

**Página · ruta `/amazon-bedrock/costo-optimizacion/inference-profiles`**

Exporta:

- (default) componente `CostOptimizationInferenceProfilesPage` `()`

- Usa: [`MainViewCOInferenceProfilesComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-mainviewcoinferenceprofilescomponent-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-costo-optimizacion-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/costo-optimizacion/page.tsx`

**Página · ruta `/amazon-bedrock/costo-optimizacion`**

Exporta:

- (default) componente `DashboardAmazonBedrockCostAndOptimizationPage` `()`

- Usa: [`MainViewCostOptimizationComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-mainviewcostoptimizationcomponent-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-layout-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/layout.tsx`

**Layout (cliente) · ruta `/amazon-bedrock`**

Exporta:

- (default) componente `AwsBedrockLayout` `({ children }: LayoutProps)`

Interfaz `LayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/page.tsx`

**Página · ruta `/amazon-bedrock`**

Exporta:

- (default) componente `DashboardAwsBedrockPage` `()`

- Usa: [`card.tsx`](components/ui.md#components-ui-card-tsx), [`button.tsx`](components/ui.md#components-ui-button-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`separator.tsx`](components/ui.md#components-ui-separator-tsx)

---

<a id="app-dashboards-ia-amazon-bedrock-prompt-opt-page-tsx"></a>
## `app/(dashboards-ia)/amazon-bedrock/prompt-opt/page.tsx`

**Página · ruta `/amazon-bedrock/prompt-opt`**

Exporta:

- (default) componente `DashboardAmazonBedrockPromptOptPage` `()`

- Usa: [`MainViewBMPromptOptComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-mainviewbmpromptoptcomponent-tsx)

---

<a id="app-dashboards-ia-google-vertex-comparacion-page-tsx"></a>
## `app/(dashboards-ia)/google-vertex/comparacion/page.tsx`

**Página · ruta `/google-vertex/comparacion`**

Exporta:

- (default) componente `DashboardGoogleVertexComparisonPage` `()`

- Usa: [`MainViewGcpVertexComparisonComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-mainviewgcpvertexcomparisoncomponent-tsx)

---

<a id="app-dashboards-ia-google-vertex-costo-optimizacion-page-tsx"></a>
## `app/(dashboards-ia)/google-vertex/costo-optimizacion/page.tsx`

**Página · ruta `/google-vertex/costo-optimizacion`**

Exporta:

- (default) componente `DashboardGoogleVertexCostAndOptimizationPage` `()`

- Usa: [`MainViewCostOptimizationGcpVertexComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-mainviewcostoptimizationgcpvertexcomponent-tsx)

---

<a id="app-dashboards-ia-google-vertex-costo-optimizacion-vertex-models-page-tsx"></a>
## `app/(dashboards-ia)/google-vertex/costo-optimizacion/vertex-models/page.tsx`

**Página · ruta `/google-vertex/costo-optimizacion/vertex-models`**

Exporta:

- (default) componente `CostOptimizationGcpVertexFoundryPage` `()`

- Usa: [`MainViewCOGcpVertexComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-mainviewcogcpvertexcomponent-tsx)

---

<a id="app-dashboards-ia-google-vertex-layout-tsx"></a>
## `app/(dashboards-ia)/google-vertex/layout.tsx`

**Layout (cliente) · ruta `/google-vertex`**

Exporta:

- (default) componente `GoogleVertexLayout` `({ children }: LayoutProps)`

Interfaz `LayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

---

<a id="app-dashboards-ia-google-vertex-page-tsx"></a>
## `app/(dashboards-ia)/google-vertex/page.tsx`

**Página · ruta `/google-vertex`**

Exporta:

- (default) componente `DashboardGoogleVertexPage` `()`

---

<a id="app-dashboards-ia-google-vertex-prompt-opt-page-tsx"></a>
## `app/(dashboards-ia)/google-vertex/prompt-opt/page.tsx`

**Página · ruta `/google-vertex/prompt-opt`**

Exporta:

- (default) componente `DashboardGoogleVertexAIPromptOptPage` `()`

- Usa: [`MainViewVXPromptOptComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-mainviewvxpromptoptcomponent-tsx)

---

<a id="app-dashboards-ia-layout-tsx"></a>
## `app/(dashboards-ia)/layout.tsx`

**Layout · ruta `/`**

Exporta:

- (default) componente `DashboardAIServicesLayout` `async ({ children, }: Readonly<{ children: React.ReactNode; }>)`

- Usa: [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx), [`sonner.tsx`](components/ui.md#components-ui-sonner-tsx), [`SidebarDashboardServiciosIa.tsx`](components/generales.md#components-sidebardashboardserviciosia-tsx), [`Navbar.tsx`](components/generales.md#components-navbar-tsx), [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts)

---

<a id="app-dashboards-ia-microsoft-foundry-comparacion-page-tsx"></a>
## `app/(dashboards-ia)/microsoft-foundry/comparacion/page.tsx`

**Página · ruta `/microsoft-foundry/comparacion`**

Exporta:

- (default) componente `DashboardMicrosoftFoundryComparisonPage` `()`

- Usa: [`MainViewAFComparisonComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-mainviewafcomparisoncomponent-tsx)

---

<a id="app-dashboards-ia-microsoft-foundry-costo-optimizacion-foundation-models-page-tsx"></a>
## `app/(dashboards-ia)/microsoft-foundry/costo-optimizacion/foundation-models/page.tsx`

**Página · ruta `/microsoft-foundry/costo-optimizacion/foundation-models`**

Exporta:

- (default) componente `CostOptimizationAzureFoundryPage` `()`

- Usa: [`MainViewCOAzureFoundryComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-mainviewcoazurefoundrycomponent-tsx)

---

<a id="app-dashboards-ia-microsoft-foundry-costo-optimizacion-page-tsx"></a>
## `app/(dashboards-ia)/microsoft-foundry/costo-optimizacion/page.tsx`

**Página · ruta `/microsoft-foundry/costo-optimizacion`**

Exporta:

- (default) componente `DashboardMicrosoftFoundryCostAndOptimizationPage` `()`

- Usa: [`MainViewCostOptimizationComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-mainviewcostoptimizationcomponent-tsx)

---

<a id="app-dashboards-ia-microsoft-foundry-layout-tsx"></a>
## `app/(dashboards-ia)/microsoft-foundry/layout.tsx`

**Layout (cliente) · ruta `/microsoft-foundry`**

Exporta:

- (default) componente `MicrosoftFoundryLayout` `({ children }: LayoutProps)`

Interfaz `LayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

---

<a id="app-dashboards-ia-microsoft-foundry-page-tsx"></a>
## `app/(dashboards-ia)/microsoft-foundry/page.tsx`

**Página · ruta `/microsoft-foundry`**

Exporta:

- (default) componente `DashboardMicrosoftFoundryPage` `()`

---

<a id="app-dashboards-ia-microsoft-foundry-prompt-opt-page-tsx"></a>
## `app/(dashboards-ia)/microsoft-foundry/prompt-opt/page.tsx`

**Página · ruta `/microsoft-foundry/prompt-opt`**

Exporta:

- (default) componente `DashboardMicrosoftFoundryPromptOptPage` `()`

- Usa: [`MainViewFMPromptOptComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-mainviewfmpromptoptcomponent-tsx)

---

<a id="app-dashboards-ia-open-ia-costo-optimizacion-foundation-models-page-tsx"></a>
## `app/(dashboards-ia)/open-ia/costo-optimizacion/foundation-models/page.tsx`

**Página · ruta `/open-ia/costo-optimizacion/foundation-models`**

Exporta:

- (default) componente `DashboardOpenIACostAndOptimizationFoundationModelsPage` `()`

- Usa: [`MainViewCOOpenAIComponent.tsx`](components/open-ia.md#components-open-ia-costo-optimizacion-foundation-models-mainviewcoopenaicomponent-tsx)

---

<a id="app-dashboards-ia-open-ia-costo-optimizacion-page-tsx"></a>
## `app/(dashboards-ia)/open-ia/costo-optimizacion/page.tsx`

**Página · ruta `/open-ia/costo-optimizacion`**

Exporta:

- (default) componente `DashboardOpenIACostAndOptimizationPage` `()`

- Usa: [`MainViewCostOptimizationOpenAIComponent.tsx`](components/open-ia.md#components-open-ia-costo-optimizacion-mainviewcostoptimizationopenaicomponent-tsx)

---

<a id="app-dashboards-ia-open-ia-layout-tsx"></a>
## `app/(dashboards-ia)/open-ia/layout.tsx`

**Layout (cliente) · ruta `/open-ia`**

Exporta:

- (default) componente `OpenIALayout` `({ children }: OpenIALayoutProps)`

Interfaz `OpenIALayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

---

<a id="app-dashboards-ia-open-ia-page-tsx"></a>
## `app/(dashboards-ia)/open-ia/page.tsx`

**Página · ruta `/open-ia`**

Exporta:

- (default) componente `DashboardOpenIA` `()`

---

<a id="app-dashboards-nubes-cloud-aws-compromisos-saving-plans-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/compromisos/saving-plans/page.tsx`

**Página · ruta `/cloud-aws/compromisos/saving-plans`**

Exporta:

- (default) componente `DashboardSavingPlanAws` `()`

- Usa: [`MainViewSavingPlansComponent.tsx`](components/aws/vista-saving-plan.md#components-aws-vista-saving-plan-mainviewsavingplanscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-asg-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/asg/page.tsx`

**Página · ruta `/cloud-aws/consumos/asg`**

Exporta:

- (default) componente `DashboardAwsAsgEc2ConsumePage` `()`

- Usa: [`MainViewConsumeAsgComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-asg-mainviewconsumeasgcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-ec2-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/ec2/page.tsx`

**Página · ruta `/cloud-aws/consumos/ec2`**

Exporta:

- (default) componente `DashboardAwsEc2ConsumePage` `()`

- Usa: [`MainViewConsumeEc2Component.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-mainviewconsumeec2component-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-eks-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/eks/page.tsx`

**Página · ruta `/cloud-aws/consumos/eks`**

Exporta:

- (default) componente `DashboardAwsEc2ConsumePage` `()`

- Usa: [`MainViewConsumeEksComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-eks-mainviewconsumeekscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-elbv2-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/elbv2/page.tsx`

**Página · ruta `/cloud-aws/consumos/elbv2`**

Exporta:

- (default) componente `DashboardAwsLoadbalancersV2ConsumePage` `()`

- Usa: [`MainViewElbV2ConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-elbv2-mainviewelbv2consumecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-nat-gateways-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/nat_gateways/page.tsx`

**Página · ruta `/cloud-aws/consumos/nat_gateways`**

Exporta:

- (default) componente `DashboardAwsNatGatewaysConsumePage` `()`

- Usa: [`MainViewNatGatewaysConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-nat-gateways-mainviewnatgatewaysconsumecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-rds-mariadb-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/rds/mariadb/page.tsx`

**Página · ruta `/cloud-aws/consumos/rds/mariadb`**

Exporta:

- (default) componente `DashboardAwsRdsMysqlConsumePage` `()`

- Usa: [`MainViewConsumeRdsComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-rds-mysql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/rds/mysql/page.tsx`

**Página · ruta `/cloud-aws/consumos/rds/mysql`**

Exporta:

- (default) componente `DashboardAwsRdsMysqlConsumePage` `()`

- Usa: [`MainViewConsumeRdsComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-rds-oracle-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/rds/oracle/page.tsx`

**Página · ruta `/cloud-aws/consumos/rds/oracle`**

Exporta:

- (default) componente `DashboardAwsRdsMysqlConsumePage` `()`

- Usa: [`MainViewConsumeRdsComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-rds-postgresql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/rds/postgresql/page.tsx`

**Página · ruta `/cloud-aws/consumos/rds/postgresql`**

Exporta:

- (default) componente `DashboardAwsRdsPgConsumePage` `()`

- Usa: [`MainViewConsumeRdsComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-consumos-rds-sqlserver-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/consumos/rds/sqlserver/page.tsx`

**Página · ruta `/cloud-aws/consumos/rds/sqlserver`**

Exporta:

- (default) componente `DashboardAwsRdsMysqlConsumePage` `()`

- Usa: [`MainViewConsumeRdsComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-eventos-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/eventos/page.tsx`

**Página · ruta `/cloud-aws/eventos`**

Exporta:

- (default) componente `DashboardAwsEventsPage` `()`

- Usa: [`MainViewEventsComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-mainvieweventscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-facturacion-tendencia-facturacion-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/facturacion/tendencia-facturacion/page.tsx`

**Página · ruta `/cloud-aws/facturacion/tendencia-facturacion`**

Exporta:

- (default) componente `DashboardTendenciaFacturacion` `()`

- Usa: [`MainViewTendenciaFacturacionComponent.tsx`](components/aws/vista-facturacion.md#components-aws-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-finops-metrics-ai-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/finops-metrics-ai/page.tsx`

**Página · ruta `/cloud-aws/finops-metrics-ai`**

Exporta:

- (default) componente `DashboardAwsFinopsMetrics` `()`

- Usa: [`MainViewAiFinopsMetricsComponent.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-ec2-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-ec2/page.tsx`

**Página · ruta `/cloud-aws/funciones/avg-uso-loc-inst-ec2`**

Exporta:

- (default) componente `PromedioUsoLocInstanciasEc2` `()`

- Usa: [`MainViewInstanciasAVGUsoLocInstEC2Component.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-mainviewinstanciasavgusolocinstec2component-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-mariadb-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-mariadb/page.tsx`

**Página · ruta `/cloud-aws/funciones/avg-uso-loc-inst-rds-mariadb`**

Exporta:

- (default) componente `PromedioUsoLocInstanciasRdsMariaDb` `()`

- Usa: [`MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-mainviewinstanciasavgusolocinstrdsmariadbcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-mysql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-mysql/page.tsx`

**Página · ruta `/cloud-aws/funciones/avg-uso-loc-inst-rds-mysql`**

Exporta:

- (default) componente `PromedioUsoLocInstanciasRdsMysql` `()`

- Usa: [`MainViewInstanciasAVGUsoLocInstRdsMySQLComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-mainviewinstanciasavgusolocinstrdsmysqlcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-oracle-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-oracle/page.tsx`

**Página · ruta `/cloud-aws/funciones/avg-uso-loc-inst-rds-oracle`**

Exporta:

- (default) componente `PromedioUsoLocInstanciasRdsOracle` `()`

- Usa: [`MainViewInstanciasAVGUsoLocInstRdsOracleComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-mainviewinstanciasavgusolocinstrdsoraclecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-pg-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-pg/page.tsx`

**Página · ruta `/cloud-aws/funciones/avg-uso-loc-inst-rds-pg`**

Exporta:

- (default) componente `PromedioUsoLocInstanciasRdsPostgresql` `()`

- Usa: [`MainViewInstanciasAVGUsoLocInstRdsPgComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-mainviewinstanciasavgusolocinstrdspgcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-sqlserver-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/avg-uso-loc-inst-rds-sqlserver/page.tsx`

**Página · ruta `/cloud-aws/funciones/avg-uso-loc-inst-rds-sqlserver`**

Exporta:

- (default) componente `PromedioUsoLocInstanciasRdsSqlServer` `()`

- Usa: [`MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-mainviewinstanciasavgusolocinstrdssqlservercomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `DashboardAwsConsumoEC2AutoscalingGroupsHorario` `()`

- Usa: [`MainViewConsumoEC2AsgHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-mainviewconsumoec2asghorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-ec2-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-ec2-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `DashboardAwsConsumoEC2Horario` `()`

- Usa: [`MainViewConsumoEC2HorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-mainviewconsumoec2horariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-ec2-nodos-eks-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `DashboardAwsConsumoEC2NodesEKSHorario` `()`

- Usa: [`MainViewConsumoEC2NodosEKSHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-mainviewconsumoec2nodosekshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-rds-mariadb-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-rds-mariadb-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioInstanciasRdsMariadb` `()`

- Usa: [`MainViewConsumoRdsHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-rds-mysql-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-rds-mysql-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioInstanciasRdsMysql` `()`

- Usa: [`MainViewConsumoRdsHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-rds-oracle-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-rds-oracle-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioInstanciasRdsOracle` `()`

- Usa: [`MainViewConsumoRdsHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-rds-postgresql-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-rds-postgresql-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioInstanciasRdsPostgresql` `()`

- Usa: [`MainViewConsumoRdsHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-consumo-rds-sql-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-aws/funciones/consumo-rds-sql-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioInstanciasRdsSqlServer` `()`

- Usa: [`MainViewConsumoRdsHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-ebs-no-utilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/ebs-no-utilizados/page.tsx`

**Página · ruta `/cloud-aws/funciones/ebs-no-utilizados`**

Exporta:

- (default) componente `DashboardAwsEbsUnused` `()`

- Usa: [`MainViewUnusedEbsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-mainviewunusedebscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-autoscaling-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/ec2-no-utilizados/autoscaling/page.tsx`

**Página · ruta `/cloud-aws/funciones/ec2-no-utilizados/autoscaling`**

Exporta:

- (default) componente `DashboardAwsAutoscalingEc2Unused` `()`

- Usa: [`MainViewUnusedAutoscalingComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-mainviewunusedautoscalingcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-eks-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/ec2-no-utilizados/eks/page.tsx`

**Página · ruta `/cloud-aws/funciones/ec2-no-utilizados/eks`**

Exporta:

- (default) componente `DashboardAwsEksEc2Unused` `()`

- Usa: [`MainViewUnusedEksComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-mainviewunusedekscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/ec2-no-utilizados/page.tsx`

**Página · ruta `/cloud-aws/funciones/ec2-no-utilizados`**

Exporta:

- (default) componente `DashboardAwsEc2Unused` `()`

- Usa: [`MainViewUnusedEc2Component.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-mainviewunusedec2component-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-elbv2-no-utilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/elbv2-no-utilizados/page.tsx`

**Página · ruta `/cloud-aws/funciones/elbv2-no-utilizados`**

Exporta:

- (default) componente `DashboardAwsElbV2Unused` `()`

- Usa: [`MainViewUnusedElbV2Component.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-mainviewunusedelbv2component-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-nat-gateways-no-utilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/nat-gateways-no-utilizados/page.tsx`

**Página · ruta `/cloud-aws/funciones/nat-gateways-no-utilizados`**

Exporta:

- (default) componente `DashboardAwsNatGatewaysUnused` `()`

- Usa: [`MainViewUnusedNatGatewaysComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-mainviewunusednatgatewayscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-routes53-no-utilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/routes53-no-utilizados/page.tsx`

**Página · ruta `/cloud-aws/funciones/routes53-no-utilizados`**

Exporta:

- (default) componente `DashboardAwsRoutes53Unused` `()`

- Usa: [`MainViewUnusedRoute53Component.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-r53-mainviewunusedroute53component-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-spot-vs-vm-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/spot-vs-vm/page.tsx`

**Página · ruta `/cloud-aws/funciones/spot-vs-vm`**

Exporta:

- (default) componente `DashboardAwsSpotVsVm` `()`

- Usa: [`MainViewSpotVsVmComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-mainviewspotvsvmcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-familia-de-instancia-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-familia-de-instancia/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-por-familia-de-instancia`**

Exporta:

- (default) componente `DashboardAwsTopDolaresFamilia` `()`

- Usa: [`MainViewTopDolarFamiliaComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-mainviewtopdolarfamiliacomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-id-recurso-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-id-recurso/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-por-id-recurso`**

Exporta:

- (default) componente `DashboardAwsTopDolaresRecurso` `()`

- Usa: [`MainViewTopDolarRecursoComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-mainviewtopdolarrecursocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-cobro-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-tipo-de-cobro/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-por-tipo-de-cobro`**

Exporta:

- (default) componente `DashboardAwsTopDolaresTipoCobro` `()`

- Usa: [`MainViewTopDolarTipoCobroComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-mainviewtopdolartipocobrocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-compra-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-tipo-de-compra/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-por-tipo-de-compra`**

Exporta:

- (default) componente `DashboardAwsTopDolaresTipoCompra` `()`

- Usa: [`MainViewTopDolarTipoCompraComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-mainviewtopdolartipocompracomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-instancia-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-por-tipo-de-instancia/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-por-tipo-de-instancia`**

Exporta:

- (default) componente `DashboardAwsTopDolaresInstancias` `()`

- Usa: [`TopDolarInstanciasComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-topdolarinstanciascomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-region-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-region/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-region`**

Exporta:

- (default) componente `DashboardAwsTopDolaresRegion` `()`

- Usa: [`TopDolarRegionComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-region-topdolarregioncomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-dolares-so-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-dolares-so/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-dolares-so`**

Exporta:

- (default) componente `DashboardAwsTopDolaresSO` `()`

- Usa: [`TopDolarSOComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-so-topdolarsocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-recursos-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-recursos/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-recursos`**

Exporta:

- (default) componente `DashboardAwsTopRecursos` `()`

- Usa: [`MainViewTopRecursosComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-recursos-mainviewtoprecursoscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-top-s3-buckets-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/top-s3-buckets/page.tsx`

**Página · ruta `/cloud-aws/funciones/top-s3-buckets`**

Exporta:

- (default) componente `DashboardAwsTopS3Buckets` `()`

- Usa: [`MainViewTopS3BucketsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-mainviewtops3bucketscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-funciones-variacion-tendencia-uso-de-recursos-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/funciones/variacion-tendencia-uso-de-recursos/page.tsx`

**Página · ruta `/cloud-aws/funciones/variacion-tendencia-uso-de-recursos`**

Exporta:

- (default) componente `VariacionTendenciaUsoDeRecursos` `()`

- Usa: [`MainViewVariacionTendenciaUsoDeRecursosComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-mainviewvariaciontendenciausoderecursoscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-layout-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/layout.tsx`

**Layout (cliente) · ruta `/cloud-aws`**

Exporta:

- (default) componente `AwsLayout` `({ children }: LayoutProps)`

Interfaz `LayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/page.tsx`

**Página · ruta `/cloud-aws`**

Exporta:

- (default) componente `DashboardAwsPage` `()`

- Usa: [`card.tsx`](components/ui.md#components-ui-card-tsx), [`button.tsx`](components/ui.md#components-ui-button-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`separator.tsx`](components/ui.md#components-ui-separator-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-presupuestoclientlayout-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/PresupuestoClientLayout.tsx`

**Archivo de ruta (cliente) · ruta `/cloud-aws/presupuesto`**

Exporta:

- componente `PresupuestoClientLayout` `({ children }: PresupuestoClientLayoutProps)`

Interfaz `PresupuestoClientLayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)
- Usado por: [`layout.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-layout-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-centro-de-costo-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/centro-de-costo/page.tsx`

**Página · ruta `/cloud-aws/presupuesto/centro-de-costo`**

Exporta:

- (default) componente `DashboardPresupuestoCentroDeCostoPage` `()`

- Usa: [`MainViewCentroDeCostoComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-costos-vs-presupuesto-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/costos-vs-presupuesto/page.tsx`

**Página · ruta `/cloud-aws/presupuesto/costos-vs-presupuesto`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCostoVsPresupuestoComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-layout-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/layout.tsx`

**Layout · ruta `/cloud-aws/presupuesto`**

Exporta:

- (default) componente `PresupuestoLayout` `({ children, }: Readonly<{ children: React.ReactNode; }>)` — Control por plan (canAccessPresupuesto). La barra lateral y el navbar ya los pone el layout de la nube.

- Usa: [`PresupuestoClientLayout.tsx`](#app-dashboards-nubes-cloud-aws-presupuesto-presupuestoclientlayout-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/page.tsx`

**Página · ruta `/cloud-aws/presupuesto`**

Exporta:

- (default) componente `DashboardAwsPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-mainviewpresupuestocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-presupuesto-anual-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/presupuesto-anual/page.tsx`

**Página · ruta `/cloud-aws/presupuesto/presupuesto-anual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoAnualComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-presupuesto-presupuesto-mensual-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/presupuesto/presupuesto-mensual/page.tsx`

**Página · ruta `/cloud-aws/presupuesto/presupuesto-mensual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoMensualComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-quotas-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/quotas/page.tsx`

**Página · ruta `/cloud-aws/quotas`**

Exporta:

- (default) componente `DashboardAwsHeatmapQuotas` `()`

- Usa: [`MainViewHeatmapQuotasComponent.tsx`](components/aws/vista-heatmap-quotas.md#components-aws-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recomendaciones-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recomendaciones/page.tsx`

**Página (cliente) · ruta `/cloud-aws/recomendaciones`**

Exporta:

- (default) componente `DashboardAwsEventsPage` `()`

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`MainViewAdvisorComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-mainviewadvisorcomponent-tsx), [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)

Notas de implementación:

- Si tiene el permisos, renderiza la vista.

---

<a id="app-dashboards-nubes-cloud-aws-recomendaciones-rec-statuses-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recomendaciones/rec-statuses/page.tsx`

**Página (cliente) · ruta `/cloud-aws/recomendaciones/rec-statuses`**

Exporta:

- (default) componente `DashboardAwsRecStatusesPage` `()`

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`MainViewAiRecommendationStatusesComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx)

Notas de implementación:

- Si tiene el permisos, renderiza la vista.

---

<a id="app-dashboards-nubes-cloud-aws-recursos-autoscaling-groups-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/autoscaling-groups/page.tsx`

**Página · ruta `/cloud-aws/recursos/autoscaling-groups`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstanciasAutoscalingGroupsComponent.tsx`](components/aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-mainviewinstanciasautoscalinggroupscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-autoscaling-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/infrautilizadas/autoscaling/page.tsx`

**Página · ruta `/cloud-aws/recursos/infrautilizadas/autoscaling`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInfrautilizadasComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-mainviewinfrautilizadascomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-ec2-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/infrautilizadas/ec2/page.tsx`

**Página · ruta `/cloud-aws/recursos/infrautilizadas/ec2`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInfrautilizadasComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-mainviewinfrautilizadascomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-eks-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/infrautilizadas/eks/page.tsx`

**Página · ruta `/cloud-aws/recursos/infrautilizadas/eks`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInfrautilizadasEksComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-mainviewinfrautilizadasekscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-instancias-ec2-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/instancias-ec2/page.tsx`

**Página · ruta `/cloud-aws/recursos/instancias-ec2`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstancesEc2Component.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-mainviewinstancesec2component-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-instancias-rds-mariadb-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/instancias-rds-mariadb/page.tsx`

**Página · ruta `/cloud-aws/recursos/instancias-rds-mariadb`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstanciasRdsMariaDBComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mariadb-mainviewinstanciasrdsmariadbcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-instancias-rds-mysql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/instancias-rds-mysql/page.tsx`

**Página · ruta `/cloud-aws/recursos/instancias-rds-mysql`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstanciasRdsMySQLComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mysql-mainviewinstanciasrdsmysqlcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-instancias-rds-oracle-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/instancias-rds-oracle/page.tsx`

**Página · ruta `/cloud-aws/recursos/instancias-rds-oracle`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstanciasRdsOracleComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-oracle-mainviewinstanciasrdsoraclecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-instancias-rds-pg-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/instancias-rds-pg/page.tsx`

**Página · ruta `/cloud-aws/recursos/instancias-rds-pg`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstanciasRdsPgComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-pg-mainviewinstanciasrdspgcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-recursos-instancias-rds-sqlserver-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/recursos/instancias-rds-sqlserver/page.tsx`

**Página · ruta `/cloud-aws/recursos/instancias-rds-sqlserver`**

Exporta:

- (default) componente `DashboardInstanciasEc2` `()`

- Usa: [`MainViewInstanciasRdsSQLServerComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-sqlserver-mainviewinstanciasrdssqlservercomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-aws-tags-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-aws/tags/page.tsx`

**Página · ruta `/cloud-aws/tags`**

Exporta:

- (default) componente `DashboardAWSTaggedResources` `()`

- Usa: [`MainViewTaggedResourcesComponent.tsx`](components/aws/vista-tags.md#components-aws-vista-tags-mainviewtaggedresourcescomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-compromisos-saving-plans-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/compromisos/saving-plans/page.tsx`

**Página · ruta `/cloud-azure/compromisos/saving-plans`**

Exporta:

- (default) componente `DashboardAzureSavingPlan` `()`

- Usa: [`MainViewSavingsPlanComponent.tsx`](components/azure/vista-savings-plan.md#components-azure-vista-savings-plan-mainviewsavingsplancomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-consumos-apps-gateway-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/consumos/apps-gateway/page.tsx`

**Página · ruta `/cloud-azure/consumos/apps-gateway`**

Exporta:

- (default) componente `ConsumoVm` `()`

- Usa: [`MainViewConsumoAppGwComponent.tsx`](components/azure/vista-consumo-apps-gateway.md#components-azure-vista-consumo-apps-gateway-mainviewconsumoappgwcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-consumos-db-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/consumos/db/page.tsx`

**Página · ruta `/cloud-azure/consumos/db`**

Exporta:

- (default) componente `ConsumoDb` `()`

- Usa: [`MainViewConsumoDbComponent.tsx`](components/azure/vista-consumo-db.md#components-azure-vista-consumo-db-mainviewconsumodbcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-consumos-nodos-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/consumos/nodos/page.tsx`

**Página · ruta `/cloud-azure/consumos/nodos`**

Exporta:

- (default) componente `ConsumoNodos` `()`

- Usa: [`MainViewConsumoNodosComponent.tsx`](components/azure/vista-consumo-nodos.md#components-azure-vista-consumo-nodos-mainviewconsumonodoscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-consumos-vm-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/consumos/vm/page.tsx`

**Página · ruta `/cloud-azure/consumos/vm`**

Exporta:

- (default) componente `ConsumoVm` `()`

- Usa: [`MainViewConsumoVmComponent.tsx`](components/azure/vista-consumo-vm.md#components-azure-vista-consumo-vm-mainviewconsumovmcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-deployments-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/deployments/page.tsx`

**Página · ruta `/cloud-azure/deployments`**

Exporta:

- (default) componente `Deployments` `()`

- Usa: [`MainViewDeploymentsComponent.tsx`](components/azure/vista-deployments.md#components-azure-vista-deployments-mainviewdeploymentscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-facturacion-tendencia-pago-por-uso-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/facturacion/tendencia-pago-por-uso/page.tsx`

**Página · ruta `/cloud-azure/facturacion/tendencia-pago-por-uso`**

Exporta:

- (default) componente `TendenciaPagoPorUso` `()`

- Usa: [`MainViewTendenciaPagoPorUsoComponent.tsx`](components/azure/vista-facturacion.md#components-azure-vista-facturacion-tendencia-pago-por-uso-mainviewtendenciapagoporusocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-facturacion-top-dolares-facturados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/facturacion/top-dolares-facturados/page.tsx`

**Página · ruta `/cloud-azure/facturacion/top-dolares-facturados`**

Exporta:

- (default) componente `TopDolaresFacturados` `()`

- Usa: [`MainViewTopDolaresFacturadosComponent.tsx`](components/azure/vista-facturacion.md#components-azure-vista-facturacion-top-dolares-facturados-mainviewtopdolaresfacturadoscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-finops-metrics-ai-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/finops-metrics-ai/page.tsx`

**Página · ruta `/cloud-azure/finops-metrics-ai`**

Exporta:

- (default) componente `DashboardAzureFinopsMetrics` `()`

- Usa: [`MainViewAiFinopsMetricsComponent.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-analisis-vms-horario-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/analisis-vms-horario/page.tsx`

**Página · ruta `/cloud-azure/funciones/analisis-vms-horario`**

Exporta:

- (default) componente `AnalisisVMsHorario` `()`

- Usa: [`MainViewAnalisisVMsHorarioComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-mainviewanalisisvmshorariocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-apps-gateway-infrautilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/apps-gateway-infrautilizados/page.tsx`

**Página · ruta `/cloud-azure/funciones/apps-gateway-infrautilizados`**

Exporta:

- (default) componente `AppsGatewayUnused` `()`

- Usa: [`MainViewUnusedAppsGw.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-mainviewunusedappsgw-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-blob-vs-storage-general-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/blob-vs-storage-general/page.tsx`

**Página · ruta `/cloud-azure/funciones/blob-vs-storage-general`**

Exporta:

- (default) componente `DashboardBlobVsStorage` `()`

- Usa: [`MainViewBlobVsStorageComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-mainviewblobvsstoragecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-consumo-bds-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/consumo-bds-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-azure/funciones/consumo-bds-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioInstanciasDbs` `()`

- Usa: [`MainViewAzureDbWorkingNonWorkingHoursComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-mainviewazuredbworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-consumo-nodes-horario-habil-vs-no-habil-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/consumo-nodes-horario-habil-vs-no-habil/page.tsx`

**Página · ruta `/cloud-azure/funciones/consumo-nodes-horario-habil-vs-no-habil`**

Exporta:

- (default) componente `ConsumoHorarioNodos` `()`

- Usa: [`MainViewAzureNodosWorkingNonWorkingHoursComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-mainviewazurenodosworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-incremento-top-recursos-uso-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/incremento-top-recursos-uso/page.tsx`

**Página · ruta `/cloud-azure/funciones/incremento-top-recursos-uso`**

Exporta:

- (default) componente `IncrementoTopRecursosUso` `()`

- Usa: [`MainViewIncrementoTopRecursosUsoComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-incremento-top-recursos-uso-mainviewincrementotoprecursosusocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-loadbalancers-infrautilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/loadbalancers-infrautilizados/page.tsx`

**Página · ruta `/cloud-azure/funciones/loadbalancers-infrautilizados`**

Exporta:

- (default) componente `LoadbalancersUnused` `()`

- Usa: [`MainViewUnusedLoadbalancers.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-loadbalancers-mainviewunusedloadbalancers-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-promedio-por-localizacion-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/promedio-por-localizacion/page.tsx`

**Página · ruta `/cloud-azure/funciones/promedio-por-localizacion`**

Exporta:

- (default) componente `DashboardAverageByLocation` `()`

- Usa: [`MainViewAverageByLocationComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-mainviewaveragebylocationcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-spot-vs-regular-vm-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/spot-vs-regular-vm/page.tsx`

**Página · ruta `/cloud-azure/funciones/spot-vs-regular-vm`**

Exporta:

- (default) componente `DashboardSpotVsRegularVm` `()`

- Usa: [`MainViewSpotVsRegularVmComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-mainviewspotvsregularvmcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-top-10-recursos-uso-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/top-10-recursos-uso/page.tsx`

**Página · ruta `/cloud-azure/funciones/top-10-recursos-uso`**

Exporta:

- (default) componente `IncrementoTopRecursosUso` `()`

- Usa: [`MainViewTop10RecursosUsoComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-top-10-recursos-uso-mainviewtop10recursosusocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-traffic-managers-infrautilizados-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/traffic-managers-infrautilizados/page.tsx`

**Página · ruta `/cloud-azure/funciones/traffic-managers-infrautilizados`**

Exporta:

- (default) componente `TrafficManagerUnused` `()`

- Usa: [`MainViewUnusedTrafficManagerComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-mainviewunusedtrafficmanagercomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-unused-resources-extensions-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/unused-resources/extensions/page.tsx`

**Página · ruta `/cloud-azure/funciones/unused-resources/extensions`**

Exporta:

- (default) componente `DashboardUnusedVmExtensions` `()`

- Usa: [`MainViewUnusedVmExtensionsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-mainviewunusedvmextensionscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-unused-resources-vm-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/unused-resources/vm/page.tsx`

**Página · ruta `/cloud-azure/funciones/unused-resources/vm`**

Exporta:

- (default) componente `DashboardUnusedVm` `()`

- Usa: [`MainViewUnusedVmComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-mainviewunusedvmcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-unused-resources-vmss-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/unused-resources/vmss/page.tsx`

**Página · ruta `/cloud-azure/funciones/unused-resources/vmss`**

Exporta:

- (default) componente `DashboardUnusedVmss` `()`

- Usa: [`MainViewUnusedVmssComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-mainviewunusedvmsscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-funciones-variacion-storage-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/funciones/variacion-storage/page.tsx`

**Página · ruta `/cloud-azure/funciones/variacion-storage`**

Exporta:

- (default) componente `DashboardStorageVariation` `()`

- Usa: [`MainViewStorageVariationComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-mainviewstoragevariationcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-layout-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/layout.tsx`

**Layout (cliente) · ruta `/cloud-azure`**

Exporta:

- (default) componente `AzureLayout` `({ children }: AzureLayoutProps)`

Interfaz `AzureLayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

Notas de implementación:

- JSX — Contenido principal del Dashboard

---

<a id="app-dashboards-nubes-cloud-azure-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/page.tsx`

**Página · ruta `/cloud-azure`**

Exporta:

- (default) componente `DashboardAzurePage` `()`

- Usa: [`card.tsx`](components/ui.md#components-ui-card-tsx), [`button.tsx`](components/ui.md#components-ui-button-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`separator.tsx`](components/ui.md#components-ui-separator-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-presupuestoclientlayout-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/PresupuestoClientLayout.tsx`

**Archivo de ruta (cliente) · ruta `/cloud-azure/presupuesto`**

Exporta:

- componente `PresupuestoClientLayout` `({ children }: PresupuestoClientLayoutProps)`

Interfaz `PresupuestoClientLayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)
- Usado por: [`layout.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-layout-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-centro-de-costo-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/centro-de-costo/page.tsx`

**Página · ruta `/cloud-azure/presupuesto/centro-de-costo`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCentroDeCostoComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-costos-vs-presupuesto-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/costos-vs-presupuesto/page.tsx`

**Página · ruta `/cloud-azure/presupuesto/costos-vs-presupuesto`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCostoVsPresupuestoComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-layout-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/layout.tsx`

**Layout · ruta `/cloud-azure/presupuesto`**

Exporta:

- (default) componente `PresupuestoLayout` `({ children, }: Readonly<{ children: React.ReactNode; }>)` — Control por plan (canAccessPresupuesto). La barra lateral y el navbar ya los pone el layout de la nube.

- Usa: [`PresupuestoClientLayout.tsx`](#app-dashboards-nubes-cloud-azure-presupuesto-presupuestoclientlayout-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/page.tsx`

**Página · ruta `/cloud-azure/presupuesto`**

Exporta:

- (default) componente `DashboardAzureEventsPage` `()`

- Usa: [`MainViewPresupuestoComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-mainviewpresupuestocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-presupuesto-anual-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/presupuesto-anual/page.tsx`

**Página · ruta `/cloud-azure/presupuesto/presupuesto-anual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoAnualComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-presupuesto-presupuesto-mensual-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/presupuesto/presupuesto-mensual/page.tsx`

**Página · ruta `/cloud-azure/presupuesto/presupuesto-mensual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoMensualComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-quotas-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/quotas/page.tsx`

**Página · ruta `/cloud-azure/quotas`**

Exporta:

- (default) componente `DashboardAzureHeatmapQuotas` `()`

- Usa: [`MainViewHeatmapQuotasComponent.tsx`](components/azure/vista-heatmap-quotas.md#components-azure-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-recomendaciones-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recomendaciones/page.tsx`

**Página (cliente) · ruta `/cloud-azure/recomendaciones`**

Exporta:

- (default) componente `DashboardAzureEventsPage` `()`

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`MainViewAdvisorComponent.tsx`](components/azure/vista-advisor.md#components-azure-vista-advisor-mainviewadvisorcomponent-tsx), [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)

Notas de implementación:

- Si tiene el permisos, renderiza la vista.

---

<a id="app-dashboards-nubes-cloud-azure-recomendaciones-rec-statuses-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recomendaciones/rec-statuses/page.tsx`

**Página (cliente) · ruta `/cloud-azure/recomendaciones/rec-statuses`**

Exporta:

- (default) componente `DashboardAzureRecStatusesPage` `()`

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`MainViewAiRecommendationStatusesComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx)

Notas de implementación:

- Si tiene el permisos, renderiza la vista.

---

<a id="app-dashboards-nubes-cloud-azure-recursos-db-mysql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recursos/db-mysql/page.tsx`

**Página · ruta `/cloud-azure/recursos/db-mysql`**

Exporta:

- (default) componente `DashboardAzureRecursosMysql` `()`

- Usa: [`MainViewRecursosDbsComponent.tsx`](components/azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-mainviewrecursosdbscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-recursos-db-postgresql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recursos/db-postgresql/page.tsx`

**Página · ruta `/cloud-azure/recursos/db-postgresql`**

Exporta:

- (default) componente `DashboardAzureRecursosPostgresql` `()`

- Usa: [`MainViewRecursosDbsComponent.tsx`](components/azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-mainviewrecursosdbscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-recursos-nodos-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recursos/nodos/page.tsx`

**Página · ruta `/cloud-azure/recursos/nodos`**

Exporta:

- (default) componente `DashboardAzureRecursosNode` `()`

- Usa: [`MainViewRecursosNodeComponent.tsx`](components/azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-mainviewrecursosnodecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-recursos-top-recursos-general-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recursos/top-recursos-general/page.tsx`

**Página · ruta `/cloud-azure/recursos/top-recursos-general`**

Exporta:

- (default) componente `TopRecursosGeneral` `()`

- Usa: [`MainViewTopRecursosGeneralComponent.tsx`](components/azure/vista-recursos.md#components-azure-vista-recursos-top-recursos-general-mainviewtoprecursosgeneralcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-recursos-traffic-manager-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recursos/traffic-manager/page.tsx`

**Página · ruta `/cloud-azure/recursos/traffic-manager`**

Exporta:

- (default) componente `TrafficManagerPage` `()`

- Usa: [`MainViewRecursosTrafficManagerComponent.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-mainviewrecursostrafficmanagercomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-recursos-vm-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/recursos/vm/page.tsx`

**Página · ruta `/cloud-azure/recursos/vm`**

Exporta:

- (default) componente `DashboardAzureRecursosVm` `()`

- Usa: [`MainViewRecursosVmComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-mainviewrecursosvmcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-tables-azure-tablas-item-azure-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/tables-azure/tablas-item-azure/page.tsx`

**Página · ruta `/cloud-azure/tables-azure/tablas-item-azure`**

Exporta:

- (default) componente `TablasItemAzure` `()`

- Usa: [`MainViewTablasItemAzureComponent.tsx`](components/azure/tables-azure.md#components-azure-tables-azure-tablas-item-azure-mainviewtablasitemazurecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-azure-tags-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-azure/tags/page.tsx`

**Página · ruta `/cloud-azure/tags`**

Exporta:

- (default) componente `DashboardAzureTaggedResources` `()`

- Usa: [`MainViewTaggedResourcesComponent.tsx`](components/azure/vista-tags.md#components-azure-vista-tags-mainviewtaggedresourcescomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-compromisos-resource-based-cuds-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/compromisos/resource-based-cuds/page.tsx`

**Página · ruta `/cloud-gcp/compromisos/resource-based-cuds`**

Exporta:

- (default) componente `DashboardGcpSavingPlan` `()`

- Usa: [`MainViewSavingPlansComponent.tsx`](components/gcp/vista-cuds.md#components-gcp-vista-cuds-resource-based-cuds-mainviewsavingplanscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-compromisos-spend-based-cuds-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/compromisos/spend-based-cuds/page.tsx`

**Página · ruta `/cloud-gcp/compromisos/spend-based-cuds`**

Exporta:

- (default) componente `DashboardGcpSavingPlan` `()`

- Usa: [`MainViewSpendBasedCudsComponent.tsx`](components/gcp/vista-cuds.md#components-gcp-vista-cuds-spend-based-cuds-mainviewspendbasedcudscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-cloud-sql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/cloud-sql/page.tsx`

**Página · ruta `/cloud-gcp/consumos/cloud-sql`**

Exporta:

- (default) componente `CloudSQLConsumptionPage` `()`

- Usa: [`MainViewCloudSQLComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-cloud-sql-mainviewcloudsqlcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-clusters-gke-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/clusters-gke/page.tsx`

**Página · ruta `/cloud-gcp/consumos/clusters-gke`**

Exporta:

- (default) componente `DashboardGcpConsumeViewClustersGke` `()`

- Usa: [`MainViewClusterGkeConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-clusters-gke-mainviewclustergkeconsumecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-compute-engine-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/compute-engine/page.tsx`

**Página · ruta `/cloud-gcp/consumos/compute-engine`**

Exporta:

- (default) componente `DashboardGcpConsumeViewComputeEngine` `()`

- Usa: [`MainViewComputeEngineConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-compute-engine-mainviewcomputeengineconsumecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-dns-zonas-consumo-estado-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/dns/zonas-consumo-estado/page.tsx`

**Página · ruta `/cloud-gcp/consumos/dns/zonas-consumo-estado`**

Exporta:

- (default) componente `ZonasDNSPage` `()`

- Usa: [`MainViewZonasDNSComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-mainviewzonasdnscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-filestore-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/filestore/page.tsx`

**Página · ruta `/cloud-gcp/consumos/filestore`**

Exporta:

- (default) componente `DashboardGcpConsumeViewFilestore` `()`

- Usa: [`MainViewFilestoreConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-filestore-mainviewfilestoreconsumecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-instances-group-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/instances-group/page.tsx`

**Página · ruta `/cloud-gcp/consumos/instances-group`**

Exporta:

- (default) componente `DashboardGcpConsumeViewInstancesGroup` `()`

- Usa: [`MainViewInstanceGroupConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-instance-groups-mainviewinstancegroupconsumecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-consumos-load-balancers-consumo-uso-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/consumos/load-balancers/consumo-uso/page.tsx`

**Página · ruta `/cloud-gcp/consumos/load-balancers/consumo-uso`**

Exporta:

- (default) componente `LoadBalancersPage` `()`

- Usa: [`MainViewLoadBalancersComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-mainviewloadbalancerscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-facturacion-tendencia-facturacion-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/facturacion/tendencia-facturacion/page.tsx`

**Página · ruta `/cloud-gcp/facturacion/tendencia-facturacion`**

Exporta:

- (default) componente `DashboardTendenciaFacturacion` `()`

- Usa: [`MainViewTendenciaFacturacionComponent.tsx`](components/gcp/vista-facturacion.md#components-gcp-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-finops-metrics-ai-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/finops-metrics-ai/page.tsx`

**Página · ruta `/cloud-gcp/finops-metrics-ai`**

Exporta:

- (default) componente `DashboardGcpFinopsMetrics` `()`

- Usa: [`MainViewAiFinopsMetricsComponent.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-networking-ips-sin-uso-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/networking/ips-sin-uso/page.tsx`

**Página · ruta `/cloud-gcp/funciones/networking/ips-sin-uso`**

Exporta:

- (default) componente `IPsSinUsoPage` `()`

- Usa: [`MainViewIPsSinUsoComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-networking-ips-sin-uso-mainviewipssinusocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-networking-subnets-sin-recursos-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/networking/subnets-sin-recursos/page.tsx`

**Página · ruta `/cloud-gcp/funciones/networking/subnets-sin-recursos`**

Exporta:

- (default) componente `SubnetsSinRecursosPage` `()`

- Usa: [`MainViewSubnetsSinRecursosComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-networking-subnets-sin-recursos-mainviewsubnetssinrecursoscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-spot-vs-standard-vm-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/spot-vs-standard-vm/page.tsx`

**Página · ruta `/cloud-gcp/funciones/spot-vs-standard-vm`**

Exporta:

- (default) componente `SpotVsStandardPage` `()`

- Usa: [`MainViewSpotVsStandardComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-spot-vs-standard-mainviewspotvsstandardcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-top-cloud-storage-buckets-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/top-cloud-storage-buckets/page.tsx`

**Página · ruta `/cloud-gcp/funciones/top-cloud-storage-buckets`**

Exporta:

- (default) componente `TopStorageBucketsPage` `()`

- Usa: [`MainViewTopStorageBucketsComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-storage-buckets-mainviewtopstoragebucketscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-top-facturacion-region-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/top-facturacion-region/page.tsx`

**Página · ruta `/cloud-gcp/funciones/top-facturacion-region`**

Exporta:

- (default) componente `DashboardGCPTopFacturacionRegion` `()`

- Usa: [`TopFacturacionPorRegionComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-facturacion-region-topfacturacionporregioncomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-top-filestore-sub-utilizado-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/top-filestore-sub-utilizado/page.tsx`

**Página · ruta `/cloud-gcp/funciones/top-filestore-sub-utilizado`**

Exporta:

- (default) componente `TopFilestoreSubUtilizadoPage` `()`

- Usa: [`MainViewTopFilestoreSubUtilizadoComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-filestore-sub-utilizado-mainviewtopfilestoresubutilizadocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-unused-resources-clusters-gke-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/unused-resources/clusters-gke/page.tsx`

**Página · ruta `/cloud-gcp/funciones/unused-resources/clusters-gke`**

Exporta:

- (default) componente `DashboardGcpUnusedClustersGke` `()`

- Usa: [`MainViewUnusedGkeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-clusters-gke-mainviewunusedgkecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-unused-resources-compute-engine-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/unused-resources/compute-engine/page.tsx`

**Página · ruta `/cloud-gcp/funciones/unused-resources/compute-engine`**

Exporta:

- (default) componente `DashboardGcpUnusedComputeEngine` `()`

- Usa: [`MainViewUnusedCeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-mainviewunusedcecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-unused-resources-filestore-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/unused-resources/filestore/page.tsx`

**Página · ruta `/cloud-gcp/funciones/unused-resources/filestore`**

Exporta:

- (default) componente `FilestoreSinUsoPage` `()`

- Usa: [`MainViewFilestoreSinUsoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-filestore-mainviewfilestoresinusocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-unused-resources-instance-groups-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/unused-resources/instance-groups/page.tsx`

**Página · ruta `/cloud-gcp/funciones/unused-resources/instance-groups`**

Exporta:

- (default) componente `DashboardGcpUnusedInstanceGroups` `()`

- Usa: [`MainViewUnusedIgComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-instance-groups-mainviewunusedigcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-unused-resources-persistent-disks-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/unused-resources/persistent-disks/page.tsx`

**Página · ruta `/cloud-gcp/funciones/unused-resources/persistent-disks`**

Exporta:

- (default) componente `PersistentDisksPage` `()`

- Usa: [`MainViewDiscosPersistentesComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-discos-persistentes-mainviewdiscospersistentescomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-costo-por-localizacion-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-costo-por-localizacion/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-costo-por-localizacion`**

Exporta:

- (default) componente `UsoCostoPorLocalizacionPage` `()`

- Usa: [`MainViewUsedCostLocationComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-uso-costo-por-localizacion-mainviewusedcostlocationcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-mysql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/mysql`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingCloudsqlMysqlPage` `()`

- Usa: [`MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-postgresql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/postgresql`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingCloudsqlPostgresPage` `()`

- Usa: [`MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-sqlserver-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/cloud-sql/sqlserver`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingCloudsqlSqlServerPage` `()`

- Usa: [`MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cluster-gke-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/cluster-gke/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/cluster-gke`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingClustersGkeConsumePage` `()`

- Usa: [`MainViewGkeWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-mainviewgkeworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-compute-engines-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/compute-engines/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/compute-engines`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingComputeEnginesConsumePage` `()`

- Usa: [`MainViewCeWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-mainviewceworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-filestore-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/filestore/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/filestore`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingFilestoreConsumePage` `()`

- Usa: [`MainViewFilestoreWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-mainviewfilestoreworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-instance-group-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/funciones/uso-horario-habil-no-habil/instance-group/page.tsx`

**Página · ruta `/cloud-gcp/funciones/uso-horario-habil-no-habil/instance-group`**

Exporta:

- (default) componente `DashboardGcpWorkingNonWorkingInstancesGroupConsumePage` `()`

- Usa: [`MainViewIgWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-mainviewigworkingnonworkinghourscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-layout-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/layout.tsx`

**Layout (cliente) · ruta `/cloud-gcp`**

Exporta:

- (default) componente `GCPLayout` `({ children }: LayoutProps)`

Interfaz `LayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`PlanAccessGate.tsx`](components/shared.md#components-shared-planaccessgate-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/page.tsx`

**Página · ruta `/cloud-gcp`**

Nuevo icono para GKE/contenedores

Exporta:

- (default) componente `DashboardGCPPage` `()`

- Usa: [`card.tsx`](components/ui.md#components-ui-card-tsx), [`button.tsx`](components/ui.md#components-ui-button-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`separator.tsx`](components/ui.md#components-ui-separator-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-presupuestoclientlayout-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/PresupuestoClientLayout.tsx`

**Archivo de ruta (cliente) · ruta `/cloud-gcp/presupuesto`**

Exporta:

- componente `PresupuestoClientLayout` `({ children }: PresupuestoClientLayoutProps)`

Interfaz `PresupuestoClientLayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)
- Usado por: [`layout.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-layout-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-centro-de-costo-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/centro-de-costo/page.tsx`

**Página · ruta `/cloud-gcp/presupuesto/centro-de-costo`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCentroDeCostoComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-costos-vs-presupuesto-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/costos-vs-presupuesto/page.tsx`

**Página · ruta `/cloud-gcp/presupuesto/costos-vs-presupuesto`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCostoVsPresupuestoComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-layout-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/layout.tsx`

**Layout · ruta `/cloud-gcp/presupuesto`**

Exporta:

- (default) componente `PresupuestoLayout` `({ children, }: Readonly<{ children: React.ReactNode; }>)` — Control por plan (canAccessPresupuesto). La barra lateral y el navbar ya los pone el layout de la nube.

- Usa: [`PresupuestoClientLayout.tsx`](#app-dashboards-nubes-cloud-gcp-presupuesto-presupuestoclientlayout-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/page.tsx`

**Página · ruta `/cloud-gcp/presupuesto`**

Exporta:

- (default) componente `DashboardAwsEventsPage` `()`

- Usa: [`MainViewPresupuestoComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-mainviewpresupuestocomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-presupuesto-anual-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/presupuesto-anual/page.tsx`

**Página · ruta `/cloud-gcp/presupuesto/presupuesto-anual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoAnualComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-presupuesto-presupuesto-mensual-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/presupuesto/presupuesto-mensual/page.tsx`

**Página · ruta `/cloud-gcp/presupuesto/presupuesto-mensual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoMensualComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-quotas-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/quotas/page.tsx`

**Página · ruta `/cloud-gcp/quotas`**

Exporta:

- (default) componente `DashboardGcpHeatmapQuotas` `()`

- Usa: [`MainViewHeatmapQuotasComponent.tsx`](components/gcp/vista-heatmap-quotas.md#components-gcp-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-recomendaciones-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recomendaciones/page.tsx`

**Página (cliente) · ruta `/cloud-gcp/recomendaciones`**

Exporta:

- (default) componente `DashboardGcpRecommender` `()`

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`MainViewRecommenderComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-mainviewrecommendercomponent-tsx), [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)

---

<a id="app-dashboards-nubes-cloud-gcp-recomendaciones-rec-statuses-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recomendaciones/rec-statuses/page.tsx`

**Página (cliente) · ruta `/cloud-gcp/recomendaciones/rec-statuses`**

Exporta:

- (default) componente `DashboardGcpRecStatusesPage` `()`

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`MainViewAiRecommendationStatusesComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx)

Notas de implementación:

- Si tiene el permisos, renderiza la vista.

---

<a id="app-dashboards-nubes-cloud-gcp-recursos-cloudsql-mysql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recursos/cloudsql/mysql/page.tsx`

**Página · ruta `/cloud-gcp/recursos/cloudsql/mysql`**

Exporta:

- (default) componente `DashboardGcpResourceViewCloudsqlMysql` `()`

- Usa: [`MainViewCloudSqlComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-recursos-cloudsql-postgresql-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recursos/cloudsql/postgresql/page.tsx`

**Página · ruta `/cloud-gcp/recursos/cloudsql/postgresql`**

Exporta:

- (default) componente `DashboardGcpResourceViewCloudsqlPostgres` `()`

- Usa: [`MainViewCloudSqlComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-recursos-cloudsql-sqlserver-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recursos/cloudsql/sqlserver/page.tsx`

**Página · ruta `/cloud-gcp/recursos/cloudsql/sqlserver`**

Exporta:

- (default) componente `DashboardGcpResourceViewCloudsqlSqlServer` `()`

- Usa: [`MainViewCloudSqlComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-recursos-clusters-gke-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recursos/clusters-gke/page.tsx`

**Página · ruta `/cloud-gcp/recursos/clusters-gke`**

Exporta:

- (default) componente `DashboardGcpResourceViewClustersGke` `()`

- Usa: [`MainViewGkeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-mainviewgkecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-recursos-compute-engine-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recursos/compute-engine/page.tsx`

**Página · ruta `/cloud-gcp/recursos/compute-engine`**

Exporta:

- (default) componente `DashboardGcpResourceViewComputeEngine` `()`

- Usa: [`MainViewComputeEngineComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-mainviewcomputeenginecomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-recursos-instance-groups-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/recursos/instance-groups/page.tsx`

**Página · ruta `/cloud-gcp/recursos/instance-groups`**

Exporta:

- (default) componente `DashboardGcpResourceViewInstanceGroups` `()`

- Usa: [`MainViewInstanceGroupsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-mainviewinstancegroupscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-reservas-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/reservas/page.tsx`

**Página · ruta `/cloud-gcp/reservas`**

Exporta:

- (default) componente `DashboardGcpReservations` `()`

- Usa: [`MainViewReservationsComponent.tsx`](components/gcp/vista-reservas.md#components-gcp-vista-reservas-mainviewreservationscomponent-tsx)

---

<a id="app-dashboards-nubes-cloud-gcp-tags-page-tsx"></a>
## `app/(dashboards-nubes)/cloud-gcp/tags/page.tsx`

**Página · ruta `/cloud-gcp/tags`**

Exporta:

- (default) componente `DashboardGcpTaggedResources` `()`

- Usa: [`MainViewTaggedResourcesComponent.tsx`](components/gcp/vista-tags.md#components-gcp-vista-tags-mainviewtaggedresourcescomponent-tsx)

---

<a id="app-dashboards-nubes-layout-tsx"></a>
## `app/(dashboards-nubes)/layout.tsx`

**Layout · ruta `/`**

Exporta:

- (default) componente `DashboardNubesLayout` `async ({ children, }: Readonly<{ children: React.ReactNode; }>)`

- Usa: [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx), [`sonner.tsx`](components/ui.md#components-ui-sonner-tsx), [`SidebarDashboardNubes.tsx`](components/generales.md#components-sidebardashboardnubes-tsx), [`Navbar.tsx`](components/generales.md#components-navbar-tsx), [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts)

---

<a id="app-presupuesto-presupuesto-presupuestoclientlayout-tsx"></a>
## `app/(presupuesto)/presupuesto/PresupuestoClientLayout.tsx`

**Archivo de ruta (cliente) · ruta `/presupuesto`**

Exporta:

- componente `PresupuestoClientLayout` `({ children }: PresupuestoClientLayoutProps)`

Interfaz `PresupuestoClientLayoutProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | no | — |

Internos:

- componente `AccessDeniedComponent` `({ planName }: { planName: string })`

- Hooks: `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts)
- Usado por: [`layout.tsx`](#app-presupuesto-presupuesto-layout-tsx)

---

<a id="app-presupuesto-presupuesto-centro-de-costo-page-tsx"></a>
## `app/(presupuesto)/presupuesto/centro-de-costo/page.tsx`

**Página · ruta `/presupuesto/centro-de-costo`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCentroDeCostoComponent.tsx`](components/presupuesto.md#components-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx)

---

<a id="app-presupuesto-presupuesto-costos-vs-presupuesto-page-tsx"></a>
## `app/(presupuesto)/presupuesto/costos-vs-presupuesto/page.tsx`

**Página · ruta `/presupuesto/costos-vs-presupuesto`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewCostoVsPresupuestoComponent.tsx`](components/presupuesto.md#components-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)

---

<a id="app-presupuesto-presupuesto-layout-tsx"></a>
## `app/(presupuesto)/presupuesto/layout.tsx`

**Layout · ruta `/presupuesto`**

Exporta:

- (default) componente `ProfileLayout` `async ({ children, }: Readonly<{ children: React.ReactNode; }>)`

- Usa: [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx), [`Navbar.tsx`](components/generales.md#components-navbar-tsx), [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts), [`SidebarProfile.tsx`](components/profile.md#components-profile-sidebarprofile-tsx), [`PresupuestoClientLayout.tsx`](#app-presupuesto-presupuesto-presupuestoclientlayout-tsx)

---

<a id="app-presupuesto-presupuesto-page-tsx"></a>
## `app/(presupuesto)/presupuesto/page.tsx`

**Página · ruta `/presupuesto`**

Exporta:

- (default) componente `DashboardAwsEventsPage` `()`

- Usa: [`MainViewPresupuestoComponent.tsx`](components/presupuesto.md#components-presupuesto-mainviewpresupuestocomponent-tsx)

---

<a id="app-presupuesto-presupuesto-presupuesto-anual-page-tsx"></a>
## `app/(presupuesto)/presupuesto/presupuesto-anual/page.tsx`

**Página · ruta `/presupuesto/presupuesto-anual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoAnualComponent.tsx`](components/presupuesto.md#components-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)

---

<a id="app-presupuesto-presupuesto-presupuesto-mensual-page-tsx"></a>
## `app/(presupuesto)/presupuesto/presupuesto-mensual/page.tsx`

**Página · ruta `/presupuesto/presupuesto-mensual`**

Exporta:

- (default) componente `DashboardPresupuestoPage` `()`

- Usa: [`MainViewPresupuestoMensualComponent.tsx`](components/presupuesto.md#components-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-internube-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/internube/page.tsx`

**Página · ruta `/comparacion-nubes/internube`**

Exporta:

- (default) componente `ComparissonInterCloudPage` `()`

- Usa: [`InterCloudSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-intranube-computo-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/intranube/computo/page.tsx`

**Página · ruta `/comparacion-nubes/intranube/computo`**

Exporta:

- (default) componente `ComparisonIntraCloudComputePage` `()`

- Usa: [`IntraCloudComputeComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-intranube-facturacion-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/intranube/facturacion/page.tsx`

**Página · ruta `/comparacion-nubes/intranube/facturacion`**

Exporta:

- (default) componente `ComparisonIntraCloudBillingPage` `()`

- Usa: [`MainViewIntraCloudBillingComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-intranube-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/intranube/page.tsx`

**Página · ruta `/comparacion-nubes/intranube`**

Exporta:

- (default) componente `ComparissonIntraCloudPage` `()`

- Usa: [`IntraCloudSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-intranube-storage-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/intranube/storage/page.tsx`

**Página · ruta `/comparacion-nubes/intranube/storage`**

Exporta:

- (default) componente `ComparisonIntraCloudStoragePage` `()`

- Usa: [`IntraCloudStorageComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-multinube-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/multinube/page.tsx`

**Página · ruta `/comparacion-nubes/multinube`**

Exporta:

- (default) componente `ComparissonMultiCloudPage` `()`

- Usa: [`MainViewMultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx)

---

<a id="app-profile-comparacion-comparacion-nubes-page-tsx"></a>
## `app/(profile)/(comparacion)/comparacion-nubes/page.tsx`

**Página (cliente) · ruta `/comparacion-nubes`**

Exporta:

- (default) componente `ComparissionIndexPage` `()`

Internos:

- constante `ACTIONS`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`utils.ts`](lib.md#lib-utils-ts)

---

<a id="app-profile-perfilamiento-perfilamiento-licencias-crear-page-tsx"></a>
## `app/(profile)/(perfilamiento)/perfilamiento/licencias/crear/page.tsx`

**Página (cliente) · ruta `/perfilamiento/licencias/crear`**

Exporta:

- (default) componente `CrearLicenciaPage` `()`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`LicenseCreationForm.tsx`](components/perfilamiento.md#components-perfilamiento-licensecreationform-tsx)

Notas de implementación:

- CONTROL DE ACCESO ESTRICTO: Solo Admin Global

---

<a id="app-profile-perfilamiento-perfilamiento-licencias-page-tsx"></a>
## `app/(profile)/(perfilamiento)/perfilamiento/licencias/page.tsx`

**Página (cliente) · ruta `/perfilamiento/licencias`**

Exporta:

- (default) componente `ListadoLicenciasPage` `()`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`LicenseTable.tsx`](components/perfilamiento.md#components-perfilamiento-licensetable-tsx)

Notas de implementación:

- 1. CONTROL DE ACCESO ESTRICTO: Solo Admin Global
- JSX — CORRECCIÓN: Link moderno sin <a> ni props legacyBehavior/passHref
- JSX — 2. TABLA DE LICENCIAS

---

<a id="app-profile-perfilamiento-perfilamiento-page-tsx"></a>
## `app/(profile)/(perfilamiento)/perfilamiento/page.tsx`

**Página (cliente) · ruta `/perfilamiento`**

Exporta:

- (default) componente `PerfilamientoIndexPage` `()`

Internos:

- constante `ACTIONS`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`utils.ts`](lib.md#lib-utils-ts)

---

<a id="app-profile-perfilamiento-perfilamiento-usuarios-crear-page-tsx"></a>
## `app/(profile)/(perfilamiento)/perfilamiento/usuarios/crear/page.tsx`

**Página (cliente) · ruta `/perfilamiento/usuarios/crear`**

Exporta:

- (default) componente `CrearUsuarioPage` `()`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`CreateUserForm.tsx`](components/perfilamiento.md#components-perfilamiento-createuserform-tsx)

Notas de implementación:

- CONTROL DE ACCESO: Admin Global o Admin Empresa

---

<a id="app-profile-perfilamiento-perfilamiento-usuarios-page-tsx"></a>
## `app/(profile)/(perfilamiento)/perfilamiento/usuarios/page.tsx`

**Página (cliente) · ruta `/perfilamiento/usuarios`**

Exporta:

- (default) componente `ListadoUsuariosPage` `()`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`UserTable.tsx`](components/perfilamiento.md#components-perfilamiento-usertable-tsx)

Notas de implementación:

- CONTROL DE ACCESO: Admin Global o Admin Empresa

---

<a id="app-profile-layout-tsx"></a>
## `app/(profile)/layout.tsx`

**Layout · ruta `/`**

Exporta:

- (default) componente `ProfileLayout` `async ({ children, }: Readonly<{ children: React.ReactNode; }>)`

- Usa: [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx), [`Navbar.tsx`](components/generales.md#components-navbar-tsx), [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts), [`SidebarProfile.tsx`](components/profile.md#components-profile-sidebarprofile-tsx)

---

<a id="app-profile-op-licencias-estado-page-tsx"></a>
## `app/(profile)/op-licencias/estado/page.tsx`

**Página (cliente) · ruta `/op-licencias/estado`**

Exporta:

- (default) componente `EstadoPage` `()` — ── Página principal ──────────────────────────────────────────────────────────

Interfaz `ComputeUnit` — ── Tipos ─────────────────────────────────────────────────────────────────────:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |
| `db` | `string` | no | — |
| `cliente` | `string` | no | — |
| `alias` | `string` | no | — |
| `type` | `string` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string \| null` | no | — |
| `estado` | `'activa' \| 'por_vencer' \| 'vencida' \| 'perpetua'` | no | — |

Interfaz `PartnerEstado`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `partner` | `string` | no | — |
| `rut` | `string` | no | — |
| `generado_at` | `string \| null` | no | — |
| `generado_por` | `string \| null` | no | — |
| `sin_licencia` | `boolean` | no | — |
| `solicitud_id` | `string` | sí | — |
| `compute_units` | `ComputeUnit[]` | no | — |
| `resumen` | `{ total: number; activas: number; por_vencer: number; vencidas: numbe…` | sí | — |

Internos:

- componente `CloudBadge` `({ cloud }: { cloud: string })` — ── Helpers ───────────────────────────────────────────────────────────────────
- componente `UCEstadoBadge` `({ estado }: { estado: string })`
- función `diasLabel` `(expires: string | null, estado: string): string`
- componente `PartnerCard` `({ partner }: { partner: PartnerEstado })` — ── Card de partner ───────────────────────────────────────────────────────────

- API: `/api/op-licencias/estado`
- Hooks: `useSession`
- Usa: [`fetcher.ts`](lib.md#lib-fetcher-ts), [`useSession.ts`](hooks.md#hooks-usesession-ts), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`utils.ts`](lib.md#lib-utils-ts)

Notas de implementación:

- _PartnerCard_: JSX — Header — siempre visible, clickeable
- _PartnerCard_: JSX — Resumen o sin licencia
- _PartnerCard_: JSX — Detalle expandido
- _PartnerCard_: JSX — Metadata
- _PartnerCard_: JSX — Sin licencia
- _PartnerCard_: JSX — Headers de columna
- _PartnerCard_: JSX — UCs
- ── KPIs globales — totales de UCs ────────────────────────────────────────
- ── Filtrar ───────────────────────────────────────────────────────────────
- JSX — Header
- JSX — KPIs
- JSX — Filtros
- JSX — Cards de partners

---

<a id="app-profile-op-licencias-generar-page-tsx"></a>
## `app/(profile)/op-licencias/generar/page.tsx`

**Página (cliente) · ruta `/op-licencias/generar`**

Exporta:

- (default) componente `GenerarPage` `()`

Interfaz `SolicitudUsuario`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `email` | `string` | no | — |
| `empresa` | `string` | no | — |
| `estado` | `string` | no | — |
| `starts` | `string` | sí | — |
| `expires` | `string` | sí | — |
| `diasRestantes` | `number \| null` | sí | — |

Interfaz `Solicitud`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `partner` | `string` | no | — |
| `solicitante` | `string` | no | — |
| `fecha_solicitud` | `string` | no | — |
| `estado` | `string` | no | — |
| `usuarios` | `SolicitudUsuario[]` | no | — |
| `createdAt` | `string` | no | — |

Interfaz `PartnerGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `partner` | `string` | no | — |
| `solicitudes` | `Solicitud[]` | no | — |
| `usuariosConsolidados` | `SolicitudUsuario[]` | no | — |
| `vigentesAuto` | `SolicitudUsuario[]` | no | — |

Internos:

- componente `GenerarContent` `()`

- API: `/api/op-licencias/generar`, `/api/op-licencias/solicitudes`, `/api/op-licencias/solicitudes/{…}`
- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`card.tsx`](components/ui.md#components-ui-card-tsx)

Notas de implementación:

- _GenerarContent_: Agrupar por partner
- _GenerarContent_: Evitar duplicados en vigentes auto
- _GenerarContent_: Preseleccionar usuarios no vigentes
- _GenerarContent_: JSX — Header
- _GenerarContent_: JSX — Licencia generada
- _GenerarContent_: JSX — Sin solicitudes
- _GenerarContent_: JSX — Un card por partner
- _GenerarContent_: JSX — Tags de solicitudes incluidas
- _GenerarContent_: JSX — Usuarios nuevos/por vencer/vencidos — con checkbox
- _GenerarContent_: JSX — Vigentes automáticos

---

<a id="app-profile-op-licencias-historial-page-tsx"></a>
## `app/(profile)/op-licencias/historial/page.tsx`

**Página (cliente) · ruta `/op-licencias/historial`**

Exporta:

- (default) componente `HistorialPage` `()` — ── Página ────────────────────────────────────────────────────────────────────

Interfaz `ComputeUnit` — ── Tipos actualizados al modelo v2 (compute_units) ──────────────────────────:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `'aws' \| 'azure' \| 'gcp'` | no | — |
| `db` | `string` | no | — |
| `rut` | `string` | no | — |
| `cliente` | `string` | no | — |
| `alias` | `string` | no | — |
| `type` | `'subscription' \| 'perpetual'` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string \| null` | no | — |

Interfaz `LicenciaHistorial`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `partner` | `string` | no | — |
| `rut` | `string` | no | — |
| `solicitante` | `string` | no | — |
| `generado_por` | `string` | no | — |
| `generado_at` | `string` | no | — |
| `compute_units` | `ComputeUnit[]` | no | — |
| `lic_hash` | `string` | no | — |
| `lic_content` | `string` | no | — |
| `version` | `string` | no | — |

Internos:

- función `cloudLabel` `(cloud: string)` — ── Helpers ───────────────────────────────────────────────────────────────────
- función `formatFecha` `(fecha: string | null)`

- API: `/api/op-licencias/historial`
- Hooks: `useSession`
- Usa: [`fetcher.ts`](lib.md#lib-fetcher-ts), [`useSession.ts`](hooks.md#hooks-usesession-ts), [`card.tsx`](components/ui.md#components-ui-card-tsx), [`data-table-single.tsx`](components/data-table.md#components-data-table-data-table-single-tsx), [`columns.tsx`](components/data-table.md#components-data-table-columns-tsx)

Notas de implementación:

- JSX — Header
- JSX — Empty state
- JSX — Cards por licencia

---

<a id="app-profile-op-licencias-importar-page-tsx"></a>
## `app/(profile)/op-licencias/importar/page.tsx`

**Página (cliente) · ruta `/op-licencias/importar`**

Exporta:

- (default) componente `ImportarPage` `()` — ── Página ────────────────────────────────────────────────────────────────────

Interfaz `ComputeUnit` — ── Tipos ─────────────────────────────────────────────────────────────────────:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `'aws' \| 'azure' \| 'gcp'` | no | — |
| `db` | `string` | no | — |
| `rut` | `string` | no | — |
| `cliente` | `string` | no | — |
| `alias` | `string` | no | — |
| `type` | `'subscription' \| 'perpetual'` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string \| null` | no | — |

Interfaz `SolicitudMeta`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `partner` | `string` | no | — |
| `rut` | `string` | no | — |
| `solicitante` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `fecha_solicitud` | `string` | no | — |

Internos:

- función `cloudBadge` `(cloud: string)` — ── Helpers ───────────────────────────────────────────────────────────────────
- función `typeBadge` `(type: string)`
- función `formatFecha` `(fecha: string | null)`

- API: `/api/op-licencias/solicitudes`
- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`card.tsx`](components/ui.md#components-ui-card-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`data-table-single.tsx`](components/data-table.md#components-data-table-data-table-single-tsx), [`columns.tsx`](components/data-table.md#components-data-table-columns-tsx)

Notas de implementación:

- ── KPIs ──────────────────────────────────────────────────────────────────
- ── Parsear JSON ──────────────────────────────────────────────────────────
- Validar estructura mínima
- ── Guardar solicitud ─────────────────────────────────────────────────────
- ── Columnas tabla UCs ────────────────────────────────────────────────────
- JSX — Header
- JSX — Zona drag & drop
- JSX — Error
- JSX — Resultado
- JSX — Metadata
- JSX — KPIs
- JSX — Tabla de UCs
- JSX — Botones

---

<a id="app-profile-op-licencias-page-tsx"></a>
## `app/(profile)/op-licencias/page.tsx`

**Página (cliente) · ruta `/op-licencias`**

Exporta:

- (default) componente `OpLicenciasPage` `()`

Internos:

- constante `ACTIONS`

- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`utils.ts`](lib.md#lib-utils-ts)

---

<a id="app-profile-op-licencias-partner-page-tsx"></a>
## `app/(profile)/op-licencias/partner/page.tsx`

**Página (cliente) · ruta `/op-licencias/partner`**

Exporta:

- (default) componente `PartnerPage` `()` — ── Página ────────────────────────────────────────────────────────────────────

Interfaz `ComputeUnit` — ── Tipos ─────────────────────────────────────────────────────────────────────:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `'aws' \| 'azure' \| 'gcp'` | no | — |
| `db` | `string` | no | — |
| `rut` | `string` | no | — |
| `cliente` | `string` | no | — |
| `alias` | `string` | no | — |
| `type` | `'subscription' \| 'perpetual'` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string \| null` | no | — |
| `uc_fp` | `string` | sí | — |

Interfaz `SolicitudPendiente`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `fecha_solicitud` | `string` | no | — |
| `solicitante` | `string` | no | — |
| `compute_units` | `ComputeUnit[]` | no | — |

Interfaz `PartnerData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `partner` | `string` | no | — |
| `rut` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `ultima_licencia_id` | `string` | no | — |
| `ultima_licencia_at` | `string` | no | — |
| `generado_por` | `string` | no | — |
| `compute_units` | `ComputeUnit[]` | no | — |
| `solicitudes_pendientes` | `SolicitudPendiente[]` | no | — |

Internos:

- función `ucEstado` `(uc: ComputeUnit): { label: string; variant: string; dias?: number }` — ── Helpers ───────────────────────────────────────────────────────────────────
- componente `EstadoBadge` `({ uc }: { uc: ComputeUnit })`
- componente `CloudBadge` `({ cloud }: { cloud: string })`
- función `ucVacia` `(): Omit<ComputeUnit, 'uc_fp'>` — ── Formulario nueva UC ───────────────────────────────────────────────────────

- API: `/api/empresas-sii`, `/api/op-licencias/generar`, `/api/op-licencias/partner`
- Hooks: `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts), [`card.tsx`](components/ui.md#components-ui-card-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx)

Notas de implementación:

- `const [solicitudesUsadas, setSolicitudesUsadas] = useState<…` — IDs de solicitudes agregadas
- ── SII autocomplete ────────────────────────────────────────────────────────
- ── fin SII ──────────────────────────────────────────────────────────────────
- ── Buscar partner ──────────────────────────────────────────────────────────
- ── Agregar UC al formulario ────────────────────────────────────────────────
- ── Agregar UCs de una solicitud pendiente ──────────────────────────────────
- Trackear el ID de la solicitud para marcarla como procesada al generar
- ── Generar nuevo .lic ──────────────────────────────────────────────────────
- UCs acumulativas: las existentes vigentes + las nuevas
- `solicitudes_ids: solicitudesUsadas,` — marcar solicitudes como procesadas
- JSX — Header
- JSX — Buscador
- JSX — Resultado
- JSX — Info del partner
- JSX — Solicitudes pendientes
- JSX — Agregar UC manual
- JSX — UCs nuevas agregadas
- JSX — Licencias generadas
- JSX — Botón generar

---

<a id="app-profile-op-licencias-solicitudes-page-tsx"></a>
## `app/(profile)/op-licencias/solicitudes/page.tsx`

**Página (cliente) · ruta `/op-licencias/solicitudes`**

Exporta:

- (default) componente `SolicitudesPage` `()`

Interfaz `CSVUser`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `email` | `string` | no | — |
| `empresa` | `string` | no | — |
| `fecha_solicitud` | `string` | no | — |

Interfaz `EmpresaGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `nombre` | `string` | no | — |
| `nuevos` | `CSVUser[]` | no | — |
| `existentes` | `CSVUser[]` | no | — |

Internos:

- componente `SolicitudesContent` `()`

- Hooks: `useSearchParams`, `useSession`
- Usa: [`useSession.ts`](hooks.md#hooks-usesession-ts)

Notas de implementación:

- _SolicitudesContent_: Cargar datos del sessionStorage — el CSV parseado en la página anterior
- _SolicitudesContent_: Agrupar por empresa
- _SolicitudesContent_: Por ahora todos son nuevos hasta que tengamos la API
- _SolicitudesContent_: JSX — Header
- _SolicitudesContent_: JSX — Header empresa
- _SolicitudesContent_: JSX — Detalle expandido
- _SolicitudesContent_: JSX — Usuarios existentes
- _SolicitudesContent_: JSX — Usuarios nuevos
- _SolicitudesContent_: JSX — Botón continuar

---

<a id="app-profile-perfil-conectores-page-tsx"></a>
## `app/(profile)/perfil/conectores/page.tsx`

**Página · ruta `/perfil/conectores`**

Exporta:

- (default) componente `ProfileConnectorsPage` `()`

- Usa: [`ConnectorsManagerComponent.tsx`](components/profile.md#components-profile-connectorsmanagercomponent-tsx)

---

<a id="app-profile-perfil-nubes-page-tsx"></a>
## `app/(profile)/perfil/nubes/page.tsx`

**Página · ruta `/perfil/nubes`**

Exporta:

- (default) componente `ProfileCloudsPage` `()`

- Usa: [`SelectCloudComponent.tsx`](components/profile.md#components-profile-selectcloudcomponent-tsx)

---

<a id="app-profile-perfil-page-tsx"></a>
## `app/(profile)/perfil/page.tsx`

**Página · ruta `/perfil`**

Exporta:

- (default) componente `ProfilePage` `()`

- Usa: [`MainProfileComponent.tsx`](components/profile.md#components-profile-mainprofilecomponent-tsx)

---

<a id="app-profile-perfil-servicios-ia-page-tsx"></a>
## `app/(profile)/perfil/servicios-ia/page.tsx`

**Página · ruta `/perfil/servicios-ia`**

Exporta:

- (default) componente `ProfileAIServicesPage` `()`

- Usa: [`SelectAIServiceComponent.tsx`](components/profile.md#components-profile-selectaiservicecomponent-tsx)

---

<a id="app-layout-tsx"></a>
## `app/layout.tsx`

**Layout · ruta `/`**

Exporta:

- constante `metadata` = `{ title: "Cloudperformance", description: "Cloudperformance - INTAC", }`
- (default) componente `RootLayout` `({ children, }: Readonly<{ children: React.ReactNode; }>)`

Internos:

- constante `geistSans`
- constante `geistMono`

- Usa: [`ThemeProvider.tsx`](components/generales.md#components-themeprovider-tsx), [`ClientContext.tsx`](components/context.md#components-context-clientcontext-tsx), [`SWRProvider.tsx`](components/generales.md#components-swrprovider-tsx), [`sonner.tsx`](components/ui.md#components-ui-sonner-tsx)

---

<a id="app-page-tsx"></a>
## `app/page.tsx`

**Página · ruta `/`**

Exporta:

- (default) componente `Home` `()`

