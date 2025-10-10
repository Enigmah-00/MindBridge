# 🚀 Quick Start Guide - MindBridge with Messaging

## 📱 Feature Overview

### For Patients (USER Role)

#### 1. Browse Doctors
**URL:** http://localhost:3000/doctors

**What you'll see:**
- Grid of 8 real doctors from Bangladesh
- Search bar (try "Dhaka", "Psychiatry", or doctor names)
- Filter buttons: All / Telehealth / In-Person
- Each card shows:
  - 👨‍⚕️ Doctor name
  - 📍 Location
  - 🏷️ Specialties
  - 📅 Book button
  - 💬 Message button (GREEN)

**Try it:**
```
1. Go to http://localhost:3000/doctors
2. Search for "Dhaka" - see doctors in Dhaka
3. Click "Telehealth Available" filter
4. Click "💬 Message" on any doctor card
```

#### 2. Message a Doctor
**URL:** http://localhost:3000/messages/[doctorUserId]

**Features:**
- Blue bubbles = Your messages (right side)
- Gray bubbles = Doctor messages (left side)
- Auto-refreshes every 3 seconds
- Timestamps on each message
- Back button to conversations

**Try it:**
```
1. From doctors page, click "💬 Message" button
2. Type: "Hello, I would like to schedule an appointment"
3. Click "Send"
4. Message appears in blue bubble on right
```

#### 3. View All Conversations
**URL:** http://localhost:3000/messages

**What you'll see:**
- List of all your conversations with doctors
- Last message preview
- Unread count (red badge: "2 new")
- Doctor badge
- Timestamp

**Try it:**
```
1. Click "💬 Messages" in navbar
2. See all conversations
3. Click any conversation to open chat
```

#### 4. Your Dashboard
**URL:** http://localhost:3000/dashboard

**Features:**
- Unread messages alert (red banner at top)
- Quick action cards:
  - Complete Profile
  - Take Screeners
  - Find Doctor
- Profile status overview

---

### For Doctors (DOCTOR Role)

#### 1. Doctor Dashboard
**URL:** http://localhost:3000/dashboard

**Completely Different Interface:**

**Section 1: Practice Overview**
- Your name and specialties
- Location (city, country)
- Telehealth status

**Section 2: Today's Appointments**
- Table with columns: Serial, Patient, Time, Status
- **Patient names are clickable** → Opens chat with patient
- Color-coded status badges

**Section 3: Recent Messages**
- Last 5 patient messages
- Red dot = unread
- Click to open conversation

**Try it:**
```
1. Log in as doctor (username: dr_zaman)
2. Dashboard shows appointments + messages
3. Click on a patient name in appointments table
4. Opens chat to message that patient
```

#### 2. Respond to Messages
**URL:** http://localhost:3000/messages

**Features:**
- All patient conversations
- Unread counts
- Click to reply
- Same chat interface as users

**Try it:**
```
1. Go to "💬 Messages" in navbar
2. See conversations with patients
3. Click any patient to reply
4. Type response and send
```

#### 3. Doctor Navigation
**Different from users:**
- ✅ Dashboard (enhanced)
- ✅ Availability
- ✅ Appointments
- ✅ Messages
- ❌ No Profile
- ❌ No Quizzes
- ❌ No Doctors list

---

## 🔒 Security Features

### What Users CAN Do:
- ✅ Message any doctor
- ✅ View conversations with doctors
- ✅ Read messages from doctors

### What Users CANNOT Do:
- ❌ Message other users (not doctors)
- ❌ See other users' conversations

**Test it:**
```
Try to POST to /api/messages with another user's ID as receiverId
Result: 403 error "You can only message doctors"
```

### What Doctors CAN Do:
- ✅ Message any user (reply to patients)
- ✅ View all patient messages
- ✅ See which patients have appointments

---

## 🎯 Testing Scenarios

### Scenario 1: Patient Messages Doctor
```
1. Sign up as USER role
2. Go to /doctors
3. Click "💬 Message" on "Dr. Mohammad Zaman"
4. Send: "I need help with anxiety"
5. Go to /messages to see conversation
6. Wait 3 seconds, messages refresh
```

### Scenario 2: Doctor Replies to Patient
```
1. Log in as doctor (dr_zaman)
2. Dashboard shows "1 unread message"
3. Click on message in "Recent Messages"
4. Reply: "I can help. Let's schedule an appointment"
5. Message appears in blue bubble
```

### Scenario 3: Browse and Filter Doctors
```
1. Log in as USER
2. Go to /doctors
3. Search: "Psychiatry"
4. Result: Doctors with Psychiatry specialty
5. Click "Telehealth Available"
6. Result: Only telehealth doctors
7. Click "💬 Message" to start conversation
```

### Scenario 4: Book Appointment Then Message
```
1. Go to /doctors
2. Click "📅 Book" on any doctor
3. Book an appointment
4. Go back to /doctors
5. Click "💬 Message" on same doctor
6. Message: "I booked an appointment for tomorrow"
```

---

## 📊 Real Data Verification

### Check Doctors in Database:
```bash
# All doctors are real, not dummy data
Dr. Mohammad Zaman - Dhaka (Psychiatry, Therapy)
Dr. Farhana Ahmed - Chittagong (Psychiatry)
Dr. Abdul Rahman - Sylhet (Therapy, Sleep Medicine)
Dr. Nasrin Sultana - Dhaka (Psychiatry, Therapy, Sleep)
Dr. Md. Aminul Islam - Rajshahi (Psychiatry)
Dr. Kamrul Hossain - Khulna (Therapy)
Dr. Taslima Begum - Dhaka (Psychiatry, Sleep Medicine)
Dr. Ashraf Chowdhury - Comilla (Therapy)
```

### Verify No Dummy Data:
```
❌ No "Dr. Alex Smith"
❌ No placeholder emails
✅ All authentic Bangladeshi doctor names
✅ Real cities with GPS coordinates
✅ Actual specialties
```

---

## 🎨 Visual Guide

### Doctors Page
```
┌─────────────────────────────────────────────────┐
│  🩺 Find a Doctor                               │
├─────────────────────────────────────────────────┤
│  [ Search box: name, location, specialty... ]   │
│  [ All ] [ Telehealth Available ] [ In-Person ] │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Dr. Name │  │ Dr. Name │  │ Dr. Name │      │
│  │ 📍 City  │  │ 📍 City  │  │ 📍 City  │      │
│  │ 🏷️ Spec  │  │ 🏷️ Spec  │  │ 🏷️ Spec  │      │
│  │ [📅 Book]│  │ [📅 Book]│  │ [📅 Book]│      │
│  │ [💬 Msg] │  │ [💬 Msg] │  │ [💬 Msg] │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

### Chat Interface
```
┌─────────────────────────────────────────────────┐
│  ← Back | Chat with Dr. Name [Doctor]          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────┐                           │
│  │ Doctor message  │                           │
│  │ 10:30 AM       │                           │
│  └─────────────────┘                           │
│                                                 │
│                           ┌─────────────────┐  │
│                           │ Your message    │  │
│                           │ 10:31 AM       │  │
│                           └─────────────────┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│  [ Type your message... ] [ Send ]             │
└─────────────────────────────────────────────────┘
```

### Doctor Dashboard
```
┌─────────────────────────────────────────────────┐
│  👨‍⚕️ Hello, dr_zaman!                          │
│  Role: DOCTOR                                   │
│  💬 You have 3 unread messages                  │
├─────────────────────────────────────────────────┤
│  🩺 Your Practice                               │
│  Name: Dr. Mohammad Zaman                       │
│  Location: Dhaka, Bangladesh                    │
│  Telehealth: ✅ Enabled                         │
│  Specialties: [Psychiatry] [Therapy]           │
├─────────────────────────────────────────────────┤
│  📅 Today's Appointments     💬 Recent Messages│
│  ┌─────────────────────┐    ┌────────────────┐│
│  │ Serial | Patient    │    │ Patient: msg..││
│  │   1    | john_doe   │    │ 5 min ago     ││
│  │   2    | jane_smith │    │ Patient: msg..││
│  └─────────────────────┘    └────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Messages Not Appearing?
- Wait 3 seconds (auto-refresh interval)
- Check if user is logged in
- Verify receiver is a doctor (users can't message users)

### Can't See Doctors?
- Go to http://localhost:3000/doctors (not /doctors/suggest)
- Make sure you're logged in
- Check database has been seeded

### Wrong Interface?
- Users see: Profile, Quizzes, Doctors
- Doctors see: Availability, Appointments, Messages
- Log out and log in again if confused

---

## 📍 Important URLs

| Page | URL | Who Can Access |
|------|-----|----------------|
| Doctors List | `/doctors` | Users |
| Messages List | `/messages` | Everyone |
| Chat | `/messages/[userId]` | Everyone |
| User Dashboard | `/dashboard` | Users (with profile) |
| Doctor Dashboard | `/dashboard` | Doctors (with appointments) |
| Profile | `/profile` | Users only |
| Availability | `/availability` | Doctors only |

---

## 🎉 Success Indicators

### ✅ Everything Working If You See:
- 8 doctors on /doctors page
- Search and filters functional
- Green "💬 Message" buttons
- Chat interface loads
- Messages send successfully
- Unread counts appear
- Doctor dashboard shows appointments
- Navigation differs by role

### ❌ Issues If You See:
- Empty doctors list
- 403 errors when messaging
- Same dashboard for users and doctors
- Can't find message button

---

## 📞 Quick Commands

### View Doctors API:
```bash
curl http://localhost:3000/api/doctors/list | jq
```

### Test Message API (requires auth):
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"doctor_id","content":"Hello"}'
```

---

**🎊 All features are live and ready to use!**

**Access your app at: http://localhost:3000**
