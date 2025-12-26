# AI Insights Functionality

## Overview
The AI Insights system provides intelligent analysis and recommendations for marketing campaigns using OpenAI's GPT models. It consists of two main components:

### 1. InsightsAgent
- **Cost Reduction Insights**: Identifies underperforming segments and suggests budget optimizations
- **Results Optimization**: Finds high-performing segments and recommends scaling strategies

### 2. StrategyAgent  
- **Strategic Decisions**: Generates actionable recommendations based on cross-platform performance data
- **Real-time Analysis**: Provides continuous monitoring and tactical pivots

## Features

### Cost Reduction Analysis
- Identifies high CPC, low conversion segments
- Calculates potential savings
- Provides specific action items with timelines
- Tracks ROI efficiency across platforms

### Results Optimization
- Finds top-performing campaigns for scaling
- Calculates revenue increase potential
- Suggests budget reallocation strategies
- Identifies growth opportunities

### Strategic Decision Making
- Cross-platform performance analysis
- Data-driven budget recommendations
- Automated decision logging
- Real-time insights generation

## API Endpoints

### Get Detailed Insights
```
GET /api/insights/detailed?campaign_id={id}
```
Returns comprehensive cost reduction and optimization insights.

### Get Active Insights
```
GET /api/insights?campaign_id={id}
```
Returns current strategic decisions and recommendations.

### Test Insights
```
GET /api/insights/test
```
Test endpoint to verify AI functionality is working.

## Configuration

### Environment Variables
```env
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
ENVIRONMENT=development
```

### Required Dependencies
- `openai` - OpenAI API client
- `fastapi` - Web framework
- `python-dotenv` - Environment variable loading

## Usage

### 1. Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your OpenAI API key

# Test setup
python setup_ai_insights.py
```

### 2. Start Backend
```bash
cd backend
python main.py
```

### 3. Access Insights
The AI insights will be automatically generated and displayed in the dashboard's "Autonomous Decisions" section.

## Data Flow

1. **Data Collection**: Platform metrics are gathered from campaign files
2. **Analysis**: InsightsAgent and StrategyAgent process the data
3. **Decision Generation**: AI generates specific recommendations
4. **Storage**: Decisions are logged to SQLite database
5. **Display**: Frontend shows insights in real-time dashboard

## Fallback Behavior

If the OpenAI API is unavailable, the system provides intelligent fallbacks:
- Uses actual campaign data for calculations
- Generates data-driven recommendations
- Maintains functionality without external dependencies

## Troubleshooting

### Common Issues

1. **"No API client available"**
   - Check your OpenAI API key in `.env`
   - Verify the key format starts with `sk-`

2. **"LLM call failed"**
   - Check internet connection
   - Verify API key has sufficient credits
   - System will use fallback insights

3. **Empty insights**
   - Ensure campaign data exists
   - Check platform data files in `backend/data/`

### Testing
```bash
# Test AI functionality
curl http://localhost:8000/api/insights/test

# Test with specific campaign
curl http://localhost:8000/api/insights/detailed?campaign_id=your-campaign-id
```

## Architecture

```
Frontend (React)
    ↓
API Endpoints (FastAPI)
    ↓
Dashboard Service
    ↓
AI Agents (InsightsAgent, StrategyAgent)
    ↓
OpenAI API / Fallback Logic
    ↓
SQLite Database (Persistence)
```

The system is designed to be resilient and will continue functioning even if external AI services are unavailable, using intelligent fallbacks based on actual campaign data.