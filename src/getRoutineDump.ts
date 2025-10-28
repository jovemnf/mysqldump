import * as sqlformatter from 'sql-formatter';

import { RoutineDumpOptions } from './interfaces/Options';
import { DB } from './DB';

interface ShowRoutines {
    ROUTINE_NAME: string;
    ROUTINE_TYPE: 'PROCEDURE' | 'FUNCTION';
    ROUTINE_DEFINITION: string;
    DEFINER: string;
    SQL_DATA_ACCESS: string;
    IS_DETERMINISTIC: string;
    ROUTINE_COMMENT: string;
}

interface ShowCreateRoutine {
    ROUTINE_NAME: string;
    'Create Routine': string;
}

async function getRoutineDump(
    connection: DB,
    dbName: string,
    options: Required<RoutineDumpOptions>,
): Promise<string> {
    const format = (sql: string) => sqlformatter.format(sql);

    // Verify connection is valid
    if (!connection) {
        throw new Error('Conexão inválida para dump de rotinas');
    }

    // Get list of routines
    const routineTypes = [];
    if (options.includeProcedures) routineTypes.push("'PROCEDURE'");
    if (options.includeFunctions) routineTypes.push("'FUNCTION'");

    if (routineTypes.length === 0) {
        return '';
    }

    const routinesQuery = `
        SELECT ROUTINE_NAME, ROUTINE_TYPE, ROUTINE_DEFINITION, DEFINER, 
               SQL_DATA_ACCESS, IS_DETERMINISTIC, ROUTINE_COMMENT
        FROM information_schema.ROUTINES 
        WHERE ROUTINE_SCHEMA = '${dbName}'
        AND ROUTINE_TYPE IN (${routineTypes.join(',')})
        ORDER BY ROUTINE_TYPE, ROUTINE_NAME
    `;

    let routines;
    try {
        routines = await connection.query<ShowRoutines>(routinesQuery);
    } catch (error) {
        console.error('Erro ao buscar lista de rotinas:', error);
        throw new Error(`Falha ao buscar rotinas: ${error.message || error}`);
    }

    if (routines.length === 0) {
        return '';
    }

    // Get CREATE statements for each routine
    const createStatements = [];

    // Process routines one by one with proper error handling
    for (const routine of routines) {
        try {
            const createQuery = `SHOW CREATE ${routine.ROUTINE_TYPE} \`${
                routine.ROUTINE_NAME
            }\``;

            const createResult = await connection.query<ShowCreateRoutine>(
                createQuery,
            );

            if (createResult.length > 0) {
                let sql = createResult[0]['Create Routine'];

                // Clean up the generated SQL
                if (!options.definer) {
                    sql = sql.replace(/CREATE DEFINER=.+?@.+? /, 'CREATE ');
                }

                // Add delimiter if specified
                if (options.delimiter) {
                    sql = `DELIMITER ${options.delimiter}\n${sql}${
                        options.delimiter
                    }\nDELIMITER ;`;
                } else {
                    sql = `${sql};`;
                }

                // Add drop statement if requested
                if (options.dropIfExist) {
                    const dropStatement = `DROP ${
                        routine.ROUTINE_TYPE
                    } IF EXISTS \`${routine.ROUTINE_NAME}\`;`;
                    sql = `${dropStatement}\n${sql}`;
                }

                // Format the SQL
                sql = format(sql);

                // Add header
                const header = [
                    '# ------------------------------------------------------------',
                    `# ROUTINE DUMP FOR: ${routine.ROUTINE_NAME} (${
                        routine.ROUTINE_TYPE
                    })`,
                    '# ------------------------------------------------------------',
                    '',
                    sql,
                    '',
                ].join('\n');

                createStatements.push(header);
            }
        } catch (error) {
            console.warn(
                `Erro ao obter rotina ${routine.ROUTINE_NAME}:`,
                error.message || error,
            );
            // Continue com a próxima rotina
        }
    }

    return createStatements.join('\n');
}

export { ShowRoutines, ShowCreateRoutine, getRoutineDump };
