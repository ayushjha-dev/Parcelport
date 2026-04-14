export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function validateOTP(otp: string, length: number = 6): boolean {
  const regex = new RegExp(`^\\d{${length}}$`);
  return regex.test(otp);
}

export function getOTPExpiryTime(minutes: number = 10): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}

export function isOTPExpired(expiryTime: string | Date): boolean {
  const expiry = typeof expiryTime === 'string' ? new Date(expiryTime) : expiryTime;
  return new Date() > expiry;
}
