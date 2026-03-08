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
  

  const handleLogin = (newToken: string, user: any) => {
    localStorage.setItem('subpilot_token', newToken);
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

