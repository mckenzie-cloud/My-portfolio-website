class Boid {
    constructor(posX, posY) {
        this.acc = createVector(0.0, 0.0);
        this.vel = p5.Vector.random2D();
        this.pos = createVector(posX, posY);

        // tunable parameters.
        this.r = 2.0;
        this.maxSpeed = 2.5;
        this.maxForce = 0.07;
        this.desiredSeperation = 25.0;
        this.neighbordistance = 50.0;
        this.avoidingFactor = 1.5;
        this.matchingFactor = 1.0;
        this.centeringFactor = 1.0;

        // triangle points
        this.vert = [[0, -this.r*2], [-this.r, this.r*2], [this.r, this.r*2]];

        // generate random color for each boid.
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const min = 0;
        const max = 255;
        const r = Math.floor((Math.random() * max) + min);
        const g = Math.floor((Math.random() * max) + min);
        const b = Math.floor((Math.random() * max) + min);
        return [r, g, b];
    }

    runBoids(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force) {
        this.acc.add(force);
    }

    flock(boids) {
        let sep = this.seperate(boids);
        let ali = this.align(boids);   
        let coh = this.cohesion(boids);

        sep.mult(this.avoidingFactor);
        ali.mult(this.matchingFactor);
        coh.mult(this.centeringFactor);

        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    update() {
        // update velocity.
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0.0);
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        // scale to maximum speed.
        desired.normalize();
        desired.mult(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    render() {
        let angleRotation = this.vel.heading() + radians(90.0);
        fill(this.color[0], this.color[1], this.color[2]);
        strokeWeight(1);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(angleRotation);
        triangle(this.vert[0][0], this.vert[0][1], this.vert[1][0], this.vert[1][1], this.vert[2][0], this.vert[2][1]);
        pop();
    }

    borders() {
        if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.y < -this.r) this.pos.y = height + this.r;
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
    }

    // seperation
    seperate(boids) {
        let steer = createVector(0, 0);
        let count = 0;

        for (let otherBoid of boids) {
            let d = p5.Vector.dist(this.pos, otherBoid.pos);

            if ((d > 0) && (d < this.desiredSeperation)) {
                let diff = p5.Vector.sub(this.pos, otherBoid.pos);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }

        // Average -- divide by how many
        if (count > 0) {
            steer.div(parseFloat(count));
        }

        // As long as the vector is > 0
        if (steer.mag() > 0) {
            steer.setMag(this.maxSpeed)
            steer.sub(this.vel);
            steer.limit(this.maxForce);
        }

        return steer;
    }

    align(boids) {
        let sum = createVector(0.0, 0.0);
        let count = 0;

        for (let otherBoid of boids) {
            let d = p5.Vector.dist(this.pos, otherBoid.pos);

            if ((d > 0) && (d < this.neighbordistance)) {
                sum.add(otherBoid.vel);
                count++;
            }
        }


        if (count > 0) {
            sum.div(parseFloat(count));
            sum.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(sum, this.vel);
            steer.limit(this.maxForce);
            return steer;
        } 
        else {
            return createVector(0.0, 0.0);
        }
    }

    cohesion(boids) {
        let sum = createVector(0.0, 0.0);
        let count = 0;

        for (let otherBoid of boids) {
            let d = p5.Vector.dist(this.pos, otherBoid.pos);

            if ((d > 0) && (d < this.neighbordistance)) {
                sum.add(otherBoid.pos);
                count++
            }
        }

        if (count > 0) {
            sum.div(count);
            return this.seek(sum);      /**Steer towards the position */
        }
        else {
            return createVector(0.0, 0.0);
        }
    }
}


class Flock {
    boids = [];
    Flock() {
        this.boids = new Array();
    }

    run() {
        for (let i=0; i<this.boids.length; i++) {
            this.boids[i].runBoids(this.boids);
        }
    }

    addBoid(boid) {
        this.boids.push(boid);
    }

    removeBoid() {
        this.boids.splice(0, this.boids.length);
    }

    get boidLength() { return this.boids.length }
}


let flock;
let w;
let h;
let numberOfBoids = 50;     // if the user is on mobile, render 50 boids.


if (window.screen.width > 480) {
    numberOfBoids = 100;    // if the user is on desktop, render 100 boids.
}


// We only need to load p5.js on a specific page to prevent error.
if (location.href.includes('/other/flocking-simulation')) {

    function setup() {
        w = document.getElementById('mainCanvas').offsetWidth;
        h = 360;
        var canvas = createCanvas(w, h);
        canvas.parent('mainCanvas');
        flock = new Flock();
        resetSketch();
    }
    
    function resetSketch() {
        for (let i=0; i<numberOfBoids; i++) {
            flock.addBoid(new Boid(width/2, height/2));
        }
    }
    
    function draw() {
        background(232);
        flock.run();
    }
    
    // redraw all the boids
    function Restart() {
        clear();
        flock.removeBoid();
        resetSketch();
    }
    
    function windowResized() {
        const newWidth = document.getElementById('mainCanvas').offsetWidth;
        resizeCanvas(newWidth, h);
    }
}
