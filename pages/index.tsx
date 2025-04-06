import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import SplineSceneBasic with no SSR to prevent hydration errors
const SplineSceneBasic = dynamic(
  () => import('@/components/ui/SplineSceneBasic').then(mod => mod.SplineSceneBasic),
  { ssr: false }
);

const LandingPage = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);
    
    const randomStart = Math.floor(Math.random() * (1000 - 900) + 900);
    setVisitorCount(randomStart);
    
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoClick = () => {
    window.open('https://youtu.be/hlO5l18EsUs', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
      {/* Floating island navbar design - stretched to max width */}
      <div className="flex justify-center w-full px-4 absolute top-4 z-50">
        <nav className="bg-white/80 backdrop-blur-md shadow-lg rounded-full w-[100%] py-3 px-8">
          <div className="flex justify-between items-center">
            <div className="text-blue-600 font-bold text-4xl">Kautilya</div>
            <div className="hidden md:flex">
              <Link href="/planner">
                <RainbowButton className="text-white rounded-full px-6">
                  Financial Planner
                </RainbowButton>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/planner">
                <RainbowButton className="text-white text-sm px-4 py-1 rounded-full">
                  Planner
                </RainbowButton>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      
      {/* Main content area - adjusted to account for floating navbar */}
      <div className="flex items-center justify-center w-full h-full py-0 px-0">
        <div className="w-full h-[100vh] relative">
          {isClient && (
            <div className="w-full h-full bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden relative">
              {/* Rearranged layout - Spline on right, content on left */}
              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 z-10">
                {/* Left side: Text content */}
                <div className="flex flex-col justify-center items-start p-8 z-20 md:bg-transparent">
                  {/* Blur backdrop for mobile only - appears behind text but above Spline */}
                  <div className="absolute inset-0 md:hidden bg-white/80 backdrop-blur-md z-10"></div>
                  
                  <div className="space-y-4 mb-8 max-w-lg relative z-20">
                    <h1 className="text-4xl md:text-9xl font-bold tracking-tight text-blue-900">
                      Kautilya
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold italic text-blue-600">
                      Smart Investing, Simplified With AI
                    </h2>
                    <p className="text-base md:text-lg text-blue-700">
                      Harness the power of AI with Kautilya—your intelligent investment planner powered by Gemini & Machine Learning.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-20">
                    <Link href="/planner" className="w-full sm:w-auto">
                      <RainbowButton className="w-full text-white">
                        Start Your Financial Journey
                      </RainbowButton>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={handleVideoClick}
                    >
                      Watch Demo <Play className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full relative z-20">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                      <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">500+</div>
                      <p className="text-blue-700 text-sm">Portfolios Recommended</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                      <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">
                        {visitorCount.toLocaleString()}
                      </div>
                      <p className="text-blue-700 text-sm">Visitors and Counting</p>
                    </div>
                  </div>
                </div>
                
                {/* Right side: Spline component */}
                <div className="hidden md:block relative h-full">
                  <SplineSceneBasic />
                </div>
              </div>
              
              {/* Mobile view: Spline in background */}
              <div className="md:hidden absolute inset-0 z-0">
                <SplineSceneBasic />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
