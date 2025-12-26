from typing import Dict, Any, List
from agents.orchestrator import CampaignOrchestratorAgent
from database import db
from platforms import PlatformAPI

class CampaignService:
    def __init__(self):
        self.orchestrator = CampaignOrchestratorAgent()
        self.ensure_campaigns_synced()

    def ensure_campaigns_synced(self):
        """Ensures that campaigns found in platform JSON files exist in the SQLite DB."""
        print("Syncing File System with Database...")
        file_campaigns = PlatformAPI.get_all_campaign_metadata()
        db_campaigns = db.get_campaigns()
        db_ids = {c["id"] for c in db_campaigns}
        
        for fc in file_campaigns:
            if fc["id"] not in db_ids:
                print(f"Restoring orphaned campaign: {fc['name']} ({fc['id']})")
                # Create a minimal valid campaign entry for the DB
                restored_campaign = {
                    "id": fc["id"],
                    "name": fc["name"],
                    "status": "Active",
                    "budget": 50000, # Default assumption
                    "spent": 0, # Default to 0 instead of random
                    "objective": "Sales",
                    "platforms": fc["platforms"],
                    "strategy": {"strategy": "Restored from platform data", "tactics": []},
                    "recommendation": {},
                    "roi_forecast": {"projected_roi": 0, "confidence": "Low"},
                    "timeline": {"duration_days": 30, "start_date": "2025-01-01"},
                    "broadcast_log": {"restored": True}
                }
                db.add_campaign(restored_campaign)

    def create_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        # Delegate orchestrating logic to the agent
        new_campaign = self.orchestrator.initialize_campaign(campaign_data)
        # Store in database
        db.add_campaign(new_campaign)
        return new_campaign

    def update_campaign(self, campaign_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Updates campaign details."""
        # Optional: Add validation logic here using agents if needed
        success = db.update_campaign(campaign_id, updates)
        if not success:
             return {"error": "Campaign not found"}
        
        # Return updated campaign
        campaigns = db.get_campaigns()
        return next((c for c in campaigns if c["id"] == campaign_id), {})

    def get_all_campaigns(self) -> List[Dict[str, Any]]:
        # Re-sync on read to ensure fresh state if files changed externally
        self.ensure_campaigns_synced()
        campaigns = db.get_campaigns()
        
        # Enrich campaigns with real platform data
        enriched_campaigns = []
        for campaign in campaigns:
            enriched_campaign = self.enrich_campaign_with_platform_data(campaign)
            enriched_campaigns.append(enriched_campaign)
        
        return enriched_campaigns

    def enrich_campaign_with_platform_data(self, campaign: Dict[str, Any]) -> Dict[str, Any]:
        """Enriches campaign with real data from platform files."""
        campaign_id = campaign["id"]
        platforms_data = PlatformAPI.get_all_platforms_data(campaign_id)
        
        if not platforms_data:
            return campaign
        
        # Aggregate forecast data from all platforms
        total_projected_conversions = 0
        projected_roi_sum = 0
        confidence_scores = []
        platform_count = 0
        
        # Aggregate schedule data
        duration_days = 0
        
        for platform_data in platforms_data:
            metrics = platform_data.get("metrics", {})
            forecast = metrics.get("forecast_data", {})
            schedule = metrics.get("schedule_data", {})
            
            if forecast:
                total_projected_conversions += forecast.get("projected_conversions", 0)
                projected_roi_sum += forecast.get("projected_roi", 0)
                confidence_scores.append(int(forecast.get("confidence_score", "0%").replace("%", "")))
                platform_count += 1
            
            if schedule and schedule.get("duration_days"):
                duration_days = max(duration_days, schedule.get("duration_days", 0))
        
        # Calculate aggregated forecast
        if platform_count > 0:
            avg_projected_roi = round(projected_roi_sum / platform_count, 1)
            avg_confidence = round(sum(confidence_scores) / len(confidence_scores)) if confidence_scores else 0
            
            campaign["roi_forecast"] = {
                "projected_roi": avg_projected_roi,
                "projected_conversions": total_projected_conversions,
                "confidence_score": f"{avg_confidence}%"
            }
        
        # Update timeline with real duration
        if duration_days > 0:
            if "timeline" not in campaign:
                campaign["timeline"] = {}
            campaign["timeline"]["duration_days"] = duration_days
        
        return campaign

    def update_status(self, campaign_id: str, action: str) -> Dict[str, Any]:
        campaigns = db.get_campaigns()
        campaign = next((c for c in campaigns if c["id"] == campaign_id), None)
        if not campaign:
            return {"error": "Campaign not found"}
        
        # Direct status mapping for immediate response
        status_map = {
            'Launch': 'Active',
            'Pause': 'Paused', 
            'Resume': 'Active'
        }
        new_status = status_map.get(action, campaign["status"])
        
        # Update in database
        db.update_campaign_status(campaign_id, new_status)
        
        return {
            "status": new_status,
            "message": f"Campaign {action.lower()}ed successfully"
        }

    def delete_campaign(self, campaign_id: str):
        # 1. Get campaign to know which platforms to clean up
        campaigns = db.get_campaigns()
        campaign = next((c for c in campaigns if c["id"] == campaign_id), None)
        
        if campaign:
            platforms = campaign.get("platforms", [])
            # Also check Email if it was added dynamically
            all_platforms = ["Instagram", "Facebook", "Twitter", "Google Ads", "Email"]
            
            # 2. Delete from platform files
            for p in all_platforms:
                PlatformAPI.delete_campaign_from_platform(campaign_id, p)
                
        # 3. Delete from DB
        return db.delete_campaign(campaign_id)

campaign_service = CampaignService()
