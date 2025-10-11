'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Resource {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  symptoms: string[];
  youtubeVideos: Array<{
    title: string;
    url: string;
    channel: string;
  }>;
  websites: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  color: string;
  icon: string;
}

const resources: Resource[] = [
  {
    id: 'anxiety',
    title: 'Anxiety Disorders',
    shortDescription: 'A feeling of worry, nervousness, or unease that can affect daily life.',
    fullDescription: 'Anxiety disorders are the most common mental health conditions, affecting millions worldwide. They involve excessive fear or anxiety that interferes with daily activities. While everyone experiences anxiety occasionally, anxiety disorders involve more than temporary worry or fear.',
    symptoms: [
      'Feeling nervous, restless, or tense',
      'Having a sense of impending danger or panic',
      'Increased heart rate and rapid breathing',
      'Sweating and trembling',
      'Difficulty concentrating',
      'Trouble sleeping'
    ],
    youtubeVideos: [
      {
        title: 'Understanding Anxiety Disorders',
        url: 'https://www.youtube.com/watch?v=9mPwQTiMSj8',
        channel: 'TED-Ed'
      },
      {
        title: 'How to Cope with Anxiety',
        url: 'https://www.youtube.com/watch?v=WWloIAQpMcQ',
        channel: 'The School of Life'
      },
      {
        title: 'What is Anxiety?',
        url: 'https://www.youtube.com/watch?v=5j9mSKG2r8w',
        channel: 'Psych Hub'
      }
    ],
    websites: [
      {
        name: 'Moner Daktar (Bangladesh Mental Health)',
        url: 'https://monerdaktar.com',
        description: 'Leading mental health organization in Bangladesh providing counseling and awareness'
      },
      {
        name: 'National Institute of Mental Health (NIMH) Bangladesh',
        url: 'http://nimhbd.gov.bd',
        description: 'Government mental health institute offering treatment and research'
      },
      {
        name: 'KAAN - Suicide Prevention Helpline',
        url: 'https://www.facebook.com/kaan.bangladesh',
        description: 'Bangladesh\'s first suicide prevention helpline and mental health support'
      }
    ],
    color: 'from-yellow-500 to-orange-500',
    icon: '😰'
  },
  {
    id: 'depression',
    title: 'Depression',
    shortDescription: 'A mood disorder causing persistent feelings of sadness and loss of interest.',
    fullDescription: 'Depression (major depressive disorder) is a common and serious medical illness that negatively affects how you feel, think, and act. It causes feelings of sadness and/or a loss of interest in activities you once enjoyed, leading to various emotional and physical problems.',
    symptoms: [
      'Persistent sad, anxious, or empty mood',
      'Loss of interest in hobbies and activities',
      'Fatigue and decreased energy',
      'Difficulty concentrating or making decisions',
      'Changes in appetite or weight',
      'Thoughts of death or suicide'
    ],
    youtubeVideos: [
      {
        title: 'What is Depression?',
        url: 'https://www.youtube.com/watch?v=z-IR48Mb3W0',
        channel: 'TED-Ed'
      },
      {
        title: 'I Had a Black Dog, His Name Was Depression',
        url: 'https://www.youtube.com/watch?v=XiCrniLQGYc',
        channel: 'WHO'
      },
      {
        title: 'Understanding Depression',
        url: 'https://www.youtube.com/watch?v=esPRsT-lmw8',
        channel: 'Stanford'
      }
    ],
    websites: [
      {
        name: 'Moner Daktar Depression Support',
        url: 'https://monerdaktar.com',
        description: 'Professional counseling and support for depression in Bangladesh'
      },
      {
        name: 'Bangladesh Association for Psychiatry',
        url: 'http://www.psychbd.org',
        description: 'Professional organization of psychiatrists providing resources and referrals'
      },
      {
        name: 'Dhaka University Clinical Psychology',
        url: 'https://www.du.ac.bd/department_item.php?id=94',
        description: 'Academic resources and mental health services'
      }
    ],
    color: 'from-blue-500 to-indigo-500',
    icon: '😔'
  },
  {
    id: 'bipolar',
    title: 'Bipolar Disorder',
    shortDescription: 'A disorder associated with episodes of mood swings from high to low.',
    fullDescription: 'Bipolar disorder, formerly called manic depression, causes extreme mood swings that include emotional highs (mania or hypomania) and lows (depression). These shifts can affect sleep, energy, activity, judgment, behavior, and the ability to think clearly.',
    symptoms: [
      'Manic episodes with high energy and reduced sleep',
      'Depressive episodes with low energy and sadness',
      'Rapid speech and racing thoughts',
      'Impulsive or risky behavior during mania',
      'Difficulty concentrating',
      'Changes in appetite and sleep patterns'
    ],
    youtubeVideos: [
      {
        title: 'What is Bipolar Disorder?',
        url: 'https://www.youtube.com/watch?v=RrWBhVlD1sk',
        channel: 'Psych Hub'
      },
      {
        title: 'Living with Bipolar Disorder',
        url: 'https://www.youtube.com/watch?v=eyiZfzbgaW4',
        channel: 'MedCircle'
      },
      {
        title: 'Understanding Bipolar Disorder',
        url: 'https://www.youtube.com/watch?v=C7TZljV-WXM',
        channel: 'TED-Ed'
      }
    ],
    websites: [
      {
        name: 'Bangladesh Mental Health Foundation',
        url: 'https://www.facebook.com/BMHFoundation',
        description: 'Support and awareness for bipolar disorder and mood disorders in Bangladesh'
      },
      {
        name: 'National Institute of Mental Health (NIMH) Bangladesh',
        url: 'http://nimhbd.gov.bd',
        description: 'Treatment and support for bipolar disorder patients'
      },
      {
        name: 'Moner Daktar - Mood Disorders',
        url: 'https://monerdaktar.com',
        description: 'Professional counseling for bipolar and mood disorders'
      }
    ],
    color: 'from-purple-500 to-pink-500',
    icon: '🎭'
  },
  {
    id: 'ocd',
    title: 'Obsessive-Compulsive Disorder (OCD)',
    shortDescription: 'A disorder characterized by unwanted, recurring thoughts and behaviors.',
    fullDescription: 'OCD is characterized by unreasonable thoughts and fears (obsessions) that lead to compulsive behaviors. These obsessions and compulsions interfere with daily activities and cause significant distress. People with OCD may try to ignore or stop their obsessions, but this only increases distress and anxiety.',
    symptoms: [
      'Unwanted, intrusive thoughts or images',
      'Intense urges to perform certain rituals',
      'Fear of contamination or germs',
      'Need for symmetry or exactness',
      'Excessive doubt and need for reassurance',
      'Time-consuming rituals that interfere with life'
    ],
    youtubeVideos: [
      {
        title: 'What is OCD?',
        url: 'https://www.youtube.com/watch?v=gNXTC32663o',
        channel: 'TED-Ed'
      },
      {
        title: 'Understanding OCD',
        url: 'https://www.youtube.com/watch?v=aX7jnVXXG5o',
        channel: 'BBC Ideas'
      },
      {
        title: 'Living with OCD',
        url: 'https://www.youtube.com/watch?v=yXiCrniLQGY',
        channel: 'Psych Hub'
      }
    ],
    websites: [
      {
        name: 'Moner Daktar - OCD Treatment',
        url: 'https://monerdaktar.com',
        description: 'Specialized counseling and therapy for OCD in Bangladesh'
      },
      {
        name: 'Bangladesh Psychological Association',
        url: 'https://www.facebook.com/BangladeshPsychologicalAssociation',
        description: 'Professional resources and therapist referrals for OCD'
      },
      {
        name: 'NIMH Bangladesh - Anxiety Disorders',
        url: 'http://nimhbd.gov.bd',
        description: 'Clinical treatment for OCD and anxiety disorders'
      }
    ],
    color: 'from-green-500 to-teal-500',
    icon: '🔄'
  },
  {
    id: 'ptsd',
    title: 'Post-Traumatic Stress Disorder (PTSD)',
    shortDescription: 'A disorder triggered by experiencing or witnessing a traumatic event.',
    fullDescription: 'PTSD is a mental health condition triggered by experiencing or witnessing a terrifying event. Symptoms may include flashbacks, nightmares, severe anxiety, and uncontrollable thoughts about the event. Most people who go through traumatic events may have temporary difficulty adjusting, but with time and good self-care, they usually get better.',
    symptoms: [
      'Intrusive memories and flashbacks',
      'Nightmares about the traumatic event',
      'Severe emotional distress',
      'Avoidance of reminders of trauma',
      'Negative changes in thinking and mood',
      'Hyperarousal and being easily startled'
    ],
    youtubeVideos: [
      {
        title: 'What is PTSD?',
        url: 'https://www.youtube.com/watch?v=b_n9qegR7C4',
        channel: 'TED-Ed'
      },
      {
        title: 'Understanding PTSD',
        url: 'https://www.youtube.com/watch?v=DxIDKZHW3-E',
        channel: 'National Center for PTSD'
      },
      {
        title: 'PTSD Explained',
        url: 'https://www.youtube.com/watch?v=Bwfp51TshZE',
        channel: 'Psych2Go'
      }
    ],
    websites: [
      {
        name: 'Trauma Care Bangladesh',
        url: 'https://www.facebook.com/traumacareBD',
        description: 'Support and counseling for trauma survivors in Bangladesh'
      },
      {
        name: 'Moner Daktar - Trauma Support',
        url: 'https://monerdaktar.com',
        description: 'Professional trauma therapy and PTSD treatment'
      },
      {
        name: 'Bangladesh Red Crescent Society',
        url: 'https://www.bdrcs.org',
        description: 'Psychosocial support and disaster trauma services'
      }
    ],
    color: 'from-red-500 to-orange-500',
    icon: '💥'
  },
  {
    id: 'eating-disorders',
    title: 'Eating Disorders',
    shortDescription: 'Disorders characterized by abnormal eating habits and body image concerns.',
    fullDescription: 'Eating disorders are serious conditions related to persistent eating behaviors that negatively impact health, emotions, and ability to function. The most common eating disorders are anorexia nervosa, bulimia nervosa, and binge-eating disorder. They often develop during adolescence or young adulthood.',
    symptoms: [
      'Preoccupation with weight, food, and body shape',
      'Extreme restriction of food intake',
      'Binge eating episodes',
      'Purging behaviors (vomiting, excessive exercise)',
      'Distorted body image',
      'Social withdrawal and mood changes'
    ],
    youtubeVideos: [
      {
        title: 'What are Eating Disorders?',
        url: 'https://www.youtube.com/watch?v=dlrzh2yF2r0',
        channel: 'TED-Ed'
      },
      {
        title: 'Understanding Eating Disorders',
        url: 'https://www.youtube.com/watch?v=6bV1-UK4nfc',
        channel: 'Stanford Medicine'
      },
      {
        title: 'Eating Disorders Explained',
        url: 'https://www.youtube.com/watch?v=0ByP1s2FsME',
        channel: 'Psych Hub'
      }
    ],
    websites: [
      {
        name: 'Moner Daktar - Eating Disorders',
        url: 'https://monerdaktar.com',
        description: 'Counseling and support for eating disorders in Bangladesh'
      },
      {
        name: 'Bangladesh Nutrition Foundation',
        url: 'http://www.bnf-bd.org',
        description: 'Nutritional support and education for healthy eating habits'
      },
      {
        name: 'NIMH Bangladesh - Clinical Services',
        url: 'http://nimhbd.gov.bd',
        description: 'Medical treatment for eating disorders and body image issues'
      }
    ],
    color: 'from-pink-500 to-rose-500',
    icon: '🍽️'
  },
  {
    id: 'adhd',
    title: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
    shortDescription: 'A chronic condition including attention difficulty, hyperactivity, and impulsiveness.',
    fullDescription: 'ADHD is one of the most common neurodevelopmental disorders of childhood, but it often continues into adulthood. It is characterized by an ongoing pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development.',
    symptoms: [
      'Difficulty paying attention and staying focused',
      'Hyperactivity and restlessness',
      'Impulsive behavior and decision-making',
      'Difficulty organizing tasks',
      'Forgetfulness in daily activities',
      'Trouble completing tasks'
    ],
    youtubeVideos: [
      {
        title: 'What is ADHD?',
        url: 'https://www.youtube.com/watch?v=xMWtGozn5jU',
        channel: 'TED-Ed'
      },
      {
        title: 'ADHD in Adults',
        url: 'https://www.youtube.com/watch?v=fWCocjh5aK0',
        channel: 'How to ADHD'
      },
      {
        title: 'Understanding ADHD',
        url: 'https://www.youtube.com/watch?v=yoX0vEDn5a4',
        channel: 'Stanford Medicine'
      }
    ],
    websites: [
      {
        name: 'Society for the Welfare of Intellectually Disabled',
        url: 'https://www.swid.org.bd',
        description: 'Support for children and adults with ADHD and neurodevelopmental disorders'
      },
      {
        name: 'Protibondhi Foundation Bangladesh',
        url: 'https://www.facebook.com/ProtibandhiFoundation',
        description: 'Resources and awareness for ADHD and learning disabilities'
      },
      {
        name: 'Child Development Center (Dhaka Shishu Hospital)',
        url: 'http://www.dshbd.org',
        description: 'Clinical assessment and treatment for ADHD in children'
      }
    ],
    color: 'from-cyan-500 to-blue-500',
    icon: '⚡'
  },
  {
    id: 'schizophrenia',
    title: 'Schizophrenia',
    shortDescription: 'A disorder affecting a person\'s ability to think, feel, and behave clearly.',
    fullDescription: 'Schizophrenia is a chronic brain disorder that affects how a person thinks, feels, and behaves. People with schizophrenia may experience hallucinations, delusions, disorganized thinking, and impaired functioning. With treatment, many people with schizophrenia can lead productive lives.',
    symptoms: [
      'Hallucinations (seeing or hearing things)',
      'Delusions (false beliefs)',
      'Disorganized thinking and speech',
      'Reduced expression of emotions',
      'Decreased motivation',
      'Difficulty with attention and memory'
    ],
    youtubeVideos: [
      {
        title: 'What is Schizophrenia?',
        url: 'https://www.youtube.com/watch?v=PUrzkMNdvqM',
        channel: 'TED-Ed'
      },
      {
        title: 'Understanding Schizophrenia',
        url: 'https://www.youtube.com/watch?v=gGnl8dqEoPQ',
        channel: 'Stanford Medicine'
      },
      {
        title: 'Living with Schizophrenia',
        url: 'https://www.youtube.com/watch?v=Pr8IyNGAqlw',
        channel: 'BBC Stories'
      }
    ],
    websites: [
      {
        name: 'National Institute of Mental Health (NIMH) Bangladesh',
        url: 'http://nimhbd.gov.bd',
        description: 'Specialized treatment and care for schizophrenia patients'
      },
      {
        name: 'Bangladesh Association for Psychiatry',
        url: 'http://www.psychbd.org',
        description: 'Professional psychiatric care and family support resources'
      },
      {
        name: 'Bangabandhu Sheikh Mujib Medical University',
        url: 'https://www.bsmmu.edu.bd',
        description: 'Advanced psychiatric services and research for psychotic disorders'
      }
    ],
    color: 'from-indigo-500 to-purple-500',
    icon: '🧠'
  },
  {
    id: 'autism',
    title: 'Autism Spectrum Disorder (ASD)',
    shortDescription: 'A developmental disorder affecting communication and behavior.',
    fullDescription: 'Autism spectrum disorder is a complex developmental condition involving persistent challenges with social communication, restricted interests, and repetitive behavior. While autism is considered a "spectrum" disorder, each person with autism has a distinct set of strengths and challenges.',
    symptoms: [
      'Difficulty with social communication',
      'Repetitive behaviors and routines',
      'Sensory sensitivities',
      'Intense focus on specific interests',
      'Challenges with eye contact',
      'Difficulty understanding social cues'
    ],
    youtubeVideos: [
      {
        title: 'What is Autism?',
        url: 'https://www.youtube.com/watch?v=Lk4qs4O1s7M',
        channel: 'National Autistic Society'
      },
      {
        title: 'Understanding Autism Spectrum Disorder',
        url: 'https://www.youtube.com/watch?v=wKlMcLTqRLs',
        channel: 'TED-Ed'
      },
      {
        title: 'Autism from the Inside',
        url: 'https://www.youtube.com/watch?v=TfEhE7bIbD0',
        channel: 'Autism Speaks'
      }
    ],
    websites: [
      {
        name: 'Society for the Welfare of Intellectually Disabled (SWID)',
        url: 'https://www.swid.org.bd',
        description: 'Support, education, and resources for autism in Bangladesh'
      },
      {
        name: 'Autism Welfare Foundation (AWF)',
        url: 'https://www.awf-bd.org',
        description: 'Awareness, diagnosis, and therapy services for autism'
      },
      {
        name: 'Centre for Neurodevelopment & Autism in Children',
        url: 'https://www.cnacdhaka.org',
        description: 'Specialized care and early intervention for autism'
      }
    ],
    color: 'from-teal-500 to-green-500',
    icon: '🧩'
  },
  {
    id: 'borderline',
    title: 'Borderline Personality Disorder (BPD)',
    shortDescription: 'A disorder marked by ongoing instability in moods, behavior, and relationships.',
    fullDescription: 'BPD is a mental health disorder that impacts the way you think and feel about yourself and others, causing problems functioning in everyday life. It includes self-image issues, difficulty managing emotions and behavior, and a pattern of unstable relationships.',
    symptoms: [
      'Intense fear of abandonment',
      'Unstable relationships',
      'Rapid changes in self-identity',
      'Impulsive and risky behavior',
      'Self-harm or suicidal behavior',
      'Intense and unstable emotions'
    ],
    youtubeVideos: [
      {
        title: 'What is Borderline Personality Disorder?',
        url: 'https://www.youtube.com/watch?v=QLDuGuN_JNQ',
        channel: 'MedCircle'
      },
      {
        title: 'Understanding BPD',
        url: 'https://www.youtube.com/watch?v=BOLblQXS_SQ',
        channel: 'Psych Hub'
      },
      {
        title: 'BPD Explained',
        url: 'https://www.youtube.com/watch?v=bV5z7vRy4wo',
        channel: 'Dr. Tracey Marks'
      }
    ],
    websites: [
      {
        name: 'Moner Daktar - Personality Disorders',
        url: 'https://monerdaktar.com',
        description: 'Specialized therapy for BPD and personality disorders in Bangladesh'
      },
      {
        name: 'Bangladesh Association for Psychiatry',
        url: 'http://www.psychbd.org',
        description: 'Professional psychiatric treatment and DBT therapy referrals'
      },
      {
        name: 'NIMH Bangladesh - Psychiatric Care',
        url: 'http://nimhbd.gov.bd',
        description: 'Comprehensive treatment for personality disorders'
      }
    ],
    color: 'from-violet-500 to-purple-500',
    icon: '💔'
  }
];

export default function ResourcesPage() {
  const router = useRouter();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mental Health Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about different mental health conditions, watch educational videos, and find trusted resources for support and treatment.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for a mental health condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg shadow-lg"
          />
        </div>

        {/* Resources Grid */}
        {!selectedResource ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <div
                key={resource.id}
                className="card-interactive p-6 cursor-pointer transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedResource(resource)}
              >
                <div className={`text-6xl mb-4 text-center`}>
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {resource.shortDescription}
                </p>
                <button className={`w-full btn bg-gradient-to-r ${resource.color} text-white hover:shadow-xl transition-all`}>
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Detailed Resource View */
          <div className="animate-fade-in">
            <button
              onClick={() => setSelectedResource(null)}
              className="btn-secondary mb-6"
            >
              ← Back to Resources
            </button>

            <div className="card-glass p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{selectedResource.icon}</div>
                <h2 className={`text-4xl font-bold bg-gradient-to-r ${selectedResource.color} bg-clip-text text-transparent mb-4`}>
                  {selectedResource.title}
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  {selectedResource.fullDescription}
                </p>
              </div>

              {/* Symptoms */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🔍</span>
                  Common Symptoms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedResource.symptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-white/50 p-4 rounded-lg">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Videos */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📺</span>
                  Educational Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedResource.youtubeVideos.map((video, idx) => (
                    <a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">▶️</span>
                        <span className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                          {video.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">by {video.channel}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Websites */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🌐</span>
                  Trusted Resources
                </h3>
                <div className="space-y-4">
                  {selectedResource.websites.map((website, idx) => (
                    <a
                      key={idx}
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                            {website.name} →
                          </h4>
                          <p className="text-gray-600">{website.description}</p>
                        </div>
                        <span className="text-3xl ml-4">🔗</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Notice */}
              <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <span className="text-4xl">🆘</span>
                  <div>
                    <h4 className="text-lg font-bold text-red-800 mb-2">Need Immediate Help?</h4>
                    <p className="text-gray-700 mb-3">
                      If you're experiencing a mental health crisis or emergency:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Call 09638 800 800</strong> - Moner Daktar Mental Health Helpline</li>
                      <li><strong>Call 10921</strong> - KAAN Suicide Prevention Helpline (4PM-10PM)</li>
                      <li><strong>Call 999</strong> - National Emergency Service (Bangladesh)</li>
                      <li><strong>Call 16263</strong> - National Mental Health Helpline</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Crisis Information */}
        {!selectedResource && (
          <div className="mt-12 card-glass p-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              🆘 Bangladesh Crisis Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                <h4 className="font-bold text-lg mb-2">Moner Daktar Helpline</h4>
                <p className="text-gray-600 text-sm mb-1">09638 800 800</p>
                <p className="text-gray-600 text-xs">24/7 mental health support</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <h4 className="font-bold text-lg mb-2">KAAN Suicide Prevention</h4>
                <p className="text-gray-600 text-sm mb-1">10921</p>
                <p className="text-gray-600 text-xs">Daily 4PM-10PM</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                <h4 className="font-bold text-lg mb-2">National Mental Health</h4>
                <p className="text-gray-600 text-sm mb-1">16263</p>
                <p className="text-gray-600 text-xs">Government helpline</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-700 mb-2">
                <strong>Emergency Services:</strong> Call 999 (Police/Ambulance/Fire)
              </p>
              <p className="text-sm text-gray-600">
                National Institute of Mental Health (NIMH): +880-2-9126954-5
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
