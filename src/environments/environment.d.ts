export interface Environment {
    name: string;
    production: boolean;
    apiBaseURL: string;
    standalone: boolean;
   // qualityRemoteEntryUrl: string;
    adminRemoteEntryUrl: string;
  }