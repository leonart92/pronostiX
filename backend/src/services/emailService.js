// ✅ Version corrigée complète du fichier emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendVerificationEmail = async (userEmail, username, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    console.log('📧 URL de vérification générée:', verificationUrl);
    console.log('📧 Token dans l\'email:', token);

    const mailOptions = {
        from: '"PronostiX" <noreply@pronostix.com>',
        to: userEmail,
        subject: '📧 Vérifiez votre adresse email',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1>🎯 PronostiX</h1>
                <h2>Salut ${username} !</h2>
                <p>Merci de vous être inscrit ! Cliquez sur le bouton ci-dessous pour vérifier votre email :</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background: #007bff; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        ✅ Vérifier mon email
                    </a>
                </div>
                <p><small>Ce lien expire dans 24h</small></p>
                <p><small>Si le bouton ne fonctionne pas : ${verificationUrl}</small></p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (userEmail, username, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
    console.log('🔑 URL de réinitialisation générée:', resetUrl);
    console.log('🔑 Token dans l\'email:', token);

    const mailOptions = {
        from: '"PronostiX" <noreply@pronostix.com>',
        to: userEmail,
        subject: '🔑 Réinitialisez votre mot de passe',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1>🎯 PronostiX</h1>
                <h2>Salut ${username} !</h2>
                <p>Nous avons reçu une demande pour réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background: #dc3545; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        🔑 Réinitialiser mon mot de passe
                    </a>
                </div>
                <p><small>Ce lien expire dans 1 heure.</small></p>
                <p><small>Si le bouton ne fonctionne pas : ${resetUrl}</small></p>
                <p>Si vous n’avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const sendContactEmail = async (contactData) => {
    const { name, email, subject, category, message } = contactData;

    console.log('📞 Nouveau message de contact reçu de:', email);

    const categoryLabels = {
        general: 'Demande générale',
        subscription: 'Questions abonnement',
        technical: 'Support technique',
        partnership: 'Partenariat',
        press: 'Presse & Média',
        other: 'Autre'
    };

    const mailOptions = {
        from: '"PronostiX Contact" <noreply@pronostix.com>',
        to: process.env.SMTP_USER || 'pronostix.service@gmail.com', // Votre email
        replyTo: email, // Pour répondre directement au client
        subject: `📞 [${categoryLabels[category]}] ${subject || 'Message de ' + name}`,
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
                <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px;">
                        <h1 style="color: #007bff; margin: 0;">📞 Nouveau message de contact</h1>
                        <p style="color: #6c757d; margin: 5px 0 0 0;">PronostiX - Formulaire de contact</p>
                    </div>

                    <!-- Informations client -->
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👤 Informations client</h2>
                        <table style="width: 100%; border-spacing: 0;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Nom :</td>
                                <td style="padding: 8px 0; color: #333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email :</td>
                                <td style="padding: 8px 0;">
                                    <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555;">Catégorie :</td>
                                <td style="padding: 8px 0;">
                                    <span style="background: #007bff; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                                        ${categoryLabels[category]}
                                    </span>
                                </td>
                            </tr>
                            ${subject ? `
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555;">Sujet :</td>
                                <td style="padding: 8px 0; color: #333;">${subject}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555;">Date :</td>
                                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString('fr-FR')}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Message -->
                    <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h2>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff;">
                            <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <a href="mailto:${email}?subject=Re: ${subject || 'Votre message sur PronostiX'}" 
                           style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; 
                                  border-radius: 6px; display: inline-block; margin-right: 10px;">
                            ✉️ Répondre au client
                        </a>
                        <a href="mailto:${email}" 
                           style="background: #6c757d; color: white; padding: 12px 25px; text-decoration: none; 
                                  border-radius: 6px; display: inline-block;">
                            📧 Nouveau message
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <p style="color: #6c757d; font-size: 12px; margin: 0;">
                            Cet email a été envoyé automatiquement depuis le formulaire de contact de PronostiX
                        </p>
                    </div>
                </div>
            </div>
        `,
        // Version texte pour les clients email qui ne supportent pas HTML
        text: `
Nouveau message de contact PronostiX

Informations client :
- Nom: ${name}
- Email: ${email}
- Catégorie: ${categoryLabels[category]}
${subject ? `- Sujet: ${subject}` : ''}
- Date: ${new Date().toLocaleString('fr-FR')}

Message :
${message}

---
Pour répondre, utilisez directement: ${email}
        `
    };

    return transporter.sendMail(mailOptions);
};


// ✅ IMPORTANT : Vérifiez que cette ligne est bien présente
module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendContactEmail };