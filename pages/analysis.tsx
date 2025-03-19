import React, { useEffect } from 'react'

export default function analysis() {

    useEffect(()=>{
        localStorage.removeItem("selectedItems");
        localStorage.removeItem("Category");
    },[])
    // const analyzeData = async (values) => {
//     try {
//         const response = await fetch('http://localhost:5000/analyze', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ values: values })
//         });
//         const result = await response.json();
//         // result.future_predictions will contain the 8 predicted future values
//         return result;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 p-10">
        {/* Header Section */}
        <div className="text-center mb-10 bg-white/70 backdrop-blur-md py-10 px-6 rounded-xl shadow-lg">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Advanced analysis for Selected Category
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Witness your investment allocation options in detail and dive into further analysis opportunities.
          </p>
          <p className="text-sm text-slate-500 italic max-w-2xl mx-auto">
            Disclaimer: This tool is for informational purposes only and does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
    </div>
  )
}

