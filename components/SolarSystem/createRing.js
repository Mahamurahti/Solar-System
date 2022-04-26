import * as THREE from 'three'

/**
 * Creates ring for celestial bodies that need it.
 * @param ring
 * @param position
 * @returns {Mesh}
 */
export default function createRing(ring, position) {
    const textureLoader = new THREE.TextureLoader()

    const ringGeometry = new THREE.RingGeometry(
        ring.innerRadius,
        ring.outerRadius,
        32
    )
    const ringMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(ring.texture),
        side: THREE.DoubleSide
    })
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
    ringMesh.position.x = position.x
    ringMesh.position.z = position.z
    ringMesh.rotation.x = -0.5 * Math.PI


    return ringMesh
}
