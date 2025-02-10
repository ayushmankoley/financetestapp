import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp, AlertCircle, DollarSign, Target, Clock, BarChart, Wallet, TrendingUp } from 'lucide-react';

const PortfolioPlanner = () => {
  const [formData, setFormData] = useState({
    rebalancingFrequency: 'quarterly',
    investmentStyle: 'passive',
    taxOptimization: 'taxEfficient',
    esgPreference: 'none',
    initialAmount: '',
    goalAmount: '',
    goalName: '',
    timePeriod: '5', // Default value
    riskTolerance: 50,
    showAdvanced: false,
    diversificationPreference: '',
    monthlyContribution: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Generate years array for dropdown
  const years = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate investment plan');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleAdvanced = () => {
    setFormData(prev => ({
      ...prev,
      showAdvanced: !prev.showAdvanced
    }));
  };

  // Enhanced Slider UI
  const getRiskLabel = (value) => {
    if (value <= 30) return 'Conservative';
    if (value <= 70) return 'Moderate';
    return 'Aggressive';
  };

  const getRiskColor = (value) => {
    if (value <= 30) return 'text-blue-600';
    if (value <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Sample empty state data for the pie chart
  const emptyChartData = [
    { name: 'Stocks', percentage: 0 },
    { name: 'Bonds', percentage: 0 },
    { name: 'Cash', percentage: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            AI-Powered Portfolio Planner
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create a personalized investment strategy aligned with your financial goals using our advanced AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Investment Profile</CardTitle>
                <CardDescription>
                  Fill in your investment details to get a personalized portfolio recommendation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                        1
                      </div>
                      Basic Information
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Initial Investment
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            name="initialAmount"
                            value={formData.initialAmount}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                            required
                            className="pl-8"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Goal Amount
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            name="goalAmount"
                            value={formData.goalAmount}
                            onChange={handleInputChange}
                            placeholder="Target amount"
                            required
                            className="pl-8"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Goal Name
                      </label>
                      <Input
                        type="text"
                        name="goalName"
                        value={formData.goalName}
                        onChange={handleInputChange}
                        placeholder="e.g., Retirement Fund, House Down Payment"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Timeline & Risk */}
                  <div className="space-y-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                        2
                      </div>
                      Timeline & Risk Profile
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Investment Timeline
                        </label>
                        <Select 
                          value={formData.timePeriod}
                          onValueChange={(value) => handleInputChange({
                            target: { name: 'timePeriod', value }
                          })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year} {year === '1' ? 'year' : 'years'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <BarChart className="w-4 h-4" />
                          Risk Tolerance
                        </label>
                        <div className="space-y-6">
                          <Slider
                            value={[formData.riskTolerance]}
                            onValueChange={(value) => handleInputChange({
                              target: { name: 'riskTolerance', value: value[0] }
                            })}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${getRiskColor(formData.riskTolerance)}`}>
                              {getRiskLabel(formData.riskTolerance)} ({formData.riskTolerance}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="pt-6 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleAdvanced}
                      className="w-full flex items-center justify-between hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Advanced Options
                      </span>
                      {formData.showAdvanced ? <ChevronUp /> : <ChevronDown />}
                    </Button>

                    {formData.showAdvanced && (
                      <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Monthly Contribution
                          </label>
                          <div className="relative">
                            <Input
                              type="number"
                              name="monthlyContribution"
                              value={formData.monthlyContribution}
                              onChange={handleInputChange}
                              placeholder="Enter monthly amount"
                              className="pl-8"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Investment Preferences
                          </label>
                          <Input
                            type="text"
                            name="diversificationPreference"
                            value={formData.diversificationPreference}
                            onChange={handleInputChange}
                            placeholder="e.g., Focus on sustainable or technology investments"
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                        Generating Your Plan...
                      </div>
                    ) : (
                      'Generate Investment Plan'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Section - Always visible with empty state */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Your Investment Plan</CardTitle>
                  <CardDescription>
                    {result ? 'Recommended portfolio allocation based on your goals' : 'Fill out the form to generate your personalized plan'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Pie Chart with increased height and better spacing */}
                    <div className="h-96"> {/* Increased height */}
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={result?.allocation || emptyChartData}
                            dataKey="percentage"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100} // Increased outer radius
                            paddingAngle={2} // Added padding between segments
                            label={({ name, percentage }) => 
                              percentage > 0 ? `${name} (${percentage}%)` : ''
                            }
                          >
                            {(result?.allocation || emptyChartData).map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={result ? `hsl(${index * (360 / (result.allocation.length || 1))}, 70%, 50%)` : '#e5e7eb'}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Allocation Details */}
                    {result ? (
                      <>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900">Detailed Allocation</h4>
                          {result.allocation.map((item) => (
                            <div
                              key={item.name}
                              className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                            >
                              <span className="text-slate-700">{item.name}</span>
                              <span className="font-semibold">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>

                        {/* Strategy Explanation */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900">Strategy Overview</h4>
                          <p className="text-slate-600 text-sm">{result.explanation}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-slate-500 py-4">
                        <p>Complete the form on the left to see your personalized investment allocation and strategy.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPlanner;