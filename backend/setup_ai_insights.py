#!/usr/bin/env python3
"""
AI Insights Setup Script
This script initializes the AI insights functionality for the marketing campaign platform.
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if all required environment variables are set"""
    load_dotenv()
    
    required_vars = ['OPENAI_API_KEY', 'OPENAI_MODEL']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"Missing environment variables: {', '.join(missing_vars)}")
        print("Please update your .env file with the required values.")
        return False
    
    print("Environment variables configured correctly")
    return True

def test_ai_connection():
    """Test connection to OpenAI API"""
    try:
        from openai import OpenAI
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "sk-proj-your-actual-key-here":
            print("Please set a valid OpenAI API key in your .env file")
            return False
        
        client = OpenAI(api_key=api_key)
        
        # Test with a simple completion
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": "Test connection"}],
            max_tokens=10
        )
        
        print("OpenAI API connection successful")
        return True
        
    except Exception as e:
        print(f"OpenAI API connection failed: {e}")
        return False

def initialize_database():
    """Initialize the database"""
    try:
        from database import db
        print("Database initialized successfully")
        return True
    except Exception as e:
        print(f"Database initialization failed: {e}")
        return False

def test_insights_agent():
    """Test the insights agent functionality"""
    try:
        from agents.insights import InsightsAgent
        
        insights_agent = InsightsAgent()
        
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
        
        cost_insights = insights_agent.generate_cost_reduction_insights(sample_data)
        optimization_insights = insights_agent.generate_optimization_insights(sample_data)
        
        print("AI Insights Agent working correctly")
        print(f"   - Cost insights generated: {bool(cost_insights)}")
        print(f"   - Optimization insights generated: {bool(optimization_insights)}")
        return True
        
    except Exception as e:
        print(f"Insights agent test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("Setting up AI Insights for Marketing Campaign Platform...")
    print("=" * 60)
    
    success = True
    
    # Check environment
    if not check_environment():
        success = False
    
    # Test AI connection
    if not test_ai_connection():
        success = False
    
    # Initialize database
    if not initialize_database():
        success = False
    
    # Test insights agent
    if not test_insights_agent():
        success = False
    
    print("=" * 60)
    
    if success:
        print("Setup completed successfully!")
        print("\nNext steps:")
        print("1. Run the main application: python main.py")
        print("2. Access the API at: http://localhost:8000")
        print("3. Test insights endpoint: http://localhost:8000/api/insights/test")
    else:
        print("Setup failed. Please fix the issues above and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()