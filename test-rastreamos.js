const mysqldump = require('./dist/cjs.js');

// Simulando as variáveis de ambiente do seu sistema
const configEnvs = {
    MYSQL: {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'casat',
    },
};

// Configuração exata do seu sistema
let option = {
    connection: {
        host: configEnvs.MYSQL.host,
        user: configEnvs.MYSQL.user,
        password: configEnvs.MYSQL.password,
        database: configEnvs.MYSQL.database,
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
    dumpToFile: './backup-rastreamos.sql',
    compressFile: false,
};

async function testRastreamosBackup() {
    try {
        console.log('=== TESTE DO SISTEMA DE RASTREAMENTO ===');
        console.log('Configuração:');
        console.log(JSON.stringify(option, null, 2));
        console.log('\nIniciando backup...');

        const result = await mysqldump(option);

        console.log('\n✅ Backup concluído com sucesso!');
        console.log('📊 Resultados:');
        console.log(
            `   Schema: ${result.dump.schema ? '✅ Gerado' : '❌ Não gerado'}`,
        );
        console.log(
            `   Rotinas: ${
                result.dump.routine ? '✅ Geradas' : '❌ Não geradas'
            }`,
        );
        console.log(
            `   Triggers: ${
                result.dump.trigger ? '✅ Gerados' : '❌ Não gerados'
            }`,
        );
        console.log(`   Tabelas encontradas: ${result.tables.length}`);

        if (result.dump.schema) {
            console.log('\n📝 Schema gerado (primeiras 200 caracteres):');
            console.log(result.dump.schema.substring(0, 200) + '...');
        }

        if (result.dump.routine) {
            console.log('\n🔧 Rotinas geradas (primeiras 200 caracteres):');
            console.log(result.dump.routine.substring(0, 200) + '...');
        }
    } catch (error) {
        console.error('\n❌ Erro durante o backup:');
        console.error('Mensagem:', error.message);
        console.error('Código:', error.code);
        console.error('Stack trace:', error.stack);

        // Verificar se é o erro específico de conexão
        if (error.message && error.message.includes('closed state')) {
            console.error(
                '\n🔍 DIAGNÓSTICO: Erro de conexão fechada detectado!',
            );
            console.error('   - A conexão foi fechada prematuramente');
            console.error('   - Verifique se o banco de dados está acessível');
            console.error('   - Verifique as credenciais de conexão');
        }
    }
}

testRastreamosBackup();
