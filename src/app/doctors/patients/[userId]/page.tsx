'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Profile {
  id: number;
  userId: number;
  age?: number;
  gender?: string;
  occupation?: string;
  sleepHours?: number;
  exerciseFreq?: string;
  dietQuality?: string;
  smokingStatus?: string;
  alcoholFreq?: string;
  stressLevel?: string;
  socialSupport?: string;
  chronicConditions?: string;
  familyMentalHealthHistory?: string;
  gad7Score?: number;
  phq9Score?: number;
  pss10Score?: number;
  spinScore?: number;
  pdssScore?: number;
  asrsScore?: number;
  ociScore?: number;
  pcl5Score?: number;
}

interface PatientUser {
  id: number;
  name: string;
  email: string;
}

export default function PatientProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [patientUser, setPatientUser] = useState<PatientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/appointments/doctor/me/patients/${params.userId}/profile`);
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to load profile');
        }

        const data = await res.json();
        console.log('Fetched profile data:', data); // Debug log
        setProfile(data);

        // Fetch patient user info from the patients list
        const patientsRes = await fetch('/api/appointments/doctor/me/patients');
        if (patientsRes.ok) {
          const patients = await patientsRes.json();
          const patient = patients.find((p: any) => p.userId === parseInt(params.userId));
          if (patient) {
            setPatientUser({
              id: patient.userId,
              name: patient.name,
              email: patient.email
            });
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-glass max-w-md w-full mx-4 p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => router.back()} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getAssessmentSeverity = (score: number | undefined, type: string): { label: string; color: string } | null => {
    if (score === undefined) return null;
    
    const ranges: Record<string, { mild: number; moderate: number; severe: number }> = {
      gad7: { mild: 5, moderate: 10, severe: 15 },
      phq9: { mild: 5, moderate: 10, severe: 15 },
      pss10: { mild: 14, moderate: 27, severe: 40 },
      spin: { mild: 21, moderate: 31, severe: 41 },
      pdss: { mild: 5, moderate: 10, severe: 15 },
      asrs: { mild: 4, moderate: 6, severe: 12 },
      oci: { mild: 21, moderate: 31, severe: 41 },
      pcl5: { mild: 31, moderate: 44, severe: 58 }
    };

    const range = ranges[type];
    if (!range) return { label: 'Unknown', color: 'text-gray-600 bg-gray-50' };

    if (score < range.mild) return { label: 'Minimal', color: 'text-green-600 bg-green-50' };
    if (score < range.moderate) return { label: 'Mild', color: 'text-yellow-600 bg-yellow-50' };
    if (score < range.severe) return { label: 'Moderate', color: 'text-orange-600 bg-orange-50' };
    return { label: 'Severe', color: 'text-red-600 bg-red-50' };
  };

  const assessments = [
    { key: 'gad7', label: 'GAD-7 (Anxiety)', score: profile?.gad7Score, max: 21 },
    { key: 'phq9', label: 'PHQ-9 (Depression)', score: profile?.phq9Score, max: 27 },
    { key: 'pss10', label: 'PSS-10 (Stress)', score: profile?.pss10Score, max: 40 },
    { key: 'spin', label: 'SPIN (Social Anxiety)', score: profile?.spinScore, max: 68 },
    { key: 'pdss', label: 'PDSS (Panic Disorder)', score: profile?.pdssScore, max: 28 },
    { key: 'asrs', label: 'ASRS (ADHD)', score: profile?.asrsScore, max: 24 },
    { key: 'oci', label: 'OCI-R (OCD)', score: profile?.ociScore, max: 72 },
    { key: 'pcl5', label: 'PCL-5 (PTSD)', score: profile?.pcl5Score, max: 80 }
  ];

  const completedAssessments = assessments.filter(a => a.score !== undefined && a.score !== null);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="btn-secondary mb-4">
            ← Back to Dashboard
          </button>
          
          <div className="card-glass p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Patient Profile
            </h1>
            {patientUser && (
              <div className="space-y-2 text-gray-700">
                <p className="text-xl font-semibold">{patientUser.name}</p>
                <p className="text-gray-600">{patientUser.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Demographics */}
        <div className="card-glass p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">👤</span>
            Demographics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile?.age && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Age</p>
                <p className="text-2xl font-bold text-indigo-600">{profile.age} years</p>
              </div>
            )}
            {profile?.gender && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Gender</p>
                <p className="text-2xl font-bold text-purple-600 capitalize">{profile.gender}</p>
              </div>
            )}
            {profile?.occupation && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-600 mb-1">Occupation</p>
                <p className="text-2xl font-bold text-green-600">{profile.occupation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle Factors */}
        <div className="card-glass p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🏃</span>
            Lifestyle Factors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile?.sleepHours !== undefined && (
              <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Sleep Hours</p>
                <p className="text-xl font-bold text-gray-800">{profile.sleepHours} hours/night</p>
              </div>
            )}
            {profile?.exerciseFreq && (
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Exercise Frequency</p>
                <p className="text-xl font-bold text-gray-800 capitalize">{profile.exerciseFreq}</p>
              </div>
            )}
            {profile?.dietQuality && (
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Diet Quality</p>
                <p className="text-xl font-bold text-gray-800 capitalize">{profile.dietQuality}</p>
              </div>
            )}
            {profile?.stressLevel && (
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Stress Level</p>
                <p className="text-xl font-bold text-gray-800 capitalize">{profile.stressLevel}</p>
              </div>
            )}
            {profile?.socialSupport && (
              <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Social Support</p>
                <p className="text-xl font-bold text-gray-800 capitalize">{profile.socialSupport}</p>
              </div>
            )}
            {profile?.smokingStatus && (
              <div className="border-l-4 border-gray-500 bg-gray-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Smoking Status</p>
                <p className="text-xl font-bold text-gray-800 capitalize">{profile.smokingStatus}</p>
              </div>
            )}
            {profile?.alcoholFreq && (
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                <p className="text-sm font-medium text-gray-600">Alcohol Frequency</p>
                <p className="text-xl font-bold text-gray-800 capitalize">{profile.alcoholFreq}</p>
              </div>
            )}
          </div>
        </div>

        {/* Health History */}
        {(profile?.chronicConditions || profile?.familyMentalHealthHistory) && (
          <div className="card-glass p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🏥</span>
              Health History
            </h2>
            
            <div className="space-y-4">
              {profile?.chronicConditions && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Chronic Conditions</p>
                  <p className="text-lg text-gray-800">{profile.chronicConditions}</p>
                </div>
              )}
              {profile?.familyMentalHealthHistory && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Family Mental Health History</p>
                  <p className="text-lg text-gray-800">{profile.familyMentalHealthHistory}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assessment Results */}
        <div className="card-glass p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">📊</span>
            Assessment Results
          </h2>
          
          {completedAssessments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No assessments completed yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedAssessments.map((assessment) => {
                const severity = getAssessmentSeverity(assessment.score, assessment.key);
                const percentage = assessment.score ? Math.round((assessment.score / assessment.max) * 100) : 0;
                
                return (
                  <div key={assessment.key} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{assessment.label}</h3>
                        <p className="text-sm text-gray-500">Score: {assessment.score} / {assessment.max}</p>
                      </div>
                      {severity && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severity.color}`}>
                          {severity.label}
                        </span>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* No Profile Data */}
        {!profile?.age && !profile?.gender && !profile?.occupation && !profile?.sleepHours && completedAssessments.length === 0 && (
          <div className="card-glass p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Profile Data Available</h3>
            <p className="text-gray-600">Patient hasn't completed their profile yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
