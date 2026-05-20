import { Environment } from './environment.d';

export const environment: Environment = {
  name: 'Saanso Dev',
  production: true,
  apiBaseURL: 'http://117.220.199.65:8810/',
//  qualityRemoteEntryUrl: 'http://117.220.199.65:4253/quality-remoteEntry.js',
  adminRemoteEntryUrl: 'http://117.220.199.65:4251/ngxp-remoteEntry.js',
  standalone: true,
};

