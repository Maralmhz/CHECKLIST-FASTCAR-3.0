// sync_manager.js - SINCRONIZAÇÃO INTELIGENTE [FASTCAR]
// Versão standalone (sem ES6 modules)

(function() {
    'use strict';


    async function carregarModuloFirebase() {
        try {
            return await import('./firebase_app.js');
        } catch (error) {
            console.error('❌ Falha ao importar firebase_app.js:', error);
            throw new Error('Firebase indisponível. Verifique o carregamento de firebase_app.js e config.js');
        }
    }

    async function buscarChecklistsMes(ano, mes, limite = 100) {
        const moduloFirebase = await carregarModuloFirebase();
        if (!moduloFirebase?.buscarChecklistsMes) {
            throw new Error('Função buscarChecklistsMes não disponível no módulo Firebase');
        }
        return moduloFirebase.buscarChecklistsMes(ano, mes, limite);
    }

    async function buscarChecklistsMesAtual(limite = 100) {
        const agora = new Date();
        return buscarChecklistsMes(agora.getFullYear(), agora.getMonth() + 1, limite);
    }
    
    class SyncManager {
        constructor() {
            this.syncEmAndamento = false;
            this.ultimaSync = null;
        }

        async sincronizarInteligente(forcarCompleto = false) {
            if (this.syncEmAndamento) {
                console.warn('⚠️ Sincronização já em andamento...');
                return { sucesso: false, mensagem: 'Sync em andamento' };
            }
            
            try {
                this.syncEmAndamento = true;
                console.log('🔄 Iniciando sincronização inteligente [FastCar]...');
                
                const cache = window.cacheManager;
                if (!cache) {
                    throw new Error('CacheManager não inicializado. Carregue cache_manager.js primeiro!');
                }
                
                // Firebase é carregado sob demanda por import dinâmico em buscarChecklistsMes().
                
                const ultimaSync = await cache.getUltimaSincronizacao();
                
                let checklistsNuvem = [];
                let estrategia = '';
                
                if (!ultimaSync || forcarCompleto) {
                    estrategia = 'completa';
                    console.log('🆕 Primeira sincronização ou forçada - buscando mês completo...');
                    checklistsNuvem = await buscarChecklistsMesAtual();
                } else {
                    estrategia = 'incremental';
                    const diffMinutos = Math.floor((Date.now() - new Date(ultimaSync)) / 60000);
                    console.log(`⚡ Sync incremental - última sync há ${diffMinutos} minutos`);
                    
                    if (diffMinutos < 5) {
                        console.log('✅ Dados já estão atualizados (sync recente)');
                        return {
                            sucesso: true,
                            estrategia: 'cache',
                            novos: 0,
                            mensagem: 'Dados já atualizados'
                        };
                    }
                    
                    checklistsNuvem = await this.buscarNovosOuModificados(ultimaSync);
                }
                
                const resultado = await this.sincronizarComCache(checklistsNuvem);
                await cache.setUltimaSincronizacao();
                this.ultimaSync = new Date();
                
                console.log(`✅ Sincronização ${estrategia} concluída!`);
                console.log(`📅 ${resultado.novos} novo(s), ${resultado.atualizados} atualizado(s)`);
                
                return {
                    sucesso: true,
                    estrategia,
                    ...resultado,
                    timestamp: this.ultimaSync.toISOString()
                };
                
            } catch (error) {
                console.error('❌ Erro na sincronização:', error);
                return { sucesso: false, erro: error.message };
            } finally {
                this.syncEmAndamento = false;
            }
        }
        
        async buscarNovosOuModificados(timestamp) {
            try {
                const checklistsMesAtual = await buscarChecklistsMesAtual();
                const novosOuModificados = checklistsMesAtual.filter(checklist => {
                    const dataAtualizacao = checklist.atualizado_em || checklist.data_criacao;
                    return new Date(dataAtualizacao) > new Date(timestamp);
                });
                
                console.log(`🆕 ${novosOuModificados.length} checklist(s) novo(s)/modificado(s) encontrado(s)`);
                return novosOuModificados;
            } catch (error) {
                console.error('❌ Erro ao buscar modificados:', error);
                return [];
            }
        }
        
        async sincronizarComCache(checklistsNuvem) {
            const cache = window.cacheManager;
            const checklistsLocais = await cache.listarChecklists(1000);
            const mapaLocal = new Map(checklistsLocais.map(c => [c.id, c]));
            
            let novos = 0;
            let atualizados = 0;
            let inalterados = 0;
            
            for (const checklistNuvem of checklistsNuvem) {
                const checklistLocal = mapaLocal.get(checklistNuvem.id);
                
                if (!checklistLocal) {
                    await cache.salvarChecklist(checklistNuvem, true);
                    novos++;
                } else {
                    const dataLocal = checklistLocal.atualizado_em || checklistLocal.data_criacao;
                    const dataNuvem = checklistNuvem.atualizado_em || checklistNuvem.data_criacao;
                    
                    if (new Date(dataNuvem) > new Date(dataLocal)) {
                        await cache.salvarChecklist(checklistNuvem, true);
                        atualizados++;
                    } else {
                        inalterados++;
                    }
                }
            }
            
            return { novos, atualizados, inalterados, total: checklistsNuvem.length };
        }
        
        async sincronizarPeriodo(ano, mes) {
            try {
                console.log(`📅 Sincronizando ${mes}/${ano}...`);
                const checklistsMes = await buscarChecklistsMes(ano, mes);
                const resultado = await this.sincronizarComCache(checklistsMes);
                console.log(`✅ ${resultado.total} checklist(s) sincronizado(s) de ${mes}/${ano}`);
                return resultado;
            } catch (error) {
                console.error(`❌ Erro ao sincronizar ${mes}/${ano}:`, error);
                throw error;
            }
        }
        
        async sincronizarUltimaSemana() {
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = hoje.getMonth() + 1;
            
            console.log('📅 Sincronizando última semana...');
            const checklistsMes = await buscarChecklistsMes(ano, mes);
            const umaSemanaAtras = new Date();
            umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
            
            const checklistsSemana = checklistsMes.filter(c => 
                new Date(c.data_criacao) >= umaSemanaAtras
            );
            
            const resultado = await this.sincronizarComCache(checklistsSemana);
            console.log(`✅ ${resultado.total} checklist(s) da última semana`);
            return resultado;
        }
        
        iniciarSyncAutomatica(intervaloMinutos = 15) {
            if (this.intervalId) {
                console.warn('⚠️ Sync automática já está ativa');
                return;
            }
            
            console.log(`⏰ Sync automática ativada (a cada ${intervaloMinutos} minutos)`);
            this.intervalId = setInterval(() => {
                console.log('🔄 Executando sync automática...');
                this.sincronizarInteligente();
            }, intervaloMinutos * 60 * 1000);
        }
        
        pararSyncAutomatica() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                console.log('⏸️ Sync automática parada');
            }
        }
        
        async exibirEstatisticasSync() {
            const cache = window.cacheManager;
            const ultimaSync = await cache.getUltimaSincronizacao();
            const totalLocal = await cache.contarChecklists();
            
            console.log('📊 === ESTATÍSTICAS DE SINCRONIZAÇÃO [FASTCAR] ===');
            console.log(`⏰ Última sync: ${ultimaSync ? new Date(ultimaSync).toLocaleString('pt-BR') : 'Nunca'}`);
            console.log(`💾 Total no cache: ${totalLocal} checklist(s)`);
            console.log(`🔄 Sync em andamento: ${this.syncEmAndamento ? 'Sim' : 'Não'}`);
            console.log(`⏰ Sync automática: ${this.intervalId ? 'Ativa' : 'Inativa'}`);
            console.log('=============================================');
        }
    }
    
    // Instância global
    const syncManager = new SyncManager();
    window.syncManager = syncManager;
    
    // Comandos de debug
    window.syncDebug = {
        sincronizar: (forcar) => syncManager.sincronizarInteligente(forcar),
        sincronizarPeriodo: (ano, mes) => syncManager.sincronizarPeriodo(ano, mes),
        sincronizarSemana: () => syncManager.sincronizarUltimaSemana(),
        estatisticas: () => syncManager.exibirEstatisticasSync(),
        ativarAuto: (min) => syncManager.iniciarSyncAutomatica(min),
        pararAuto: () => syncManager.pararSyncAutomatica()
    };
    
    console.log('🔧 === SYNC MANAGER DISPONÍVEL [FASTCAR] ===');
    console.log('syncDebug.sincronizar()         - Sync inteligente');
    console.log('syncDebug.sincronizar(true)     - Sync completa');
    console.log('syncDebug.sincronizarSemana()   - Sync última semana');
    console.log('syncDebug.estatisticas()        - Ver estatísticas');
    console.log('syncDebug.ativarAuto(15)        - Auto-sync 15min');
    console.log('============================================');
    
})();
