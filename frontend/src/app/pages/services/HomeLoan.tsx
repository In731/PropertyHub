import { Building2, CheckCircle, IndianRupee, FileText, Clock, Shield, Percent } from 'lucide-react';

export function HomeLoan() {
  const loanTypes = [
    {
      title: 'Home Purchase Loan',
      description: 'Finance your dream home with competitive interest rates',
      rate: '8.5% - 9.5%',
    },
    {
      title: 'Home Construction Loan',
      description: 'Build your custom home with flexible disbursement options',
      rate: '9.0% - 10.0%',
    },
    {
      title: 'Home Improvement Loan',
      description: 'Renovate or improve your existing property',
      rate: '9.5% - 11.0%',
    },
    {
      title: 'Plot Loan',
      description: 'Purchase residential land for future construction',
      rate: '9.0% - 10.5%',
    },
  ];

  const features = [
    { icon: IndianRupee, title: 'Loan Up to ₹5 Crore', description: 'High loan amounts for your dream property' },
    { icon: Clock, title: 'Quick Approval', description: 'Get approval within 48 hours' },
    { icon: Percent, title: 'Low Interest Rates', description: 'Starting from 8.5% per annum' },
    { icon: Shield, title: 'Flexible Tenure', description: 'Repayment period up to 30 years' },
    { icon: FileText, title: 'Minimal Documentation', description: 'Simple and hassle-free process' },
    { icon: CheckCircle, title: 'No Hidden Charges', description: 'Transparent pricing with no surprises' },
  ];

  const eligibility = [
    'Age: 21 to 65 years',
    'Employment: Salaried or Self-employed',
    'Income: Minimum ₹25,000 per month',
    'Credit Score: 750 or above',
    'Work Experience: Minimum 2 years',
  ];

  const documents = [
    'Identity Proof (Aadhaar, PAN, Passport)',
    'Address Proof (Utility Bills, Rent Agreement)',
    'Income Proof (Salary Slips, ITR, Bank Statements)',
    'Property Documents',
    'Passport Size Photographs',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-10 h-10" />
            <h1 className="text-4xl font-extrabold">Home Loan Services</h1>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Get the best home loan deals with competitive interest rates and flexible repayment options
          </p>
          <button className="px-8 py-3.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold shadow-lg transition">
            Apply Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Choose Our Home Loans?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition">
                <feature.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-white dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Types of Home Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loanTypes.map((loan, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 hover:border-blue-500 transition">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{loan.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{loan.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interest Rate</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{loan.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Documents */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eligibility */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Eligibility Criteria</h2>
              <ul className="space-y-4">
                {eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Required Documents</h2>
              <ul className="space-y-4">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Simple Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Fill Application', description: 'Complete the online form' },
              { step: '2', title: 'Submit Documents', description: 'Upload required documents' },
              { step: '3', title: 'Get Approval', description: 'Receive approval within 48 hours' },
              { step: '4', title: 'Receive Funds', description: 'Get loan disbursed to your account' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-md shadow-blue-600/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Home Loan?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Apply now and move into your dream home sooner
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-bold shadow-lg">
              Apply Now
            </button>
            <button className="px-8 py-3.5 border-2 border-white text-white rounded-xl hover:bg-white/10 transition font-bold">
              Talk to Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
