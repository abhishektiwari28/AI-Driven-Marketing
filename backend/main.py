# --- SSL Patch for Dev/Constrained Environments ---
import requests
import urllib3
import os
import certifi
from requests.adapters import HTTPAdapter

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Set SSL Certificate paths for gRPC and Requests
os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['GRPC_DEFAULT_SSL_ROOTS_FILE_PATH'] = certifi.where()

# Patch requests to disable verify globally (fallback)
old_request = requests.Session.request
def new_request(self, method, url, *args, **kwargs):
    kwargs['verify'] = False
    return old_request(self, method, url, *args, **kwargs)
requests.Session.request = new_request
# --------------------------------------------------

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import uuid

import json
from platforms import PlatformAPI
from database import db
from agents import (
    ConsistencyAgent,
    AuthAgent,
    CreativeOptimizationAgent,
    BudgetOptimizerAgent,
    AudienceAgent,
    ROIAgent,
    InsightsAgent
)

app = FastAPI(title="AI-Driven Marketing Campaign API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize Required Agents for Routes ---
consistency_auditor = ConsistencyAgent()
auth_agent = AuthAgent()
creative_agent = CreativeOptimizationAgent()
budget_agent = BudgetOptimizerAgent()
audience_agent = AudienceAgent()
roi_analyst = ROIAgent()
insights_agent = InsightsAgent()


# --- Endpoint Models ---
class LoginRequest(BaseModel):
    email: str
    password: str


# --- Data Models ---
class CampaignCreate(BaseModel):
    name: str
    budget: float
    objective: str # e.g., "Sales", "Leads", "Traffic"
    platforms: List[str]

# --- Endpoints ---

from services.campaign_service import campaign_service
from services.dashboard_service import dashboard_service

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "AI Marketing Platform API is running", "status": "Ready", "ai_status": "Online"}

@app.get("/api/campaigns")
def get_campaigns():
    return campaign_service.get_all_campaigns()

@app.post("/api/campaigns")
def create_campaign(campaign: CampaignCreate):
    try:
        return campaign_service.create_campaign(campaign.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaigns/{campaign_id}/metrics")
def get_campaign_metrics(campaign_id: str):
    # 1. Fetch real simulated data from files via PlatformAPI
    raw_data = PlatformAPI.get_all_platforms_data(campaign_id)
    
    # 2. Use Brand Auditor (Consistency Agent) to analyze alignment
    analysis = consistency_auditor.run(raw_data)
    
    # 3. Log metrics to SQLite for persistence
    for platform_metrics in raw_data:
        db.log_metrics(campaign_id, platform_metrics["platform"], platform_metrics["metrics"])
    
    return {
        "raw_metrics": raw_data,
        "ai_analysis": analysis
    }

from services.optimization_service import optimization_service

@app.get("/api/platform-data/{platform}")
def get_platform_data(platform: str):
    try:
        import json
        import os
        
        # Map platform names to file names
        platform_files = {
            "Facebook": "Facebook.json",
            "Instagram": "Instagram.json", 
            "Google Ads": "Google Ads.json",
            "Email": "Email.json",
            "Twitter": "Twitter.json",
            "Social Media": "Social Media.json"
        }
        
        filename = platform_files.get(platform)
        if not filename:
            raise HTTPException(status_code=404, detail=f"Platform {platform} not found")
        
        file_path = os.path.join("data", filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Data file for {platform} not found")
        
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/platforms/{platform}/stats")
def get_platform_stats(platform: str):
    """Get aggregated stats for a specific platform from all campaigns"""
    try:
        return PlatformAPI.get_platform_aggregate_stats(platform)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/campaigns/{campaign_id}/optimize")
def optimize_campaign(campaign_id: str, platform: Optional[str] = None):
    try:
        from typing import Optional
        from fastapi import Query
        # platform = request.query_params.get('platform') # In FastAPI we add it to signature
        return optimization_service.optimize_campaign(campaign_id, platform=platform)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/insights/detailed")
async def get_detailed_insights(campaign_id: Optional[str] = None):
    """Get detailed cost reduction and optimization insights"""
    try:
        # Fetch platform data
        if campaign_id and campaign_id != 'all':
            platforms_data = PlatformAPI.get_all_platforms_data(campaign_id)
        else:
            # Aggregate data from all campaigns
            campaigns = db.get_campaigns()
            all_data = []
            for c in campaigns:
                all_data.extend(PlatformAPI.get_all_platforms_data(c["id"]))
            platforms_data = all_data
        
        if not platforms_data:
            return {"error": "No campaign data available"}
        
        # Generate detailed insights
        cost_insights = insights_agent.generate_cost_reduction_insights(platforms_data)
        optimization_insights = insights_agent.generate_optimization_insights(platforms_data)
        
        return {
            "cost_reduction": cost_insights,
            "results_optimization": optimization_insights,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights")
async def get_active_insights(campaign_id: Optional[str] = None):
    """Get active AI insights for dashboard display"""
    try:
        # Fetch from DB for historical, but also generate fresh ones
        db_insights = db.get_insights(campaign_id)
        if not db_insights:
            # Generate fresh insights if none exist
            fresh_insights = dashboard_service.get_ai_insights(campaign_id)
            return fresh_insights
        
        # Format DB insights for frontend compatibility
        formatted_insights = []
        for insight in db_insights:
            formatted_insights.append({
                "decision_type": insight.get("decision_type"),
                "data": insight.get("data", {}),
                "timestamp": insight.get("timestamp")
            })
        
        return formatted_insights
    except Exception as e:
        # Fallback to fresh generation on any error
        return dashboard_service.get_ai_insights(campaign_id)


@app.get("/api/insights/test")
async def test_insights():
    """Test endpoint to verify AI insights functionality"""
    try:
        # Test with sample data
        sample_data = [{
            "platform": "Instagram",
            "metrics": {
                "cost": 5000,
                "roi": 2.5,
                "cpc": 2.5,
                "ctr": 3.2,
                "conversions": 125,
                "impressions": 50000,
                "clicks": 1600
            }
        }]
        
        # Test insights generation
        cost_insights = insights_agent.generate_cost_reduction_insights(sample_data)
        optimization_insights = insights_agent.generate_optimization_insights(sample_data)
        
        return {
            "status": "success",
            "cost_insights": cost_insights,
            "optimization_insights": optimization_insights,
            "message": "AI insights functionality is working"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "fallback": "Using simulated insights"
        }

@app.post("/api/campaigns/{campaign_id}/status")
def update_campaign_status(campaign_id: str, status_update: Dict[str, str]):
    action = status_update.get("action") or status_update.get("status")
    if not action:
        raise HTTPException(status_code=400, detail="Action or status is required")
    
    result = campaign_service.update_status(campaign_id, action)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.put("/api/campaigns/{campaign_id}")
def update_campaign(campaign_id: str, updates: Dict[str, Any]):
    result = campaign_service.update_campaign(campaign_id, updates)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.delete("/api/campaigns/{campaign_id}")
def delete_campaign(campaign_id: str):
    if not campaign_service.delete_campaign(campaign_id):
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted successfully"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(campaign_id: Optional[str] = None):
    return dashboard_service.get_stats(campaign_id)

@app.get("/api/dashboard/trends")
async def get_dashboard_trends(campaign_id: Optional[str] = None, days: int = 30):
    return dashboard_service.get_performance_trends(campaign_id, days)

@app.get("/api/dashboard/revenue-trajectory")
async def get_dashboard_revenue_trajectory(campaign_id: Optional[str] = None, days: int = 30):
    return dashboard_service.get_revenue_trajectory(campaign_id, days)

@app.get("/api/platforms/all/stats")
def get_all_platforms_stats():
    """Get aggregated stats for all platforms"""
    try:
        platforms = ["Instagram", "Facebook", "Twitter", "Google Ads", "Email"]
        all_stats = []
        
        for platform in platforms:
            try:
                stats = PlatformAPI.get_platform_aggregate_stats(platform)
                print(f"Stats for {platform}: {stats}")
                all_stats.append(stats)
            except Exception as e:
                print(f"Error getting stats for {platform}: {e}")
                continue
        
        print(f"Final all_stats: {all_stats}")
        return all_stats
    except Exception as e:
        print(f"Error in get_all_platforms_stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/auth/login")
def login(request: LoginRequest):
    return auth_agent.run({"email": request.email})

@app.get("/api/agents/audience/{platform}")
def get_audience_insight(platform: str):
    return audience_agent.run({"platform": platform})

@app.post("/api/agents/creative/optimize")
def optimize_creative(data: Dict[str, Any]):
    return creative_agent.run(data)

@app.post("/api/agents/budget/optimize")
def optimize_budget(data: Dict[str, Any]):
    return budget_agent.run(data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
