const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, template, data, html, text }) => {
  const templates = {
    emailVerification: (d) => `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fdf8f5; padding: 40px; border-radius: 12px;">
        <h1 style="color: #8b1a4a; font-size: 28px; text-align: center; margin-bottom: 8px;">Saaj ✨</h1>
        <p style="color: #666; text-align: center; margin-bottom: 32px;">Premium Sarees & Ethnic Wear</p>
        <h2 style="color: #2d1b3d;">Welcome, ${d.name}! 🌸</h2>
        <p style="color: #444; line-height: 1.8;">Thank you for joining Saaj. Please verify your email to get started.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${d.url}" style="background: linear-gradient(135deg, #8b1a4a, #c2185b); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px;">Verify Email</a>
        </div>
        <p style="color: #888; font-size: 13px;">Link expires in 24 hours. If you didn't sign up, ignore this email.</p>
      </div>
    `,
    passwordReset: (d) => `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fdf8f5; padding: 40px; border-radius: 12px;">
        <h1 style="color: #8b1a4a; font-size: 28px; text-align: center;">Saaj ✨</h1>
        <h2 style="color: #2d1b3d;">Password Reset Request</h2>
        <p style="color: #444; line-height: 1.8;">Hi ${d.name}, you requested a password reset.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${d.url}" style="background: linear-gradient(135deg, #8b1a4a, #c2185b); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 13px;">Link expires in 15 minutes. If you didn't request this, your account is safe.</p>
      </div>
    `,
    orderConfirmation: (d) => `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fdf8f5; padding: 40px; border-radius: 12px;">
        <h1 style="color: #8b1a4a; font-size: 28px; text-align: center;">Saaj ✨</h1>
        <h2 style="color: #2d1b3d;">Order Confirmed! 🎉</h2>
        <p style="color: #444;">Order #${d.orderNumber} has been placed successfully.</p>
        <p style="color: #444;">Total: ₹${d.totalPrice}</p>
        <p style="color: #888; font-size: 13px;">Estimated delivery: ${d.estimatedDelivery}</p>
      </div>
    `,
  };

  const htmlContent = template && templates[template]
    ? templates[template](data || {})
    : html || `<p>${text}</p>`;

  const textContent = text || htmlContent.replace(/<[^>]*>/g, '');
  const fromName = process.env.FROM_NAME || 'Saaj';

  // 1. Try Resend HTTP API
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${fromName} <onboarding@resend.dev>`,
          to: [to],
          subject: subject,
          html: htmlContent
        })
      });
      const resData = await response.json();
      if (response.ok) {
        console.log(`📧 Email sent via Resend API: ${resData.id}`);
        return resData;
      } else {
        throw new Error(resData.message || JSON.stringify(resData));
      }
    } catch (err) {
      console.error('❌ Resend API failed, falling back:', err.message);
    }
  }

  // 2. Try Brevo HTTP API
  if (process.env.BREVO_API_KEY) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: fromName, email: process.env.FROM_EMAIL || process.env.SMTP_EMAIL },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent
        })
      });
      const resData = await response.json();
      if (response.ok) {
        console.log(`📧 Email sent via Brevo API: ${resData.messageId}`);
        return resData;
      } else {
        throw new Error(resData.message || JSON.stringify(resData));
      }
    } catch (err) {
      console.error('❌ Brevo API failed, falling back:', err.message);
    }
  }

  // 3. Try SendGrid HTTP API
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.FROM_EMAIL || process.env.SMTP_EMAIL, name: fromName },
          subject: subject,
          content: [{ type: 'text/html', value: htmlContent }]
        })
      });
      if (response.ok) {
        console.log(`📧 Email sent via SendGrid API`);
        return { success: true };
      } else {
        const resData = await response.json();
        throw new Error(resData.message || JSON.stringify(resData));
      }
    } catch (err) {
      console.error('❌ SendGrid API failed, falling back:', err.message);
    }
  }

  // 4. Default Fallback: SMTP via Nodemailer
  console.log('🔄 Attempting SMTP fallback...');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  const mailOptions = {
    from: `"${fromName}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
    text: textContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent via SMTP: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('❌ SMTP Email Delivery failed:', err.message);
    console.log('📬 --- LOG FALLBACK EMAIL CONTENT ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (data?.url) {
      console.log(`URL/Link: ${data.url}`);
    }
    console.log('-------------------------------------');
    throw err;
  }
};

module.exports = { sendEmail };
