const nodemailer = require('nodemailer');
const reset_email_url = process.env.RESET_EMAIL_URL || 'http://localhost:3000'

exports.transporter = nodemailer.createTransport({
  host:'smtp.aol.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
})

exports.welcome = (user) => {
  return {
    from:`"${ process.env.MAIL_USERNAME }" < ${ process.env.MAIL_USER } >`,
    to: user.email,
    subject: 'Welcome to the Helping Hand Community',
    html:`
      <div>
        <h1>Welcome!!!</h1>
        <h2>We are so happy you decided to become part of the change</h2>
        <p>From now on you can log on to our platform and will be able to contribute to our childrens future</p>
      </div>
    `
  }
}

exports.removeAccount = (email) => {
  return {
    from:`"${ process.env.MAIL_USERNAME }" < ${ process.env.MAIL_USER } >`,
    to: email,
    subject: 'Sorry to see you go',
    html:`
      <div>
        <h1>We'll be here</h1>
        <h2>It's sad to see you go.</h2>
        <p>We will be here in the future if you want to come back to the community.</p>
      </div>
    `
  }
}

exports.sendResetEmail = ( email, token ) => {
  return {
    from:`"${ process.env.MAIL_USERNAME }" < ${ process.env.MAIL_USER } >`,
    to: email,
    subject: 'Link to reset password',
    html:`
      <div>
        <h1>Reset password link</h1>
        <p>Please click on the following link or paste it on your browser </p>
        <p>${reset_email_url}/sponsors/reset/${token}</p>
      </div>
    `
  }
}

exports.confirmPasswordUpdate = ( email ) => {
  return {
    from:`"${ process.env.MAIL_USERNAME }" < ${ process.env.MAIL_USER } >`,
    to: email,
    subject: 'Password has been updated',
    html: `
    <div>
      <h1>Your password has been updating</h1>
      <p>You can login again to keep contributing to the cause</p>
    </div>
    `
  }
}
