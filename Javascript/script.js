const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME = 15;
let currentTime = QUIZ_TIME;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 5;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;


const showQuizResult = () => {
    quizContainer.style.display ="none";
    resultContainer.style.display = "block";

    const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> question correctly. Greate effort!.`;
    document.querySelector(".result-message").innerHTML = resultText;
}

//Reset timer
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
            quizContainer.querySelector(".quiz-timer").style.background = "#C31402";
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
            
        }
    }, 1000);
}

//Fetch random question based on category
const getRandomQuestion = () => {
    const categoryQuestion = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    if(questionIndexHistory.length >= Math.min(categoryQuestion.length, numberOfQuestions)){
        return showQuizResult();
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

    !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

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
    quizContainer.querySelector(".quiz-timer").style.background = "#32313C";
    document.querySelector(".quiz-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    //Create option <li> elements and append them
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index));
    });
}

//Start quiz
const startQuiz = () => {
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    //Update quiz category and number of question
    quizCategory = configContainer.querySelector(".category.active").textContent;
    numberOfQuestions = parseInt(configContainer.querySelector(".question.active").textContent);

    renderQuestion();
}

//Highlightt selected options
document.querySelectorAll(".category, .question").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

//Restart quiz
const resetQuiz = () => {
    resetTimer();
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    configContainer.style.display = "block";
    resultContainer.style.display = "none";
}

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);
