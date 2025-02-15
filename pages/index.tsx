import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ChevronRight, PieChart, Shield, TrendingUp, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const LandingPage = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * (1000 - 900) + 900);
    setVisitorCount(randomStart);
    
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoClick = () => {
    window.open('https://youtube.com/your-video-link', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
      {/* Responsive Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-blue-600 font-bold text-4xl">Kautilya</div>
            <div className="hidden md:flex space-x-4">
              <Link href="/planner">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Financial Planner
                </Button>
              </Link>
            </div>
            <button className="md:hidden text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-blue-900 mb-4">
              Kautilya
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold italic text-blue-600">
              Smart Investing, Simplified With AI
              </h2>
            </div>
            <p className="text-base md:text-lg text-blue-700">
            Harness the power of AI with Kautilya—your intelligent investment planner powered by Gemini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/planner" className="w-full sm:w-auto">
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Start Your Financial Journey
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={handleVideoClick}
              >
                Watch Demo <Play className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/finance-hero.jpg"
                alt="Banking Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">500+</div>
            <p className="text-blue-700">Portfolios Recommended</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
              {visitorCount.toLocaleString()}
            </div>
            <p className="text-blue-700">Visitors and Counting</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;