export interface CountryDialCode {
  countryCode: string;
  countryName: { de: string; en: string };
  dialCode: string;
  flag: string;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { countryCode: 'DE', countryName: { de: 'Deutschland', en: 'Germany' }, dialCode: '+49', flag: '🇩🇪' },
  { countryCode: 'AT', countryName: { de: 'Österreich', en: 'Austria' }, dialCode: '+43', flag: '🇦🇹' },
  { countryCode: 'CH', countryName: { de: 'Schweiz', en: 'Switzerland' }, dialCode: '+41', flag: '🇨🇭' },
  { countryCode: 'US', countryName: { de: 'Vereinigte Staaten', en: 'United States' }, dialCode: '+1', flag: '🇺🇸' },
  { countryCode: 'GB', countryName: { de: 'Großbritannien', en: 'United Kingdom' }, dialCode: '+44', flag: '🇬🇧' },
  { countryCode: 'FR', countryName: { de: 'Frankreich', en: 'France' }, dialCode: '+33', flag: '🇫🇷' },
  { countryCode: 'IN', countryName: { de: 'Indien', en: 'India' }, dialCode: '+91', flag: '🇮🇳' },
  { countryCode: 'NL', countryName: { de: 'Niederlande', en: 'Netherlands' }, dialCode: '+31', flag: '🇳🇱' },
  { countryCode: 'ES', countryName: { de: 'Spanien', en: 'Spain' }, dialCode: '+34', flag: '🇪🇸' },
  { countryCode: 'IT', countryName: { de: 'Italien', en: 'Italy' }, dialCode: '+39', flag: '🇮🇹' },
  { countryCode: 'TR', countryName: { de: 'Türkei', en: 'Turkey' }, dialCode: '+90', flag: '🇹🇷' },
  { countryCode: 'AE', countryName: { de: 'Ver. Arabische Emirate', en: 'United Arab Emirates' }, dialCode: '+971', flag: '🇦🇪' },
  { countryCode: 'AU', countryName: { de: 'Australien', en: 'Australia' }, dialCode: '+61', flag: '🇦🇺' },
  { countryCode: 'CA', countryName: { de: 'Kanada', en: 'Canada' }, dialCode: '+1', flag: '🇨🇦' },
  { countryCode: 'PL', countryName: { de: 'Polen', en: 'Poland' }, dialCode: '+48', flag: '🇵🇱' },
  { countryCode: 'SE', countryName: { de: 'Schweden', en: 'Sweden' }, dialCode: '+46', flag: '🇸🇪' },
  { countryCode: 'NO', countryName: { de: 'Norwegen', en: 'Norway' }, dialCode: '+47', flag: '🇳🇴' },
  { countryCode: 'DK', countryName: { de: 'Dänemark', en: 'Denmark' }, dialCode: '+45', flag: '🇩🇰' },
  { countryCode: 'BE', countryName: { de: 'Belgien', en: 'Belgium' }, dialCode: '+32', flag: '🇧🇪' },
  { countryCode: 'JP', countryName: { de: 'Japan', en: 'Japan' }, dialCode: '+81', flag: '🇯🇵' },
  { countryCode: 'CN', countryName: { de: 'China', en: 'China' }, dialCode: '+86', flag: '🇨🇳' },
  { countryCode: 'BR', countryName: { de: 'Brasilien', en: 'Brazil' }, dialCode: '+55', flag: '🇧🇷' },
  { countryCode: 'MX', countryName: { de: 'Mexiko', en: 'Mexico' }, dialCode: '+52', flag: '🇲🇽' },
  { countryCode: 'ZA', countryName: { de: 'Südafrika', en: 'South Africa' }, dialCode: '+27', flag: '🇿🇦' },
  { countryCode: 'SG', countryName: { de: 'Singapur', en: 'Singapore' }, dialCode: '+65', flag: '🇸🇬' },
  { countryCode: 'PK', countryName: { de: 'Pakistan', en: 'Pakistan' }, dialCode: '+92', flag: '🇵🇰' },
  { countryCode: 'KE', countryName: { de: 'Kenia', en: 'Kenya' }, dialCode: '+254', flag: '🇰🇪' },
];

export function findDialCodeByCountryName(name?: string): CountryDialCode | undefined {
  if (!name) return undefined;
  const q = name.trim().toLowerCase();
  return COUNTRY_DIAL_CODES.find(
    (c) =>
      c.countryName.de.toLowerCase() === q ||
      c.countryName.en.toLowerCase() === q ||
      c.countryCode.toLowerCase() === q
  );
}

export function parsePhoneNumber(raw: string, defaultDialCode = '+49'): { dialCode: string; nationalNumber: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { dialCode: defaultDialCode, nationalNumber: '' };
  }

  // Check if raw starts with '+'
  if (trimmed.startsWith('+')) {
    // Sort dial codes by length descending so +971 is matched before +9
    const sorted = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const item of sorted) {
      if (trimmed.startsWith(item.dialCode)) {
        const national = trimmed.slice(item.dialCode.length).trim().replace(/^0+/, '');
        return { dialCode: item.dialCode, nationalNumber: national };
      }
    }
    // Custom +prefix
    const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
    if (match) {
      return { dialCode: match[1], nationalNumber: match[2].trim().replace(/^0+/, '') };
    }
  }

  // Local number with potential leading 0
  const cleaned = trimmed.replace(/^0+/, '');
  return { dialCode: defaultDialCode, nationalNumber: cleaned };
}
