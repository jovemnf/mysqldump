import mysqldump from './src/main';

const connection = {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'casat',
};

// Exemplo de uso com as novas funcionalidades
async function exemploUso() {
    try {
        // Exemplo 1: Incluir apenas stored procedures, excluindo functions e views
        const dump1 = await mysqldump({
            connection,
            dump: {
                schema: {
                    includeViews: false, // Excluir views do schema
                },
                routine: {
                    includeProcedures: true, // Incluir stored procedures
                    includeFunctions: false, // Excluir functions
                    definer: false,
                    dropIfExist: true,
                },
            },
        });

        console.log('Dump 1 - Apenas stored procedures:');
        console.log(dump1.dump.routine);

        // Exemplo 2: Incluir apenas functions, excluindo procedures e views
        const dump2 = await mysqldump({
            connection,
            dump: {
                schema: {
                    includeViews: false, // Excluir views do schema
                },
                routine: {
                    includeProcedures: false, // Excluir stored procedures
                    includeFunctions: true, // Incluir functions
                    definer: false,
                    dropIfExist: true,
                },
            },
        });

        console.log('Dump 2 - Apenas functions:');
        console.log(dump2.dump.routine);

        // Exemplo 3: Incluir views separadamente (sem procedures/functions)
        const dump3 = await mysqldump({
            connection,
            dump: {
                schema: {
                    includeViews: true, // Incluir views no schema
                },
                routine: false, // Excluir todas as rotinas
            },
        });

        console.log('Dump 3 - Apenas views no schema:');
        console.log(dump3.dump.schema);

        // Exemplo 4: Dump completo com separação
        const dump4 = await mysqldump({
            connection,
            dump: {
                schema: {
                    includeViews: false, // Views serão incluídas separadamente
                },
                routine: {
                    includeProcedures: true,
                    includeFunctions: true,
                    definer: false,
                    dropIfExist: true,
                },
            },
        });

        console.log('Dump 4 - Schema sem views:');
        console.log(dump4.dump.schema);
        console.log('Dump 4 - Rotinas:');
        console.log(dump4.dump.routine);
    } catch (error) {
        console.error('Erro ao fazer dump:', error);
    }
}

// Executar exemplo
exemploUso();
