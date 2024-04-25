const { encrypt, compare } = require('../src/helpers/handleBcrypt'); 

describe('Pruebas para funciones de encriptación', () => {
    it('debería encriptar correctamente un texto', async () => {
        const textOriginal = 'adm12';
        const textEncrypt = await encrypt(textOriginal);

        expect(textEncrypt).toBeDefined();
        expect(typeof textEncrypt).toBe('string');
    });

    it('debería comparar correctamente una contraseña en texto plano con su versión encriptada', async () => {
        const textOriginal = 'adm12';
        const textEncrypt = await encrypt(textOriginal);

        const comparation = await compare(textOriginal, textEncrypt);
        expect(comparation).toBe(true);
    });

    it('debería devolver falso al comparar una contraseña incorrecta con su versión encriptada', async () => {
        const textOriginal = 'adm12';
        const textoIncorrecto = 'hwecwexbrxuxhenxjhe';
        const textEncrypt = await encrypt(textOriginal);

        const comparation = await compare(textoIncorrecto, textEncrypt);

        expect(comparation).toBe(false);
    });
});
