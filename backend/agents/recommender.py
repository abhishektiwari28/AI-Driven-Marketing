from .base import BaseAgent
from typing import Dict, Any, List
import random

class ChannelRecommenderAgent(BaseAgent):
    """Recommends the best platforms and budget splits using Gemini AI."""
    def __init__(self):
        super().__init__(name="Navigator", role="Channel Specialist")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        objective = input_data.get("objective", "Awareness")
        self.log_activity(f"Analyzing platform yield for {objective} using Gemini...")
        
        prompt = f"""
        Analyze marketing platform performance for the following goal: {objective}.
        Platforms available: Instagram, Facebook, Twitter, Google Ads, Email.
        
        Provide an optimal budget split (percentage) and a brief reasoning for this selection.
        """
        
        schema = """
        {
            "platform_split": {
                "PlatformName": percentage (float between 0 and 1)
            },
            "reasoning": "Brief explanation for this allocation"
        }
        """
        
        result = self.call_llm(prompt, schema)
        return result
