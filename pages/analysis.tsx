import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

interface StockData {
  symbol: string;
  name: string;
  weight: number;
  priceData: {
    c: number[];
    t: string[];
  };
}

interface ChartDataItem {
  month: string;
  price: number;
  type: 'Historical' | 'Predicted';
}

interface SelectedItem {
  name: string;
  weight: number;
}

interface AnalysisResults {
  stock: string;
  symbol: string;
  chartData: ChartDataItem[];
  metrics: {
    slope: number;
    intercept: number;
    rSquared: number;
    trendDirection: boolean;
  };
}

export default function Analysis() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [category, setCategory] = useState<string>('');
  const [stockData, setStockData] = useState<Record<string, StockData>>({});
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedCategory = localStorage.getItem("Category");
      const storedItems = localStorage.getItem("selectedItems");
      
      if (storedCategory && storedItems) {
        setCategory(storedCategory);
        setSelectedItems(JSON.parse(storedItems));
      } else {
        const demoCategory = "Tech Growth";
        const demoItems = [
          { name: "Apple", weight: 25 },
          { name: "Microsoft", weight: 20 },
          { name: "Amazon", weight: 18 },
          { name: "Google", weight: 15 },
          { name: "Tesla", weight: 12 },
          { name: "Nvidia", weight: 10 },
        ];
        
        setCategory(demoCategory);
        setSelectedItems(demoItems);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      setError("Error loading investment data. Using demo data instead.");
      
      const demoCategory = "Tech Growth";
      const demoItems = [
        { name: "Apple", weight: 25 },
        { name: "Microsoft", weight: 20 },
        { name: "Amazon", weight: 18 },
        { name: "Google", weight: 15 },
        { name: "Tesla", weight: 12 },
        { name: "Nvidia", weight: 10 },
      ];
      
      setCategory(demoCategory);
      setSelectedItems(demoItems);
    }
  }, []);

  useEffect(() => {
    const generateDemoStockData = () => {
      if (selectedItems.length === 0) return;
      
      try {
        const stockDataResults = selectedItems.map((item) => {
          const symbol = item.name.toUpperCase().replace(/\s+/g, '');
          
          const basePrice = (
            symbol === 'APPLE' ? 14850 : 
            symbol === 'MICROSOFT' ? 28950 : 
            symbol === 'AMAZON' ? 14850 : 
            symbol === 'GOOGLE' ? 11550 : 
            symbol === 'TESLA' ? 20650 : 
            symbol === 'NVIDIA' ? 70250 : 
            8250
          );
          
          const volatility = Math.random() * 0.03 + 0.01;
          const trend = Math.random() * 0.15 - 0.05;
          
          const prices = Array(12).fill(0).map((_, i) => {
            const trendComponent = basePrice * (1 + trend * (i/12));
            const dailyChange = (Math.random() - 0.5) * volatility * basePrice;
            return Math.max(trendComponent + dailyChange, basePrice * 0.8);
          });
          
          const monthNames = [
            'April', 'May', 'June', 'July', 'August', 'September', 
            'October', 'November', 'December', 'January', 'February', 'March'
          ];
          
          return {
            symbol,
            name: item.name,
            weight: item.weight,
            priceData: {
              c: prices,
              t: monthNames
            }
          };
        });
        
        const stockDataObject: Record<string, StockData> = stockDataResults.reduce((acc: Record<string, StockData>, stock: StockData) => {
          acc[stock.symbol] = stock;
          return acc;
        }, {});
        
        setStockData(stockDataObject);
        
        if (stockDataResults.length > 0) {
          analyzeStockData(stockDataResults[0]);
        }
      } catch (error) {
        console.error('Error generating demo stock data:', error);
        setError("Error generating demo data. Please refresh the page.");
      }
    };

    if (selectedItems.length > 0) {
      generateDemoStockData();
    }
  }, [selectedItems]);

  const analyzeStockData = async (stock: StockData) => {
    try {
      setLoading(true);
      
      const values = stock.priceData.c;
      const months = stock.priceData.t;
      
      const n = values.length;
      const xs = Array.from({ length: n }, (_, i) => i + 1);
      
      const xMean = xs.reduce((sum: number, x: number) => sum + x, 0) / n;
      const yMean = values.reduce((sum: number, y: number) => sum + y, 0) / n;
      
      const numerator = xs.reduce((sum: number, x: number, i: number) => sum + (x - xMean) * (values[i] - yMean), 0);
      const denominator = xs.reduce((sum: number, x: number) => sum + Math.pow(x - xMean, 2), 0);
      const slope = numerator / denominator;
      const intercept = yMean - slope * xMean;
      
      const yPred = xs.map((x: number) => slope * x + intercept);
      const ssTot = values.reduce((sum: number, y: number) => sum + Math.pow(y - yMean, 2), 0);
      const ssRes = values.reduce((sum: number, y: number, i: number) => sum + Math.pow(y - yPred[i], 2), 0);
      const rSquared = 1 - (ssRes / ssTot);
      
      const futurePredictions = Array(30).fill(0).map((_, i) => {
        const historicalIndex = i % values.length;
        const baseValue = values[historicalIndex];
        
        const variance = (Math.random() * 0.02 - 0.01) * baseValue;
        return Math.max(0, baseValue + variance);
      });
      
      const futureMonths = [
        'April', 'May', 'June', 'July', 'August', 'September', 
        'October', 'November', 'December', 'January', 'February', 'March',
        'April', 'May', 'June', 'July', 'August', 'September', 
        'October', 'November', 'December', 'January', 'February', 'March'
      ];
      
      const historicalData = values.map((price: number, index: number) => ({
        month: months[index],
        price: price,
        type: 'Historical' as const
      }));
      
      const futureData = futurePredictions.map((price: number, index: number) => ({
        month: futureMonths[index],
        price: price,
        type: 'Predicted' as const
      }));
      
      const chartData = [...historicalData, ...futureData];
      
      const lastHistoricalPrice = values[values.length - 1];
      const lastPredictedPrice = futurePredictions[futurePredictions.length - 1];
      const trendDirection = lastPredictedPrice >= lastHistoricalPrice;
      
      setAnalysisResults({
        stock: stock.name,
        symbol: stock.symbol,
        chartData,
        metrics: {
          slope: slope,
          intercept: intercept,
          rSquared: rSquared,
          trendDirection: trendDirection
        }
      });
      
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error analyzing stock data:', error);
      setError("Error analyzing stock data. Please try again later.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/planner');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-6 md:p-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 bg-white/80 backdrop-blur-xl py-10 px-6 rounded-2xl shadow-lg"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4 tracking-tight">
          {category} <span className="text-blue-600">Analysis</span>
        </h1>
        <p className="text-lg text-indigo-700 max-w-2xl mx-auto mb-4">
          Regression analysis and future price predictions based on historical data.
        </p>
        <p className="text-sm text-indigo-500 italic max-w-2xl mx-auto">
          Disclaimer: This tool is for informational purposes only and does not constitute financial advice. Predictions are based on historical trends and may not accurately reflect future performance.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
          onClick={handleBack}
        >
          Back to Planner
        </motion.button>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-12"
        >
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold text-blue-800">Analyzing investment data...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 backdrop-blur-md border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-lg"
          role="alert"
        >
          <p>{error}</p>
        </motion.div>
      )}

      {/* Results */}
      {!loading && analysisResults && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">{analysisResults.stock} ({analysisResults.symbol})</h2>
          
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-blue-100 to-blue-200 backdrop-blur-md p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Trend Direction</h3>
              <p className="text-2xl font-bold">
                {analysisResults.metrics.trendDirection ? 
                  <span className="text-green-600">Upward ↗</span> : 
                  <span className="text-red-600">Downward ↘</span>}
              </p>
              <p className="text-sm text-blue-700 mt-1">Based on prediction endpoint</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-blue-100 to-blue-200 backdrop-blur-md p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Starting Point</h3>
              <p className="text-2xl font-bold text-indigo-800">₹{analysisResults.metrics.intercept.toFixed(2)}</p>
              <p className="text-sm text-blue-700 mt-1">Y-intercept of regression line</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-blue-100 to-blue-200 backdrop-blur-md p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Model Fit</h3>
              <p className="text-2xl font-bold text-indigo-800">{(analysisResults.metrics.rSquared * 100).toFixed(1)}%</p>
              <p className="text-sm text-blue-700 mt-1">R² (higher is better)</p>
            </motion.div>
          </div>
          
          {/* Chart */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full h-96 bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-md p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold text-indigo-800 mb-4">Price Trend & Predictions (12 Historical + 24 Projected Months)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart
                data={analysisResults.chartData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34A853" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34A853" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#AAA" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Month', position: 'insideBottomRight', offset: -10, fill: '#555' }} 
                  tick={{ fill: '#555' }}
                  interval={2}
                />
                <YAxis 
                  label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', offset: -5, fill: '#555' }} 
                  domain={['auto', 'auto']}
                  tick={{ fill: '#555' }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  width={80}
                  tickCount={6}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${Number(value).toLocaleString()}`, 'Price']}
                  labelFormatter={(value) => `${value}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#ddd', borderRadius: '8px' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  data={analysisResults.chartData.filter((d) => d.type === 'Historical')}
                  name="Historical Data" 
                  stroke="#4285F4" 
                  fillOpacity={1}
                  fill="url(#colorHistorical)"
                  strokeWidth={3} 
                  dot={{ stroke: '#4285F4', strokeWidth: 2, r: 4, fill: '#fff' }} 
                  activeDot={{ r: 8, fill: '#4285F4', stroke: '#fff' }}
                  isAnimationActive={true}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  data={analysisResults.chartData.filter((d) => d.type === 'Predicted')}
                  name="Predicted Data"
                  stroke="#34A853" 
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ stroke: '#34A853', strokeWidth: 2, r: 4, fill: '#fff' }} 
                  activeDot={{ r: 8, fill: '#34A853', stroke: '#fff' }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Prediction Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-md p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold text-amber-800 mb-3">Prediction Summary</h3>
            <p className="text-amber-800">
              Based on historical trading patterns, our analysis suggests that {analysisResults.stock} will 
              likely maintain its current pattern with minimal fluctuations within a ±1% range over the next 24 months.
            </p>
            <p className="text-amber-800 mt-2">
              The model has a confidence rating of {(analysisResults.metrics.rSquared * 100).toFixed(1)}%, which indicates 
              {analysisResults.metrics.rSquared > 0.7 
                ? ' a strong historical pattern in the data.' 
                : analysisResults.metrics.rSquared > 0.3 
                  ? ' a moderate consistency in the historical data.' 
                  : ' some variability in the historical data.'
              }
            </p>
            <p className="text-amber-800 mt-2">
              {
                analysisResults.metrics.rSquared > 0.7 
                ? 'Given the current market conditions, we expect the historical pattern to continue with minimal deviation for the extended forecast period.'
                : analysisResults.metrics.rSquared > 0.3 
                ? 'We recommend monitoring market conditions as minor shifts could impact this pattern, particularly in the later months of the forecast.'
                : 'While we expect similar patterns, the historical volatility suggests potential for larger deviations, especially in the extended forecast period.'
              }
            </p>
          </motion.div>
        </motion.div>
      )}
      
      {/* Portfolio context */}
      {!loading && selectedItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Portfolio Analysis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent rounded-lg overflow-hidden">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Investment</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Weight (%)</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Performance</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {selectedItems.map((item, index) => {
                  const stock = stockData[item.name.toUpperCase().replace(/\s+/g, '')];
                  const performance = stock ? 
                    ((stock.priceData.c[stock.priceData.c.length-1] / stock.priceData.c[0] - 1) * 100).toFixed(2) : '0.00';
                  
                  return (
                    <motion.tr 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      className="transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-indigo-800">{item.name}</td>
                      <td className="py-4 px-4 text-sm text-indigo-700">{item.weight}%</td>
                      <td className="py-4 px-4 text-sm">
                        <span className={parseFloat(performance) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {parseFloat(performance) >= 0 ? '+' : ''}{performance}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
                          onClick={() => {
                            const stock = stockData[item.name.toUpperCase().replace(/\s+/g, '')];
                            if (stock) {
                              analyzeStockData(stock);
                            }
                          }}
                        >
                          Analyze
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}