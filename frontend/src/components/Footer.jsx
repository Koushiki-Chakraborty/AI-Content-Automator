import React from 'react';

const Footer = () => {
  return (
    <footer style={{ marginTop: 'auto', padding: '2rem 0', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} AI Content Automator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
