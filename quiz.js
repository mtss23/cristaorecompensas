// Arquivo principal do quiz

// Perguntas incorporadas diretamente no arquivo para não depender de arquivos externos
// The Love And Deepspace - Fácil (Conhecimentos Gerais da Bíblia)
const theLoveDeepspaceFacil = [
    {
        pergunta: "Quem construiu a arca segundo o relato bíblico?",
        opcoes: ["Abraão", "Moisés", "Noé", "Davi"],
        resposta: 2
    },
    {
        pergunta: "Qual foi o primeiro milagre de Jesus registrado na Bíblia?",
        opcoes: ["Multiplicação dos pães", "Cura de um cego", "Transformar água em vinho", "Ressuscitar Lázaro"],
        resposta: 2
    },
    {
        pergunta: "Quantos livros compõem o Novo Testamento?",
        opcoes: ["27", "39", "66", "12"],
        resposta: 0
    },
    {
        pergunta: "Quem foi jogado na cova dos leões?",
        opcoes: ["Davi", "Daniel", "Jonas", "Paulo"],
        resposta: 1
    },
    {
        pergunta: "Qual monte é conhecido como o local onde Moisés recebeu os Dez Mandamentos?",
        opcoes: ["Monte Carmelo", "Monte Sinai", "Monte das Oliveiras", "Monte Sião"],
        resposta: 1
    },
    {
        pergunta: "Quem era o pai de Salomão?",
        opcoes: ["Saul", "Davi", "Samuel", "Josias"],
        resposta: 1
    },
    {
        pergunta: "Qual animal falou com Balaão na Bíblia?",
        opcoes: ["Camelo", "Jumento", "Cordeiro", "Pomba"],
        resposta: 1
    },
    {
        pergunta: "Qual era a profissão de Pedro antes de seguir Jesus?",
        opcoes: ["Carpinteiro", "Pescador", "Coletor de impostos", "Pastor de ovelhas"],
        resposta: 1
    },
    {
        pergunta: "Quem foi vendido como escravo pelos próprios irmãos?",
        opcoes: ["Moisés", "José", "Davi", "Isaías"],
        resposta: 1
    },
    {
        pergunta: "Qual cidade Jesus nasceu?",
        opcoes: ["Jerusalém", "Nazaré", "Belém", "Jericó"],
        resposta: 2
    },
    {
        pergunta: "Quem negou Jesus três vezes?",
        opcoes: ["João", "Pedro", "Judas", "Tomé"],
        resposta: 1
    },
    {
        pergunta: "Qual era o nome da esposa de Abraão?",
        opcoes: ["Rebeca", "Raquel", "Sara", "Lia"],
        resposta: 2
    },
    {
        pergunta: "Qual foi o primeiro livro da Bíblia a ser escrito?",
        opcoes: ["Gênesis", "Jó", "Êxodo", "Salmos"],
        resposta: 1
    },
    {
        pergunta: "Quem escreveu a maior parte dos Salmos?",
        opcoes: ["Salomão", "Moisés", "Davi", "Asafe"],
        resposta: 2
    },
    {
        pergunta: "Qual discípulo é conhecido como 'o discípulo amado'?",
        opcoes: ["Pedro", "Tiago", "João", "André"],
        resposta: 2
    }
];

// The Love And Deepspace - Médio (Ensinamentos de Jesus)
const theLoveDeepspaceMedio = [
    {
        pergunta: "Qual parábola ensina sobre a importância de perdoar os outros?",
        opcoes: ["Parábola do Semeador", "Parábola do Filho Pródigo", "Parábola do Servo Impiedoso", "Parábola do Bom Samaritano"],
        resposta: 2
    },
    {
        pergunta: "Em qual sermão Jesus disse 'Bem-aventurados os pobres de espírito'?",
        opcoes: ["Sermão da Montanha", "Sermão da Planície", "Último Sermão", "Sermão no Templo"],
        resposta: 0
    },
    {
        pergunta: "Qual ensinamento de Jesus aborda o tema 'amar ao próximo como a si mesmo'?",
        opcoes: ["Os Dez Mandamentos", "O Maior Mandamento", "As Bem-aventuranças", "A Regra de Ouro"],
        resposta: 1
    },
    {
        pergunta: "Qual parábola Jesus contou para explicar quem é o nosso 'próximo'?",
        opcoes: ["Parábola do Rico e Lázaro", "Parábola do Bom Samaritano", "Parábola das Dez Virgens", "Parábola do Filho Pródigo"],
        resposta: 1
    },
    {
        pergunta: "O que Jesus ensinou sobre o jejum no Sermão da Montanha?",
        opcoes: ["Que deve ser feito publicamente", "Que não é mais necessário", "Que deve ser feito em segredo", "Que deve ser feito apenas em grupo"],
        resposta: 2
    },
    {
        pergunta: "Qual parábola ensina sobre a vigilância e preparação para a volta de Cristo?",
        opcoes: ["Parábola do Semeador", "Parábola das Dez Virgens", "Parábola dos Talentos", "Parábola do Joio e do Trigo"],
        resposta: 1
    },
    {
        pergunta: "O que Jesus ensinou sobre o dinheiro e as riquezas?",
        opcoes: ["Que é a raiz de todos os males", "Que não se pode servir a Deus e ao dinheiro", "Que os ricos não entrarão no Reino dos Céus", "Que o dinheiro deve ser rejeitado completamente"],
        resposta: 1
    },
    {
        pergunta: "Qual ensinamento Jesus deu sobre o julgamento dos outros?",
        opcoes: ["Julgar com justiça", "Não julgar para não ser julgado", "Julgar apenas os pecadores", "Julgar apenas após oração"],
        resposta: 1
    },
    {
        pergunta: "Qual parábola ensina sobre a mordomia dos dons e talentos?",
        opcoes: ["Parábola do Semeador", "Parábola dos Trabalhadores da Vinha", "Parábola dos Talentos", "Parábola do Tesouro Escondido"],
        resposta: 2
    },
    {
        pergunta: "O que Jesus ensinou sobre a oração no Pai Nosso?",
        opcoes: ["Que deve ser longa e detalhada", "Que deve ser feita apenas no templo", "Que não deve usar vãs repetições", "Que deve ser feita apenas uma vez ao dia"],
        resposta: 2
    },
    {
        pergunta: "Qual foi o ensinamento de Jesus sobre o divórcio?",
        opcoes: ["Que é sempre permitido", "Que nunca é permitido", "Que é permitido em caso de infidelidade", "Que depende das leis locais"],
        resposta: 2
    },
    {
        pergunta: "O que Jesus ensinou sobre amar os inimigos?",
        opcoes: ["Que devemos evitá-los", "Que devemos orar por eles", "Que devemos tolerá-los", "Que devemos ignorá-los"],
        resposta: 1
    },
    {
        pergunta: "Qual parábola ensina sobre a misericórdia divina e o arrependimento?",
        opcoes: ["Parábola do Filho Pródigo", "Parábola do Bom Pastor", "Parábola do Fariseu e do Publicano", "Todas as anteriores"],
        resposta: 3
    },
    {
        pergunta: "O que Jesus ensinou sobre o caminho para a vida eterna?",
        opcoes: ["É largo e muitos o encontram", "É estreito e poucos o encontram", "É difícil mas todos o encontrarão", "É fácil para os religiosos"],
        resposta: 1
    },
    {
        pergunta: "Qual foi o ensinamento de Jesus sobre o maior no Reino dos Céus?",
        opcoes: ["O mais sábio", "O mais rico", "O que se humilha como criança", "O mais religioso"],
        resposta: 2
    }
];

// The Love And Deepspace - Difícil (Teologia e Doutrinas Cristãs)
const theLoveDeepspaceDificil = [
    {
        pergunta: "Qual doutrina cristã afirma que Deus é três pessoas em uma só essência?",
        opcoes: ["Cristologia", "Trindade", "Soteriologia", "Escatologia"],
        resposta: 1
    },
    {
        pergunta: "Qual conceito teológico se refere à obra de Cristo em favor da humanidade?",
        opcoes: ["Expiação", "Santificação", "Glorificação", "Predestinação"],
        resposta: 0
    },
    {
        pergunta: "Qual doutrina trata da inspiração divina das Escrituras?",
        opcoes: ["Revelação Geral", "Inerrância Bíblica", "Revelação Especial", "Iluminação"],
        resposta: 1
    },
    {
        pergunta: "O que significa o termo teológico 'justificação pela fé'?",
        opcoes: ["Ser declarado justo diante de Deus pela fé", "Tornar-se justo por boas obras", "Justificar a fé com ações", "Ser julgado conforme a fé"],
        resposta: 0
    },
    {
        pergunta: "Qual é o significado teológico do termo 'kenosis' relacionado a Cristo?",
        opcoes: ["A natureza divina de Cristo", "O esvaziamento voluntário de Cristo", "A ressurreição de Cristo", "A segunda vinda de Cristo"],
        resposta: 1
    },
    {
        pergunta: "Qual doutrina cristã aborda os eventos do fim dos tempos?",
        opcoes: ["Soteriologia", "Eclesiologia", "Escatologia", "Pneumatologia"],
        resposta: 2
    },
    {
        pergunta: "O que significa o termo 'imago dei' na teologia cristã?",
        opcoes: ["A imagem de Deus nos ícones", "A imagem de Cristo", "A imagem de Deus no ser humano", "A imaginação divina"],
        resposta: 2
    },
    {
        pergunta: "Qual conceito teológico se refere à obra do Espírito Santo na vida do crente?",
        opcoes: ["Justificação", "Santificação", "Glorificação", "Predestinação"],
        resposta: 1
    },
    {
        pergunta: "Qual é a doutrina que trata da eleição divina para a salvação?",
        opcoes: ["Livre-arbítrio", "Predestinação", "Universalismo", "Arminianismo"],
        resposta: 1
    },
    {
        pergunta: "O que significa o termo teológico 'pericórese'?",
        opcoes: ["A relação mútua entre as pessoas da Trindade", "A natureza humana de Cristo", "A comunhão dos santos", "A presença de Deus na criação"],
        resposta: 0
    }
];

// The Love And Deepspace - Perguntas adicionais (Curiosidades Bíblicas)
const theLoveDeepspaceExtra = [
    {
        pergunta: "Qual é o menor versículo da Bíblia?",
        opcoes: ["Jesus chorou", "Alegrai-vos sempre", "Orai sem cessar", "Deus é amor"],
        resposta: 0
    },
    {
        pergunta: "Qual livro da Bíblia não menciona o nome de Deus explicitamente?",
        opcoes: ["Rute", "Ester", "Jonas", "Tiago"],
        resposta: 1
    },
    {
        pergunta: "Qual era a altura aproximada de Golias segundo a Bíblia?",
        opcoes: ["2 metros", "3 metros", "4 metros", "5 metros"],
        resposta: 1
    },
    {
        pergunta: "Qual profeta foi levado ao céu em um redemoinho?",
        opcoes: ["Elias", "Eliseu", "Isaías", "Ezequiel"],
        resposta: 0
    },
    {
        pergunta: "Qual rei da Babilônia teve um sonho com uma estátua de diferentes metais?",
        opcoes: ["Ciro", "Nabucodonosor", "Belsazar", "Dario"],
        resposta: 1
    },
    {
        pergunta: "Qual animal Jesus usou para representar o Espírito Santo em seu batismo?",
        opcoes: ["Águia", "Cordeiro", "Pomba", "Leão"],
        resposta: 2
    },
    {
        pergunta: "Qual era o nome original de Paulo antes de sua conversão?",
        opcoes: ["Silas", "Saulo", "Simão", "Sérgio"],
        resposta: 1
    },
    {
        pergunta: "Quantos dias e noites Jesus passou no deserto sendo tentado?",
        opcoes: ["7 dias", "30 dias", "40 dias", "12 dias"],
        resposta: 2
    },
    {
        pergunta: "Qual era a profissão de Lucas, o autor do terceiro evangelho?",
        opcoes: ["Pescador", "Médico", "Cobrador de impostos", "Carpinteiro"],
        resposta: 1
    },
    {
        pergunta: "Qual foi o primeiro nome dado ao lugar onde Jacó viu a escada que chegava ao céu?",
        opcoes: ["Betel", "Peniel", "Gilgal", "Luz"],
        resposta: 3
    },
    {
        pergunta: "Qual instrumento musical Davi tocava para acalmar o rei Saul?",
        opcoes: ["Harpa", "Flauta", "Tambor", "Trombeta"],
        resposta: 0
    },
    {
        pergunta: "Qual era o nome da sogra de Moisés?",
        opcoes: ["Zípora", "Séfora", "Jetro", "Miriã"],
        resposta: 2
    },
    {
        pergunta: "Qual apóstolo era conhecido como 'Dídimo'?",
        opcoes: ["Pedro", "Tomé", "Filipe", "Bartolomeu"],
        resposta: 1
    },
    {
        pergunta: "Qual era o nome do jardim onde Jesus foi preso?",
        opcoes: ["Éden", "Getsêmani", "Gólgota", "Galiléia"],
        resposta: 1
    },
    {
        pergunta: "Qual era o nome do servo do sumo sacerdote que teve a orelha cortada e foi curado por Jesus?",
        opcoes: ["Malco", "Barrabás", "Nicodemos", "Zaqueu"],
        resposta: 0
    }
];

// Mo Dao Zu Shi - Fácil (Vida de Jesus - Fácil)
const moDaoZuShiFacil = [
    {
        pergunta: "Quem eram os pais terrenos de Jesus?",
        opcoes: ["José e Maria", "Zacarias e Isabel", "Joaquim e Ana", "Zebedeu e Salomé"],
        resposta: 0
    },
    {
        pergunta: "Qual profissão Jesus exerceu antes de iniciar seu ministério público?",
        opcoes: ["Pescador", "Carpinteiro", "Pastor", "Escriba"],
        resposta: 1
    },
    {
        pergunta: "Quem batizou Jesus no rio Jordão?",
        opcoes: ["Pedro", "Tiago", "João Batista", "André"],
        resposta: 2
    },
    {
        pergunta: "Quantos apóstolos Jesus escolheu?",
        opcoes: ["7", "10", "12", "14"],
        resposta: 2
    },
    {
        pergunta: "Qual foi o último milagre de Jesus antes de sua crucificação?",
        opcoes: ["Ressurreição de Lázaro", "Cura do servo do sumo sacerdote", "Multiplicação dos pães", "Transformação da água em vinho"],
        resposta: 1
    },
    {
        pergunta: "Quem traiu Jesus com um beijo?",
        opcoes: ["Pedro", "Tomé", "Judas Iscariotes", "João"],
        resposta: 2
    },
    {
        pergunta: "Qual governador romano autorizou a crucificação de Jesus?",
        opcoes: ["Herodes", "César", "Pôncio Pilatos", "Tibério"],
        resposta: 2
    },
    {
        pergunta: "Quantos dias Jesus permaneceu no túmulo antes de ressuscitar?",
        opcoes: ["1 dia", "2 dias", "3 dias", "7 dias"],
        resposta: 2
    },
    {
        pergunta: "Quem foi a primeira pessoa a ver Jesus ressuscitado?",
        opcoes: ["Pedro", "João", "Maria Madalena", "Tomé"],
        resposta: 2
    },
    {
        pergunta: "Qual monte Jesus subiu para dar o Sermão da Montanha?",
        opcoes: ["Monte Sinai", "Monte Carmelo", "Monte das Oliveiras", "Não especificado na Bíblia"],
        resposta: 3
    },
    {
        pergunta: "Qual discípulo duvidou da ressurreição de Jesus?",
        opcoes: ["Pedro", "Tomé", "João", "Tiago"],
        resposta: 1
    },
    {
        pergunta: "Quantos anos Jesus tinha quando foi encontrado no templo conversando com os doutores da lei?",
        opcoes: ["7 anos", "10 anos", "12 anos", "16 anos"],
        resposta: 2
    },
    {
        pergunta: "Qual era o nome do homem rico que ofereceu seu túmulo para o corpo de Jesus?",
        opcoes: ["Nicodemos", "José de Arimatéia", "Zaqueu", "Simão de Cirene"],
        resposta: 1
    },
    {
        pergunta: "Qual foi a primeira tentação que Jesus enfrentou no deserto?",
        opcoes: ["Transformar pedras em pão", "Atirar-se do pináculo do templo", "Adorar a Satanás", "Descer da cruz"],
        resposta: 0
    },
    {
        pergunta: "Qual foi o local do primeiro milagre de Jesus?",
        opcoes: ["Cafarnaum", "Jerusalém", "Caná da Galiléia", "Belém"],
        resposta: 2
    }
];

// Mo Dao Zu Shi - Médio (Vida de Jesus - Médio)
const moDaoZuShiMedio = [
    {
        pergunta: "Qual era o nome do monte onde Jesus foi transfigurado?",
        opcoes: ["Monte Tabor", "Monte Hermom", "Monte das Oliveiras", "Monte Moriá"],
        resposta: 0
    },
    {
        pergunta: "Quais profetas apareceram durante a transfiguração de Jesus?",
        opcoes: ["Isaías e Jeremias", "Elias e Eliseu", "Moisés e Elias", "Davi e Salomão"],
        resposta: 2
    },
    {
        pergunta: "Qual foi a última parábola que Jesus contou antes de sua prisão?",
        opcoes: ["Parábola dos Talentos", "Parábola das Dez Virgens", "Parábola das Ovelhas e dos Bodes", "Parábola do Filho Pródigo"],
        resposta: 2
    },
    {
        pergunta: "Qual era o nome do jardim onde Jesus orou intensamente antes de sua prisão?",
        opcoes: ["Éden", "Getsêmani", "Gólgota", "Galiléia"],
        resposta: 1
    },
    {
        pergunta: "Quem ajudou Jesus a carregar a cruz no caminho para a crucificação?",
        opcoes: ["João", "José de Arimatéia", "Simão de Cirene", "Barrabás"],
        resposta: 2
    },
    {
        pergunta: "Qual foi a acusação oficial colocada na cruz de Jesus?",
        opcoes: ["Blasfêmia", "Rei dos Judeus", "Filho de Deus", "Revolucionário"],
        resposta: 1
    },
    {
        pergunta: "Quantas palavras Jesus proferiu na cruz?",
        opcoes: ["Três", "Cinco", "Sete", "Nove"],
        resposta: 2
    },
    {
        pergunta: "Qual discípulo Jesus confiou o cuidado de sua mãe enquanto estava na cruz?",
        opcoes: ["Pedro", "Tiago", "João", "André"],
        resposta: 2
    },
    {
        pergunta: "Qual fenômeno natural ocorreu quando Jesus morreu na cruz?",
        opcoes: ["Terremoto", "Eclipse solar", "Tempestade", "Ambos A e B"],
        resposta: 3
    },
    {
        pergunta: "Por quantos dias Jesus apareceu aos discípulos após sua ressurreição?",
        opcoes: ["7 dias", "30 dias", "40 dias", "50 dias"],
        resposta: 2
    },
    {
        pergunta: "Qual foi o último mandamento de Jesus antes de sua ascensão?",
        opcoes: ["Amai-vos uns aos outros", "Ide e fazei discípulos", "Batizai em nome do Pai, do Filho e do Espírito Santo", "Esperai em Jerusalém"],
        resposta: 1
    },
    {
        pergunta: "Qual era o nome do discípulo que Jesus ressuscitou após quatro dias de morte?",
        opcoes: ["Jairo", "Lázaro", "Tabita", "Êutico"],
        resposta: 1
    },
    {
        pergunta: "Qual mulher ungiu os pés de Jesus com perfume caro e os enxugou com seus cabelos?",
        opcoes: ["Maria Madalena", "Maria de Betânia", "Maria, mãe de Jesus", "Marta"],
        resposta: 1
    },
    {
        pergunta: "Qual foi a reação de Jesus quando os vendilhões foram encontrados no templo?",
        opcoes: ["Pregou para eles", "Expulsou-os com um chicote", "Ignorou-os", "Chamou os guardas"],
        resposta: 1
    },
    {
        pergunta: "Qual foi o local onde Jesus ascendeu ao céu?",
        opcoes: ["Monte Sião", "Monte das Oliveiras", "Monte Tabor", "Monte Carmelo"],
        resposta: 1
    }
];
