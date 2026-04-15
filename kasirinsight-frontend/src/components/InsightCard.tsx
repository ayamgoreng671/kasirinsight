import React from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";

export const InsightCard = ({ insight }: any) => {
  return (
    <div className="p-4 bg-[#0b1326] rounded-xl border border-[#3a4a46]/20">
      <p className="text-sm font-bold text-[#00f5d4]">
        {insight.title}
      </p>
      <p className="text-xs text-[#dae2fd]/60">
        {insight.description}
      </p>
      <p className="text-xs mt-2 text-[#00f5d4] font-bold">
        👉 {insight.action}
      </p>
    </div>
  );
};