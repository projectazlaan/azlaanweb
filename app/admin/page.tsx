'use client';

import React, { useEffect, useState } from 'react';

export default function AdminPortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ backgroundColor: '#050505', minHeight: '100vh' }}></div>;
  }

  // Helper to handle navigation manually if needed
  const navigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <div style={{ 
      backgroundColor: '#050505', 
      color: '#ffffff', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '40px',
      fontFamily: 'sans-serif',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px', pointerEvents: 'none' }}>
        <h1 style={{ fontSize: '60px', fontWeight: '900', letterSpacing: '-2px', margin: '0 0 10px 0' }}>
          AZLAAN PORTAL
        </h1>
        <p style={{ color: '#666', fontSize: '12px', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Secure Access Point
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '30px', 
        width: '100%', 
        maxWidth: '1000px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Dashboard Card */}
        <div 
          onClick={() => navigate('/admin/dashboard')}
          style={{ 
            padding: '50px', 
            borderRadius: '40px', 
            border: '2px solid rgba(99, 102, 241, 0.2)', 
            backgroundColor: 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '25px' }}>📊</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#fff' }}>Azlaan Dashboard</h2>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>
            Enter the central control unit to manage inventory, sales, and users.
          </p>
          <div style={{ color: '#6366f1', fontSize: '13px', fontWeight: '900', letterSpacing: '2px' }}>
            LAUNCH DASHBOARD →
          </div>
        </div>

        {/* Studio Card */}
        <div 
          onClick={() => navigate('/admin/studio-pro-v12')}
          style={{ 
            padding: '50px', 
            borderRadius: '40px', 
            border: '2px solid rgba(217, 70, 239, 0.2)', 
            backgroundColor: 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(217, 70, 239, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(217, 70, 239, 0.2)';
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '25px' }}>✨</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#fff' }}>Studio Pro V12</h2>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>
            Access the Freedom Ultra visual builder to redesign your digital presence.
          </p>
          <div style={{ color: '#d946ef', fontSize: '13px', fontWeight: '900', letterSpacing: '2px' }}>
            LAUNCH STUDIO PRO →
          </div>
        </div>

        {/* Super Easy Dashboard Card */}
        <div 
          onClick={() => navigate('/admin/super-easy-dashboard')}
          style={{ 
            padding: '50px', 
            borderRadius: '40px', 
            border: '2px solid rgba(16, 185, 129, 0.2)', 
            backgroundColor: 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '25px' }}>⚡</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#fff' }}>Azlaan Super Easy Dashboard</h2>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>
            The ultra-simple, Facebook-style management system for your entire digital empire.
          </p>
          <div style={{ color: '#10b981', fontSize: '13px', fontWeight: '900', letterSpacing: '2px' }}>
            LAUNCH SUPER EASY →
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '100px', color: '#222', fontSize: '11px', fontWeight: 'bold', letterSpacing: '6px' }}>
        AZLAAN SYSTEM ARCHITECTURE
      </div>
    </div>
  );
}
