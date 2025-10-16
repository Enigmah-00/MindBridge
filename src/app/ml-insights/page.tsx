"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TabType = 'insights' | 'chat';

interface RiskPrediction {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidence: number;
  riskScore: number;
  factors: Array<{
    name: string;
    impact: number;
    type: 'risk' | 'protective';
  }>;
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'immediate';
  dataCompleteness?: {
    percentage: number;
    missingAreas: string[];
  };
  insights?: string[];
}

interface DoctorMatch {
  doctor: {
    id: string;
    name: string;
    city?: string;
    country?: string;
    telehealth: boolean;
  };
  matchScore: number;
  matchPercentage: number;
  reasons: string[];
  distance?: number;
}

export default function MLInsightsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('insights');
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState<RiskPrediction | null>(null);
  const [doctorMatches, setDoctorMatches] = useState<DoctorMatch[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'insights') {
      fetchMLInsights();
    }
  }, [activeTab]);

  const fetchMLInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch risk assessment
      const riskRes = await fetch('/api/ml/risk-assessment', {
        method: 'POST',
      });

      if (!riskRes.ok) {
        const errData = await riskRes.json();
        throw new Error(errData.message || errData.error || 'Failed to fetch risk assessment');
      }

      const riskResult = await riskRes.json();
      setRiskData(riskResult);

      // Fetch doctor matches
      const doctorRes = await fetch('/api/ml/doctor-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 3 }),
      });

      if (doctorRes.ok) {
        const doctorResult = await doctorRes.json();
        setDoctorMatches(doctorResult.matches || []);
      }

    } catch (err: any) {
      console.error('ML insights error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Analyzing your mental health data with AI...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Mental Health Insights
          </h1>
        </div>

        <div className="card p-8 text-center space-y-4">
          <div className="text-5xl mb-2">📊</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            No Assessment Data Yet
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {error}
          </p>
          <Link
            href="/quizzes"
            className="inline-block btn btn-primary mt-4"
          >
            Take Your First Assessment
          </Link>
        </div>
      </section>
    );
  }

  if (!riskData) {
    return null;
  }

  const riskColors = {
    Low: 'text-green-600 bg-green-50 border-green-200',
    Moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    High: 'text-orange-600 bg-orange-50 border-orange-200',
    Critical: 'text-red-600 bg-red-50 border-red-200',
  };

  const urgencyIcons = {
    routine: '✅',
    soon: '⏰',
    urgent: '⚠️',
    immediate: '🚨',
  };

  return (
    <section className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          🧠 MindMap
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Your AI-powered mental health companion - insights, chat, and personalized support
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="card p-1 inline-flex gap-1">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          AI Insights
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          AI Chat
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'insights' && (
        <>
          {riskData && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
              <span>ML Model Confidence: {Math.round(riskData.confidence * 100)}%</span>
            </div>
          )}
        </>
      )}

      {activeTab === 'chat' && (
        <div className="card p-8">
          <iframe
            src="/chatbot"
            className="w-full h-[600px] rounded-lg border-0"
            title="AI Mental Health Chatbot"
          />
        </div>
      )}

      {activeTab === 'insights' && (
        <>

      {/* Risk Level Card */}
      <div className={`card p-8 border-l-4 ${riskColors[riskData.riskLevel]}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Mental Health Risk Level
            </h2>
            <div className="text-4xl font-bold mb-2">
              {riskData.riskLevel}
            </div>
            <div className="flex items-center gap-2">
              <span>{urgencyIcons[riskData.urgency]}</span>
              <span className="capitalize text-sm font-medium">{riskData.urgency} attention needed</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium mb-2 text-gray-600">Risk Score</div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(riskData.riskScore * 100)}%
            </div>
          </div>
        </div>

        {/* Risk Score Bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                riskData.riskLevel === 'Low' ? 'bg-green-600' :
                riskData.riskLevel === 'Moderate' ? 'bg-yellow-500' :
                riskData.riskLevel === 'High' ? 'bg-orange-500' : 'bg-red-600'
              }`}
              style={{ width: `${riskData.riskScore * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Insights */}
        {riskData.insights && riskData.insights.length > 0 && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900">Key Insights:</h3>
            {riskData.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span>💡</span>
                <p className="text-gray-700 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Factors */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contributing Factors */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>⚠️</span>
            Risk Factors
          </h3>
          <div className="space-y-3">
            {riskData.factors
              .filter(f => f.type === 'risk')
              .slice(0, 5)
              .map((factor, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{factor.name}</span>
                    <span className="text-gray-600">
                      {Math.round(factor.impact * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 transition-all duration-500"
                      style={{ width: `${factor.impact * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            {riskData.factors.filter(f => f.type === 'risk').length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">
                No significant risk factors identified 🎉
              </p>
            )}
          </div>
        </div>

        {/* Protective Factors */}
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🛡️</span>
            Protective Factors
          </h3>
          <div className="space-y-3">
            {riskData.factors
              .filter(f => f.type === 'protective')
              .slice(0, 5)
              .map((factor, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{factor.name}</span>
                    <span className="text-gray-600">
                      {Math.round(factor.impact * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all duration-500"
                      style={{ width: `${factor.impact * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            {riskData.factors.filter(f => f.type === 'protective').length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">
                Build protective factors through healthy habits
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>💡</span>
          AI-Powered Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {riskData.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 bg-blue-50 rounded-lg border border-blue-100"
            >
              <p className="text-gray-700 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Matched Doctors */}
      {doctorMatches.length > 0 && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>👨‍⚕️</span>
              Best Matched Doctors for You
            </h3>
            <Link href="/doctors" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {doctorMatches.map((match, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors space-y-3"
              >
                <div>
                  <div className="text-xs text-blue-600 font-semibold mb-1">
                    {match.matchPercentage}% MATCH
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">
                    {match.doctor.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {match.doctor.city}, {match.doctor.country}
                  </p>
                </div>
                <div className="space-y-1">
                  {match.reasons.slice(0, 2).map((reason, ridx) => (
                    <div key={ridx} className="text-xs text-gray-700 flex items-start gap-1">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/doctors`}
                  className="block text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Completeness */}
      {riskData.dataCompleteness && (
        <div className="card p-6 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📊</span>
            Data Completeness
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Profile Completion</span>
              <span className="font-bold text-lg">
                {riskData.dataCompleteness.percentage}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${riskData.dataCompleteness.percentage}%` }}
              ></div>
            </div>
            {riskData.dataCompleteness.missingAreas.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Complete these areas for more accurate predictions:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {riskData.dataCompleteness.missingAreas.map((area, idx) => (
                    <li key={idx}>• {area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {activeTab === 'insights' && (
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/quizzes" className="btn btn-primary">
            Take Assessments
          </Link>
          <Link href="/doctors" className="btn btn-secondary">
            Find Doctors
          </Link>
          <Link href="/games" className="btn btn-secondary">
            Play Therapeutic Games
          </Link>
        </div>
      )}
        </>
      )}
    </section>
  );
}
