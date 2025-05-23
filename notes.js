// Gerenciador de Blocos de Notas
const NotesManager = {
    // Propriedades
    notes: [],
    currentNoteId: null,
    maxNotes: 15,
    
    // Inicializa o gerenciador de notas
    initialize: function() {
        console.log("Inicializando gerenciador de blocos de notas");
        this.loadNotes();
        this.setupEventListeners();
        this.renderNotesList();
    },
    
    // Carrega as notas do localStorage
    loadNotes: function() {
        const savedNotes = localStorage.getItem('msaude_notes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
            console.log(`${this.notes.length} blocos de notas carregados`);
        } else {
            this.notes = [];
            console.log("Nenhum bloco de notas encontrado, iniciando com lista vazia");
        }
    },
    
    // Salva as notas no localStorage
    saveNotes: function() {
        localStorage.setItem('msaude_notes', JSON.stringify(this.notes));
        console.log(`${this.notes.length} blocos de notas salvos no localStorage`);
    },
    
    // Configura os event listeners
    setupEventListeners: function() {
        // Botão para criar nova nota
        document.getElementById('createNoteBtn').addEventListener('click', () => {
            this.createNewNote();
        });
        
        // Botão para salvar nota
        document.getElementById('saveNoteBtn').addEventListener('click', () => {
            this.saveCurrentNote();
        });
        
        // Botões de cores
        const colorButtons = document.querySelectorAll('.note-color-picker .color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const color = e.target.getAttribute('data-color');
                this.setNoteColor(color);
            });
        });
    },
    
    // Renderiza a lista de notas na sidebar
    renderNotesList: function() {
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        
        if (this.notes.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-notes-message';
            emptyMessage.textContent = 'Nenhum bloco de notas criado';
            notesList.appendChild(emptyMessage);
            return;
        }
        
        this.notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = `note-item ${note.color || ''}`;
            noteItem.dataset.id = note.id;
            
            if (note.id === this.currentNoteId) {
                noteItem.classList.add('active');
            }
            
            const noteTitle = document.createElement('div');
            noteTitle.className = 'note-item-title';
            noteTitle.textContent = note.title || 'Sem título';
            
            const noteActions = document.createElement('div');
            noteActions.className = 'note-item-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-note-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Excluir bloco de notas';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteNote(note.id);
            });
            
            noteActions.appendChild(deleteBtn);
            noteItem.appendChild(noteTitle);
            noteItem.appendChild(noteActions);
            
            noteItem.addEventListener('click', () => {
                this.openNote(note.id);
            });
            
            notesList.appendChild(noteItem);
        });
    },
    
    // Cria um novo bloco de notas
    createNewNote: function() {
        if (this.notes.length >= this.maxNotes) {
            showConfirmModal(
                'Limite Atingido',
                `Você atingiu o limite máximo de ${this.maxNotes} blocos de notas.`,
                () => {}
            );
            return;
        }
        
        const newNote = {
            id: Date.now().toString(),
            title: 'Novo bloco de notas',
            content: '',
            color: 'default',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.notes.push(newNote);
        this.saveNotes();
        this.openNote(newNote.id);
        this.renderNotesList();
    },
    
    // Abre um bloco de notas para edição
    openNote: function(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        this.currentNoteId = noteId;
        
        // Atualiza a interface
        document.getElementById('emptyNoteState').style.display = 'none';
        document.getElementById('noteEditor').style.display = 'block';
        
        // Preenche os campos
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        
        // Atualiza a seleção de cor
        this.updateColorSelection(note.color || 'default');
        
        // Atualiza a lista para destacar a nota atual
        this.renderNotesList();
    },
    
    // Salva a nota atual
    saveCurrentNote: function() {
        if (!this.currentNoteId) return;
        
        const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
        if (noteIndex === -1) return;
        
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value;
        
        this.notes[noteIndex].title = title || 'Sem título';
        this.notes[noteIndex].content = content;
        this.notes[noteIndex].updatedAt = new Date().toISOString();
        
        this.saveNotes();
        this.renderNotesList();
        
        // Feedback visual
        const saveBtn = document.getElementById('saveNoteBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Salvo!';
        saveBtn.classList.add('saved');
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.classList.remove('saved');
        }, 1500);
    },
    
    // Exclui um bloco de notas
    deleteNote: function(noteId) {
        showConfirmModal(
            'Excluir Bloco de Notas',
            'Tem certeza que deseja excluir este bloco de notas?',
            () => {
                this.notes = this.notes.filter(note => note.id !== noteId);
                this.saveNotes();
                
                // Se a nota atual foi excluída, limpa a área de edição
                if (this.currentNoteId === noteId) {
                    this.currentNoteId = null;
                    document.getElementById('noteEditor').style.display = 'none';
                    document.getElementById('emptyNoteState').style.display = 'flex';
                }
                
                this.renderNotesList();
                
                // Se ainda houver notas, abre a primeira
                if (this.notes.length > 0 && !this.currentNoteId) {
                    this.openNote(this.notes[0].id);
                }
            }
        );
    },
    
    // Define a cor da nota atual
    setNoteColor: function(color) {
        if (!this.currentNoteId) return;
        
        const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
        if (noteIndex === -1) return;
        
        this.notes[noteIndex].color = color;
        this.saveNotes();
        this.updateColorSelection(color);
        this.renderNotesList();
    },
    
    // Atualiza a seleção visual de cor
    updateColorSelection: function(color) {
        const colorButtons = document.querySelectorAll('.note-color-picker .color-btn');
        colorButtons.forEach(button => {
            button.classList.remove('selected');
            if (button.getAttribute('data-color') === color) {
                button.classList.add('selected');
            }
        });
    }
};

// Gerenciador de Leituras
const ReadingsManager = {
    // Propriedades
    readings: [],
    currentReadingId: null,
    
    // Inicializa o gerenciador de leituras
    initialize: function() {
        console.log("Inicializando gerenciador de leituras");
        this.loadReadings();
        this.setupEventListeners();
        this.renderReadingsList();
    },
    
    // Carrega as leituras do localStorage
    loadReadings: function() {
        const savedReadings = localStorage.getItem('msaude_readings');
        if (savedReadings) {
            this.readings = JSON.parse(savedReadings);
            console.log(`${this.readings.length} leituras carregadas`);
        } else {
            this.readings = [];
            console.log("Nenhuma leitura encontrada, iniciando com lista vazia");
        }
    },
    
    // Salva as leituras no localStorage
    saveReadings: function() {
        localStorage.setItem('msaude_readings', JSON.stringify(this.readings));
        console.log(`${this.readings.length} leituras salvas no localStorage`);
    },
    
    // Configura os event listeners
    setupEventListeners: function() {
        // Botão para criar nova leitura
        document.getElementById('createReadingBtn').addEventListener('click', () => {
            this.createNewReading();
        });
        
        // Botão para salvar leitura
        document.getElementById('saveReadingBtn').addEventListener('click', () => {
            this.saveCurrentReading();
        });
    },
    
    // Renderiza a lista de leituras na sidebar
    renderReadingsList: function() {
        const readingsList = document.getElementById('readingsList');
        readingsList.innerHTML = '';
        
        if (this.readings.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-readings-message';
            emptyMessage.textContent = 'Nenhuma leitura criada';
            readingsList.appendChild(emptyMessage);
            return;
        }
        
        this.readings.forEach(reading => {
            const readingItem = document.createElement('div');
            readingItem.className = 'reading-item';
            readingItem.dataset.id = reading.id;
            
            if (reading.id === this.currentReadingId) {
                readingItem.classList.add('active');
            }
            
            const readingTitle = document.createElement('div');
            readingTitle.className = 'reading-item-title';
            readingTitle.textContent = reading.title || 'Sem título';
            
            const readingActions = document.createElement('div');
            readingActions.className = 'reading-item-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-reading-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Excluir leitura';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteReading(reading.id);
            });
            
            readingActions.appendChild(deleteBtn);
            readingItem.appendChild(readingTitle);
            readingItem.appendChild(readingActions);
            
            readingItem.addEventListener('click', () => {
                this.openReading(reading.id);
            });
            
            readingsList.appendChild(readingItem);
        });
    },
    
    // Cria uma nova leitura
    createNewReading: function() {
        const newReading = {
            id: Date.now().toString(),
            title: 'Nova leitura',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.readings.push(newReading);
        this.saveReadings();
        this.openReading(newReading.id);
        this.renderReadingsList();
    },
    
    // Abre uma leitura para edição
    openReading: function(readingId) {
        const reading = this.readings.find(r => r.id === readingId);
        if (!reading) return;
        
        this.currentReadingId = readingId;
        
        // Atualiza a interface
        document.getElementById('emptyReadingState').style.display = 'none';
        document.getElementById('readingEditor').style.display = 'block';
        
        // Preenche os campos
        document.getElementById('readingTitle').value = reading.title;
        document.getElementById('readingContent').value = reading.content;
        
        // Atualiza a lista para destacar a leitura atual
        this.renderReadingsList();
    },
    
    // Salva a leitura atual
    saveCurrentReading: function() {
        if (!this.currentReadingId) return;
        
        const readingIndex = this.readings.findIndex(r => r.id === this.currentReadingId);
        if (readingIndex === -1) return;
        
        const title = document.getElementById('readingTitle').value.trim();
        const content = document.getElementById('readingContent').value;
        
        this.readings[readingIndex].title = title || 'Sem título';
        this.readings[readingIndex].content = content;
        this.readings[readingIndex].updatedAt = new Date().toISOString();
        
        this.saveReadings();
        this.renderReadingsList();
        
        // Feedback visual
        const saveBtn = document.getElementById('saveReadingBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Salvo!';
        saveBtn.classList.add('saved');
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.classList.remove('saved');
        }, 1500);
    },
    
    // Exclui uma leitura
    deleteReading: function(readingId) {
        showConfirmModal(
            'Excluir Leitura',
            'Tem certeza que deseja excluir esta leitura?',
            () => {
                this.readings = this.readings.filter(reading => reading.id !== readingId);
                this.saveReadings();
                
                // Se a leitura atual foi excluída, limpa a área de edição
                if (this.currentReadingId === readingId) {
                    this.currentReadingId = null;
                    document.getElementById('readingEditor').style.display = 'none';
                    document.getElementById('emptyReadingState').style.display = 'flex';
                }
                
                this.renderReadingsList();
                
                // Se ainda houver leituras, abre a primeira
                if (this.readings.length > 0 && !this.currentReadingId) {
                    this.openReading(this.readings[0].id);
                }
            }
        );
    }
};

// Gerenciador de Desenho para Blocos de Notas
const DrawingManager = {
    // Propriedades
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    color: '#000000',
    lineWidth: 2,
    drawingData: {},
    
    // Inicializa o gerenciador de desenho
    initialize: function() {
        console.log("Inicializando gerenciador de desenho");
        this.loadDrawingData();
        this.setupCanvas();
        this.setupEventListeners();
        this.setupToolbar();
    },
    
    // Configura o canvas de desenho
    setupCanvas: function() {
        this.canvas = document.getElementById('drawingCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Ajusta o tamanho do canvas para preencher o container
        this.resizeCanvas();
        
        // Configura o estilo inicial
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    },
    
    // Redimensiona o canvas para se ajustar ao container
    resizeCanvas: function() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Restaura o desenho após redimensionar
        if (NotesManager.currentNoteId && this.drawingData[NotesManager.currentNoteId]) {
            this.loadDrawing();
        }
    },
    
    // Configura os event listeners para desenho
    setupEventListeners: function() {
        if (!this.canvas) return;
        
        // Event listeners para mouse
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Event listeners para touch (dispositivos móveis)
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Event listener para redimensionamento da janela
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    },
    
    // Configura a barra de ferramentas de desenho
    setupToolbar: function() {
        const colorPicker = document.getElementById('drawingColorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('change', (e) => {
                this.color = e.target.value;
                this.ctx.strokeStyle = this.color;
            });
        }
        
        const lineWidthPicker = document.getElementById('drawingLineWidth');
        if (lineWidthPicker) {
            lineWidthPicker.addEventListener('change', (e) => {
                this.lineWidth = e.target.value;
                this.ctx.lineWidth = this.lineWidth;
            });
        }
        
        const clearBtn = document.getElementById('clearDrawingBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCanvas();
            });
        }
        
        const toggleBtn = document.getElementById('toggleDrawingModeBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleDrawingMode();
            });
        }
    },
    
    // Inicia o desenho
    startDrawing: function(e) {
        this.isDrawing = true;
        
        // Captura as coordenadas iniciais
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    },
    
    // Desenha conforme o movimento do mouse
    draw: function(e) {
        if (!this.isDrawing) return;
        
        // Previne scroll em dispositivos móveis
        e.preventDefault();
        
        // Captura as coordenadas atuais
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // Desenha a linha
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        
        // Atualiza as coordenadas
        this.lastX = currentX;
        this.lastY = currentY;
    },
    
    // Manipula eventos de toque para dispositivos móveis
    handleTouch: function(e) {
        e.preventDefault();
        
        if (e.type === 'touchstart') {
            this.isDrawing = true;
            
            // Captura as coordenadas iniciais
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.lastX = touch.clientX - rect.left;
            this.lastY = touch.clientY - rect.top;
        } else if (e.type === 'touchmove' && this.isDrawing) {
            // Captura as coordenadas atuais
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;
            
            // Desenha a linha
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();
            
            // Atualiza as coordenadas
            this.lastX = currentX;
            this.lastY = currentY;
        }
    },
    
    // Para o desenho
    stopDrawing: function() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveDrawing();
        }
    },
    
    // Limpa o canvas
    clearCanvas: function() {
        if (!this.canvas || !this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Remove o desenho salvo
        if (NotesManager.currentNoteId) {
            delete this.drawingData[NotesManager.currentNoteId];
            this.saveDrawingData();
        }
    },
    
    // Alterna entre modo de desenho e texto
    toggleDrawingMode: function() {
        const drawingContainer = document.getElementById('drawingContainer');
        const textContainer = document.getElementById('textContainer');
        const toggleBtn = document.getElementById('toggleDrawingModeBtn');
        
        if (drawingContainer.style.display === 'none') {
            // Muda para modo de desenho
            drawingContainer.style.display = 'block';
            textContainer.style.display = 'none';
            toggleBtn.textContent = 'Modo Texto';
            toggleBtn.classList.add('drawing-mode');
            this.resizeCanvas();
        } else {
            // Muda para modo de texto
            drawingContainer.style.display = 'none';
            textContainer.style.display = 'block';
            toggleBtn.textContent = 'Modo Desenho';
            toggleBtn.classList.remove('drawing-mode');
        }
    },
    
    // Salva o desenho atual
    saveDrawing: function() {
        if (!this.canvas || !NotesManager.currentNoteId) return;
        
        // Salva o desenho como uma imagem base64
        const imageData = this.canvas.toDataURL('image/png');
        this.drawingData[NotesManager.currentNoteId] = imageData;
        this.saveDrawingData();
    },
    
    // Carrega o desenho salvo
    loadDrawing: function() {
        if (!this.canvas || !this.ctx || !NotesManager.currentNoteId) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Carrega o desenho salvo
        const imageData = this.drawingData[NotesManager.currentNoteId];
        if (imageData) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = imageData;
        }
    },
    
    // Salva os dados de desenho no localStorage
    saveDrawingData: function() {
        localStorage.setItem('msaude_drawings', JSON.stringify(this.drawingData));
    },
    
    // Carrega os dados de desenho do localStorage
    loadDrawingData: function() {
        const savedData = localStorage.getItem('msaude_drawings');
        if (savedData) {
            this.drawingData = JSON.parse(savedData);
        }
    },
    
    // Prepara o canvas para uma nova nota
    prepareForNote: function(noteId) {
        if (!this.canvas || !this.ctx) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Carrega o desenho da nota atual, se existir
        if (this.drawingData[noteId]) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = this.drawingData[noteId];
        }
    }
};

// Modal de confirmação personalizado
function showConfirmModal(title, message, onConfirm) {
    // Cria o elemento do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.textContent = message;
    
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal-btn cancel-btn';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'modal-btn confirm-btn';
    confirmBtn.textContent = 'Confirmar';
    confirmBtn.addEventListener('click', () => {
        onConfirm();
        document.body.removeChild(modalOverlay);
    });
    
    modalFooter.appendChild(cancelBtn);
    modalFooter.appendChild(confirmBtn);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    
    modalOverlay.appendChild(modalContent);
    
    document.body.appendChild(modalOverlay);
}

// Inicializa os gerenciadores quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o gerenciador de abas
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTabId = tab.getAttribute('data-tab');
            
            // Remove a classe active de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adiciona a classe active à aba clicada
            tab.classList.add('active');
            
            // Esconde todos os painéis de abas
            tabPanes.forEach(pane => {
                pane.style.display = 'none';
            });
            
            // Mostra o painel da aba clicada
            document.getElementById(targetTabId).style.display = 'block';
        });
    });
    
    // Inicializa os gerenciadores
    NotesManager.initialize();
    ReadingsManager.initialize();
    
    // Inicializa o gerenciador de desenho após o DOM estar carregado
    setTimeout(() => {
        DrawingManager.initialize();
    }, 100);
});
