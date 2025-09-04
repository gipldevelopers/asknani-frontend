
"use client";
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Baby } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
export default function AuthForms({ mode = 'login' }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: '',
    childInfo: ''
  });
  const [isParent, setIsParent] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const socialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="md:flex">
          {/* Left Side - Illustration/Info */}
          <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Ask Nani</h1>
              <p className="opacity-90">Find the perfect daycare for your little ones</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">1</span>
                </div>
                <p>Discover trusted daycares near you</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <p>Read genuine parent reviews</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <p>Book with confidence</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-lg p-4">
              <p className="text-sm italic">"Found the perfect daycare for my toddler within days of using askNani!"</p>
              <p className="text-sm font-medium mt-2">- Priya S., Mumbai</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {mode === 'login' ? 'Sign in to continue your search' : 'Join thousands of parents finding quality childcare'}
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <button
                onClick={() => socialLogin('google')}
                className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FcGoogle className="h-5 w-5 text-red-500" />
              </button>


            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="flex space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setIsParent(true)}
                      className={`flex-1 py-2 rounded-lg border ${isParent ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300'}`}
                    >
                      I'm a Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsParent(false)}
                      className={`flex-1 py-2 rounded-lg border ${!isParent ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300'}`}
                    >
                      Daycare Provider
                    </button>
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {mode === 'signup' && isParent && (
                <>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="childName"
                        placeholder="Child's Name"
                        value={formData.childName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="childAge"
                        placeholder="Child's Age"
                        value={formData.childAge}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary transition-colors font-medium shadow-md hover:shadow-lg"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <a
                  href={mode === 'login' ? '/signup' : '/login'}
                  className="text-primary hover:text-indigo-500 font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </a>
              </p>
            </div>

            {mode === 'signup' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-primary hover:text-indigo-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:text-indigo-500">
                    Privacy Policy
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}