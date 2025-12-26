import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, Volume2, VolumeX, Download, Calendar, Sparkles, TrendingUp, Target, Zap, CheckCircle, Clock, ArrowRight, MessageSquare, BarChart3, Bell } from 'lucide-react';

const ChatMessage = ({ message, isAI, timestamp }) => (
    <div className={`flex gap-3 mb-6 ${isAI ? '' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
            {isAI ? <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <div className="w-4 h-4 bg-indigo-600 rounded-full" />}
        </div>
        <div className={`max-w-[80%] ${isAI ? '' : 'text-right'}`}>
            <div className={`inline-block p-4 rounded-2xl ${isAI ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100' : 'bg-indigo-600 text-white'}`}>
                <p className="text-sm leading-relaxed">{message}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">{timestamp}</p>
        </div>
    </div>
);

const QuickAction = ({ icon: Icon, label, onClick, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
        green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50',
        purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50',
        pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/50'
    };
    
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${colorClasses[color]}`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
};

const SmartCard = ({ title, description, impact, status, onAction, type }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'ready': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
            case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
            case 'analyzing': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30';
        }
    };

    const handleCardAction = () => {
        // Add to chat when card action is clicked
        const actionMessage = `Apply ${title} recommendation`;
        onAction(actionMessage);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{type}</span>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor()}`}>
                    {status === 'ready' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {status === 'analyzing' && <Clock className="w-3 h-3 inline mr-1 animate-spin" />}
                    {status}
                </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{description}</p>
            {impact && (
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">+{impact}% expected impact</span>
                </div>
            )}
            <button 
                onClick={handleCardAction}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
            >
                Apply Recommendation <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            message: "👋 Hello! I'm your AI Marketing Assistant. I've analyzed your campaigns and found several optimization opportunities. How can I help you today? 🚀",
            isAI: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
    const [showTrendingModal, setShowTrendingModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Voice Recognition Setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(transcript);
                setIsListening(false);
            };
            
            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Text-to-Speech Function
    const speakMessage = (text) => {
        if (voiceEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text.replace(/[🎯📊💰🚀📈💡🎥🎨👥📱⏰🔥💪🎆✅🚨📉🏆]/g, ''));
            utterance.rate = 0.9;
            utterance.pitch = 1;
            setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            speechSynthesis.speak(utterance);
        }
    };

    // Voice Input Toggle
    const toggleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        
        const newMessage = {
            id: Date.now(),
            message: inputMessage,
            isAI: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsTyping(true);
        
        // Simulate AI response with more variety
        setTimeout(() => {
            let aiResponse = "";
            const userMsg = inputMessage.toLowerCase();
            
            // Context-aware responses based on user input
            if (userMsg.includes('platform') && (userMsg.includes('loss') || userMsg.includes('losing') || userMsg.includes('causing'))) {
                aiResponse = "🚨 I've identified the problem! Facebook is your biggest underperformer right now:\n\n📉 Facebook: -15% ROI vs target\n📉 Twitter: -8% engagement drop\n📉 Email: 12% lower open rates\n\n🚀 Solution: Reallocate $500 from Facebook to Instagram for immediate improvement! Should I make this change?";
            } else if (userMsg.includes('platform') && (userMsg.includes('profit') || userMsg.includes('making') || userMsg.includes('best') || userMsg.includes('top'))) {
                aiResponse = "🏆 Instagram is your profit champion! Here's the breakdown:\n\n🚀 Instagram: +40% engagement, 225% ROI\n📈 Google Ads: +18% ROI, solid performance\n📱 TikTok: +25% reach, growing fast\n📉 Facebook: -15% ROI (needs attention)\n\nInstagram is generating 60% of your total profits! 💰";
            } else if ((userMsg.includes('reduce') || userMsg.includes('stop') || userMsg.includes('fix')) && userMsg.includes('loss')) {
                aiResponse = "🚨 Here's your loss reduction strategy:\n\n🚫 1. Pause underperforming Facebook ads immediately\n🚀 2. Shift budget to high-performing Instagram campaigns\n🎯 3. Optimize targeting to reduce wasted spend\n📈 4. Focus on video content (2.3x better performance)\n\nThis should reduce losses by 40-50% within 48 hours! 💪";
            } else if (userMsg.includes('reach') || userMsg.includes('expand') || userMsg.includes('grow')) {
                aiResponse = "🚀 Great question! Here are 4 proven ways to increase your reach:\n\n🎯 1. Expand lookalike audiences to 2-3%\n📱 2. Add Instagram Reels & Stories\n👥 3. Test broader interest targeting\n📈 4. Increase budget on top-performing ads\n\nThis could boost your reach by 60-80%! Which strategy interests you most? 💡";
            } else if (userMsg.includes('suggest') || userMsg.includes('recommend') || userMsg.includes('advice') || userMsg.includes('other')) {
                aiResponse = "💡 Absolutely! Here are additional advanced strategies:\n\n⏰ 1. Schedule ads for peak engagement hours (7-9 PM)\n📱 2. A/B test different call-to-action buttons\n🎯 3. Retarget website visitors with dynamic ads\n📈 4. Use seasonal trending hashtags\n🚀 5. Cross-promote on multiple platforms\n\nWhich of these catches your interest? 🤔";
            } else if (userMsg.includes('competitor') || userMsg.includes('industry') || userMsg.includes('benchmark')) {
                aiResponse = "🏆 Here's how you compare to industry benchmarks:\n\n📈 Your Performance vs Industry Average:\n• CTR: 3.2% (Industry: 2.1%) ✅\n• CPC: $1.45 (Industry: $1.89) ✅\n• ROAS: 4.2x (Industry: 3.1x) ✅\n\nYou're outperforming 78% of competitors! 🚀";
            } else if (userMsg.includes('forecast') || userMsg.includes('predict') || userMsg.includes('next month')) {
                aiResponse = "🔮 Here's your performance forecast for next month:\n\n📈 Projected Results:\n• Revenue: $28,500 (+12% vs this month)\n• ROAS: 4.8x (+15% improvement)\n• Conversions: 1,240 (+18% increase)\n\n🎆 Confidence Level: 89% based on current trends!";
            } else if (userMsg.includes('seasonal') || userMsg.includes('holiday') || userMsg.includes('christmas') || userMsg.includes('black friday')) {
                aiResponse = "🎄 Perfect timing! Here are seasonal optimization tips:\n\n🔥 Holiday Strategy:\n• Increase video ad budget by 40%\n• Focus on gift-related keywords\n• Extend audience to include gift-buyers\n• Create urgency with countdown timers\n\nExpected holiday boost: +65% revenue! 🎁";
            } else if (userMsg.includes('trend') || userMsg.includes('trending') || userMsg.includes('popular')) {
                aiResponse = "🔥 Hot trends in your industry right now:\n\n📈 Trending Opportunities:\n• Short-form video content (+180% engagement)\n• User-generated content campaigns\n• Interactive polls and quizzes\n• Influencer micro-partnerships\n\nJump on these trends for maximum impact! 🚀";
            } else if (userMsg.includes('export') || userMsg.includes('download') || userMsg.includes('report')) {
                aiResponse = "📋 I'll prepare your comprehensive report! It includes:\n\n📈 Report Contents:\n• Full conversation transcript\n• Recommended action items\n• Performance projections\n• Implementation timeline\n\nReport will be ready for download in 30 seconds! 📥";
            } else if (userMsg.includes('remind') || userMsg.includes('schedule') || userMsg.includes('later')) {
                aiResponse = "⏰ I'll set up reminders for you! Available options:\n\n📅 Reminder Types:\n• Daily performance check (9 AM)\n• Weekly optimization review (Mondays)\n• Budget alerts (when 80% spent)\n• Custom reminders\n\nWhich reminder would you like to set up? 🔔";
            } else if (userMsg.includes('template') || userMsg.includes('campaign setup') || userMsg.includes('create campaign')) {
                aiResponse = "🎯 I'll create a campaign template for you! Based on your top performer:\n\n🚀 Instagram Video Campaign Template:\n• Budget: $500/day\n• Audience: Lookalike 2%\n• Placement: Feed + Stories\n• Objective: Conversions\n\nReady to launch? This template has 92% success rate! 🎆";
            } else if (userMsg.includes('optimize') || userMsg.includes('improve')) {
                aiResponse = "📊 I've analyzed your campaigns! Instagram is showing 40% higher engagement than Facebook. 🚀 I recommend reallocating $500 from Facebook to Instagram for a potential 15% ROI increase! 📈";
            } else if (userMsg.includes('profit') || userMsg.includes('revenue') || userMsg.includes('earn') || userMsg.includes('make')) {
                aiResponse = "💰 Based on your current $2,000 monthly ad spend, here's your profit projection:\n\n📈 Current ROI: 180%\n🚀 After optimization: 225%\n💵 Additional monthly profit: ~$900\n\nWith the Instagram reallocation and video focus, you could see an extra $10,800 annually! 🎆";
            } else if (userMsg.includes('budget') || userMsg.includes('money') || userMsg.includes('cost')) {
                aiResponse = "💰 Based on current performance data, I suggest moving 30% of your budget to video ads and increasing Instagram spend by $300. 🎥 This could improve overall ROAS by 22%! 🚀";
            } else if (userMsg.includes('audience') || userMsg.includes('target')) {
                aiResponse = "🎯 Your current audience segments show strong engagement in the 25-34 age group! 📈 I recommend expanding your lookalike audiences and testing interest-based targeting for better reach. 🚀";
            } else if (userMsg.includes('creative') || userMsg.includes('video') || userMsg.includes('content')) {
                aiResponse = "🎨 Your video creatives are outperforming static images by 2.3x! 🎥 I suggest creating more short-form video content and testing carousel ads for product showcases. 🚀";
            } else if (userMsg.includes('thank') || userMsg.includes('thanks') || userMsg.includes('appreciate')) {
                aiResponse = "😊 You're very welcome! I'm here to help optimize your campaigns 24/7. 🚀 Feel free to ask me anything about performance tracking, budget adjustments, or new opportunities. Let's keep growing your ROI together! 📈💪";
            } else if (userMsg.includes('yes') || userMsg.includes('please') || userMsg.includes('sure')) {
                aiResponse = "✅ Perfect! Here's your personalized optimization plan:\n\n🎯 1. Shift $500 from Facebook to Instagram\n📱 2. Increase video content by 40%\n👥 3. Expand lookalike audiences to 2%\n📊 4. Test carousel ad formats\n\nExpected results: +25% ROI, +40% engagement! 🚀 Should I implement these changes?";
            } else if (userMsg.includes('no') || userMsg.includes('not')) {
                aiResponse = "🤔 No problem! What specific area would you like to focus on instead? I can help with budget allocation, audience targeting, creative optimization, or performance analysis. 💡";
            } else if (userMsg.includes('hi') || userMsg.includes('hello') || userMsg.includes('hey')) {
                aiResponse = "👋 Hey there! Great to see you back! 🚀 I've been monitoring your campaigns and have some exciting updates. Your Instagram ads are crushing it with 40% higher engagement! What would you like to work on today? 💪";
            } else {
                const responses = [
                    "🤖 I understand! Let me analyze that for you. Based on your campaign data, I see several opportunities for improvement. What's your main goal - more conversions, better ROI, or increased reach? 🎯",
                    "📊 Great question! Your campaigns show strong potential. I notice your Instagram ads are performing 40% better than Facebook. Would you like me to create a reallocation strategy? 🚀",
                    "💡 I can help with that! Your current performance data shows video content is outperforming static images by 2.3x. Should we focus on creative optimization first? 🎥"
                ];
                aiResponse = responses[Math.floor(Math.random() * responses.length)];
            }
            
            const aiMessage = {
                id: Date.now(),
                message: aiResponse,
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
            
            // Auto-speak AI responses if voice is enabled
            if (voiceEnabled) {
                setTimeout(() => speakMessage(aiResponse), 500);
            }
        }, 1500);
    };

    // Download Report Function
    const downloadReport = () => {
        const reportContent = {
            title: "AI Marketing Assistant - Campaign Analysis Report",
            generatedAt: new Date().toLocaleString(),
            recommendations: [
                "Reallocate $500 from Facebook to Instagram for 15% ROI increase",
                "Increase video content by 30% for 23% engagement boost",
                "Expand lookalike audiences to 2% for 40% reach increase"
            ],
            performanceMetrics: {
                currentROI: "180%",
                projectedROI: "225%",
                monthlySavings: "$900",
                annualProjection: "$10,800"
            },
            competitorAnalysis: {
                ctr: "3.2% vs 2.1% (Industry)",
                cpc: "$1.45 vs $1.89 (Industry)",
                roas: "4.2x vs 3.1x (Industry)",
                ranking: "Outperforming 78% of competitors"
            }
        };
        
        // Create PDF content using jsPDF
        const { jsPDF } = window.jspdf || {};
        
        if (!jsPDF) {
            // Fallback: Load jsPDF dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                generatePDF();
            };
            document.head.appendChild(script);
        } else {
            generatePDF();
        }
        
        function generatePDF() {
            const doc = new window.jspdf.jsPDF();
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229); // Indigo color
            doc.text('AI Marketing Assistant', 20, 30);
            doc.setFontSize(16);
            doc.text('Campaign Analysis Report', 20, 40);
            
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128); // Gray color
            doc.text(`Generated: ${reportContent.generatedAt}`, 20, 50);
            
            // Line separator
            doc.setDrawColor(79, 70, 229);
            doc.line(20, 55, 190, 55);
            
            let yPos = 70;
            
            // Key Recommendations
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229);
            doc.text('Key Recommendations', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(51, 51, 51);
            reportContent.recommendations.forEach((rec, index) => {
                doc.text(`${index + 1}. ${rec}`, 25, yPos);
                yPos += 8;
            });
            
            yPos += 10;
            
            // Performance Metrics
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229);
            doc.text('Performance Metrics', 20, yPos);
            yPos += 15;
            
            doc.setFontSize(10);
            doc.setTextColor(51, 51, 51);
            doc.text(`Current ROI: ${reportContent.performanceMetrics.currentROI}`, 25, yPos);
            doc.text(`Projected ROI: ${reportContent.performanceMetrics.projectedROI}`, 100, yPos);
            yPos += 8;
            doc.text(`Monthly Savings: ${reportContent.performanceMetrics.monthlySavings}`, 25, yPos);
            doc.text(`Annual Projection: ${reportContent.performanceMetrics.annualProjection}`, 100, yPos);
            
            yPos += 20;
            
            // Competitor Analysis
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229);
            doc.text('Competitor Analysis', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(51, 51, 51);
            doc.text(`CTR: ${reportContent.competitorAnalysis.ctr}`, 25, yPos);
            yPos += 8;
            doc.text(`CPC: ${reportContent.competitorAnalysis.cpc}`, 25, yPos);
            yPos += 8;
            doc.text(`ROAS: ${reportContent.competitorAnalysis.roas}`, 25, yPos);
            yPos += 8;
            doc.text(`Market Position: ${reportContent.competitorAnalysis.ranking}`, 25, yPos);
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128);
            doc.text('Report generated by AI Marketing Assistant', 20, 280);
            
            // Save PDF
            doc.save(`AI-Marketing-Report-${new Date().toISOString().split('T')[0]}.pdf`);
        }
    };

    const handleQuickAction = (action) => {
        const quickMessages = {
            optimize: "Please analyze my current campaigns and suggest optimizations",
            budget: "Help me reallocate my budget for better ROI",
            audience: "Analyze my audience segments and suggest improvements",
            creative: "Review my ad creatives and recommend changes"
        };
        
        const message = quickMessages[action] || action;
        const newMessage = {
            id: Date.now(),
            message: message,
            isAI: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(true);
        
        // Simulate AI response based on action
        setTimeout(() => {
            let aiResponse = "";
            switch(action) {
                case 'optimize':
                    aiResponse = "📊 I've analyzed your campaigns! Instagram is performing 40% better than Facebook. 🚀 I recommend reallocating $500 from Facebook to Instagram for a potential 15% ROI increase! 📈";
                    break;
                case 'budget':
                    aiResponse = "💰 Based on current performance data, I suggest moving 30% of your budget to video ads and increasing Instagram spend by $300. 🎥 This could improve overall ROAS by 22%! 🚀";
                    break;
                case 'audience':
                    aiResponse = "🎯 Your current audience segments show strong engagement in the 25-34 age group! 📈 I recommend expanding your lookalike audiences and testing interest-based targeting for better reach. 🚀";
                    break;
                case 'creative':
                    aiResponse = "🎨 Your video creatives are outperforming static images by 2.3x! 🎥 I suggest creating more short-form video content and testing carousel ads for product showcases. 🚀";
                    break;
                default:
                    aiResponse = "🤔 I understand your request. Let me analyze the data and provide specific recommendations based on your current campaign performance! 📊";
            }
            
            const aiMessage = {
                id: Date.now() + 1,
                message: aiResponse,
                isAI: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Chat Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Marketing Assistant</h1>
                            <p className="text-sm text-gray-500">Online • Ready to optimize</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} {...msg} />
                    ))}
                    {isTyping && (
                        <div className="flex gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {/* Message Input */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask me anything about your campaigns..."
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <button 
                            onClick={toggleVoiceInput}
                            className={`p-3 rounded-xl transition-colors ${
                                isListening 
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' 
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                            }`}
                            title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={() => setVoiceEnabled(!voiceEnabled)}
                            className={`p-3 rounded-xl transition-colors ${
                                voiceEnabled 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                            title={voiceEnabled ? 'Voice responses ON' : 'Voice responses OFF'}
                        >
                            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={sendMessage}
                            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Professional Action Panels Below Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Instant AI analysis</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button 
                            onClick={() => { setSelectedAction('competitor'); setShowQuickActionsModal(true); }}
                            className="w-full p-3 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all flex items-center gap-3 group"
                        >
                            <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Competitor Analysis</span>
                        </button>
                        <button 
                            onClick={() => { setSelectedAction('forecast'); setShowQuickActionsModal(true); }}
                            className="w-full p-3 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all flex items-center gap-3 group"
                        >
                            <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Performance Forecast</span>
                        </button>
                        <button 
                            onClick={() => { setSelectedAction('seasonal'); setShowQuickActionsModal(true); }}
                            className="w-full p-3 text-sm bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all flex items-center gap-3 group"
                        >
                            <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Seasonal Strategy</span>
                        </button>
                        <button 
                            onClick={() => { setSelectedAction('export'); setShowQuickActionsModal(true); }}
                            className="w-full p-3 text-sm bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-all flex items-center gap-3 group"
                        >
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Export Report</span>
                        </button>
                    </div>
                </div>

                {/* Trending Alerts Panel */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-bounce" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Trending Alerts</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Live market insights</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Hot Trend</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                🔥 Short-form video content is trending +180% in your industry!
                            </p>
                            <button 
                                onClick={() => setShowTrendingModal(true)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Get Trend Analysis
                            </button>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Market Update</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                📈 Instagram Reels engagement up 45% this week
                            </p>
                        </div>
                    </div>
                </div>

                {/* Today's AI Impact Panel */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Today's AI Impact</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Performance boost</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">+18%</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">ROI Improvement</div>
                            </div>
                            <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">$2.4K</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Cost Saved</div>
                            </div>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Optimization Progress</span>
                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">78%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Smart Recommendations</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered optimization suggestions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Analysis
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <SmartCard
                        type="Budget Optimization"
                        title="Reallocate Instagram Budget"
                        description="Instagram ads are outperforming Facebook by 40%. Recommend shifting $500 from Facebook to Instagram for better ROI."
                        impact="15"
                        status="ready"
                        onAction={(message) => {
                            const newMessage = {
                                id: Date.now(),
                                message: message,
                                isAI: false,
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setMessages(prev => [...prev, newMessage]);
                            setIsTyping(true);
                            setTimeout(() => {
                                const aiResponse = {
                                    id: Date.now() + 1,
                                    message: "🚀 Perfect! I'll help you reallocate your Instagram budget. Moving $500 from Facebook to Instagram could increase your ROI by 15%! 📈 This change should take effect within 24 hours. Would you like me to set up automated monitoring for this change?",
                                    isAI: true,
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                };
                                setMessages(prev => [...prev, aiResponse]);
                                setIsTyping(false);
                            }, 2000);
                        }}
                    />
                    
                    <SmartCard
                        type="Creative Optimization"
                        title="Video Content Priority"
                        description="Video ads are generating 2.3x higher engagement. Consider increasing video ad spend by 30%."
                        impact="23"
                        status="ready"
                        onAction={(message) => {
                            const newMessage = {
                                id: Date.now(),
                                message: message,
                                isAI: false,
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setMessages(prev => [...prev, newMessage]);
                            setIsTyping(true);
                            setTimeout(() => {
                                const aiResponse = {
                                    id: Date.now() + 1,
                                    message: "🎥 Excellent choice! Video content is definitely the way to go. I'll increase your video ad spend by 30% and focus on short-form content. 🚀 This should boost engagement by 23%! I'll also suggest some trending video formats for your campaigns. 📈",
                                    isAI: true,
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                };
                                setMessages(prev => [...prev, aiResponse]);
                                setIsTyping(false);
                            }, 2000);
                        }}
                    />
                    
                    <SmartCard
                        type="Audience Targeting"
                        title="Lookalike Expansion"
                        description="Current lookalike audiences show strong performance. Expanding to 2% lookalike could increase reach by 40%."
                        impact="12"
                        status="analyzing"
                        onAction={(message) => {
                            const newMessage = {
                                id: Date.now(),
                                message: message,
                                isAI: false,
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setMessages(prev => [...prev, newMessage]);
                            setIsTyping(true);
                            setTimeout(() => {
                                const aiResponse = {
                                    id: Date.now() + 1,
                                    message: "🎯 Great decision! I'm expanding your lookalike audiences to 2% which should increase your reach by 40%! 🚀 The analysis shows strong potential for a 12% performance boost. 📈 I'll monitor the results and adjust targeting parameters as needed. This might take 2-3 days to fully optimize.",
                                    isAI: true,
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                };
                                setMessages(prev => [...prev, aiResponse]);
                                setIsTyping(false);
                            }, 2000);
                        }}
                    />
                </div>
            </div>

            {/* Quick Actions Modal */}
            {showQuickActionsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQuickActionsModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {selectedAction === 'competitor' && 'Competitor Analysis'}
                                {selectedAction === 'forecast' && 'Performance Forecast'}
                                {selectedAction === 'seasonal' && 'Seasonal Strategy'}
                                {selectedAction === 'export' && 'Export Report'}
                            </h3>
                            <button onClick={() => setShowQuickActionsModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            {selectedAction === 'competitor' && (
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🏆 Industry Benchmark Comparison</h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex justify-between"><span>CTR:</span><span className="text-green-600">3.2% vs 2.1% ✅</span></div>
                                        <div className="flex justify-between"><span>CPC:</span><span className="text-green-600">$1.45 vs $1.89 ✅</span></div>
                                        <div className="flex justify-between"><span>ROAS:</span><span className="text-green-600">4.2x vs 3.1x ✅</span></div>
                                    </div>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-3">You're outperforming 78% of competitors!</p>
                                </div>
                            )}
                            {selectedAction === 'forecast' && (
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🔮 Next Month Projection</h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex justify-between"><span>Revenue:</span><span className="text-green-600">$28,500 (+12%)</span></div>
                                        <div className="flex justify-between"><span>ROAS:</span><span className="text-green-600">4.8x (+15%)</span></div>
                                        <div className="flex justify-between"><span>Conversions:</span><span className="text-green-600">1,240 (+18%)</span></div>
                                    </div>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-3">89% confidence level</p>
                                </div>
                            )}
                            {selectedAction === 'seasonal' && (
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🎄 Holiday Strategy</h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div>• Increase video ad budget by 40%</div>
                                        <div>• Focus on gift-related keywords</div>
                                        <div>• Extend audience to gift-buyers</div>
                                        <div>• Create urgency with countdown timers</div>
                                    </div>
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-3">Expected holiday boost: +65% revenue!</p>
                                </div>
                            )}
                            {selectedAction === 'export' && (
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">📋 Report Contents</h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div>• Full conversation transcript</div>
                                        <div>• Recommended action items</div>
                                        <div>• Performance projections</div>
                                        <div>• Implementation timeline</div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            downloadReport();
                                            setShowQuickActionsModal(false);
                                        }}
                                        className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Download Report
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Trending Modal */}
            {showTrendingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTrendingModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🔥 Trending Opportunities</h3>
                            <button onClick={() => setShowTrendingModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">🔥 Hot Trend</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Short-form video content +180% engagement</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">📱 Platform Update</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Instagram Reels engagement up 45% this week</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">🎯 Opportunity</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">User-generated content campaigns trending</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
