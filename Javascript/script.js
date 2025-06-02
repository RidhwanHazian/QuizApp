const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status")

let quizCategory = "programming";
let numberOfQuestions = 5;
let currentQuestion = null;
const questionIndexHistory = [];

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
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    !isCorrect ? highlightCorrectAnswer() : "";

    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle': 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    nextQuestionBtn.style.visibility = "visible";

    //Display all answer option
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
}

const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;
    console.log(currentQuestion);

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