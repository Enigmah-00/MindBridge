# 🔒 Forgot Password Setup Guide

## Quick Setup (5 minutes)

### 1. Add Environment Variables

Add these to your `.env` file:

```bash
# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Gmail SMTP (recommended for testing)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="MindBridge <noreply@mindbridge.com>"
```

### 2. Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Enter "MindBridge" as the name
6. Copy the generated 16-character password
7. Paste it as `SMTP_PASS` in your `.env` file

### 3. Restart Server

```bash
npm run dev
```

## ✅ Testing the Flow

### Test Forgot Password:

1. Visit: `http://localhost:3000/auth/login`
2. Click **"Forgot password?"** link
3. Enter your email
4. Check your email inbox (and spam folder)
5. Click the reset link in email
6. Set new password
7. Redirected to login automatically

### Test Profile Email Update:

1. Login and go to `/profile`
2. Click "Edit Profile"
3. Update your email
4. Click "Save Changes"

### Test Auto Location:

1. Go to `/profile` while editing
2. Scroll to Location section (or Doctor Profile for doctors)
3. Click **"Update Location"** button
4. Allow browser location access
5. City and Country automatically filled! 🎉

## 🐛 Troubleshooting

### Email not sending?

**Check these:**
- ✅ SMTP credentials are correct
- ✅ Gmail 2-Step Verification is enabled
- ✅ Using App Password (not regular password)
- ✅ No typos in environment variables
- ✅ Server restarted after .env changes

**Still not working?**
Check server console for errors. Look for nodemailer error messages.

### Location not detecting?

**Check these:**
- ✅ Using HTTPS (or localhost)
- ✅ Browser location permission granted
- ✅ Location services enabled on device
- ✅ VPN not interfering

### Prisma errors?

```bash
npx prisma generate
npm run dev
```

## 📧 Alternative Email Services

### SendGrid (recommended for production):

```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

### Mailgun:

```bash
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@your-domain.mailgun.org"
SMTP_PASS="your-mailgun-smtp-password"
```

### AWS SES:

```bash
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-username"
SMTP_PASS="your-ses-smtp-password"
```

## 🎯 Features Included

✅ Secure token-based password reset  
✅ Beautiful HTML email templates  
✅ 1-hour token expiration  
✅ Email validation  
✅ Mandatory email on signup  
✅ Email update in profile  
✅ Auto-fill city/country from GPS  
✅ Reverse geocoding (OpenStreetMap)  
✅ Mobile-responsive design  

## 📝 Notes

- **Tokens expire after 1 hour** - Users must reset within this time
- **Tokens are single-use** - Cleared after successful password reset
- **Gmail free tier** - 500 emails/day limit
- **Location accuracy** - Varies by device and settings
- **Manual entry** - Users can still type city/country manually

## 🚀 Production Deployment

For production, use:
- Professional email service (SendGrid, AWS SES, etc.)
- Real domain in `NEXT_PUBLIC_APP_URL`
- SPF/DKIM/DMARC records for email deliverability
- HTTPS for location services

## 💡 What Users Will See

### Forgot Password Email:

```
Subject: Password Reset Request - MindBridge

🔒 Password Reset Request

Hello username,

We received a request to reset your password for your 
MindBridge account. Click the button below to create 
a new password:

[Reset Password Button]

This link will expire in 1 hour.

If you didn't request this, please ignore this email.
```

### Location Detection:

```
✅ Location detected: Dhaka, Bangladesh
Your location has been automatically filled.
```

That's it! Your forgot password system is ready! 🎉
