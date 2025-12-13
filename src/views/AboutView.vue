<template>
  <div class="about_text">
    <h1>Your Privacy Matters: GDPR Compliance at Santa Zapy</h1>
    <p>
        Dear User,
    </p>
    <p>
        We understand that your privacy is paramount, and we want to assure you that Santa Zapy is fully compliant with the General Data Protection Regulation (GDPR). As such, we take every measure to safeguard your personal information, including your email and birthdate, in accordance with the strictest data protection standards.
    </p>
    <h2>Why You Can Trust Us:</h2>
    <ol>
        <li>Transparent Data Practices: We are committed to transparency regarding how we collect, store, and use your information. Our Privacy Policy outlines the specifics of data processing, ensuring you have clear insight into our practices.</li>
        <li>Lawful Basis for Processing: Under the GDPR, we only process your personal data when we have a lawful basis to do so. Whether it's to fulfill a contractual obligation, comply with legal requirements, or obtain your explicit consent, we adhere to the principles of lawful processing.</li>
        <li>Data Minimization: We collect and retain only the necessary information required to provide you with our services. Your email and birthdate are stored securely, and we strictly limit access to authorized personnel only.</li>
        <li class="important">Enhanced Security Measures: We employ state-of-the-art security protocols to protect your data against unauthorized access, alteration, disclosure, or destruction. We implement industry-standard algorithms such as Argon2 and AES-256 for salting and peppering passwords in our database. Furthermore, our strong Cross-Origin Resource Sharing (CORS) and Content Security Policy (CSP) policies add an extra layer of protection. Additionally, we leverage SQLAlchemy to prevent SQL injection attacks, ensuring the integrity of your data.</li>
        <li>User Rights and Control: We respect your rights as a data subject under the GDPR. You have the right to access, rectify, or delete your personal data held by us. Additionally, you can manage your communication preferences and consent settings at any time.</li>
        <li>Data Transfer Safeguards: If your data is transferred outside the European Economic Area (EEA), we ensure adequate safeguards are in place to protect your privacy rights, as mandated by the GDPR.</li>
    </ol>
    <p>
        Your trust is of utmost importance to us, and we are committed to upholding the highest standards of data protection. If you have any questions or concerns about how we handle your personal information, please don't hesitate to contact our Data Protection Officer at alexbarbier0307@gmail.com.
    </p>
    <p>
        Thank you for choosing Santa Zapy. We look forward to serving you while safeguarding your privacy rights.
    </p>
    <p>
        Warm regards,<br>
        The Santa Zapy developement team
    </p>
  </div>
</template>

<style>
.about_text {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.6;
  margin-left: 15%;
  margin-right: 15%;
  margin-bottom: 2em;
  background-color: rgba(253, 241, 241, 0.8);
  border: solid rgba(128, 128, 128, 0.5) 1px;
  border-radius: 1em;
  padding: 1em 2em;
}

@media (prefers-color-scheme: dark) {
  .about_text {
    background-color: rgba(49, 18, 18, 0.8);
  }
}

h1 {
    color: #B60B14;
}

h2 {
    color: #B60B14;
}

p {
    margin-bottom: 20px;
}

ol {
    margin-bottom: 20px;
}

li {
    margin-bottom: 10px;
}

/* Styling important information */
.important {
    color: #B60B14;
}

</style>
