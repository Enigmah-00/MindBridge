import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-up">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Your Mental Health Journey Starts Here
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MindBridge
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Bridge your lifestyle and mental wellbeing. Get personalized insights, take validated screeners,
            and connect to nearby specialists.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/signup" className="btn btn-primary text-base px-8 py-3 shadow-lg hover:shadow-xl">
              <span>Get Started Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/auth/login" className="btn btn-secondary text-base px-8 py-3">
              <span>Sign In</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">Join 1000+ Users</div>
              <div className="text-gray-600">Taking control of their mental health</div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative card p-2 animate-scale-in">
            <img 
              src="https://media.istockphoto.com/id/1307095695/photo/adult-and-children-hands-holding-paper-brain-and-heart-brain-stroke-world-heart-day-world.webp?a=1&b=1&s=612x612&w=0&k=20&c=EswERtArXiFM3bGVoD8PM4cuh0gawmGlXH6C8kCR-Qw=" 
              alt="Mental Health"
              className="rounded-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive tools and resources to support your mental wellbeing journey</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="card-interactive p-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lifestyle Profile</h3>
            <p className="text-sm text-gray-600">Track sleep, exercise, diet, and lifestyle factors</p>
          </div>
          
          <div className="card-interactive p-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health Screeners</h3>
            <p className="text-sm text-gray-600">8 validated assessments including PHQ-9, GAD-7, and more</p>
          </div>
          
          <div className="card-interactive p-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600">Personalized suggestions based on your profile</p>
          </div>
          
          <div className="card-interactive p-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Specialists</h3>
            <p className="text-sm text-gray-600">Connect with nearby mental health professionals</p>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="glass-card p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">8+</div>
            <div className="text-gray-600">Validated Assessments</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-gray-600">Access to Resources</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-gray-600">Private & Secure</div>
          </div>
        </div>
      </section>
    </div>
  );
}