import React from 'react';
import { ChevronRight, PieChart, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Investment Planning Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              AI-powered portfolio planning to help you achieve your financial goals
            </p>
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full"
              onClick={() => window.location.href = '/planner'}
            >
              Start Planning Now
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600">
              Professional-grade investment planning powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<PieChart className="w-12 h-12 text-blue-600" />}
              title="Smart Portfolio Allocation"
              description="Advanced algorithms optimize your investment mix based on your goals and risk tolerance"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-blue-600" />}
              title="Risk Management"
              description="Sophisticated risk analysis ensures your portfolio aligns with your comfort level"
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-blue-600" />}
              title="Goal-Based Planning"
              description="Customized investment strategies designed to help you reach your financial targets"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>Blog</li>
                <li>Help Center</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;