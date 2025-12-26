#!/usr/bin/env python3
"""
Setup script for AI Insights functionality
"""

import os
import sys
import subprocess

def check_requirements():
    """Check if all required packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'openai',
        'python-dotenv',
        'sqlite3'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing_packages)
    else:
        print("✅ All required packages are installed")

def check_env_file():
    """Check if .env file is properly configured"""
    env_path = os.path.join("backend", ".env")
    
    if not os.path.exists(env_path):
        print("❌ .env file not found")
        return False
    
    with open(env_path, 'r') as f:
        content = f.read()
    
    if "sk-proj-your-actual-openai-api-key-here" in content:
        print("⚠️  Please update your OpenAI API key in backend/.env")
        print("   Replace 'sk-proj-your-actual-openai-api-key-here' with your actual API key")
        return False
    
    print("✅ Environment file configured")
    return True

def test_ai_insights():
    """Test AI insights functionality"""
    try:
        # Change to backend directory
        os.chdir("backend")
        
        # Import and test
        from agents.insights import InsightsAgent
        from agents.strategy import StrategyAgent
        
        insights_agent = InsightsAgent()
        strategy_agent = StrategyAgent()
        
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
        
        print("Testing InsightsAgent...")
        cost_insights = insights_agent.generate_cost_reduction_insights(sample_data)
        print(f"✅ Cost insights generated: {type(cost_insights)}")
        
        optimization_insights = insights_agent.generate_optimization_insights(sample_data)
        print(f"✅ Optimization insights generated: {type(optimization_insights)}")
        
        print("Testing StrategyAgent...")
        strategy_insights = strategy_agent.run({"platforms_data": sample_data})
        print(f"✅ Strategy insights generated: {type(strategy_insights)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing AI insights: {e}")
        return False
    finally:
        os.chdir("..")

def main():
    print("🚀 Setting up AI Insights functionality...")
    print()
    
    # Check requirements
    print("1. Checking Python packages...")
    check_requirements()
    print()
    
    # Check environment
    print("2. Checking environment configuration...")
    env_ok = check_env_file()
    print()
    
    # Test functionality
    print("3. Testing AI insights...")
    if env_ok:
        test_ok = test_ai_insights()
    else:
        print("⚠️  Skipping tests due to missing API key")
        test_ok = False
    print()
    
    # Summary
    print("📋 Setup Summary:")
    print("✅ Python packages: Ready")
    print(f"{'✅' if env_ok else '⚠️ '} Environment: {'Ready' if env_ok else 'Needs API key'}")
    print(f"{'✅' if test_ok else '⚠️ '} AI Insights: {'Working' if test_ok else 'Needs API key'}")
    print()
    
    if not env_ok:
        print("🔑 Next steps:")
        print("1. Get your OpenAI API key from https://platform.openai.com/api-keys")
        print("2. Update backend/.env with your actual API key")
        print("3. Run this script again to test functionality")
    else:
        print("🎉 AI Insights setup complete!")
        print("You can now start the backend server with: cd backend && python main.py")

if __name__ == "__main__":
    main()