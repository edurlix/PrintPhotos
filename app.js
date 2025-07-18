document.addEventListener('DOMContentLoaded', function() {
            const photoUpload = document.getElementById('photoUpload');
            const clearAllBtn = document.getElementById('clearAll');
            const printTemplateBtn = document.getElementById('printTemplate');
            const previewSection = document.getElementById('previewSection');
            const printPhotos = document.getElementById('printPhotos');
            
            let currentPhotos = Array(6).fill(null);
            
            // Manejar arrastrar y soltar
            const uploadSection = document.querySelector('.upload-section');
            uploadSection.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadSection.style.borderColor = '#FFCC00';
                uploadSection.style.backgroundColor = '#B13BFF';
            });
            
            uploadSection.addEventListener('dragleave', () => {
                uploadSection.style.borderColor = '#B13BFF';
                uploadSection.style.backgroundColor = '#471396';
            });
            
            uploadSection.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadSection.style.borderColor = '#B13BFF';
                uploadSection.style.backgroundColor = '#471396';
                
                if (e.dataTransfer.files.length) {
                    photoUpload.files = e.dataTransfer.files;
                    handleFileUpload();
                }
            });
            
            // Subir foto
            photoUpload.addEventListener('change', handleFileUpload);
            
            function handleFileUpload() {
                if (photoUpload.files && photoUpload.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        // Crear imagen para redimensionar
                        const img = new Image();
                        img.onload = function() {
                            // Crear canvas para redimensionar a 2x2 pulgadas (600x600px a 300dpi)
                            const canvas = document.createElement('canvas');
                            canvas.width = 600;
                            canvas.height = 600;
                            const ctx = canvas.getContext('2d');
                            
                            // Calcular dimensiones para mantener relación de aspecto
                            let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
                            
                            // Ajustar para recorte cuadrado
                            if (img.width > img.height) {
                                sourceX = (img.width - img.height) / 2;
                                sourceWidth = img.height;
                            } else {
                                sourceY = (img.height - img.width) / 2;
                                sourceHeight = img.width;
                            }
                            
                            // Dibujar imagen recortada y redimensionada
                            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 600, 600);
                            
                            const resizedImage = canvas.toDataURL('image/jpeg');
                            
                            // Aplicar a las 6 fotos
                            currentPhotos = Array(6).fill(resizedImage);
                            updatePreview();
                        };
                        img.src = event.target.result;
                    };
                    
                    reader.readAsDataURL(photoUpload.files[0]);
                }
            }
            
            // Limpiar todo
            clearAllBtn.addEventListener('click', function() {
                currentPhotos = Array(6).fill(null);
                updatePreview();
                updatePrintTemplate();
            });
            
            // Imprimir plantilla
            printTemplateBtn.addEventListener('click', function() {
                updatePrintTemplate();
                setTimeout(() => {
                    window.print();
                }, 100);
            });
            
            // Actualizar previsualización
            function updatePreview() {
                previewSection.innerHTML = '';
                
                // Crear 6 slots (usados o vacíos)
                for (let i = 0; i < 6; i++) {
                    const slot = document.createElement('div');
                    slot.className = 'photo-slot';
                    
                    if (currentPhotos[i]) {
                        const img = document.createElement('img');
                        img.src = currentPhotos[i];
                        slot.appendChild(img);
                    } else {
                        slot.textContent = `Slot ${i+1} vacío`;
                        slot.style.color = '#B13BFF';
                        slot.style.display = 'flex';
                        slot.style.alignItems = 'center';
                        slot.style.justifyContent = 'center';
                    }
                    
                    previewSection.appendChild(slot);
                }
            }
            
            // Actualizar plantilla para imprimir
            function updatePrintTemplate() {
                printPhotos.innerHTML = '';
                
                if (currentPhotos.every(photo => photo === null)) {
                    alert('No hay fotos en la plantilla para imprimir');
                    return;
                }
                
                // Crear las 6 fotos para imprimir (3 columnas × 2 filas)
                for (let i = 0; i < 6; i++) {
                    if (currentPhotos[i]) {
                        const img = document.createElement('img');
                        img.className = 'print-photo';
                        img.src = currentPhotos[i];
                        printPhotos.appendChild(img);
                    }
                }
            }
            
            // Inicializar
            updatePreview();
        });