import * as THREE from "three"
import getDescription from "../../helpers/getDescription"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

/**
 * Creates description for celestial body.
 *
 * @author Eric Keränen
 * @param font of the description
 * @param target for which celestial body is the description for
 * @returns {Mesh}
 */
export default function createDescription(font, target) {
    const fontMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const message = getDescription(target.name)
    const shapes = font.generateShapes(message, 4)

    const geometry = new THREE.ShapeGeometry(shapes)
    geometry.computeBoundingBox()
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
    geometry.translate(xMid, 0, 0)

    const description = new THREE.Mesh(geometry, fontMaterial)

    // Make sure descriptions always renders above everything
    description.renderOrder = 999
    description.material.depthTest = false
    description.material.depthWrite = false

    // Description is transparent by default.
    description.material.transparent = true
    description.material.opacity = 0

    return description
}

export function descriptionFadeIn(scene, description) {
    scene.add(description)
    new TWEEN.Tween(description.material)
        .to({ opacity: 1 }, 1000)
        .start()
}

export function descriptionFadeOut(scene, description) {
    new TWEEN.Tween(description.material)
        .to({ opacity: 0 }, 1000)
        .onComplete(() => scene.remove(description))
        .start()
}