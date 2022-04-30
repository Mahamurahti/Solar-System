import * as THREE from "three"
import getDescription from "../../helpers/getDescription"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min"

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
    const shapes = font.generateShapes(message, 6)

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

/**
 * descriptionFadeIn fades in the description by setting the description opacity to 1 (default opacity is 0).
 * Adds the description to the scene at the start of the animation.
 * @param scene is the destination of the description
 * @param description is whats material will be faded in
 */
export function descriptionFadeIn(scene, description) {
    new TWEEN.Tween(description.material)
        .to({ opacity: 1 }, 1000)
        .onStart(() => scene.add(description))
        .start()
}

/**
 * descriptionFadeOut fades out the description by setting the description opacity to 0.
 * Removes the description from the scene at the end of the animation.
 * @param scene is the place from where the description will be removed
 * @param description is whats material will be faded out
 */
export function descriptionFadeOut(scene, description) {
    new TWEEN.Tween(description.material)
        .to({ opacity: 0 }, 1000)
        .onComplete(() => scene.remove(description))
        .start()
}