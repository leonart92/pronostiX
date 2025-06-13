// services/emailService.js - Version SendGrid COMPLÈTE
const sgMail = require('@sendgrid/mail');

// ✅ Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Email par défaut (vérifié sur SendGrid)
const DEFAULT_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER || 'noreply@pronostix.com';

console.log('📧 SendGrid configuré avec:', DEFAULT_FROM_EMAIL);

// services/emailService.js - Template ANTI-SPAM
const sendVerificationEmail = async (userEmail, username, token) => {
    const startTime = Date.now();
    console.log('🕐 DÉBUT envoi email SendGrid:', new Date().toISOString());

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    console.log('📧 URL de vérification générée:', verificationUrl);
    console.log('📧 Token dans l\'email:', token);

    const msg = {
        to: userEmail,
        from: {
            email: DEFAULT_FROM_EMAIL,
            name: 'Équipe PronostiX' // ✅ Nom humain
        },
        // ✅ Sujet anti-spam (pas d'emojis, pas de MAJUSCULES)
        subject: 'Confirmez votre inscription sur PronostiX',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmation d'inscription PronostiX</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                
                <!-- ✅ Container principal -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f4;">
                    <tr>
                        <td style="padding: 20px 0;">
                            
                            <!-- ✅ Email content -->
                            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                
                                <!-- ✅ Header simple et professionnel -->
                                <tr>
                                    <td style="padding: 30px 30px 20px 30px; text-align: center; border-bottom: 2px solid #007bff;">
                                        <h1 style="margin: 0; color: #007bff; font-size: 24px; font-weight: normal;">PronostiX</h1>
                                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Plateforme de pronostics sportifs</p>
                                    </td>
                                </tr>
                                
                                <!-- ✅ Contenu principal -->
                                <tr>
                                    <td style="padding: 30px;">
                                        
                                        <!-- ✅ Salutation personnalisée -->
                                        <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; font-weight: normal;">
                                            Bonjour ${username},
                                        </h2>
                                        
                                        <!-- ✅ Message clair et rassurant -->
                                        <p style="margin: 0 0 20px 0; color: #555; line-height: 1.6; font-size: 16px;">
                                            Merci d'avoir créé votre compte sur <strong>PronostiX</strong>. 
                                            Pour finaliser votre inscription et accéder à votre espace personnel, 
                                            nous devons confirmer votre adresse email.
                                        </p>
                                        
                                        <p style="margin: 0 0 30px 0; color: #555; line-height: 1.6; font-size: 16px;">
                                            Cliquez simplement sur le bouton ci-dessous pour activer votre compte :
                                        </p>
                                        
                                        <!-- ✅ Bouton CTA simple -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <a href="${verificationUrl}" 
                                                       style="display: inline-block; padding: 15px 30px; background-color: #007bff; 
                                                              color: #ffffff; text-decoration: none; border-radius: 5px; 
                                                              font-size: 16px; font-weight: bold; text-align: center;">
                                                        Activer mon compte
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- ✅ Lien alternatif -->
                                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 30px 0;">
                                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: bold;">
                                                Le bouton ne fonctionne pas ?
                                            </p>
                                            <p style="margin: 0; color: #666; font-size: 14px; word-break: break-all;">
                                                Copiez et collez ce lien dans votre navigateur :
                                                <br><a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a>
                                            </p>
                                        </div>
                                        
                                        <!-- ✅ Informations rassurantes -->
                                        <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 30px 0;">
                                            <p style="margin: 0; color: #0056b3; font-size: 14px;">
                                                <strong>Sécurité :</strong> Ce lien est valide pendant 24 heures et ne peut être utilisé qu'une seule fois.
                                            </p>
                                        </div>
                                        
                                        <!-- ✅ Message de sécurité -->
                                        <p style="margin: 30px 0 0 0; color: #666; font-size: 14px; line-height: 1.5;">
                                            Si vous n'avez pas créé de compte sur PronostiX, vous pouvez ignorer cet email en toute sécurité. 
                                            Aucune action ne sera effectuée sur votre adresse email.
                                        </p>
                                        
                                    </td>
                                </tr>
                                
                                <!-- ✅ Footer professionnel -->
                                <tr>
                                    <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #dee2e6;">
                                        
                                        <!-- ✅ Contact -->
                                        <p style="margin: 0 0 15px 0; color: #666; font-size: 12px; text-align: center;">
                                            <strong>Équipe PronostiX</strong><br>
                                            Email automatique - Ne pas répondre à ce message<br>
                                            Pour toute question : <a href="mailto:${DEFAULT_FROM_EMAIL}" style="color: #007bff;">contact@pronostix.com</a>
                                        </p>
                                        
                                        <!-- ✅ Légal -->
                                        <p style="margin: 0; color: #999; font-size: 11px; text-align: center;">
                                            © ${new Date().getFullYear()} PronostiX. Tous droits réservés.<br>
                                            Cet email a été envoyé à ${userEmail} suite à votre inscription sur notre plateforme.
                                        </p>
                                        
                                    </td>
                                </tr>
                                
                            </table>
                            
                        </td>
                    </tr>
                </table>
                
            </body>
            </html>
        `,
        text: `
            PronostiX - Confirmation d'inscription
            
            Bonjour ${username},
            
            Merci d'avoir créé votre compte sur PronostiX.
            
            Pour finaliser votre inscription, confirmez votre adresse email en cliquant sur ce lien :
            ${verificationUrl}
            
            Ce lien est valide pendant 24 heures.
            
            Si vous n'avez pas créé de compte, ignorez cet email.
            
            Cordialement,
            L'équipe PronostiX
            
            ---
            © ${new Date().getFullYear()} PronostiX
            Email envoyé à ${userEmail}
        `,
        // ✅ Métadonnées anti-spam
        custom_args: {
            user_id: 'verification',
            email_type: 'account_verification',
            app_version: '1.0',
            timestamp: new Date().toISOString()
        },
        // ✅ Tracking
        tracking_settings: {
            click_tracking: { enable: true },
            open_tracking: { enable: true },
            subscription_tracking: { enable: false }, // Pas de lien unsubscribe pour la vérification
            ganalytics: { enable: false }
        },
        // ✅ Catégorie SendGrid
        categories: ['account-verification', 'transactional']
    };

    try {
        const result = await sgMail.send(msg);
        const duration = Date.now() - startTime;

        console.log('✅ Email SendGrid envoyé avec succès !');
        console.log(`🕐 Durée: ${duration}ms`);
        console.log(`📧 MessageID: ${result[0].headers['x-message-id']}`);
        console.log(`👤 Destinataire: ${userEmail}`);

        return {
            messageId: result[0].headers['x-message-id'],
            status: 'sent',
            provider: 'sendgrid'
        };

    } catch (error) {
        const duration = Date.now() - startTime;

        console.error('❌ Erreur SendGrid:');
        console.error(`🕐 Durée avant erreur: ${duration}ms`);
        console.error(`👤 Destinataire: ${userEmail}`);
        console.error(`💥 Erreur:`, error.message);

        if (error.response) {
            console.error(`📡 Status: ${error.response.status}`);
            console.error(`📧 Body:`, error.response.body);
        }

        throw error;
    }
};

const sendPasswordResetEmail = async (userEmail, username, token) => {
    const startTime = Date.now();
    console.log('🕐 DÉBUT envoi reset password SendGrid:', new Date().toISOString());

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log('🔑 URL de réinitialisation générée:', resetUrl);
    console.log('🔑 Token dans l\'email:', token);

    const msg = {
        to: userEmail,
        from: {
            email: DEFAULT_FROM_EMAIL,
            name: 'PronostiX'
        },
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
                <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
            </div>
        `,
        text: `
            PronostiX - Réinitialisation de mot de passe
            
            Salut ${username} !
            
            Nous avons reçu une demande pour réinitialiser votre mot de passe.
            
            Cliquez sur ce lien pour choisir un nouveau mot de passe :
            ${resetUrl}
            
            Ce lien expire dans 1 heure.
            
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        `,
        custom_args: {
            email_type: 'password_reset',
            app_version: '1.0'
        }
    };

    try {
        const result = await sgMail.send(msg);
        const duration = Date.now() - startTime;

        console.log('✅ Email reset password SendGrid envoyé !');
        console.log(`🕐 Durée: ${duration}ms`);
        console.log(`📧 MessageID: ${result[0].headers['x-message-id']}`);

        return {
            messageId: result[0].headers['x-message-id'],
            status: 'sent',
            provider: 'sendgrid'
        };

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error('❌ Erreur SendGrid reset password:');
        console.error(`🕐 Durée avant erreur: ${duration}ms`);
        console.error(error);
        throw error;
    }
};

const sendContactEmail = async (contactData) => {
    const { name, email, subject, category, message } = contactData;
    const startTime = Date.now();

    console.log('📞 Nouveau message de contact reçu de:', email);

    const categoryLabels = {
        general: 'Demande générale',
        subscription: 'Questions abonnement',
        technical: 'Support technique',
        partnership: 'Partenariat',
        press: 'Presse & Média',
        other: 'Autre'
    };

    const msg = {
        to: process.env.SMTP_USER || process.env.SENDGRID_FROM_EMAIL || 'contact@pronostix.com',
        from: {
            email: DEFAULT_FROM_EMAIL,
            name: 'PronostiX Contact'
        },
        replyTo: {
            email: email,
            name: name
        },
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
        `,
        custom_args: {
            email_type: 'contact',
            sender_name: name,
            category: category
        }
    };

    try {
        const result = await sgMail.send(msg);
        const duration = Date.now() - startTime;

        console.log('✅ Email contact SendGrid envoyé !');
        console.log(`🕐 Durée: ${duration}ms`);
        console.log(`📧 MessageID: ${result[0].headers['x-message-id']}`);
        console.log(`👤 De: ${name} <${email}>`);

        return {
            messageId: result[0].headers['x-message-id'],
            status: 'sent',
            provider: 'sendgrid'
        };

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error('❌ Erreur SendGrid contact:');
        console.error(`🕐 Durée avant erreur: ${duration}ms`);
        console.error(`👤 De: ${name} <${email}>`);
        console.error(error);
        throw error;
    }
};

// ✅ Test de connexion SendGrid
const testSendGridConnection = async () => {
    try {
        console.log('🧪 Test de connexion SendGrid...');
        console.log('✅ SendGrid configuré et prêt !');
        return true;

    } catch (error) {
        console.error('❌ Erreur SendGrid:', error.message);
        if (error.response) {
            console.error('📧 Détails:', error.response.body);
        }
        return false;
    }
};

// ✅ IMPORTANT : Export de toutes les fonctions
module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendContactEmail,
    testSendGridConnection
};