const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse form data
        const formData = new URLSearchParams(event.body);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validate input
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'All fields are required' })
            };
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Sanitize inputs
        const sanitizedName = name.trim().substring(0, 100);
        const sanitizedEmail = email.trim().substring(0, 100);
        const sanitizedMessage = message.trim().substring(0, 1000);

        // Create email content
        const emailContent = `
            New Contact Form Submission
            
            Name: ${sanitizedName}
            Email: ${sanitizedEmail}
            Message: ${sanitizedMessage}
            
            Submitted at: ${new Date().toISOString()}
        `;

        // Send email (configure with your email service)
        // For now, we'll just log it. In production, configure with SendGrid, Postmark, etc.
        console.log('Contact form submission:', {
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            timestamp: new Date().toISOString()
        });

        // TODO: Configure email service
        // Example with SendGrid:
        /*
        const transporter = nodemailer.createTransporter({
            service: 'sendgrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            subject: 'New Portfolio Contact Form Submission',
            text: emailContent
        });
        */

        // Store in database or CSV (optional)
        // This could be integrated with Airtable, Notion, or a simple CSV file

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: true, 
                message: 'Message sent successfully!' 
            })
        };

    } catch (error) {
        console.error('Contact form error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                error: 'Internal server error. Please try again later.' 
            })
        };
    }
};