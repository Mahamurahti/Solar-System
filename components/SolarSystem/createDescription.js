import * as THREE from "three";
import getDescription from "../../helpers/getDescription";

export default function generateDescription(font, target) {
    const fontMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const message = getDescription(target.name)
    const shapes = font.generateShapes(message, 4);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    const description = new THREE.Mesh(geometry, fontMaterial)
    return description
}