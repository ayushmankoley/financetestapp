import React, {useState,useRef} from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button';
export default function details() {
    
    // const params = useParams();
    // const {id} = params;

    const equityShares = [
        { name: "Apple Inc.", weight: "25%" },
        { name: "Microsoft", weight: "20%" },
        { name: "Tesla", weight: "15%" },
        { name: "Google", weight: "15%" },
        { name: "Amazon", weight: "10%" },
        { name: "Nvidia", weight: "15%" },

      ];
      
      const debtFunds = [
        { name: "HDFC Corporate Bond Fund", weight: "30%" },
        { name: "SBI Dynamic Bond Fund", weight: "20%" },
        { name: "ICICI Pru Gilt Fund", weight: "20%" },
        { name: "Kotak Debt Fund", weight: "15%" },
        { name: "Axis Treasury Advantage", weight: "10%" },
        { name: "Franklin India Ultra Short Bond", weight: "5%" }
      ];
      
      const goldETFs = [
        { name: "Nippon India Gold ETF", weight: "40%" },
        { name: "HDFC Gold ETF", weight: "25%" },
        { name: "SBI Gold ETF", weight: "15%" },
        { name: "ICICI Prudential Gold ETF", weight: "10%" },
        { name: "Axis Gold ETF", weight: "5%" },
        { name: "Aditya Birla Sun Life Gold ETF", weight: "5%" }
      ];

      const mutualFunds = [
        { name: "HDFC Equity Fund", weight: "20%" },
        { name: "SBI Bluechip Fund", weight: "18%" },
        { name: "Axis Long Term Equity", weight: "15%" },
        { name: "ICICI Prudential Value Discovery Fund", weight: "22%" },
        { name: "Kotak Emerging Equity Fund", weight: "25%" }
      ];
      

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 p-10">
        {/* Header Section */}
        <div className="text-center mb-10 bg-white/70 backdrop-blur-md py-10 px-6 rounded-xl shadow-lg">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Detailed Financial Advisory
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Witness your investment allocation options in detail and dive into further analysis opportunities.
          </p>
          <p className="text-sm text-slate-500 italic max-w-2xl mx-auto">
            Disclaimer: This tool is for informational purposes only and does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      
        {/* Grid Layout with Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
  {/* Equity Shares Card */}
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Equity Shares</h2>
    <p className="text-slate-700 mb-4">
      Explore diversified investment opportunities tailored to your risk appetite and financial goals.
    </p>
    <ul className="text-left text-slate-800 space-y-2">
      {equityShares.map((share, index) => (
        <li key={index} className="flex justify-between font-semibold py-2">
          <span>{share.name}</span> 
          <span className="text-blue-600">{share.weight}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full bg-blue-600 hover:bg-blue-800 text-white py-6 text-lg mt-8">
      Advanced Analysis
    </Button>
  </div>

  {/* Debt Funds Card */}
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Debt Funds</h2>
    <p className="text-slate-700 mb-4">
      Get real-time insights and detailed analytics on market trends and financial movements.
    </p>
    <ul className="text-left text-slate-800 space-y-2">
      {debtFunds.map((fund, index) => (
        <li key={index} className="flex justify-between font-semibold py-2">
          <span>{fund.name}</span> 
          <span className="text-green-600">{fund.weight}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full bg-blue-600 hover:bg-blue-800 text-white py-6 text-lg mt-8">
      Advanced Analysis
    </Button>
  </div>

  {/* Gold ETFs Card */}
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Gold ETFs</h2>
    <p className="text-slate-700 mb-4">
      Evaluate the potential risks associated with your investments and secure your financial future.
    </p>
    <ul className="text-left text-slate-800 space-y-2">
      {goldETFs.map((etf, index) => (
        <li key={index} className="flex justify-between font-semibold py-2">
          <span>{etf.name}</span> 
          <span className="text-yellow-600">{etf.weight}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full bg-blue-600 hover:bg-blue-800 text-white py-6 text-lg mt-8">
      Advanced Analysis
    </Button>
  </div>

  {/* Mutual Funds Card */}
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Mutual Funds</h2>
    <p className="text-slate-700 mb-4">
      Discover a range of mutual funds designed to help you achieve long-term financial stability.
    </p>
    <ul className="text-left text-slate-800 space-y-2">
      {mutualFunds.map((fund, index) => (
        <li key={index} className="flex justify-between font-semibold py-2">
          <span>{fund.name}</span> 
          <span className="text-purple-600">{fund.weight}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full bg-blue-600 hover:bg-blue-800 text-white py-6 text-lg mt-8">
      Advanced Analysis
    </Button>
  </div>
</div>


      </div>
      
    
  )
}
