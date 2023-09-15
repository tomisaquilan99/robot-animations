import { useEffect } from "react";
import { ThreeExperience } from "./Script";

import "./Scene.css";

export default function Scene() {
  const three = new ThreeExperience();

  const animations = [
    {
      animationIndex: 0,
      isEmoteAnimation: false,
    },
    {
      animationIndex: 1,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 2,
      isEmoteAnimation: false,
    },
    {
      animationIndex: 3,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 4,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 5,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 6,
      isEmoteAnimation: false,
    },
    {
      animationIndex: 7,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 8,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 9,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 10,
      isEmoteAnimation: false,
    },
    {
      animationIndex: 11,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 12,
      isEmoteAnimation: true,
    },
    {
      animationIndex: 13,
      isEmoteAnimation: true,
    },
  ];

  const robotMoveAnimations = [
    { movement: "X", rotationParam: Math.PI },
    { movement: "-X", rotationParam: -Math.PI },
    { movement: "Z", rotationParam: Math.PI },
    { movement: "-Z", rotationParam: -Math.PI },
  ];

  useEffect(() => {
    three.initScene();
    return () => {
      three.cleanUp();
      console.log("first");
    };
  }, []);

  return (
    <>
      <div id="container3D" className="scene_container"></div>
      <div className="button_container">
        <div className="author">Robot Animations by Tomas Saquilan</div>
        <div className="button_wrapper">
          {robotMoveAnimations.map((animation, index) => (
            <button
              key={index}
              onClick={() => {
                three.moveRobot(animation.movement, animation.rotationParam);
                three.moveRobotBack(
                  animation.movement,
                  animation.rotationParam
                );
              }}
            >
              Movement {animation.movement}
            </button>
          ))}
          <button
            onClick={() => {
              three.freeRobotMovement();
            }}
          >
            Free Movement
          </button>
          <button
            onClick={() => {
              three.resetRobotPosition();
            }}
          >
            Reset Position
          </button>
        </div>
      </div>
    </>
  );
}
