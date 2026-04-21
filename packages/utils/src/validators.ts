export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(234|0)[789]\d{9}$/.test(cleaned)
}

export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin)
}
