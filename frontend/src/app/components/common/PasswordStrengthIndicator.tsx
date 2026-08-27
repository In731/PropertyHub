import { Check, X, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({ password, showRequirements = true }: PasswordStrengthIndicatorProps) {
  const requirements = [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];

  const passedRequirements = requirements.filter(req => req.test(password)).length;
  const strength = passedRequirements === 0 ? 0 : passedRequirements <= 2 ? 1 : passedRequirements <= 4 ? 2 : 3;

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = () => {
    if (strength === 1) return 'text-red-600';
    if (strength === 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (password.length === 0 && !showRequirements) {
    return null;
  }

  return (
    <div className="mt-2">
      {password.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Password strength:</span>
            <span className={`text-xs font-bold ${getStrengthTextColor()}`}>
              {getStrengthLabel()}
            </span>
          </div>
          <div className="flex gap-1.5 h-1.5">
            <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 1 ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-800'}`} />
            <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 2 ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-800'}`} />
            <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 3 ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-800'}`} />
          </div>
        </div>
      )}

      {showRequirements && (
        <div className="space-y-2">
          {password.length === 0 ? (
            <div className="flex items-start gap-2 text-xs bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">Password must contain:</p>
                <ul className="mt-1 space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index} className="text-blue-800 dark:text-blue-400">• {req.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {requirements.map((req, index) => {
                const passed = req.test(password);
                return (
                  <div key={index} className={`flex items-center gap-1.5 text-xs font-medium ${passed ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {passed ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
