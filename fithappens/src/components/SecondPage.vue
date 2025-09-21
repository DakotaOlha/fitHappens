<template>
  <div class="second-page-container">
    <div class="content">
      <h1>Підбір одягу по кольоротипу</h1>
      <div style="margin-bottom: 16px;">
        <label style="font-weight: bold; margin-right: 12px;">Change:</label>
        <button :class="{active: clothesMode==='top'}" @click="clothesMode='top'">Top</button>
        <button :class="{active: clothesMode==='bottom'}" @click="clothesMode='bottom'">Bottom</button>
      </div>
        <div class="color-buttons">
          <template v-if="colorotype === 'Літо'">
            <button @click="setClothesColor('#E88488')" style="background:#E88488">#E88488</button>
            <button @click="setClothesColor('#ECDF8A')" style="background:#ECDF8A">#ECDF8A</button>
            <button @click="setClothesColor('#B8A18B')" style="background:#B8A18B">#B8A18B</button>
            <button @click="setClothesColor('#9E224A')" style="background:#9E224A;color:#fff">#9E224A</button>
          </template>
          <template v-else-if="colorotype === 'Зима'">
            <button @click="setClothesColor('#0092DD')" style="background:#0092DD;color:#fff">#0092DD</button>
            <button @click="setClothesColor('#54B444')" style="background:#54B444">#54B444</button>
            <button @click="setClothesColor('#AC7A28')" style="background:#AC7A28">#AC7A28</button>
            <button @click="setClothesColor('#F7D907')" style="background:#F7D907">#F7D907</button>
          </template>
          <template v-else-if="colorotype === 'Осінь'">
            <button @click="setClothesColor('#952927')" style="background:#952927;color:#fff">#952927</button>
            <button @click="setClothesColor('#BC825C')" style="background:#BC825C">#BC825C</button>
            <button @click="setClothesColor('#BF9F62')" style="background:#BF9F62">#BF9F62</button>
            <button @click="setClothesColor('#693A28')" style="background:#693A28;color:#fff">#693A28</button>
          </template>
          <template v-else-if="colorotype === 'Весна'">
            <button @click="setClothesColor('#FFF500')" style="background:#FFF500">#FFF500</button>
            <button @click="setClothesColor('#E77843')" style="background:#E77843">#E77843</button>
            <button @click="setClothesColor('#DC332E')" style="background:#DC332E;color:#fff">#DC332E</button>
          <button @click="setClothesColor('#679B37')" style="background:#679B37">#679B37</button>
          </template>
  <!-- end color-buttons block -->
      </div>
      <div class="switch-buttons">
        <span>
          <button @click="showSkirt = true">Show Skirt</button>
          <button @click="showSkirt = false">Show Pants</button>
        </span>
        <span>
          <button @click="showTShirt = true">Show T-Shirt</button>
          <button @click="showTShirt = false">Show Blouse</button>
        </span>
      </div>
    </div>
    <div class="model-box" ref="modelBox">

    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CLOTHES_COLORS = {
  red: 0xff0000,
  orange: 0xffa500,
  yellow: 0xffeb3b,
  green: 0x4caf50,
  blue: 0x2196f3,
  indigo: 0x3f51b5,
  violet: 0x8e24aa,
  grey: 0x888888
};

const result = localStorage.getItem("result");
console.log("Збережений результат:", result);

export default {
  name: 'SecondPage',
  setup() {
    const modelBox = ref(null);
  const skirtMeshRef = ref(null);
  const pantsMeshRef = ref(null);
  const tshirtMeshRef = ref(null);
  const blouseMeshRef = ref(null);
  const clothesColor = ref(CLOTHES_COLORS.grey);
  const showSkirt = ref(true);
  const showTShirt = ref(true);
  const clothesMode = ref('bottom');
  const colorotype = ref(result);

    function setClothesColor(colorHex) {
      clothesColor.value = colorHex;
      if (clothesMode.value === 'bottom') {
        if (skirtMeshRef.value) skirtMeshRef.value.material.color.set(colorHex);
        if (pantsMeshRef.value) pantsMeshRef.value.material.color.set(colorHex);
      } else {
        if (tshirtMeshRef.value) tshirtMeshRef.value.material.color.set(colorHex);
        if (blouseMeshRef.value) blouseMeshRef.value.material.color.set(colorHex);
      }
    }

    onMounted(() => {
      const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 350/350, 0.1, 1000);
  camera.position.z = 0.8; // Zoom in closer

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(350, 350);
      renderer.setClearColor(0xf0f0f0);
      modelBox.value.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.screenSpacePanning = false;
    controls.minDistance = camera.position.z;
    controls.maxDistance = camera.position.z;
    controls.enableZoom = false;
    controls.target.set(0, 0, 0);
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

      const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

      const loader = new OBJLoader();
      // Load Avatar (mannequin)
      loader.load(
        'src/assets/models/avatar.obj',
        function (avatar) {
          avatar.traverse(child => {
            if (child.isMesh) {
              child.material = new THREE.MeshPhongMaterial({ color: 0xffdbac }); // skin color
            }
          });
          // Center and scale avatar
          const box = new THREE.Box3().setFromObject(avatar);
          const size = box.getSize(new THREE.Vector3());
          const scale = 1 / Math.max(size.x, size.y, size.z);
          avatar.scale.set(scale, scale, scale);
          box.setFromObject(avatar);
          const center = box.getCenter(new THREE.Vector3());
          avatar.position.sub(center);
          scene.add(avatar);

          // Load Skirt2 (clothes)
          loader.load(
            'src/assets/models/skirt2.obj',
            function (skirt) {
              skirt.traverse(child => {
                if (child.isMesh) {
                  child.material = new THREE.MeshPhongMaterial({ color: clothesColor.value });
                  skirtMeshRef.value = child;
                }
              });
              skirt.scale.set(scale * 1.15, scale * 1.15, scale * 1.15);
              const box2 = new THREE.Box3().setFromObject(skirt);
              const center2 = box2.getCenter(new THREE.Vector3());
              skirt.position.sub(center2);
              skirt.position.y += 20 * scale;
              skirt.position.z -= 0.003;
              scene.add(skirt);

              // Load Pants (clothes)
              loader.load(
                'src/assets/models/pants.obj',
                function (pants) {
                  pants.traverse(child => {
                    if (child.isMesh) {
                      child.material = new THREE.MeshPhongMaterial({ color: clothesColor.value });
                      pantsMeshRef.value = child;
                    }
                  });
                  pants.scale.set(scale, scale, scale);
                  const boxP = new THREE.Box3().setFromObject(pants);
                  const centerP = boxP.getCenter(new THREE.Vector3());
                  pants.position.sub(centerP);
                  pants.position.y += (box.max.y - box.min.y) * -0.16;
                  pants.position.z += 0.00075;
                  scene.add(pants);
                  pants.visible = false;

                  // Load TShirt2 (clothes)
                  loader.load(
                    'src/assets/models/tshirt2.obj',
                    function (tshirt) {
                      tshirt.traverse(child => {
                        if (child.isMesh) {
                          child.material = new THREE.MeshPhongMaterial({ color: clothesColor.value });
                          tshirtMeshRef.value = child;
                        }
                      });
                      tshirt.scale.set(scale * 1.12, scale * 1.12, scale * 1.12);
                      const box3 = new THREE.Box3().setFromObject(tshirt);
                      const center3 = box3.getCenter(new THREE.Vector3());
                      tshirt.position.sub(center3);
                      tshirt.position.y += (box.max.y - box.min.y) * 0.223;
                      tshirt.position.z += 0.01;
                      scene.add(tshirt);
                      tshirt.visible = showTShirt.value;

                      // Load Blouse (if you have blouse.obj)
                      loader.load(
                        'src/assets/models/blouse.obj',
                        function (blouse) {
                          blouse.traverse(child => {
                            if (child.isMesh) {
                              child.material = new THREE.MeshPhongMaterial({ color: clothesColor.value });
                              blouseMeshRef.value = child;
                            }
                          });
                          blouse.scale.set(scale * 1.12, scale * 1.12, scale * 1.12);
                          const box4 = new THREE.Box3().setFromObject(blouse);
                          const center4 = box4.getCenter(new THREE.Vector3());
                          blouse.position.sub(center4);
                          blouse.position.y += (box.max.y - box.min.y) * 0.245;
                          blouse.position.z += 0.01;
                          scene.add(blouse);
                          blouse.visible = !showTShirt.value;
                          animate();
                        },
                        undefined,
                        function (error) {
                          console.error('Error loading blouse.obj:', error);
                        }
                      );
                    },
                    undefined,
                    function (error) {
                      console.error('Error loading tshirt2.obj:', error);
                    }
                  );
                },
                undefined,
                function (error) {
                  console.error('Error loading pants.obj:', error);
                }
              );
            },
            undefined,
            function (error) {
              console.error('Error loading skirt2.obj:', error);
            }
          );
        },
        undefined,
        function (error) {
          console.error('Error loading avatar.obj:', error);
        }
      );

      function animate() {
        requestAnimationFrame(animate);
        // Only one bottom and one top visible
        if (skirtMeshRef.value) skirtMeshRef.value.parent.visible = showSkirt.value;
        if (pantsMeshRef.value) pantsMeshRef.value.parent.visible = !showSkirt.value;
        if (tshirtMeshRef.value) tshirtMeshRef.value.parent.visible = showTShirt.value;
        if (blouseMeshRef.value) blouseMeshRef.value.parent.visible = !showTShirt.value;
        controls.update();
        renderer.render(scene, camera);
      }
    });

  return { modelBox, setClothesColor, showSkirt, showTShirt, clothesMode, colorotype };
  }
};
</script>

<style scoped>

.second-page-container {
  background: #dce9ef;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 100vh;
}

.content {
  flex: 1;
}

.model-box {
  width: 350px;
  height: 350px;
  background: #f0f0f0;
  border-radius: 16px;
  margin-right: 40px;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative;
}

.color-buttons {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
}

.color-buttons button {
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  background: #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.color-buttons button:hover {
  background: #ddd;
}

.switch-buttons {
  margin-top: 16px;
}

.switch-buttons button {
  margin-right: 8px;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  background: #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.switch-buttons button:hover {
  background: #ddd;
}

h1 {
  color: #35495e;
}
</style>
