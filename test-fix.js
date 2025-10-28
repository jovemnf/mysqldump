const mysqldump = require('./dist/cjs.js');

// Configuração baseada no seu exemplo
const config = {
    connection: {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'casat',
    },
    dump: {
        data: false,
        schema: {
            format: true,
            includeViews: false, // Excluir views do schema
        },
        routine: {
            includeProcedures: true, // Incluir stored procedures
            includeFunctions: true, // Incluir functions
            dropIfExist: true,
        },
    },
    dumpToFile: './test-backup.sql',
    compressFile: false,
};

console.log('Configuração de teste:');
console.log(JSON.stringify(config, null, 2));

async function testBackup() {
    try {
        console.log('Iniciando backup...');

        const result = await mysqldump(config);

        console.log('Backup concluído com sucesso!');
        console.log('Schema:', result.dump.schema ? 'Gerado' : 'Não gerado');
        console.log(
            'Rotinas:',
            result.dump.routine ? 'Geradas' : 'Não geradas',
        );
        console.log(
            'Triggers:',
            result.dump.trigger ? 'Gerados' : 'Não gerados',
        );
        console.log('Tabelas encontradas:', result.tables.length);
    } catch (error) {
        console.error('Erro durante o backup:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

testBackup();
