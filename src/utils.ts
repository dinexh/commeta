export function truncate(s: string, n = 1000) { return s.length > n ? s.slice(0, n) + '... [truncated]' : s; }
