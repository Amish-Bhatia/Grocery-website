const forgotPassword = (resetLink) => {
return(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
      </head>
      <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial,sans-serif;">
        <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:40px; border-radius:8px;">
          
          <h2 style="color:#333; margin-top:0;">
            Reset Your Password
          </h2>

          <p style="color:#555; font-size:16px; line-height:1.6;">
            We received a request to reset your password.
            Click the button below to create a new password.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <a
              href="${resetLink}"
              style="
                display:inline-block;
                background:#2563eb;
                color:#ffffff;
                padding:12px 24px;
                text-decoration:none;
                border-radius:6px;
                font-size:16px;
              "
            >
              Reset Password
            </a>
          </div>

          <p stye="color:#777; font-size:14px; line-height:1.6;">
            This link will expire in 15 minutes.
          </p>
          <p style="color:#777; font-size:14px; line-height:1.6;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />
          <p style="color:#999; font-size:12px; text-align:center;">
            © ${new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `);
};
const Sendotp = (otp)=>{
    return(
        `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
            <td align="center">

                <table width="500" cellpadding="0" cellspacing="0"
                       style="background:#ffffff; border-radius:10px; padding:40px;">

                    <tr>
                        <td align="center">
                            <h2 style="color:#222; margin-bottom:10px;">
                                Verify Your Account
                            </h2>

                            <p style="color:#666; font-size:15px; line-height:24px;">
                                Use the One-Time Password below to complete your verification.
                            </p>

                            <div style="
                                margin:30px 0;
                                padding:15px;
                                background:#f1f5ff;
                                border-radius:8px;
                                text-align:center;
                            ">
                                <span style="
                                    font-size:32px;
                                    font-weight:bold;
                                    letter-spacing:8px;
                                    color:#2563eb;
                                ">
                                   <strong> ${otp} </strong>
                                </span>
                            </div>

                            <p style="color:#666; font-size:14px;">
                                This OTP is valid for <strong>10 minutes</strong>.
                            </p>

                            <p style="color:#999; font-size:13px; line-height:20px;">
                                For your security, please do not share this OTP with anyone.
                                If you did not request this code, you can safely ignore this email.
                            </p>

                            <hr style="border:0; border-top:1px solid #eee; margin:30px 0;">

                            <p style="color:#999; font-size:12px;">
                                © 2026 DnA. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
        `
    )
}
module.exports =  { forgotPassword , Sendotp }