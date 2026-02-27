import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Terminal, CheckCircle2 } from 'lucide-react';
import { AiFinopsMetrics } from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';

interface TechnicalSummaryProps {
  data: AiFinopsMetrics;
}

export const TechnicalSummary = ({ data }: TechnicalSummaryProps) => {
  const {
    executive_summary,
  } = data;


  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/30 border-l-4 border-l-orange-500 shadow-md">
        <CardContent className='p-4'>
          <p className="md:text-xl font-normal leading-tight text-foreground">
            "{executive_summary.cto_summary}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};