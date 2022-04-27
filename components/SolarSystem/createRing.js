import * as THREE from 'three'

/**
 * Creates a ring object for a celestial body
 *
 * @author Timo Tamminiemi
 * @param name of the parent celestial body
 * @param radii of the ring, must include inner radius and outer radius
 * @param texture of the ring
 * @param position of the ring
 * @returns {Mesh}
 */
export default function createRing(name, radii, texture, position) {
    const textureLoader = new THREE.TextureLoader()

    const ringGeometry = new THREE.RingGeometry(
        radii.innerRadius,
        radii.outerRadius,
        64
    )
    const ringMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture),
        side: THREE.DoubleSide
    })
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
    ringMesh.name = name + "Ring"

    ringMesh.position.x = position.x
    ringMesh.position.y = position.y
    ringMesh.position.z = position.z
    ringMesh.rotation.x = -0.5 * Math.PI
    if(name === 'Uranus') ringMesh.rotation.y = 90

    ringMesh.receiveShadow = true
    ringMesh.castShadow = true

    return ringMesh
}
