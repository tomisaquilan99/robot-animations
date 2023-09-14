import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";

class ThreeExperience {
  actions = [];
  mixer = null;
  prevAnimation = null;
  currentAnimation = null;
  clock = null;
  robot = null;
  timeline = new gsap.timeline({
    defaults: {
      duration: 1,
    },
  });

  constructor() {
    this.container = document.createElement("div");

    /* Camera */
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(13, 25, 25);
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

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30, 5),
      new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );
    this.scene.add(plane);
    plane.rotation.x = Math.PI * -0.5;

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
      this.robot = gltf.scene;
      this.mixer = new THREE.AnimationMixer(gltf.scene);
      for (const clip of gltf.animations) {
        const action = this.mixer.clipAction(clip);
        this.actions.push(action);
      }
      // Mover hacia la derecha en X
      //this.moveRobot("X", Math.PI);

      // Mover hacia la izquierda en X y rotar
      //this.moveRobot("-X", -Math.PI);

      // Mover hacia adelante en Z y rotar
      //this.moveRobot("Z", Math.PI);

      // Mover hacia atrás en Z y rotar
      //this.moveRobot("-Z", -Math.PI);

      //this.moveRobot();
      //this.playAnimation(6, false);
      //this.moveRobotBack();
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

  moveRobotBack(direction, rotation) {
    const initialPosition = 0;
    const duration = 3.5;

    switch (direction) {
      case "X":
        this.timeline
          .to(this.robot.rotation, {
            y: -rotation / 2,
            duration: 1,
          })
          .to(this.robot.position, {
            x: initialPosition,
            duration: duration,
            onComplete: () => {
              this.timeline.to(this.robot.rotation, {
                y: 0,
                duration: 1,
                onComplete: () => {
                  this.playAnimation(9, true);
                },
              });
            },
          });
        break;

      case "-X":
        this.timeline
          .to(this.robot.rotation, {
            y: -rotation / 2,
            duration: 1,
          })
          .to(this.robot.position, {
            x: initialPosition,
            duration: duration,
            onComplete: () => {
              this.timeline.to(this.robot.rotation, {
                y: 0,
                duration: 1,
                onComplete: () => {
                  this.playAnimation(9, true);
                },
              });
            },
          });
        break;

      case "Z":
        this.timeline
          .to(this.robot.rotation, {
            y: rotation,
            duration: 1,
          })
          .to(this.robot.position, {
            z: initialPosition,
            duration: duration,
            onComplete: () => {
              this.timeline.to(this.robot.rotation, {
                y: 0,
                duration: 1,
                onComplete: () => {
                  this.playAnimation(9, true);
                },
              });
            },
          });
        break;

      case "-Z":
        this.timeline
          .to(this.robot.rotation, {
            y: rotation * 2,
            duration: 1,
          })
          .to(this.robot.position, {
            z: initialPosition,
            duration: duration,
            onComplete: () => {
              this.playAnimation(9, true);
            },
          });
        break;

      default:
        console.error("Dirección no válida");
        return;
    }

    // this.timeline
    //   .to(this.robot.rotation, {
    //     y: 3,
    //     duration: 1,
    //   })
    //   .to(this.robot.position, {
    //     z: initialPosition,
    //     duration: duration,
    //     onComplete: () => {
    //       this.timeline.to(this.robot.rotation, {
    //         y: 0,
    //         duration: 1,
    //         onComplete: () => {
    //           this.playAnimation(9, true);
    //         },
    //       });
    //     },
    //   });
  }

  moveRobot(direction, rotation) {
    const finalPosition = 14;
    const duration = 3.5;

    this.playAnimation(6, false);

    switch (direction) {
      case "X":
        this.timeline
          .to(this.robot.rotation, { y: rotation / 2 })
          .to(this.robot.position, {
            x: finalPosition,
            duration: duration,
          });
        break;

      case "-X":
        this.timeline
          .to(this.robot.rotation, { y: rotation / 2 })
          .to(this.robot.position, {
            x: -finalPosition,
            duration: duration,
          });
        break;

      case "Z":
        this.timeline.to(this.robot.position, {
          z: finalPosition,
          duration: duration,
        });
        break;

      case "-Z":
        this.timeline
          .to(this.robot.rotation, { y: rotation })
          .to(this.robot.position, {
            z: -finalPosition,
            duration: duration,
          });
        break;

      default:
        console.error("Dirección no válida");
        return;
    }

    // rotation = 0;

    // this.timeline.to(this.robot.rotation, {
    //   y: rotation + Math.PI,
    //   duration: 1,
    //   onComplete: () => {
    //     this.playAnimation(9, true);
    //   },
    // });
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
