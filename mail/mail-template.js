const HTML_TEMPLATE = (text) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
              text-align: center;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #F5F2F0;
              color: black;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-body p {
                font-size: 20px;
            }
            a {
                font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>Announcement</h1>
              </div>
              <div class="email-body">
                <p>${text}</p>
              </div>
              <a href="http://localhost:3000/dashboard">Home page</a>
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = { HTML_TEMPLATE };
