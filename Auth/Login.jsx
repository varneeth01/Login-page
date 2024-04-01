import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import whatsappClient from 'whatsapp-web.js';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWhatsAppLogin = async () => {
    try {
      const client = new whatsappClient.Client();

      client.on('qr', (qr) => {
        console.log('QR code:', qr);
      });

      client.on('ready', async () => {
        const userInfo = await client.getHostNumber();
        const { number } = userInfo;
        const response = await axios.post('/api/auth/login/whatsapp', { number });
        console.log(response.data);
      });

      client.on('authenticated', () => {
        console.log('WhatsApp authentication successful');
      });

      client.initialize();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { email } = response.profileObj;
      const serverResponse = await axios.post('/api/auth/login/google', { email });
      console.log(serverResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <button onClick={handleWhatsAppLogin}>Login with WhatsApp</button>
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Login with Google"
          onSuccess={handleGoogleLogin}
          onFailure={(error) => console.error(error)}
          cookiePolicy={'single_host_origin'}
        />
      </div>
      <button onClick={() => router.push('/register')}>Don't have an account? Register</button>
    </div>
  );
};

export default Login;
