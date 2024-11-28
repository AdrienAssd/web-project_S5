<template>
    <div>
      <h1>HTML Quiz</h1>
      <div v-if="quiz.length">
        <div v-for="(question, index) in quiz" :key="index">
          <p>{{ question.question }}</p>
          <div>
            <label v-for="(option, optIndex) in question.options" :key="optIndex">
              <input
                type="radio"
                :name="'question-' + index"
                :value="option"
                v-model="userAnswers[index]"
              />
              {{ option }}
            </label>
          </div>
        </div>
        <button @click="submitQuiz">Submit Quiz</button>
      </div>
      <div v-else>
        <p>Loading quiz...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        quiz: [],
        userAnswers: [],
      };
    },
    async created() {
      const response = await axios.get("http://localhost:3000/api/quizzes/html");
      this.quiz = response.data;
      this.userAnswers = new Array(this.quiz.length).fill(null);
    },
    methods: {
      submitQuiz() {
        let score = 0;
        this.quiz.forEach((question, index) => {
          if (question.correct_option === this.userAnswers[index]) {
            score++;
          }
        });
        alert(`Your score: ${score}/${this.quiz.length}`);
      },
    },
  };
  </script>
  