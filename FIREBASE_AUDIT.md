# Auditoria Firebase — CHECKLIST-FASTCAR-3.0

Data: 2026-02-19

## Status geral

Foi identificado que a migração para Firebase **não está 100% consistente** em todos os pontos do projeto.

## Problemas encontrados

1. **`firebase_app.js` é módulo ES, mas é carregado como script clássico no HTML**  
   - `firebase_app.js` usa `export`.
   - Em `index.html`, ele é incluído com `<script src="firebase_app.js"></script>` (sem `type="module"`).
   - Isso tende a quebrar no browser com erro de sintaxe (`Unexpected token 'export'`).

2. **`sync_manager.js` depende de funções globais que não existem no escopo global**  
   - O arquivo chama `buscarChecklistsMesAtual()` e `buscarChecklistsMes(...)` diretamente.
   - Essas funções existem em `firebase_app.js` como exports de módulo, não como funções globais em `window`.
   - Resultado provável: erro de referência ao executar sincronização inteligente.

3. **Mensagem de erro ainda aponta para fluxo legado de token/Gist**  
   - Em `checklist.js`, no erro de sincronização, a UI orienta "Verifique ... Token no arquivo config.js".
   - Isso conflita com o backend atual Firebase e pode confundir suporte/operação.

4. **Arquivo legado de Gist ainda presente no repositório**  
   - `firebase_app_GIST_OLD.js` permanece no projeto e exporta API compatível antiga.
   - Mesmo desativado, pode gerar confusão operacional em manutenção futura.

5. **Fallback de configuração em `firebase_app.js` aponta para outro projeto Firebase**  
   - Caso `window.FIREBASE_CONFIG` não esteja definido, o fallback usa `checklist-oficina-72c9e` e chaves em variáveis globais.
   - Isso é arriscado se a ordem de scripts mudar ou se `config.js` falhar em carregar.

## Recomendações rápidas

- Carregar `firebase_app.js` apenas via `import()` (como já é feito em `checklist.js`) **ou** mudar a tag para `type="module"` e ajustar chamadas.
- Expor explicitamente no `window` (ou importar corretamente) as funções usadas por `sync_manager.js`.
- Atualizar mensagens de erro para remover referência a token/Gist.
- Remover/arquivar arquivo legado `firebase_app_GIST_OLD.js` fora do runtime principal.
- Eliminar fallback para projeto antigo ou forçar validação de `window.FIREBASE_CONFIG` no boot.
