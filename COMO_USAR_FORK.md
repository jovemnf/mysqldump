# Como Usar seu Fork do MySQLDump

## 1. Instalação Diretamente do GitHub

### Via npm:

```bash
npm install git+https://github.com/SEU_USUARIO/mysqldump.git
```

### Via yarn:

```bash
yarn add git+https://github.com/SEU_USUARIO/mysqldump.git
```

### Especificando uma branch específica:

```bash
npm install git+https://github.com/SEU_USUARIO/mysqldump.git#develop
```

## 2. Uso nos seus Projetos

### Node.js (CommonJS):

```javascript
const mysqldump = require('mysqldump');

async function exemploUso() {
    const result = await mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'meu_banco',
        },
        dump: {
            data: {
                // Nova funcionalidade: especificar colunas
                columns: {
                    usuarios: ['id', 'nome', 'email'],
                    produtos: ['id', 'nome', 'preco'],
                },
            },
        },
    });

    console.log(result.dump.data);
}
```

### ES Modules:

```javascript
import mysqldump from 'mysqldump';

const result = await mysqldump({
    connection: config,
    dump: {
        data: {
            columns: {
                tabela1: ['col1', 'col2'],
            },
        },
    },
});
```

### TypeScript:

```typescript
import mysqldump, { Options } from 'mysqldump';

const options: Options = {
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'test',
    },
    dump: {
        data: {
            columns: {
                usuarios: ['id', 'nome'],
            },
        },
    },
};

const result = await mysqldump(options);
```

## 3. Publicar seu Fork como Pacote NPM

Se quiser disponibilizar publicamente:

### 3.1. Atualizar package.json:

```json
{
    "name": "@seu-usuario/mysqldump",
    "version": "3.2.1",
    "description": "MySQLDump com seleção de colunas",
    "main": "dist/cjs.js",
    "module": "dist/es.js",
    "types": "dist/mysqldump.d.ts"
}
```

### 3.2. Publicar:

```bash
npm login
npm publish --access public
```

### 3.3. Instalar em outros projetos:

```bash
npm install @seu-usuario/mysqldump
```

## 4. Desenvolvimento Local

Para testar localmente antes de publicar:

### 4.1. Link local:

```bash
# No diretório do seu fork
npm link

# No seu projeto que vai usar
npm link mysqldump
```

### 4.2. Instalar do arquivo local:

```bash
npm install /caminho/para/seu/fork
```

## 5. Estrutura dos Arquivos Gerados

-   **`dist/cjs.js`**: Versão CommonJS (require)
-   **`dist/es.js`**: Versão ES Modules (import)
-   **`dist/mysqldump.d.ts`**: Definições TypeScript

## 6. Exemplo Completo de Uso

```javascript
const mysqldump = require('mysqldump');

async function backupComColunas() {
    try {
        const dump = await mysqldump({
            connection: {
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: 'senha',
                database: 'meu_sistema',
            },
            dumpToFile: './backup.sql',
            dump: {
                data: {
                    // Sua nova funcionalidade!
                    columns: {
                        usuarios: ['id', 'nome', 'email'], // Sem senha
                        logs: ['id', 'data', 'acao'], // Sem dados sensíveis
                        produtos: ['id', 'nome', 'preco'], // Apenas essenciais
                    },
                    where: {
                        usuarios: 'ativo = 1', // Apenas usuários ativos
                    },
                },
            },
        });

        console.log('Backup realizado com sucesso!');
        console.log('Tabelas processadas:', dump.tables.length);
    } catch (error) {
        console.error('Erro no backup:', error);
    }
}

backupComColunas();
```

## 7. Vantagens do seu Fork

✅ **Seleção de colunas**: Controle total sobre quais dados exportar
✅ **Segurança**: Exclua colunas sensíveis facilmente  
✅ **Performance**: Menos dados = backup mais rápido
✅ **Flexibilidade**: Diferentes colunas para diferentes tabelas
✅ **Compatibilidade**: Funciona com todas as opções existentes
