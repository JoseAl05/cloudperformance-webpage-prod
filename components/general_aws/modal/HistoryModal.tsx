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
import { MapPin, Hash } from 'lucide-react';
import { ReactNode } from 'react';

export interface HistoryModalTab {
    value: string;
    label: string;
    content: ReactNode;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subTitle?: string;
    region: string;
    resourceType: string;
    tabs: HistoryModalTab[];
}

export const HistoryModal = ({
    isOpen,
    onClose,
    title,
    subTitle,
    region,
    resourceType,
    tabs
}: HistoryModalProps) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-slate-950 dark:border-slate-800">

                <div className="px-6 py-4 border-b shrink-0 bg-white dark:bg-slate-950 z-10">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 dark:text-slate-100">
                                    {subTitle || title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-3 mt-1.5">
                                    <span className="flex items-center gap-1 text-xs">
                                        <MapPin className="h-3 w-3" /> {region}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border dark:border-slate-800">
                                        <Hash className="h-3 w-3" /> {title}
                                    </span>
                                    <Badge variant="outline" className="text-[10px]">{resourceType}</Badge>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Tabs defaultValue={tabs[0]?.value} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="px-6 pt-2 pb-0 shrink-0 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                        <TabsList className="bg-transparent p-0 gap-6 w-full justify-start h-auto">
                            {tabs.map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3 bg-transparent shadow-none data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {tabs.map(tab => (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 min-h-0 m-0 data-[state=active]:flex flex-col"
                        >
                            {tab.content}
                        </TabsContent>
                    ))}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};