import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.subpilot.app',
  appName: 'SubPilot',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
