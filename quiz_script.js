/*
Script para inicializar o quiz

Modificações:
1. Criada a função `verificarEResetarEstadoDiario` para centralizar a lógica de verificação da data e reset das tentativas.
2. A função `carregarEstado` agora chama `verificarEResetarEstadoDiario` para garantir a verificação no carregamento inicial.
3. O event listener do botão 'iniciar-quiz' também chama `verificarEResetarEstadoDiario` antes de exibir a pergunta, garantindo que o reset ocorra mesmo se a página ficar aberta durante a virada do dia.
4. A função `verificarEResetarEstadoDiario` atualiza a interface (UI) sempre que é chamada, garantindo que os contadores e a mensagem de limite estejam corretos.
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
            pontuacaoTotal: Number(quizState.pontuacaoTotal),
            perguntasRespondidas: Number(quizState.perguntasRespondidas),
            tentativasRestantes: Number(quizState.tentativasRestantes),
            ultimaDataUso: quizState.ultimaDataUso || getDataAtual() // Garante que a data seja salva
        };
        
        // Salvar no localStorage
        localStorage.setItem('quizState', JSON.stringify(estadoParaSalvar));
        // console.log("Estado salvo:", JSON.stringify(estadoParaSalvar));
    }

    // Nova função para verificar e resetar o estado diário
    function verificarEResetarEstadoDiario() {
        const savedState = localStorage.getItem('quizState');
        const dataAtual = getDataAtual();
        let estadoAtualizado = false; // Flag para indicar se o estado foi atualizado

        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);

                // Verificar se a data salva é diferente da data atual
                if (parsedState.ultimaDataUso && parsedState.ultimaDataUso !== dataAtual) {
                    console.log(`Novo dia detectado (${parsedState.ultimaDataUso} -> ${dataAtual}). Resetando tentativas.`);
                    // Resetar tentativas e data no estado local (quizState)
                    quizState.perguntasRespondidas = 0;
                    quizState.tentativasRestantes = 30;
                    quizState.ultimaDataUso = dataAtual;
                    estadoAtualizado = true; // Marcar que o estado foi atualizado
                    salvarEstado(); // Salvar o estado resetado imediatamente
                } else {
                    // Se a data for a mesma, garantir que o estado local (quizState) esteja sincronizado com o localStorage
                    // Isso é importante caso a aba tenha sido aberta há muito tempo ou outra aba tenha modificado o estado
                    quizState.pontuacaoTotal = Number(parsedState.pontuacaoTotal) || 0;
                    quizState.perguntasRespondidas = Number(parsedState.perguntasRespondidas) || 0;
                    quizState.tentativasRestantes = parsedState.tentativasRestantes !== undefined ? Number(parsedState.tentativasRestantes) : 30;
                    quizState.ultimaDataUso = parsedState.ultimaDataUso || dataAtual;
                }

            } catch (e) {
                console.error("Erro ao verificar estado do quiz:", e);
                // Resetar estado completo em caso de erro
                quizState.pontuacaoTotal = 0;
                quizState.perguntasRespondidas = 0;
                quizState.tentativasRestantes = 30;
                quizState.ultimaDataUso = dataAtual;
                estadoAtualizado = true;
                salvarEstado();
            }
        } else {
            // Se não há estado salvo, inicializa com a data atual
            quizState.ultimaDataUso = dataAtual;
            quizState.tentativasRestantes = 30; // Garantir que as tentativas sejam 30
            quizState.perguntasRespondidas = 0;
            quizState.pontuacaoTotal = 0;
            estadoAtualizado = true;
            salvarEstado();
        }

        // Atualizar a interface sempre após a verificação, mesmo que não haja reset
        // Isso garante que a UI reflita o estado mais recente (útil se outra aba modificou)
        elements.pontuacaoTotal.textContent = quizState.pontuacaoTotal.toFixed(1);
        elements.perguntasRespondidas.textContent = quizState.perguntasRespondidas;
        elements.tentativasRestantes.textContent = quizState.tentativasRestantes;

        // Verificar se o limite foi atingido e atualizar a visibilidade dos botões/mensagens
        if (quizState.tentativasRestantes <= 0) {
            elements.iniciarQuizBtn.style.display = 'none';
            elements.limiteAtingido.style.display = 'block';
        } else {
            elements.iniciarQuizBtn.style.display = 'block';
            elements.limiteAtingido.style.display = 'none';
        }

        return estadoAtualizado; // Retorna se o estado foi modificado (resetado ou inicializado)
    }

    // Carregar estado do localStorage (agora usa a função de verificação)
    function carregarEstado() {
        verificarEResetarEstadoDiario(); // Chama a verificação/reset primeiro
        // O estado local (quizState) e a UI já foram atualizados dentro de verificarEResetarEstadoDiario
        console.log("Estado carregado/verificado.");
    }

    // Atualizar pontuação global do aplicativo
    function atualizarPontuacaoGlobal(pontosAdicionais) {
        const pontosAtuais = parseInt(localStorage.getItem('msaude_pontos') || '0');
        const novosPontos = pontosAtuais + pontosAdicionais;
        localStorage.setItem('msaude_pontos', novosPontos.toString());
        if (elements.pointsDisplay) {
            elements.pointsDisplay.textContent = `${novosPontos} pontos`;
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
            temaEscolhido = temas.find(tema => tema.dificuldade === 'facil'); 
        }
        quizState.tema = temaEscolhido.nome;
        quizState.dificuldade = temaEscolhido.dificuldade;
        quizState.pontosPorQuestao = temaEscolhido.pontos;
        const perguntas = temaEscolhido.array;
        quizState.perguntaAtual = perguntas[Math.floor(Math.random() * perguntas.length)];
        return temaEscolhido;
    }

    // Exibir pergunta
    function exibirPergunta() {
        // A verificação de tentativas agora é feita antes de chamar esta função, no listener do botão
        const tema = escolherTemaEDificuldade();
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
        const respostaCorreta = quizState.perguntaAtual.resposta;
        const acertou = respostaUsuario === respostaCorreta;
        quizState.perguntasRespondidas++;
        quizState.tentativasRestantes--;
        quizState.ultimaDataUso = getDataAtual(); // Atualiza a data do último uso
        if (acertou) {
            playSound('acertou.mp3');
            const pontosGanhos = Number(quizState.pontosPorQuestao);
            quizState.pontuacaoTotal = Number(quizState.pontuacaoTotal) + pontosGanhos;
            atualizarPontuacaoGlobal(pontosGanhos);
        } else {
            playSound('errou.mp3');
        }
        elements.mensagemFeedback.textContent = acertou ? 'Resposta Correta!' : 'Resposta Incorreta!';
        elements.mensagemFeedback.className = `mensagem-feedback ${acertou ? 'correta' : 'incorreta'}`;
        elements.pontosFeedback.textContent = acertou ? `+${quizState.pontosPorQuestao.toFixed(1)} pontos` : '+0.0 pontos';
        elements.respostaCorreta.textContent = quizState.perguntaAtual.opcoes[respostaCorreta];
        elements.pontuacaoFeedback.textContent = quizState.pontuacaoTotal.toFixed(1);
        elements.secaoPergunta.style.display = 'none';
        elements.secaoFeedback.style.display = 'block';
        elements.pontuacaoTotal.textContent = quizState.pontuacaoTotal.toFixed(1);
        elements.perguntasRespondidas.textContent = quizState.perguntasRespondidas;
        elements.tentativasRestantes.textContent = quizState.tentativasRestantes;
        salvarEstado(); // Salva estado após cada resposta
    }

    // Continuar para próxima pergunta ou voltar ao início
    function continuar() {
        // Verifica o estado atual das tentativas (pode ter sido atualizado por outra aba)
        verificarEResetarEstadoDiario(); 
        if (quizState.tentativasRestantes <= 0) {
            elements.secaoFeedback.style.display = 'none';
            elements.secaoInicial.style.display = 'block';
            // A função verificarEResetarEstadoDiario já ajustou a visibilidade do botão/mensagem
        } else {
            elements.secaoFeedback.style.display = 'none';
            elements.secaoInicial.style.display = 'block';
            // A função verificarEResetarEstadoDiario já ajustou a visibilidade do botão/mensagem
        }
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
        const selectedButton = event.target;
        const dificuldade = selectedButton.dataset.value;
        document.getElementById('selecionar-dificuldade-hidden').value = dificuldade;
        document.querySelectorAll('.dificuldade-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = 'white';
        });
        selectedButton.classList.add('active');
        selectedButton.style.backgroundColor = 'var(--primary-100)';
        atualizarDificuldade(dificuldade);
    }

    // Função para resetar o quiz (útil para testes)
    window.resetarQuiz = function() {
        localStorage.removeItem('quizState');
        quizState.pontuacaoTotal = 0;
        quizState.perguntasRespondidas = 0;
        quizState.tentativasRestantes = 30;
        quizState.ultimaDataUso = getDataAtual();
        salvarEstado(); // Salva o estado resetado
        carregarEstado(); // Recarrega a interface com o estado resetado
        console.log("Quiz resetado manualmente.");
    };

    // --- Inicialização e Event Listeners ---

    // Listener para o botão de iniciar quiz (MODIFICADO)
    elements.iniciarQuizBtn.addEventListener('click', () => {
        verificarEResetarEstadoDiario(); // Verifica/Reseta antes de exibir a pergunta
        if (quizState.tentativasRestantes > 0) { // Verifica novamente se há tentativas após o reset
            exibirPergunta();
        } else {
            console.log("Tentativas ainda esgotadas após verificação.");
            // A UI já deve ter sido atualizada por verificarEResetarEstadoDiario
        }
    });

    // Listener para o botão de continuar após feedback
    elements.botaoContinuar.addEventListener('click', continuar);

    // Listeners para os botões de dificuldade
    document.querySelectorAll('.dificuldade-btn').forEach(button => {
        button.addEventListener('click', handleDificuldadeButtonClick);
    });

    // Carregar estado inicial e definir dificuldade padrão
    carregarEstado(); // Chama a função que agora inclui a verificação/reset
    const dificuldadeInicial = document.getElementById('selecionar-dificuldade-hidden').value || 'facil';
    atualizarDificuldade(dificuldadeInicial);
    const initialButton = document.querySelector(`.dificuldade-btn[data-value='${dificuldadeInicial}']`);
    if (initialButton) {
        initialButton.classList.add('active');
        initialButton.style.backgroundColor = 'var(--primary-100)';
    }
});

