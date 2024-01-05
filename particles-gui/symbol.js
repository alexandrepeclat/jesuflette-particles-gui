class Symbol extends ParticleGroup {

    constructor(id, eltImage) {
        super();
        this.id = id;
        this.eltImage = eltImage;
        this.state = 'INIT';
        let hiddenMargin = 50;
        this.hiddenX = map(id, 0, 3, areaHidden.offsetLeft + hiddenMargin, areaHidden.offsetLeft + areaHidden.offsetWidth - hiddenMargin);
        this.hiddenY = areaHidden.offsetTop + areaHidden.offsetHeight / 2;
        this.lockedX = areaLockedDiscovered.offsetLeft + areaLockedDiscovered.offsetWidth / 2;
        this.lockedY = areaLockedDiscovered.offsetTop + areaLockedDiscovered.offsetHeight / 2;
        this.discoveredX = this.lockedX;
        this.discoveredY = this.lockedY;

        this.initParticlesFromImage(this.eltImage);
        this.sortedParticles = this.particles;
        this.shuffledParticles = shuffle(this.particles);
        console.debug(`symbol ${this.id} loaded. SortedParticlesNb=${this.sortedParticles.length} ShuffledParticlesNb=${this.shuffledParticles.length}`);

        eltImage.style.display = 'none';
    }

    draw() {
        super.draw();
    }

    processToState(newState) {
        if (this.state == newState) {
            return;
        }

        let resolvedCenter = calculateCenterOfTransform(transform);
        this.resolvedX = resolvedCenter.x;
        this.resolvedY = resolvedCenter.y;

        console.debug("Symbol: " + this.id + " goes to state: " + newState);

        if (newState == STATE_INIT) {
            for (var i = 0; i < this.sortedParticles.length; i++) {
                let particle = this.sortedParticles[i];
                particle.setDefaultOptions();
            }
            this.eltImage.style.display = "none";
            this.eltImage.classList.remove('burn-effect');
        } else if (newState == STATE_HIDDEN) {
            for (var i = 0; i < this.shuffledParticles.length; i++) {
                let delay = map(i, 0, this.shuffledParticles.length, 0, 1000);
                let index = i;
                clearOptionsDelayed(this.shuffledParticles[i]);
                setOptionsDelayed(this.shuffledParticles[i], (particle) => {
                    particle.targetX = this.hiddenX;
                    particle.targetY = this.hiddenY;
                    particle.orbitRadius = 0;
                    particle.fuzzyX = 500;
                    particle.fuzzyY = 500;
                }, delay);
                setOptionsDelayed(this.shuffledParticles[i], (particle) => {
                    particle.visible = index % 100 == 0; 
                }, delay + 1000);
            }
            this.eltImage.style.display = "none";
            this.eltImage.classList.remove('burn-effect');
        } else if (newState == STATE_LOCKED) {
            for (var i = 0; i < this.shuffledParticles.length; i++) {
                let delay = map(i, 0, this.shuffledParticles.length, 0, 1000);
                let index = i;
                clearOptionsDelayed(this.shuffledParticles[i]);
                setOptionsDelayed(this.shuffledParticles[i], (particle) => {
                    particle.visible = index % 4 == 0; 
                    particle.targetX = this.lockedX;
                    particle.targetY = this.lockedY;
                    particle.orbitRadius = particle.initialOptions.orbitRadius;
                    particle.fuzzyX = 0;
                    particle.fuzzyY = 0;
                }, delay);
            }
            this.eltImage.style.display = "none";
            this.eltImage.classList.remove('burn-effect');
        } else if (newState == STATE_DISCOVERED) {
            for (var i = 0; i < this.shuffledParticles.length; i++) {
                let delay = map(i, 0, this.shuffledParticles.length, 0, 400);
                clearOptionsDelayed(this.shuffledParticles[i]);
                setOptionsDelayed(this.shuffledParticles[i], (particle) => {
                    particle.visible = true;
                    particle.targetX = particle.initialOptions.targetX + this.lockedX;
                    particle.targetY = particle.initialOptions.targetY + this.lockedY;
                    particle.orbitRadius = 0;
                    particle.fuzzyX = 0;
                    particle.fuzzyY = 0;
                }, delay);
            }
            this.eltImage.style.display = "none";
            this.eltImage.classList.remove('burn-effect');
        } else if (newState == STATE_RESOLVED) {
            for (var i = 0; i < this.sortedParticles.length; i++) {
                let delay = map(i, 0, this.sortedParticles.length, 0, 1000);
                clearOptionsDelayed(this.sortedParticles[i]);
                setOptionsDelayed(this.sortedParticles[i], (particle) => {
                    particle.visible = true;
                    let relativeX = particle.x - this.lockedX;
                    let relativeY = particle.y - this.lockedY;
                    let angle = Math.atan2(relativeY, relativeX);
                    let randomAngle = angle + randomMap(-Math.PI / 6, +Math.PI / 6);
                    let randomRadius = randomMap(0, 200);
                    particle.orbitRadius = 0;
                    particle.fuzzyX = 0;
                    particle.fuzzyY = 0;
                    particle.kickX = Math.cos(randomAngle) * randomRadius;
                    particle.kickY = Math.sin(randomAngle) * randomRadius;
                }, delay);
                setOptionsDelayed(this.sortedParticles[i], (particle) => {
                    particle.targetX = this.resolvedX;
                    particle.targetY = this.resolvedY;
                }, delay + 300);
                setOptionsDelayed(this.sortedParticles[i], (particle) => {
                    particle.visible = false;
                }, delay + 1000);
            }
            //Make the book picture appear with some fancy effect
            this.eltImage.style.display = "block";
            this.eltImage.classList.add('burn-effect');
            this.eltImage.addEventListener('animationend', () => {
                this.eltImage.classList.remove('burn-effect');
            });
        }
        this.state = newState;
    }
}