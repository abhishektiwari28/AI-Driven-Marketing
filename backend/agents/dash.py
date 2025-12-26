from .base import BaseAgent
from typing import Dict, Any, List

class PerformanceNexusAgent(BaseAgent):
    """Aggregates cross-campaign data to provide high-level dashboard insights."""
    def __init__(self):
        super().__init__(name="Nexus", role="Performance Analyst")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        total_spend = input_data.get("total_spend", 0)
        total_revenue = input_data.get("total_revenue", 0)
        
        roi = (total_revenue / total_spend) if total_spend > 0 else 0
        
        if roi > 3.0:
            insight = "Exceptional efficiency detected; scale budget on high-performing nodes."
            trend = "Surge"
        elif roi > 1.5:
            insight = "Healthy growth trajectory confirmed across active channels."
            trend = "Positive Yield Trajectory"
        elif roi > 0:
            insight = "Optimization required to improve yield ratios above baseline."
            trend = "Stabilizing"
        else:
            insight = "Awaiting initial performance data signal."
            trend = "Initializing"
        
        return {
            "global_insight": insight,
            "health_score": min(98, int(roi * 25)) if roi > 0 else 50,
            "trend_analysis": trend
        }
