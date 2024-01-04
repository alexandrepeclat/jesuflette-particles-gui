class ParticleGroup {

    constructor() {
        this.particles = [];
    }

    initParticlesFromImage(eltImage) {
        const positions = getImagePixelPositions(eltImage, IMAGE_DENSITY);
        this.initParticlesFromPositions(positions);
    }

    initParticlesFromText(text) {
        const positions = getTextPixelPositions(text);
        this.initParticlesFromPositions(positions);
    }

    initParticlesFromPositions(positions) {
        this.particles = [];
        for (let j = 0; j < positions.length; j++) {
            this.particles.push(new Particle(positions[j].x, positions[j].y, positions[j].h, positions[j].s, positions[j].l, positions[j].a));
        }
    }

    update() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update(i);
        }
    }

    draw() {
        const tolerance = 1; //Color grouping tolerance
        const particlesByColor = new Map();

        // Group particles by color (for perfs)
        for (const particle of this.particles) {
            const { h, s, l, a } = particle.color;
            if (!particle.visible || particle.color.a == 0 || particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height)
                continue; //Skip non-visible ones
            const roundedH = Math.round(h / tolerance) * tolerance;
            const roundedS = Math.round(s / tolerance) * tolerance;
            const roundedL = Math.round(l / tolerance) * tolerance;
            const roundedA = Math.round(a / tolerance) * tolerance;
            const colorKey = `${roundedH}-${roundedS}-${roundedL}-${roundedA}`;

            if (!particlesByColor.has(colorKey)) {
                particlesByColor.set(colorKey, []);
            }
            particlesByColor.get(colorKey).push(particle);
        };

        //Set common state for everything
        ctx.lineWidth = 2;

        // Draw each color group
        for (const particlesWithSameColor of particlesByColor.values()) {
            const { h, s, l, a } = particlesWithSameColor[0].color;

            if (a == 0)
                continue; //Skip non visible ones

            //Set common state for color group
            ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
            ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
            ctx.beginPath();

            //Draw each particle
            particlesWithSameColor.forEach(particle => {

                let roundedX = Math.round(particle.x);
                let roundedY = Math.round(particle.y);
                let roundedOldX = Math.round(particle.oldX);
                let roundedOldY = Math.round(particle.oldY);

                //Don't draw stacked particles
                const positionKey = `${roundedX}-${roundedY}-${roundedOldX}-${roundedOldY}`;
                if (!drawnPositions.has(positionKey)) {
                    drawnPositions.add(positionKey);

                    let dx = Math.abs(roundedX - roundedOldX);
                    let dy = Math.abs(roundedY - roundedOldY);
                    if (dx > 1 || dy > 1) {
                        ctx.moveTo(roundedOldX, roundedOldY);
                        ctx.lineTo(roundedX, roundedY);
                    } else {
                        ctx.moveTo(roundedX, roundedY + 1);
                        ctx.lineTo(roundedX, roundedY);
                    }

                    if (dx < 4 && dy < 4) {
                        ctx.fillRect(roundedX, roundedY, 3, 3);
                    }
                }

            });
            ctx.stroke();
        };
    }
}

