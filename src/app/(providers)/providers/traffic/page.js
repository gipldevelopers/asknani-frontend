// components/TrafficPage.jsx
"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    BarChart3, Users, Eye, Clock, MapPin, TrendingUp, Calendar, Download, Filter, 
    Smartphone, Globe, Laptop
} from 'lucide-react';
import API from '@/lib/api'; // Assuming your configured axios instance

// --- Component Definition ---

// Reusable Chart Component (Adjusted to use the dailyTrend data structure)
const Chart = ({ data, dateRange }) => {
    // Fill in missing days for a smooth 7-day or 30-day chart
    const rangeInDays = parseInt(dateRange.replace('d', ''));
    const allDates = [...Array(rangeInDays)].map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (rangeInDays - 1 - index));
        return {
            dayString: date.toISOString().substring(0, 10),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        };
    });

    const combinedData = allDates.map(dateInfo => {
        const matchingDay = data.find(d => d.visit_date === dateInfo.dayString);
        return {
            ...dateInfo,
            visits: matchingDay ? matchingDay.visits : 0
        };
    });
    
    const maxVisitors = Math.max(...combinedData.map(item => item.visits)) || 1;

    return (
        <div className="flex items-end h-64 space-x-4 mb-4 pt-10">
            {combinedData.map((day, index) => (
                <div key={day.dayString} className="flex flex-col items-center flex-1 h-full">
                    <div 
                        className="w-full h-full bg-blue-500 rounded-t-md transition-all duration-500"
                        style={{ height: `${(day.visits / maxVisitors) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{day.dayName}</div>
                </div>
            ))}
        </div>
    );
};

// --- Main TrafficPage Component ---
const TrafficPage = ({ daycareId = 1 }) => { // Use a default ID or prop
    const [dateRange, setDateRange] = useState('7d');
    const [activeTab, setActiveTab] = useState('overview');
    const [isClient, setIsClient] = useState(false);
    
    // Consolidated State for ALL data
    const [trafficData, setTrafficData] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        avgTime: 'N/A',
        bounceRate: 'N/A',
        dailyTrend: [],
        sources: [],
        devices: [],
        locations: [],
        allTimeUnique: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- Data Fetching Logic ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const rangeInDays = parseInt(dateRange.replace('d', ''));

        try {
            // Fetch comprehensive analytics for the selected range
            const summaryRes = await API.get(`/daycares/${daycareId}/analytics/summary`, {
                params: { range: rangeInDays }
            });

            // Fetch all-time unique visitors (using the separate endpoint)
            const totalUniqueRes = await API.get(`/daycares/${daycareId}/footfall`);

            const data = summaryRes.data;
            
            setTrafficData({
                totalViews: data.totalViews,
                uniqueVisitors: data.uniqueVisitors,
                avgTime: data.avgTime, // Mocked by backend
                bounceRate: data.bounceRate, // Mocked by backend
                dailyTrend: data.dailyTrend,
                sources: data.sources,
                devices: data.devices,
                locations: data.locations, // Mocked by backend
                allTimeUnique: totalUniqueRes.data.count,
            });

        } catch (error) {
            console.error("Error fetching traffic data:", error);
            // In a real app, you'd show a toast or error message
        } finally {
            setIsLoading(false);
        }
    }, [daycareId, dateRange]); // Dependency on dateRange to refetch when it changes

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Helper Component for Card Loading State ---
    const StatValue = ({ value }) => (
        <p className="text-xl font-bold text-gray-900">
            {isLoading ? (
                <span className="animate-pulse bg-gray-200 h-6 w-16 inline-block rounded"></span>
            ) : (
                value
            )}
        </p>
    );
    
    // Function to calculate percentages for traffic sources
    const calculateSourceData = useMemo(() => {
        const total = trafficData.sources.reduce((sum, item) => sum + item.count, 0);
        return trafficData.sources.map(source => ({
            name: source.referer === 'Direct' ? 'Direct' : source.referer.split('/')[2] || 'Referral',
            value: total > 0 ? Math.round((source.count / total) * 100) : 0,
            color: 'bg-blue-500' // Simplified color assignment
        }));
    }, [trafficData.sources]);
    
    // Function to calculate percentages for devices
    const calculateDeviceData = useMemo(() => {
        const total = trafficData.devices.reduce((sum, item) => sum + item.count, 0);
        const iconMap = {
            'Mobile': <Smartphone className="w-4 h-4" />,
            'Desktop': <Laptop className="w-4 h-4" />,
            'Tablet': <Globe className="w-4 h-4" />
        };
        return trafficData.devices.map(device => ({
            type: device.device_type,
            value: total > 0 ? Math.round((device.count / total) * 100) : 0,
            icon: iconMap[device.device_type] || <Laptop className="w-4 h-4" />
        }));
    }, [trafficData.devices]);

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Traffic Analytics</h1>
                        <p className="text-gray-600">Monitor and analyze your daycare's online presence</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                            {['7d', '14d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                        dateRange === range 
                                            ? 'bg-blue-100 text-blue-700 font-semibold' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    onClick={() => setDateRange(range)}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        
                       
                    </div>
                </div>

                {/* Stats Cards (REAL Data) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    
                    {/* 1. Total Views */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                                <Eye className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Views ({dateRange})</p>
                                <StatValue value={trafficData.totalViews.toLocaleString()} />
                            </div>
                        </div>
                         {/* Placeholder Trend */}
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-500">+12.4%</span>
                            <span className="text-sm text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    {/* 2. Unique Visitors */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Unique Visitors ({dateRange})</p>
                                <StatValue value={trafficData.uniqueVisitors.toLocaleString()} />
                            </div>
                        </div>
                         {/* Placeholder Trend */}
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-500">+8.7%</span>
                            <span className="text-sm text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    {/* 3. Avg. Time (Mocked from Backend) */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 mr-3">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Avg. Time</p>
                                <StatValue value={trafficData.avgTime} />
                            </div>
                        </div>
                         {/* Placeholder Trend */}
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-500">+5.2%</span>
                            <span className="text-sm text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    {/* 4. Bounce Rate (Mocked from Backend) */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-red-100 text-red-600 mr-3">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Bounce Rate</p>
                                <StatValue value={trafficData.bounceRate} />
                            </div>
                        </div>
                         {/* Placeholder Trend (Inverse) */}
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
                            <span className="text-sm text-red-500">-3.1%</span>
                            <span className="text-sm text-gray-500 ml-1">from last period</span>
                        </div>
                    </div>

                    {/* 5. Total Unique Visitors (All-Time) */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">All-Time Unique</p>
                                <StatValue value={trafficData.allTimeUnique.toLocaleString()} />
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500 ml-1">Total unique visits</span>
                        </div>
                    </div>
                </div>

               

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Traffic Chart (REAL Daily Trend) */}
                    <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Unique Visitors Trend ({dateRange})</h2>
                            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                                <Filter className="w-4 h-4 mr-1" />
                                Filter
                            </button>
                        </div>

                        <div className="h-80">
                            {isLoading ? (
                                <div className="h-64 flex items-center justify-center text-gray-500">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Loading visitor trend...
                                </div>
                            ) : isClient ? (
                                <Chart data={trafficData.dailyTrend} dateRange={dateRange} />
                            ) : (
                                <div className="h-64 flex items-center justify-center">Loading chart...</div>
                            )}
                            
                            <div className="flex justify-center space-x-4 mt-4">
                                <div className="flex items-center">
                                    <div className="w-4 h-3 bg-blue-500 rounded mr-2"></div>
                                    <span className="text-sm text-gray-600">Unique Visitors</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

           
            </div>
        </div>
    );
};

export default TrafficPage;