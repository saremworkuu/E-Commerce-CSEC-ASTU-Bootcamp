# Email Configuration Guide for Password Reset

## Issues Fixed:
1. ✅ Added missing `resetLimiter` definition
2. ✅ Fixed duplicate rate limiter definitions
3. ✅ Enhanced error handling for email failures

## Required Environment Variables:

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_SERVICE=Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-frontend-domain.com

# Required for AI Chat
GROQ_API_KEY=your_groq_api_key
```

## Gmail Setup Instructions:

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" for the app
- Select "Other (Custom name)" and name it "LuxeCart"
- Copy the 16-character password

### 3. Update Environment
```env
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=the_16_char_app_password
```

## Alternative Email Services:

### Outlook/Hotmail:
```env
EMAIL_SERVICE=Outlook365
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_app_password
```

### Yahoo:
```env
EMAIL_SERVICE=Yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

## AI Chat 405 Error Fix:

The AI chat route is correctly registered as `POST /api/chat`. 
If you're getting 405 errors after deployment:

1. **Check deployment platform** - Some platforms require different route registration
2. **Verify CORS settings** - Ensure your frontend domain is allowed
3. **Check environment variables** - GROQ_API_KEY must be set in production

## Testing Email Functionality:

1. Start your backend server
2. Use Postman or frontend to request password reset
3. Check console logs for email sending status
4. Check spam folder if email doesn't arrive

## Common Issues:

**Email not sending:**
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check if app password is used (not regular password)
- Ensure 2FA is enabled on Gmail account

**AI Chat 405 error:**
- Verify GROQ_API_KEY is set in production
- Check if deployment platform supports POST routes
- Ensure CORS allows your frontend domain

**Rate limiting:**
- Password reset is limited to 5 attempts per 15 minutes
- This prevents abuse and email enumeration
