'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, FolderTree, Hash, MapPin, Tag } from 'lucide-react';

interface RecursosVmCardsComponentProps {
    data: unknown;
}

export const RecursosVmCardsComponent = ({ data }: RecursosVmCardsComponentProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Ubicación</p>
                                <p className="text-lg font-bold text-blue-600 mt-1">{data.ubicacion}</p>
                            </div>
                            <MapPin className="h-6 w-6 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Fecha Creación</p>
                                <p className="text-lg font-bold text-green-600 mt-1">
                                    {new Date(data.fecha_creacion).toLocaleDateString("es-ES")}
                                </p>
                            </div>
                            <Calendar className="h-6 w-6 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Edad Recurso (días)</p>
                                <p className="text-lg font-bold text-purple-600 mt-1">{data.edad_recurso_dias}</p>
                            </div>
                            <Clock className="h-6 w-6 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">Grupo de Recursos</p>
                                <p className="text-lg font-bold text-orange-600 mt-1">{data.grupo_recursos}</p>
                            </div>
                            <FolderTree className="h-6 w-6 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="border-l-4 border-l-cyan-500">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase">ID de Suscripción</p>
                            <p className="text-sm font-bold text-cyan-600 font-mono mt-1 break-all">
                                {data.id_suscripcion}
                            </p>
                        </div>
                        <Hash className="h-6 w-6 text-cyan-500 flex-shrink-0 ml-4" />
                    </div>
                </CardContent>
            </Card>
            {data.tags && Object.keys(data.tags).length > 0 && (
                <Card className="border-l-4 border-l-pink-500">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Tag className="h-5 w-5 text-pink-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase mb-3">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(data.tags).map(([key, value]) => (
                                        <div key={key} className="bg-pink-50 dark:bg-pink-950 px-3 py-2 rounded border border-pink-200 dark:border-pink-800">
                                            <span className="text-xs text-muted-foreground font-medium">{key}: </span>
                                            <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">{value as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}