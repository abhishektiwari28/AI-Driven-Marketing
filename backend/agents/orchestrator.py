from .base import BaseAgent
from .planner import PlannerAgent
from .recommender import ChannelRecommenderAgent
from .roi_analyst import ROIAgent
from .timeline import TimelineAgent
from .consistency import ConsistencyAgent
from .broadcast import ExecutionAgent
from typing import Dict, Any, List
import uuid
import os
import json
from datetime import datetime


class CampaignOrchestratorAgent(BaseAgent):
    """
    Master Orchestrator that manages the specialized agent suite.
    Ensures all logical operations of campaign lifecycle are agent-driven.
    """
    def __init__(self):
        super().__init__(name="Metatron", role="Global Orchestrator")
        # Initialize the specialized suite
        self.planner = PlannerAgent()
        self.recommender = ChannelRecommenderAgent()
        self.roi_analyst = ROIAgent()
        self.timeline_manager = TimelineAgent()
        self.consistency_auditor = ConsistencyAgent()
        self.execution_lead = ExecutionAgent()

    def initialize_campaign(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Orchestrates multiple agents to build a complete campaign."""
        self.log_activity(f"Initializing new campaign sequence: {data.get('name')}")
        
        name = data.get("name")
        objective = data.get("objective")
        budget = float(data.get("budget", 0))
        platforms = data.get("platforms", [])

        # 1. Plan
        plan = self.planner.run({"objective": objective, "budget": budget})
        
        # 2. Recommend
        recommendation = self.recommender.run({"objective": objective})
        
        # 3. Forecast ROI
        roi_forecast = self.roi_analyst.run({"budget": budget})
        
        # 4. Schedule
        schedule = self.timeline_manager.run({})
        
        # 5. Execute initial broadcast
        broadcast = self.execution_lead.run({"platforms": platforms})

        campaign_id = str(uuid.uuid4())

        from platforms import PlatformAPI
        import random

        # Register campaign on selected platforms
        for p in platforms:
            PlatformAPI.add_campaign_to_platform(campaign_id, name, p, budget, objective)
            
        # Randomly decide to add Email platform for extra coverage (User Request)
        if "Email" not in platforms and random.random() > 0.3: # 70% chance to add Email
            self.log_activity(f"AI Strategist decided to expand '{name}' to Email channel for holistic coverage.")
            platforms.append("Email")
            PlatformAPI.add_campaign_to_platform(campaign_id, name, "Email", budget, objective)
            
        # No longer using sim_campaign mapping files. 
        # Data is now persisted in platform-centric registries (e.g. data/Instagram.json)

        return {
            "id": campaign_id,
            "name": name,
            "status": "Draft",
            "budget": budget,
            "spent": 0,
            "objective": objective,
            "platforms": platforms,
            "strategy": plan,
            "recommendation": recommendation,
            "roi_forecast": roi_forecast,
            "timeline": schedule,
            "broadcast_log": broadcast,
            "created_at": datetime.now().isoformat()
        }

    def execute_action(self, campaign: Dict[str, Any], action: str) -> Dict[str, Any]:
        """
        Uses LLM to decide the outcome of a campaign lifecycle action.
        Actions: "Launch", "Pause", "Halt", "Activate", "Terminate"
        """
        self.log_activity(f"Evaluating action '{action}' for campaign {campaign.get('name')}...")
        
        current_status = campaign.get("status")
        
        prompt = f"""
        Act as a Campaign Lifecycle Manager. Given the current campaign state and a user-requested action,
        determine the new logical status and provide a brief AI signal (confirmation message).

        Campaign: {campaign.get('name')}
        Current Status: {current_status}
        Requested Action: {action}

        Valid Actions and Transitions:
        - "Launch", "Activate", or "Resume": Transition from 'Paused', 'Draft', or 'Suspended' to 'Active'.
        - "Pause" or "Halt": Transition from 'Active' to 'Paused'.
        - "Terminate": Transition to 'Deleted' (though the API usually handles deletion, the agent should confirm the logical shutdown).

        Provide a status that is one of: Active, Paused, Terminated.
        """

        schema = """
        {
            "new_status": "Active | Paused | Terminated",
            "ai_confirmation": "A professional 1-sentence confirmation of the state transition log.",
            "reasoning": "Brief explanation of why this transition is logical."
        }
        """

        result = self.call_llm(prompt, schema)
        return result

    def run(self, input_data: Any) -> Dict[str, Any]:
        # Generic run implementation for BaseAgent compatibility
        return {"message": "Orchestrator active. Use specific methods for complex tasks."}
