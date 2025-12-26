from typing import Dict, Any, List
from datetime import datetime
from database import db
from agents.budget import BudgetOptimizerAgent
from agents.creative import CreativeOptimizationAgent
from agents.roi_analyst import ROIAgent
from agents.consistency import ConsistencyAgent
from platforms import PlatformAPI

class OptimizationService:
    def __init__(self):
        self.budget_agent = BudgetOptimizerAgent()
        self.creative_agent = CreativeOptimizationAgent()
        self.roi_agent = ROIAgent()
        self.consistency_auditor = ConsistencyAgent()

    def optimize_campaign(self, campaign_id: str, platform: str = None) -> Dict[str, Any]:
        # 0. Fetch all campaigns for context
        campaigns = db.get_campaigns()
        target_campaign = next((c for c in campaigns if c["id"] == campaign_id), None)
        
        # 1. Fetch performance data for ALL campaigns to enable cross-campaign analysis
        all_campaign_data = []
        for c in campaigns:
            c_data = PlatformAPI.get_all_platforms_data(c["id"])
            all_campaign_data.append({"campaign": c, "data": c_data})

        # 2. Filter for the specific platform if requested (Global Node context)
        platform_insights = []
        if platform:
            # DIRECT READ from Platform Node: This ensures we see EVERYTHING actively running on this platform
            # regardless of the global campaign register state.
            campaigns_on_platform_raw = PlatformAPI.get_all_campaigns_in_platform(platform)
            
            campaigns_on_platform = []
            for c in campaigns_on_platform_raw:
                campaigns_on_platform.append({
                    "name": c["name"],
                    "roi": c["metrics"].get("roi", 0),
                    "conversions": c["metrics"].get("conversions", 0),
                    "spend": c["metrics"].get("cost", 0)
                })
        
            # Generate comparative insights
            sorted_by_roi = sorted(campaigns_on_platform, key=lambda x: x["roi"], reverse=True)
            
            if len(sorted_by_roi) > 1:
                leader = sorted_by_roi[0]
                laggard = sorted_by_roi[-1]
                platform_insights.append(f"Strong Signal: '{leader['name']}' is outperforming '{laggard['name']}' on {platform} by {round(leader['roi'] - laggard['roi'], 1)}x ROI.")
                
                # Investment suggestion
                if leader["roi"] > 2.0:
                    platform_insights.append(f"Recommendation: Shift budget from '{laggard['name']}' to '{leader['name']}' to maximize {platform} yield.")
            elif len(sorted_by_roi) == 1:
                 platform_insights.append(f"Node Isolation: '{sorted_by_roi[0]['name']}' is the sole active vector on {platform}. Expansion recommended.")
            elif len(sorted_by_roi) == 0:
                 platform_insights.append(f"Void Signal: No active campaigns detected on {platform}. Initialization required.")

        # 3. Standard Analysis for the specific target campaign (if needed for legacy support)

        return {
            "timestamp": datetime.now().isoformat(),
            "strategic_signals": platform_insights,
            "platform_context": platform,
            # Legacy fields for compatibility if needed, using the 'target' or first available
            "performance_analysis": {
                "summary": platform_insights[0] if platform_insights else "No active signal detected.",
                "winning_segment": "Cross-Campaign Analysis",
                "sentiment_leader": platform or "Global"
            }
        }

optimization_service = OptimizationService()
