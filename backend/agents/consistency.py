from .base import BaseAgent
from typing import Dict, Any, List
import random

class ConsistencyAgent(BaseAgent):
    """Audits cross-platform content for brand alignment using Gemini AI."""
    def __init__(self):
        super().__init__(name="Guardian", role="Brand Auditor")

    def run(self, platform_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        self.log_activity("Analyzing cross-channel content for brand alignment using Gemini...")
        
        # Flatten platform data for the prompt
        summary = []
        for p in platform_data:
            summary.append(f"Platform: {p['platform']}, Sentiment: {p['metrics']['sentiment_score']}, Depth: {p['audience_insight']['engagement_depth']}")
        
        prompt = f"""
        Act as a Brand Guardian. Analyze the following campaign performance signals across different platforms
        and judge the consistency of the brand voice and messaging.
        
        Signals: {', '.join(summary)}
        """
        
        schema = """
        {
            "consistency_score": float (0.0 to 1.0),
            "status": "Green | Amber | Red",
            "audit_note": "A 1-sentence analytical observation regarding brand synchronization."
        }
        """
        
        result = self.call_llm(prompt, schema)
        return result
