document.addEventListener("DOMContentLoaded", () => {
    
    // https://stackoverflow.com/questions/33925012/how-to-pan-the-canvas

    const canvas = document.getElementById("imageCanvas");
    const context = canvas.getContext("2d");

    const mouse = {
        x: 0, y: 0,
        w: 0,
        alt: false,
        shift: false,
        ctrl: false,
        buttonRaw: 0,
        over: false,
        buttons: [1, 2, 3, 4, 5],
    }

    function mouseMove(e) {
        mouse.x = e.offsetX || e.clientX;
        mouse.y = e.offsetY || e.clientY;
        mouse.alt = e.altKey;
        mouse.shift = e.shiftKey;
        mouse.ctrl = e.ctrlKey;

        if (e.type === "mousedown") {
            e.preventDefault();
            mouse.buttonRaw |= mouse.buttons[e.which - 1];
        }
        else if (e.type === "mouseup") {
            mouse.buttonRaw &= mouse.buttons[e.which + 2];
        }
        else if (e.type === "mouseover") {
            mouse.over = true;
        }
        else if (e.type === "mousewheel") {
            e.preventDefault();
            mouse.w = e.wheelDelta;
        }
    }

    canvas.addEventListener("mousedown", mouseMove, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mouseup", mouseMove, false);
    canvas.addEventListener("mouseout", mouseMove, false);
    canvas.addEventListener("mouseover", mouseMove, false);
    canvas.addEventListener("mousewheel", mouseMove, false);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    var displayTransform = {
        x: 0, y: 0,
        ox: 0, oy: 0,
        scale: 1,
        rotate: 0,
        dx: 0, dy: 0,
        dox: 0, doy: 0,
        dscale: 1,
        drotate: 0,
        matrix: [0, 0, 0, 0, 0, 0],
        inverseMatrix: [0, 0, 0, 0, 0, 0],
        mouseX: 0,
        mouseY: 0,

        setTransform: function () {
            const m = this.matrix;
            const i = 0;
            context.setTransform(m[0], m[1], m[2], m[3], m[4], m[5], m[6]);
        },

        setHome: function() {
            context.setTransform(1, 0, 0, 1, 0, 0);
        },

        update: function () {
            // display matrix
            this.matrix[0] = Math.cos(this.rotate) * this.scale;
            this.matrix[1] = Math.sin(this.rotate) * this.scale;
            this.matrix[2] = - this.matrix[1];
            this.matrix[3] = this.matrix[0];

            // relative coords
            this.matrix[4] = - (this.x * this.matrix[0] + this.y * this.matrix[2]) + this.ox;
            this.matrix[5] = - (this.x * this.matrix[1] + this.y * this.matrix[3]) + this.oy;

            // inverse matrix
            const det = (this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2]);
            this.inverseMatrix[0] = this.matrix[3] / det;
            this.inverseMatrix[1] = this.matrix[1] / det;
            this.inverseMatrix[2] = this.matrix[2] / det;
            this.inverseMatrix[3] = this.matrix[0] / det;

            // panning
            if (mouse.oldX !== undefined && (mouse.buttonRaw & 1) === 1) {
                const mdx = mouse.x - mouse.oldX;
                const mdy = mouse.y - mouse.oldY;

                const mrx = (mdx * this.inverseMatrix[0] + mdy * this.inverseMatrix[2]);
                const mry = (mdx * this.inverseMatrix[1] + mdy * this.inverseMatrix[3]);

                this.x -= mrx;
                this.y -= mry;
            }

            // TODO: mouse wheel here, zoom

            const screenX = mouse.x - this.ox;
            const screenY = mouse.y - this.oy;

            this.mouseX = this.x + (screenX * this.inverseMatrix[0] + screenY * this.inverseMatrix[2]);
            this.mouseY = this.y + (screenX * this.inverseMatrix[1] + screenY * this.inverseMatrix[3]);

            mouse.rx = this.mouseX;
            mouse.ry = this.mouseY;

            mouse.oldX = mouse.x;
            mouse.oldY = mouse.y;
         },
    };

    var image = new Image();
    image.src = "/images/demo.jpg";

    function update() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        displayTransform.update();
        displayTransform.setHome();

        context.clearRect(0, 0, canvas.width, canvas.height);
        displayTransform.setTransform();
        if (image.complete) {
            context.drawImage(image, 0, 0);
        }

        if (mouse.buttonRaw === 4) {
            displayTransform.x = 0;
            displayTransform.y = 0;
            displayTransform.scale = 1;
            displayTransform.rotate = 0;
            displayTransform.ox = 0;
            displayTransform.oy = 0;
        }

        requestAnimationFrame(update);
    }

    update();
});