var blockCamera = false;

export function initializeCameraController() {
    const scene = window.scene;

    var dragScale = scene.plugins.get('rexpinchplugin').add(scene);

    const camera = scene.cameras.main;

    dragScale
        .on('drag1', function (dragScale) {
            if (blockCamera) return;
            var drag1Vector = dragScale.drag1Vector;
            camera.scrollX -= drag1Vector.x / camera.zoom;
            camera.scrollY -= drag1Vector.y / camera.zoom;
        })
        .on('pinch', function (dragScale) {
            if (blockCamera) return;
            var scaleFactor = dragScale.scaleFactor;
            camera.zoom *= scaleFactor;
            checkZoomBounds(camera);
        }, scene)


    // MOUSE WHEEL
    scene.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        camera.zoom -= deltaY * 0.005;
        checkZoomBounds(camera);
    });
}

function checkZoomBounds(camera) {
    if (camera.zoom < 0.75) {
        if (blockCamera) return;
        camera.zoom = 0.75;
    }
    // max zoom = 2
    if (camera.zoom > 5) {
        if (blockCamera) return;
        camera.zoom = 5;
    }
}

export function blockCameraMovement() {
    blockCamera = true;
}

export function unblockCameraMovement() {
    blockCamera = false;
}