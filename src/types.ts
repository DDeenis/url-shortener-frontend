export interface ShortUrl {
  id: string;
  userId?: string;
  originalUrl: string;
  redirects: number;
  deactivated: boolean;
  createdAt: string;
}

export interface User {
  is: string;
  username: string;
  email: string;
  registerAt: string;
  deleteAt?: string;
}
