function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function map(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

function randomMap(min, max) {
    return map(Math.random(), 0, 1, min, max);
}

function randomizeAngle(initialAngle, maxChange) {
    const change = (Math.random() * 2 - 1) * maxChange;   // Génère un nombre aléatoire entre -maxChange et maxChange
    let newAngle = initialAngle + change;   // Nouvelle valeur d'angle
    newAngle = (newAngle + 2 * Math.PI) % (2 * Math.PI);   // Limite la nouvelle valeur dans la plage de 0 à 2 * Math.PI (360 degrés)
    return newAngle;
}

function shuffle(array) {
    const shuffledArray = array.slice(); // Crée une copie du tableau pour ne pas modifier l'original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function calculateCenterOfTransform(_transform) {
    return calculateCenterOfGravity([_transform.topLeft, _transform.topRight, _transform.bottomLeft, _transform.bottomRight]);
}


function calculateCenterOfGravity(particles) {
    let totalX = 0;
    let totalY = 0;

    particles.forEach(particle => {
        totalX += particle.x;
        totalY += particle.y;
    });

    const centerOfGravity = {
        x: totalX / particles.length,
        y: totalY / particles.length,
    };
    return centerOfGravity;
}

var lastDebugTime = [];
const debugDelay = 100;
function debug(key, value) {
    if (lastDebugTime[key] === undefined || Date.now() - lastDebugTime[key] > debugDelay) {
        lastDebugTime[key] = Date.now();
        console.debug(key + "=" + value);
    }
}


function getTextPixelPositions(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '80px Arial'; // Définissez ici la police et la taille souhaitées

    const metrics = ctx.measureText(text);
    canvas.width = metrics.width;
    canvas.height = metrics.actualBoundingBoxAscent; // Utilisation de la hauteur réelle du texte

    ctx.font = '80px Arial'; // Redéfinition pour assurer la bonne taille
    ctx.fillText(text, 0, metrics.actualBoundingBoxAscent); // Dessine le texte à la hauteur correcte

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const positions = [];

    for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3];
        if (alpha > 0) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor(i / 4 / canvas.width);
            positions.push({ x, y });
        }
    }

    return positions.map(({ x, y }) => ({ x, y }));
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Nuance de gris, aucune saturation
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function getImagePixelPositions(eltImage, particleDensity) {
    const positions = [];

    try {
        const image = eltImage;
        const canvas = document.getElementById('debug');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let y = 0; y < canvas.height; y += particleDensity) {
            for (let x = 0; x < canvas.width; x += particleDensity) {
                const red = pixelData[(y * canvas.width + x) * 4];
                const green = pixelData[(y * canvas.width + x) * 4 + 1];
                const blue = pixelData[(y * canvas.width + x) * 4 + 2];
                const alpha = pixelData[(y * canvas.width + x) * 4 + 3];
                const hslValues = rgbToHsl(red, green, blue);

                if (/*(red < 255 || green < 255 || blue < 255) &&*/ (red > 0 || green > 0 || blue > 0) && alpha > 0) {
                    const relativeX = x - centerX;
                    const relativeY = y - centerY;
                    positions.push({ x: relativeX, y: relativeY, h: hslValues.h, s: hslValues.s, l: hslValues.l, a: alpha });
                }
            }
        }

        return positions;
    } catch (error) {
        throw new Error(`Erreur lors du chargement de l'image ${eltImage} : ${error}`);
    }
}