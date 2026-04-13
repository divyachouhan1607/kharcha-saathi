import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.kharchasaathi.app',
  appName: 'Kharcha Saathi',
  webDir: 'out',
  server: {
    url: 'https://kharcha-saathi.vercel.app',
    cleartext: false
  }
};

export default config;
