import json
import os
from typing import Dict, List, Any

# Adjust logic to find 'data' correctly relative to this file
# Assuming this file is in backend/ and data/ is in backend/data/
DATA_DIR = os.path.join(os.path.dirname(__file__), "data") 

class PlatformAPI:
    @staticmethod
    def _read_json(filename: str) -> Dict[str, Any]:
        path = os.path.join(DATA_DIR, filename)
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print(f"Error decoding JSON from {filename}. Returning empty dict.")
                return {}
        return {}

    @staticmethod
    def _write_json(filename: str, data: Dict[str, Any]):
        path = os.path.join(DATA_DIR, filename)
        with open(path, "w") as f:
            json.dump(data, f, indent=4)

    @staticmethod
    def _ensure_platform_file(platform: str):
        """Creates a platform file if it doesn't exist."""
        filename = f"{platform}.json"
        path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(path):
            print(f"Creating new platform registry: {filename}")
            PlatformAPI._write_json(filename, {"platform": platform, "campaigns": {}})

    @staticmethod
    def get_platform_metrics(campaign_id: str, platform: str) -> Dict[str, Any]:
        filename = f"{platform}.json"
        data = PlatformAPI._read_json(filename)
        
        # Access by campaign_id (string)
        campaign_data = data.get("campaigns", {}).get(str(campaign_id), {})
        
        if not campaign_data:
             return {
                "impressions": 0, "clicks": 0, "conversions": 0, "cost": 0,
                "ctr": 0, "cpc": 0, "roi": 0, "sentiment_score": 0.5,
                "detailed_stats": {},
                "audience_insight": {"primary_segment": "Unknown", "engagement_depth": "Low"}
            }
            
        metrics = campaign_data.get("metrics", {})
        return metrics

    @staticmethod
    def get_all_platforms_data(campaign_id: str) -> List[Dict[str, Any]]:
        results = []
        # Scan all .json files in data dir to find where this campaign exists
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".json") and "sim_campaign" not in filename and "campaign_mapping" not in filename:
                platform_name = filename.replace(".json", "")
                data = PlatformAPI._read_json(filename)
                
                if str(campaign_id) in data.get("campaigns", {}):
                    metrics = PlatformAPI.get_platform_metrics(campaign_id, platform_name)
                    results.append({
                        "platform": platform_name,
                        "metrics": metrics,
                        "audience_insight": metrics.get("audience_insight", {})
                    })
        return results
    @staticmethod
    def get_all_campaigns_in_platform(platform: str) -> List[Dict[str, Any]]:
        """Returns all campaign data present in a specific platform file."""
        filename = f"{platform}.json"
        data = PlatformAPI._read_json(filename)
        
        results = []
        for c_id, c_data in data.get("campaigns", {}).items():
            results.append({
                "id": c_id,
                "name": c_data.get("name", "Unknown"),
                "metrics": c_data.get("metrics", {}),
                "platform": platform
            })
        return results

    @staticmethod
    def add_campaign_to_platform(campaign_id: str, campaign_name: str, platform: str, budget: float = 0, target_audience: str = "0"):
        PlatformAPI._ensure_platform_file(platform)
        filename = f"{platform}.json"
        data = PlatformAPI._read_json(filename)
        
        # Initialize with zero/empty values
        is_email = (platform.lower() == "email")
        
        # Generate Random Initial Data for "Realism"
        import random
        
        # Forecast Data
        forecast_data = {
            "projected_roi": round(random.uniform(1.5, 4.5), 1),
            "projected_conversions": random.randint(50, 500),
            "confidence_score": f"{random.randint(65, 95)}%"
        }
        schedule_data = {
            "duration_days": 30, # Default
            "next_run": "",
            "frequency": "Daily"
        }

        # Parse target audience slightly to ensure it's usable number if possible
        try:
            audience_num = int(target_audience)
        except:
            audience_num = 10000 # Fallback

        if is_email:
             metrics = {
                "impressions": random.randint(1000, 5000), 
                "clicks": random.randint(100, 800),
                "cost": round(random.uniform(100, 500), 2),
                "conversions": random.randint(10, 50),
                "ctr": round(random.uniform(1.5, 5.0), 2),
                "cpc": round(random.uniform(0.5, 2.0), 2),
                "cpm": round(random.uniform(50, 150), 2),
                "conversion_rate": round(random.uniform(8, 20), 2),
                "roi": round(random.uniform(1.2, 3.5), 2),
                "sentiment_score": round(random.uniform(0.6, 0.95), 2),
                "forecast_data": forecast_data,
                "schedule_data": schedule_data,
                "budget": budget,
                "target_audience": audience_num,
                "audience_insight": {
                    "primary_segment": random.choice(["Loyal", "New", "At-Risk", "High-Value"]),
                    "top_region": random.choice(["North America", "Europe", "Asia", "Global"]),
                    "engagement_depth": random.choice(["High", "Medium", "Low"])
                },
                "detailed_stats": {
                    "Open Rate": f"{random.randint(15, 35)}%",
                    "Click Rate": f"{random.randint(2, 8)}%"
                }
             }
        else:
            metrics = {
                "impressions": random.randint(5000, 20000),
                "clicks": random.randint(200, 1500),
                "cost": round(random.uniform(200, 1000), 2),
                "conversions": random.randint(20, 150),
                "ctr": round(random.uniform(0.8, 3.5), 2),
                "cpc": round(random.uniform(0.8, 2.5), 2),
                "cpm": round(random.uniform(20, 80), 2),
                "conversion_rate": round(random.uniform(5, 25), 2),
                "roi": round(random.uniform(1.5, 4.0), 2),
                "sentiment_score": round(random.uniform(0.4, 0.9), 2), 
                "forecast_data": forecast_data,
                "schedule_data": schedule_data,
                "budget": budget,
                "target_audience": audience_num,
                "audience_insight": {
                    "primary_segment": random.choice(["Tech Enthusiasts", "Fashionistas", "Gamers", "Professionals"]),
                    "engagement_depth": random.choice(["High", "Medium"])
                },
                "detailed_stats": {
                    "Ad 1": random.choice(["Winner", "Active", "Learning"]),
                    "Ad 2": "Testing"
                }
            }

        data["campaigns"][str(campaign_id)] = {
            "name": campaign_name,
            "metrics": metrics
        }
        
        PlatformAPI._write_json(filename, data)

    @staticmethod
    def get_platform_aggregate_stats(platform: str) -> Dict[str, Any]:
        """Aggregates metrics from ALL campaigns in the platform file."""
        filename = f"{platform}.json"
        data = PlatformAPI._read_json(filename)
        
        total_impressions = 0
        total_clicks = 0
        total_conversions = 0
        total_cost = 0
        roi_sum = 0
        cpm_sum = 0
        conversion_rate_sum = 0
        campaign_count = 0
        
        # For audience aggregation (simple majority or last seen)
        segments = []
        engagement_depths = []
        
        for c_id, c_data in data.get("campaigns", {}).items():
            m = c_data.get("metrics", {})
            total_impressions += m.get("impressions", 0)
            total_clicks += m.get("clicks", 0)
            total_conversions += m.get("conversions", 0)
            total_cost += m.get("cost", 0)
            roi_sum += m.get("roi", 0)
            cpm_sum += m.get("cpm", 0)
            conversion_rate_sum += m.get("conversion_rate", 0)
            campaign_count += 1
            
            if "audience_insight" in m:
                segments.append(m["audience_insight"].get("primary_segment"))
                engagement_depths.append(m["audience_insight"].get("engagement_depth"))

        avg_roi = round(roi_sum / campaign_count, 2) if campaign_count > 0 else 0
        avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        avg_cpc = (total_cost / total_clicks) if total_clicks > 0 else 0
        avg_cpm = round(cpm_sum / campaign_count, 2) if campaign_count > 0 else 0
        avg_conversion_rate = round(conversion_rate_sum / campaign_count, 2) if campaign_count > 0 else 0
        
        # Determine aggregate audience insight
        primary_segment = max(set(segments), key=segments.count) if segments else "General"
        engagement_depth = max(set(engagement_depths), key=engagement_depths.count) if engagement_depths else "Medium"

        return {
            "platform": platform,
            "metrics": {
                "impressions": total_impressions,
                "clicks": total_clicks,
                "conversions": total_conversions,
                "cost": total_cost,
                "roi": avg_roi,
                "sentiment_score": 0.85, 
                "ctr": round(avg_ctr, 2),
                "cpc": round(avg_cpc, 2),
                "cpm": avg_cpm,
                "conversion_rate": avg_conversion_rate
            },
            "audience_insight": {
                "primary_segment": primary_segment,
                "engagement_depth": engagement_depth
            },
            "detailed_stats": {
                "Active Nodes": campaign_count,
                "Optimization Status": "Live"
            }
        }

    @staticmethod
    def get_all_campaign_metadata() -> List[Dict[str, Any]]:
        """Scans all platform files and returns metadata for every found campaign."""
        platforms = ["Instagram", "Facebook", "Twitter", "Google Ads", "Email"]
        
        campaigns_map = {}
        
        for p in platforms:
            filename = f"{p}.json"
            if not os.path.exists(os.path.join(DATA_DIR, filename)):
                continue
                
            data = PlatformAPI._read_json(filename)
            for c_id, c_data in data.get("campaigns", {}).items():
                if c_id not in campaigns_map:
                    campaigns_map[c_id] = {
                        "id": c_id,
                        "name": c_data["name"],
                        "platforms": [],
                        "status": "Active" # Default to Active if found in file
                    }
                campaigns_map[c_id]["platforms"].append(p)
        
        return list(campaigns_map.values())

    @staticmethod
    def delete_campaign_from_platform(campaign_id: str, platform: str):
        """Removes a campaign from a specific platform file."""
        filename = f"{platform}.json"
        data = PlatformAPI._read_json(filename)
        
        if str(campaign_id) in data.get("campaigns", {}):
            del data["campaigns"][str(campaign_id)]
            PlatformAPI._write_json(filename, data)
            print(f"Removed campaign {campaign_id} from {platform}")

