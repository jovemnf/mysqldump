# Novas Funcionalidades - Controle de Views, Stored Procedures e Functions

## Visão Geral

Este documento descreve as novas funcionalidades implementadas para permitir controle granular sobre views, stored procedures e functions no mysqldump.

## Funcionalidades Implementadas

### 1. Controle de Views no Schema

**Opção:** `schema.includeViews`

-   **Tipo:** `boolean`
-   **Padrão:** `true`
-   **Descrição:** Controla se as views devem ser incluídas no dump do schema

```typescript
// Excluir views do schema
const dump = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        schema: {
            includeViews: false,
        },
    },
});
```

### 2. Controle de Stored Procedures e Functions

**Nova seção:** `dump.routine`

#### Opções Disponíveis:

-   **`includeProcedures`** (boolean, padrão: true): Incluir stored procedures
-   **`includeFunctions`** (boolean, padrão: true): Incluir functions
-   **`definer`** (boolean, padrão: false): Incluir definer nas rotinas
-   **`dropIfExist`** (boolean, padrão: false): Adicionar DROP IF EXISTS
-   **`delimiter`** (string | false, padrão: ';;'): Delimitador para rotinas

#### Exemplos de Uso:

```typescript
// Apenas stored procedures
const dump1 = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        routine: {
            includeProcedures: true,
            includeFunctions: false,
        },
    },
});

// Apenas functions
const dump2 = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        routine: {
            includeProcedures: false,
            includeFunctions: true,
        },
    },
});

// Excluir todas as rotinas
const dump3 = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        routine: false,
    },
});
```

### 3. Estrutura de Retorno Atualizada

A interface `DumpReturn` agora inclui:

```typescript
interface DumpReturn {
    dump: {
        schema: string | null;
        data: string | null;
        trigger: string | null;
        routine: string | null; // NOVO
    };
    tables: Array<Table>;
}
```

## Casos de Uso Comuns

### 1. Separar Views das Tabelas

```typescript
// Schema sem views
const schemaSemViews = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        schema: {
            includeViews: false,
        },
    },
});
```

### 2. Obter Apenas Stored Procedures

```typescript
const apenasProcedures = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: true,
            includeFunctions: false,
        },
    },
});
```

### 3. Obter Apenas Functions

```typescript
const apenasFunctions = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: false,
            includeFunctions: true,
        },
    },
});
```

### 4. Dump Completo com Separação

```typescript
const dumpCompleto = await mysqldump({
    connection: {
        /* ... */
    },
    dump: {
        schema: {
            includeViews: false, // Views separadas
        },
        routine: {
            includeProcedures: true,
            includeFunctions: true,
        },
    },
});

// Acessar cada parte separadamente
console.log('Schema:', dumpCompleto.dump.schema);
console.log('Views:', dumpCompleto.dump.routine); // Views estarão aqui se incluídas
console.log('Procedures:', dumpCompleto.dump.routine);
console.log('Functions:', dumpCompleto.dump.routine);
```

## Compatibilidade

-   ✅ **Retrocompatível**: Todas as funcionalidades existentes continuam funcionando
-   ✅ **Padrões sensatos**: Novas opções têm valores padrão que mantêm o comportamento atual
-   ✅ **Opcional**: As novas funcionalidades são opcionais e não afetam dumps existentes

## Arquivos Modificados

1. **`src/interfaces/Options.ts`**: Adicionadas novas interfaces e opções
2. **`src/interfaces/DumpReturn.ts`**: Adicionado campo `routine`
3. **`src/getRoutineDump.ts`**: Nova função para obter rotinas
4. **`src/getSchemaDump.ts`**: Atualizado para suportar exclusão de views
5. **`src/main.ts`**: Integração das novas funcionalidades

## Próximos Passos

Para usar as novas funcionalidades:

1. Atualize suas chamadas para incluir as novas opções conforme necessário
2. Teste com seus bancos de dados existentes
3. Ajuste as configurações conforme suas necessidades específicas

## Exemplo Completo

Veja o arquivo `example-usage.ts` para exemplos práticos de uso das novas funcionalidades.
