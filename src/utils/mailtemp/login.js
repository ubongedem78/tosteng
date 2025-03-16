const logintemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }

      h1 {
        color: #333333;
        margin-bottom: 20px;
      }

      p {
        color: #555555;
        margin-bottom: 15px;
      }

      .code {
        font-size: 30px;
        font-weight: bold;
        color: #007bff;
        margin: 20px 0;
      }

      .token-link {
        display: inline-block;
        padding: 15px 25px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }

      .token-link:hover {
        background-color: #0056b3;
      }

      .footer {
        margin-top: 30px;
        color: #666666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Tost Login OTP</h1>
      <p>Dear {{username}},</p>
      <p>
        We are excited to have you back! Here is your One-Time Password
        (OTP) for accessing the app:
      </p>
      <div class="code">
        <!-- Insert OTP dynamically here -->
        {{otp}}
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <div class="footer">
        <p>Best Regards,<br />Tost Team</p>
      </div>
    </div>
  </body>
</html>
`;

module.exports = { logintemplate };
