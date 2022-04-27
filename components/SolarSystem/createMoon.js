import * as THREE from 'three'

/**
 * Creates moon object for planet
 * @param moon parametres given
 * @returns {Mesh}
 */
export default function createMoon(moon) {
    const textureLoader = new THREE.TextureLoader()

    const moonGeometry = new THREE.SphereGeometry(moon.size, 64,64)
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(moon.texture),
    })
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
    moonMesh.name = moon.name
    const axisOffset = moon.offsetAxis
    if (axisOffset === 'x') {
        moonMesh.position.x = moon.offset
    } if (axisOffset === 'z') {
        moonMesh.position.z = moon.offset
    }

    return moonMesh
}