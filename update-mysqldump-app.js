#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function updateMysqldumpInApp() {
    try {
        console.log('🔄 Verificando atualizações do mysqldump...');

        // Obter o commit mais recente da branch develop
        const latestCommit = execSync(
            'git ls-remote https://github.com/jovemnf/mysqldump.git develop',
            { encoding: 'utf8' },
        )
            .trim()
            .split('\t')[0];

        console.log(`📦 Commit mais recente: ${latestCommit}`);

        // Verificar se existe package.json
        const packagePath = path.join(process.cwd(), 'package.json');

        if (!fs.existsSync(packagePath)) {
            console.error('❌ package.json não encontrado no diretório atual');
            console.log('💡 Execute este script no diretório da sua aplicação');
            process.exit(1);
        }

        // Ler o package.json
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        // Verificar se mysqldump está nas dependências
        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }

        const oldVersion =
            packageJson.dependencies.mysqldump || 'não encontrado';

        // Atualizar a versão do mysqldump
        packageJson.dependencies.mysqldump = `git+https://github.com/jovemnf/mysqldump.git#${latestCommit}`;

        // Salvar o package.json
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

        console.log(`✅ Atualizado de: ${oldVersion}`);
        console.log(`✅ Para: ${packageJson.dependencies.mysqldump}`);

        // Limpar cache e reinstalar
        console.log('🧹 Limpando cache...');
        execSync('npm cache clean --force', { stdio: 'inherit' });

        console.log('📥 Reinstalando dependências...');
        execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

        console.log('🎉 Atualização concluída com sucesso!');
        console.log('💡 Reinicie sua aplicação para usar a nova versão');
    } catch (error) {
        console.error('❌ Erro durante a atualização:', error.message);
        process.exit(1);
    }
}

updateMysqldumpInApp();
