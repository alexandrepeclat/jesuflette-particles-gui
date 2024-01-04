var currentSymbol = 0;

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('keyup', onKeyUp);
}, false);


function onMousemove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function setOptionsDelayed(particle, callback, delay = 0) {
    let timestamp = Date.now() + delay;
    particle.timestampCallbackPairs.push({ timestamp, callback });
}

function clearOptionsDelayed(particle) {
    particle.timestampCallbackPairs.splice(0, particle.timestampCallbackPairs.length)
}

function onKeyUp(e) {
    let mouseX = mouse.x;
    let mouseY = mouse.y;
    console.debug("mouse at: " + mouseX + " " + mouseY);
    let symbol = symbols[currentSymbol];
    let sortedParticles = symbol.particles;
    let shuffledParticles = shuffle(symbol.particles);
    console.debug("key " + event.key);
    if (event.key == '1') {
        currentSymbol = 0;
    } else if (event.key == '2') {
        currentSymbol = 1;
    } else if (event.key == '3') {
        currentSymbol = 2;
    } else if (event.key == '4') {
        currentSymbol = 3;
    } else if (event.key == 'a') {
        transform.topLeft.x = mouseX;
        transform.topLeft.y = mouseY;
        updateBookTransform("topLeft");
    } else if (event.key == 's') {
        transform.topRight.x = mouseX;
        transform.topRight.y = mouseY;
        updateBookTransform("topRight");
    } else if (event.key == 'y') {
        transform.bottomLeft.x = mouseX;
        transform.bottomLeft.y = mouseY;
        updateBookTransform("bottomLeft");
    } else if (event.key == 'x') {
        transform.bottomRight.x = mouseX;
        transform.bottomRight.y = mouseY;
        updateBookTransform("bottomRight");
    } else if (event.key == 'k') {
        symbol.processToState(STATE_INIT);
    } else if (event.key == 'q') {
        symbol.processToState(STATE_HIDDEN);
    } else if (event.key == 'w') {
        symbol.processToState(STATE_LOCKED);
    } else if (event.key == 'e') {
        symbol.processToState(STATE_DISCOVERED);
    } else if (event.key == 'r') {
        symbol.processToState(STATE_RESOLVED);
    } else if (event.key == 'c') {
        clearLogs();
    } else if (event.key == 'i') {
        for(let i = 0; i < symbols.length; i++) {
            symbols[i].processToState(STATE_INIT);
        }
    } else if (event.key == 'h') {
        for(let i = 0; i < symbols.length; i++) {
            symbols[i].processToState(STATE_HIDDEN);
        }
    }
    // } else if (event.key == 'z') {
    //     updateLogs("Zap !");
    //     for (var i = 0; i < sortedParticles.length; i++) {
    //         let delay = map(i, 0, sortedParticles.length, 0, 2000);
    //         setOptionsDelayed(sortedParticles[i], (particle) => {
    //             particle.x += 4;
    //         }, delay);
    //     }
    //     for (var i = 0; i < sortedParticles.length; i++) {
    //         let delay = map(i, 0, sortedParticles.length, 200, 2200);
    //         setOptionsDelayed(sortedParticles[i], (particle) => {
    //             particle.x -= 4;
    //         }, delay);
    //     }
    // } else if (event.key == 'm') {
    //     updateLogs("Move relative at " + "[" + mouseX + "," + mouseY + "]");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         let delay = map(i, 0, shuffledParticles.length, 0, 1000);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.targetX = particle.initialOptions.targetX + mouseX;
    //             particle.targetY = particle.initialOptions.targetY + mouseY;
    //         }, delay);
    //     }
    // } else if (event.key == 'n') {
    //     updateLogs("Move absolute at " + "[" + mouseX + "," + mouseY + "]");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         let delay = map(i, 0, shuffledParticles.length, 0, 3000);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.targetX = mouseX;
    //             particle.targetY = mouseY;
    //         }, delay);
    //     }
    // }
    // else if (event.key == 'x') {
    //     updateLogs("Explode");
    //     let center = symbol.calculateCenterOfGravity(shuffledParticles);
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         let delay = map(i, 0, shuffledParticles.length, 0, 1000); //TODO fonctions pour récupérer les particules dans différents ordres (selon éloignement, 1 sur 2, aléatoire...)
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             let relativeX = particle.x - center.x;
    //             let relativeY = particle.y - center.y;
    //             let angle = Math.atan2(relativeY, relativeX);
    //             let randomAngle = angle + randomMap(-Math.PI / 6, +Math.PI / 6);
    //             let randomRadius = randomMap(0, 50);
    //             particle.kickX = Math.cos(randomAngle) * randomRadius;
    //             particle.kickY = Math.sin(randomAngle) * randomRadius;
    //             particle.targetColor.l = 90;
    //         }, delay);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.targetX = mouseX;
    //             particle.targetY = mouseY;
    //         }, delay + 300);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.targetColor.l = particle.initialOptions.color.l;
    //         }, delay + 2000);
    //     }
    // } else if (event.key == 'o') {
    //     updateLogs("Orbit ON");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         let delay = map(i, 0, shuffledParticles.length, 0, 3000);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.orbitRadius = particle.initialOptions.orbitRadius;
    //         }, delay);
    //     }
    // } else if (event.key == 'p') {
    //     updateLogs("Orbit OFF");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         let delay = map(i, 0, shuffledParticles.length, 0, 1000);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.orbitRadius = 0;
    //         }, delay);
    //     }
    // } else if (event.key == 'f') {
    //     updateLogs("Increase fuzzyness");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.fuzzyX += 1;
    //             //particle.fuzzyY += 1;
    //         }, 0);
    //     }
    // } else if (event.key == 'g') {
    //     updateLogs("Decrease fuzzyness");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.fuzzyX = Math.max(particle.fuzzyX - 1, 0);
    //             particle.fuzzyY = Math.max(particle.fuzzyX - 1, 0);
    //         }, 0);
    //     }
    // } else if (event.key == 's') {
    //     updateLogs("Sides landing");
    //     for (var i = 0; i < shuffledParticles.length; i++) {
    //         let delay = map(i, 0, shuffledParticles.length, 0, 1000);
    //         setOptionsDelayed(shuffledParticles[i], (particle) => {
    //             particle.x = Math.random() > 0.5 ? randomMap(3000, 2000) : randomMap(-100, -200);
    //             particle.y = particle.targetY;
    //         }, 0);
    //     }
    // }

}