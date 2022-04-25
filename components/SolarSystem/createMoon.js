import * as THREE from 'three'

/**
 * Creates moon
 * @param moon parametres given
 * @returns {Mesh}
 */
export default function createMoon(moon) {
    let moonMesh
    const textureLoader = new THREE.TextureLoader()
    const moonGeometry = new THREE.SphereGeometry(moon.size, 30,30)
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(moon.texture),
    })
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
    moonMesh.name = moon.name
    moonMesh.position.x = 10

    return moonMesh
}