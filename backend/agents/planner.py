from .base import BaseAgent
from typing import Dict, Any

class PlannerAgent(BaseAgent):
    """Defines campaign objectives, target audience, and high-level strategy using Gemini AI."""
    def __init__(self):
        super().__init__(name="Aurelius", role="Campaign Planner")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        objective = input_data.get("objective", "Awareness")
        budget = input_data.get("budget", 0)
        
        self.log_activity(f"Consulting Gemini for {objective} strategy...")
        
        prompt = f"""
        Act as an elite marketing strategist. Generate a high-level roadmap and milestones for a campaign.
        Objective: {objective}
        Budget: ₹{budget}
        
        The strategy should be data-driven and phased.
        """
        
        schema = """
        {
            "strategy": "A concise 1-2 sentence strategic overview",
            "milestones": ["List of 4 key milestones with descriptive names"],
            "priority": "Low | Medium | High based on budget and objective complexity"
        }
        """
        
        result = self.call_llm(prompt, schema)
        return result
