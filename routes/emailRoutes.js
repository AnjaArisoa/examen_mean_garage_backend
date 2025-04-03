const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Route pour envoyer un email
router.post('/send-email', async (req, res) => {
    const { email, immatricule } = req.body;

    if (!email || !immatricule) {
        return res.status(400).json({ error: 'Email et immatricule requis' });
    }

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'notiandriamisedra@gmail.com', // Remplace avec ton email
            pass: 'ekwl rwfs vfit ahvh' // Remplace avec ton mot de passe d'application
        }
    });

    // Définition du message
    const mailOptions = {
        from: 'notiandriamisedra@gmail.com',
        to: email,
        subject: 'Votre voiture est prête',
        text: `La voiture ${immatricule} est prête, vous pouvez la récupérer.`
    };

    // Envoi de l'email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email envoyé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'envoi de l'email", details: error.message });
    }
});

module.exports = router;
