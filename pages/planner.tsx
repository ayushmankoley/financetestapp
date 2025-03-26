import React, { useState, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp, AlertCircle, IndianRupee, Target, Clock, BarChart, Wallet, TrendingUp, Download} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';


const PortfolioPlanner = () => {
  const [formData, setFormData] = useState({
    rebalancingFrequency: 'quarterly',
    investmentStyle: 'noPreference',
    taxOptimization: 'taxEfficient',
    cryptoPreference: 'No',
    initialAmount: '',
    goalAmount: '',
    goalName: '',
    timePeriod: '5',
    riskTolerance: 'low',
    showAdvanced: false,
    diversificationPreference: '',
    monthlyContribution: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface AllocationItem {
    name: string;
    percentage: number;
  }
  
  interface PlanResult {
    allocation: AllocationItem[];
    explanation: string;
  }
  
  const [result, setResult] = useState<PlanResult | null>(null);
  

  const resultCardRef = useRef<HTMLDivElement | null>(null);

  const years = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        throw new Error('Failed to generate investment plan, Please Try Again!');
      }

      const data = await response.json();
      setResult(data);
      localStorage.setItem("apiResponse",data);
      console.log(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
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

  const handleRiskSelect = (risk: 'low' | 'medium' | 'high') => {
    setFormData(prev => ({
      ...prev,
      riskTolerance: risk
    }));
  };

  const getRiskButtonClasses = (risk: 'low' | 'medium' | 'high') => {
    const baseClasses = "flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200";
    
    if (formData.riskTolerance === risk) {
      switch (risk) {
        case 'low':
          return `${baseClasses} bg-green-500 text-white ring-2 ring-green-500 ring-offset-2`;
        case 'medium':
          return `${baseClasses} bg-yellow-500 text-white ring-2 ring-yellow-500 ring-offset-2`;
        case 'high':
          return `${baseClasses} bg-red-500 text-white ring-2 ring-red-500 ring-offset-2`;
      }
    }
    
    return `${baseClasses} bg-slate-100 text-slate-700 hover:bg-slate-200`;
  };

  const generatePDF = async () => {
    if (!resultCardRef.current || !result) return;
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${formData.goalName || 'Investment-Plan'}-${timestamp}.pdf`;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      }) as jsPDF & {
        internal: {
          getNumberOfPages: () => number;
          pageSize: {
            width: number;
            height: number;
            getWidth: () => number;
            getHeight: () => number;
          };
        };
      };
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (2 * margin);
      
      // Reduced header height from 30 to 25
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI-Powered Portfolio Planner - By Kautilya', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18); // Reduced from 16
      pdf.text(`Investment Plan: ${formData.goalName || 'Your Financial Goal'}`, pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Plan Summary', margin, 40); // Adjusted from 55
      pdf.setFont('helvetica', 'normal');
      
      pdf.setFillColor(245, 247, 250); 
      pdf.rect(margin, 45, contentWidth, 30, 'F'); // Adjusted from 60
      pdf.setDrawColor(220, 220, 220);
      pdf.rect(margin, 45, contentWidth, 30, 'S'); // Adjusted from 60
      
      pdf.line(margin, 55, margin + contentWidth, 55); // Adjusted from 70
      pdf.line(pageWidth / 2, 45, pageWidth / 2, 75); // Adjusted from 60, 90
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Goal:', margin + 2, 52); // Adjusted from 67
      pdf.text('Initial Investment:', margin + 2, 62); // Adjusted from 77
      pdf.text('Timeline:', margin + 2, 72); // Adjusted from 87
      
      pdf.text('Target Amount:', pageWidth / 2 + 2, 52); // Adjusted from 67
      pdf.text('Monthly Contribution:', pageWidth / 2 + 2, 62); // Adjusted from 77
      pdf.text('Risk Tolerance:', pageWidth / 2 + 2, 72); // Adjusted from 87
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formData.goalName || '-', margin + 50, 52); // Adjusted from 67
      pdf.text(`Rs ${parseInt(formData.initialAmount).toLocaleString() || '0'}`, margin + 50, 62); // Adjusted from 77
      pdf.text(`${formData.timePeriod || '0'} years`, margin + 50, 72); // Adjusted from 87
      
      pdf.text(`Rs ${parseInt(formData.goalAmount).toLocaleString() || '0'}`, pageWidth / 2 + 50, 52); // Adjusted from 67
      pdf.text(`Rs ${parseInt(formData.monthlyContribution).toLocaleString() || '0'}/month`, pageWidth / 2 + 50, 62); // Adjusted from 77
      pdf.text(formData.riskTolerance.charAt(0).toUpperCase() + formData.riskTolerance.slice(1), pageWidth / 2 + 50, 72); // Adjusted from 87
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Recommended Portfolio Allocation', margin, 90); // Adjusted from 105
      
      const cardElement = resultCardRef.current;
      const chartElement = cardElement.querySelector('.recharts-wrapper') as HTMLElement | null;
      
      if (chartElement) {
        // Capture chart with improved settings
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          backgroundColor: '#FFFFFF',
          logging: false,
          useCORS: true,
          ignoreElements: (element) => {
            return element.classList.contains('recharts-legend-wrapper');
          }
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate appropriate image size while maintaining aspect ratio
        const maxImgHeight = 130; // Increased chart height limit
        const imgWidth = contentWidth;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Ensure the chart doesn't exceed our maximum height
        if (imgHeight > maxImgHeight) {
          imgHeight = maxImgHeight;
          // Recalculate width to maintain aspect ratio
          const newWidth = canvas.width * imgHeight / canvas.height;
          // Center the image
          const leftMargin = margin + (contentWidth - newWidth) / 2;
          pdf.addImage(imgData, 'PNG', leftMargin, 90, newWidth, imgHeight);
        } else {
          pdf.addImage(imgData, 'PNG', margin, 90, imgWidth, imgHeight);
        }
        
        const yAfterChart = 70 + imgHeight;
        
        // Always put Detailed Allocation on current page
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Detailed Allocation', margin, yAfterChart);
        let yPosition = yAfterChart + 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        const colors = ['#ef4444', '#22c55e', '#3b82f6', '#f97316', '#8b5cf6'];
        
        // Helper function to check if we need a new page
        const checkForNewPage = (currentY: number, neededSpace: number) => {
          if (currentY + neededSpace > pageHeight - 25) {
            pdf.addPage();
            return 20; // Return starting Y position for new page
          }
          return currentY;
        };
        
        // Draw allocation items
        result.allocation.forEach((item, index) => {
          yPosition = checkForNewPage(yPosition, 15);
          
          const colorIndex = index % colors.length;
          const { r, g, b } = hexToRgb(colors[colorIndex]);
          
          pdf.setFillColor(r, g, b);
          pdf.rect(margin, yPosition - 4, 8, 8, 'F');
          
          pdf.text(`${item.name}`, margin + 15, yPosition);
          pdf.text(`${item.percentage}%`, margin + contentWidth - 20, yPosition, { align: 'right' });
          
          yPosition += 10;
        });
        
        // Always start Strategy Overview on a new page
        pdf.addPage();
        yPosition = 20;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Strategy Overview', margin, yPosition);
        yPosition += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        const explanationText = result.explanation || '';
        const splitText = pdf.splitTextToSize(explanationText, contentWidth);
        
        pdf.text(splitText, margin, yPosition);
      }
      
      // Add footer to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        pdf.setFillColor(232, 240, 254);
        pdf.rect(0, pdf.internal.pageSize.getHeight() - 15, pageWidth, 15, 'F');
        
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Disclaimer: This plan is for informational purposes only and does not constitute financial advice.', 
          pageWidth / 2, pdf.internal.pageSize.getHeight() - 8, { align: 'center' });
        pdf.text('© 2025 Kautilya. All rights reserved.', 
          pageWidth / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pdf.internal.pageSize.getHeight() - 8);
      }
      
      pdf.save(filename);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const hexToRgb = (hex: string) => {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
      <div className="max-w-screen-2x1.1 mx-auto px-14 py-12">
        <div className="text-center mb-12 bg-white/70 backdrop-blur-md py-10 px-6 rounded-xl shadow-lg">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            AI-Powered Portfolio Planner
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Create a personalized investment strategy aligned with your financial goals using our advanced AI technology.
          </p>
          <p className="text-sm text-slate-500 italic max-w-2xl mx-auto">
            Disclaimer: This tool is for informational purposes only and does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Investment Profile</CardTitle>
                <CardDescription>
                  Fill in your investment details to get a personalized portfolio recommendation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
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
                          <IndianRupee className="w-4 h-4" />
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
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
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
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
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
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            className={getRiskButtonClasses('low')}
                            onClick={() => handleRiskSelect('low')}
                          >
                            Low
                          </Button>
                          <Button
                            type="button"
                            className={getRiskButtonClasses('medium')}
                            onClick={() => handleRiskSelect('medium')}
                          >
                            Medium
                          </Button>
                          <Button
                            type="button"
                            className={getRiskButtonClasses('high')}
                            onClick={() => handleRiskSelect('high')}
                          >
                            High
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

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
                      <div className="mt-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Rebalancing Frequency
                            </label>
                            <Select 
                              value={formData.rebalancingFrequency}
                              onValueChange={(value) => handleInputChange({
                                target: { name: 'rebalancingFrequency', value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="semiannually">Semi-annually</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>


                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Tax Optimization
                            </label>
                            <Select 
                              value={formData.taxOptimization}
                              onValueChange={(value) => handleInputChange({
                                target: { name: 'taxOptimization', value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax preference" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="taxEfficient">Tax-Efficient</SelectItem>
                                <SelectItem value="taxAware">Tax-Aware</SelectItem>
                                <SelectItem value="noPreference">No Preference</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Include Cryptocurrency?
                            </label>
                            <Select 
                              value={formData.cryptoPreference}
                              onValueChange={(value) => handleInputChange({
                                target: { name: 'cryptoPreference', value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Crypto Inclusion" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Yes">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Fund Management Style
                            </label>
                            <Select 
                              value={formData.investmentStyle}
                              onValueChange={(value) => handleInputChange({
                                target: { name: 'investmentStyle', value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select management style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="indexFunds">Index Funds</SelectItem>
                                <SelectItem value="activeFunds">Actively Managed Funds</SelectItem>
                                <SelectItem value="hybridFunds">Hybrid Funds</SelectItem>
                                <SelectItem value="noPreference">No Preference</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
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
                              placeholder="e.g., Focus on tech investments"
                              className="w-full"
                            />
                          </div>
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

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              <Card ref={resultCardRef} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Your Investment Plan</CardTitle>
                    <CardDescription>
                      {result ? 'Recommended portfolio allocation based on your goals' : 'Fill out the form to generate your personalized plan'}
                    </CardDescription>
                  </div>
                  {result && (
                    <Button
                      onClick={generatePDF}
                      className="bg-slate-800 hover:bg-slate-700 text-white"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      {/* Summary section */}
                      <div className="bg-slate-50 rounded-lg p-3 md:p-4 space-y-1 md:space-y-2">
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base">Plan Summary</h4>
                        <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                          <div>
                            <span className="text-slate-500">Goal:</span>
                            <p className="font-medium">{formData.goalName}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Initial Investment:</span>
                            <p className="font-medium">₹{parseInt(formData.initialAmount).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Target Amount:</span>
                            <p className="font-medium">₹{parseInt(formData.goalAmount).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Timeline:</span>
                            <p className="font-medium">{formData.timePeriod} years</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pie Chart with modified layout */}
                      <div className="relative h-72 w-full lg:h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={result.allocation}
                              dataKey="percentage"
                              nameKey="name"
                              cx="50%"
                              cy="40%" // Adjust vertical center for mobile
                              innerRadius="25%"  // Changed from window.innerWidth dependent value
                              outerRadius="50%"  // Changed from window.innerWidth dependent value
                              paddingAngle={4}
                              label={({ percentage }) => (
                                percentage > 1 ? `${percentage}%` : ''
                              )}
                            >
                              {result.allocation.map((entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={[
                                    '#ef4444', 
                                    '#22c55e', 
                                    '#3b82f6', 
                                    '#f97316',
                                    '#8b5cf6'
                                  ][index % 5]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                              layout="horizontal"
                              align="center"
                              verticalAlign="middle"
                              iconSize={12}
                              wrapperStyle={{
                                bottom: 0,
                                fontSize: '14px',  // Changed from window.innerWidth dependent value
                                width: '100%',
                                paddingTop: '10px',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Allocation Details */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 text-sm md:text-base">Detailed Allocation</h4>
                        {result.allocation.map((item) => (
                          <div
                            key={item.name}
                            className="flex justify-between items-center py-1 md:py-2 border-b border-slate-100 last:border-0"
                          >
                            <span className="text-slate-700 text-xs md:text-sm">{item.name}</span>
                            <span className="font-semibold text-xs md:text-sm">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>

                      {/* Strategy Explanation */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">Strategy Overview</h4>
                        <p className="text-slate-600 text-sm">{result.explanation}</p>
                      </div>
                      <Link href="/details">
                      <Button
                      className="w-full bg-blue-600 hover:bg-blue-800 text-white py-6 text-lg"
                      > Detailed Overview </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="h-[500px] w-full flex items-center justify-center">
                        <div className="text-center text-slate-500 max-w-md px-4">
                          <h3 className="font-medium text-lg mb-2">No Plan Generated Yet</h3>
                          <p>{'Complete the form on the left and click on "Generate Investment Plan" to see your personalized investment allocation and strategy.'}</p>
                        </div>
                      </div>
                    </div>
                  )}
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