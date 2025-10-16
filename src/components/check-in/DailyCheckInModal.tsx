'use client';

import { useEffect, useState } from 'react';
import MorningCheckIn from './MorningCheckIn';
import EveningCheckIn from './EveningCheckIn';
import CheckInStreak from './CheckInStreak';

type Step = 'morning' | 'evening' | 'complete';

export default function DailyCheckInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('morning');
  const [morningData, setMorningData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);

  useEffect(() => {
    checkIfShouldShow();
  }, []);

  const checkIfShouldShow = async () => {
    try {
      const res = await fetch('/api/check-in/today');
      if (res.ok) {
        const data = await res.json();

        if (!data.checkIn) {
          // No check-in yet, show morning
          setIsOpen(true);
          setStep('morning');
        } else if (data.morningComplete && !data.eveningComplete) {
          // Morning done, check if it's evening (after 6 PM)
          const hour = new Date().getHours();
          if (hour >= 18) {
            setIsOpen(true);
            setStep('evening');
            setMorningData(data.checkIn);
          }
        }
      }
    } catch (error) {
      console.error('Error checking check-in status:', error);
    }
  };

  const handleMorningComplete = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/check-in/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setMorningData(data);
        setStep('complete');
        setTimeout(() => setIsOpen(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting morning check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEveningComplete = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/check-in/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setRiskAssessment(result.riskAssessment);
        setStep('complete');
        setTimeout(() => {
          setIsOpen(false);
          // Reload to update dashboard
          window.location.reload();
        }, 4000);
      }
    } catch (error) {
      console.error('Error submitting evening check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${step === 'morning' ? 'text-blue-600' : 'text-gray-400'}`}>
              Morning
            </span>
            <span className={`text-sm font-medium ${step === 'evening' ? 'text-blue-600' : 'text-gray-400'}`}>
              Evening
            </span>
            <span className={`text-sm font-medium ${step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
              Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: step === 'morning' ? '33%' : step === 'evening' ? '66%' : '100%',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Saving your check-in...</p>
            </div>
          ) : step === 'morning' ? (
            <MorningCheckIn
              onComplete={handleMorningComplete}
              onSkip={() => setIsOpen(false)}
            />
          ) : step === 'evening' ? (
            <EveningCheckIn
              morningData={morningData}
              onComplete={handleEveningComplete}
              onSkip={() => setIsOpen(false)}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in complete!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for tracking your mental health journey today.
              </p>

              {riskAssessment && (
                <div className={`p-4 rounded-lg mb-6 ${
                  riskAssessment.riskLevel === 'critical' ? 'bg-red-50 border border-red-200' :
                  riskAssessment.riskLevel === 'high' ? 'bg-orange-50 border border-orange-200' :
                  riskAssessment.riskLevel === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-green-50 border border-green-200'
                }`}>
                  <h3 className="font-semibold mb-2">
                    Risk Level: {riskAssessment.riskLevel.toUpperCase()}
                  </h3>
                  <p className="text-sm mb-2">Risk Score: {riskAssessment.riskScore}/100</p>
                  <div className="text-left">
                    <p className="text-sm font-medium mb-1">Recommendations:</p>
                    <ul className="text-sm space-y-1">
                      {riskAssessment.recommendedActions.map((action: string, i: number) => (
                        <li key={i}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <CheckInStreak />

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 px-6 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
