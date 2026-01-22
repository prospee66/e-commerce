# Paystack Integration Setup Guide

## Overview
Your e-commerce site now uses Paystack to accept real payments. Paystack will handle:
- **Credit/Debit Cards** (Visa, Mastercard)
- **Mobile Money** (MTN, Vodafone, AirtelTigo)
- All payments in Ghana Cedis (GHS)

## Step 1: Install Required Package

Run this command in your terminal:

```bash
npm install react-paystack
```

## Step 2: Create a Paystack Account

1. Go to https://paystack.com/
2. Click "Get Started" and create an account
3. Verify your email address
4. Complete business verification (for live payments)

## Step 3: Get Your API Keys

1. Log into your Paystack Dashboard: https://dashboard.paystack.com/
2. Go to **Settings** → **API Keys & Webhooks**
3. You'll see two keys:
   - **Public Key** (starts with `pk_test_` for test mode)
   - **Secret Key** (starts with `sk_test_` for test mode)

## Step 4: Add Keys to Your Project

Open the `.env` file in your project root and replace the placeholders:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here
```

**Important:**
- Only use TEST keys during development
- Never commit your SECRET key to Git
- The `.env` file is already in `.gitignore`

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Add items to cart and proceed to checkout
3. Fill in customer details
4. Select a payment method (Card or Mobile Money)
5. Click "Pay ₵..." button

### Test Cards (for testing only):

**Successful Payment:**
- Card Number: `5060666666666666666`
- CVV: `123`
- Expiry: Any future date
- PIN: `1234`

**Failed Payment:**
- Card Number: `5000000000000000005`
- CVV: `123`
- Expiry: Any future date

More test cards: https://paystack.com/docs/payments/test-payments/

## How Money Flows to Your Account

```
Customer Pays → Paystack Processes → Money Goes to Your Bank
```

### Detailed Flow:

1. **Customer makes payment** → Paystack securely processes it
2. **Paystack holds the money** → Verifies the transaction
3. **Settlement (T+1 or T+2)** → Money transferred to your bank account
   - T+1 means next business day
   - T+2 means two business days later
4. **You receive payment** → Check your bank account

### Paystack Fees (Ghana):

- **Local Cards:** 1.95% capped at GHS 10
- **International Cards:** 3.95%
- **Mobile Money:** 1.95% capped at GHS 10

Example: Customer pays GHS 100
- Paystack fee: GHS 1.95
- You receive: GHS 98.05

## Step 6: Monitor Transactions

1. Log into Paystack Dashboard
2. Go to **Transactions** to see all payments
3. View customer details, amounts, and status
4. Export data for accounting

## Step 7: Going Live (Production)

When ready to accept real payments:

1. Complete business verification in Paystack Dashboard
2. Submit required documents (Business registration, ID)
3. Wait for approval (usually 1-3 days)
4. Get your LIVE API keys (starts with `pk_live_` and `sk_live_`)
5. Update `.env` file with live keys
6. Test with small real transaction first

## Admin Dashboard Integration

Currently, orders are shown in the frontend. To see real transaction data:

### Option 1: Use Paystack Dashboard (Easiest)
- All transactions visible at https://dashboard.paystack.com/
- Export to Excel/CSV
- View customer details

### Option 2: Build Backend (Advanced)
You'll need:
- Node.js/Express backend server
- Database (MongoDB, PostgreSQL, etc.)
- Webhook endpoint to receive payment notifications
- Admin panel to display orders

Would you like help setting up the backend?

## Troubleshooting

### "Payment popup not opening"
- Check that `VITE_PAYSTACK_PUBLIC_KEY` is set in `.env`
- Restart dev server after adding environment variables
- Check browser console for errors

### "Invalid public key"
- Make sure key starts with `pk_test_` or `pk_live_`
- No spaces before or after the key
- Key is from Paystack Dashboard → API Keys

### "Transaction failed"
- In test mode, use test cards only
- Check your internet connection
- Try different browser

## Need Help?

- Paystack Documentation: https://paystack.com/docs/
- Paystack Support: support@paystack.com
- Test your integration: https://paystack.com/docs/payments/test-payments/

## Security Best Practices

✅ DO:
- Keep SECRET key private (never expose in frontend)
- Use HTTPS in production
- Validate payments on backend
- Log all transactions

❌ DON'T:
- Share your SECRET key
- Commit `.env` to Git
- Process payments without verification
- Use LIVE keys for testing

## Next Steps

1. Install the package: `npm install react-paystack`
2. Get your Paystack API keys
3. Update `.env` file
4. Test with test cards
5. Go live when ready!

Your customers can now pay with:
- 💳 Credit/Debit Cards (Visa, Mastercard)
- 📱 Mobile Money (MTN, Vodafone, AirtelTigo)
- All payments in Ghana Cedis (₵)

Money will automatically go to your bank account after Paystack processes it!
