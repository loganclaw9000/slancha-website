import React, { useState } from 'react';

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    displayName: 'John Doe',
    company: 'Acme Corp',
    email: 'john.doe@example.com'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Form submitted:', formData);
  };

  return (
    <div className="account-settings">
      <h2>Account Settings</h2>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
      
      <div className="password-change-section">
        <h3>Change Password</h3>
        <button className="btn-secondary">Change Password</button>
      </div>
    </div>
  );
};

export default AccountSettings;