# 🎨 Visual User Flow Guide

## 🔒 Forgot Password Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                               │
│  ┌─────────────────────────────────────────────┐           │
│  │  Username or Email:  [____________]         │           │
│  │  Password:           [____________]         │           │
│  │                                              │           │
│  │  ┌───────────────────────┐                 │           │
│  │  │    Sign In           │                 │           │
│  │  └───────────────────────┘                 │           │
│  │                                              │           │
│  │  [Forgot password?] ← CLICK HERE            │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              FORGOT PASSWORD PAGE                           │
│  ┌─────────────────────────────────────────────┐           │
│  │  🔑 Forgot Password?                        │           │
│  │                                              │           │
│  │  Email Address:  [_________________]        │           │
│  │                                              │           │
│  │  ┌───────────────────────┐                 │           │
│  │  │ Send Reset Link      │                 │           │
│  │  └───────────────────────┘                 │           │
│  │                                              │           │
│  │  ← Back to Login                            │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    EMAIL INBOX                              │
│  ┌─────────────────────────────────────────────┐           │
│  │  From: MindBridge <noreply@mindbridge.com>  │           │
│  │  Subject: Password Reset Request            │           │
│  │  ┌──────────────────────────────────────┐  │           │
│  │  │  🔒 Password Reset Request           │  │           │
│  │  │                                       │  │           │
│  │  │  Hello username,                      │  │           │
│  │  │                                       │  │           │
│  │  │  Click the button below to reset:    │  │           │
│  │  │  ┌───────────────────┐               │  │           │
│  │  │  │ Reset Password   │ ← CLICK        │  │           │
│  │  │  └───────────────────┘               │  │           │
│  │  │                                       │  │           │
│  │  │  Link expires in 1 hour              │  │           │
│  │  └──────────────────────────────────────┘  │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               RESET PASSWORD PAGE                           │
│  ┌─────────────────────────────────────────────┐           │
│  │  🔐 Set New Password                        │           │
│  │                                              │           │
│  │  New Password:     [____________] 👁         │           │
│  │  Confirm Password: [____________] 👁         │           │
│  │                                              │           │
│  │  ┌───────────────────────┐                 │           │
│  │  │  Reset Password      │                 │           │
│  │  └───────────────────────┘                 │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUCCESS SCREEN                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  ✅ Password Reset Successful!              │           │
│  │                                              │           │
│  │  Your password has been changed.            │           │
│  │                                              │           │
│  │  Redirecting to login in 3 seconds...       │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│             BACK TO LOGIN PAGE                              │
│  (Can now login with new password)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Signup with Email Required

```
┌─────────────────────────────────────────────────────────────┐
│                   SIGNUP PAGE                               │
│  ┌─────────────────────────────────────────────┐           │
│  │  Create your account                        │           │
│  │                                              │           │
│  │  ⚪ User    ⚫ Doctor                        │           │
│  │                                              │           │
│  │  Username:  [____________]                  │           │
│  │                                              │           │
│  │  Email:     [____________] ← REQUIRED       │           │
│  │  📧 Required for password recovery          │           │
│  │                                              │           │
│  │  Password:  [____________]                  │           │
│  │  🔒 Minimum 6 characters                    │           │
│  │                                              │           │
│  │  ┌───────────────────────┐                 │           │
│  │  │    Sign Up           │                 │           │
│  │  └───────────────────────┘                 │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 Profile with Email Field

```
┌─────────────────────────────────────────────────────────────┐
│                    PROFILE PAGE                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  Lifestyle Profile          [✏️ Edit Profile]│           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  📋 Personal Information                     │           │
│  │  ─────────────────────────────────────────  │           │
│  │                                              │           │
│  │  Email: *        [___________________]      │           │
│  │  📧 Required for password recovery          │           │
│  │                                              │           │
│  │  Age: *          [___]    Gender: * [____]  │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  📍 Location                                 │           │
│  │  ─────────────────────────────────────────  │           │
│  │                                              │           │
│  │  City:    [____________]                    │           │
│  │  Country: [____________]                    │           │
│  │                                              │           │
│  │  📍 Location Detection                       │           │
│  │  ┌───────────────────────────────────────┐ │           │
│  │  │ Click below to auto-fill city/country │ │           │
│  │  │                                        │ │           │
│  │  │  ┌──────────────────────┐            │ │           │
│  │  │  │ Update Location     │ ← CLICK    │ │           │
│  │  │  └──────────────────────┘            │ │           │
│  │  └───────────────────────────────────────┘ │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 Auto Location Detection Flow

```
STEP 1: User Clicks Button
┌────────────────────────────────┐
│  ┌──────────────────────┐     │
│  │  Update Location    │     │
│  └──────────────────────┘     │
└────────────────────────────────┘
              │
              ▼
STEP 2: Browser Permission
┌────────────────────────────────┐
│  📍 Allow "MindBridge"         │
│     to access your location?   │
│                                 │
│  [ Block ]    [ Allow ]        │
└────────────────────────────────┘
              │
              ▼ (Allow)
STEP 3: Getting GPS Coordinates
┌────────────────────────────────┐
│  📍 Getting your location...   │
│  ⏳ Please wait                │
└────────────────────────────────┘
              │
              ▼
STEP 4: Reverse Geocoding
┌────────────────────────────────┐
│  🗺️ Looking up city/country   │
│  🌐 OpenStreetMap API          │
└────────────────────────────────┘
              │
              ▼
STEP 5: Auto-Fill & Confirmation
┌────────────────────────────────┐
│  ✅ Location detected:         │
│     Dhaka, Bangladesh          │
│                                 │
│  City:    [Dhaka        ]     │
│  Country: [Bangladesh   ]     │
└────────────────────────────────┘
```

---

## 👨‍⚕️ Doctor Profile with Location

```
┌─────────────────────────────────────────────────────────────┐
│                  DOCTOR PROFILE                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  👨‍⚕️ Doctor Profile                           │           │
│  │  ─────────────────────────────────────────  │           │
│  │                                              │           │
│  │  Email: *             [___________________] │           │
│  │  📧 Required for password recovery          │           │
│  │                                              │           │
│  │  Professional Name: * [___________________] │           │
│  │                                              │           │
│  │  City: *              [___________________] │           │
│  │  Country: *           [Bangladesh ▼]       │           │
│  │                                              │           │
│  │  ┌──────────────────────────────────────┐  │           │
│  │  │ 📍 Update Location                  │  │           │
│  │  │   (Auto-fill City & Country)        │  │           │
│  │  └──────────────────────────────────────┘  │           │
│  │                                              │           │
│  │  ☑️ Offer Telehealth Services               │           │
│  │                                              │           │
│  │  Consultation Fee (৳):  [_____]             │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Complete User Journey

### New User Signup:
```
1. Visit /auth/signup
2. Enter username, EMAIL (required), password
3. Select role (User/Doctor)
4. Click "Sign Up"
5. Redirected to dashboard
6. Go to profile to complete setup
7. Click "Update Location" to auto-fill city/country
8. Save profile
```

### Existing User - Forgot Password:
```
1. Visit /auth/login
2. Click "Forgot password?"
3. Enter email address
4. Check email (inbox or spam)
5. Click reset link in email
6. Set new password
7. Auto-redirected to login
8. Login with new password
```

### Update Email:
```
1. Login to account
2. Go to /profile
3. Click "Edit Profile"
4. Update email field (first field)
5. Save changes
6. Email updated successfully
```

### Enable Location:
```
1. Go to /profile while editing
2. Find "Location" section
3. Click "Update Location" button
4. Allow browser location access
5. City and Country auto-filled
6. Confirmation shown
7. Save profile
```

---

## 📧 Email Template Preview

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 🔒  PASSWORD RESET REQUEST                       │ │
│  │     ───────────────────────────                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  Hello username,                                       │
│                                                         │
│  We received a request to reset your password for     │
│  your MindBridge account. Click the button below to   │
│  create a new password:                                │
│                                                         │
│           ┌─────────────────────┐                     │
│           │  RESET PASSWORD    │                     │
│           └─────────────────────┘                     │
│                                                         │
│  Or copy and paste this link into your browser:       │
│  http://localhost:3000/auth/reset-password/abc123... │
│                                                         │
│  ⏰ This link will expire in 1 hour.                  │
│                                                         │
│  If you didn't request this password reset, please    │
│  ignore this email. Your password will remain          │
│  unchanged.                                             │
│                                                         │
│  Best regards,                                          │
│  The MindBridge Team                                    │
│                                                         │
│  ──────────────────────────────────────────────────   │
│  © 2025 MindBridge. All rights reserved.               │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Gradients Used:
```
Login/Signup Pages:   from-purple-600 to-blue-600
Success States:       from-green-400 to-green-600
Buttons:              from-purple-600 to-blue-600
Backgrounds:          from-purple-50 to-blue-50
```

### Status Colors:
```
✅ Success:  Green (#10B981)
❌ Error:    Red (#EF4444)
⚠️ Warning:  Yellow (#F59E0B)
ℹ️ Info:     Blue (#3B82F6)
```

---

## 🔐 Security Indicators

### Password Strength:
```
Weak:        ▓░░░░░  (< 6 characters)
Medium:      ▓▓▓░░░  (6-8 characters)
Strong:      ▓▓▓▓▓▓  (> 8 characters + special)
```

### Token Status:
```
Valid:       ✅ Token is valid
Expired:     ⏰ Token has expired
Used:        🚫 Token already used
Invalid:     ❌ Invalid token
```

---

## 📱 Mobile Responsive

### Mobile View (< 768px):
```
┌─────────────────┐
│  🔒 MindBridge  │
│                 │
│  Email:         │
│  [___________]  │
│                 │
│  Password:      │
│  [___________]  │
│                 │
│  ┌───────────┐  │
│  │  Sign In  │  │
│  └───────────┘  │
│                 │
│  Forgot pwd?    │
└─────────────────┘
```

### Desktop View (> 768px):
```
┌──────────────────────────────────┐
│       🔒 MindBridge Login        │
│                                   │
│  Email:     [________________]   │
│  Password:  [________________]   │
│                                   │
│  ┌─────────────────────────┐    │
│  │       Sign In          │    │
│  └─────────────────────────┘    │
│                                   │
│  Forgot password?                │
└──────────────────────────────────┘
```

---

**End of Visual Guide** 🎨
