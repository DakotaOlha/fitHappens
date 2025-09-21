<template>
  <div class="outfit-selector">
    <!-- Header Section -->
    <div class="header">
      <h1>Підбір одягу за кольоротипом</h1>
      <div class="color-type-info" v-if="displayResult">
        <div class="color-type-badge">
          <span>{{ displayResult }}</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Controls Panel -->
      <div class="controls-panel">
        <!-- Color Type Section -->
        <div class="control-section">
          <h3>Кольоротип</h3>
          <div class="color-type-selector">
            <button 
              v-for="type in colorTypes" 
              :key="type.name"
              :class="{ active: selectedColorType === type.name }"
              @click="selectColorType(type.name)"
              class="color-type-btn"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- Clothing Mode Section -->
        <div class="control-section">
          <h3>Частина одягу</h3>
          <div class="toggle-group">
            <button 
              :class="{ active: clothesMode === 'top' }" 
              @click="clothesMode = 'top'"
              class="toggle-btn"
            >
              <span class="icon">👕</span>
              Верх
            </button>
            <button 
              :class="{ active: clothesMode === 'bottom' }" 
              @click="clothesMode = 'bottom'"
              class="toggle-btn"
            >
              <span class="icon">👖</span>
              Низ
            </button>
          </div>
        </div>

        <!-- Recommended Colors Section -->
        <div class="control-section">
          <h3>Рекомендовані кольори</h3>
          <div class="color-grid">
            <button
              v-for="(colorInfo, colorKey) in recommendedColors"
              :key="colorKey"
              @click="setClothesColor(colorKey)"
              :class="{ 
                active: selectedColor === colorKey,
                recommended: colorInfo.recommended 
              }"
              class="color-btn"
              :style="{ 
                backgroundColor: `#${CLOTHES_COLORS[colorKey]?.toString(16).padStart(6, '0')}` 
              }"
              :title="colorInfo.name"
            >
              <span v-if="colorInfo.recommended" class="recommend-badge">★</span>
            </button>
          </div>
        </div>

        <!-- Clothing Type Section -->
        <div class="control-section">
          <h3>Тип одягу</h3>
          <div class="clothing-options">
            <div class="option-group">
              <label>Низ:</label>
              <div class="option-buttons">
                <button 
                  :class="{ active: showSkirt }"
                  @click="showSkirt = true"
                  class="option-btn"
                >
                  Спідниця
                </button>
                <button 
                  :class="{ active: !showSkirt }"
                  @click="showSkirt = false"
                  class="option-btn"
                >
                  Штани
                </button>
              </div>
            </div>
            
            <div class="option-group">
              <label>Верх:</label>
              <div class="option-buttons">
                <button 
                  :class="{ active: showTShirt }"
                  @click="showTShirt = true"
                  class="option-btn"
                >
                  Футболка
                </button>
                <button 
                  :class="{ active: !showTShirt }"
                  @click="showTShirt = false"
                  class="option-btn"
                >
                  Блузка
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Style Tips -->
        <div class="control-section">
          <h3>Поради стиліста</h3>
          <div class="style-tips">
            <p v-for="tip in getCurrentTips()" :key="tip" class="tip">
              💡 {{ tip }}
            </p>
          </div>
        </div>
      </div>

      <!-- 3D Model Section -->
      <div class="model-section">
        <div class="model-container">
          <div class="model-box" ref="modelBox">
            <div v-if="isLoading" class="loading-overlay">
              <div class="loading-spinner"></div>
              <p>Завантаження моделі...</p>
            </div>
          </div>
          
          <div class="model-controls">
            <button @click="resetCamera" class="control-btn">
              🔄 Скинути вигляд
            </button>
            <button @click="toggleWireframe" class="control-btn">
              {{ wireframe ? '🎭 Звичайний' : '📐 Каркас' }}
            </button>
          </div>
        </div>

        <!-- Color Analysis -->
        <div class="color-analysis">
          <h4>Аналіз кольору</h4>
          <div class="analysis-card">
            <div class="color-swatch" :style="{ backgroundColor: currentColorHex }"></div>
            <div class="color-info">
              <p><strong>Поточний колір:</strong> {{ currentColorName }}</p>
              <p><strong>Рекомендація:</strong> 
                <span :class="{ 
                  'good': isColorRecommended, 
                  'warning': !isColorRecommended 
                }">
                  {{ isColorRecommended ? 'Відмінно підходить!' : 'Можна спробувати інший' }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const CLOTHES_COLORS = {
  red: 0xff0000,
  orange: 0xffa500,
  yellow: 0xffeb3b,
  green: 0x4caf50,
  blue: 0x2196f3,
  indigo: 0x3f51b5,
  violet: 0x8e24aa,
  grey: 0x888888,
  pink: 0xff69b4,
  coral: 0xff7f50,
  navy: 0x000080,
  burgundy: 0x800020
}

const COLOR_TYPES = {
  'Весна': {
    colors: ['orange', 'yellow', 'coral', 'green'],
    tips: [
      'Обирайте теплі та яскраві кольори',
      'Уникайте чорного та сірого',
      'Персиковий та золотистий - ваші кольори'
    ]
  },
  'Літо': {
    colors: ['blue', 'pink', 'grey', 'violet'],
    tips: [
      'Холодні пастельні відтінки вам підходять',
      'Рожевий та лавандовий - ідеальний вибір',
      'Уникайте надто яскравих кольорів'
    ]
  },
  'Осінь': {
    colors: ['orange', 'burgundy', 'yellow', 'green'],
    tips: [
      'Теплі землисті тони - ваша сила',
      'Гірчичний та теракотовий підкреслять красу',
      'Уникайте холодних відтінків'
    ]
  },
  'Зима': {
    colors: ['red', 'navy', 'grey', 'indigo'],
    tips: [
      'Контрастні чисті кольори - ваш стиль',
      'Чорний, білий, яскраво-червоний підходять',
      'Уникайте приглушених тонів'
    ]
  }
}

const result = localStorage.getItem("result")
const getStoredColorType = () => {
  return result;
}

export default {
  name: 'OutfitSelector',
  props: {
    userColorType: {
      type: String,
      default: null
    },
    colorTypeResult: {
      type: String,
      default: null
    }
  },
  setup(props) {
    // Get color type from various sources
    const getInitialColorType = () => {
      if (props.colorTypeResult) return extractColorTypeFromResult(props.colorTypeResult)
      if (props.userColorType) return props.userColorType
      
      const result = localStorage.getItem("result")
      if (result) return extractColorTypeFromResult(result)
      
      return result || 'Весна'
    }

    // Extract color type from result string
    const extractColorTypeFromResult = (result) => {
      if (!result) return 'Весна'
      
      const resultLower = result.toLowerCase()
      if (resultLower.includes('весна')) return 'Весна'
      if (resultLower.includes('літо')) return 'Літо'
      if (resultLower.includes('осінь')) return 'Осінь'
      if (resultLower.includes('зима')) return 'Зима'
      
      return 'Весна' // default fallback
    }
    // Reactive state
    const modelBox = ref(null)
    const isLoading = ref(true)
    const clothesMode = ref('bottom')
    const showSkirt = ref(true)
    const showTShirt = ref(true)
    const selectedColor = ref('grey')
    const selectedColorType = ref(getInitialColorType())
    const wireframe = ref(false)

    // Store the result for display
    const colorTypeResult = ref(props.colorTypeResult || '')

    // 3D Model references
    const skirtMeshRef = ref(null)
    const pantsMeshRef = ref(null)
    const tshirtMeshRef = ref(null)
    const blouseMeshRef = ref(null)
    
    // Three.js objects
    let scene, camera, renderer, controls, animationId

    // Computed properties
    const colorType = computed(() => selectedColorType.value)
    
    const displayResult = computed(() => {
      return colorTypeResult.value || `${selectedColorType.value} - рекомендовані кольори для вашого типу`
    })
    
    const colorTypes = computed(() => 
      Object.keys(COLOR_TYPES).map(name => ({ name }))
    )

    const recommendedColors = computed(() => {
      const recommended = COLOR_TYPES[selectedColorType.value]?.colors || []
      const result = {}
      
      Object.keys(CLOTHES_COLORS).forEach(colorKey => {
        result[colorKey] = {
          name: colorKey.charAt(0).toUpperCase() + colorKey.slice(1),
          recommended: recommended.includes(colorKey)
        }
      })
      
      return result
    })

    const currentColorHex = computed(() => 
      `#${CLOTHES_COLORS[selectedColor.value]?.toString(16).padStart(6, '0')}`
    )

    const currentColorName = computed(() => 
      selectedColor.value.charAt(0).toUpperCase() + selectedColor.value.slice(1)
    )

    const isColorRecommended = computed(() => 
      recommendedColors.value[selectedColor.value]?.recommended || false
    )

    // Methods
    const selectColorType = (type) => {
      selectedColorType.value = type
    }

    const setClothesColor = (colorName) => {
      selectedColor.value = colorName
      const color = CLOTHES_COLORS[colorName]
      
      if (clothesMode.value === 'bottom') {
        if (skirtMeshRef.value) skirtMeshRef.value.material.color.set(color)
        if (pantsMeshRef.value) pantsMeshRef.value.material.color.set(color)
      } else {
        if (tshirtMeshRef.value) tshirtMeshRef.value.material.color.set(color)
        if (blouseMeshRef.value) blouseMeshRef.value.material.color.set(color)
      }
    }

    const getCurrentTips = () => {
      return COLOR_TYPES[selectedColorType.value]?.tips || []
    }

    const resetCamera = () => {
      if (camera && controls) {
        camera.position.set(0, 0, 2)
        controls.target.set(0, 0, 0)
        controls.update()
      }
    }

    const toggleWireframe = () => {
      wireframe.value = !wireframe.value
      // Apply to all meshes
      ;[skirtMeshRef.value, pantsMeshRef.value, tshirtMeshRef.value, blouseMeshRef.value].forEach(mesh => {
        if (mesh && mesh.material) {
          mesh.material.wireframe = wireframe.value
        }
      })
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Update visibility
      if (skirtMeshRef.value) skirtMeshRef.value.parent.visible = showSkirt.value
      if (pantsMeshRef.value) pantsMeshRef.value.parent.visible = !showSkirt.value
      if (tshirtMeshRef.value) tshirtMeshRef.value.parent.visible = showTShirt.value
      if (blouseMeshRef.value) blouseMeshRef.value.parent.visible = !showTShirt.value
      
      if (controls) controls.update()
      if (renderer && scene && camera) renderer.render(scene, camera)
    }

    // Initialize 3D scene (ORIGINAL SETTINGS)
    const init3D = () => {
      if (!modelBox.value) return

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, 350/350, 0.1, 1000)
      camera.position.z = 2

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(350, 350)
      renderer.setClearColor(0xf0f0f0)
      modelBox.value.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enablePan = false
      controls.screenSpacePanning = false
      controls.minDistance = 0.5
      controls.maxDistance = 10
      controls.target.set(0, 0, 0)
      controls.minPolarAngle = Math.PI / 2
      controls.maxPolarAngle = Math.PI / 2
      controls.update()

      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(1, 1, 1).normalize()
      scene.add(light)

      loadModels()
    }

    const loadModels = () => {
      const loader = new OBJLoader()
      
      loader.load(
        'src/assets/models/avatar.obj',
        function (avatar) {
          avatar.traverse(child => {
            if (child.isMesh) {
              child.material = new THREE.MeshPhongMaterial({ color: 0xffdbac }) // skin color
            }
          })
          // Center and scale avatar
          const box = new THREE.Box3().setFromObject(avatar)
          const size = box.getSize(new THREE.Vector3())
          const scale = 1 / Math.max(size.x, size.y, size.z)
          avatar.scale.set(scale, scale, scale)
          box.setFromObject(avatar)
          const center = box.getCenter(new THREE.Vector3())
          avatar.position.sub(center)
          scene.add(avatar)

          // Load Skirt2 (clothes)
          loader.load(
            'src/assets/models/skirt2.obj',
            function (skirt) {
              skirt.traverse(child => {
                if (child.isMesh) {
                  child.material = new THREE.MeshPhongMaterial({ color: CLOTHES_COLORS[selectedColor.value] })
                  skirtMeshRef.value = child
                }
              })
              skirt.scale.set(scale * 1.15, scale * 1.15, scale * 1.15)
              const box2 = new THREE.Box3().setFromObject(skirt)
              const center2 = box2.getCenter(new THREE.Vector3())
              skirt.position.sub(center2)
              skirt.position.y += 20 * scale
              skirt.position.z -= 0.003
              scene.add(skirt)

              // Load Pants (clothes)
              loader.load(
                'src/assets/models/pants.obj',
                function (pants) {
                  pants.traverse(child => {
                    if (child.isMesh) {
                      child.material = new THREE.MeshPhongMaterial({ color: CLOTHES_COLORS[selectedColor.value] })
                      pantsMeshRef.value = child
                    }
                  })
                  pants.scale.set(scale, scale, scale)
                  const boxP = new THREE.Box3().setFromObject(pants)
                  const centerP = boxP.getCenter(new THREE.Vector3())
                  pants.position.sub(centerP)
                  pants.position.y += (box.max.y - box.min.y) * -0.16
                  pants.position.z += 0.00075
                  scene.add(pants)
                  pants.visible = false

                  // Load TShirt2 (clothes)
                  loader.load(
                    'src/assets/models/tshirt2.obj',
                    function (tshirt) {
                      tshirt.traverse(child => {
                        if (child.isMesh) {
                          child.material = new THREE.MeshPhongMaterial({ color: CLOTHES_COLORS[selectedColor.value] })
                          tshirtMeshRef.value = child
                        }
                      })
                      tshirt.scale.set(scale * 1.12, scale * 1.12, scale * 1.12)
                      const box3 = new THREE.Box3().setFromObject(tshirt)
                      const center3 = box3.getCenter(new THREE.Vector3())
                      tshirt.position.sub(center3)
                      tshirt.position.y += (box.max.y - box.min.y) * 0.223
                      tshirt.position.z += 0.01
                      scene.add(tshirt)
                      tshirt.visible = showTShirt.value

                      // Load Blouse (if you have blouse.obj)
                      loader.load(
                        'src/assets/models/blouse.obj',
                        function (blouse) {
                          blouse.traverse(child => {
                            if (child.isMesh) {
                              child.material = new THREE.MeshPhongMaterial({ color: CLOTHES_COLORS[selectedColor.value] })
                              blouseMeshRef.value = child
                            }
                          })
                          blouse.scale.set(scale * 1.12, scale * 1.12, scale * 1.12)
                          const box4 = new THREE.Box3().setFromObject(blouse)
                          const center4 = box4.getCenter(new THREE.Vector3())
                          blouse.position.sub(center4)
                          blouse.position.y += (box.max.y - box.min.y) * 0.245
                          blouse.position.z += 0.01
                          scene.add(blouse)
                          blouse.visible = !showTShirt.value
                          isLoading.value = false
                          animate()
                        },
                        undefined,
                        function (error) {
                          console.error('Error loading blouse.obj:', error)
                          isLoading.value = false
                        }
                      )
                    },
                    undefined,
                    function (error) {
                      console.error('Error loading tshirt2.obj:', error)
                      isLoading.value = false
                    }
                  )
                },
                undefined,
                function (error) {
                  console.error('Error loading pants.obj:', error)
                  isLoading.value = false
                }
              )
            },
            undefined,
            function (error) {
              console.error('Error loading skirt2.obj:', error)
              isLoading.value = false
            }
          )
        },
        undefined,
        function (error) {
          console.error('Error loading avatar.obj:', error)
          isLoading.value = false
        }
      )
    }

    // Lifecycle hooks
    onMounted(() => {
      init3D()
    })

    onUnmounted(() => {
      if (animationId) cancelAnimationFrame(animationId)
      if (renderer && renderer.domElement && modelBox.value) {
        modelBox.value.removeChild(renderer.domElement)
        renderer.dispose()
      }
    })

    // Watchers
    watch(() => props.userColorType, (newType) => {
      if (newType) selectedColorType.value = newType
    })
    
    watch(() => props.colorTypeResult, (newResult) => {
      if (newResult) {
        colorTypeResult.value = newResult
        selectedColorType.value = extractColorTypeFromResult(newResult)
      }
    })

    return {
      modelBox,
      isLoading,
      clothesMode,
      showSkirt,
      showTShirt,
      selectedColor,
      selectedColorType,
      wireframe,
      colorType,
      displayResult,
      colorTypes,
      recommendedColors,
      currentColorHex,
      currentColorName,
      isColorRecommended,
      CLOTHES_COLORS,
      selectColorType,
      setClothesColor,
      getCurrentTips,
      resetCamera,
      toggleWireframe
    }
  }
}
</script>

<style scoped>
.outfit-selector {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.color-type-badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 25px;
  border: 1px solid rgba(255,255,255,0.3);
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.controls-panel {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}

.control-section {
  margin-bottom: 30px;
}

.control-section h3 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 600;
}

.color-type-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.color-type-btn {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-type-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.color-type-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.toggle-group {
  display: flex;
  gap: 10px;
}

.toggle-btn {
  flex: 1;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.toggle-btn .icon {
  font-size: 1.5rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.color-btn {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.color-btn.active {
  border-color: #667eea;
  transform: scale(1.1);
}

.color-btn.recommended {
  box-shadow: 0 0 0 2px gold;
}

.recommend-badge {
  color: gold;
  font-size: 1.2rem;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
}

.clothing-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-group label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  display: block;
}

.option-buttons {
  display: flex;
  gap: 8px;
}

.option-btn {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.style-tips {
  background: #f7fafc;
  border-radius: 12px;
  padding: 15px;
}

.tip {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.5;
}

.model-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.model-container {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.model-box {
  width: 350px;
  height: 350px;
  background: #f0f0f0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #667eea;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.model-controls {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.control-btn {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  border-color: #667eea;
}

.color-analysis {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.analysis-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 12px;
  margin-top: 15px;
}

.color-swatch {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.color-info p {
  margin-bottom: 5px;
  color: #4a5568;
}

.good {
  color: #38a169;
  font-weight: 600;
}

.warning {
  color: #e53e3e;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>