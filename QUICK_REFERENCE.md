# 🚀 Quick Reference - Testing the New Features

## For Doctors: Setting Availability

### Step 1: Login as Doctor
```
Username: dr_zaman
Password: password123
```

### Step 2: Navigate to Availability
- Click **"Availability"** in the navbar
- Or go to: http://localhost:3000/availibility

### Step 3: Add Your Schedule
1. Click **"➕ Add Time Slot"**
2. Select **Day of Week** (e.g., Monday)
3. Select **Start Time** (e.g., 9:00 AM)
4. Select **End Time** (e.g., 5:00 PM)
5. Select **Slot Duration** (e.g., 1 hour)
6. See preview: "📌 Monday from 9:00 AM to 5:00 PM (60 min slots)"

### Step 4: Add More Days (Optional)
Repeat for other days:
- Tuesday: 9:00 AM - 5:00 PM
- Wednesday: 10:00 AM - 6:00 PM
- Thursday: 9:00 AM - 5:00 PM
- Friday: 9:00 AM - 1:00 PM

### Step 5: Save
- Click **"💾 Save Availability"**
- Wait for success message: "✅ Availability saved successfully!"
- Your schedule is now live!

---

## For Users: Viewing Doctor Availability

### Step 1: Login as User
```
Username: testuser
Password: testpass
```

### Step 2: Browse Doctors
- Click **"Find Doctors"** in navbar
- Or go to: http://localhost:3000/doctors

### Step 3: See Availability
Look for the **"⏰ Available Hours (BD Time)"** section in each doctor card:

**Example:**
```
⏰ Available Hours (BD Time)
Monday: 9:00 AM-5:00 PM
Tuesday: 9:00 AM-5:00 PM
Wednesday: 10:00 AM-6:00 PM
Thursday: 9:00 AM-5:00 PM
Friday: 9:00 AM-1:00 PM
```

### Step 4: Make Informed Decisions
- Compare schedules across doctors
- Pick a doctor whose hours work for you
- Click **"📅 Book"** when ready
- Or click **"💬 Message"** to chat first

---

## Example Doctor Accounts

### Dr. Mohammad Zaman (Psychiatrist)
```
Username: dr_zaman
Password: password123
Location: Dhaka, Bangladesh
Specialties: Psychiatry, Therapy
```

### Dr. Fatima Rahman (Cardiologist)
```
Username: dr_rahman
Password: password123
Location: Chittagong, Bangladesh
Specialties: Cardiology, Internal Medicine
```

---

## Common Time Slots Examples

### Full-Time Doctor (40 hours/week)
```
Monday-Friday: 9:00 AM - 5:00 PM
Lunch break: Split into morning/afternoon if needed
```

### Part-Time Doctor (20 hours/week)
```
Monday: 9:00 AM - 1:00 PM
Wednesday: 9:00 AM - 1:00 PM
Friday: 9:00 AM - 1:00 PM
Saturday: 10:00 AM - 2:00 PM
```

### Evening Clinic
```
Monday-Thursday: 5:00 PM - 9:00 PM
Saturday: 2:00 PM - 8:00 PM
```

### Weekend Only
```
Saturday: 9:00 AM - 5:00 PM
Sunday: 10:00 AM - 4:00 PM
```

---

## Quick Tips

### For Doctors:
💡 **Tip 1**: Set realistic hours you can commit to  
💡 **Tip 2**: Use 1-hour slots for most appointments  
💡 **Tip 3**: Leave buffer time between slots if needed  
💡 **Tip 4**: Update availability when plans change  
💡 **Tip 5**: Include lunch breaks by splitting morning/afternoon  

### For Users:
💡 **Tip 1**: Check doctor availability before booking  
💡 **Tip 2**: All times shown in Bangladesh Time (BD Time)  
💡 **Tip 3**: Use search to find doctors by specialty  
💡 **Tip 4**: Message doctors if you have questions  
💡 **Tip 5**: Book during available hours shown  

---

## Troubleshooting

### "Availability not set yet" message?
- Doctor hasn't set their schedule yet
- They need to log in and add availability
- Check back later or message them

### Times look wrong?
- All times are in BD Time (Asia/Dhaka)
- Convert if you're in a different timezone
- Times are displayed in 12-hour format (AM/PM)

### Can't save availability?
- Make sure you're logged in as a doctor
- Check that start time is before end time
- Ensure slot duration fits within time range
- Try refreshing the page

### Don't see my saved slots?
- Refresh the page
- Check if you clicked "Save Availability"
- Try logging out and back in
- Check browser console for errors

---

## URLs Quick Reference

```
Homepage:           http://localhost:3000
Login:              http://localhost:3000/auth/login
Signup:             http://localhost:3000/auth/signup
Dashboard:          http://localhost:3000/dashboard
Find Doctors:       http://localhost:3000/doctors
Availability:       http://localhost:3000/availibility
Profile:            http://localhost:3000/profile
Messages:           http://localhost:3000/messages
Appointments:       http://localhost:3000/appointments
Quizzes:            http://localhost:3000/quizzes
```

---

## API Endpoints

### Get Doctor List with Availability
```bash
curl http://localhost:3000/api/doctors/list
```

Response includes:
- Doctor details
- Specialties
- **availability** array (new!)
- **hasAvailability** flag (new!)

### Get My Availability (Doctor only)
```bash
curl -H "Cookie: token=YOUR_TOKEN" \
     http://localhost:3000/api/availibility
```

### Save Availability (Doctor only)
```bash
curl -X POST \
     -H "Cookie: token=YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"slots":[...]}' \
     http://localhost:3000/api/availibility
```

---

## Testing Checklist

### ✅ Doctor Features
- [ ] Login as doctor
- [ ] Navigate to Availability page
- [ ] See clean hour-to-hour UI
- [ ] Add multiple time slots
- [ ] See visual preview of each slot
- [ ] Remove a slot
- [ ] Save availability
- [ ] Refresh - slots persist
- [ ] Logout

### ✅ User Features
- [ ] Login as user
- [ ] Go to Find Doctors page
- [ ] See doctor cards with availability
- [ ] Check "Available Hours (BD Time)" section
- [ ] See day-by-day schedule
- [ ] Verify times are readable (9:00 AM format)
- [ ] Check doctor without availability shows fallback
- [ ] Search/filter still works
- [ ] Book appointment with available doctor

### ✅ Mobile Testing
- [ ] Open on mobile device
- [ ] Availability page responsive
- [ ] Doctor cards stack properly
- [ ] Dropdowns work on mobile
- [ ] Scrolling works smoothly

---

## Success Indicators

### You know it's working when:
✅ Dropdowns show times like "9:00 AM", not "540"  
✅ Days show names like "Monday", not "1"  
✅ Visual preview shows readable schedule  
✅ Doctor cards show availability section  
✅ Times display in BD Time format  
✅ "Availability not set yet" for doctors without schedule  
✅ No console errors  
✅ Save button shows success message  

---

## Data Examples

### Sample Slot Data (Backend)
```json
{
  "weekday": 1,
  "startMinute": 540,
  "endMinute": 1020,
  "slotMinutes": 60,
  "timezone": "Asia/Dhaka"
}
```

### Formatted Display (Frontend)
```
Monday: 9:00 AM-5:00 PM
```

### Conversion
```
540 minutes  = 9:00 AM
1020 minutes = 5:00 PM
60 minutes   = 1 hour slot
```

---

**Quick Start:** http://localhost:3000  
**Status:** ✅ Server Running  
**All Features:** ✅ Ready to Test  

*Quick reference created: October 11, 2025*
