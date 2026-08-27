import { useState } from 'react';
import { Calculator, IndianRupee, Percent, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  
  // Calculate EMI using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;
    
    const emi = 
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) /
      (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);
    
    return Math.round(emi);
  };

  // Calculate amortization schedule
  const calculateAmortizationData = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;
    const emi = calculateEMI();
    
    let balance = principal;
    const data = [];
    let dataIndex = 0;
    
    for (let month = 1; month <= numberOfMonths; month++) {
      const interestPayment = balance * ratePerMonth;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;
      
      if (month % 6 === 0 || month === 1 || month === numberOfMonths) {
        data.push({
          id: `month-${month}-${dataIndex}`,
          month: month,
          year: Math.ceil(month / 12),
          displayYear: (month / 12).toFixed(1),
          principal: Math.round(principalPayment),
          interest: Math.round(interestPayment),
          balance: Math.round(balance > 0 ? balance : 0),
        });
        dataIndex++;
      }
    }
    
    return data;
  };

  const emi = calculateEMI();
  const totalAmount = emi * loanTenure * 12;
  const totalInterest = totalAmount - loanAmount;
  const amortizationData = calculateAmortizationData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EMI Calculator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Calculate your home loan EMI and plan your finances better
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Loan Details</h2>
            
            {/* Loan Amount */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Amount</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>₹1L</span>
                <span>₹5Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate (per annum)</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Tenure</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{loanTenure} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Amortization Chart */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Amortization Schedule</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Monthly principal and interest over time</p>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={amortizationData}
                    margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                    <XAxis
                      dataKey="id"
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      ticks={amortizationData.map((d) => d.id)}
                      tickFormatter={(id) => {
                        const point = amortizationData.find(d => d.id === id);
                        return point ? Math.ceil(point.month / 12).toString() : '';
                      }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      labelFormatter={(id) => {
                        const point = amortizationData.find(d => d.id === id);
                        return point ? `Year ${Math.ceil(point.month / 12)}` : '';
                      }}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        borderColor: '#374151',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="principal"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Principal"
                      dot={{ fill: '#2563eb', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="interest"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="Interest"
                      dot={{ fill: '#f97316', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3.5 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-blue-900 dark:text-blue-300">💡 Insight:</span> Interest decreases while principal increases over time.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* EMI Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5" />
                <p className="text-sm font-medium opacity-90">Monthly EMI</p>
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold mb-2">₹{emi.toLocaleString('en-IN')}</p>
              <p className="text-xs opacity-80">
                for {loanTenure} years @ {interestRate}% p.a.
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50/80 dark:bg-blue-950/30 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Principal Amount</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{loanAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50/80 dark:bg-orange-950/30 rounded-2xl border border-orange-100/50 dark:border-orange-900/30">
                  <div className="flex items-center gap-3">
                    <Percent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Interest</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{totalInterest.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50/80 dark:bg-green-950/30 rounded-2xl border border-green-100/50 dark:border-green-900/30">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount Payable</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Principal vs Interest</h3>
              <div className="flex gap-2 h-12 rounded-xl overflow-hidden p-1 bg-gray-100 dark:bg-gray-800">
                <div
                  className="bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                >
                  {((loanAmount / totalAmount) * 100).toFixed(0)}%
                </div>
                <div
                  className="bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
                >
                  {((totalInterest / totalAmount) * 100).toFixed(0)}%
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Interest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
