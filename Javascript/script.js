const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");

const QUIZ_TIME = 15;
let currentTime = QUIZ_TIME;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 5;
let currentQuestion = null;
const questionIndexHistory = [];

const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME;
    timerDisplay.textContent = `${currentTime}s`;
}

//Quiz timer
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if(currentTime <= 0){

            clearInterval(timer);
            highlightCorrectAnswer();
            
            nextQuestionBtn.style.visibility = "visible";
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
            
        }
    }, 1000);
}

//Fetch random question based on category
const getRandomQuestion = () => {
    const categoryQuestion = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    if(questionIndexHistory.length >= Math.min(categoryQuestion.length, numberOfQuestions)){
        return console.log("Quiz completed!");
    }
    //Filter already asked question
    const availableQuestions = categoryQuestion.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    questionIndexHistory.push(categoryQuestion.indexOf(randomQuestion));
    return randomQuestion;
}

//Highlight correct answer
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    !isCorrect ? highlightCorrectAnswer() : "";

    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle': 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    //Display all answer option
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
    nextQuestionBtn.style.visibility = "visible";
}

const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;

    resetTimer();
    startTimer();
    //Update UI
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector(".quiz-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`

    //Create option <li> elements and append them
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index))
    });
}

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);