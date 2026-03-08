/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserApp } from './components/UserApp';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('subpilot_token'));
  

  const handleLogin = (newToken: string, user: any, isLogin: boolean) => {
    localStorage.setItem('subpilot_token', newToken);
    if (user) {
      localStorage.setItem('subpilot_user', JSON.stringify(user));
    }
    
    // Clear previous user's local data when registering a new account
    if (!isLogin) {
      localStorage.removeItem('subpilot_subscriptions');
      localStorage.removeItem('subpilot_plan');
      localStorage.removeItem('subpilot_family');
    }
    
    setToken(newToken);
  };

  return (
    <div className="h-screen w-full font-sans overflow-hidden relative">
      {token ? (
        <UserApp />
      ) : (
        <AuthScreen onLogin={handleLogin}  />
      )}
    </div>
  );
}

