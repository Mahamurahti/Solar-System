import * as THREE from 'three'

/**
 * Creates moon object for planet
 * @param moonParams parametres given
 * @returns {Mesh}
 */
export default function createMoon(moonParams) {
    let moonMesh
    const textureLoader = new THREE.TextureLoader()
    const moonGeometry = new THREE.SphereGeometry(moonParams.size, 30,30)
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(moonParams.texture),
    })
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
    moonMesh.name = moonParams.name
    const axisOffset = moonParams.offsetAxis
    if (axisOffset === 'x') {
        moonMesh.position.x = moonParams.position
    } if (axisOffset === 'z') {
        moonMesh.position.z = moonParams.position
    }

    return moonMesh
}