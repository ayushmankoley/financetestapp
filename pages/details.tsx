import React, {useState,useRef} from 'react'
import { useEffect } from 'react';
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

export default function details() {
    
    // const params = useParams();
    // const {id} = params;
    const [details,setdetails] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
          const storedRequest = localStorage.getItem("apiResponse");
      
          if (storedRequest) {
            const requestBody = storedRequest;
            console.log(storedRequest);
            fetch("/api/detail-show", {
              method: "POST", 
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(requestBody)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log("Response Data:", data);
              setdetails(data);
              setLoading(false);
              localStorage.removeItem("apiResponse");
            })
            .catch(error => {
              console.error("Fetch error:", error);
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        } catch (e) {
          console.error("Error accessing localStorage:", e);
          setLoading(false);
        }
      }, []);

      const handleAdvancedAnalysis = (category:any,items : any) => {
        if (Array.isArray(items)) {
          localStorage.setItem("Category",category);
          localStorage.setItem("selectedItems", JSON.stringify(items)); // Store items array
          console.log(`Stored items in localStorage`, items);
          router.push("/analysis");
        } else {
          console.warn("No data available to store.");
        }
      };
      
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
      
        {/* Loading Animation */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-semibold text-slate-700">Loading your investment data...</p>
          </div>
        ) : (
          /* Grid Layout with Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {Object.entries(details || {}).length > 0 ? (
              Object.entries(details || {}).map(([category, items]) => (
                <div key={category} className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-md flex flex-col">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{category}</h2>
                  <p className="text-slate-700 mb-4">Investment insights for {category}.</p>
                  <ul className="text-left text-slate-800 space-y-2 flex-grow">
                    {Array.isArray(items) ? (
                      items.map((item, index) => (
                        <li key={index} className="flex justify-between font-semibold py-2">
                          <span>{item.name}</span>
                          <span className="text-blue-600">{item.weight}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No data available</li>
                    )}
                  </ul>
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-800 text-white py-4 text-lg mt-4 rounded-lg" 
                    onClick={()=>handleAdvancedAnalysis(category,items)}
                  >
                    Advanced Analysis
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center p-8 bg-white/70 backdrop-blur-md rounded-lg shadow-md">
                <p className="text-xl text-slate-700">No investment data available. Please try again later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
}