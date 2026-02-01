export function getEnvPaths(): string[] {
  const environment = process.env.NODE_ENV;
  const m: string[] = [];
  switch (environment) {
    case 'production':
      m.push('.env.production');
      break;
    case 'test':
      m.push('.env.test');
      break;
    case 'development':
    default:
      m.push('.env.development');
      break;
  }
  return [...m, '.env'];
}
