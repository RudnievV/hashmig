import SQLHash from '../src/SQLHash';

describe('SQLHash', () => {
  const source = SQLHash(`SELECT * FROM \`users\` WHERE \`id\` =   1 AND name   \\' LIKE "Hi there" AND email =  "asf@sdfsd.te"
                           AND  password = "pwd" OR IsActive = 'active'`);
  const equalTarget = SQLHash(`SELECT * FROM \`users\` WHERE \`id\` = 1 AND name \\' LIKE "Hi there" AND email = "asf@sdfsd.te"
   AND password = "pwd" OR IsActive = 'active'`);
  const nonEqualTarget = SQLHash('SELECT * FROM `users` WHERE `id` = 1 AND name \\\' LIKE "Hi there " AND email = "asf@sdfsd.te" AND password = "pwd" OR IsActive = \'active\'');

  it('should be string', () => {
    expect(typeof source).toBe('string');
  });

  it('should be equal', () => {
    expect(source).toBe(equalTarget);
  });

  it('should not be equal', () => {
    expect(source).not.toBe(nonEqualTarget);
  });
});
