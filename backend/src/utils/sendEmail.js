import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Debug: Log environment variables (without sensitive data)
    console.log('📧 Email Debug Info:');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Gmail');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    console.log('Sending to:', options.email);
    console.log('Subject:', options.subject);

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Missing email credentials. Check EMAIL_USER and EMAIL_PASS in .env file.');
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add debugging options
      debug: true,
      logger: true,
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Transporter verified successfully');

    const mailOptions = {
      from: `"LuxeCart" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    console.log('📤 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    // Specific error handling
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Check EMAIL_USER and EMAIL_PASS');
      console.error('💡 For Gmail: Use App Password, not regular password');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed. Check internet and email service');
    } else if (error.code === 'EMESSAGE') {
      console.error('📝 Message format error');
    }
    
    throw error;
  }
};

export default sendEmail;
