import './Login.css';
import { useState } from 'react';

function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
            const payload = isLoginMode 
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✓ ${data.message}`);
                // Clear form after successful registration/login
                setFormData({ username: '', email: '', password: '' });
                
                // If login is successful, you can store user data or redirect
                if (isLoginMode) {
                    console.log('User logged in:', data.user);
                    // Store user data in localStorage or context
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            } else {
                setMessage(`✗ ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('✗ Network error. Please make sure the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setMessage('');
        setFormData({ username: '', email: '', password: '' });
    };
    
    return(
        <div>
            <div className="title">
                <p className = "header">ALISTAR VS GURAU</p>
                <p className = "text-header">Voteaza-ti preferatul</p>
            </div>

            <div className="images">
              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />
            </div>

            <div className="input-group">
                
                <form className="input-textbox" onSubmit={handleSubmit}>
                {!isLoginMode && (
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!isLoginMode}
                    />
                )}
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                /> 
                
                <button className="Button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                </button>
                </form>

                <button 
                    className="Button" 
                    type="button" 
                    onClick={toggleMode}
                    style={{marginTop: '10px'}}
                >
                    {isLoginMode ? 'Need an account? Register' : 'Have an account? Login'}
                </button>

                {message && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: message.startsWith('✓') ? '#d4edda' : '#f8d7da',
                        color: message.startsWith('✓') ? '#155724' : '#721c24',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}


export default Login;