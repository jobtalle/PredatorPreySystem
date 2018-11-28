const TileRenderer = function(width, height, radius, colorLow, colorHigh) {
    const _images = [];

    let _massMin = Number.MAX_SAFE_INTEGER;
    let _massMax = 0;

    const makeCanvas = (width, height) => {
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        return canvas;
    };

    const addAlpha = (color, alpha) => {
        const hex = alpha.toString(16);
        const channel = hex.length === 1?"0" + hex:hex;

        return color + channel;
    };

    const drawCell = (context, color) => {
        context.fillStyle = color;

        context.beginPath();
        context.moveTo(width * 0.25, 0);
        context.lineTo(width * 0.75, 0);
        context.lineTo(width, height * 0.5);
        context.lineTo(width * 0.75, height);
        context.lineTo(width * 0.25, height);
        context.lineTo(0, height * 0.5);
        context.fill();
    };

    const makeImages = () => {
        for (let i = 0; i < TileRenderer.GRADIENT_STEPS; ++i) {
            const image = makeCanvas(width, height);
            const context = image.getContext("2d");

            drawCell(context, colorLow);
            drawCell(context, addAlpha(colorHigh, Math.round(255 * (i / TileRenderer.GRADIENT_STEPS))));

            _images.push(image);
        }
    };

    const sample = mass => {
        if (mass < _massMin)
            _massMin = mass;
        else if (mass > _massMax)
            _massMax = mass;

        const index = Math.round((TileRenderer.GRADIENT_STEPS - 1) * (mass - _massMin) / (_massMax - _massMin));

        if (index)
            return _images[index];

        return _images[0];
    };

    this.render = (context, x, y, mass) => {
        context.drawImage(sample(mass), x, y);
    };

    makeImages();
};

TileRenderer.GRADIENT_STEPS = 18;