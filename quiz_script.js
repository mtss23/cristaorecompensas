/*
Script para inicializar o quiz

Modificações:
1. Criada a função `verificarEResetarEstadoDiario` para centralizar a lógica de verificação da data e reset das tentativas.
2. A função `carregarEstado` agora chama `verificarEResetarEstadoDiario` para garantir a verificação no carregamento inicial.
3. O event listener do botão 'iniciar-quiz' também chama `verificarEResetarEstadoDiario` antes de exibir a pergunta, garantindo que o reset ocorra mesmo se a página ficar aberta durante a virada do dia.
4. A função `verificarEResetarEstadoDiario` atualiza a interface (UI) sempre que é chamada, garantindo que os contadores e a mensagem de limite estejam corretos.
5. Refinada a lógica de `verificarEResetarEstadoDiario` para maior robustez contra erros de localStorage e inicialização.
*/

document.addEventListener('DOMContentLoaded', function() {
    // Função para tocar efeitos sonoros
    function playSound(soundFile) {
        const audio = new Audio(soundFile);
        audio.play().catch(error => {
            console.error("Erro ao reproduzir som:", error);
        });
    }
    // Elementos do quiz
    const elements = {
        iniciarQuizBtn: document.getElementById('iniciar-quiz'),
        secaoInicial: document.getElementById('secao-inicial'),
        secaoPergunta: document.getElementById('secao-pergunta'),
        secaoFeedback: document.getElementById('secao-feedback'),
        textoPergunta: document.getElementById('texto-pergunta'),
        opcoesContainer: document.getElementById('opcoes-container'),
        mensagemFeedback: document.getElementById('mensagem-feedback'),
        pontosFeedback: document.getElementById('pontos-feedback'),
        respostaCorreta: document.getElementById('resposta-correta'),
        pontuacaoFeedback: document.getElementById('pontuacao-feedback'),
        botaoContinuar: document.getElementById('botao-continuar'),
        pontuacaoTotal: document.getElementById('pontuacao-total'),
        tentativasRestantes: document.getElementById('tentativas-restantes'),
        perguntasRespondidas: document.getElementById('perguntas-respondidas'),
        dificuldadeBadge: document.getElementById('dificuldade-badge'),
        dificuldadeBadgePergunta: document.getElementById('dificuldade-badge-pergunta'),
        pontosPorQuestao: document.getElementById('pontos-por-questao'),
        limiteAtingido: document.getElementById('limite-atingido'),
        quizThemeDisplay: document.getElementById('quiz-theme-display'),
        pointsDisplay: document.getElementById('pointsDisplay') // Elemento de pontuação global no cabeçalho
    };

    // Estado do quiz
    let quizState = {
        perguntaAtual: null,
        tema: null,
        dificuldade: null,
        pontosPorQuestao: 0,
        pontuacaoTotal: 0,
        perguntasRespondidas: 0,
        tentativasRestantes: 30,
        ultimaDataUso: null // Adicionado para controle diário
    };

    // Obter a data atual no formato YYYY-MM-DD
    function getDataAtual() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexados
        const dia = String(hoje.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    // Salvar estado no localStorage
    function salvarEstado() {
        // Garantir que os valores são números antes de salvar
        const estadoParaSalvar = {
            pontuacaoTotal: Number(quizState.pontuacaoTotal) || 0,
            perguntasRespondidas: Number(quizState.perguntasRespondidas) || 0,
            tentativasRestantes: Number(quizState.tentativasRestantes) || 0,
            ultimaDataUso: quizState.ultimaDataUso || getDataAtual() // Garante que a data seja salva
        };

        try {
             localStorage.setItem('quizState', JSON.stringify(estadoParaSalvar));
             // console.log("Estado salvo:", JSON.stringify(estadoParaSalvar));
        } catch (e) {
            console.error("Erro ao salvar estado no localStorage:", e);
            // Informar o usuário sobre o problema pode ser uma opção aqui
        }
    }

     // Nova função para verificar e resetar o estado diário (REFINADA)
     function verificarEResetarEstadoDiario() {
         const dataAtual = getDataAtual();
         let estadoSalvo = null;
         let estadoAtualizado = false; // Flag para indicar se o estado foi atualizado

         try {
             const savedStateString = localStorage.getItem('quizState');
             if (savedStateString) {
                 estadoSalvo = JSON.parse(savedStateString);
             }
         } catch (e) {
             console.error("Erro ao ler ou parsear estado do quiz do localStorage:", e);
             // Considerar o estado salvo como inválido
             estadoSalvo = null;
             try {
                localStorage.removeItem('quizState'); // Limpar estado inválido
             } catch (removeError) {
                 console.error("Erro ao remover estado inválido do localStorage:", removeError);
             }
         }

         // Determinar a data do último uso
         const ultimaDataSalva = estadoSalvo ? estadoSalvo.ultimaDataUso : null;

         // Verificar se é um novo dia ou se não há estado salvo/data salva
         if (!ultimaDataSalva || ultimaDataSalva !== dataAtual) {
             if (ultimaDataSalva) {
                 console.log(`Novo dia detectado (${ultimaDataSalva} -> ${dataAtual}). Resetando tentativas.`);
             } else {
                 console.log(`Nenhum estado/data anterior encontrado (${dataAtual}). Inicializando/Resetando tentativas.`);
             }

             // Resetar o estado local (quizState)
             // Mantém a pontuação total acumulada se já existia um estado salvo, senão zera.
             quizState.pontuacaoTotal = estadoSalvo ? (Number(estadoSalvo.pontuacaoTotal) || 0) : 0;
             quizState.perguntasRespondidas = 0;
             quizState.tentativasRestantes = 30;
             quizState.ultimaDataUso = dataAtual;
             estadoAtualizado = true;
             salvarEstado(); // Salvar o estado resetado/inicializado imediatamente
         } else {
             // Mesmo dia, sincronizar estado local com o salvo (se houver)
             if (estadoSalvo) {
                 quizState.pontuacaoTotal = Number(estadoSalvo.pontuacaoTotal) || 0;
                 quizState.perguntasRespondidas = Number(estadoSalvo.perguntasRespondidas) || 0;
                 // Garantir que tentativas não sejam negativas ou NaN e que exista no estado salvo
                 quizState.tentativasRestantes = (estadoSalvo.tentativasRestantes !== undefined && !isNaN(Number(estadoSalvo.tentativasRestantes))) ? Number(estadoSalvo.tentativasRestantes) : 30;
                 quizState.ultimaDataUso = estadoSalvo.ultimaDataUso; // Já sabemos que é dataAtual
             } else {
                 // Caso estranho: estadoSalvo é null, mas ultimaDataSalva era igual a dataAtual (não deveria acontecer)
                 // Inicializar por segurança
                 console.warn("Estado inconsistente detectado: localStorage vazio mas data parecia ser atual. Re-inicializando.");
                 quizState.pontuacaoTotal = 0;
                 quizState.perguntasRespondidas = 0;
                 quizState.tentativasRestantes = 30;
                 quizState.ultimaDataUso = dataAtual;
                 estadoAtualizado = true;
                 salvarEstado();
             }
         }

         // --- Atualização da UI (como estava antes) ---
         elements.pontuacaoTotal.textContent = quizState.pontuacaoTotal.toFixed(1);
         elements.perguntasRespondidas.textContent = quizState.perguntasRespondidas;
         elements.tentativasRestantes.textContent = quizState.tentativasRestantes;

         // Garante que o estado das tentativas seja refletido corretamente na UI
         if (quizState.tentativasRestantes <= 0) {
             elements.iniciarQuizBtn.style.display = 'none';
             elements.limiteAtingido.style.display = 'block';
         } else {
             elements.iniciarQuizBtn.style.display = 'block';
             elements.limiteAtingido.style.display = 'none';
         }
         // --- Fim da Atualização da UI ---

         return estadoAtualizado;
     }

    // Carregar estado do localStorage (agora usa a função de verificação refinada)
    function carregarEstado() {
        verificarEResetarEstadoDiario(); // Chama a verificação/reset primeiro
        // O estado local (quizState) e a UI já foram atualizados dentro de verificarEResetarEstadoDiario
        console.log("Estado carregado/verificado.");
        // Atualizar pontuação global na inicialização também
        const pontosAtuais = parseInt(localStorage.getItem('msaude_pontos') || '0');
         if (elements.pointsDisplay) {
             elements.pointsDisplay.textContent = `${pontosAtuais} pontos`;
         }
    }

    // Atualizar pontuação global do aplicativo
    function atualizarPontuacaoGlobal(pontosAdicionais) {
        try {
            const pontosAtuais = parseInt(localStorage.getItem('msaude_pontos') || '0');
            const novosPontos = pontosAtuais + pontosAdicionais;
            localStorage.setItem('msaude_pontos', novosPontos.toString());
            if (elements.pointsDisplay) {
                elements.pointsDisplay.textContent = `${novosPontos} pontos`;
            }
        } catch (e) {
            console.error("Erro ao atualizar pontuação global no localStorage:", e);
        }
    }

    // Escolher tema baseado na dificuldade selecionada pelo usuário
    function escolherTemaEDificuldade() {
        const dificuldadeSelecionada = document.getElementById('selecionar-dificuldade-hidden').value;
        const temas = [
            { nome: 'Conhecimentos Gerais da Bíblia', array: theLoveDeepspaceFacil, dificuldade: 'facil', pontos: 1.0 },
            { nome: 'Ensinamentos de Jesus', array: theLoveDeepspaceMedio, dificuldade: 'medio', pontos: 2.0 },
            { nome: 'Teologia e Doutrinas Cristãs', array: theLoveDeepspaceDificil, dificuldade: 'dificil', pontos: 3.0 },
            { nome: 'Curiosidades Bíblicas', array: theLoveDeepspaceExtra, dificuldade: 'extra', pontos: 3.0 },
            { nome: 'Vida de Jesus (Básico)', array: moDaoZuShiFacil, dificuldade: 'facil', pontos: 1.0 },
            { nome: 'Vida de Jesus (Avançado)', array: moDaoZuShiMedio, dificuldade: 'medio', pontos: 2.0 }
        ];
        const temasFiltrados = temas.filter(tema => tema.dificuldade === dificuldadeSelecionada);
        let temaEscolhido;
        if (temasFiltrados.length > 0) {
            temaEscolhido = temasFiltrados[Math.floor(Math.random() * temasFiltrados.length)];
        } else {
            // Fallback para fácil se a dificuldade selecionada não tiver temas
            console.warn(`Nenhum tema encontrado para a dificuldade '${dificuldadeSelecionada}', usando 'facil' como fallback.`);
            temaEscolhido = temas.find(tema => tema.dificuldade === 'facil');
            // Se nem 'facil' existir (improvável), pegar o primeiro tema disponível
            if (!temaEscolhido && temas.length > 0) {
                 temaEscolhido = temas[0];
            }
        }

        // Se ainda assim não houver tema (lista vazia), tratar o erro
        if (!temaEscolhido) {
            console.error("Nenhum tema de quiz disponível!");
            // Poderia exibir uma mensagem para o usuário aqui
            // Por ora, vamos retornar null para indicar o problema
             quizState.tema = 'Erro';
             quizState.dificuldade = 'desconhecida';
             quizState.pontosPorQuestao = 0;
             quizState.perguntaAtual = { pergunta: 'Erro ao carregar perguntas.', opcoes: [], resposta: -1 };
             return null; // Indica que não foi possível escolher um tema
        }

        quizState.tema = temaEscolhido.nome;
        quizState.dificuldade = temaEscolhido.dificuldade;
        quizState.pontosPorQuestao = temaEscolhido.pontos;
        const perguntas = temaEscolhido.array;
        if (!perguntas || perguntas.length === 0) {
             console.error(`Tema '${quizState.tema}' não possui perguntas!`);
             quizState.perguntaAtual = { pergunta: 'Erro: Tema sem perguntas.', opcoes: [], resposta: -1 };
             return temaEscolhido; // Retorna o tema, mas a pergunta indicará o erro
        }
        quizState.perguntaAtual = perguntas[Math.floor(Math.random() * perguntas.length)];
        return temaEscolhido;
    }

    // Exibir pergunta
    function exibirPergunta() {
        const temaEscolhido = escolherTemaEDificuldade();
        // Verificar se foi possível escolher um tema e se há uma pergunta válida
        if (!temaEscolhido || !quizState.perguntaAtual || quizState.perguntaAtual.resposta === -1) {
            // Exibir mensagem de erro ou voltar ao início
            elements.secaoPergunta.style.display = 'none';
            elements.secaoInicial.style.display = 'block';
            alert("Ocorreu um erro ao carregar as perguntas do quiz. Tente novamente mais tarde.");
            return; // Não prosseguir com a exibição da pergunta
        }

        elements.quizThemeDisplay.textContent = `Tema: ${quizState.tema}`;
        elements.textoPergunta.textContent = quizState.perguntaAtual.pergunta;
        elements.opcoesContainer.innerHTML = '';
        elements.dificuldadeBadgePergunta.textContent = `Nível ${quizState.dificuldade}`;
        elements.dificuldadeBadgePergunta.className = `dificuldade-badge ${quizState.dificuldade}`;
        quizState.perguntaAtual.opcoes.forEach((opcao, index) => {
            const opcaoElement = document.createElement('div');
            opcaoElement.className = 'opcao';
            opcaoElement.textContent = opcao;
            opcaoElement.dataset.index = index;
            opcaoElement.addEventListener('click', () => {
                verificarResposta(index);
            });
            elements.opcoesContainer.appendChild(opcaoElement);
        });
        elements.secaoInicial.style.display = 'none';
        elements.secaoPergunta.style.display = 'block';
        elements.secaoFeedback.style.display = 'none';
    }

    // Verificar resposta
    function verificarResposta(respostaUsuario) {
        // Garantir que temos uma pergunta válida antes de processar
        if (!quizState.perguntaAtual || quizState.perguntaAtual.resposta === undefined) {
            console.error("Tentativa de verificar resposta sem uma pergunta atual válida.");
            continuar(); // Voltar ao início ou estado seguro
            return;
        }

        const respostaCorreta = quizState.perguntaAtual.resposta;
        const acertou = respostaUsuario === respostaCorreta;

        // Decrementar tentativas apenas se ainda houver
        if (quizState.tentativasRestantes > 0) {
            quizState.perguntasRespondidas++;
            quizState.tentativasRestantes--;
            quizState.ultimaDataUso = getDataAtual(); // Atualiza a data do último uso

            if (acertou) {
                playSound('acertou.mp3');
                const pontosGanhos = Number(quizState.pontosPorQuestao) || 0;
                quizState.pontuacaoTotal = (Number(quizState.pontuacaoTotal) || 0) + pontosGanhos;
                atualizarPontuacaoGlobal(pontosGanhos);
            } else {
                playSound('errou.mp3');
            }

            elements.mensagemFeedback.textContent = acertou ? 'Resposta Correta!' : 'Resposta Incorreta!';
            elements.mensagemFeedback.className = `mensagem-feedback ${acertou ? 'correta' : 'incorreta'}`;
            elements.pontosFeedback.textContent = acertou ? `+${(Number(quizState.pontosPorQuestao) || 0).toFixed(1)} pontos` : '+0.0 pontos';
            // Mostrar a resposta correta apenas se houver opções
            if (quizState.perguntaAtual.opcoes && quizState.perguntaAtual.opcoes.length > respostaCorreta && respostaCorreta >= 0) {
                 elements.respostaCorreta.textContent = quizState.perguntaAtual.opcoes[respostaCorreta];
            } else {
                 elements.respostaCorreta.textContent = "-"; // Indicar que não há resposta aplicável
            }
            elements.pontuacaoFeedback.textContent = (Number(quizState.pontuacaoTotal) || 0).toFixed(1);

            elements.secaoPergunta.style.display = 'none';
            elements.secaoFeedback.style.display = 'block';

            // Atualizar contadores na UI principal
            elements.pontuacaoTotal.textContent = (Number(quizState.pontuacaoTotal) || 0).toFixed(1);
            elements.perguntasRespondidas.textContent = quizState.perguntasRespondidas;
            elements.tentativasRestantes.textContent = quizState.tentativasRestantes;

            salvarEstado(); // Salva estado após cada resposta
        } else {
            console.warn("Tentativa de responder com 0 tentativas restantes.");
            // Opcional: Mostrar mensagem ao usuário que as tentativas acabaram
            continuar(); // Leva de volta à tela inicial onde a mensagem de limite já deve estar visível
        }
    }

    // Continuar para próxima pergunta ou voltar ao início
    function continuar() {
        // Verifica o estado atual das tentativas (pode ter sido atualizado por outra aba ou reset diário)
        verificarEResetarEstadoDiario();
        // A função verificarEResetarEstadoDiario já ajusta a visibilidade do botão/mensagem
        // Apenas garantir que a seção correta seja exibida
        elements.secaoFeedback.style.display = 'none';
        elements.secaoInicial.style.display = 'block';
    }

    // Atualizar interface de dificuldade
    function atualizarDificuldade(dificuldade) {
        elements.dificuldadeBadge.className = `dificuldade-badge ${dificuldade}`;
        let textoNivel = 'Nível fácil';
        let pontos = 1.0;
        if (dificuldade === 'medio') {
            textoNivel = 'Nível médio';
            pontos = 2.0;
        } else if (dificuldade === 'dificil') {
            textoNivel = 'Nível difícil';
            pontos = 3.0;
        } else if (dificuldade === 'extra') {
            textoNivel = 'Nível extra';
            pontos = 3.0;
        }
        elements.dificuldadeBadge.textContent = textoNivel;
        elements.pontosPorQuestao.textContent = pontos.toFixed(1);
    }

    // Função para lidar com a seleção de dificuldade pelos botões
    function handleDificuldadeButtonClick(event) {
        const selectedButton = event.target.closest('.dificuldade-btn'); // Garante que pegamos o botão mesmo clicando no ícone/texto dentro dele
        if (!selectedButton) return; // Sai se o clique não foi em um botão de dificuldade

        const dificuldade = selectedButton.dataset.value;
        document.getElementById('selecionar-dificuldade-hidden').value = dificuldade;

        document.querySelectorAll('.dificuldade-btn').forEach(btn => {
            btn.classList.remove('active');
            // Resetar estilo para o padrão (ex: branco ou a cor definida no CSS)
            btn.style.backgroundColor = ''; // Remove o estilo inline para usar o do CSS
            btn.style.color = ''; // Resetar cor do texto também, se necessário
        });
        selectedButton.classList.add('active');
        // Aplicar estilo ativo (ex: cor primária). Use variáveis CSS se possível.
        selectedButton.style.backgroundColor = 'var(--primary-100)';
        selectedButton.style.color = 'var(--primary-text-on-primary-100)'; // Exemplo de cor de texto para contraste

        atualizarDificuldade(dificuldade);
    }

    // Função para resetar o quiz (útil para testes)
    window.resetarQuiz = function() {
        try {
            localStorage.removeItem('quizState');
            quizState.pontuacaoTotal = 0;
            quizState.perguntasRespondidas = 0;
            quizState.tentativasRestantes = 30;
            quizState.ultimaDataUso = getDataAtual();
            salvarEstado(); // Salva o estado resetado
            carregarEstado(); // Recarrega a interface com o estado resetado
            console.log("Quiz resetado manualmente.");
            alert("O estado do quiz foi resetado."); // Informa o usuário
        } catch (e) {
            console.error("Erro ao resetar o quiz manualmente:", e);
            alert("Erro ao tentar resetar o quiz.");
        }
    };

    // --- Inicialização e Event Listeners ---

    // Adicionar listeners aos botões de dificuldade
    document.querySelectorAll('.dificuldade-btn').forEach(button => {
        button.addEventListener('click', handleDificuldadeButtonClick);
    });

    // Inicializar com a dificuldade padrão ('facil') ou a última selecionada (se guardada)
    // Aqui, vamos apenas inicializar com 'facil' por padrão na UI
    const defaultDifficultyButton = document.querySelector('.dificuldade-btn[data-value="facil"]');
    if (defaultDifficultyButton) {
         // Simula um clique para definir o estado inicial visualmente e no input hidden
         handleDificuldadeButtonClick({ target: defaultDifficultyButton });
    } else {
        // Se não encontrar o botão fácil, apenas atualiza a UI com os valores padrão
        atualizarDificuldade('facil');
        document.getElementById('selecionar-dificuldade-hidden').value = 'facil';
    }

    // Listener para o botão de iniciar quiz (MODIFICADO)
    elements.iniciarQuizBtn.addEventListener('click', () => {
        verificarEResetarEstadoDiario(); // Verifica/Reseta antes de exibir a pergunta
        if (quizState.tentativasRestantes > 0) { // Verifica novamente se há tentativas após o reset
            exibirPergunta();
        } else {
            console.log("Tentativas ainda esgotadas após verificação.");
            // A UI já deve ter sido atualizada por verificarEResetarEstadoDiario para mostrar a mensagem de limite
        }
    });

    // Listener para o botão de continuar após feedback
    elements.botaoContinuar.addEventListener('click', continuar);

    // Carregar o estado inicial do quiz (inclui verificação de data e UI)
    carregarEstado();

});

