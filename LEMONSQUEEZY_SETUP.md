# 🍋 LemonSqueezy Payment Setup Guide

## ✅ Why LemonSqueezy is Perfect for Global Payments

- **🌍 Global Coverage**: Works in Korea, US, Australia, Europe, Asia
- **💳 Direct Card Payments**: Customers pay instantly with any card
- **🏦 Korean Bank Support**: Easy payouts to Korean bank accounts
- **🛡️ Merchant of Record**: Handles all tax compliance automatically
- **⚡ Quick Setup**: Start accepting payments in minutes

---

## 📋 Step 1: Create Your LemonSqueezy Account

### 1.1 Sign Up
1. Go to [lemonsqueezy.com](https://lemonsqueezy.com)
2. Click "Start Selling" or "Sign Up"
3. Create account with your email
4. **Important**: Use your business email (hello@flowsupportai.com)

### 1.2 Business Verification
1. Complete business profile
2. Add business name: "FlowSupport AI" or "AI Revenue Automation Platform"
3. Business type: SaaS/Software
4. Location: Korea (they support Korean businesses!)

### 1.3 Payment Setup
1. Connect your Korean bank account for payouts
2. Set payout frequency (weekly/monthly)
3. LemonSqueezy supports Korean Won (KRW) conversion

---

## 📦 Step 2: Create Your Products

Create these **4 products** in your LemonSqueezy dashboard:

### Product 1: Free Business Analysis
- **Name**: Free Business Analysis
- **Price**: $0 (Free)
- **Type**: One-time
- **Description**: Complete business automation assessment

### Product 2: Strategy Consultation ⭐
- **Name**: Strategy Consultation
- **Price**: $497
- **Type**: One-time
- **Description**: 90-minute expert consultation

### Product 3: Starter Package
- **Name**: Starter Package
- **Price**: $7,997
- **Type**: One-time
- **Description**: Complete automation setup

### Product 4: Professional Package
- **Name**: Professional Package
- **Price**: $12,997
- **Type**: One-time
- **Description**: Enterprise automation solution

---

## 🔧 Step 3: Get Your Variant IDs

After creating products, get the **Variant IDs** for each:

1. Go to Products → Select Product → Variants
2. Copy the Variant ID (looks like: `12345`)
3. Update your code with these IDs

### Update Your Variant IDs Here:

```typescript
// In: src/lib/lemonsqueezy-payments.ts
// Replace these placeholder IDs:

export const LEMONSQUEEZY_PRODUCTS = {
  freeAnalysis: {
    variant_id: 'YOUR_ACTUAL_VARIANT_ID_HERE'
  },
  consultation: {
    variant_id: 'YOUR_ACTUAL_VARIANT_ID_HERE'
  },
  starter: {
    variant_id: 'YOUR_ACTUAL_VARIANT_ID_HERE'
  },
  professional: {
    variant_id: 'YOUR_ACTUAL_VARIANT_ID_HERE'
  }
}
```

---

## 🌐 Step 4: Set Up Custom Domain (Optional)

1. In LemonSqueezy dashboard, go to Settings → Domain
2. Add custom domain: `checkout.flowsupportai.com`
3. Follow DNS setup instructions
4. This makes checkout look more professional

---

## 🎯 Step 5: Configure Checkout Settings

### 5.1 Checkout Appearance
1. Go to Settings → Checkout
2. Upload your logo
3. Set brand colors: `#FF4A00` (your orange color)
4. Add custom thank you message

### 5.2 Success/Failure URLs
Set these redirect URLs:
- **Success URL**: `https://flowsupportai.com/payment/success`
- **Cancel URL**: `https://flowsupportai.com/payment/failed`

### 5.3 Email Settings
1. Customize receipt emails
2. Add your business information
3. Include support contact: hello@flowsupportai.com

---

## 🔐 Step 6: Webhooks (Optional - for automation)

If you want automatic email notifications:

1. Go to Settings → Webhooks
2. Add webhook URL: `https://flowsupportai.com/api/lemonsqueezy/webhook`
3. Select events: `order_created`, `subscription_created`

---

## 🧪 Step 7: Test Your Integration

### 7.1 Test Mode
1. Enable Test Mode in LemonSqueezy
2. Use test card: `4242 4242 4242 4242`
3. Try purchasing each product
4. Verify redirects work correctly

### 7.2 Live Testing
1. Switch to Live Mode
2. Make a small test purchase ($1-5)
3. Verify payment flows end-to-end

---

## 🚀 Step 8: Go Live!

### 8.1 Final Checklist
- [ ] All 4 products created
- [ ] Variant IDs updated in code
- [ ] Korean bank account connected
- [ ] Success/failure URLs set
- [ ] Test purchases completed
- [ ] Business verification complete

### 8.2 Deploy
1. Push your code changes
2. Update environment variables if needed
3. Announce to customers!

---

## 💰 What Happens Next

### Customer Experience:
1. **Clicks pricing** → Instant redirect to LemonSqueezy checkout
2. **Enters card details** → Secure payment processing
3. **Payment complete** → Redirect to your success page
4. **Receives receipt** → Automatic email with purchase details

### Your Experience:
1. **Instant notifications** → Email when someone pays
2. **Dashboard overview** → See all sales and revenue
3. **Automatic payouts** → Money in your Korean bank account
4. **Tax handling** → LemonSqueezy handles all compliance

---

## 🆘 Need Help?

- **LemonSqueezy Support**: [help.lemonsqueezy.com](https://help.lemonsqueezy.com)
- **Korea-specific questions**: They have Asia support team
- **Technical issues**: Contact me for code updates

---

## 🎉 Benefits You'll Get

✅ **Global customers** can pay with any card
✅ **Korean customers** get local payment options
✅ **Automatic tax compliance** worldwide
✅ **Professional checkout** experience
✅ **Korean bank payouts** in KRW
✅ **No payment failures** like with Paddle

**Your payment system will work perfectly for customers worldwide! 🌍**