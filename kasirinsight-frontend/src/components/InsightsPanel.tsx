import React, { useMemo } from "react";
import { generateInsights } from "../lib/insightEngine";
import { InsightCard } from "./InsightCard";

export const InsightsPanel = ({
  reportList,
  productList,
  topSelling,
  mostProfitable,
  deadStock,
  totalRevenue,
}: any) => {

  const insights = useMemo(() => {
    return generateInsights({
      reportList,
      productList,
      topSelling,
      mostProfitable,
      deadStock,
      totalRevenue,
    });
  }, [reportList, productList, topSelling, mostProfitable, deadStock, totalRevenue]);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#dae2fd]">Smart Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} />
        ))}
      </div>
    </div>
  );
};