import * as THREE from "three";
import { useEffect } from "react";
import SceneInit from "./lib/SceneInit";
import Planet from "./lib/Planet";
import Rotation from "./lib/Rotation";

export default function Home() {

  useEffect(async () => {
    // TODO: Understand this code later.
    let test = new SceneInit();
    test.initScene();
    test.animate();

    const sunGeometry = new THREE.SphereGeometry(8);
    const sunTexture = new THREE.TextureLoader().load("sun.jpeg");
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    const solarSystem = new THREE.Group();
    solarSystem.add(sunMesh);
    test.scene.add(solarSystem);

    const moon = new Planet(1, 40, "moon.jpg");
    const moonMesh = moon.getMesh();
    let moonSystem = new THREE.Group();
    moonSystem.add(moonMesh);

    const earth = new Planet(4, 41, "earth.jpeg");
    const earthMesh = earth.getMesh();
    let earthSystem = new THREE.Group();
    earthSystem.add(earthMesh, moonSystem);

    solarSystem.add(earthSystem);

    const moonRotation = new Rotation(moonMesh);
    const moonRotationMesh = moonRotation.getMesh();
    moonSystem.add(moonRotationMesh);
    
    const earthRotation = new Rotation(earthMesh);
    const earthRotationMesh = earthRotation.getMesh();
    earthSystem.add(earthRotationMesh);


    // NOTE: Animate solar system at 60fps.
  const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);
  const MOON_ORBIT = 2 * EARTH_YEAR * 6; // Adjust this value to control the moon's orbit speed.
  let moonOrbitAngle = 0; // Initialize the angle for the moon's orbit.
  const moonDistanceFromEarth = 8; // Adjust this value to set the distance between the Earth and the Moon.

  const animate = () => {
    sunMesh.rotation.y += 0.001;

    // Update the moon's position relative to the Earth's rotation.
    moonOrbitAngle += MOON_ORBIT;
    
    // Calculate the new position of the moon using trigonometry.
    const moonOrbitX = moonDistanceFromEarth * Math.cos(moonOrbitAngle);
    const moonOrbitZ = moonDistanceFromEarth * Math.sin(moonOrbitAngle);

    // Make the Y coordinate zero to keep the moon's orbit on the same plane.
    const moonOrbitY = 0;

    // Set the moon's new position.
    moonSystem.position.set(moonOrbitX, moonOrbitY, moonOrbitZ);

    earthSystem.rotation.y += EARTH_YEAR;

    requestAnimationFrame(animate);
  };
  animate();
}, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}
