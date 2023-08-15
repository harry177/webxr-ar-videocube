import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import "./Scene.styles.css";

export const Scene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  //const readyRef = useRef<boolean>(false);

  useEffect(() => {
    const init = () => {
      const container = containerRef.current!;
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      rendererRef.current = renderer;

      renderer.xr.enabled = true;

      const arButton = ARButton.createButton(renderer);
      arButton.addEventListener("click", handleARSession);

      //const session = renderer.xr.getSession();
      //readyRef.current = renderer.xr.isPresenting;

      const loader = new THREE.TextureLoader();
      const texture = loader.load(require("../assets/tv-texture.jpg"));
      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const cube = new THREE.Mesh(geometry, material);
      cube.scale.set(0.5, 0.5, 0.5);
      cube.position.set(0, 0, -2.5);
      cubeRef.current = cube;

      //scene.add(cube);

      renderer.setAnimationLoop(animate);

      document.body.appendChild(arButton);

      container.appendChild(renderer.domElement);

      camera.position.z = 5;

      const raycaster = new THREE.Raycaster();
      raycasterRef.current = raycaster;
    };

    const animate = () => {
      const { current: renderer } = rendererRef;
      const { current: scene } = sceneRef;
      const { current: camera } = cameraRef;
      const { current: cube } = cubeRef;

      if (renderer && scene && camera) {
        if (cube) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
      }
    };

    const handleARSession = () => {
      const { current: scene } = sceneRef;
      const { current: cube } = cubeRef;
      if (scene && cube) {
        scene.add(cube);
      }
    };

    init();

    return () => {
      const { current: renderer } = rendererRef;

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="scene-container" />
    </>
  );
};
