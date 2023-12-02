import Pipe from '../src/Pipe';

describe('Pipe', () => {
  const pipe = new Pipe();

  beforeEach(() => {
    pipe.setFunctionDelimiter('|').setArgDelimiter(':').setLastFilter('emptyStringToNull');
  });

  it('should work another function delimiter', () => {
    expect(pipe.setFunctionDelimiter(';').pipeString('1;toInt')).toBe(1);
  });

  it('should work another arg delimiter', () => {
    expect(pipe.setArgDelimiter(';').pipeString('1|padEnd;2')).toBe('1.');
  });

  it('should work with wrong handler', () => {
    expect(pipe.pipeString('1|wrongFilter')).toBe('1');
  });

  it('should work empty last handler', () => {
    expect(pipe.setLastFilter('').pipeString('1')).toBe('1');
  });

  it('should be equal 1', () => {
    expect(pipe.pipeString('1|toInt')).toBe(1);
  });

  it('should required work', () => {
    expect(pipe.pipeString('1|required')).toBe('1');
  });

  it('should throw error from required', () => {
    expect(() => {
      pipe.pipeString('|required');
    }).toThrow(Error);
  });

  it('should be equal null', () => {
    expect(pipe.pipeString('|toNull')).toBe(null);
  });

  it('should be equal true', () => {
    expect(pipe.pipeString('true|toBool')).toBe(true);
  });

  it('should be equal false', () => {
    expect(pipe.pipeString('false|toBool')).toBe(false);
  });

  it('should be equal true', () => {
    expect(pipe.pipeString('1|toBool')).toBe(true);
  });

  it('should be equal false', () => {
    expect(pipe.pipeString('0|toInt|toBool')).toBe(false);
  });

  it('should trim', () => {
    expect(pipe.pipeString(' one |trim')).toBe('one');
  });

  it('should env exists', () => {
    expect(pipe.pipeString('DB_PORT|env')).toBe('33311');
  });

  it('should env false', () => {
    expect(pipe.pipeString('DB_FAKE_PORT|env')).toBe(null);
  });

  it('should upper', () => {
    expect(pipe.pipeString('a|upper')).toBe('A');
  });

  it('should lower', () => {
    expect(pipe.pipeString('A|lower')).toBe('a');
  });

  it('should padEnd', () => {
    expect(pipe.pipeString('A|padEnd:2')).toBe('A.');
  });

  it('should work with env directly', () => {
    expect(pipe.pipeEnv('process.env.DB_PORT')).toBe('33311');
  });

  it('should work env with string', () => {
    expect(pipe.pipeEnv('1|toInt')).toBe(1);
  });
});
