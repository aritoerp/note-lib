export const ENVIRONMENT: string = 'PRODUCTION'; // DEV, PRODUCTION
export const BACKEND_HOST: string = ENVIRONMENT == 'DEV' ? 'http://localhost:8450/web' : 'https://thuvien.truongso.vn/web';
export const API_HOST: string = 'https://api2dev.arito.vn/api/v1'