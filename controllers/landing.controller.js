const landing = (req, res) => {
  const responseContent = `
    <html>
      <head>
        <title>ART Server</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          h1 {
            margin-top :100px;
            color: #008080; 
            font-size: 53px;
          }
          strong {
            color: #006400; 
          }
          p {
            font-size: 33px;
          }
          span {
            font-size: 33px;
            font-weight:600;
            color: #006400;
          }
        </style>
      </head>
      <body>
        <h1>Hello! Welcome to our Server</h1>
        <p><strong>It is working properly</strong></p>
        <p>These server side API is working using NodeJs.</p>
        <p><span>A.R. Tyagi</span></p>
      </body>
    </html>
  `;
  res.send(responseContent);
};

module.exports = {
  landing,
};
