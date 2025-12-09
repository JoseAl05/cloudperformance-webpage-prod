'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Ghost,
    Hash,
    CalendarClock,
    Globe,
    List,
    DollarSign,
    Copy,
    ArrowRight
} from 'lucide-react';
import { UnusedRoute53 } from '@/interfaces/vista-unused-resources/unusedRoutes53Interfaces';

interface UnusedRoute53InsightModalProps {
    resource: UnusedRoute53 | null;
    isOpen: boolean;
    onClose: () => void;
}

export const UnusedRoute53InsightModal = ({ resource, isOpen, onClose }: UnusedRoute53InsightModalProps) => {

    if (!resource) return null;
    const sortedHistory = [...resource.history].sort((a, b) =>
        new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
    );

    const latestSnapshot = sortedHistory[0];
    const isUnused = latestSnapshot.details.length <= 2;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] md:max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <DialogHeader>
                        <div className="flex items-start justify-between mr-4">
                            <div>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 break-all">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    {resource.rs_name}
                                </DialogTitle>
                                <DialogDescription className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mt-1.5">
                                    <span className="flex items-center gap-1 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border truncate max-w-[300px]" title={resource.hz_id}>
                                        <Hash className="h-3 w-3" /> {resource.hz_id}
                                    </span>
                                    {isUnused && (
                                        <Badge variant="destructive" className="w-fit text-[10px]">Zona Infrautilizada (Vacía)</Badge>
                                    )}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 pt-2 pb-0">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="details">Detalle Actual y Registros</TabsTrigger>
                            <TabsTrigger value="history">
                                Historial ({sortedHistory.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="details" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                        <ScrollArea className="flex-1">
                            <div className="p-6 grid gap-6">
                                {/* Diagnóstico Card */}
                                <div className="rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20 p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white dark:bg-green-950 rounded-full shadow-sm">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-green-900 dark:text-green-200">
                                                Oportunidad de Ahorro
                                            </h4>
                                            <p className="text-xs text-green-800 dark:text-green-300 mt-1">
                                                Eliminar esta Hosted Zone generaría un ahorro estimado de <strong>${resource.potential_savings} USD/mes</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de Registros DNS Actuales */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <List className="h-4 w-4 text-slate-500" />
                                        Registros DNS ({latestSnapshot.details.length})
                                    </h4>

                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-500 uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">Tipo</th>
                                                    <th className="px-4 py-3">TTL</th>
                                                    <th className="px-4 py-3">Valor(es)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {latestSnapshot.details.map((record, idx) => (
                                                    <tr key={idx} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                                        <td className="px-4 py-3 font-medium">
                                                            <Badge variant="outline">{record.rs_type}</Badge>
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                            {record.rs_ttl}s
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="space-y-1">
                                                                {record.rs_records.map((r, rIdx) => (
                                                                    <div key={rIdx} className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                                                                        {r.Value}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-4">
                                {sortedHistory.map((snapshot, index) => {
                                    const recordCount = snapshot.details.length;
                                    const isCurrentUnused = recordCount <= 2;

                                    return (
                                        <div key={index} className="flex gap-4 items-start group">
                                            <div className="flex flex-col items-center mt-5">
                                                <div className="w-2 h-2 rounded-full bg-slate-300 group-first:bg-blue-500 ring-4 ring-white dark:ring-slate-950 flex-shrink-0" />
                                                {index !== sortedHistory.length - 1 && (
                                                    <div className="w-px h-full bg-slate-200 my-1" />
                                                )}
                                            </div>

                                            <div className="flex-1 border rounded-lg p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-semibold text-xs">
                                                            {new Date(snapshot.sync_time).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 border rounded bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium">Total Registros</span>
                                                        <span className="text-lg font-bold">{recordCount}</span>
                                                    </div>
                                                    <div className="p-3 border rounded bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium">Estado</span>
                                                        {isCurrentUnused ? (
                                                            <div className="flex items-center gap-1 text-red-600 text-xs font-bold">
                                                                <Ghost className="h-3 w-3" /> Infrautilizado
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                                                                <Globe className="h-3 w-3" /> Con Registros
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-3 text-xs text-muted-foreground">
                                                    <span className="font-semibold">Tipos de registros presentes: </span>
                                                    {Array.from(new Set(snapshot.details.map(d => d.rs_type))).join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};