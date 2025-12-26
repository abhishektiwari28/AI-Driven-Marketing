import React, { useState, useEffect } from 'react';
import { X, BarChart3, Users2, Layers3, Brain, Download, Facebook, Instagram, Mail, Twitter, Target } from 'lucide-react';
import jsPDF from 'jspdf';

const DeepAnalyticsModal = ({ isOpen, onClose, selectedCampaign }) => {
  const [activeSection, setActiveSection] = useState('performance');
  const [platformData, setPlatformData] = useState({});

  useEffect(() => {
    if (isOpen && selectedCampaign) {
      fetchPlatformData();
    }
  }, [isOpen, selectedCampaign]);

  const fetchPlatformData = async () => {
    try {
      const platforms = selectedCampaign.platforms || [];
      const data = {};
      
      for (const platform of platforms) {
        const response = await fetch(`http://localhost:8000/api/platform-data/${platform}`);
        if (response.ok) {
          const platformInfo = await response.json();
          data[platform] = platformInfo;
        }
      }
      setPlatformData(data);
    } catch (error) {
      console.error('Error fetching platform data:', error);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'Facebook': { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
      'Instagram': { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
      'Email': { icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
      'Twitter': { icon: Twitter, color: 'text-cyan-600', bg: 'bg-cyan-50' },
      'Google Ads': { icon: Target, color: 'text-red-600', bg: 'bg-red-50' }
    };
    return icons[platform] || { icon: Target, color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  if (!isOpen || !selectedCampaign) return null;

  const generateReportData = (section) => {
    const baseData = {
      campaign: selectedCampaign.name,
      dateGenerated: new Date().toISOString(),
      section: section
    };

    switch (section) {
      case 'performance':
        let totalSpend = 0, totalImpressions = 0, totalClicks = 0, totalConversions = 0;
        let avgCtr = 0, avgCpc = 0, avgRoas = 0, avgConversionRate = 0;
        let platformCount = 0;
        
        selectedCampaign.platforms?.forEach(platform => {
          const data = platformData[platform];
          if (data && data.campaigns) {
            // Get any campaign from this platform for demo data
            const campaigns = Object.values(data.campaigns);
            if (campaigns.length > 0) {
              const campaignData = campaigns[0]; // Use first available campaign
              totalSpend += campaignData.metrics.cost || 0;
              totalImpressions += campaignData.metrics.impressions || 0;
              totalClicks += campaignData.metrics.clicks || 0;
              totalConversions += campaignData.metrics.conversions || 0;
              avgCtr += campaignData.metrics.ctr || 0;
              avgCpc += campaignData.metrics.cpc || 0;
              avgRoas += campaignData.metrics.roi || 0;
              avgConversionRate += campaignData.metrics.conversion_rate || 0;
              platformCount++;
            }
          }
        });
        
        // Fallback to demo data if no platform data
        if (platformCount === 0) {
          totalSpend = 15420;
          totalImpressions = 125000;
          totalClicks = 3250;
          totalConversions = 185;
          avgCtr = 2.6;
          avgCpc = 1.85;
          avgRoas = 3.2;
          avgConversionRate = 5.7;
          platformCount = 1;
        }
        
        return {
          ...baseData,
          metrics: {
            totalSpend: Math.round(totalSpend),
            impressions: totalImpressions,
            clicks: totalClicks,
            conversions: totalConversions,
            ctr: platformCount > 0 ? (avgCtr / platformCount).toFixed(2) : 0,
            cpc: platformCount > 0 ? (avgCpc / platformCount).toFixed(2) : 0,
            roas: platformCount > 0 ? (avgRoas / platformCount).toFixed(1) : 0,
            conversionRate: platformCount > 0 ? (avgConversionRate / platformCount).toFixed(2) : 0
          }
        };
      case 'audience':
        let maleTotal = 0, femaleTotal = 0, totalGender = 0;
        selectedCampaign.platforms?.forEach(platform => {
          const data = platformData[platform];
          const campaignData = data?.campaigns?.[selectedCampaign.id];
          if (campaignData?.metrics?.audience_insight?.gender) {
            maleTotal += campaignData.metrics.audience_insight.gender.Male || 0;
            femaleTotal += campaignData.metrics.audience_insight.gender.Female || 0;
            totalGender++;
          }
        });
        
        return {
          ...baseData,
          demographics: {
            'Age 25-34': 35,
            'Age 35-44': 28,
            'Age 18-24': 22,
            'Age 45+': 15
          },
          gender: totalGender > 0 ? {
            'Male': Math.round(maleTotal / totalGender),
            'Female': Math.round(femaleTotal / totalGender)
          } : { 'Male': 55, 'Female': 45 },
          interests: {
            'Technology': 42,
            'Business': 31,
            'Lifestyle': 27
          }
        };
      case 'channels':
        const realPlatformData = [];
        selectedCampaign.platforms?.forEach(platform => {
          const data = platformData[platform];
          if (data && data.campaigns) {
            const campaignData = data.campaigns[selectedCampaign.id];
            if (campaignData) {
              realPlatformData.push({
                name: platform,
                performance: Math.round((campaignData.metrics.roi || 1) * 30),
                spend: campaignData.metrics.cost || 0,
                conversions: campaignData.metrics.conversions || 0,
                ctr: campaignData.metrics.ctr || 0,
                cpc: campaignData.metrics.cpc || 0,
                demographics: campaignData.metrics.audience_insight || {}
              });
            }
          }
        });
        return {
          ...baseData,
          platforms: realPlatformData.length > 0 ? realPlatformData : selectedCampaign.platforms?.map(platform => ({
            name: platform,
            performance: Math.floor(Math.random() * 40 + 60),
            spend: Math.floor(Math.random() * 5000 + 1000),
            conversions: Math.floor(Math.random() * 100 + 20)
          })) || []
        };
      case 'predictions':
        return {
          ...baseData,
          recommendations: [
            'Increase Facebook budget by 15%',
            'Shift 20% budget from Google to Instagram',
            'Target lookalike audiences',
            'A/B test creative variations'
          ],
          predictions: {
            conversionIncrease: 23,
            cpaReduction: 12,
            roasImprovement: 18,
            engagementBoost: 31
          }
        };
      default:
        return baseData;
    }
  };

  const downloadReport = () => {
    const pdf = new jsPDF();
    let yPos = 30;
    
    // Header Section
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, 210, 40, 'F');
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('DEEP ANALYTICS REPORT', 20, 25);
    pdf.setFontSize(12);
    pdf.text(`Campaign: ${selectedCampaign.name}`, 20, 35);
    
    yPos = 60;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}`, 20, yPos);
    
    // Section 1: Performance Overview
    yPos += 20;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPos - 5, 180, 15, 'F');
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('1. PERFORMANCE OVERVIEW', 20, yPos + 5);
    
    yPos += 30;
    const performanceData = generateReportData('performance');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Campaign Investment & Returns', 20, yPos);
    
    // Structured table for investment metrics
    yPos += 15;
    pdf.setFillColor(250, 250, 250);
    pdf.rect(20, yPos - 5, 170, 50, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 170, 50);
    
    // Table headers
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('METRIC', 30, yPos + 5);
    pdf.text('VALUE', 120, yPos + 5);
    pdf.line(25, yPos + 8, 185, yPos + 8);
    
    // Table data
    pdf.setFont('helvetica', 'normal');
    const investmentMetrics = [
      ['Total Campaign Spend', `$${performanceData.metrics.totalSpend.toLocaleString()}`],
      ['Total Impressions', performanceData.metrics.impressions.toLocaleString()],
      ['Total Clicks', performanceData.metrics.clicks.toLocaleString()],
      ['Total Conversions', performanceData.metrics.conversions.toLocaleString()]
    ];
    
    investmentMetrics.forEach(([metric, value], index) => {
      const rowY = yPos + 15 + (index * 8);
      pdf.text(metric, 30, rowY);
      pdf.text(value, 120, rowY);
    });
    
    yPos += 65;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Performance Indicators', 20, yPos);
    
    // KPI table
    yPos += 15;
    pdf.setFillColor(245, 245, 255);
    pdf.rect(20, yPos - 5, 170, 50, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 170, 50);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KPI', 30, yPos + 5);
    pdf.text('VALUE', 120, yPos + 5);
    pdf.text('BENCHMARK', 150, yPos + 5);
    pdf.line(25, yPos + 8, 185, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    const kpiMetrics = [
      ['Click-Through Rate', `${performanceData.metrics.ctr}%`, '2.5%'],
      ['Cost Per Click', `$${performanceData.metrics.cpc}`, '$1.50'],
      ['Return on Ad Spend', `${performanceData.metrics.roas}x`, '3.0x'],
      ['Conversion Rate', `${performanceData.metrics.conversionRate}%`, '4.5%']
    ];
    
    kpiMetrics.forEach(([kpi, value, benchmark], index) => {
      const rowY = yPos + 15 + (index * 8);
      pdf.text(kpi, 30, rowY);
      pdf.text(value, 120, rowY);
      pdf.text(benchmark, 150, rowY);
    });
    
    // PAGE 2: Audience Insights
    pdf.addPage();
    yPos = 30;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPos - 5, 180, 15, 'F');
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('2. AUDIENCE INSIGHTS', 20, yPos + 5);
    
    yPos += 30;
    const audienceData = generateReportData('audience');
    
    // Gender Distribution Table
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Gender Distribution', 20, yPos);
    yPos += 15;
    pdf.setFillColor(250, 245, 250);
    pdf.rect(20, yPos - 5, 80, 30, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 80, 30);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GENDER', 25, yPos + 5);
    pdf.text('PERCENTAGE', 60, yPos + 5);
    pdf.line(22, yPos + 8, 98, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    Object.entries(audienceData.gender).forEach(([gender, percent], index) => {
      const rowY = yPos + 15 + (index * 8);
      pdf.text(gender, 25, rowY);
      pdf.text(`${percent}%`, 60, rowY);
    });
    
    // Age Demographics Table
    yPos += 50;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Age Demographics', 20, yPos);
    yPos += 15;
    pdf.setFillColor(245, 250, 245);
    pdf.rect(20, yPos - 5, 100, 50, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 100, 50);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AGE GROUP', 25, yPos + 5);
    pdf.text('PERCENTAGE', 80, yPos + 5);
    pdf.line(22, yPos + 8, 118, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    Object.entries(audienceData.demographics).forEach(([age, percent], index) => {
      const rowY = yPos + 15 + (index * 8);
      pdf.text(age, 25, rowY);
      pdf.text(`${percent}%`, 80, rowY);
    });
    
    // Interest Categories Table
    yPos += 70;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Interest Categories', 20, yPos);
    yPos += 15;
    pdf.setFillColor(250, 250, 245);
    pdf.rect(20, yPos - 5, 100, 40, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 100, 40);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INTEREST', 25, yPos + 5);
    pdf.text('PERCENTAGE', 80, yPos + 5);
    pdf.line(22, yPos + 8, 118, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    Object.entries(audienceData.interests).forEach(([interest, percent], index) => {
      const rowY = yPos + 15 + (index * 8);
      pdf.text(interest, 25, rowY);
      pdf.text(`${percent}%`, 80, rowY);
    });
    
    // PAGE 3: Platform Performance
    pdf.addPage();
    yPos = 30;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPos - 5, 180, 15, 'F');
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('3. PLATFORM PERFORMANCE', 20, yPos + 5);
    
    yPos += 30;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Platform Performance Summary', 20, yPos);
    
    // Platform performance table
    yPos += 15;
    pdf.setFillColor(250, 250, 250);
    pdf.rect(20, yPos - 5, 170, 80, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 170, 80);
    
    // Table headers
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PLATFORM', 25, yPos + 5);
    pdf.text('SPEND', 70, yPos + 5);
    pdf.text('CONVERSIONS', 100, yPos + 5);
    pdf.text('ROI', 140, yPos + 5);
    pdf.text('EFFICIENCY', 160, yPos + 5);
    pdf.line(22, yPos + 8, 188, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    ['Facebook', 'Instagram', 'Google Ads', 'Email', 'Twitter'].forEach((platform, index) => {
      const data = platformData[platform];
      let campaignData = null;
      if (data && data.campaigns) {
        const campaigns = Object.values(data.campaigns);
        campaignData = campaigns[0];
      }
      
      const spend = campaignData?.metrics.cost || Math.floor(Math.random() * 5000 + 1000);
      const conversions = campaignData?.metrics.conversions || Math.floor(Math.random() * 100 + 20);
      const roi = campaignData?.metrics.roi || (Math.random() * 3 + 1).toFixed(1);
      const efficiency = Math.round(roi * 30);
      
      const rowY = yPos + 15 + (index * 10);
      pdf.text(platform, 25, rowY);
      pdf.text(`$${spend.toLocaleString()}`, 70, rowY);
      pdf.text(conversions.toString(), 100, rowY);
      pdf.text(`${roi}x`, 140, rowY);
      pdf.text(`${efficiency}%`, 160, rowY);
    });
    
    // PAGE 4: AI Recommendations
    pdf.addPage();
    yPos = 30;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPos - 5, 180, 15, 'F');
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('4. AI STRATEGIC RECOMMENDATIONS', 20, yPos + 5);
    
    yPos += 30;
    const predictionsData = generateReportData('predictions');
    
    // Optimization Actions Table
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Optimization Actions', 20, yPos);
    yPos += 15;
    pdf.setFillColor(255, 250, 250);
    pdf.rect(20, yPos - 5, 170, 70, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 170, 70);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('#', 25, yPos + 5);
    pdf.text('RECOMMENDATION', 35, yPos + 5);
    pdf.text('IMPACT', 150, yPos + 5);
    pdf.text('PRIORITY', 170, yPos + 5);
    pdf.line(22, yPos + 8, 188, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    const impacts = ['High', 'Medium', 'High', 'Medium'];
    const priorities = ['1', '3', '2', '4'];
    
    predictionsData.recommendations.forEach((rec, index) => {
      const rowY = yPos + 15 + (index * 12);
      pdf.text((index + 1).toString(), 25, rowY);
      pdf.text(rec.substring(0, 45), 35, rowY);
      pdf.text(impacts[index], 150, rowY);
      pdf.text(priorities[index], 170, rowY);
    });
    
    // Performance Projections Table
    yPos += 90;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Performance Projections', 20, yPos);
    yPos += 15;
    pdf.setFillColor(245, 255, 245);
    pdf.rect(20, yPos - 5, 170, 50, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, 170, 50);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('METRIC', 30, yPos + 5);
    pdf.text('PROJECTED CHANGE', 100, yPos + 5);
    pdf.text('CONFIDENCE', 150, yPos + 5);
    pdf.line(25, yPos + 8, 185, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    const projections = [
      ['Conversion Increase', `+${predictionsData.predictions.conversionIncrease}%`, '85%'],
      ['Cost Reduction', `-${predictionsData.predictions.cpaReduction}%`, '78%'],
      ['ROAS Improvement', `+${predictionsData.predictions.roasImprovement}%`, '82%'],
      ['Engagement Growth', `+${predictionsData.predictions.engagementBoost}%`, '90%']
    ];
    
    projections.forEach(([metric, change, confidence], index) => {
      const rowY = yPos + 15 + (index * 8);
      pdf.text(metric, 30, rowY);
      pdf.text(change, 100, rowY);
      pdf.text(confidence, 150, rowY);
    });
    
    // Footer on last page
    yPos = 270;
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, yPos, 210, 20, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text('AI-Driven Marketing Campaign Analytics Platform', 20, yPos + 12);
    
    pdf.save(`${selectedCampaign.name}-Analytics-Report.pdf`);
  };

  const sections = [
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'audience', label: 'Audience', icon: Users2 },
    { id: 'channels', label: 'Channels', icon: Layers3 },
    { id: 'predictions', label: 'AI Predictions', icon: Brain }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'performance':
        const performanceData = generateReportData('performance');
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">SPEND</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">${performanceData.metrics.totalSpend.toLocaleString()}</div>
                <div className="text-xs font-medium text-gray-600">Total Campaign Spend</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Users2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">REACH</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{performanceData.metrics.impressions.toLocaleString()}</div>
                <div className="text-xs font-medium text-gray-600">Total Impressions</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Layers3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">CLICKS</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{performanceData.metrics.clicks.toLocaleString()}</div>
                <div className="text-xs font-medium text-gray-600">Total Clicks</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">GOALS</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{performanceData.metrics.conversions.toLocaleString()}</div>
                <div className="text-xs font-medium text-gray-600">Total Conversions</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-white" />
                </span>
                Key Performance Indicators
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{performanceData.metrics.ctr}%</div>
                  <div className="text-xs font-medium text-gray-600">Click-Through Rate</div>
                </div>
                <div className="text-center bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-rose-600 mb-1">${performanceData.metrics.cpc}</div>
                  <div className="text-xs font-medium text-gray-600">Cost Per Click</div>
                </div>
                <div className="text-center bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">{performanceData.metrics.roas}x</div>
                  <div className="text-xs font-medium text-gray-600">Return on Ad Spend</div>
                </div>
                <div className="text-center bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 mb-1">{performanceData.metrics.conversionRate}%</div>
                  <div className="text-xs font-medium text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'audience':
        const audienceData = generateReportData('audience');
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <Users2 className="w-4 h-4 text-white" />
                </span>
                Gender Distribution
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(audienceData.gender).map(([gender, percent]) => (
                  <div key={gender} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                        <span className="font-medium text-gray-800 text-sm">{gender}</span>
                      </div>
                      <span className={`text-lg font-bold ${gender === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-white" />
                </span>
                Age Demographics
              </h4>
              <div className="space-y-4">
                {Object.entries(audienceData.demographics).map(([age, percent], index) => {
                  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-violet-500'];
                  const textColors = ['text-indigo-600', 'text-purple-600', 'text-blue-600', 'text-violet-600'];
                  return (
                    <div key={age} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800 text-sm">{age}</span>
                        <span className={`text-base font-bold ${textColors[index]}`}>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${colors[index]} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <Layers3 className="w-4 h-4 text-white" />
                </span>
                Interest Categories
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(audienceData.interests).map(([interest, percent], index) => {
                  const bgColors = ['bg-emerald-100', 'bg-teal-100', 'bg-cyan-100'];
                  const textColors = ['text-emerald-600', 'text-teal-600', 'text-cyan-600'];
                  return (
                    <div key={interest} className={`${bgColors[index]} p-4 rounded-lg text-center`}>
                      <div className={`text-lg font-bold ${textColors[index]} mb-1`}>{percent}%</div>
                      <div className="text-xs font-medium text-gray-700">{interest}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'channels':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <Layers3 className="w-4 h-4 text-white" />
                </span>
                Platform Performance
              </h4>
              <div className="space-y-4">
                {['Facebook', 'Instagram', 'Google Ads', 'Email', 'Twitter'].map((platform, index) => {
                  const platformInfo = getPlatformIcon(platform);
                  const Icon = platformInfo.icon;
                  const data = platformData[platform];
                  let campaignData = null;
                  
                  if (data && data.campaigns) {
                    const campaigns = Object.values(data.campaigns);
                    campaignData = campaigns[0]; // Use first available campaign
                  }
                  
                  const spend = campaignData?.metrics.cost || Math.floor(Math.random() * 5000 + 1000);
                  const conversions = campaignData?.metrics.conversions || Math.floor(Math.random() * 100 + 20);
                  const roi = campaignData?.metrics.roi || (Math.random() * 3 + 1).toFixed(1);
                  const trend = Math.random() > 0.5 ? 'up' : 'down';
                  const trendValue = Math.floor(Math.random() * 20 + 5);
                  const status = ['Active', 'Paused', 'Learning'][Math.floor(Math.random() * 3)];
                  
                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${platformInfo.bg} border border-gray-200 rounded-lg flex items-center justify-center shadow-sm`}>
                            <Icon className={`w-5 h-5 ${platformInfo.color}`} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 text-base">{platform}</h5>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              status === 'Active' ? 'bg-green-100 text-green-800' :
                              status === 'Paused' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-1 text-xs font-medium ${
                            trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <span>{trend === 'up' ? '↗' : '↘'}</span>
                            <span>{trendValue}%</span>
                          </div>
                          <div className="text-xs text-gray-500">vs last week</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Spend</div>
                          <div className="text-sm font-bold text-gray-900">${spend.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Conversions</div>
                          <div className="text-sm font-bold text-gray-900">{conversions}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">ROI</div>
                          <div className="text-sm font-bold text-emerald-600">{roi}x</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Efficiency</div>
                          <div className="text-sm font-bold text-blue-600">
                            {Math.round(roi * 30)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'predictions':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-white" />
                </span>
                AI Strategic Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: 'Increase Facebook budget by 15%', impact: 'High', color: 'from-green-400 to-green-600' },
                  { text: 'Shift 20% budget from Google to Instagram', impact: 'Medium', color: 'from-yellow-400 to-yellow-600' },
                  { text: 'Target lookalike audiences', impact: 'High', color: 'from-green-400 to-green-600' },
                  { text: 'A/B test creative variations', impact: 'Medium', color: 'from-blue-400 to-blue-600' }
                ].map((rec, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">{rec.text}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${rec.impact === 'High' ? 'bg-green-500' : rec.impact === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-white" />
                </span>
                Predicted Performance Outcomes
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Conversions', value: '+23%', icon: '🎯', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                  { label: 'CPA Reduction', value: '-12%', icon: '💰', color: 'text-blue-600', bg: 'bg-blue-100' },
                  { label: 'ROAS Improvement', value: '+18%', icon: '📊', color: 'text-purple-600', bg: 'bg-purple-100' },
                  { label: 'Engagement Boost', value: '+31%', icon: '❤️', color: 'text-pink-600', bg: 'bg-pink-100' }
                ].map((outcome, index) => (
                  <div key={index} className={`${outcome.bg} p-4 rounded-lg text-center shadow-sm`}>
                    <div className="text-lg mb-2">{outcome.icon}</div>
                    <div className={`text-lg font-bold ${outcome.color} mb-1`}>
                      {outcome.value}
                    </div>
                    <div className="text-xs font-medium text-gray-700">{outcome.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ overflow: 'hidden' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Deep Analytics</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex gap-2 p-4 bg-gray-50 border-b border-gray-200">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                activeSection === id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {renderSectionContent()}
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeepAnalyticsModal;