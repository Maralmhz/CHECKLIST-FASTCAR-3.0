document.addEventListener('DOMContentLoaded', function () {
    // garante que config.js já foi carregado via <script src="config.js"> no HTML
    if (!window.OFICINA_CONFIG) {
        console.warn('OFICINA_CONFIG não encontrado. Usando textos padrão do HTML.');
        return;
    }

    const cfg = window.OFICINA_CONFIG;

    // Elementos principais
    const elTituloPagina   = document.getElementById('titulo-pagina');
    const elLogo           = document.getElementById('logo-oficina');
    const elNomeOficina    = document.getElementById('nome-oficina');
    const elSubtitulo      = document.getElementById('subtitulo-oficina');
    const elTelefone       = document.getElementById('telefone-oficina');
    const elEndereco       = document.getElementById('endereco-oficina');

    if (elTituloPagina && cfg.nome)     elTituloPagina.textContent = `Checklist de Entrada – ${cfg.nome}`;
    if (elLogo && cfg.logo)             elLogo.src = cfg.logo;
    if (elNomeOficina && cfg.nome)      elNomeOficina.textContent = cfg.nome;
    if (elSubtitulo && cfg.subtitulo)   elSubtitulo.textContent = cfg.subtitulo;
    if (elTelefone && cfg.telefone)     elTelefone.textContent = cfg.telefone;
    if (elEndereco && cfg.endereco)     elEndereco.textContent = cfg.endereco;

    // Cor principal (usa sua var existente)
    if (cfg.corPrimaria) {
        document.documentElement.style.setProperty('--color-primary', cfg.corPrimaria);
    }
});

// ==========================================
// FUNÇÃO DE IMPORTAR BACKUP (JSON)
// ==========================================
function importarBackup(input) {
    const arquivo = input.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);

            // Verifica se é uma lista válida (Array)
            if (Array.isArray(dados)) {
                if(confirm("⚠️ ATENÇÃO: Isso irá substituir/mesclar seu histórico atual com o do arquivo.\n\nDeseja continuar?")) {

                    // Lógica segura: Mesclar ou Substituir?
                    // O usuário pediu "carregar eles", o código sugerido antes substituía.
                    // Vamos manter a lógica de substituir mas salvar o atual antes se quiser?
                    // Vamos simplificar: Substituir (como no código anterior) ou Mesclar?
                    // O código anterior sugerido era localStorage.setItem('checklists', ...); (Substituição)
                    // Vamos usar substituição para ser consistente com "Restaurar Backup"

                    localStorage.setItem('checklists', JSON.stringify(dados));

                    alert("✅ Histórico restaurado com sucesso! (" + dados.length + " checklists)");

                    // Atualiza a tela se as funções existirem
                    if (typeof carregarHistorico === 'function') carregarHistorico();
                    if (typeof atualizarRelatorios === 'function') atualizarRelatorios();
                }
            } else {
                alert("❌ O arquivo selecionado não parece ser um backup válido de checklists (não é uma lista).");
            }
        } catch (erro) {
            console.error(erro);
            alert("❌ Erro ao ler o arquivo JSON. Verifique se ele não está corrompido.");
        }
    };

    leitor.readAsText(arquivo);
    input.value = ''; // Limpa para permitir selecionar o mesmo arquivo novamente
}
