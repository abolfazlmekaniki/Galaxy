import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { color, log } from 'three/examples/jsm/nodes/Nodes.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */

const parameters = {}
parameters.count =10000;
parameters.size = 0.02;
parameters.radious = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomnesspow=3;
parameters.insideColor = '#ff6030';
parameters.outsideColor= '#1b3984' 

let galaxyGeometry=null;
let galaxyMaterial=null;
let galaxy=null

const generateGalaxy = ()=>{

    if(galaxy!=null){
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        scene.remove(galaxy)
    }


    galaxyGeometry = new THREE.BufferGeometry();
    const positions  = new Float32Array(parameters.count*3);
    const colors = new Float32Array(parameters.count*3);

    const colorinside = new THREE.Color(parameters.insideColor);
    const coloroutside = new THREE.Color(parameters.outsideColor);

    for(let i =0;i<parameters.count;i+=3){
        
        const radious = Math.random()*parameters.radious;
        const spin = radious*parameters.spin
        const angle = (((i/3)%parameters.branches)/parameters.branches)*Math.PI*2;

        const positionX = Math.pow(Math.random(),parameters.randomnesspow) * (Math.random()<0.5?1:-1)
        const positionY = Math.pow(Math.random(),parameters.randomnesspow) * (Math.random()<0.5?1:-1)
        const positionZ = Math.pow(Math.random(),parameters.randomnesspow) * (Math.random()<0.5?1:-1)

        positions[i] = Math.cos(angle+spin)*radious+positionX;
        positions[i+1] = 0 + positionY
        positions[i+2] = Math.sin(angle+spin)*radious + positionZ

        const mix = colorinside.clone();
        // console.log(mix);
        mix.lerp(coloroutside,radious/parameters.radious);
        // console.log(mix.b);
        colors[i] = mix.r;
        colors[i+1]=mix.g;
        colors[i+2]=mix.b;

    }

    galaxyGeometry.setAttribute("position",new THREE.BufferAttribute(positions,3))
    console.log(colors);
    galaxyGeometry.setAttribute("color",new THREE.BufferAttribute(colors,3))

    galaxyMaterial = new THREE.PointsMaterial({
        size:parameters.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true
    })

    galaxy = new THREE.Points(galaxyGeometry,galaxyMaterial);
    scene.add(galaxy)
}   

gui.add(parameters,"count").min(100).max(10000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters,"size").min(0.01).max(0.1).step(0.005).onFinishChange(generateGalaxy);
gui.add(parameters,"radious").min(1).max(10).step(1).onFinishChange(generateGalaxy);
gui.add(parameters,"branches").min(1).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters,"spin").min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters,"randomnesspow").min(0).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters,"insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters,"outsideColor").onFinishChange(generateGalaxy);
generateGalaxy()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()