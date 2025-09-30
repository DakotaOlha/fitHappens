<template>
  <div class="color-type">
    <h2>Визначення кольоротипу</h2>

    <label>
      Який у вас колір очей?
      <input v-model="eyes" placeholder="Наприклад: карі" />
    </label>

    <label>
      Колір волосся?
      <input v-model="hair" placeholder="Наприклад: русяве" />
    </label>    

    <label>
      Відтінок шкіри?
      <input v-model="skin" placeholder="Наприклад: світла" />
    </label>

    <button @click="getColorType" :disabled="loading || !isFormValid">
      {{ loading ? "Визначаємо..." : "Отримати кольоротип" }}
    </button>

    <!-- Показуємо помилку, якщо є -->
    <div v-if="error" class="error">
      <p>❌ {{ error }}</p>
    </div>

    <div v-if="result" class="result">
      <h3>Ваш кольоротип:</h3>
      <p>{{ result }}</p>
      <button class="next-btn" @click="goToExamples">
        Перейти до примірок
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const eyes = ref("");
const hair = ref("");
const skin = ref("");
const result = ref("");
const loading = ref(false);
const error = ref("");

// Перевірка, чи всі поля заповнені
const isFormValid = computed(() => {
  return eyes.value.trim() && hair.value.trim() && skin.value.trim();
});

async function getColorType() {
  // Скидаємо попередні результати та помилки
  loading.value = true;
  result.value = "";
  error.value = "";

  // Перевірка наявності API ключа
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ API ключ не знайдено в .env файлі!');
    error.value = "API ключ не налаштований. Додайте VITE_OPENAI_API_KEY в .env файл";
    loading.value = false;
    return;
  }

  console.log('🔑 API ключ знайдено:', apiKey.substring(0, 10) + '...');

  const prompt = `
Визнач кольоротип людини (Весна, Літо, Осінь або Зима).
Відповідай тільки одним словом з цих чотирьох варіантів.

Дані:
- Очі: ${eyes.value}
- Волосся: ${hair.value}
- Шкіра: ${skin.value}
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`, 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Ти експерт з визначення кольоротипів. Відповідай тільки одним словом: Весна, Літо, Осінь або Зима."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      }),
    });

    console.log('📡 Статус відповіді:', response.status);

    // Обробка помилки 401 (невірний ключ)
    if (response.status === 401) {
      const errorData = await response.json();
      console.error('❌ 401 Помилка автентифікації:', errorData);
      error.value = "Невірний OpenAI API ключ. Перевірте ваш ключ у .env файлі";
      loading.value = false;
      return;
    }

    // Обробка інших помилок API
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API помилка:', errorData);
      error.value = errorData.error?.message || "Помилка при зверненні до API";
      loading.value = false;
      return;
    }

    const data = await response.json();
    console.log('✅ Відповідь API:', data);

    // КРИТИЧНА ПЕРЕВІРКА: чи є відповідь від API
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Некоректна структура відповіді:', data);
      error.value = "API повернув некоректну відповідь";
      loading.value = false;
      return;
    }

    // Отримання та збереження результату
    const colorTypeResult = data.choices[0].message.content.trim();
    console.log('🎨 Результат:', colorTypeResult);
    
    result.value = colorTypeResult;
    localStorage.setItem("result", colorTypeResult);

  } catch (err) {
    console.error("❌ Помилка запиту:", err);
    error.value = `Помилка з'єднання: ${err.message}`;
  } finally {
    loading.value = false;
  }
}

function goToExamples() {
  if (result.value) {
    router.push("/second");
  }
}
</script>

<style scoped>
.color-type {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, #00356a, #3286aa);
  padding: 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 500;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #91bbd1;
  background: #f9f9f9;
  color: #00356a;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3286aa;
  box-shadow: 0 0 0 3px rgba(50, 134, 170, 0.2);
}

button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #3286aa;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #00356a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
  transform: none;
}

.error {
  padding: 12px;
  border-radius: 8px;
  background: #ff4444;
  color: white;
  font-weight: 500;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.result {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background: #91bbd1;
  color: #00356a;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.result p {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: bold;
}

.next-btn {
  margin-top: 12px;
  background: #00356a;
  width: 100%;
}

.next-btn:hover {
  background: #001f3f;
}
</style>