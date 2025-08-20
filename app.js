document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const photoUpload = document.getElementById('photoUpload');
    const uploadArea = document.getElementById('uploadArea');
    const imageToCrop = document.getElementById('imageToCrop');
    const applyCropBtn = document.getElementById('applyCrop');
    const addToTemplateBtn = document.getElementById('addToTemplate');
    const clearAllBtn = document.getElementById('clearAll');
    const printBtn = document.getElementById('printBtn');
    const previewGrid = document.getElementById('previewGrid');
    const cropWidthInput = document.getElementById('cropWidth');
    const cropHeightInput = document.getElementById('cropHeight');
    const sizeInfo = document.getElementById('sizeInfo');
    
    // Variables
    let cropper;
    let currentPhotos = Array(6).fill(null);
    let cropSize = { width: 1.38, height: 1.77 };
    
    // Eventos de subida de archivos
    uploadArea.addEventListener('click', () => photoUpload.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = 'rgba(177, 59, 255, 0.3)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            photoUpload.files = e.dataTransfer.files;
            handleFileUpload();
        }
    });
    
    photoUpload.addEventListener('change', handleFileUpload);
    
    // Aplicar tamaño de recorte
    applyCropBtn.addEventListener('click', applyCropSize);
    
    // Agregar a plantilla
    addToTemplateBtn.addEventListener('click', addToTemplate);
    
    // Limpiar todo
    clearAllBtn.addEventListener('click', clearAll);
    
    // Imprimir plantilla
    printBtn.addEventListener('click', printTemplate);
    
    // Actualizar información de tamaño
    cropWidthInput.addEventListener('change', updateSizeInfo);
    cropHeightInput.addEventListener('change', updateSizeInfo);
    
    // Funciones
    function handleFileUpload() {
        if (photoUpload.files && photoUpload.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                imageToCrop.src = event.target.result;
                
                // Destruir cropper existente
                if (cropper) {
                    cropper.destroy();
                }
                
                // Inicializar cropper
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: cropSize.width / cropSize.height,
                    viewMode: 1,
                    autoCropArea: 0.8,
                    responsive: true,
                    guides: true,
                    movable: true,
                    rotatable: false
                });
            };
            
            reader.readAsDataURL(photoUpload.files[0]);
        }
    }
    
    function applyCropSize() {
        cropSize = {
            width: parseFloat(cropWidthInput.value),
            height: parseFloat(cropHeightInput.value)
        };
        
        updateSizeInfo();
        
        if (cropper) {
            cropper.setAspectRatio(cropSize.width / cropSize.height);
        }
    }
    
    function updateSizeInfo() {
        sizeInfo.textContent = `${cropSize.width}" x ${cropSize.height}"`;
    }
    
    function addToTemplate() {
        if (cropper) {
            // Obtener imagen recortada
            const canvas = cropper.getCroppedCanvas({
                width: cropSize.width * 300, // 300 DPI
                height: cropSize.height * 300
            });
            
            const croppedImage = canvas.toDataURL('image/jpeg');
            
            // Aplicar a las 6 fotos
            currentPhotos = Array(6).fill(croppedImage);
            updatePreview();
        } else {
            alert('Por favor, sube una imagen primero.');
        }
    }
    
    function updatePreview() {
        const slots = previewGrid.querySelectorAll('.photo-slot');
        
        for (let i = 0; i < 6; i++) {
            slots[i].innerHTML = '';
            
            if (currentPhotos[i]) {
                const img = document.createElement('img');
                img.src = currentPhotos[i];
                slots[i].appendChild(img);
            } else {
                slots[i].textContent = i + 1;
            }
        }
    }
    
    function clearAll() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        
        imageToCrop.src = '';
        currentPhotos = Array(6).fill(null);
        updatePreview();
        
        // Restablecer inputs
        cropWidthInput.value = '1.38';
        cropHeightInput.value = '1.77';
        cropSize = { width: 1.38, height: 1.77 };
        updateSizeInfo();
    }
    
    function printTemplate() {
        if (currentPhotos.every(photo => photo === null)) {
            alert('No hay fotos en la plantilla para imprimir.');
            return;
        }
        
        // Generar la plantilla de impresión en un contenedor temporal
        const printContainer = document.createElement('div');
        printContainer.id = 'print-container';
        printContainer.style.display = 'grid';
        printContainer.style.gridTemplateColumns = 'repeat(3, 2in)';
        printContainer.style.gridTemplateRows = 'repeat(2, 2in)';
        
        currentPhotos.forEach(photoSrc => {
            const img = document.createElement('img');
            img.src = photoSrc;
            printContainer.appendChild(img);
        });

        document.body.appendChild(printContainer);
        
        // Imprimir
        window.print();
        
        // Eliminar la plantilla temporal después de la impresión
        setTimeout(() => {
            document.body.removeChild(printContainer);
        }, 1000);
    }
    
    // Inicializar
    updateSizeInfo();
    updatePreview();
});