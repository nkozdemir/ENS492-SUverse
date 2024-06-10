export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options);
};

export function isValidHexId(id: string) {
  // Check if the id is a 24-character hexadecimal string
  return /^[0-9a-fA-F]{24}$/.test(id);
}