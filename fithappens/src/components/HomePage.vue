<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="nav-container">
        <img src="../assets/logo.png" alt="ColorStyle Logo" style="height:60px;vertical-align:middle;margin-right:10px;" />
        <nav>
          <ul class="nav-menu">
            <li><a href="#home" class="nav-link" @click.prevent="scrollTo('home')">Головна</a></li>
            <li><a href="#about" class="nav-link" @click.prevent="scrollTo('about')">Про нас</a></li>
            <li><a href="#color-types" class="nav-link" @click.prevent="scrollTo('color-types')">Кольоротипи</a></li>
            <li><a href="#reviews" class="nav-link" @click.prevent="scrollTo('reviews')">Відгуки</a></li>
            <li><a href="#contact" class="nav-link" @click.prevent="scrollTo('contact')">Контакти</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1>Знайди свій ідеальний стиль</h1>
          <p>Відкрий для себе одяг, який підкреслить твою природну красу за допомогою визначення кольоротипу. Персональний підбір від професійних стилістів.</p>
          <button class="cta-button" @click="scrollTo('color-types')">Дізнатися більше</button>
        </div>
        <div class="hero-image">
            <img src="../assets/person.png" alt="Person" class="person-img" />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section about">
      <div class="section-container">
        <h2 class="section-title">Про нас</h2>
        <div class="about-content">
          <p>Ми — команда професійних стилістів та колористів, які допомагають людям відкрити свій унікальний стиль. Наша місія — зробити моду доступною та зрозумілою для кожного, хто хоче виглядати гармонійно та впевнено.</p>
          <br>
          <p>За роки роботи ми допомогли тисячам клієнтів знайти свій ідеальний кольоротип та створити гардероб, який підкреслює їхню природну красу. Ми використовуємо найсучасніші методики та індивідуальний підхід до кожного клієнта.</p>
        </div>
      </div>
    </section>

    <!-- Color Types Section -->
    <section id="color-types" class="section color-types">
      <div class="section-container">
        <h2 class="section-title">Кольоротипи</h2>
        <div class="carousel-container">
          <div class="carousel">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(colorType, index) in colorTypes" :key="index" 
                   class="color-type-card" 
                   :style="{ '--bg-color': colorType.bgColor, '--bg-color-dark': colorType.bgColorDark }">
                <h3>{{ colorType.name }}</h3>
                <p>{{ colorType.description }}</p>
                <div class="color-palette">
                  <div v-for="color in colorType.palette" :key="color" 
                       class="color-dot" :style="{ backgroundColor: color }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-nav">
            <span v-for="(_, index) in colorTypes" :key="index"
                  class="nav-dot" :class="{ active: currentSlide === index }"
                  @click="currentSlide = index"></span>
          </div>
        </div>
        <div style="text-align: center;">
          <button class="cta-button" @click.prevent="$router.push('/test')">Пройти тест на кольоротип</button>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section id="reviews" class="section reviews">
      <div class="section-container">
        <h2 class="section-title">Відгуки наших клієнтів</h2>
        <div class="reviews-carousel">
          <div class="review-card">
            <div class="stars">★★★★★</div>
            <p class="review-text">{{ reviews[currentReview].text }}</p>
            <div class="review-author">{{ reviews[currentReview].author }}</div>
          </div>
          <div class="carousel-nav" style="margin-top: 2rem;">
            <span v-for="(_, index) in reviews" :key="index"
                  class="nav-dot" :class="{ active: currentReview === index }"
                  @click="currentReview = index"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="footer">
      <div class="section-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>FitHappens</h4>
            <p>Твій персональний стиліст для ідеального образу. Відкривай красу через правильний колір.</p>
          </div>
          <div class="footer-section">
            <h4>Контакти</h4>
              <p>📧 <a href="#" @click.prevent="$router.push('/second')">info@fithappens.ua</a></p>
            <p>📞 +38 (050) 123-45-67</p>
            <p>📍 м. Київ, вул. Модна, 15</p>
          </div>
          <div class="footer-section">
            <h4>Послуги</h4>
            <p><a href="#">Визначення кольоротипу</a></p>
            <p><a href="#">Персональний стайлинг</a></p>
            <p><a href="#">Шопінг-супровід</a></p>
            <p><a href="#">Онлайн консультації</a></p>
          </div>
          <div class="footer-section">
            <h4>Соціальні мережі</h4>
            <p><a href="#">Instagram</a></p>
            <p><a href="#">Facebook</a></p>
            <p><a href="#">Telegram</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 FitHappens. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const currentReview = ref(0)

const colorTypes = ref([
  {
    name: 'Весна',
    description: 'Теплий та світлий кольоротип з золотистими відтінками. Підходять персикові, коралові, золотисті кольори.',
    palette: ['#FFB07A', '#FFD700', '#98FB98', '#FFA07A', '#F0E68C'],
    bgColor: '#FFB07A',
    bgColorDark: '#FF8C42'
  },
  {
    name: 'Літо',
    description: 'Холодний та м\'який кольоротип з сірими підтонами. Ідеальні пастельні та приглушені кольори.',
    palette: ['#B0C4DE', '#DDA0DD', '#F0F8FF', '#E6E6FA', '#D8BFD8'],
    bgColor: '#B0C4DE',
    bgColorDark: '#6495ED'
  },
  {
    name: 'Осінь',
    description: 'Теплий та глибокий кольоротип з золотистими підтонами. Підходять земляні, оранжеві та золотисті відтінки.',
    palette: ['#CD853F', '#DAA520', '#B22222', '#8B4513', '#FF6347'],
    bgColor: '#CD853F',
    bgColorDark: '#A0522D'
  },
  {
    name: 'Зима',
    description: 'Холодний та контрастний кольоротип. Ідеальні яскраві, чисті кольори та класичні поєднання.',
    palette: ['#000080', '#DC143C', '#FFFFFF', '#4169E1', '#8A2BE2'],
    bgColor: '#4169E1',
    bgColorDark: '#000080'
  }
])

const reviews = ref([
  {
    text: "Дякую FitHappens за неймовірну трансформацію! Тепер я точно знаю, які кольори мені підходять, і отримую компліменти щодня. Рекомендую всім!",
    author: "Олена К."
  },
   {
    text: "Вау! Просто вау! Це неймовірно. Після використання рекомендацій від FitHappens, мій гардероб став справжнім витвором мистецтва. Дякую за професіоналізм!",
    author: "Вікторія Перемога"
  },
  {
    text: "Професійний підхід та індивідуальна консультація перевершили всі очікування. Мій гардероб став набагато функціональніше та стильніше.",
    author: "Андрій М."
  },
  {
    text: "Онлайн тест був дуже зручний, а результати — точні! Тепер купую тільки ті речі, які дійсно мені підходять. Економлю час та гроші.",
    author: "Марія В."
  },
  {
    text: "Завдяки визначенню кольоротипу я нарешті знайшла свій стиль. Почуваюся впевненіше та отримую набагато більше компліментів!",
    author: "Ірина Л."
  }
])

// Auto-rotate carousels
let slideInterval
let reviewInterval

onMounted(() => {
  // Auto-rotate color types carousel
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % colorTypes.value.length
  }, 5000)

  // Auto-rotate reviews carousel
  reviewInterval = setInterval(() => {
    currentReview.value = (currentReview.value + 1) % reviews.value.length
  }, 4000)

  // Smooth scroll observer
  const observeElements = document.querySelectorAll('.section')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up')
      }
    })
  })

  observeElements.forEach(el => observer.observe(el))
})

// Clean up intervals when component is unmounted
onUnmounted(() => {
  clearInterval(slideInterval)
  clearInterval(reviewInterval)
})

function scrollTo(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}



body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  color: #00356a;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #00356A 0%, #3286AA 100%);
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="3" fill="rgba(255,255,255,0.05)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: slideInLeft 1s ease 0.3s forwards;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  opacity: 0;
  animation: slideInLeft 1s ease 0.6s forwards;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: slideInRight 1s ease 0.9s forwards;
}

.person-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: auto;
  pointer-events: none;
}

.person-silhouette {
  width: 300px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: relative;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.person-silhouette::before {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  opacity: 0.3;
}

/* Section Styles */
.section {
  padding: 5rem 0;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #3286aa 0%, #2f8db4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* About Section */
.about {
  background: #f8fafc;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
}

/* Color Types Section */
.color-types {
  background: white;
}

.carousel-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto 3rem;
}

.carousel {
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.color-type-card {
  min-width: 100%;
  padding: 3rem;
  text-align: center;
  background: linear-gradient(135deg, var(--bg-color), var(--bg-color-dark));
  color: white;
}

.color-type-card h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.color-type-card p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.color-palette {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.color-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.carousel-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot.active {
  background: #00356a;
  transform: scale(1.2);
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #5f7999 0%, #3286aa 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  border: none;
  cursor: pointer;
}

.cta-button:hover {
  transform: translateY(-3px);
}

/* Reviews Section */
.reviews {
  background: #f8fafc;
}

.reviews-carousel {
  max-width: 800px;
  margin: 0 auto;
}

.review-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 0 1rem;
}

.review-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-style: italic;
  color: #555;
}

.review-author {
  font-weight: 600;
  color: #333;
}

.stars {
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Footer */
.footer {
  background: #1a202c;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #667eea;
}

.footer-section p, .footer-section a {
  color: #a0aec0;
  text-decoration: none;
  line-height: 1.6;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
  color: #a0aec0;
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease forwards;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .nav-menu {
    display: none;
  }

  .section-title {
    font-size: 2rem;
  }

  .person-silhouette {
    width: 200px;
    height: 300px;
  }

  .person-silhouette::before {
    font-size: 5rem;
  }
}
</style>