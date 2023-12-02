import crypto from 'crypto';

const SQLHash = (sql: string, marker = '_@#$^*_') => {
  const parts: string[] = [];
  let i = -1;
  let source = sql
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\\'/g, `${marker}single${marker}`)
    .replace(/\\"/g, `${marker}double${marker}`)
    .replace(/'.*?'/g, (match) => {
      parts.push(match);
      i++;
      return `${marker}${i}${marker}`;
    })
    .replace(/".*?"/g, (match) => {
      parts.push(match);
      i++;
      return `${marker}${i}${marker}`;
    })
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('    ', ' ')
    .replace('   ', ' ')
    .replace('   ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ')
    .replace('  ', ' ');

  parts.forEach((part, i) => {
    source = source.replace(`${marker}${i}${marker}`, part);
  });

  return crypto.createHash('sha256').update(source).digest('hex');
};

export default SQLHash;
