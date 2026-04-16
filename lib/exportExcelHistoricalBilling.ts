import ExcelJS from 'exceljs'
import { RespuestaHistoricoConsumo } from '@/components/azure/vista-facturacion/tendencia-pago-por-uso/table/HistoricalBillingTable' // Ajusta esta ruta si es diferente

const formatDevLabel = (periodo: string, meses: string[]) => {
  const parts = periodo.split('_')
  if (parts.length > 1) {
    const mesActual = parts[parts.length - 1]
    const currentIndex = meses.indexOf(mesActual)
    if (currentIndex > 0) {
      const mesAnterior = meses[currentIndex - 1]
      return `${mesAnterior} vs ${mesActual}`
    }
    return `vs ${mesActual}`
  }
  return periodo
}

export const exportHistoricalBillingToExcel = async (
  data: RespuestaHistoricoConsumo,
  meses: string[],
  periodosDesviacion: string[],
  filename = 'Historico_Consumo_Azure.xlsx'
) => {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Histórico de Consumo')

  const headerBg: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } }
  const subHeaderBg: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }
  const totalColBg: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }
  
  const fontWhiteBold: Partial<ExcelJS.Font> = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Calibri', size: 11 }
  const fontDarkBold: Partial<ExcelJS.Font> = { color: { argb: 'FF1E293B' }, bold: true, name: 'Calibri', size: 11 }
  const fontAlza: Partial<ExcelJS.Font> = { color: { argb: 'FFD97706' }, bold: true, name: 'Calibri' }
  const fontBaja: Partial<ExcelJS.Font> = { color: { argb: 'FF10B981' }, bold: true, name: 'Calibri' }

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  }

  const currencyFormat = '"$"#,##0.00;"($"#,##0.00)'

  const row1 = ws.addRow(['', 'CONSUMO HISTÓRICO'])
  for(let i=0; i < meses.length - 1; i++) row1.getCell(3 + i).value = ''
  
  const devStartCol = 2 + meses.length + 1
  if (periodosDesviacion.length > 0) {
    row1.getCell(devStartCol).value = 'DESVIACIONES MENSUALES'
  }

  row1.eachCell((cell) => {
    cell.fill = headerBg
    cell.font = fontWhiteBold
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })

  ws.mergeCells(1, 2, 1, 2 + meses.length)
  if (periodosDesviacion.length > 0) {
    ws.mergeCells(1, devStartCol, 1, devStartCol + periodosDesviacion.length - 1)
  }

  const headers = ['Service Category', ...meses, 'Total', ...periodosDesviacion.map(d => formatDevLabel(d, meses))]
  const row2 = ws.addRow(headers)
  row2.eachCell((cell) => {
    cell.fill = subHeaderBg
    cell.font = fontDarkBold
    cell.border = thinBorder
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })

  row2.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }

  data.datos_historicos_tabla.forEach((row) => {
    const rowData = [
      row.service_category,
      ...row.consumo_historico.map((c) => c.costo),
      row.total_historico,
      ...row.desviaciones_mensuales.map((d) => d.valor),
    ]
    const dataRow = ws.addRow(rowData)

    dataRow.eachCell((cell, colNumber) => {
      cell.border = thinBorder
      
      if (colNumber === 1) {
        cell.alignment = { horizontal: 'left' }
      } else {
        cell.numFmt = currencyFormat
        cell.alignment = { horizontal: 'right' }
      }


      const totalColIndex = 2 + meses.length
      if (colNumber === totalColIndex) {
        cell.fill = totalColBg
        cell.font = { bold: true }
      }


      if (colNumber > totalColIndex) {
        const val = Number(cell.value)
        if (val > 0) cell.font = fontAlza
        else if (val < 0) cell.font = fontBaja
      }
    })
  })

  const totalRowData = [
    'TOTAL GENERAL',
    ...data.totales_generales.por_mes.map((t) => t.total),
    data.totales_generales.gran_total,
  ]
  const totalRow = ws.addRow(totalRowData)
  totalRow.eachCell((cell, colNumber) => {
    cell.fill = headerBg
    cell.font = fontWhiteBold
    cell.border = thinBorder
    if (colNumber > 1) {
      cell.numFmt = currencyFormat
      cell.alignment = { horizontal: 'right' }
    }
  })


  if (periodosDesviacion.length > 0) {
    ws.addRow([]) 
    
    const headersResumen = ['Resumen desviaciones mensuales', ...periodosDesviacion.map(d => formatDevLabel(d, meses))]
    const rHead = ws.addRow(headersResumen)
    rHead.eachCell((cell, colNumber) => {
      cell.fill = headerBg
      cell.font = fontWhiteBold
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = thinBorder
    })
    rHead.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }

    const rowAlzas = ['T10-Alzas', ...data.resumen_desviaciones_mensuales.map(r => r.alzas)]
    const rAlzas = ws.addRow(rowAlzas)
    rAlzas.eachCell((cell, colNumber) => {
      cell.border = thinBorder
      if (colNumber === 1) {
        cell.fill = headerBg
        cell.font = fontWhiteBold
      } else {
        cell.numFmt = currencyFormat
        cell.font = fontAlza
        cell.alignment = { horizontal: 'right' }
      }
    })

    const rowBajas = ['T10-Bajas', ...data.resumen_desviaciones_mensuales.map(r => r.bajas)]
    const rBajas = ws.addRow(rowBajas)
    rBajas.eachCell((cell, colNumber) => {
      cell.border = thinBorder
      if (colNumber === 1) {
        cell.fill = headerBg
        cell.font = fontWhiteBold
      } else {
        cell.numFmt = currencyFormat
        cell.font = fontBaja
        cell.alignment = { horizontal: 'right' }
      }
    })

    const rowNeto = ['Neto', ...data.resumen_desviaciones_mensuales.map(r => r.neto)]
    const rNeto = ws.addRow(rowNeto)
    rNeto.eachCell((cell, colNumber) => {
      cell.border = thinBorder
      if (colNumber === 1) {
        cell.fill = headerBg
        cell.font = fontWhiteBold
      } else {
        cell.fill = subHeaderBg
        cell.numFmt = currencyFormat
        const val = Number(cell.value)
        cell.font = val > 0 ? fontAlza : val < 0 ? fontBaja : fontDarkBold
        cell.alignment = { horizontal: 'right' }
      }
    })
  }
  
  // --- AJUSTE DE ANCHO DE COLUMNAS (AUTOMÁTICO) ---
  ws.columns.forEach((column) => {
    let maxLength = 0;
    
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : ''; 
      const extraPadding = cell.numFmt ? 5 : 0;       
      const currentLength = cellValue.length + extraPadding;
      
      if (currentLength > maxLength) {
        maxLength = currentLength;
      }
    });

    column.width = maxLength < 15 ? 15 : maxLength + 2;
  });

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}