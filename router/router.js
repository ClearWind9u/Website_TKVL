import express from 'express';

const Router = express.Router();

// Trang chủ - hiển thị nút đăng nhập
Router.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Login to Your Account</h2>
        <button onclick="window.location.href='/jobseeker/login'">Login JobSeeker with Google</button>
        <br/><br/>
        <button onclick="window.location.href='/recruiter/login'">Login Recruiter with Google</button>
      </body>
    </html>
  `);
});

// Chuyển hướng đến trang login của frontend
Router.get('/jobseeker/login', (req, res) => {
  res.redirect('http://localhost:5173/jobseeker/login');
});

Router.get('/recruiter/login', (req, res) => {
  res.redirect('http://localhost:5173/recruiter/login');
});

export default Router;
