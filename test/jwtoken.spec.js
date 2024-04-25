const { tokenSign, verifyToken } = require('../src/helpers/generateToken');

describe('Pruebas para funciones de tokens JWT', () => {
    const usuarioEjemplo = {
        _id: '1234567890',
        role: 'user'
    };

    let tokenGenerado;

    beforeAll(async () => {
        tokenGenerado = await tokenSign(usuarioEjemplo);
    });

    it('debería generar un token JWT válido', () => {
        expect(tokenGenerado).toBeDefined();
        expect(typeof tokenGenerado).toBe('string');
    });

    it('debería verificar correctamente un token JWT válido', async () => {
        const resultadoVerificacion = await verifyToken(tokenGenerado);

        expect(resultadoVerificacion).toBeDefined();
        expect(resultadoVerificacion).toHaveProperty('_id', usuarioEjemplo._id);
        expect(resultadoVerificacion).toHaveProperty('role', usuarioEjemplo.role);
    });

    it('debería manejar un token JWT inválido y devolver un error', async () => {
        const tokenInvalido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjEyMTcwNDVmZGJkNTdjY2U3ZGUwNzciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTM4OTQ5ODEsImV4cCI6MTcxMzkwMjE4MX0.jx8O_Fz3cGgEj9Rz0O7C2ZoxxTisSqdsNNz3B7Un9EY';

        const result = await verifyToken(tokenInvalido);

        expect(result).toBe(false);
    });
});
