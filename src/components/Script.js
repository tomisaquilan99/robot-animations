import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class ThreeExperience {
  actions = [];
  mixer = null;
  prevAnimation = null;
  currentAnimation = null;
  clock = null;

  constructor() {
    this.container = document.createElement("div");

    /* Camera */
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1, 8);
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setAnimationLoop(this.render.bind(this));
    this.container.appendChild(this.renderer.domElement);

    /* Controls */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.y = 1.5;

    /* Loader */
    this.loader = new GLTFLoader();
    this.loadModel();

    /* Lights */
    this.addLight();

    /* Clock */
    this.clock = new THREE.Clock();

    /* Mixer */
    this.mixer = new THREE.AnimationMixer();

    /* Resize */
    window.addEventListener("resize", this.resize.bind(this));
  }

  initScene() {
    document.getElementById("container3D").appendChild(this.container);
  }

  loadModel() {
    this.loader.load("RobotExpressive.glb", (gltf) => {
      this.scene.add(gltf.scene);
      this.mixer = new THREE.AnimationMixer(gltf.scene);
      for (const clip of gltf.animations) {
        const action = this.mixer.clipAction(clip);
        this.actions.push(action);
      }
    });
  }

  playAnimation(index, emote) {
    this.prevAnimation = this.currentAnimation;
    this.currentAnimation = this.actions[index];
    this.actions[index].play();

    if (this.prevAnimation !== this.currentAnimation && this.prevAnimation) {
      this.prevAnimation.fadeOut(0.5);
    }

    if (emote) {
      this.currentAnimation.clampWhenFinished = true;
      this.currentAnimation.loop = THREE.LoopOnce;
    }

    this.currentAnimation.reset();
    this.currentAnimation.fadeIn(0.5);
    this.currentAnimation.play();
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight("#ffffff", 1.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    const al = new THREE.AmbientLight("#ffffff", 0.8);
    this.scene.add(al);
  }

  render() {
    const deltaTime = this.clock.getDelta();
    this.mixer.update(deltaTime);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const { clientWidth: width, clientHeight: height } =
      document.getElementById("container3D");
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  cleanUp() {
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.dispose();
        child.geometry.dispose();
      }
    });

    document.getElementById("container3D").removeChild(this.container);
  }
}

export { ThreeExperience };
