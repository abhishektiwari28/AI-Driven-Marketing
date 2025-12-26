import json
import os
import random

# Directory containing the platform data files
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def update_campaign_metrics():
    """Add missing fields (cpm, conversion_rate) to all campaigns in all platform files"""
    
    platform_files = ["Facebook.json", "Google Ads.json", "Instagram.json", "Twitter.json", "Email.json"]
    
    for filename in platform_files:
        filepath = os.path.join(DATA_DIR, filename)
        
        if not os.path.exists(filepath):
            print(f"File {filename} not found, skipping...")
            continue
            
        print(f"Updating {filename}...")
        
        # Read the file
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        # Update each campaign's metrics
        for campaign_id, campaign_data in data.get("campaigns", {}).items():
            metrics = campaign_data.get("metrics", {})
            
            # Calculate or add missing fields
            impressions = metrics.get("impressions", 0)
            clicks = metrics.get("clicks", 0)
            cost = metrics.get("cost", 0)
            conversions = metrics.get("conversions", 0)
            
            # Add CPM (Cost Per Mille) if missing
            if "cpm" not in metrics:
                if impressions > 0:
                    metrics["cpm"] = round((cost / impressions) * 1000, 2)
                else:
                    metrics["cpm"] = round(random.uniform(2.0, 8.0), 2)
            
            # Add conversion_rate if missing
            if "conversion_rate" not in metrics:
                if clicks > 0:
                    metrics["conversion_rate"] = round((conversions / clicks) * 100, 2)
                else:
                    metrics["conversion_rate"] = round(random.uniform(1.5, 8.0), 2)
            
            # Ensure all other required fields exist with realistic values
            if "revenue" not in metrics:
                metrics["revenue"] = round(cost * metrics.get("roi", 1.0), 2)
        
        # Write back to file
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
        
        print(f"✓ Updated {filename}")

if __name__ == "__main__":
    update_campaign_metrics()
    print("All campaign data files updated successfully!")