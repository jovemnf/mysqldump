#!/usr/bin/env node

/**
 * Exemplo prático de como usar o mysqldump com a nova funcionalidade de seleção de colunas
 *
 * Para usar este exemplo:
 * 1. Instale seu fork: npm install git+https://github.com/SEU_USUARIO/mysqldump.git
 * 2. Configure as credenciais do banco abaixo
 * 3. Execute: node exemplo-uso.js
 */

const mysqldump = require('./dist/cjs.js'); // Usando o arquivo local para teste

async function exemploCompleto() {
    // Configuração do banco - AJUSTE CONFORME NECESSÁRIO
    const config = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'test_db',
    };

    try {
        console.log('🚀 Iniciando backup com seleção de colunas...\n');

        // Exemplo 1: Backup completo (comportamento padrão)
        console.log('📋 Exemplo 1: Backup completo (todas as colunas)');
        const backupCompleto = await mysqldump({
            connection: config,
            dump: {
                tables: ['usuarios'], // Especifique suas tabelas
                schema: false,
                trigger: false,
                data: {
                    format: true,
                    verbose: true,
                },
            },
        });
        console.log('✅ Backup completo gerado');
        console.log(
            'Tamanho:',
            backupCompleto.dump.data?.length || 0,
            'caracteres\n',
        );

        // Exemplo 2: Backup com colunas específicas
        console.log('🎯 Exemplo 2: Backup com colunas específicas');
        const backupSeletivo = await mysqldump({
            connection: config,
            dump: {
                tables: ['usuarios', 'produtos'],
                schema: false,
                trigger: false,
                data: {
                    format: true,
                    verbose: true,
                    // 🆕 NOVA FUNCIONALIDADE: Seleção de colunas
                    columns: {
                        usuarios: ['id', 'nome', 'email'], // Sem senha, sem dados sensíveis
                        produtos: ['id', 'nome', 'preco'], // Apenas dados essenciais
                        // Outras tabelas não listadas aqui usarão todas as colunas
                    },
                },
            },
        });
        console.log('✅ Backup seletivo gerado');
        console.log(
            'Tamanho:',
            backupSeletivo.dump.data?.length || 0,
            'caracteres\n',
        );

        // Exemplo 3: Backup para arquivo com filtros
        console.log('💾 Exemplo 3: Salvando em arquivo com filtros');
        await mysqldump({
            connection: config,
            dumpToFile: './backup-seletivo.sql',
            dump: {
                data: {
                    columns: {
                        usuarios: ['id', 'nome', 'email', 'data_criacao'],
                        logs: ['id', 'data', 'acao'], // Sem dados de sessão
                    },
                    where: {
                        usuarios: 'ativo = 1 AND data_criacao > "2023-01-01"',
                        logs: 'data > DATE_SUB(NOW(), INTERVAL 30 DAY)',
                    },
                    maxRowsPerInsertStatement: 100,
                },
            },
        });
        console.log('✅ Backup salvo em: backup-seletivo.sql\n');

        // Exemplo 4: Apenas schema (sem dados)
        console.log('🏗️  Exemplo 4: Apenas estrutura das tabelas');
        const apenasSchema = await mysqldump({
            connection: config,
            dump: {
                data: false, // Não incluir dados
                schema: {
                    format: true,
                },
            },
        });
        console.log('✅ Schema gerado');
        console.log(
            'Tamanho:',
            apenasSchema.dump.schema?.length || 0,
            'caracteres\n',
        );

        console.log('🎉 Todos os exemplos executados com sucesso!');
        console.log('\n📝 Vantagens da nova funcionalidade:');
        console.log('   • Controle total sobre quais colunas exportar');
        console.log('   • Melhor segurança (exclua dados sensíveis)');
        console.log('   • Melhor performance (menos dados transferidos)');
        console.log('   • Flexibilidade (diferentes colunas por tabela)');
    } catch (error) {
        console.error('❌ Erro durante o backup:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log(
                '\n💡 Dica: Verifique se o MySQL está rodando e as credenciais estão corretas',
            );
        }

        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log(
                '\n💡 Dica: Verifique se as tabelas especificadas existem no banco',
            );
        }
    }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    exemploCompleto();
}

module.exports = { exemploCompleto };
