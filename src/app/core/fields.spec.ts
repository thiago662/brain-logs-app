import { readCustom, readSettings } from './fields';

describe('readSettings', () => {
  it('lê autor e linkedin', () => {
    expect(readSettings({ autor: ' Thiago ', linkedin: 'https://linkedin.com/in/x' })).toEqual({
      autor: 'Thiago',
      linkedin: 'https://linkedin.com/in/x',
    });
  });

  it('tolera ausente, tipo errado e URL não https', () => {
    const vazio = { autor: '', linkedin: '' };
    expect(readSettings(undefined)).toEqual(vazio);
    expect(readSettings({ autor: 1, linkedin: 'javascript:alert(1)' })).toEqual(vazio);
    expect(readSettings({ linkedin: 'http://linkedin.com/in/x' })).toEqual(vazio);
  });
});

describe('readCustom', () => {
  it('aceita string única ou lista', () => {
    expect(readCustom({ nivel: 'Iniciante', stack: ['Angular', ' Firebase '] })).toEqual({
      nivel: ['Iniciante'],
      stack: ['Angular', 'Firebase'],
    });
  });

  it('tolera ausente e itens inválidos', () => {
    expect(readCustom(null)).toEqual({ nivel: [], stack: [] });
    expect(readCustom({ nivel: 3, stack: ['a', 2, '', null] })).toEqual({ nivel: [], stack: ['a'] });
  });
});
