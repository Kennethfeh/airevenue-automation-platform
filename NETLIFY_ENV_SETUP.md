# Netlify Environment Variables Setup for FlowSupport AI

## URGENT: Fix "Something went wrong" Paddle Error

The Paddle checkout error is happening because environment variables are not set in Netlify.

### Required Environment Variables

Go to your **Netlify Dashboard** → **Site Settings** → **Environment Variables** and add:

```bash
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_258982d9ee41c671665ae34b65d
NEXT_PUBLIC_PADDLE_VENDOR_ID=253274
```

### Steps to Fix:

1. **Login to Netlify Dashboard**: https://app.netlify.com
2. **Select your site** (flowsupportai.com)
3. **Go to Site Settings** → **Environment Variables**
4. **Add the variables above**
5. **Trigger a new deploy** (or it will deploy automatically)

### After Adding Variables:

- The "Something went wrong" error will be fixed
- Paddle checkout buttons will work properly
- Customers can complete payments
- Revenue will flow to your Paddle account (Seller ID: 253274)

### Verification:

Once deployed with env vars:
1. Go to your pricing page
2. Click "Start Free Trial"
3. Should see Paddle checkout overlay (not error message)
4. Test with a small payment if desired

---

**This is the final step to make payments work!** 🚀💳