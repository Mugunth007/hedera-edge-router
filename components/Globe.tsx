"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Color } from "three";

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  // const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene, camera, and renderer - sized for right half only
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 2 / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create white starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create atmospheric glow using Franky cyan
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
     uniform vec3 glowColor;
     varying vec3 vNormal;
     void main() {
       float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
       gl_FragColor = vec4(glowColor, 1.0) * intensity;
     }
   `;
    const atmosphereGeometry = new THREE.SphereGeometry(5.5, 32, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new Color(0x038fa8) },
      },
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    scene.add(atmosphereMesh);

    // Create wireframe globe with Franky colors
    const wireframeGeometry = new THREE.SphereGeometry(5, 64, 64);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x038fa8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeGlobe);

    // Create solid globe
    const solidGeometry = new THREE.SphereGeometry(4.9, 64, 64);
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x12275c,
      transparent: true,
      opacity: 0.8,
      emissive: new Color(0x1f3b84),
      emissiveIntensity: 0.1,
    });
    const solidGlobe = new THREE.Mesh(solidGeometry, solidMaterial);
    scene.add(solidGlobe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x038fa8, 0.3);
    scene.add(ambientLight);

    // Add point lights with Franky colors
    const pointLight1 = new THREE.PointLight(0x038fa8, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xd0260e, 0.5, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    camera.position.z = 12;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Franky color palette for transitions
    const frankyColorPalette = [
      new Color(0x038fa8), // cyan
      new Color(0x1f3b84), // blue
      new Color(0xf3d535), // yellow
      new Color(0xec4618), // orange
      new Color(0x12275c), // navy
    ];

    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorT = 0;
    const colorTransitionSpeed = 0.003;

    const lerpColor = (a: Color, b: Color, t: number) => {
      const color = new Color();
      color.r = a.r + (b.r - a.r) * t;
      color.g = a.g + (b.g - a.g) * t;
      color.b = a.b + (b.b - a.b) * t;
      return color;
    };

    let animationId: number;

    // In your Globe component, update the animation loop to match the space rotation
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Color transition logic (keep existing)
      colorT += colorTransitionSpeed;
      if (colorT >= 1) {
        colorT = 0;
        colorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % frankyColorPalette.length;
      }

      const currentColor = lerpColor(
        frankyColorPalette[colorIndex],
        frankyColorPalette[nextColorIndex],
        colorT
      );

      // Update materials with new color (keep existing)
      if (wireframeGlobe.material instanceof THREE.MeshBasicMaterial) {
        wireframeGlobe.material.color = currentColor;
      }
      if (atmosphereMesh.material instanceof THREE.ShaderMaterial) {
        atmosphereMesh.material.uniforms.glowColor.value = currentColor;
      }

      // Sync rotation with space background (120 seconds = 0.003 rad/frame at 60fps)
      const spaceRotationSpeed = 0.0005;
      wireframeGlobe.rotation.y += spaceRotationSpeed;
      solidGlobe.rotation.y += spaceRotationSpeed;
      atmosphereMesh.rotation.y += spaceRotationSpeed * 0.5;
      stars.rotation.y += spaceRotationSpeed * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / 2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // const hintTimer = setTimeout(() => {
    //   setShowHint(false);
    // }, 4000);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      controls.dispose();
      clearTimeout(hintTimer);
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full">
      {/* {showHint && (
      <div className="absolute bottom-6 right-6 bg-franky-navy/80 backdrop-blur-sm text-franky-cyan text-sm px-4 py-2 rounded-full border border-franky-cyan/30 transition-opacity duration-1000 opacity-80 hover:opacity-100 animate-pulse">
        Drag to explore the future
      </div>
    )} */}
    </div>
  );
}
