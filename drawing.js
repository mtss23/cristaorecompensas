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
        if (this.drawingData[NotesManager.currentNoteId]) {
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
        
        // Carrega os dados de desenho
        this.loadDrawingData();
        
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

// Estende o NotesManager para integrar com o DrawingManager
const ExtendedNotesManager = {
    // Estende o método openNote para carregar também o desenho
    originalOpenNote: NotesManager.openNote,
    openNote: function(noteId) {
        // Chama o método original
        NotesManager.originalOpenNote.call(NotesManager, noteId);
        
        // Carrega o desenho associado à nota
        DrawingManager.prepareForNote(noteId);
    },
    
    // Estende o método saveCurrentNote para salvar também o desenho
    originalSaveCurrentNote: NotesManager.saveCurrentNote,
    saveCurrentNote: function() {
        // Chama o método original
        NotesManager.originalSaveCurrentNote.call(NotesManager);
        
        // Salva o desenho atual
        DrawingManager.saveDrawing();
    },
    
    // Estende o método deleteNote para excluir também o desenho
    originalDeleteNote: NotesManager.deleteNote,
    deleteNote: function(noteId) {
        // Exibe o modal de confirmação personalizado
        showConfirmModal(
            'Excluir Bloco de Notas',
            'Tem certeza que deseja excluir este bloco de notas?',
            () => {
                // Se confirmado, exclui a nota
                NotesManager.notes = NotesManager.notes.filter(note => note.id !== noteId);
                NotesManager.saveNotes();
                
                // Exclui o desenho associado
                if (DrawingManager.drawingData[noteId]) {
                    delete DrawingManager.drawingData[noteId];
                    DrawingManager.saveDrawingData();
                }
                
                // Se a nota atual foi excluída, limpa a área de edição
                if (NotesManager.currentNoteId === noteId) {
                    NotesManager.currentNoteId = null;
                    document.getElementById('noteEditor').style.display = 'none';
                    document.getElementById('emptyNoteState').style.display = 'flex';
                }
                
                NotesManager.renderNotesList();
                
                // Se ainda houver notas, abre a primeira
                if (NotesManager.notes.length > 0 && !NotesManager.currentNoteId) {
                    NotesManager.openNote(NotesManager.notes[0].id);
                }
            }
        );
    }
};

// Estende o ReadingsManager para usar o modal personalizado
const ExtendedReadingsManager = {
    // Estende o método deleteReading para usar o modal personalizado
    originalDeleteReading: ReadingsManager.deleteReading,
    deleteReading: function(readingId) {
        // Exibe o modal de confirmação personalizado
        showConfirmModal(
            'Excluir Leitura',
            'Tem certeza que deseja excluir esta leitura?',
            () => {
                // Se confirmado, exclui a leitura
                ReadingsManager.readings = ReadingsManager.readings.filter(reading => reading.id !== readingId);
                ReadingsManager.saveReadings();
                
                // Se a leitura atual foi excluída, limpa a área de edição
                if (ReadingsManager.currentReadingId === readingId) {
                    ReadingsManager.currentReadingId = null;
                    document.getElementById('readingEditor').style.display = 'none';
                    document.getElementById('emptyReadingState').style.display = 'flex';
                }
                
                ReadingsManager.renderReadingsList();
                
                // Se ainda houver leituras, abre a primeira
                if (ReadingsManager.readings.length > 0 && !ReadingsManager.currentReadingId) {
                    ReadingsManager.openReading(ReadingsManager.readings[0].id);
                }
            }
        );
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

// Inicializa os gerenciadores estendidos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Substitui os métodos originais pelos estendidos
    NotesManager.openNote = ExtendedNotesManager.openNote;
    NotesManager.saveCurrentNote = ExtendedNotesManager.saveCurrentNote;
    NotesManager.deleteNote = ExtendedNotesManager.deleteNote;
    
    ReadingsManager.deleteReading = ExtendedReadingsManager.deleteReading;
    
    // Inicializa o gerenciador de desenho após o DOM estar carregado
    setTimeout(() => {
        DrawingManager.initialize();
    }, 500);
});
