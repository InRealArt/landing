import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { type ArtworkLeaseResults, type ArtworkLeaseComparison, formatPercentage } from '@/utils/artworkLeaseCalculations'

// PDF-specific currency formatter to avoid space/slash issues
const formatCurrencyForPDF = (amount: number): string => {
  // Format number with French locale but manually add currency symbol
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Replace any problematic space characters with regular space and add € symbol
  return formatted.replace(/[\s\u00A0\u2009\u202F]/g, ' ') + ' €';
}

// Register fonts (optional - will use default fonts if not available)
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/helvetica-regular.ttf',
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    borderBottom: '2px solid #6366F1',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottom: '1px solid #eeeeee',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  highlightRow: {
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
    borderRadius: 4,
  },
  highlightValue: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
  advantagesList: {
    marginTop: 10,
  },
  advantageItem: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 4,
    paddingLeft: 10,
  },
})

interface PDFTranslations {
  title: string
  generatedOn: string
  clientInfo: string
  company: string
  email: string
  taxRate: string
  leaseParameters: string
  artworkValue: string
  leaseDuration: string
  firstRentIncrease: string
  amountType: string
  leaseResults: string
  firstMonthRent: string
  monthlyRent: string
  totalLeaseAmount: string
  purchaseOption: string
  totalCostWithPurchase: string
  taxAdvantages: string
  totalTaxSavings: string
  monthlyTaxDeduction: string
  netCostAfterTax: string
  comparison: string
  criteria: string
  leasingWithPurchase: string
  directPurchase: string
  costBeforeTax: string
  taxSavingsLabel: string
  finalNetCost: string
  savingsWithLeasing: string
  leasingSurcharge: string
  keyPoints: string
  leasingAdvantages: string
  directPurchaseAdvantages: string
  leasingBenefits: {
    taxDeductibility: string
    noCapitalImmobilization: string
    flexibility: string
    artworkRenewal: string
  }
  purchaseBenefits: {
    immediateOwnership: string
    capitalGains: string
    depreciation: string
    noConstraints: string
  }
  footer: string
  yes: string
  no: string
  months: string
}

interface LeaseResultsPDFProps {
  leaseResults: ArtworkLeaseResults
  comparison: ArtworkLeaseComparison
  formData: {
    company: string
    email: string
    taxRate: number
    artworkValue: number
    leaseDuration: number
    firstRentIncrease: boolean
  }
  translations: PDFTranslations
}

export const LeaseResultsPDF: React.FC<LeaseResultsPDFProps> = ({
  leaseResults,
  comparison,
  formData,
  translations: t,
}) => {
  const isLeaseAdvantage = comparison.savings > 0
  const currentDate = new Date().toLocaleDateString('fr-FR')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.generatedOn.replace('{date}', currentDate)}</Text>
        </View>

        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.clientInfo}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.company}</Text>
            <Text style={styles.value}>{formData.company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.email}</Text>
            <Text style={styles.value}>{formData.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.taxRate}</Text>
            <Text style={styles.value}>{formData.taxRate}%</Text>
          </View>
        </View>

        {/* Lease Parameters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.leaseParameters}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.artworkValue}</Text>
            <Text style={styles.value}>{formatCurrencyForPDF(formData.artworkValue)} (HT)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.leaseDuration}</Text>
            <Text style={styles.value}>{formData.leaseDuration} {t.months}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.firstRentIncrease}</Text>
            <Text style={styles.value}>{formData.firstRentIncrease ? t.yes : t.no}</Text>
          </View>
        </View>

        {/* Lease Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.leaseResults}</Text>
          
          <View style={styles.highlightRow}>
            <View style={styles.row}>
              <Text style={styles.label}>{t.monthlyRent}</Text>
              <Text style={styles.highlightValue}>{formatCurrencyForPDF(leaseResults.monthlyRent)}</Text>
            </View>
          </View>

          {leaseResults.firstMonthRent !== leaseResults.monthlyRent && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.firstMonthRent}</Text>
              <Text style={styles.value}>{formatCurrencyForPDF(leaseResults.firstMonthRent)}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>{t.totalLeaseAmount}</Text>
            <Text style={styles.value}>{formatCurrencyForPDF(leaseResults.totalLeaseAmount)}</Text>
          </View>
        </View>

        {/* Tax Advantages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.taxAdvantages}</Text>
          
          <View style={styles.highlightRow}>
            <View style={styles.row}>
              <Text style={styles.label}>{t.totalTaxSavings}</Text>
              <Text style={styles.highlightValue}>{formatCurrencyForPDF(leaseResults.taxSavings)}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t.monthlyTaxDeduction}</Text>
            <Text style={styles.value}>{formatCurrencyForPDF(leaseResults.monthlyTaxDeduction)}</Text>
          </View>
          
          <View style={styles.highlightRow}>
            <View style={styles.row}>
              <Text style={styles.label}>{t.netCostAfterTax}</Text>
              <Text style={styles.highlightValue}>{formatCurrencyForPDF(leaseResults.netCostAfterTax)}</Text>
            </View>
          </View>
        </View>

        {/* Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.comparison}</Text>
          
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>{t.criteria}</Text>
              <Text style={styles.tableHeaderText}>{t.leasingWithPurchase}</Text>
              <Text style={styles.tableHeaderText}>{t.directPurchase}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{t.costBeforeTax}</Text>
              <Text style={styles.tableCell}>{formatCurrencyForPDF(leaseResults.totalLeaseAmount)}</Text>
              <Text style={styles.tableCell}>{formatCurrencyForPDF(comparison.purchasePrice)}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{t.taxSavingsLabel}</Text>
              <Text style={styles.tableCell}>-{formatCurrencyForPDF(leaseResults.taxSavings)}</Text>
              <Text style={styles.tableCell}>0,00 €</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{t.finalNetCost}</Text>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatCurrencyForPDF(leaseResults.netCostAfterTax)}</Text>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatCurrencyForPDF(comparison.purchasePrice)}</Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            <View style={styles.row}>
              <Text style={styles.label}>
                {isLeaseAdvantage ? t.savingsWithLeasing : t.leasingSurcharge}
              </Text>
              <Text style={[styles.highlightValue, { color: isLeaseAdvantage ? '#10b981' : '#ef4444' }]}>
                {formatCurrencyForPDF(Math.abs(comparison.savings))} ({formatPercentage(Math.abs(comparison.savingsPercentage))})
              </Text>
            </View>
          </View>
        </View>

        {/* Advantages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.keyPoints}</Text>
          
          <Text style={[styles.label, { fontSize: 13, fontWeight: 'bold', marginBottom: 5 }]}>
            {t.leasingAdvantages}
          </Text>
          <View style={styles.advantagesList}>
            <Text style={styles.advantageItem}>{t.leasingBenefits.taxDeductibility}</Text>
            <Text style={styles.advantageItem}>{t.leasingBenefits.noCapitalImmobilization}</Text>
            <Text style={styles.advantageItem}>{t.leasingBenefits.flexibility}</Text>
            <Text style={styles.advantageItem}>{t.leasingBenefits.artworkRenewal}</Text>
          </View>

          <Text style={[styles.label, { fontSize: 13, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }]}>
            {t.directPurchaseAdvantages}
          </Text>
          <View style={styles.advantagesList}>
            <Text style={styles.advantageItem}>{t.purchaseBenefits.immediateOwnership}</Text>
            <Text style={styles.advantageItem}>{t.purchaseBenefits.capitalGains}</Text>
            <Text style={styles.advantageItem}>{t.purchaseBenefits.depreciation}</Text>
            <Text style={styles.advantageItem}>{t.purchaseBenefits.noConstraints}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{t.footer}</Text>
        </View>
      </Page>
    </Document>
  )
}

export type { PDFTranslations } 