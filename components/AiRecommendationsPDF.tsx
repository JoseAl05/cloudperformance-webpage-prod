import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { AiRecommendationReport } from '@/interfaces/ai-recommendations/aiRecommendations';

// Utilidades que ya tenías
const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/\s*\(?\[[^\]]+\]\([^)]+\)\)?/g, '').trim();
};

// Estilos específicos para el PDF
const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
    headerBox: { backgroundColor: '#eff6ff', padding: 15, borderRadius: 5, marginBottom: 20, border: '1px solid #bfdbfe' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
    summaryText: { fontSize: 10, color: '#1e3a8a', marginBottom: 10, lineHeight: 1.4 },
    savingsBox: { backgroundColor: '#ffffff', padding: 10, borderRadius: 5, border: '1px solid #e2e8f0', marginTop: 10 },
    savingsTitle: { fontSize: 10, color: '#64748b', textTransform: 'uppercase' },
    savingsAmount: { fontSize: 18, fontWeight: 'bold', color: '#047857', marginTop: 4 },
    
    // Tarjetas de recursos
    resourceCard: { border: '1px solid #e2e8f0', borderRadius: 5, padding: 12, marginBottom: 15 },
    resourceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    resourceName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
    resourceType: { fontSize: 9, backgroundColor: '#f1f5f9', padding: '2 6', borderRadius: 10, color: '#475569' },
    
    // Secciones internas
    sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginTop: 10, marginBottom: 5 },
    textNormal: { fontSize: 9, color: '#334155', lineHeight: 1.4, marginBottom: 4 },
    textBold: { fontWeight: 'bold' },
    
    // Badges de Riesgo
    riskLow: { fontSize: 9, backgroundColor: '#d1fae5', color: '#065f46', padding: '2 6', borderRadius: 4 },
    riskMedium: { fontSize: 9, backgroundColor: '#fef08a', color: '#854d0e', padding: '2 6', borderRadius: 4 },
    riskHigh: { fontSize: 9, backgroundColor: '#fee2e2', color: '#991b1b', padding: '2 6', borderRadius: 4 },
});

const getRiskStyle = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes('low') || r.includes('bajo')) return styles.riskLow;
    if (r.includes('medium') || r.includes('medio')) return styles.riskMedium;
    return styles.riskHigh;
};

interface Props {
    data: AiRecommendationReport[];
}

export const AiRecommendationsPDF = ({ data }: Props) => (
    <Document>
        {data.map((report) => (
            <Page key={report.report_id} size="A4" style={styles.page}>
                {/* Cabecera del Reporte */}
                <View style={styles.headerBox}>
                    <Text style={styles.title}>Resumen Ejecutivo IA ({report.cloud_provider})</Text>
                    <Text style={styles.summaryText}>{cleanText(report.executive_summary)}</Text>
                    
                    <View style={styles.savingsBox}>
                        <Text style={styles.savingsTitle}>Ahorro Total Identificado</Text>
                        <Text style={styles.savingsAmount}>{formatCurrency(report.total_monthly_savings)}</Text>
                    </View>
                </View>

                {/* Lista de Recursos (Expandidos por defecto para el PDF) */}
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, color: '#475569' }}>
                    HALLAZGOS DETALLADOS
                </Text>

                {[...report.resources]
                    .sort((a, b) => b.impact_matrix.savings_value - a.impact_matrix.savings_value)
                    .map((resource, index) => (
                    <View key={`${resource.resource_id}-${index}`} style={styles.resourceCard} wrap={false}>
                        <View style={styles.resourceHeader}>
                            <View style={{ width: '70%' }}>
                                <Text style={styles.resourceName}>{resource.resource_name}</Text>
                                <Text style={styles.textNormal}>{resource.recommendation_subtype}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.textNormal}>Ahorro: {formatCurrency(resource.impact_matrix.savings_value, resource.impact_matrix.currency)}</Text>
                                <Text style={getRiskStyle(resource.impact_matrix.risk_level.level)}>
                                    Riesgo: {resource.impact_matrix.risk_level.level}
                                </Text>
                            </View>
                        </View>

                        {/* Diagnóstico */}
                        <Text style={styles.sectionTitle}>Diagnóstico</Text>
                        <Text style={styles.textNormal}><Text style={styles.textBold}>Resumen: </Text>{cleanText(resource.diagnosis.summary)}</Text>
                        <Text style={styles.textNormal}><Text style={styles.textBold}>Análisis: </Text>{cleanText(resource.diagnosis.billing_analysis)}</Text>

                        {/* Plan de acción simplificado */}
                        <Text style={styles.sectionTitle}>Pasos de Remediación</Text>
                        {resource.action_plan.remediation_steps.map((step, idx) => (
                            <Text key={idx} style={styles.textNormal}>
                                {idx + 1}. <Text style={styles.textBold}>{step.title}: </Text>{cleanText(step.description)}
                            </Text>
                        ))}
                    </View>
                ))}
            </Page>
        ))}
    </Document>
);