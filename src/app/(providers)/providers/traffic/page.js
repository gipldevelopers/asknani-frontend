"use client";
import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  Smartphone,
  Globe,
  Laptop
} from 'lucide-react'

const TrafficPage = () => {
  const [dateRange, setDateRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to set isClient to true only on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mock data for demonstration
  const trafficData = {
    totalViews: 1245,
    uniqueVisitors: 842,
    avgTime: '3m 42s',
    bounceRate: '32%',
    returningVisitors: 287
  }

  const trafficSources = [
    { name: 'Direct', value: 45, color: 'bg-blue-500' },
    { name: 'Social Media', value: 25, color: 'bg-green-500' },
    { name: 'Search Engines', value: 20, color: 'bg-yellow-500' },
    { name: 'Referrals', value: 10, color: 'bg-purple-500' }
  ]

  const visitorLocations = [
    { city: 'Mumbai', visitors: 324 },
    { city: 'Delhi', visitors: 278 },
    { city: 'Bangalore', visitors: 195 },
    { city: 'Hyderabad', visitors: 132 },
    { city: 'Chennai', visitors: 98 }
  ]

  const deviceData = [
    { type: 'Mobile', value: 62, icon: <Smartphone className="w-4 h-4" /> },
    { type: 'Desktop', value: 32, icon: <Laptop className="w-4 h-4" /> },
    { type: 'Tablet', value: 6, icon: <Globe className="w-4 h-4" /> }
  ]

  const weeklyData = [
    { day: 'Mon', views: 120, visitors: 85 },
    { day: 'Tue', views: 156, visitors: 112 },
    { day: 'Wed', views: 198, visitors: 145 },
    { day: 'Thu', views: 224, visitors: 168 },
    { day: 'Fri', views: 180, visitors: 132 },
    { day: 'Sat', views: 145, visitors: 98 },
    { day: 'Sun', views: 222, visitors: 162 }
  ]

  const maxWeeklyViews = Math.max(...weeklyData.map(item => item.views))

  // Prevent rendering of chart until client-side to avoid hydration issues
  const Chart = () => (
    <div className="flex items-end h-64 space-x-1 mb-4">
      {weeklyData.map((day, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-2">{day.day}</div>
          <div className="flex justify-center space-x-px w-full">
            <div 
              className="w-full bg-blue-500 rounded-t-md"
              style={{ height: `${(day.views / maxWeeklyViews) * 100}%` }}
            ></div>
            <div 
              className="w-full bg-blue-300 rounded-t-md"
              style={{ height: `${(day.visitors / maxWeeklyViews) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )

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
                  className={`px-3 py-1 rounded-md text-sm ${
                    dateRange === range 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setDateRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 mr-1" />
              Select Date
            </button>
            
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-xl font-bold text-gray-900">{trafficData.totalViews}</p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12.4%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-xl font-bold text-gray-900">{trafficData.uniqueVisitors}</p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8.7%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-xl font-bold text-gray-900">{trafficData.avgTime}</p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+5.2%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100 text-red-600 mr-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-xl font-bold text-gray-900">{trafficData.bounceRate}</p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
              <span className="text-sm text-red-500">-3.1%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Returning Visitors</p>
                <p className="text-xl font-bold text-gray-900">{trafficData.returningVisitors}</p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15.8%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['overview', 'sources', 'locations', 'devices'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Traffic Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Traffic Overview</h2>
              <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </button>
            </div>

            <div className="h-80">
              {/* Chart container - only render on client side */}
              {isClient ? <Chart /> : <div className="h-64 flex items-center justify-center">Loading chart...</div>}
              
              {/* Legend */}
              <div className="flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-3 bg-blue-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Page Views</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-3 bg-blue-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Visitors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Traffic Sources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h2>
            
            <div className="space-y-5">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{source.name}</span>
                    <span className="text-sm font-medium text-gray-900">{source.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${source.color} h-2 rounded-full`} 
                      style={{ width: `${source.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-900 mb-4">Devices</h3>
              <div className="space-y-3">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">{device.icon}</span>
                      <span className="text-sm text-gray-700">{device.type}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{device.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Locations */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Visitor Locations</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3">City</th>
                  <th className="pb-3">Visitors</th>
                  <th className="pb-3">Percentage</th>
                  <th className="pb-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visitorLocations.map((location, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{location.city}</span>
                      </div>
                    </td>
                    <td className="py-3">{location.visitors}</td>
                    <td className="py-3">
                      {Math.round((location.visitors / trafficData.uniqueVisitors) * 100)}%
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 text-sm">+{Math.floor(Math.random() * 10) + 5}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficPage