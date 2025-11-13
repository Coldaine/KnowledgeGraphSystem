import { formatRelativeTime } from '../utils';

describe('formatRelativeTime', () => {
  it('should return "just now" for a date less than a minute ago', () => {
    const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    expect(formatRelativeTime(date)).toBe('just now');
  });

  it('should return minutes ago for a date less than an hour ago', () => {
    const date = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
    expect(formatRelativeTime(date)).toBe('15m ago');
  });

  it('should return hours ago for a date less than a day ago', () => {
    const date = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours ago
    expect(formatRelativeTime(date)).toBe('4h ago');
  });

  it('should return days ago for a date less than a week ago', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    expect(formatRelativeTime(date)).toBe('3d ago');
  });

  it('should return the full date for a date more than a week ago', () => {
    const date = new Date('2023-01-01');
    expect(formatRelativeTime(date)).toBe(date.toLocaleDateString());
  });
});
