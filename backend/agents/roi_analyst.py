from .base import BaseAgent
from typing import Dict, Any
import random

class ROIAgent(BaseAgent):
    """Performs deep financial forecasting and ROI projections using Gemini AI."""
    def __init__(self):
        super().__init__(name="ProfitMax", role="ROI Analyst")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        budget = input_data.get("budget", 1000)
        self.log_activity(f"Forecasting yield for budget {budget} using Gemini...")
        
        prompt = f"""
        Perform a financial forecast for a marketing campaign with a budget of ₹{budget}.
        Calculate potential ROI and conversion estimates based on current mid-market digital marketing benchmarks.
        """
        
        schema = """
        {
            "projected_roi": float (e.g., 3.4),
            "projected_revenue": float,
            "projected_conversions": int,
            "confidence_score": "Percentage string (e.g. '85%')"
        }
        """
        
        result = self.call_llm(prompt, schema)
        return result
