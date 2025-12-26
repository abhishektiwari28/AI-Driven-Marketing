from .base import BaseAgent
from typing import Dict, Any, List
import json

class InsightsAgent(BaseAgent):
    """Generates detailed cost reduction and results optimization insights based on campaign data."""
    def __init__(self):
        super().__init__(name="InsightEngine", role="Performance Analyst")

    def run(self, input_data: Any) -> Dict[str, Any]:
        """Main entry point for the insights agent"""
        if not input_data:
            return {"error": "No input data provided"}
        
        # Generate both cost reduction and optimization insights
        cost_insights = self.generate_cost_reduction_insights(input_data)
        optimization_insights = self.generate_optimization_insights(input_data)
        
        return {
            "cost_insights": cost_insights,
            "optimization_insights": optimization_insights,
            "status": "completed"
        }

    def generate_cost_reduction_insights(self, platforms_data: List[Dict]) -> Dict[str, Any]:
        """Generate specific cost reduction recommendations"""
        analysis = self._analyze_cost_efficiency(platforms_data)
        
        prompt = f"""
        Based on this cost efficiency analysis:
        {json.dumps(analysis, indent=2)}
        
        Generate specific cost reduction recommendations:
        1. Identify the most expensive underperforming segments
        2. Calculate potential savings
        3. Suggest specific actions to reduce costs
        4. Provide timeline for implementation
        
        Focus on:
        - High CPC with low conversion rates
        - Platforms with ROI below 1.5x
        - Audience segments with poor engagement
        - Budget waste identification
        """
        
        schema = """
        {
            "total_waste_identified": "Amount in rupees",
            "primary_cost_driver": "Main source of inefficient spend",
            "recommended_actions": [
                {
                    "action": "Specific action to take",
                    "platform": "Platform name",
                    "potential_savings": "Amount in rupees",
                    "timeline": "Implementation timeframe"
                }
            ],
            "quick_wins": ["List of immediate actions"],
            "projected_monthly_savings": "Total monthly savings estimate"
        }
        """
        
        result = self.call_llm(prompt, schema)
        
        if isinstance(result, dict) and "error" in result:
            return self._fallback_cost_insights(analysis)
        
        return result

    def generate_optimization_insights(self, platforms_data: List[Dict]) -> Dict[str, Any]:
        """Generate specific results optimization recommendations"""
        analysis = self._analyze_growth_opportunities(platforms_data)
        
        prompt = f"""
        Based on this growth opportunity analysis:
        {json.dumps(analysis, indent=2)}
        
        Generate specific results optimization recommendations:
        1. Identify top-performing segments to scale
        2. Calculate potential revenue increase
        3. Suggest specific scaling strategies
        4. Provide resource requirements
        
        Focus on:
        - High ROI platforms/campaigns
        - Audience segments with strong engagement
        - Underutilized high-performing channels
        - Scaling opportunities
        """
        
        schema = """
        {
            "total_opportunity_value": "Potential additional revenue",
            "primary_growth_driver": "Main source of growth potential",
            "scaling_recommendations": [
                {
                    "action": "Specific scaling action",
                    "platform": "Platform name",
                    "additional_budget_needed": "Amount in rupees",
                    "projected_revenue_increase": "Expected revenue boost",
                    "timeline": "Implementation timeframe"
                }
            ],
            "quick_wins": ["List of immediate optimizations"],
            "projected_monthly_uplift": "Total monthly revenue increase estimate"
        }
        """
        
        result = self.call_llm(prompt, schema)
        
        if isinstance(result, dict) and "error" in result:
            return self._fallback_optimization_insights(analysis)
        
        return result

    def _analyze_cost_efficiency(self, platforms_data: List[Dict]) -> Dict[str, Any]:
        """Analyze cost efficiency across platforms"""
        if not platforms_data:
            return {"error": "No data available"}
        
        total_spend = 0
        total_conversions = 0
        platform_efficiency = []
        
        for platform in platforms_data:
            metrics = platform.get("metrics", {})
            platform_name = platform.get("platform", "Unknown")
            
            cost = metrics.get("cost", 0)
            conversions = metrics.get("conversions", 0)
            cpc = metrics.get("cpc", 0)
            roi = metrics.get("roi", 0)
            ctr = metrics.get("ctr", 0)
            
            total_spend += cost
            total_conversions += conversions
            
            # Calculate efficiency metrics
            cost_per_conversion = cost / conversions if conversions > 0 else float('inf')
            efficiency_score = (roi * ctr) / cpc if cpc > 0 else 0
            
            platform_efficiency.append({
                "platform": platform_name,
                "cost": cost,
                "conversions": conversions,
                "cost_per_conversion": cost_per_conversion,
                "efficiency_score": efficiency_score,
                "roi": roi,
                "cpc": cpc,
                "ctr": ctr,
                "is_underperforming": roi < 1.5 or ctr < 1.0
            })
        
        # Sort by efficiency
        platform_efficiency.sort(key=lambda x: x["efficiency_score"], reverse=True)
        
        return {
            "total_spend": total_spend,
            "total_conversions": total_conversions,
            "avg_cost_per_conversion": total_spend / total_conversions if total_conversions > 0 else 0,
            "platform_efficiency": platform_efficiency,
            "underperforming_platforms": [p for p in platform_efficiency if p["is_underperforming"]],
            "waste_estimate": sum(p["cost"] for p in platform_efficiency if p["is_underperforming"])
        }

    def _analyze_growth_opportunities(self, platforms_data: List[Dict]) -> Dict[str, Any]:
        """Analyze growth and scaling opportunities"""
        if not platforms_data:
            return {"error": "No data available"}
        
        total_revenue = 0
        platform_opportunities = []
        
        for platform in platforms_data:
            metrics = platform.get("metrics", {})
            platform_name = platform.get("platform", "Unknown")
            
            cost = metrics.get("cost", 0)
            roi = metrics.get("roi", 0)
            ctr = metrics.get("ctr", 0)
            conversions = metrics.get("conversions", 0)
            
            revenue = cost * roi
            total_revenue += revenue
            
            # Calculate growth potential
            growth_score = roi * ctr * (conversions / 100)  # Weighted growth score
            scaling_potential = "High" if roi > 2.0 and ctr > 2.0 else "Medium" if roi > 1.5 else "Low"
            
            platform_opportunities.append({
                "platform": platform_name,
                "current_revenue": revenue,
                "roi": roi,
                "ctr": ctr,
                "conversions": conversions,
                "growth_score": growth_score,
                "scaling_potential": scaling_potential,
                "is_high_performer": roi > 2.0 and ctr > 1.5
            })
        
        # Sort by growth potential
        platform_opportunities.sort(key=lambda x: x["growth_score"], reverse=True)
        
        return {
            "total_revenue": total_revenue,
            "platform_opportunities": platform_opportunities,
            "high_performers": [p for p in platform_opportunities if p["is_high_performer"]],
            "scaling_candidates": [p for p in platform_opportunities if p["scaling_potential"] == "High"],
            "revenue_opportunity": sum(p["current_revenue"] * 0.4 for p in platform_opportunities if p["is_high_performer"])
        }

    def _fallback_cost_insights(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback cost reduction insights when API fails"""
        waste_estimate = analysis.get("waste_estimate", 0)
        underperforming = analysis.get("underperforming_platforms", [])
        
        return {
            "total_waste_identified": f"₹{waste_estimate:.0f}",
            "primary_cost_driver": underperforming[0]["platform"] if underperforming else "High CPC segments",
            "recommended_actions": [
                {
                    "action": f"Pause underperforming {underperforming[0]['platform']} campaigns" if underperforming else "Optimize targeting",
                    "platform": underperforming[0]["platform"] if underperforming else "Multi-platform",
                    "potential_savings": f"₹{waste_estimate * 0.6:.0f}",
                    "timeline": "Immediate (24-48 hours)"
                },
                {
                    "action": "Implement automated bid adjustments",
                    "platform": "All platforms",
                    "potential_savings": f"₹{waste_estimate * 0.3:.0f}",
                    "timeline": "1-2 weeks"
                }
            ],
            "quick_wins": [
                "Pause ads with CPC > ₹5 and CTR < 1%",
                "Reduce budget on ROI < 1.5x campaigns by 50%",
                "Enable frequency capping to reduce ad fatigue"
            ],
            "projected_monthly_savings": f"₹{waste_estimate * 4:.0f}"
        }

    def _fallback_optimization_insights(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback optimization insights when API fails"""
        revenue_opportunity = analysis.get("revenue_opportunity", 0)
        high_performers = analysis.get("high_performers", [])
        
        return {
            "total_opportunity_value": f"₹{revenue_opportunity:.0f}",
            "primary_growth_driver": high_performers[0]["platform"] if high_performers else "Video content campaigns",
            "scaling_recommendations": [
                {
                    "action": f"Increase {high_performers[0]['platform']} budget by 50%" if high_performers else "Scale video campaigns",
                    "platform": high_performers[0]["platform"] if high_performers else "Instagram",
                    "additional_budget_needed": f"₹{revenue_opportunity * 0.3:.0f}",
                    "projected_revenue_increase": f"₹{revenue_opportunity * 0.6:.0f}",
                    "timeline": "1-2 weeks"
                },
                {
                    "action": "Expand lookalike audiences for top performers",
                    "platform": "Facebook & Instagram",
                    "additional_budget_needed": f"₹{revenue_opportunity * 0.2:.0f}",
                    "projected_revenue_increase": f"₹{revenue_opportunity * 0.4:.0f}",
                    "timeline": "2-3 weeks"
                }
            ],
            "quick_wins": [
                "Increase daily budgets on ROI > 3x campaigns",
                "Duplicate winning ad sets with broader targeting",
                "Enable automatic placements for top performers"
            ],
            "projected_monthly_uplift": f"₹{revenue_opportunity * 3:.0f}"
        }