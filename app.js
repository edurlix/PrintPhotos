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
                            // Crear canvas para redimensionar a 1.77x1.38 pulgadas (531x414px a 300dpi)
                            const canvas = document.createElement('canvas');
                            canvas.width = 414;  // 1.77in * 300dpi
                            canvas.height = 531;  // 1.38in * 300dpi
                            const ctx = canvas.getContext('2d');
                            
                            // Calcular dimensiones para mantener relación de aspecto 1.77:1.38
                            const targetRatio = 1.77 / 1.38;
                            const sourceRatio = img.width / img.height;
                            
                            let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
                            
                            if (sourceRatio > targetRatio) {
                                // La imagen es más ancha que el objetivo
                                sourceHeight = img.height;
                                sourceWidth = img.height * targetRatio;
                                sourceX = (img.width - sourceWidth) / 2;
                            } else {
                                // La imagen es más alta que el objetivo
                                sourceWidth = img.width;
                                sourceHeight = img.width / targetRatio;
                                sourceY = (img.height - sourceHeight) / 2;
                            }
                            
                            // Dibujar imagen recortada y redimensionada
                            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 531, 414);
                            
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
                
                // Crear las 6 fotos para imprimir
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