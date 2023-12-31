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
  planeWidth;
  planeHeight;

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
    this.scene.background = new THREE.TextureLoader().load(
      "/fondo-futurista.avif"
    );

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setAnimationLoop(this.render.bind(this));
    this.container.appendChild(this.renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/piso.jpg"); // Cambia 'ruta/a/tu/imagen.jpg' a la ruta correcta de tu imagen

    // Crea un material que utiliza la textura
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    // Crea el plano y aplica el material
    this.planeWidth = 50;
    this.planeHeight = 50;
    const planeGeometry = new THREE.PlaneGeometry(
      this.planeWidth,
      this.planeHeight,
      5
    );
    const plane = new THREE.Mesh(planeGeometry, material);

    // Agrega el plano a tu escena
    this.scene.add(plane);
    plane.rotation.x = Math.PI * -0.5;

    /* Controls */

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.y = 1.5;

    /* Loader */
    this.loader = new GLTFLoader();
    this.loadModels();
    //this.loadSecondModel();

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

  loadModels() {
    this.loader.load("RobotExpressive.glb", (gltf) => {
      this.scene.add(gltf.scene);
      this.robot = gltf.scene;
      this.mixer = new THREE.AnimationMixer(gltf.scene);
      for (const clip of gltf.animations) {
        const action = this.mixer.clipAction(clip);
        this.actions.push(action);
      }
    });

    this.loader.load("public/scene.gltf", (gltf) => {
      const secondModel = gltf.scene;
      secondModel.position.set(0, 0, 10); // Cambia x, y, z a las coordenadas deseadas
      secondModel.scale.set(0.03, 0.03, 0.03);
      this.scene.add(secondModel);
      this.secondModel = secondModel;
    });
  }

  // loadSecondModel() {
  //   this.loader.load("public/scene.gltf", (gltf) => {
  //     const secondModel = gltf.scene;
  //     secondModel.position.set(0, 0, 4); // Cambia x, y, z a las coordenadas deseadas
  //     secondModel.scale.set(0.03, 0.03, 0.03);
  //     this.scene.add(secondModel);
  //     this.secondModel = secondModel;
  //   });
  // }

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
    const finalPosition = this.planeWidth / 2;
    const duration = 5;

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
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight("#ffffff", 1.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    const al = new THREE.AmbientLight("#ffffff", 0.8);
    this.scene.add(al);
  }

  freeRobotMovement() {
    let animationStopped = false;

    this.playAnimation(6, false);
    document.addEventListener("keydown", (event) => {
      // Definir una velocidad de movimiento
      const movementSpeed = 0.3;
      // Definir una velocidad de rotación
      const rotationSpeed = 0.1;

      // Obtener la tecla presionada
      const key = event.key;

      // Variables para mantener la posición actual del robot
      const currentPosition = this.robot.position.clone();
      const newPosition = this.robot.position.clone();

      // Verificar qué tecla se presionó y realizar la acción correspondiente
      switch (key) {
        case "ArrowLeft": // Girar hacia la izquierda
          this.robot.rotation.y += rotationSpeed;
          break;

        case "ArrowRight": // Girar hacia la derecha
          this.robot.rotation.y -= rotationSpeed;
          break;

        case "ArrowUp": // Mover hacia adelante en la dirección de la rotación
          const forward = new THREE.Vector3(0, 0, 1);
          forward.applyQuaternion(this.robot.quaternion);
          forward.multiplyScalar(movementSpeed);
          newPosition.add(forward);
          break;

        case "ArrowDown": // Mover hacia atrás en la dirección opuesta de la rotación
          const backward = new THREE.Vector3(0, 0, -1);
          backward.applyQuaternion(this.robot.quaternion);
          backward.multiplyScalar(movementSpeed);
          newPosition.add(backward);
          break;

        default:
          // No hacer nada para otras teclas
          break;
      }

      if (animationStopped) {
        // Si está detenida, verifica si el robot ha girado y, si es así, permite la animación nuevamente
        if (key === "ArrowLeft" || key === "ArrowRight") {
          animationStopped = false;
          this.playAnimation(6, false); // Reanuda la animación
        }
        return; // No permitas que el robot se mueva si la animación está detenida
      }

      const planeSize = this.planeHeight;
      const halfPlaneSize = planeSize / 2;

      if (
        newPosition.x > halfPlaneSize ||
        newPosition.x < -halfPlaneSize ||
        newPosition.z > halfPlaneSize ||
        newPosition.z < -halfPlaneSize
      ) {
        // Si cruza los límites, no permitas que el robot se mueva en esa dirección
        animationStopped = true;
        this.playAnimation(2, true);
        return;
      }

      // Si no cruza los límites, actualiza la posición del robot
      this.robot.position.copy(newPosition);
    });
  }

  resetRobotPosition() {
    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }
    this.timeline.to(this.robot.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 3,
      onComplete: () => {
        this.timeline.to(this.robot.rotation, { y: 0 });
      },
    });
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
