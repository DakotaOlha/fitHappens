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

    <button @click="getColorType" :disabled="loading">
      {{ loading ? "Визначаємо..." : "Отримати кольоротип" }}
    </button>

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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const eyes = ref("");
const hair = ref("");
const skin = ref("");
const result = ref("");
const loading = ref(false);

async function getColorType() {
  loading.value = true;
  result.value = "";

  const prompt = `
  Визнач кольоротип людини (Весна, Літо, Осінь або Зима).
  Відповідай тільки одним словом.

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
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("Відповідь API:", data);
    localStorage.setItem("result", data.choices[0].message.content.trim());

    if (data.choices && data.choices.length > 0) {
      result.value = data.choices[0].message.content.trim();
    } else {
      result.value = "Не вдалося отримати результат.";
    }
  } catch (err) {
    console.error("Помилка:", err);
    result.value = "Помилка при зверненні до API.";
  } finally {
    loading.value = false;
  }
}

function goToExamples() {
  router.push("/second");
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
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #91bbd1;
  background: #f9f9f9;
  color: #00356a;
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
}

button:hover:not(:disabled) {
  background: #00356a;
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background: #91bbd1;
  color: #00356a;
}

.next-btn {
  margin-top: 12px;
  background: #00356a;
}

.next-btn:hover {
  background: #001f3f;
}
</style>
