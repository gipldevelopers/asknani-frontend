"use client"
import React, { useState } from 'react'
import { Check, Star, Zap, Target, BarChart3, TrendingUp, Award, Shield } from 'lucide-react'

const AdsPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      id: 1,
      name: "Header Banner",
      description: "Premium visibility at the top of every page",
      price: 299,
      duration: "day",
      features: [
        "Top position on all pages",
        "Highest click-through rate",
        "Premium placement branding",
        "24/7 visibility"
      ],
      recommended: true,
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      id: 2,
      name: "Popup Ad",
      description: "Attention-grabbing ad when users visit the site",
      price: 199,
      duration: "day",
      features: [
        "High impact user entry point",
        "Customizable display frequency",
        "Detailed impression analytics",
        "Target by user location"
      ],
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: 3,
      name: "Side Banner",
      description: "Constant visibility on the side of content",
      price: 149,
      duration: "day",
      features: [
        "Permanent visibility on pages",
        "Multiple size options",
        "Budget-friendly",
        "Geotargeting included"
      ],
      icon: <Target className="w-8 h-8" />
    }
  ]

  const pricingOptions = [
    { id: 1, duration: "Daily", discount: 0 },
    { id: 2, duration: "Weekly", discount: 10 },
    { id: 3, duration: "15 Days", discount: 15 },
    { id: 4, duration: "Monthly", discount: 20 }
  ]

  const stats = [
    { value: "72%", label: "Higher conversion" },
    { value: "3.5x", label: "More visibility" },
    { value: "2.8x", label: "ROI compared to others" },
    { value: "500+", label: "Happy providers" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reach More Parents with Our Advertising Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Promote your daycare center to thousands of parents searching for quality childcare in India
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pricing Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Flexible Pricing Options</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {pricingOptions.map(option => (
              <div
                key={option.id}
                className="bg-white rounded-lg p-4 shadow-md text-center min-w-[140px] cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="font-semibold text-gray-900">{option.duration}</div>
                {option.discount > 0 && (
                  <div className="text-green-600 text-sm mt-1">Save {option.discount}%</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Plans Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.recommended ? 'border-2 border-blue-500 relative' : 'border border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="bg-blue-500 text-white text-sm font-bold py-1 px-4 text-center">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-3">{plan.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.recommended
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Success Stories from Daycare Providers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh M.",
                center: "Sunshine Kids Daycare",
                text: "Our enrollment increased by 40% after using the header banner for just 2 weeks!"
              },
              {
                name: "Priya S.",
                center: "Little Stars Preschool",
                text: "The popup ad brought us 15 new inquiries in the first week. Worth every rupee."
              },
              {
                name: "Vikram J.",
                center: "Happy Feet Daycare",
                text: "The side banner gave us constant visibility at an affordable price. Great ROI!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.center}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Advertise With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp className="w-10 h-10" />, title: "Targeted Audience", desc: "Reach parents actively searching for daycare solutions" },
              { icon: <Shield className="w-10 h-10" />, title: "Verified Leads", desc: "All inquiries are from genuine parents with real needs" },
              { icon: <Award className="w-10 h-10" />, title: "Premium Positioning", desc: "Stand out from competitors with prominent ad placements" },
              { icon: <BarChart3 className="w-10 h-10" />, title: "Performance Analytics", desc: "Track clicks, views, and conversions in real-time" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-blue-600 mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Daycare Business?</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Join thousands of successful daycare providers who are already reaching more parents every day
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-50 transition-colors">
            Start Your Ad Campaign Today
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdsPage