# EmailJS Setup Instructions

To enable direct email sending from your contact form, you need to set up EmailJS:

## 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Add Email Service
1. Go to the "Email Services" section
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note the **Service ID** (you'll need this)

## 3. Create Email Template
1. Go to the "Email Templates" section
2. Click "Create New Template"
3. Use this template content:

**Subject:** New Contact Message from {{from_name}}

**Content:**
```
You have received a new contact message from your website:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

---
This message was sent from your car dealership website contact form.
```

4. Save the template and note the **Template ID**

## 4. Get Public Key
1. Go to "Account" > "General"
2. Copy your **Public Key**

## 5. Update Your Code
In `src/pages/ContactPage.tsx`, replace these placeholders:

```typescript
const serviceId = 'YOUR_SERVICE_ID'; // Replace with your Service ID
const templateId = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID  
const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key
```

## 6. Test
1. Run your website
2. Fill out the contact form
3. Check that emails are received at kelvindespartan@gmail.com

## Free Tier Limits
- 200 emails per month
- EmailJS branding in emails
- For higher limits, consider upgrading to a paid plan

## Security Note
The public key is safe to expose in frontend code - it's designed for client-side use.