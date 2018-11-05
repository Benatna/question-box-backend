const nodemailer = require('nodemailer')

exports.sendEmail = function (receiver, question, id, lang) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  let mailOptions
  if (lang === 'de') {
    mailOptions = {
      from: `"Benatna: Unter uns" <${process.env.ADMIN_EMAIL}>`,
      to: receiver,
      subject: "Deine Frage wurde beantwortet",
      html: `<h1> Benatna: Unter uns </h1> <p> Hi! </p> <p>Deine Frage <em>${question}</em> wurde von unseren Ambassadors beantwortet.</p> <p>Du findest die Antwort auf der Webseite im Bereich <a href="${process.env.WEBSITE_URL}answers">Antworten</a>.  Hier wurden auch andere Fragen bereits beantwortet.</p> <p>Falls du weitere Fragen hast, schicke sie an das <a href="${process.env.WEBSITE_URL}answers/${id}">System</a>.</p> <p>Wenn es irgendwelche Probleme mit der Webseite gibt, schreib uns eine <a href="mailto:${process.env.ADMIN_EMAIL}>E-Mail</a> oder antworte auf diese E-Mail. Wir helfen dir gern!</p> <p>Hab einen tollen Tag.</p> <p>Wir hoffen, dich bald wieder hier zu sehen!</p>`
    }
  } else {
    mailOptions = {
      from: `"Benatna: Between us" <${process.env.ADMIN_EMAIL}>`,
      to: receiver,
      subject: 'Your question has been answered',
      html: `<h1>Benatna: Between us</h1> <p>Greetings!</p><p>We are happy to let you know that your question <em>${question}</em> has been answered by our ambassadors.</p> <p>You can find it along with other questions by visiting our website <a href="${process.env.WEBSITE_URL}answers/${id}">in the answers section</a>.</p> <p>Please feel free to ask any other question in the system or if you have any problem with the website, write us to <a href="${process.env.ADMIN_EMAIL}">our email address</a> or reply to this email, and we will be happy to help.</p> <p>Have a wonderful day. We hope to see you soon!</p>`
    }
  }

  if (process.env.NODE_ENV === 'test') {
    console.log("Testing of SMTP server not allowed to avoid spam")
  } else {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    })
  }
}
