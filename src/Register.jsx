import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    console.log("Form Submitted:", formData);
    alert("Registration Successful!");
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Name Surname"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="email@example.com"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="••••••••"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'fixed', // Ensures it covers the whole screen
    top: 0,
    left: 0
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif'
  },
  inputGroup: {
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '5px',
    fontFamily: 'Arial, sans-serif'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#764ba2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  error: {
    color: '#d9534f',
    backgroundColor: '#f9dada',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '15px'
  }
};

export default Register;