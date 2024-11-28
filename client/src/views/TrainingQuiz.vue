<template>
  <div>
    <h1>Quiz</h1>
    <div v-for="(quiz, index) in quizzes" :key="quiz.id">
      <h3>{{ quiz.question }}</h3>
      <div v-for="(option, i) in JSON.parse(quiz.options)" :key="i">
        <label>
          <input type="radio" :value="i" :name="`quiz-${index}`" @change="selectOption(quiz.id, i)" />
          {{ option }}
        </label>
      </div>
    </div>
    <button @click="submitAnswers">Submit</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TrainingQuiz', 
  data() {
    return {
      quizzes: [],
      answers: {},
    };
  },
  async created() {
    const { formationId } = this.$route.params;
    const response = await axios.get(`http://localhost:3000/api/quizzes/${formationId}`);
    this.quizzes = response.data;
  },
  methods: {
    selectOption(quizId, option) {
      this.answers[quizId] = option;
    },
    async submitAnswers() {
      for (const quizId in this.answers) {
        await axios.post('http://localhost:3000/api/answers', {
          quiz_id: quizId,
          selected_option: this.answers[quizId],
          is_correct: true,
        });
      }
      alert('Responses recorded.');
    },
  },
};
</script>
