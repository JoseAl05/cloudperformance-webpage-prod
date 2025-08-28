import React, { useState } from 'react';
import {
  Server,
  Activity,
  Clock,
  Settings,
  Eye,
  Download,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Home,
  MapPin,
  Zap,
  HardDrive,
  Wifi,
  ShieldCheck,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const TestComponent = () => {
  const [selectedInstance, setSelectedInstance] = useState("i-0dedc21ae416dc16");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const instanceInfo = {
    id: "i-0dedc21ae416dc16",
    name: "web-server-prod-01",
    type: "t3.large",
    state: "running",
    region: "us-east-1",
    az: "us-east-1a",
    vpc: "vpc-12345678",
    subnet: "subnet-87654321",
    securityGroups: ["sg-web-servers", "sg-ssh-access"],
    keyPair: "prod-servers-key",
    launchTime: "2025-08-20T10:30:00Z",
    uptime: "6 días, 14 horas"
  };

  const metricsOverview = {
    cpu: { current: 45, max: 78, trend: "up" },
    memory: { current: 62, max: 85, trend: "stable" },
    network: { in: "125 MB/s", out: "89 MB/s", trend: "down" },
    disk: { usage: 78, iops: 1250, trend: "up" }
  };

  const quickActions = [
    { icon: Settings, label: "Ver Historial", color: "blue" },
  ];

  const recentEvents = [
    { id: 1, event: "RunInstances", time: "Hace 2h", status: "completed" },
    { id: 2, event: "ModifyInstance", time: "Hace 4h", status: "completed" },
    { id: 3, event: "StopInstances", time: "Hace 1d", status: "completed" },
    { id: 4, event: "CreateSnapshot", time: "Hace 2d", status: "failed" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header de página mejorado */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Instancias EC2
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Monitoreo y gestión de instancias Amazon EC2
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Exportar Datos
              </Button>
            </div>
          </div>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar izquierdo - Info de instancia */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              {/* Info básica de la instancia */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-500" />
                    Instancia Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{instanceInfo.name}</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {instanceInfo.state}
                      </Badge>
                    </div>
                    <code className="text-sm text-gray-600 dark:text-gray-400">{instanceInfo.id}</code>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium">{instanceInfo.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Región:</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {instanceInfo.region}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Uptime:</span>
                      <span className="font-medium text-green-600">{instanceInfo.uptime}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-1 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="gap-2 justify-center"
                        >
                          <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas rápidas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Estado Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(metricsOverview).map(([key, metric]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{key}:</span>
                        <span className={`${typeof metric.current === 'number' ?
                            (metric.current > 70 ? 'text-red-500' : 'text-green-500') :
                            'text-blue-500'
                          }`}>
                          {typeof metric.current === 'number' ? `${metric.current}%` : metric.current}
                        </span>
                      </div>
                      {typeof metric.current === 'number' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${metric.current > 70 ? 'bg-red-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${metric.current}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Eventos recientes - preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    Eventos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentEvents.slice(0, 4).map(event => (
                      <div key={event.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium">{event.event}</div>
                          <div className="text-gray-500">{event.time}</div>
                        </div>
                        <Badge
                          variant={event.status === 'completed' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-sm">
                    Ver todos los eventos →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="xl:col-span-3">
            <div className="space-y-8">
              {/* Filtros y selección mejorados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filtros de Monitoreo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Período
                      </label>
                      <div className="mt-1 relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Seleccionar fechas"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Región
                      </label>
                      <div className="mt-1 relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="us-east-1"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Instancia
                      </label>
                      <div className="mt-1 relative">
                        <Server className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="i-0dedc21ae416dc16"
                          className="pl-10"
                          value={selectedInstance}
                          onChange={(e) => setSelectedInstance(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">CPU Utilization</p>
                        <p className="text-2xl font-bold">45%</p>
                        <p className="text-xs text-gray-500">Max: 78%</p>
                      </div>
                      <Zap className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                        <p className="text-2xl font-bold">62%</p>
                        <p className="text-xs text-gray-500">8GB / 16GB</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Network I/O</p>
                        <p className="text-2xl font-bold">125MB/s</p>
                        <p className="text-xs text-gray-500">In: 125 | Out: 89</p>
                      </div>
                      <Wifi className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Disk Usage</p>
                        <p className="text-2xl font-bold">78%</p>
                        <p className="text-xs text-gray-500">156GB / 200GB</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Área de gráficos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Activity className="h-6 w-6 text-blue-500" />
                    Métricas Detalladas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Placeholder para gráficos */}
                    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Activity className="h-8 w-8 mx-auto mb-2" />
                        <p>Gráfico CPU Usage</p>
                      </div>
                    </div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Wifi className="h-8 w-8 mx-auto mb-2" />
                        <p>Gráfico Network I/O</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabla de eventos mejorada */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-3">
                        <Clock className="h-6 w-6 text-purple-500" />
                        Historial de Eventos
                      </CardTitle>
                      <p className="text-gray-500 mt-1">
                        Eventos recientes de la instancia {selectedInstance}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <div className="text-center text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Tu tabla de eventos aquí</h3>
                      <p>La tabla que creamos se vería perfecta en este espacio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};