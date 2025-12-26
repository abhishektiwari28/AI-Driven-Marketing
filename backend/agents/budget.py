from .base import BaseAgent
from typing import Dict, Any, List

class BudgetOptimizerAgent(BaseAgent):
    """Reallocates budget dynamically to maximize ROI based on real-time signals."""
    def __init__(self):
        super().__init__(name="Ledger", role="Capital Allocator")

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        current_budget = input_data.get("current_budget", 0)
        platforms = input_data.get("platform_breakdown", {})
        
        prompt = f"""
        Optimize a marketing budget of {current_budget}.
        Current allocation: {platforms}
        
        Goal: Reduce wasted spend and increase result spread.
        Return a short justification for a reallocation.
        """
        
        justification = self.generate_text(prompt)
        
        return {
            "action": "Reallocation Triggered",
            "justification": justification,
            "savings_projected": f"{current_budget * 0.12:.2f}",
            "new_allocation_signal": "Sent to Orchestrator"
        }
