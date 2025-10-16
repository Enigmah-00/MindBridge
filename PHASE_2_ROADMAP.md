# 🗺️ Phase 2 Roadmap: Daily Check-In System

## 🎯 Goal
**Build the data collection system that makes MindBridge work like Google Maps—collecting daily "GPS coordinates" for mental health journeys.**

---

## 📅 Timeline: 7 Days

### Day 1: API Foundation (Read Operations)
**Files to Create:**
- `/src/app/api/check-in/today/route.ts`
- `/src/app/api/check-in/streak/route.ts`

**Endpoints:**
```typescript
GET /api/check-in/today
Response: {
  checkIn: DailyCheckIn | null,
  morningComplete: boolean,
  eveningComplete: boolean,
  needsCheckIn: boolean
}

GET /api/check-in/streak
Response: {
  currentStreak: number,
  longestStreak: number,
  totalCheckIns: number,
  lastCheckIn: Date | null
}
```

**Tasks:**
- [ ] Set up Prisma query for today's check-in
- [ ] Calculate streak from historical data
- [ ] Handle edge cases (new users, timezone)
- [ ] Add error handling
- [ ] Test with Postman/curl

---

### Day 2: API Foundation (Write Operations)
**Files to Create:**
- `/src/app/api/check-in/submit/route.ts`

**Endpoint:**
```typescript
POST /api/check-in/submit
Body: {
  userId: string,
  date: Date,
  // Morning fields
  sleepHours?: number,
  sleepQuality?: number,
  morningMood?: number,
  morningEnergy?: number,
  medicationTaken?: boolean,
  // Evening fields
  eveningMood?: number,
  overallDayRating?: number,
  exerciseMinutes?: number,
  exerciseIntensity?: string,
  socialInteractions?: number,
  socialQuality?: number,
  stressLevel?: number,
  stressEvents?: string,
  copingStrategies?: string,
  anxietyLevel?: number,
  depressionIndicator?: number,
  intrusiveThoughts?: boolean,
  panicAttacks?: boolean,
  selfHarmThoughts?: boolean,
  gratitudeNote?: string,
  dailyWins?: string,
  difficultMoments?: string,
  // Completion flags
  morningComplete?: boolean,
  eveningComplete?: boolean
}

Response: {
  success: boolean,
  checkIn: DailyCheckIn,
  riskAssessment?: {
    riskScore: number,
    riskLevel: string,
    recommendedActions: string[]
  }
}
```

**Tasks:**
- [ ] Create or update DailyCheckIn record
- [ ] Validate required fields
- [ ] Calculate completion status
- [ ] Trigger risk assessment (Phase 3)
- [ ] Update streak counter
- [ ] Handle concurrent updates
- [ ] Test edge cases

---

### Day 3: Morning Check-In UI
**Files to Create:**
- `/src/components/check-in/MorningCheckIn.tsx`

**Component Structure:**
```tsx
interface MorningCheckInProps {
  onComplete: (data: MorningData) => void;
  onSkip?: () => void;
}

export default function MorningCheckIn({ onComplete, onSkip }: Props) {
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [morningMood, setMorningMood] = useState(5);
  const [morningEnergy, setMorningEnergy] = useState(5);
  const [medicationTaken, setMedicationTaken] = useState(false);

  const handleSubmit = () => {
    onComplete({
      sleepHours,
      sleepQuality,
      morningMood,
      morningEnergy,
      medicationTaken,
      morningComplete: true
    });
  };

  return (
    <div className="space-y-6">
      <h2>Good morning! 🌅</h2>
      <p>Let's start your day with a quick 2-minute check-in.</p>

      {/* Question 1: Sleep Hours */}
      <div>
        <label>How many hours did you sleep?</label>
        <input 
          type="range" 
          min="0" 
          max="12" 
          step="0.5"
          value={sleepHours}
          onChange={(e) => setSleepHours(Number(e.target.value))}
        />
        <span>{sleepHours} hours</span>
      </div>

      {/* Question 2: Sleep Quality */}
      <div>
        <label>How was your sleep quality?</label>
        <StarRating 
          value={sleepQuality} 
          onChange={setSleepQuality}
          max={5}
        />
      </div>

      {/* Question 3: Morning Mood */}
      <div>
        <label>How's your mood this morning?</label>
        <EmojiScale 
          value={morningMood}
          onChange={setMorningMood}
          min={1}
          max={10}
          emojis={['😢', '😟', '😐', '🙂', '😊', '😄']}
        />
      </div>

      {/* Question 4: Energy Level */}
      <div>
        <label>How's your energy level?</label>
        <EnergyGauge 
          value={morningEnergy}
          onChange={setMorningEnergy}
          min={1}
          max={10}
        />
      </div>

      {/* Question 5: Medication */}
      <div>
        <label>
          <input 
            type="checkbox"
            checked={medicationTaken}
            onChange={(e) => setMedicationTaken(e.target.checked)}
          />
          I took my medication today
        </label>
      </div>

      <div className="flex gap-4">
        <button onClick={handleSubmit}>Complete Morning Check-In</button>
        <button onClick={onSkip}>Skip for now</button>
      </div>
    </div>
  );
}
```

**Tasks:**
- [ ] Create base component structure
- [ ] Build custom UI widgets (StarRating, EmojiScale, EnergyGauge)
- [ ] Add form validation
- [ ] Add loading states
- [ ] Style with Tailwind
- [ ] Test accessibility
- [ ] Add animations

---

### Day 4: Evening Check-In UI
**Files to Create:**
- `/src/components/check-in/EveningCheckIn.tsx`

**Component Structure:**
```tsx
interface EveningCheckInProps {
  morningData?: MorningData;
  onComplete: (data: EveningData) => void;
  onSkip?: () => void;
}

export default function EveningCheckIn({ morningData, onComplete, onSkip }: Props) {
  const [overallDayRating, setOverallDayRating] = useState(5);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [exerciseIntensity, setExerciseIntensity] = useState('none');
  const [socialInteractions, setSocialInteractions] = useState(0);
  const [socialQuality, setSocialQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [stressEvents, setStressEvents] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [depressionIndicator, setDepressionIndicator] = useState(5);
  const [intrusiveThoughts, setIntrusiveThoughts] = useState(false);
  const [panicAttacks, setPanicAttacks] = useState(false);
  const [selfHarmThoughts, setSelfHarmThoughts] = useState(false);
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [dailyWins, setDailyWins] = useState('');
  const [difficultMoments, setDifficultMoments] = useState('');

  const handleSubmit = () => {
    onComplete({
      ...morningData, // Include morning data
      overallDayRating,
      exerciseMinutes,
      exerciseIntensity,
      socialInteractions,
      socialQuality,
      stressLevel,
      stressEvents,
      copingStrategies,
      anxietyLevel,
      depressionIndicator,
      intrusiveThoughts,
      panicAttacks,
      selfHarmThoughts,
      gratitudeNote,
      dailyWins,
      difficultMoments,
      eveningComplete: true
    });
  };

  return (
    <div className="space-y-6">
      <h2>How was your day? 🌆</h2>
      <p>Let's reflect on your day with a 3-minute check-in.</p>

      {/* Show morning summary if available */}
      {morningData && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p>This morning you reported:</p>
          <p>Sleep: {morningData.sleepHours}h, Mood: {morningData.morningMood}/10</p>
        </div>
      )}

      {/* Question 1: Overall Day Rating */}
      <div>
        <label>Overall, how was your day?</label>
        <EmojiScale 
          value={overallDayRating}
          onChange={setOverallDayRating}
          min={1}
          max={10}
        />
      </div>

      {/* Question 2: Exercise */}
      <div>
        <label>How many minutes of exercise today?</label>
        <input 
          type="number"
          value={exerciseMinutes}
          onChange={(e) => setExerciseMinutes(Number(e.target.value))}
          min={0}
          max={300}
        />
        <select 
          value={exerciseIntensity}
          onChange={(e) => setExerciseIntensity(e.target.value)}
        >
          <option value="none">No exercise</option>
          <option value="light">Light (walking, stretching)</option>
          <option value="moderate">Moderate (jogging, cycling)</option>
          <option value="vigorous">Vigorous (running, HIIT)</option>
        </select>
      </div>

      {/* Question 3: Social Interactions */}
      <div>
        <label>How many social interactions did you have?</label>
        <input 
          type="range"
          min={0}
          max={20}
          value={socialInteractions}
          onChange={(e) => setSocialInteractions(Number(e.target.value))}
        />
        <span>{socialInteractions} interactions</span>
        
        {socialInteractions > 0 && (
          <>
            <label>How would you rate the quality?</label>
            <StarRating 
              value={socialQuality}
              onChange={setSocialQuality}
              max={10}
            />
          </>
        )}
      </div>

      {/* Question 4: Stress Level */}
      <div>
        <label>What was your stress level today?</label>
        <input 
          type="range"
          min={1}
          max={10}
          value={stressLevel}
          onChange={(e) => setStressLevel(Number(e.target.value))}
        />
        <span>{stressLevel}/10</span>
        
        {stressLevel > 5 && (
          <textarea
            placeholder="What caused stress today? (optional)"
            value={stressEvents}
            onChange={(e) => setStressEvents(e.target.value)}
          />
        )}
      </div>

      {/* Question 5: Mental Health Indicators */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">
          These questions help us understand your mental health better.
          Your answers are private and secure.
        </p>
        
        <label>Anxiety level today?</label>
        <input 
          type="range"
          min={1}
          max={10}
          value={anxietyLevel}
          onChange={(e) => setAnxietyLevel(Number(e.target.value))}
        />
        
        <label>Depression indicator?</label>
        <input 
          type="range"
          min={1}
          max={10}
          value={depressionIndicator}
          onChange={(e) => setDepressionIndicator(Number(e.target.value))}
        />
        
        <label>
          <input 
            type="checkbox"
            checked={intrusiveThoughts}
            onChange={(e) => setIntrusiveThoughts(e.target.checked)}
          />
          I experienced intrusive thoughts
        </label>
        
        <label>
          <input 
            type="checkbox"
            checked={panicAttacks}
            onChange={(e) => setPanicAttacks(e.target.checked)}
          />
          I had a panic attack
        </label>
        
        <label>
          <input 
            type="checkbox"
            checked={selfHarmThoughts}
            onChange={(e) => setSelfHarmThoughts(e.target.checked)}
          />
          I had thoughts of self-harm
        </label>
      </div>

      {/* Question 6: Coping Strategies */}
      <div>
        <label>What coping strategies did you use today?</label>
        <textarea
          placeholder="E.g., meditation, talking to a friend, exercise..."
          value={copingStrategies}
          onChange={(e) => setCopingStrategies(e.target.value)}
        />
      </div>

      {/* Question 7: Gratitude & Wins */}
      <div>
        <label>What's one thing you're grateful for today?</label>
        <textarea
          placeholder="Even small things count..."
          value={gratitudeNote}
          onChange={(e) => setGratitudeNote(e.target.value)}
        />
        
        <label>What went well today?</label>
        <textarea
          placeholder="Celebrate your wins, big or small..."
          value={dailyWins}
          onChange={(e) => setDailyWins(e.target.value)}
        />
        
        <label>What was difficult? (optional)</label>
        <textarea
          placeholder="It's okay to acknowledge challenges..."
          value={difficultMoments}
          onChange={(e) => setDifficultMoments(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={handleSubmit}>Complete Day Check-In</button>
        <button onClick={onSkip}>Skip for now</button>
      </div>
    </div>
  );
}
```

**Tasks:**
- [ ] Create base component structure
- [ ] Build all form inputs
- [ ] Add conditional rendering (show stress textarea if stress > 5)
- [ ] Add form validation
- [ ] Style with Tailwind
- [ ] Test accessibility
- [ ] Add smooth transitions

---

### Day 5: Modal Container & Flow
**Files to Create:**
- `/src/components/check-in/DailyCheckInModal.tsx`
- `/src/components/check-in/CheckInStreak.tsx`

**DailyCheckInModal.tsx:**
```tsx
type Step = 'morning' | 'evening' | 'complete';

export default function DailyCheckInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('morning');
  const [morningData, setMorningData] = useState<MorningData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfShouldShow();
  }, []);

  const checkIfShouldShow = async () => {
    const res = await fetch('/api/check-in/today');
    const data = await res.json();
    
    if (!data.checkIn) {
      setIsOpen(true);
      setStep('morning');
    } else if (data.morningComplete && !data.eveningComplete) {
      // Check if it's evening (after 6 PM)
      const hour = new Date().getHours();
      if (hour >= 18) {
        setIsOpen(true);
        setStep('evening');
        setMorningData(data.checkIn);
      }
    }
  };

  const handleMorningComplete = async (data: MorningData) => {
    setLoading(true);
    try {
      await fetch('/api/check-in/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setMorningData(data);
      setStep('complete');
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEveningComplete = async (data: EveningData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/check-in/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      // Show risk assessment if provided
      if (result.riskAssessment) {
        showRiskAssessment(result.riskAssessment);
      }
      
      setStep('complete');
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onClose={() => setIsOpen(false)}
      maxWidth="lg"
    >
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className={step === 'morning' ? 'text-blue-600 font-bold' : ''}>
              Morning
            </span>
            <span className={step === 'evening' ? 'text-blue-600 font-bold' : ''}>
              Evening
            </span>
            <span className={step === 'complete' ? 'text-green-600 font-bold' : ''}>
              Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ 
                width: step === 'morning' ? '33%' : step === 'evening' ? '66%' : '100%' 
              }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4">Saving your check-in...</p>
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
            <h2 className="text-2xl font-bold mb-2">Check-in complete!</h2>
            <p className="text-gray-600">
              Thank you for tracking your mental health journey today.
            </p>
            <CheckInStreak />
          </div>
        )}
      </div>
    </Modal>
  );
}
```

**CheckInStreak.tsx:**
```tsx
export default function CheckInStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    const res = await fetch('/api/check-in/streak');
    const data = await res.json();
    setStreakData(data);
  };

  if (!streakData) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Current Streak</p>
          <p className="text-4xl font-bold">{streakData.currentStreak} days</p>
        </div>
        <div className="text-6xl">🔥</div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm opacity-90">Longest Streak</p>
          <p className="text-2xl font-bold">{streakData.longestStreak} days</p>
        </div>
        <div>
          <p className="text-sm opacity-90">Total Check-Ins</p>
          <p className="text-2xl font-bold">{streakData.totalCheckIns}</p>
        </div>
      </div>
      
      {streakData.currentStreak >= 7 && (
        <div className="mt-4 bg-white/20 p-3 rounded-lg">
          <p className="text-sm">
            🎯 Amazing! You've checked in for a full week. Keep it up!
          </p>
        </div>
      )}
    </div>
  );
}
```

**Tasks:**
- [ ] Create modal container with step management
- [ ] Add progress bar visualization
- [ ] Implement auto-show logic (morning/evening)
- [ ] Build streak display component
- [ ] Add loading states
- [ ] Add success animations
- [ ] Test flow from morning → evening → complete

---

### Day 6: Dashboard Integration
**Files to Update:**
- `/src/app/dashboard/page.tsx`

**Changes:**
```tsx
import DailyCheckInModal from '@/components/check-in/DailyCheckInModal';
import CheckInStreak from '@/components/check-in/CheckInStreak';

export default function Dashboard() {
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null);

  useEffect(() => {
    fetchCheckInStatus();
  }, []);

  const fetchCheckInStatus = async () => {
    const res = await fetch('/api/check-in/today');
    const data = await res.json();
    setCheckInData(data);
  };

  return (
    <div>
      <DailyCheckInModal />

      {/* Header with Streak */}
      <div className="flex justify-between items-center mb-8">
        <h1>Dashboard</h1>
        <CheckInStreak />
      </div>

      {/* Check-In Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Daily Check-In</h3>
          {checkInData?.morningComplete && checkInData?.eveningComplete ? (
            <div>
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <p className="text-gray-600">Completed for today!</p>
            </div>
          ) : checkInData?.morningComplete ? (
            <div>
              <div className="text-blue-600 text-4xl mb-2">🌅</div>
              <p className="text-gray-600">Morning complete. Check back tonight!</p>
            </div>
          ) : (
            <div>
              <div className="text-yellow-600 text-4xl mb-2">⏰</div>
              <p className="text-gray-600 mb-4">Haven't checked in yet today</p>
              <button 
                onClick={() => window.location.reload()} // Re-trigger modal
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Start Check-In
              </button>
            </div>
          )}
        </div>

        {/* Other dashboard cards... */}
      </div>

      {/* Rest of dashboard... */}
    </div>
  );
}
```

**Tasks:**
- [ ] Import DailyCheckInModal component
- [ ] Add check-in status card to dashboard
- [ ] Show streak in header
- [ ] Add "Start Check-In" button
- [ ] Test modal auto-show on dashboard load
- [ ] Style dashboard updates

---

### Day 7: Polish & Testing

**Tasks:**
- [ ] Test complete morning → evening flow
- [ ] Test skip functionality
- [ ] Test streak calculation accuracy
- [ ] Test timezone edge cases
- [ ] Test concurrent user updates
- [ ] Add error boundaries
- [ ] Add loading skeletons
- [ ] Polish animations & transitions
- [ ] Test on mobile devices
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Performance optimization
- [ ] Code cleanup & documentation

**Edge Cases to Test:**
- [ ] New user (no previous check-ins)
- [ ] User completes morning but skips evening
- [ ] User tries to submit twice in one day
- [ ] User submits at midnight (timezone boundary)
- [ ] Network error during submission
- [ ] User closes modal mid-flow
- [ ] User has 50+ day streak (display handling)

---

## 🎯 Success Criteria

### Phase 2 is complete when:
- [ ] Users can submit morning check-in (5 questions)
- [ ] Users can submit evening check-in (7+ questions)
- [ ] Check-in modal auto-shows when needed
- [ ] Streak calculation works correctly
- [ ] Dashboard shows check-in status
- [ ] All API routes working without errors
- [ ] UI is responsive and accessible
- [ ] Data saves correctly to database
- [ ] Users can skip check-ins
- [ ] Flow is smooth and intuitive

---

## 📊 Expected Outcomes

**Data Collection:**
- 40+ data points collected per user per day
- Morning check-ins capture sleep & starting state
- Evening check-ins capture activities & mental health
- Comprehensive lifestyle tracking established

**User Experience:**
- 2-minute morning check-in
- 3-minute evening check-in
- Gamification through streaks
- Immediate feedback on completion
- Non-intrusive reminders

**Database:**
- DailyCheckIn table populated with real data
- Data ready for ML model training (Phase 3)
- Historical patterns visible
- Risk assessment baseline established

---

## 🚀 After Phase 2

**Phase 3: ML Model Training (Week 2)**
- Download Kaggle datasets
- Train risk assessment model
- Train crisis detection model
- Integrate ML predictions with check-ins

**Phase 4: Smart Recommendations (Week 3)**
- Build intervention library
- Create matching algorithm
- Display recommended actions
- Track effectiveness

**Phase 5: Dashboard Redesign (Week 4)**
- "Mental Health Map" interface
- Current location visualization
- Journey timeline
- Progress graphs

---

## 💡 Pro Tips

**Development:**
- Start with API routes (backend first)
- Test each endpoint with Postman before building UI
- Build morning check-in first (simpler)
- Reuse components for evening check-in
- Use TypeScript interfaces for type safety

**UI/UX:**
- Make sliders smooth and responsive
- Use emojis for visual feedback
- Show progress (33% → 66% → 100%)
- Celebrate completions (animations, confetti)
- Don't force check-ins (allow skip)

**Data:**
- Make most fields optional
- Don't overwhelm with too many questions at once
- Group related questions together
- Show "Why we ask this" tooltips
- Validate on frontend and backend

**Testing:**
- Test with real users ASAP
- Gather feedback on question phrasing
- Monitor completion rates
- Adjust questions based on data
- A/B test different flows

---

## 🎉 Let's Build!

**Phase 1 gave us the foundation.**  
**Phase 2 collects the GPS coordinates.**  
**Phase 3 will make sense of the data with ML.**

**Ready to turn MindBridge into Google Maps for mental health!** 🗺️🧠

---

*Start with Day 1: Create `/src/app/api/check-in/today/route.ts`*

