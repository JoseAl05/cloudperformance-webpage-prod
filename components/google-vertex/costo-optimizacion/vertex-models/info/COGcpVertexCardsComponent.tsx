'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ArrowDownRight, ArrowDownToLine, ArrowUpFromLine, ArrowUpRight, Bot, Boxes, ChevronDown, CircleDollarSign, Fingerprint, MapPin, ReceiptText, Server, Star, TriangleAlert, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VertexModelCost, VertexPriceComparison, VertexRateObject } from '@/interfaces/vertex-cost-optimization/gcpVertexModels'

type SortOption = 'savings' | 'confidence' | 'balanced'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'savings', label: 'Mayor ahorro' },
  { value: 'confidence', label: 'Mayor confiabilidad' },
  { value: 'balanced', label: 'Confiabilidad + ahorro' },
]

const tokenFormatter = new Intl.NumberFormat('es-CL')
const quantityFormatter = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 4 })
const percentFormatter = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const confidenceFormatter = new Intl.NumberFormat('es-CL', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })
const currencyFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

const toNumber = (value: number | undefined | null) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)
const firstFinite = (...values: Array<number | undefined | null>) => values.find((value): value is number => typeof value === 'number' && Number.isFinite(value))

const formatCost = (value: number | undefined | null) => {
  const numeric = toNumber(value)
  if (numeric === 0) return 'US$0,00'
  const absolute = Math.abs(numeric)
  const formatted = absolute > 0 && absolute < 0.01
    ? `US$${absolute.toFixed(6).replace('.', ',')}`
    : currencyFormatter.format(absolute)
  return numeric < 0 ? `-${formatted}` : formatted
}

const formatSignedCost = (value: number | undefined | null) => {
  const numeric = toNumber(value)
  if (numeric === 0) return formatCost(0)
  return `${numeric > 0 ? '+' : ''}${formatCost(numeric)}`
}

const formatPercent = (value: number | undefined | null) => {
  const numeric = toNumber(value)
  if (numeric === 0) return '0,00%'
  return `${numeric > 0 ? '+' : ''}${percentFormatter.format(numeric)}%`
}

const formatQuantity = (value: number | undefined | null) => {
  const numeric = toNumber(value)
  return Number.isInteger(numeric) ? tokenFormatter.format(numeric) : quantityFormatter.format(numeric)
}

const formatRate = (rate?: VertexRateObject | null) => {
  const ratePerMillion = firstFinite(
    rate?.net_price_per_1m_usd,
    rate?.price_per_1m_usd,
    typeof rate?.net_price === 'number' ? rate.net_price * 1_000_000 : undefined,
    typeof rate?.price === 'number' ? rate.price * 1_000_000 : undefined,
  )
  return ratePerMillion == null ? 'Sin tarifa' : `${formatCost(ratePerMillion)} / 1M tokens`
}

const directionLabels: Record<string, string> = {
  input: 'Entrada',
  output: 'Salida',
  cached_input: 'Entrada cacheada',
  input_cached: 'Entrada cacheada',
  input_cached_write: 'Entrada cacheada escritura',
  output_cached: 'Salida cacheada',
  total: 'Total',
}

const stateLabels: Record<string, string> = {
  ok: 'Tarifas catalogo',
  missing_catalog_rates: 'Tarifas parciales',
  metrics_without_token_counts: 'Solo throughput',
}

const billingStateLabels: Record<string, { label: string; className: string }> = {
  matched: { label: 'Billing conciliado', className: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' },
  missing_billing_match: { label: 'Sin match billing', className: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300' },
  not_available: { label: 'Billing no disponible', className: 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300' },
}

const getBillingState = (state?: string | null) => {
  const key = state || 'not_available'
  return {
    key,
    ...(billingStateLabels[key] || { label: key, className: 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300' }),
  }
}

const getDeltaTone = (value: number) => {
  if (value > 0) return 'text-red-600 dark:text-red-400'
  if (value < 0) return 'text-emerald-600 dark:text-emerald-400'
  return 'text-muted-foreground'
}

const formatSkuSummary = (rate?: VertexRateObject | null) => {
  const skuIds = rate?.sku_ids?.filter(Boolean)
  if (skuIds?.length) return skuIds.join(', ')
  if (rate?.sku_id) return rate.sku_id
  return 'SKU no informado'
}

const getConfidenceScore = (similarity: VertexPriceComparison['model_similarity']) => {
  const score = similarity?.score
  return typeof score === 'number' && Number.isFinite(score) ? score : -1
}

const ModelConfidence = ({ similarity, modelName }: { similarity: VertexPriceComparison['model_similarity']; modelName: string }) => {
  const score = similarity?.score
  const hasScore = typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100 && similarity?.level !== 'insufficient_data'
  const level = similarity?.level
  const levelLabel = level === 'high' ? 'Alta' : level === 'medium' ? 'Media' : level === 'low' ? 'Baja' : ''
  const scoreLabel = hasScore ? confidenceFormatter.format(score / 100) : null
  const coverage = similarity?.evidence_coverage_pct
  const partialEvidence = typeof coverage === 'number' && Number.isFinite(coverage) && coverage >= 0 && coverage < 100

  return (
    <div className='mt-3 space-y-1.5' title='Similitud estimada por categoria, perfil y pricing; no representa una probabilidad de exito.'>
      <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px]'>
        <span className='font-medium text-muted-foreground'>Confiabilidad del modelo</span>
        <span className='font-semibold text-foreground'>{hasScore ? levelLabel : 'Sin datos suficientes'}</span>
      </div>
      {hasScore && (
        <div className='flex items-center gap-3'>
          <div role='meter' aria-label={`Confiabilidad de ${modelName}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-valuetext={`${scoreLabel}, nivel ${levelLabel.toLowerCase()}; similitud con el modelo actual`} className='h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
            <div className={cn('h-full rounded-full', level === 'high' ? 'bg-emerald-600 dark:bg-emerald-500' : level === 'medium' ? 'bg-amber-600 dark:bg-amber-500' : 'bg-rose-600 dark:bg-rose-500')} style={{ width: `${score}%` }} />
          </div>
          <span className='w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground'>{scoreLabel}</span>
        </div>
      )}
      {hasScore && <p className='text-[10px] leading-snug text-muted-foreground'>Estimacion por categoria, capacidades y pricing del modelo.</p>}
      {hasScore && partialEvidence && <p className='text-[10px] leading-snug text-muted-foreground'>Datos disponibles para el {confidenceFormatter.format(coverage / 100)} de los requisitos.</p>}
    </div>
  )
}

const GcpVertexModelCard = ({ vertexModel }: { vertexModel: VertexModelCost }) => {
  const formatted = useMemo(() => {
    const inputTokens = toNumber(vertexModel.tokens?.input)
    const outputTokens = toNumber(vertexModel.tokens?.output)
    const cachedTokens = toNumber(vertexModel.tokens?.cached_input)
    const totalTokens = toNumber(vertexModel.tokens?.total) || inputTokens + outputTokens + cachedTokens
    const catalogTotal = toNumber(vertexModel.total_cost)
    const billingTotal = toNumber(vertexModel.total_billing_cost)
    const billingGrossTotal = toNumber(vertexModel.total_billing_gross_cost)
    const billingState = getBillingState(vertexModel.billing_match_state)
    const hasBilling = billingTotal > 0 || billingState.key === 'matched'
    const baselineCost = hasBilling ? billingTotal : catalogTotal
    const profile = vertexModel.model_profile

    const catalogRates = Object.entries(vertexModel.catalog_rates || {}).map(([key, rate]) => ({
      key,
      label: directionLabels[key] || key,
      description: rate.description || 'Tarifa Vertex AI',
      rateLabel: formatRate(rate),
      cost: formatCost(vertexModel.cost_breakdown?.[key] ?? 0),
    }))

    const billingRates = Object.entries(vertexModel.billing_rates || {}).map(([key, rate]) => ({
      key,
      label: directionLabels[key] || key,
      description: rate.sku_descriptions?.join(' | ') || rate.description || 'SKU billing Vertex AI',
      skuLabel: formatSkuSummary(rate),
      rateLabel: formatRate(rate),
      cost: formatCost(vertexModel.billing_cost_breakdown?.[key] ?? 0),
      grossCost: formatCost(vertexModel.billing_gross_cost_breakdown?.[key] ?? vertexModel.billing_cost_breakdown?.[key] ?? 0),
      quantity: formatQuantity(vertexModel.billing_quantity_breakdown?.[key] ?? vertexModel.tokens?.[key] ?? 0),
    }))

    const billingComparisons = (vertexModel.billing_price_comparison || []).map((comparison) => ({
      ...comparison,
      label: directionLabels[comparison.direction] || comparison.direction,
      tokensLabel: formatQuantity(comparison.tokens),
      catalogCostLabel: formatCost(comparison.catalog_cost_usd),
      billingCostLabel: formatCost(comparison.billing_cost_usd),
      deltaCostLabel: formatSignedCost(comparison.delta_usd),
      deltaPercentLabel: formatPercent(comparison.delta_percent),
      deltaTone: getDeltaTone(comparison.delta_usd),
      billingRateLabel: formatRate(comparison.billing_rate),
    }))

    const modelComparisons = (vertexModel.price_comparison || []).map((candidate, index) => {
      const delta = typeof candidate.delta_pct_vs_billing === 'number' ? candidate.delta_pct_vs_billing : candidate.delta_pct_vs_catalog
      const hasDelta = typeof delta === 'number'
      const missing = candidate.missing_rates ?? []
      const detailedRates = candidate.detailed_base_rates
        ? Object.entries(candidate.detailed_base_rates).map(([key, rateObj]) => ({
          key,
          label: directionLabels[key] || key,
          meterName: rateObj.meter_name || rateObj.description || '-',
          rateLabel: formatRate(rateObj),
          cost: formatCost(candidate.detailed_cost_breakdown?.[key]),
        }))
        : []
      const techParity = candidate.technical_parity_report
      const missingCaps = techParity?.missing_capabilities?.length ? techParity.missing_capabilities.join(', ') : null
      const infraWarning = techParity?.infrastructure_warning && techParity.infrastructure_warning !== 'OK' ? techParity.infrastructure_warning : null
      const diffAmount = candidate.estimated_cost - baselineCost

      return {
        modelName: candidate.modelName,
        provider: candidate.provider,
        modelSimilarity: candidate.model_similarity,
        sortIndex: index,
        estimatedCost: candidate.estimated_cost,
        savingsAmount: baselineCost - candidate.estimated_cost,
        confidenceScore: getConfidenceScore(candidate.model_similarity),
        cost: formatCost(candidate.estimated_cost),
        deltaLabel: hasDelta && delta !== null ? formatPercent(delta) : null,
        isCheaper: hasDelta && delta !== null && delta < 0,
        isMoreExpensive: hasDelta && delta !== null && delta > 0,
        isNeutral: hasDelta && delta !== null && delta === 0,
        hasMissing: missing.length > 0,
        missingLabel: missing.map((key) => directionLabels[key] ?? key).join(', '),
        detailedRates,
        missingCaps,
        infraWarning,
        currentTpm: techParity?.current_max_tpm || 0,
        candidateTpm: techParity?.candidate_max_tpm || 0,
        diffFormatted: formatCost(Math.abs(diffAmount)),
        profile: candidate.model_profile,
      }
    })

    const totalDelta = hasBilling ? billingTotal - catalogTotal : 0
    const totalDeltaPercent = hasBilling && catalogTotal > 0 ? (totalDelta / catalogTotal) * 100 : 0

    return {
      inputTokens: tokenFormatter.format(inputTokens),
      outputTokens: tokenFormatter.format(outputTokens),
      cachedTokens: tokenFormatter.format(cachedTokens),
      totalTokens: tokenFormatter.format(totalTokens),
      catalogCost: formatCost(catalogTotal),
      billingCost: formatCost(billingTotal),
      billingGrossCost: formatCost(billingGrossTotal),
      baselineCost: formatCost(baselineCost),
      baselineLabel: hasBilling ? 'billing real' : 'catalogo',
      totalDelta: formatSignedCost(totalDelta),
      totalDeltaPercent: formatPercent(totalDeltaPercent),
      totalDeltaTone: getDeltaTone(totalDelta),
      catalogRates,
      billingRates,
      billingComparisons,
      modelComparisons,
      hasBilling,
      billingState,
      profile,
      state: stateLabels[vertexModel.data_state || 'ok'] || vertexModel.data_state || 'OK',
    }
  }, [vertexModel])

  const [comparisonSort, setComparisonSort] = useState<SortOption>('savings')

  const sortedComparison = useMemo(() => {
    const comparison = formatted.modelComparisons
    const maxSavings = Math.max(0, ...comparison.map((comp) => Math.max(comp.savingsAmount, 0)))
    const savingsScore = (comp: (typeof comparison)[number]) => maxSavings <= 0 ? 0 : (Math.max(comp.savingsAmount, 0) / maxSavings) * 100
    const bySavings = (a: (typeof comparison)[number], b: (typeof comparison)[number]) => b.savingsAmount - a.savingsAmount
    const byConfidence = (a: (typeof comparison)[number], b: (typeof comparison)[number]) => b.confidenceScore - a.confidenceScore
    const byOriginalOrder = (a: (typeof comparison)[number], b: (typeof comparison)[number]) => a.sortIndex - b.sortIndex

    return [...comparison].sort((a, b) => {
      if (comparisonSort === 'confidence') return byConfidence(a, b) || bySavings(a, b) || byOriginalOrder(a, b)
      if (comparisonSort === 'balanced') {
        const scoreA = a.confidenceScore < 0 ? -1 : (a.confidenceScore * 0.5) + (savingsScore(a) * 0.5)
        const scoreB = b.confidenceScore < 0 ? -1 : (b.confidenceScore * 0.5) + (savingsScore(b) * 0.5)
        return (scoreB - scoreA) || byConfidence(a, b) || bySavings(a, b) || byOriginalOrder(a, b)
      }
      return bySavings(a, b) || byConfidence(a, b) || byOriginalOrder(a, b)
    })
  }, [formatted.modelComparisons, comparisonSort])

  const missingRates = vertexModel.missing_rates || []
  const throughputEntries = Object.entries(vertexModel.throughput || {})
  const meterDetails = vertexModel.meter_details || []

  return (
    <Card className={cn('flex h-full flex-col overflow-hidden', 'transition-shadow hover:border-primary/40 hover:shadow-md')}>
      <CardHeader className='gap-2 pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-start gap-2.5'>
            <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'><Boxes className='h-5 w-5' /></span>
            <div className='min-w-0 flex flex-col gap-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <CardTitle className='truncate text-base font-semibold leading-tight text-foreground'>{vertexModel.provider} - {vertexModel.base_model || vertexModel.model_id || vertexModel.model_name}</CardTitle>
                {formatted.profile && (
                  <div className='flex items-center gap-0.5' title={formatted.profile.tier}>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={cn('h-4 w-4', star <= (formatted.profile?.stars ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30')} />)}
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2 text-xs'>
                <p className='flex items-center gap-1 truncate text-muted-foreground'>
                  <Server className='h-3 w-3' />
                  {vertexModel.endpoint_name || vertexModel.model_name || vertexModel.resource_id}
                </p>
                {formatted.profile?.tier && (
                  <>
                    <span className='text-muted-foreground/50'>&middot;</span>
                    <span className='font-medium text-sky-600 dark:text-sky-400'>{formatted.profile.tier}</span>
                  </>
                )}
              </div>
              {formatted.profile?.description && <p className='text-[11px] italic leading-snug text-slate-500 mt-1'>&quot;{formatted.profile.description}&quot;</p>}
            </div>
          </div>
          <div className='flex flex-col items-end gap-1.5 shrink-0'>
            <Badge variant='outline' className='gap-1 border-primary/30 text-primary mb-1'><MapPin className='h-3 w-3' />{vertexModel.region || 'global'}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col gap-3'>
        <div className='grid grid-cols-2 gap-2'>
          <div className='rounded-lg border bg-card p-3'><div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'><ArrowDownToLine className='h-4 w-4 text-sky-600 dark:text-sky-400' />Tokens entrada</div><p className='mt-1 text-lg font-bold tabular-nums text-foreground'>{formatted.inputTokens}</p></div>
          <div className='rounded-lg border bg-card p-3'><div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'><ArrowUpFromLine className='h-4 w-4 text-violet-600 dark:text-violet-400' />Tokens salida</div><p className='mt-1 text-lg font-bold tabular-nums text-foreground'>{formatted.outputTokens}</p></div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='rounded-lg border bg-card p-3'><div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'><Zap className='h-4 w-4 text-amber-600 dark:text-amber-400' />Tokens cache</div><p className='mt-1 text-lg font-bold tabular-nums text-foreground'>{formatted.cachedTokens}</p></div>
          <div className='rounded-lg border bg-card p-3'><div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'><Bot className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />Tokens total</div><p className='mt-1 text-lg font-bold tabular-nums text-foreground'>{formatted.totalTokens}</p></div>
        </div>

        <div className='rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20 flex flex-col gap-3'>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div><div className='flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400'><CircleDollarSign className='h-4 w-4 shrink-0' />Costo billing real</div><p className='mt-1 text-3xl font-bold tabular-nums text-emerald-950 dark:text-emerald-50'>{formatted.hasBilling ? formatted.billingCost : 'Sin match'}</p>{formatted.hasBilling && <p className='mt-1 text-[11px] text-emerald-700/75 dark:text-emerald-300/75'>Bruto: {formatted.billingGrossCost}</p>}</div>
            <div><div className='flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400'><ReceiptText className='h-4 w-4 shrink-0' />Costo estimado catalogo</div><p className='mt-1 text-3xl font-bold tabular-nums text-blue-950 dark:text-blue-50'>{formatted.catalogCost}</p></div>
          </div>
          {formatted.hasBilling && <div className='flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-100/70 bg-white/60 px-3 py-2 text-xs dark:border-emerald-900/50 dark:bg-black/20'><span className='font-semibold text-emerald-900 dark:text-emerald-100'>Diferencia billing vs catalogo</span><span className={cn('font-bold tabular-nums', formatted.totalDeltaTone)}>{formatted.totalDelta} ({formatted.totalDeltaPercent})</span></div>}
          <div className='grid grid-cols-1 gap-2 border-t border-emerald-200/60 pt-3 dark:border-emerald-800/50'>
            <p className='text-[10px] font-semibold uppercase tracking-wide text-emerald-800/70 dark:text-emerald-200/70'>Tarifas de catalogo aplicadas</p>
            {formatted.catalogRates.length === 0 ? <p className='rounded-md border border-dashed border-emerald-200 bg-white/60 px-3 py-2 text-xs text-emerald-900/70 dark:border-emerald-900 dark:bg-black/20 dark:text-emerald-100/70'>No se encontró una tarifa de catalogo compatible para estos tokens.</p> : formatted.catalogRates.map((rate) => (
              <div key={rate.key} className='flex items-center justify-between gap-3 rounded-md border border-emerald-100/50 bg-white/60 p-2 text-xs dark:bg-black/20'><div className='min-w-0'><p className='font-semibold text-emerald-900 dark:text-emerald-100'>{rate.label}</p><p className='truncate text-[10px] text-emerald-700/70 dark:text-emerald-300/70' title={rate.description}>{rate.rateLabel} - {rate.description}</p></div><span className='shrink-0 font-bold tabular-nums text-emerald-700 dark:text-emerald-400'>{rate.cost}</span></div>
            ))}
          </div>
        </div>

        <Collapsible defaultOpen={false} className='overflow-hidden rounded-lg border bg-card mt-2'>
          <CollapsibleTrigger asChild>
            <Button type='button' variant='ghost' className='group h-auto w-full justify-between rounded-none px-3 py-3 text-left cursor-pointer hover:bg-muted/50'>
              <span className='flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400'><CircleDollarSign className='h-4 w-4' />Detalle de metricas y facturacion Vertex</span>
              <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180' />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='overflow-hidden border-t'>
            <div className='space-y-3 p-3'>
              <div className='rounded-md bg-muted px-2.5 py-2 text-xs'><div className='flex items-center justify-between gap-2'><span className='min-w-0 truncate font-bold text-sky-600'>Modelo base</span><span className='shrink-0 truncate font-mono text-foreground'>{vertexModel.base_model || 'N/A'}</span></div></div>

              {throughputEntries.length > 0 && (
                <div className='space-y-1.5'>
                  <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wide'>Throughput consumido</p>
                  {throughputEntries.map(([key, value]) => <div key={key} className='flex justify-between rounded-md border bg-background px-3 py-2 text-xs'><span>{directionLabels[key] || key}</span><span className='font-bold tabular-nums'>{tokenFormatter.format(value)}</span></div>)}
                </div>
              )}

              <div className='space-y-1.5'>
                <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wide'>Facturacion real por billing export</p>
                {formatted.billingRates.length > 0 ? formatted.billingRates.map((rate) => (
                  <div key={rate.key} className='rounded-md border bg-background px-3 py-2 text-xs'>
                    <div className='flex items-center justify-between gap-3'><span className='font-semibold'>{rate.label}</span><span className='font-bold tabular-nums text-emerald-600 dark:text-emerald-400'>{rate.cost}</span></div>
                    <div className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground'><span>Cantidad: {rate.quantity}</span><span>Tarifa neta: {rate.rateLabel}</span><span title={rate.description}>SKU: {rate.skuLabel}</span><span>Bruto: {rate.grossCost}</span></div>
                  </div>
                )) : <div className='rounded-md border border-dashed px-3 py-3 text-xs text-muted-foreground'>No se encontró match de billing para este recurso en el rango seleccionado. Se mantiene el cálculo estimado por catalogo.</div>}
              </div>

              {formatted.billingComparisons.length > 0 && (
                <div className='space-y-1.5'>
                  <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wide'>Comparacion catalogo vs billing</p>
                  {formatted.billingComparisons.map((comparison) => <div key={comparison.direction} className='rounded-md border bg-background px-3 py-2 text-xs'><div className='flex items-center justify-between gap-3'><span className='font-semibold'>{comparison.label}</span><span className={cn('font-bold tabular-nums', comparison.deltaTone)}>{comparison.deltaCostLabel} ({comparison.deltaPercentLabel})</span></div><div className='mt-1 grid grid-cols-1 gap-1 text-[10px] text-muted-foreground sm:grid-cols-2'><span>Tokens: {comparison.tokensLabel}</span><span>Catalogo: {comparison.catalogCostLabel}</span><span>Billing: {comparison.billingCostLabel}</span><span>Tarifa billing: {comparison.billingRateLabel}</span></div></div>)}
                </div>
              )}

              {meterDetails.length > 0 && (
                <div className='space-y-1.5'>
                  <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wide'>SKUs facturados</p>
                  {meterDetails.map((meter, index) => {
                    const billedAmount = meter.usage_billed_amount ?? meter.usage_amount ?? 0
                    const unit = meter.usage_billed_unit || meter.usage_unit || 'count'
                    const location = meter.api_location || meter.location_region || vertexModel.region || 'global'
                    return <div key={`${meter.direction || 'direction'}-${meter.sku_id || 'sku'}-${meter.usage_start_time || index}-${index}`} className='rounded-md border bg-background px-3 py-2 text-xs'><div className='flex items-center justify-between gap-3'><span className='min-w-0 truncate font-semibold' title={meter.sku_description || undefined}>{meter.sku_description || 'SKU Vertex AI'}</span><span className='shrink-0 font-bold tabular-nums'>{formatCost(meter.cost_net_usd)}</span></div><div className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground'><span>{directionLabels[meter.direction || ''] || meter.direction || 'Uso'}</span><span>SKU: {meter.sku_id || 'N/A'}</span><span>Region API: {location}</span><span>Cantidad: {formatQuantity(billedAmount)} {unit}</span>{toNumber(meter.credits_amount_usd) !== 0 && <span>Creditos: {formatCost(meter.credits_amount_usd)}</span>}</div></div>
                  })}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen={false} className='overflow-hidden rounded-lg border bg-card mt-2'>
          <CollapsibleTrigger asChild>
            <Button type='button' variant='ghost' className='group h-auto w-full justify-between rounded-none px-3 py-3 text-left cursor-pointer hover:bg-muted/50'>
              <span className='flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400'><Bot className='h-4 w-4' />Simulacion de costos</span>
              <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180' />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='overflow-hidden border-t'>
            <div className='p-3'>
              <p className='text-sm leading-snug text-slate-500'>Simulacion del gasto de tu operacion en modelos equivalentes de Google Vertex AI basada en tu consumo actual.</p>
              <div className='mt-3 flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-2 text-xs'><span className='min-w-0 truncate text-sky-600 font-bold'>Modelo actual &middot; {vertexModel.provider} - {vertexModel.model_name}</span><span className='shrink-0 font-bold tabular-nums text-foreground text-sm' title={`Base: ${formatted.baselineLabel}`}>{formatted.baselineCost}</span></div>

              {formatted.modelComparisons.length > 1 && <div className='mt-3 flex flex-col gap-1.5 rounded-md border bg-background/70 p-2.5 sm:flex-row sm:items-center sm:justify-between'><span className='text-[11px] font-medium text-muted-foreground'>Ordenar modelos</span><Select value={comparisonSort} onValueChange={(value) => setComparisonSort(value as SortOption)}><SelectTrigger className='h-8 w-full text-xs sm:w-[230px]'><SelectValue /></SelectTrigger><SelectContent>{sortOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>}

              {formatted.modelComparisons.length === 0 ? <p className='mt-3 rounded-md border border-dashed px-3 py-3 text-center text-xs text-muted-foreground'>No hay modelos equivalentes para comparar.</p> : (
                <div className='mt-2.5 space-y-2'>
                  {sortedComparison.map((comp) => (
                    <div key={`${comp.modelName}-${comp.provider}`} className='rounded-md border bg-background px-3 py-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center gap-2'><p className='truncate text-sm font-bold leading-tight text-foreground'>{comp.modelName}</p>{comp.profile && <div className='flex items-center gap-0.5' title={comp.profile?.tier}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={cn('h-3 w-3', star <= (comp.profile?.stars ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30')} />)}</div>}</div>
                          <p className='truncate text-xs font-medium text-sky-600 mt-0.5'>{comp.provider}{comp.profile && <span className='text-muted-foreground font-normal ml-1'>&middot; {comp.profile?.tier}</span>}</p>
                          {comp.profile?.description && <p className='mt-1 text-[11px] italic leading-snug text-slate-500'>&quot;{comp.profile?.description}&quot;</p>}
                        </div>
                        {comp.deltaLabel && <Badge variant='outline' className={cn('shrink-0 gap-1 tabular-nums mt-0.5', comp.isCheaper && 'border-emerald-300 text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-400', comp.isMoreExpensive && 'border-red-300 text-red-700 dark:border-red-900/50 dark:text-red-400', comp.isNeutral && 'text-muted-foreground')}>{comp.isCheaper && <ArrowDownRight className='h-3 w-3' />}{comp.isMoreExpensive && <ArrowUpRight className='h-3 w-3' />}{comp.deltaLabel}</Badge>}
                      </div>
                      <ModelConfidence similarity={comp.modelSimilarity} modelName={comp.modelName} />
                      <div className='mt-2.5 border-t border-muted/50 pt-2'>
                        <p className='text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide'>Desglose simulado</p>
                        <div className='space-y-1.5 mb-2'>{comp.detailedRates.map((rate) => <div key={rate.key} className='flex items-center justify-between text-[10px] bg-muted/30 px-2 py-1.5 rounded border border-muted/60'><div className='flex flex-col min-w-0 pr-2'><span className='font-semibold text-foreground/80 truncate'>{rate.label}</span><div className='flex items-center gap-1 text-[9px] text-muted-foreground mt-0.5'><span className='font-mono whitespace-nowrap'>{rate.rateLabel}</span>{rate.meterName !== '-' && <><span className='opacity-50'>&middot;</span><span className='truncate' title={rate.meterName}>{rate.meterName}</span></>}</div></div><div className='shrink-0 text-right pl-2 border-l border-muted/50 ml-auto'><span className='font-bold tabular-nums text-foreground'>{rate.cost}</span></div></div>)}</div>
                        <div className='flex justify-between items-end mt-3 pt-3 border-t border-muted/50'><div className='flex flex-col gap-0.5'>{comp.isCheaper && <><span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider'>Ahorro proyectado</span><span className='text-sm font-bold text-emerald-600 dark:text-emerald-500 tabular-nums'>-{comp.diffFormatted}</span></>}{comp.isMoreExpensive && <><span className='text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-wider'>Costo adicional</span><span className='text-sm font-bold text-rose-600 dark:text-rose-500 tabular-nums'>+{comp.diffFormatted}</span></>}{comp.isNeutral && <><span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>Diferencia</span><span className='text-sm font-bold text-muted-foreground tabular-nums'>{comp.diffFormatted}</span></>}</div><div className='text-right flex flex-col gap-0.5'><span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>Costo estimado</span><span className='text-lg font-bold tabular-nums text-foreground leading-none'>{comp.cost}</span></div></div>
                      </div>
                      {comp.hasMissing && <p className='mt-3 flex items-center gap-1 text-[11px] leading-snug text-amber-600 dark:text-amber-400'><TriangleAlert className='h-3 w-3 shrink-0' />Comparacion parcial: sin tarifa para {comp.missingLabel}.</p>}
                      {comp.missingCaps && <div className='mt-3 flex items-start gap-1.5 rounded bg-amber-50 p-2 text-[11px] leading-snug text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'><TriangleAlert className='h-3.5 w-3.5 shrink-0 mt-0.5' /><p><span className='font-semibold'>Faltan capacidades:</span> El candidato no soporta <span className='font-mono text-[10px] font-bold'>{comp.missingCaps}</span>.</p></div>}
                      {comp.infraWarning && <div className='mt-2 flex items-start gap-1.5 rounded bg-rose-50 p-2 text-[11px] leading-snug text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'><TriangleAlert className='h-3.5 w-3.5 shrink-0 mt-0.5' /><p><span className='font-semibold'>Riesgo de equivalencia:</span> {comp.infraWarning} ({tokenFormatter.format(comp.candidateTpm)} vs {tokenFormatter.format(comp.currentTpm)} TPM).</p></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {missingRates.length > 0 && <p className='flex items-center gap-1 text-[11px] leading-snug text-amber-600 dark:text-amber-400'><TriangleAlert className='h-3 w-3 shrink-0' />Estimacion parcial: sin tarifa para {missingRates.map(key => directionLabels[key] || key).join(', ')}.</p>}

        <div className='mt-auto space-y-1 border-t pt-3 text-xs'>
          <div className='flex items-center gap-1.5'><Fingerprint className='h-3.5 w-3.5 shrink-0 text-muted-foreground' /><span className='shrink-0 text-muted-foreground'>Version modelo:</span><span className='min-w-0 flex-1 truncate font-mono text-foreground'>{vertexModel.model_version}</span></div>
          <div className='flex items-center gap-1.5'><Server className='h-3.5 w-3.5 shrink-0 text-muted-foreground' /><span className='shrink-0 text-muted-foreground'>Proyecto:</span><span className='min-w-0 flex-1 truncate font-mono text-foreground'>{vertexModel.project_id}</span></div>
        </div>
      </CardContent>
    </Card>
  )
}

export const GcpVertexCardsComponent = ({ data }: { data: VertexModelCost[] }) => {
  const sortedData = useMemo(() => [...data].sort((a, b) => ((toNumber(b.total_billing_cost) || toNumber(b.total_cost)) - (toNumber(a.total_billing_cost) || toNumber(a.total_cost)))), [data])

  if (sortedData.length === 0) {
    return <div className='flex items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground'>No hay datos de consumo disponibles.</div>
  }

  return (
    <div className={cn('grid gap-4', sortedData.length === 1 && 'grid-cols-1', sortedData.length === 2 && 'grid-cols-1 md:grid-cols-2', sortedData.length > 2 && 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2')}>
      {sortedData.map((vertexModel, index) => <GcpVertexModelCard key={[vertexModel.project_id, vertexModel.region, vertexModel.resource_type, vertexModel.resource_id, vertexModel.endpoint_id, vertexModel.deployed_model_id, vertexModel.model_id, vertexModel.model_name, vertexModel.model_version, index].filter(Boolean).join('-')} vertexModel={vertexModel} />)}
    </div>
  )
}
