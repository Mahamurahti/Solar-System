import * as THREE from "three"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"

/**
 * Creates a composer, that adds "Unreal Bloom" to the scene.
 *
 * @author Eric Keränen
 * @param scene is the scene where the composing is applied
 * @param camera is the scene camera
 * @param renderer is the renderer of the scene
 * @param params are the parameters of the Unreal Bloom, params must include strength, radius and threshold
 * @returns {EffectComposer}
 */
export default function createComposer(scene, camera, renderer, params) {

    const renderScene = new RenderPass(scene, camera)

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        params.strength,
        params.radius,
        params.threshold
    )

    const bloomComposer = new EffectComposer(renderer)
    bloomComposer.setSize(window.innerWidth, window.innerHeight)
    bloomComposer.renderToScreen = true
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)

    return bloomComposer
}