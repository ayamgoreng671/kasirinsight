// insightEngine.ts

export type InsightType = 'warning' | 'opportunity' | 'risk' | 'info';

export type Insight = {
  type: InsightType;
  title: string;
  description: string;
  action: string;
};

export function generateInsights({
  reportList,
  productList,
  topSelling,
  mostProfitable,
  deadStock,
  totalRevenue,
}: {
  reportList: any[];
  productList: any[];
  topSelling: any[];
  mostProfitable: any[];
  deadStock: any[];
  totalRevenue: number;
}): Insight[] {
  const insights: Insight[] = [];

  // 1. Revenue Drop Detection
  if (reportList.length >= 2) {
    const current = reportList[0].revenue;
    const previous = reportList[1].revenue;

    const change = (current - previous) / (previous || 1);

    if (change < -0.1) {
      insights.push({
        type: 'warning',
        title: 'Revenue Decreasing',
        description: `Revenue dropped ${(Math.abs(change) * 100).toFixed(1)}% compared to previous period.`,
        action: 'Check stock availability or run promotions on top-selling products.',
      });
    }
  }

  // 2. Revenue Concentration Risk
  if (topSelling.length > 0 && totalRevenue > 0) {
    const top = topSelling[0];
    if (top.revenue / totalRevenue > 0.5) {
      insights.push({
        type: 'risk',
        title: 'Revenue Concentration Risk',
        description: `${top.name} contributes more than 50% of total revenue.`,
        action: 'Promote other products to diversify revenue streams.',
      });
    }
  }

  // 3. Dead Stock
  if (deadStock.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Dead Stock Detected',
      description: `${deadStock.length} products have no sales in this period.`,
      action: 'Consider discounts, bundling, or removing these items.',
    });
  }

  // 4. High Profit Opportunity
  if (mostProfitable.length > 0) {
    const best = mostProfitable[0];
    insights.push({
      type: 'opportunity',
      title: 'High Profit Product',
      description: `${best.name} generates the highest profit.`,
      action: 'Promote this product more aggressively.',
    });
  }

  // 5. Low Margin Warning
  const lowMargin = productList.filter(p => p.revenue > 0 && (p.profit / p.revenue) < 0.1);
  if (lowMargin.length > 0) {
    insights.push({
      type: 'risk',
      title: 'Low Margin Products',
      description: `${lowMargin.length} products have profit margin below 10%.`,
      action: 'Consider increasing price or reducing cost.',
    });
  }

  return insights;
}