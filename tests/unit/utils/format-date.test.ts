import { formatDate } from '@/lib/utils/format-date';

describe('formatDate', () => {
  it('formatiert ein ISO-Datum auf Deutsch', () => {
    const result = formatDate('2024-01-15T10:00:00Z');
    // German locale: "15. Januar 2024"
    expect(result).toContain('2024');
    expect(result).toContain('Januar');
  });

  it('formatiert verschiedene Monate korrekt', () => {
    const result = formatDate('2024-06-01T00:00:00Z');
    expect(result).toContain('Juni');
  });

  it('gibt einen String zurück', () => {
    expect(typeof formatDate('2024-03-01T00:00:00Z')).toBe('string');
  });
});
