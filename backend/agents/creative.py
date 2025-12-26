from .base import BaseAgent
from typing import Dict, Any, List

class CreativeOptimizationAgent(BaseAgent):
    """Analyzes ad creatives (text/visuals) to recommend better performing variants."""
    def __init__(self):
        super().__init__(name="DaVinci", role="Creative Optimiser")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        platform = input_data.get("platform", "General")
        current_performance = input_data.get("performance", "Average")
        
        prompt = f"""
        Act as a Creative Director.
        Platform: {platform}
        Current Performance: {current_performance}
        
        Suggest one specific creative improvement (e.g., "Switch to UGC video", "Use brighter contrast").
        """
        
        suggestion = self.generate_text(prompt)
        
        return {
            "recommendation": suggestion,
            "expected_uplift": "15-20%",
            "action_type": "Creative Swap"
        }
