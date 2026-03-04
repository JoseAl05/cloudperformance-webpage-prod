import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Quote, TrendingUp } from 'lucide-react';
import { AiFinopsMetrics, ForecastPeriod } from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';

interface FinancialSummaryProps {
    data: AiFinopsMetrics;
}

export const FinancialSummary = ({ data }: FinancialSummaryProps) => {
    const {
        executive_summary
    } = data;


    return (
        <div className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 border-l-4 border-l-blue-500 shadow-md">
                <CardContent className='p-4'>
                    <p className="md:text-xl font-normal leading-tight text-foreground">
                        {executive_summary.cfo_summary}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};