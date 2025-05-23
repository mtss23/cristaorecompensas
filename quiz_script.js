// Script para inicializar o quiz

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
        tentativasRestantes: 30
    };

    // Carregar estado do localStorage
    function carregarEstado() {
        const savedState = localStorage.getItem('quizState');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                quizState.pontuacaoTotal = Number(parsedState.pontuacaoTotal) || 0;
                quizState.perguntasRespondidas = Number(parsedState.perguntasRespondidas) || 0;
                quizState.tentativasRestantes = parsedState.tentativasRestantes !== undefined ? Number(parsedState.tentativasRestantes) : 30;
            } catch (e) {
                console.error("Erro ao carregar estado do quiz:", e);
                // Resetar estado em caso de erro
                quizState.pontuacaoTotal = 0;
                quizState.perguntasRespondidas = 0;
                quizState.tentativasRestantes = 30;
            }
        }
        
        // Atualizar interface
        elements.pontuacaoTotal.textContent = quizState.pontuacaoTotal.toFixed(1);
        elements.perguntasRespondidas.textContent = quizState.perguntasRespondidas;
        elements.tentativasRestantes.textContent = quizState.tentativasRestantes;
        
        // Verificar se o limite foi atingido
        if (quizState.tentativasRestantes <= 0) {
            elements.iniciarQuizBtn.style.display = 'none';
            elements.limiteAtingido.style.display = 'block';
        } else {
            elements.iniciarQuizBtn.style.display = 'block';
            elements.limiteAtingido.style.display = 'none';
        }
    }

    // Salvar estado no localStorage
    function salvarEstado() {
        // Garantir que os valores são números antes de salvar
        const estadoParaSalvar = {
            pontuacaoTotal: Number(quizState.pontuacaoTotal),
            perguntasRespondidas: Number(quizState.perguntasRespondidas),
            tentativasRestantes: Number(quizState.tentativasRestantes)
        };
        
        // Salvar no localStorage e verificar se foi salvo corretamente
        localStorage.setItem('quizState', JSON.stringify(estadoParaSalvar));
        
        // Verificação de debug - confirmar que os dados foram salvos corretamente
        console.log("Estado salvo:", JSON.stringify(estadoParaSalvar));
        console.log("Estado atual no localStorage:", localStorage.getItem('quizState'));
    }

    // Atualizar pontuação global do aplicativo
    function atualizarPontuacaoGlobal(pontosAdicionais) {
        // Obter pontos atuais do localStorage
        const pontosAtuais = parseInt(localStorage.getItem('msaude_pontos') || '0');
        
        // Adicionar novos pontos
        const novosPontos = pontosAtuais + pontosAdicionais;
        
        // Salvar no localStorage
        localStorage.setItem('msaude_pontos', novosPontos.toString());
        
        // Atualizar interface
        if (elements.pointsDisplay) {
            elements.pointsDisplay.textContent = `${novosPontos} pontos`;
        }
        
        console.log(`Pontuação global atualizada: ${pontosAtuais} + ${pontosAdicionais} = ${novosPontos}`);
    }

    // Escolher tema baseado na dificuldade selecionada pelo usuário
    function escolherTemaEDificuldade() {
        const dificuldadeSelecionada = document.getElementById('selecionar-dificuldade-hidden').value; // Ler do input oculto
        
        const temas = [
            { nome: 'Conhecimentos Gerais da Bíblia', array: theLoveDeepspaceFacil, dificuldade: 'facil', pontos: 1.0 },
            { nome: 'Ensinamentos de Jesus', array: theLoveDeepspaceMedio, dificuldade: 'medio', pontos: 2.0 },
            { nome: 'Teologia e Doutrinas Cristãs', array: theLoveDeepspaceDificil, dificuldade: 'dificil', pontos: 3.0 },
            { nome: 'Curiosidades Bíblicas', array: theLoveDeepspaceExtra, dificuldade: 'extra', pontos: 3.0 },
            { nome: 'Vida de Jesus (Básico)', array: moDaoZuShiFacil, dificuldade: 'facil', pontos: 1.0 },
            { nome: 'Vida de Jesus (Avançado)', array: moDaoZuShiMedio, dificuldade: 'medio', pontos: 2.0 }
        ];
        
        // Filtrar temas pela dificuldade selecionada
        const temasFiltrados = temas.filter(tema => tema.dificuldade === dificuldadeSelecionada);
        
        // Se não houver temas para a dificuldade selecionada, usar qualquer tema com essa dificuldade
        let temaEscolhido;
        if (temasFiltrados.length > 0) {
            // Escolher aleatoriamente entre os temas da dificuldade selecionada
            temaEscolhido = temasFiltrados[Math.floor(Math.random() * temasFiltrados.length)];
        } else {
            // Caso padrão para 'facil' se algo der errado ou não houver filtro correspondente
            temaEscolhido = temas.find(tema => tema.dificuldade === 'facil'); 
        }
        
        quizState.tema = temaEscolhido.nome;
        quizState.dificuldade = temaEscolhido.dificuldade;
        quizState.pontosPorQuestao = temaEscolhido.pontos;
        
        // Escolher pergunta aleatória do tema
        const perguntas = temaEscolhido.array;
        quizState.perguntaAtual = perguntas[Math.floor(Math.random() * perguntas.length)];
        
        return temaEscolhido;
    }

    // Exibir pergunta
    function exibirPergunta() {
        const tema = escolherTemaEDificuldade();
        
        // Atualizar interface
        elements.quizThemeDisplay.textContent = `Tema: ${quizState.tema}`;
        elements.textoPergunta.textContent = quizState.perguntaAtual.pergunta;
        elements.opcoesContainer.innerHTML = '';
        elements.dificuldadeBadgePergunta.textContent = `Nível ${quizState.dificuldade}`;
        elements.dificuldadeBadgePergunta.className = `dificuldade-badge ${quizState.dificuldade}`;
        
        // Adicionar opções
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
        
        // Mostrar seção de pergunta
        elements.secaoInicial.style.display = 'none';
        elements.secaoPergunta.style.display = 'block';
        elements.secaoFeedback.style.display = 'none';
    }

    // Verificar resposta
    function verificarResposta(respostaUsuario) {
        const respostaCorreta = quizState.perguntaAtual.resposta;
        const acertou = respostaUsuario === respostaCorreta;
        
        // Atualizar estado
        quizState.perguntasRespondidas++;
        quizState.tentativasRestantes--;
        
        // Tocar efeito sonoro de acordo com o resultado
        if (acertou) {
            // Tocar som positivo para resposta correta
            playSound('sounds/positive.mp3');
            
            // Garantir que estamos adicionando um número
            const pontosGanhos = Number(quizState.pontosPorQuestao);
            quizState.pontuacaoTotal = Number(quizState.pontuacaoTotal) + pontosGanhos;
            
            // Atualizar também a pontuação global do aplicativo
            atualizarPontuacaoGlobal(pontosGanhos);
            
            console.log("Pontos adicionados:", pontosGanhos, "Total do quiz:", quizState.pontuacaoTotal);
        } else {
            // Tocar som negativo para resposta incorreta
            playSound('sounds/negative.mp3');
        }
        
        // Atualizar interface
        elements.mensagemFeedback.textContent = acertou ? 'Resposta Correta!' : 'Resposta Incorreta!';
        elements.mensagemFeedback.className = `mensagem-feedback ${acertou ? 'correta' : 'incorreta'}`;
        elements.pontosFeedback.textContent = acertou ? `+${quizState.pontosPorQuestao.toFixed(1)} pontos` : '+0.0 pontos';
        elements.respostaCorreta.textContent = quizState.perguntaAtual.opcoes[respostaCorreta];
        elements.pontuacaoFeedback.textContent = quizState.pontuacaoTotal.toFixed(1);
        
        // Mostrar seção de feedback
        elements.secaoPergunta.style.display = 'none';
        elements.secaoFeedback.style.display = 'block';
        
        // Atualizar estatísticas
        elements.pontuacaoTotal.textContent = quizState.pontuacaoTotal.toFixed(1);
        elements.perguntasRespondidas.textContent = quizState.perguntasRespondidas;
        elements.tentativasRestantes.textContent = quizState.tentativasRestantes;
        
        // Salvar estado imediatamente após atualização
        salvarEstado();
    }

    // Continuar para próxima pergunta ou voltar ao início
    function continuar() {
        if (quizState.tentativasRestantes <= 0) {
            // Voltar para a tela inicial e mostrar limite atingido
            elements.secaoFeedback.style.display = 'none';
            elements.secaoInicial.style.display = 'block';
            elements.iniciarQuizBtn.style.display = 'none';
            elements.limiteAtingido.style.display = 'block';
        } else {
            // Voltar para a tela inicial
            elements.secaoFeedback.style.display = 'none';
            elements.secaoInicial.style.display = 'block';
        }
    }

    // Atualizar interface de dificuldade
    function atualizarDificuldade(dificuldade) {
        // Atualizar o badge de dificuldade
        elements.dificuldadeBadge.className = `dificuldade-badge ${dificuldade}`;
        
        // Atualizar o texto do badge
        let textoNivel = 'Nível fácil';
        let pontos = 1.0;
        
        if (dificuldade === 'medio') {
            textoNivel = 'Nível médio';
            pontos = 2.0;
        } else if (dificuldade === 'dificil') {
            textoNivel = 'Nível difícil';
            pontos = 3.0;
        }
        
        elements.dificuldadeBadge.textContent = textoNivel;
        elements.pontosPorQuestao.textContent = pontos.toFixed(1);
    }

    // Função para lidar com a seleção de dificuldade pelos botões
    function handleDificuldadeButtonClick(event) {
        const selectedButton = event.target;
        const dificuldade = selectedButton.dataset.value;

        // Atualiza o valor no input oculto
        document.getElementById('selecionar-dificuldade-hidden').value = dificuldade;

        // Remove a classe 'active' de todos os botões
        document.querySelectorAll('.dificuldade-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = 'white'; // Reset background
        });

        // Adiciona a classe 'active' ao botão clicado
        selectedButton.classList.add('active');
        selectedButton.style.backgroundColor = 'var(--primary-100)'; // Highlight background

        // Chama a função para atualizar a interface (badge e pontos)
        atualizarDificuldade(dificuldade);
    }

    // Função para resetar o quiz (útil para testes)
    window.resetarQuiz = function() {
        localStorage.removeItem('quizState');
        quizState.pontuacaoTotal = 0;
        quizState.perguntasRespondidas = 0;
        quizState.tentativasRestantes = 30;
        carregarEstado();
        console.log("Quiz resetado com sucesso!");
    };

    // Event listeners
    elements.iniciarQuizBtn.addEventListener("click", exibirPergunta);
    elements.botaoContinuar.addEventListener("click", continuar);
    // Add event listeners for the custom difficulty buttons
    document.querySelectorAll(".dificuldade-btn").forEach(button => {
        button.addEventListener("click", handleDificuldadeButtonClick);
    });

    // Inicializar
    carregarEstado();
    // Initialize difficulty display based on default hidden input value
    atualizarDificuldade(document.getElementById("selecionar-dificuldade-hidden").value);
});
