import './Login.css';
import { useState } from 'react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Register failed', data);
        alert(data.message || 'Registration failed');
      } else {
        console.log('Registered', data);
        alert('User saved successfully');
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Error sending request', err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="title">
        <p className="header">ALISTAR VS GURAU</p>
        <p className="text-header">Voteaza-ti preferatul</p>
      </div>

      <div className="images">
        <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
        <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />
      </div>

      <div className="input-group">
        <form className="input-textbox" onSubmit={handleSubmit}>
          <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" required />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />

          <button className="Button" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
