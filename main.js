import * as THREE from "https://cdn.skypack.dev/three@0.132.2/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  500,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

//event listener to handle responsive on screen resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio * 2); // Increase pixel ratio for higher resolution
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Create a mesh (cube) to represent the model while it loads
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let gltf; // Define gltf variable in the outer scope

// Load the 3D model
const loader = new GLTFLoader();
const modelPath = "/ice_bear_we_bare_bears/scene.gltf";
loader.load(
  modelPath,
  (loadedGltf) => {
    gltf = loadedGltf;
    scene.remove(cube);
    scene.add(gltf.scene);

    // Add text to the scene
    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const textGeometry = new TextGeometry(
          "under\nconstruction\n-heruapr",
          {
            font: font,
            size: 0.8,
            height: 0,
            curveSegments: 12, // Increase curveSegments for smoother text
          }
        );
        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          depthTest: false, // Disable depth testing for the text material
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.castShadow = false; // Disable shadows for the text mesh
        // textMesh.position.set(-1, -10, -2); // Set the position of the text in the scene

        // make the text centerd based on 3d models

        // Calculate the size of the model's bounding box
        const modelBoundingBox = new THREE.Box3().setFromObject(gltf.scene);
        const modelSize = new THREE.Vector3();
        modelBoundingBox.getSize(modelSize);

        // Calculate the center of the model's bounding box
        const modelCenter = new THREE.Vector3();
        modelBoundingBox.getCenter(modelCenter);

        // Calculate the position for the text below the model
        const textPosition = new THREE.Vector3(
          modelCenter.x,
          modelBoundingBox.min.y - modelSize.y * 0.2, // Adjust the vertical position as needed
          modelCenter.z
        );
        textMesh.position.copy(textPosition);

        // ...

        // ...

        // Function to calculate and update the text position
        function updateTextPosition() {
          // Calculate the size of the model's bounding box
          const modelBoundingBox = new THREE.Box3().setFromObject(gltf.scene);
          const modelSize = new THREE.Vector3();
          modelBoundingBox.getSize(modelSize);

          // Calculate the center of the model's bounding box
          const modelCenter = new THREE.Vector3();
          modelBoundingBox.getCenter(modelCenter);

          // Calculate the position for the text below the model
          const textPosition = new THREE.Vector3(
            modelCenter.x,
            modelBoundingBox.min.y - modelSize.y * 0.2, // Adjust the vertical position as needed
            modelCenter.z
          );

          textMesh.position.copy(textPosition);
        }

        // Add window resize event listener
        window.addEventListener("resize", () => {
          // Update renderer size
          const width = window.innerWidth;
          const height = window.innerHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          // Update text position
          updateTextPosition();
        });

        // ...

        // Call updateTextPosition initially to position the text correctly
        updateTextPosition();

        // ...

        textMesh.renderOrder = 1; // Set a higher render order for the text mesh

        // Remove the existing text mesh if it exists
        const existingTextMesh = scene.getObjectByName("textMesh");
        if (existingTextMesh) {
          scene.remove(existingTextMesh);
        }
        scene.add(textMesh);
      }
    );
  },
  undefined,
  (error) => {
    console.error("Error loading 3D model:", error);
  }
);

// Create lighting to make the model visible
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 2);
scene.add(directionalLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (gltf) {
    gltf.scene.rotation.x += 0.005;
    gltf.scene.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

animate();
