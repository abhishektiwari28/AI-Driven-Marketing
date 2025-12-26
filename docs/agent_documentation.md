# AI Agent System Documentation

This document provides a comprehensive overview of the AI Agents employed in the Marketing Campaign Analytics Platform. The system utilizes a multi-agent architecture powered by Google's Gemini-1.5-flash model to automate, optimize, and manage various aspects of marketing campaigns.

## Architecture Guidelines

The agent system is built on a **Hub-and-Spoke** model where a central **Orchestrator** manages specialized agents for specific tasks. All agents inherit from a common `BaseAgent` class, ensuring consistent communication protocols, error handling, and API interactions.

---

## core Components

### 1. Base Agent (`backend/agents/base.py`)
- **Role**: Foundation for all agents.
- **Functionality**:
  - Handles **Gemini API configuration** and authentication.
  - Provides `generate_text` for free-form responses and `call_llm` for structured JSON outputs.
  - Implements resilient error handling (returning simulated fallbacks if the API is unreachable) to ensure system stability during demos.
  - Maintains an internal memory log of activities.

### 2. Campaign Orchestrator (`backend/agents/orchestrator.py`)
- **Name**: `Metatron`
- **Role**: Global Orchestrator & Logic Controller.
- **Functionality**:
  - Acts as the central brain of the platform.
  - **Campagin Initialization**: Coordinations the sequential execution of Planner, Recommender, ROI Analyst, Timeline, and Execution agents to build a complete campaign from a user prompt.
  - **Lifecycle Management**: Decides the validity and outcome of user actions (e.g., launching, pausing, or terminating a campaign) using LLM reasoning.
  - Maintains the state and flow of data between specialized agents.

---

## Specialized Agents

### 3. Campaign Planner (`backend/agents/planner.py`)
- **Name**: `Aurelius`
- **Role**: Campaign Planner
- **Functionality**:
  - Defines the high-level **strategic roadmap** based on the user's objective and budget.
  - Generates key milestones and determines the priority level of the campaign.

### 4. Channel Recommender (`backend/agents/recommender.py`)
- **Name**: `Navigator`
- **Role**: Channel Specialist
- **Functionality**:
  - Analyzes the campaign objective to recommend the optimal **budget split** across various platforms (Instagram, Facebook, Google Ads, etc.).
  - Provides reasoning for why specific channels are preferred for the given goal.

### 5. ROI Analyst (`backend/agents/roi_analyst.py`)
- **Name**: `ProfitMax`
- **Role**: ROI Analyst
- **Functionality**:
  - Performs **financial forecasting**.
  - Projects Return on Investment (ROI), estimated revenue, and conversion counts based on the allocated budget and market benchmarks.
  - Assigns a confidence score to its predictions.

### 6. Timeline Manager (`backend/agents/timeline.py`)
- **Name**: `Chronos`
- **Role**: Timeline Manager
- **Functionality**:
  - Generates a realistic **execution schedule**.
  - Maps out specific dates for campaign phases (Launch, Optimization, Scaling, Review) over a 30-day period.

### 7. Brand Guardian (`backend/agents/consistency.py`)
- **Name**: `Guardian`
- **Role**: Brand Auditor
- **Functionality**:
  - Audits content across different platforms to ensure **brand consistency**.
  - Analyzes sentiment and engagement signals to verify that the brand voice remains uniform.
  - Returns a consistency score and health status (Green/Amber/Red).

### 8. Execution Lead (`backend/agents/broadcast.py`)
- **Name**: `Broadcast`
- **Role**: Execution Lead
- **Functionality**:
  - Simulates the **deployment of assets** to live platforms.
  - Generates professional confirmation messages and deployment codes.
  - Verifies that the campaign is "live" on the selected channels.

### 9. Creative Optimiser (`backend/agents/creative.py`)
- **Name**: `DaVinci`
- **Role**: Creative Director
- **Functionality**:
  - Analyzes current creative performance.
  - Suggests specific **improvements** (e.g., "Switch to UGC video") to boost engagement and uplift rates.

### 10. Audience Profiler (`backend/agents/audience.py`)
- **Name**: `Cerebro`
- **Role**: Audience Profiler
- **Functionality**:
  - Identifies and refines **target audience micro-segments**.
  - Provides specific segment names and match rates for targeted marketing.

### 11. Identity Manager (`backend/agents/auth.py`)
- **Name**: `Sentinel`
- **Role**: Identity Manager
- **Functionality**:
  - Manages **user authorization** and security sessions.
  - Simulates risk profiling to detect potential security threats or fraudulent activities.

### 12. Capital Allocator (`backend/agents/budget.py`)
- **Name**: `Ledger`
- **Role**: Capital Allocator
- **Functionality**:
  - Monitors budget usage and suggests **dynamic reallocations**.
  - Aims to reduce wasted spend and maximize result spread based on real-time performance.

### 13. Performance Analyst (`backend/agents/dash.py`)
- **Name**: `Nexus`
- **Role**: Performance Analyst
- **Functionality**:
  - Aggregates cross-campaign data for the **main dashboard**.
  - Generates high-level insights (e.g., "Healthy growth trajectory") and determines the overall health score and trend of the marketing portfolio.
