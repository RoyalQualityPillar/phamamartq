// export const environment = {
//   name: 'Default',
//   production: false,
//   apiBaseURL: 'http://88.135.73.1:8000/',
//   qualityRemoteEntryUrl:'http://localhost:4253/quality-remoteEntry.js',
//   adminRemoteEntryUrl:'http://localhost:4251/ngxp-remoteEntry.js',
//   standalone: true,
// };
import { Environment } from './environment.d'; // relative to environment.ts

export const environment: Environment = {
  name: 'Default',
  production: false,
  apiBaseURL: 'http://117.220.199.65:9005/',
 // qualityRemoteEntryUrl: 'http://localhost:4253/quality-remoteEntry.js',
  adminRemoteEntryUrl: 'http://localhost:4251/ngxp-remoteEntry.js',
  standalone: true,
};

