class Particle {
    constructor(x, y, h, s, l, a) {
        this.visible = true;
        this.x = this.oldX = x;
        this.y = this.oldY = y;
        this.color = { "h": h, "s": s, "l": l, "a": a };
        this.targetColor = { "h": h, "s": s, "l": l, "a": a };
        this.colorTransitionSpeed = { "h": 1, "s": 10, "l": 10, "a": 0.05 };
        this.orbitAngle = randomMap(0, Math.PI * 2);
        this.kickX = 0;
        this.kickY = 0;
        this.targetX = this.x + 1;
        this.targetY = this.y + 1;
        this.fuzzyX = 0;
        this.fuzzyY = 0;
        this.orbitRadius = randomMap(ORBIT_RADIUS_MIN, ORBIT_RADIUS_MAX);
        this.orbitSpeed = 0.01 + Math.random() * 0.04;

        this.initialOptions = JSON.parse(JSON.stringify(this));
        this.timestampCallbackPairs = [];
        this.setDefaultOptions();
    }

    setDefaultOptions() {
        this.orbitRadius = 0;
        this.targetY = -100;
        this.y = -100;
        this.oldY = -100;
        this.visible = false;
    }

    update(i) {
        this.updateOptions(i);
        this.interpolateColors(i);
        this.attract(i);
        this.integrate(i);
    }

    updateOptions(index) {
        const currentTime = Date.now();
        const toRemove = [];

        for (const pair of this.timestampCallbackPairs) {
            if (currentTime > pair.timestamp) {
                pair.callback(this);
                toRemove.push(pair);
            }
        }
        this.timestampCallbackPairs = this.timestampCallbackPairs.filter(pair => !toRemove.includes(pair));
    }

    interpolateColors(index) {
        // ['h', 's', 'l', 'a'].forEach(key => {
        //     if (this.targetColor[key] != this.color[key]) {
        //         const diff = this.targetColor[key] - this.color[key];
        //         this.color[key] += Math.sign(diff) * Math.min(this.colorTransitionSpeed[key], Math.abs(diff));
        //     }
        // });

    }

    attract(index) {

        let rdmX = 0;
        let rdmY = 0;

        if (this.fuzzyX != 0) {
            rdmX += randomMap(-this.fuzzyX, this.fuzzyX);
        }
        if (this.fuzzyY != 0) {
            rdmY += randomMap(-this.fuzzyY, this.fuzzyY);
        }

        if (this.orbitSpeed != 0 && this.orbitRadius != 0) {
            this.orbitAngle += this.orbitSpeed;
            rdmX += Math.cos(this.orbitAngle) * this.orbitRadius;
            rdmY += Math.sin(this.orbitAngle) * this.orbitRadius;
        }

        let dx = this.targetX - this.x + rdmX;
        let dy = this.targetY - this.y + rdmY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1) {
            this.x = this.targetX;
            this.y = this.targetY;
        } else {
            this.x += dx / distance;
            this.y += dy / distance;
        }
    };

    integrate(index) {
        let previousDistance2 = Math.pow(this.oldX - this.targetX, 2) + Math.pow(this.oldY - this.targetY, 2);
        let currentDistance2 = Math.pow(this.x - this.targetX, 2) + Math.pow(this.y - this.targetY, 2);
        let speed = currentDistance2 - previousDistance2; //- approche + éloigne
        speed = clamp(speed, -1, 10); //TODO à voir si on prend pas la vitesse, mais plutot la distance en tenant compte de la direction
        let damping = map(speed, 10, -1, 0.40, DAMPING);
        // if (index == 0) {
        //   debug("DAMP", "speed=" + speed + " damp=" + damping);
        // }
        let velocityX = (this.x - this.oldX) * damping;
        let velocityY = (this.y - this.oldY) * damping;

        //Kick the particle once by overriding velocity
        if (this.kickX != 0) {
            velocityX = this.kickX;
            this.kickX = 0;
        }
        if (this.kickY != 0) {
            velocityY = this.kickY;
            this.kickY = 0;
        }

        this.oldX = this.x;
        this.oldY = this.y;
        this.x += velocityX;
        this.y += velocityY;

        // if (index == 0) {
        //   debug("V", "velocityX=" + velocityX + " velocityY=" + velocityY);
        // }
    };
}