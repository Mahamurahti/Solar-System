import * as THREE from "three"

/**
 * Creates a moon object for a celestial body
 *
 * @author Timo Tamminiemi
 * @param name of the moon
 * @param size of the moon
 * @param texture of the moon
 * @param offset of the moon from the parent celestial body
 * @param offsetAxis offset from which axis
 * @returns {Mesh}
 */
export default function createMoon(name, size, texture, offset, offsetAxis) {
    const textureLoader = new THREE.TextureLoader()

    const moonGeometry = new THREE.SphereGeometry(size, 64,64)
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture),
    })
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
    moonMesh.name = name

    if (offsetAxis === "x") moonMesh.position.x = offset
    if (offsetAxis === "z") moonMesh.position.z = offset

    moonMesh.receiveShadow = true
    moonMesh.castShadow = true

    return moonMesh
}