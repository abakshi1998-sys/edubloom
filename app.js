// EduBloom Application State
const appState = {
    currentScreen: 'welcome',
    studentName: '',
    studentGrade: '',
    currentQuestion: 0,
    answers: [], // stores answer indices or -1 for skipped
    skippedCount: 0,
    correctCount: 0,
    hintsUsed: 0,
    currentHintIndex: 0,
    currentLevel: 1,
    assessmentCompleted: false,
    confidenceLevel: 'high' // high, medium, low
};

// Sample questions from provided data
const questions = [
    {
        id: 1,
        question: "🔺 Which shape has exactly 3 corners?",
        options: ["⭕ Circle", "⬜ Square", "🔺 Triangle", "🔷 Rectangle"],
        correct: 2,
        level: "K-1",
        subject: "Geometry",
        hints: [
            "Look for the shape with pointed corners!",
            "A triangle has 3 sides and 3 corners.",
            "Count the corners: Triangle = 3 corners"
        ]
    },
    {
        id: 2,
        question: "🔢 What number comes next? 2, 4, 6, ___",
        options: ["7", "8", "9", "10"],
        correct: 1,
        level: "1-2", 
        subject: "Patterns",
        hints: [
            "Look at how the numbers are growing!",
            "Each number is 2 more than the last one.",
            "2+2=4, 4+2=6, so 6+2=8"
        ]
    },
    {
        id: 3,
        question: "🍎 Maya has 5 apples. She eats 2. How many apples are left?",
        options: ["2", "3", "4", "7"],
        correct: 1,
        level: "2-3",
        subject: "Subtraction", 
        hints: [
            "Start with 5 and take away 2.",
            "You can count backwards: 5-1=4, 4-1=3",
            "5 - 2 = 3 apples remaining"
        ]
    },
    {
        id: 4,
        question: "🎵 Which word rhymes with 'sun'?",
        options: ["moon", "fun", "star", "day"],
        correct: 1,
        level: "3-4",
        subject: "Reading",
        hints: [
            "Rhyming words sound similar at the end!",
            "Say each word out loud with 'sun'.",
            "'Sun' and 'fun' both end with '-un' sound"
        ]
    },
    {
        id: 5,
        question: "✖️ What is 6 × 7?",
        options: ["35", "42", "48", "54"],
        correct: 1,
        level: "4-5",
        subject: "Multiplication",
        hints: [
            "Think about counting by 6s seven times!",
            "6×7 is the same as 6+6+6+6+6+6+6",
            "6×7 = 42"
        ]
    },
    {
        id: 6,
        question: "🧮 Which fraction equals one half?",
        options: ["1/4", "1/2", "2/4", "Both B and C"],
        correct: 3,
        level: "5th",
        subject: "Fractions",
        hints: [
            "One half means 1 out of 2 equal parts.",
            "2/4 is the same as 1/2 when simplified.",
            "Both 1/2 and 2/4 represent the same amount!"
        ]
    }
];

// Level descriptions from provided data
const levelDescriptions = {
    "L1": "🌱 Just Starting - Building Foundation",
    "L2": "🌿 Growing Strong - Basic Skills",
    "L3": "🌳 Developing Well - Core Knowledge", 
    "L4": "🌟 Making Progress - Solid Understanding",
    "L5": "⭐ Good Work - Intermediate Skills",
    "L6": "🎯 Excellent - Advanced Learning",
    "L7": "🏆 Outstanding - Expert Level",
    "L8": "👑 Mastery - Ready for Challenges"
};

// Motivational messages from provided data
const motivationalMessages = [
    "🌟 Great thinking! You're doing awesome!",
    "💪 Way to use your brain power!",
    "🎉 Fantastic effort! Keep it up!",
    "✨ You're learning and growing!",
    "🚀 Amazing work! You're on fire!",
    "🎈 Wonderful! Your brain is getting stronger!"
];

// Screen management with smooth transitions
function showScreen(screenName) {
    console.log(`Switching to screen: ${screenName}`);
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        setTimeout(() => {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
            appState.currentScreen = screenName;
            
            // Focus management for accessibility
            manageFocus(screenName);
            
            console.log(`Successfully switched to screen: ${screenName}`);
        }, 150);
    } else {
        console.error(`Screen not found: ${screenName}-screen`);
    }
}

// Focus management for accessibility
function manageFocus(screenName) {
    switch(screenName) {
        case 'setup':
            const nameInput = document.getElementById('student-name');
            if (nameInput) nameInput.focus();
            break;
        case 'assessment':
            setTimeout(() => {
                const firstOption = document.querySelector('.option-button');
                if (firstOption) firstOption.focus();
            }, 200);
            break;
        case 'results':
            const restartBtn = document.getElementById('restart-btn');
            if (restartBtn) restartBtn.focus();
            break;
    }
}

// Handle logo click to return to welcome screen
function handleLogoClick() {
    console.log('Logo clicked!');
    if (appState.currentScreen === 'assessment' && !appState.assessmentCompleted) {
        // Show warning if in the middle of assessment
        if (confirm('🌟 Are you sure you want to go back to the start? Your progress will be lost!')) {
            resetToWelcome();
        }
    } else {
        resetToWelcome();
    }
}

// Reset to welcome screen
function resetToWelcome() {
    // Reset form
    const nameInput = document.getElementById('student-name');
    const gradeSelect = document.getElementById('grade-select');
    if (nameInput) nameInput.value = '';
    if (gradeSelect) gradeSelect.value = '';
    
    // Reset state
    appState.studentName = '';
    appState.studentGrade = '';
    resetAssessment();
    
    // Go to welcome screen
    showScreen('welcome');
    showNotification('Welcome back to EduBloom! 🌟', 'info');
}

// Handle start button click
function handleStartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Start button clicked - navigating to setup screen');
    showScreen('setup');
    playSound('button');
}

// Handle setup form submission
function handleSetupSubmit(e) {
    e.preventDefault();
    console.log('Setup form submitted');
    
    const nameInput = document.getElementById('student-name');
    const gradeSelect = document.getElementById('grade-select');
    const name = nameInput ? nameInput.value.trim() : '';
    const grade = gradeSelect ? gradeSelect.value : '';
    
    if (!name || !grade) {
        showNotification('Please enter your name and select your grade! 🌟', 'warning');
        return;
    }
    
    appState.studentName = name;
    appState.studentGrade = grade;
    
    // Reset assessment state
    resetAssessment();
    
    // Start assessment with celebration
    showNotification(`Welcome ${name}! Let's start your learning adventure! 🚀`, 'success');
    showScreen('assessment');
    startAssessment();
}

// Reset assessment state
function resetAssessment() {
    appState.currentQuestion = 0;
    appState.answers = [];
    appState.skippedCount = 0;
    appState.correctCount = 0;
    appState.hintsUsed = 0;
    appState.currentHintIndex = 0;
    appState.currentLevel = 1;
    appState.assessmentCompleted = false;
    appState.confidenceLevel = 'high';
    
    // Reset UI
    updateLevelLadder(1);
    updateProgressBar(0);
    
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const hintDisplay = document.getElementById('hint-display');
    
    if (nextBtn) nextBtn.disabled = true;
    if (submitBtn) submitBtn.classList.add('hidden');
    if (hintDisplay) hintDisplay.classList.add('hidden');
    
    resetHintSystem();
}

// Start assessment
function startAssessment() {
    const studentGreeting = document.getElementById('student-greeting');
    if (studentGreeting) {
        studentGreeting.textContent = `Hi ${appState.studentName}! 👋`;
    }
    updateEncouragementMessage();
    displayQuestion();
}

// Display current question with animations
function displayQuestion() {
    const questionIndex = appState.currentQuestion;
    const question = questions[questionIndex];
    
    if (!question) {
        handleAssessmentComplete();
        return;
    }
    
    console.log(`Displaying question ${questionIndex + 1}: ${question.question}`);
    
    // Update UI with smooth transitions
    const currentQuestionSpan = document.getElementById('current-question');
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = questionIndex + 1;
    }
    
    updateProgressBar(((questionIndex + 1) / questions.length) * 100);
    
    // Animate question text
    const questionText = document.getElementById('question-text');
    if (questionText) {
        questionText.style.opacity = '0';
        setTimeout(() => {
            questionText.textContent = question.question;
            questionText.style.opacity = '1';
        }, 200);
    }
    
    // Clear and populate options with staggered animations
    const questionOptions = document.getElementById('question-options');
    if (questionOptions) {
        questionOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            setTimeout(() => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option;
                button.setAttribute('data-index', index);
                button.addEventListener('click', () => selectOption(index));
                questionOptions.appendChild(button);
                
                // Animate in
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    button.style.transition = 'all 0.3s ease';
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }
    
    // Reset interaction states
    resetQuestionState();
    resetHintSystem();
    updateEncouragementMessage();
}

// Reset question interaction state
function resetQuestionState() {
    const nextBtn = document.getElementById('next-btn');
    const skipBtn = document.getElementById('skip-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (nextBtn) nextBtn.disabled = true;
    if (skipBtn) skipBtn.disabled = false;
    appState.currentHintIndex = 0;
    
    // Show submit button after Q1
    if ((appState.currentQuestion >= 1 || appState.answers.length > 0) && submitBtn) {
        submitBtn.classList.remove('hidden');
    }
}

// Handle option selection with enhanced feedback
function selectOption(optionIndex) {
    console.log(`Option selected: ${optionIndex}`);
    
    // Clear previous selections
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Mark selected option with animation
    const questionOptions = document.getElementById('question-options');
    if (questionOptions && questionOptions.children[optionIndex]) {
        const selectedButton = questionOptions.children[optionIndex];
        selectedButton.classList.add('selected');
        
        // Add selection animation
        selectedButton.style.transform = 'scale(1.05)';
        setTimeout(() => {
            selectedButton.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Store answer
    appState.answers[appState.currentQuestion] = optionIndex;
    
    // Enable next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.disabled = false;
    
    // Show submit button after Q1
    const submitBtn = document.getElementById('submit-btn');
    if (appState.currentQuestion >= 0 && submitBtn) {
        submitBtn.classList.remove('hidden');
    }
    
    // Provide immediate positive feedback
    const currentQuestion = questions[appState.currentQuestion];
    if (optionIndex === currentQuestion.correct) {
        showNotification(getRandomMotivationalMessage(), 'success');
        playSound('correct');
    } else {
        showNotification("Great try! Every answer helps us learn about you! 🌟", 'info');
        playSound('neutral');
    }
    
    // Update level and encouragement
    updateCurrentLevel();
    updateEncouragementMessage();
}

// Handle skip action
function handleSkip() {
    console.log('Question skipped');
    appState.answers[appState.currentQuestion] = -1;
    appState.skippedCount++;
    
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (nextBtn) nextBtn.disabled = false;
    
    // Show submit button after Q1
    if (appState.currentQuestion >= 0 && submitBtn) {
        submitBtn.classList.remove('hidden');
    }
    
    // Provide encouraging feedback for skipping
    showNotification("No problem! Skipping is okay - you're still doing great! 💫", 'info');
    
    // Update level (slightly impacted by skipping)
    updateCurrentLevel();
    updateConfidenceLevel('medium');
    updateEncouragementMessage();
    
    playSound('skip');
}

// Hint System Implementation
function resetHintSystem() {
    const hintBtn = document.getElementById('hint-btn');
    const hintDisplay = document.getElementById('hint-display');
    
    if (hintBtn) {
        hintBtn.textContent = "💡 Need a Hint?";
        hintBtn.disabled = false;
    }
    if (hintDisplay) hintDisplay.classList.add('hidden');
    appState.currentHintIndex = 0;
}

function handleHintRequest() {
    console.log('Hint requested');
    const currentQuestion = questions[appState.currentQuestion];
    const hints = currentQuestion.hints;
    
    if (appState.currentHintIndex < hints.length) {
        const hintText = document.getElementById('hint-text');
        const currentHintSpan = document.getElementById('current-hint');
        const hintDisplay = document.getElementById('hint-display');
        const hintBtn = document.getElementById('hint-btn');
        
        // Show current hint
        if (hintText) hintText.textContent = hints[appState.currentHintIndex];
        if (currentHintSpan) currentHintSpan.textContent = appState.currentHintIndex + 1;
        if (hintDisplay) hintDisplay.classList.remove('hidden');
        
        // Update hint button
        appState.currentHintIndex++;
        appState.hintsUsed++;
        
        if (hintBtn) {
            if (appState.currentHintIndex < hints.length) {
                hintBtn.textContent = `💡 Next Hint (${appState.currentHintIndex + 1}/3)`;
            } else {
                hintBtn.textContent = "💡 All hints used!";
                hintBtn.disabled = true;
            }
        }
        
        // Provide encouraging feedback for using hints
        showNotification("Smart thinking! Using hints shows you want to learn! 🧠", 'info');
        updateConfidenceLevel('medium');
        playSound('hint');
    }
}

// Handle next question
function handleNext() {
    console.log('Moving to next question');
    appState.currentQuestion++;
    
    if (appState.currentQuestion >= questions.length) {
        handleAssessmentComplete();
    } else {
        displayQuestion();
        celebrateProgress();
    }
    
    playSound('next');
}

// Handle assessment submission
function handleSubmit() {
    console.log('Assessment submitted');
    showNotification("Great job completing your assessment! 🎉", 'success');
    handleAssessmentComplete();
    playSound('complete');
}

// Calculate current level based on performance
function updateCurrentLevel() {
    const answered = appState.answers.filter(answer => answer !== -1).length;
    const correct = appState.answers.filter((answer, index) => {
        return answer !== -1 && answer === questions[index].correct;
    }).length;
    
    if (answered === 0) {
        appState.currentLevel = 1;
    } else {
        // Enhanced level calculation
        const correctPercentage = correct / answered;
        const answerBonus = Math.min(answered * 0.5, 3); // Bonus for attempting questions
        const hintPenalty = (appState.hintsUsed * 0.2); // Small penalty for hints
        const skipPenalty = (appState.skippedCount * 0.5); // Penalty for skipping
        
        let baseLevel = (correctPercentage * 5) + 1; // Base level from accuracy
        baseLevel += answerBonus; // Reward for participation
        baseLevel -= hintPenalty; // Small penalty for hints (learning aid)
        baseLevel -= skipPenalty; // Penalty for skipping
        
        appState.currentLevel = Math.min(8, Math.max(1, Math.round(baseLevel)));
    }
    
    updateLevelLadder(appState.currentLevel);
    
    // Update correct count for display
    appState.correctCount = appState.answers.filter((answer, index) => {
        return answer !== -1 && answer === questions[index].correct;
    }).length;
}

// Update visual level ladder with animations
function updateLevelLadder(targetLevel) {
    const ladderSteps = document.querySelectorAll('.ladder-step');
    
    ladderSteps.forEach((step, index) => {
        const level = 8 - index; // L8 is first, L1 is last
        
        setTimeout(() => {
            step.classList.remove('active', 'completed');
            
            if (level === targetLevel) {
                step.classList.add('active');
                // Add celebratory animation for level up
                if (level > 1) {
                    addSparkleEffect(step);
                }
            } else if (level < targetLevel) {
                step.classList.add('completed');
            }
        }, index * 50);
    });
}

// Update progress bar
function updateProgressBar(percentage) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

// Confidence and encouragement system
function updateConfidenceLevel(level) {
    appState.confidenceLevel = level;
}

function updateEncouragementMessage() {
    const messages = {
        high: [
            "🌟 You're doing amazing! Keep up the fantastic work!",
            "💫 Your thinking skills are really shining today!",
            "🚀 Wow! You're really mastering these questions!"
        ],
        medium: [
            "💪 You're working so hard - that's what matters most!",
            "🌈 Every answer teaches us something new about you!",
            "✨ Great effort! You're growing your brain!"
        ],
        low: [
            "🌱 Every learner grows at their own pace - you're doing great!",
            "💝 We believe in you! Take your time and do your best!",
            "🎈 You're braver than you know - keep trying!"
        ]
    };
    
    const levelMessages = messages[appState.confidenceLevel];
    const randomMessage = levelMessages[Math.floor(Math.random() * levelMessages.length)];
    const encouragementMessage = document.getElementById('encouragement-message');
    if (encouragementMessage) {
        encouragementMessage.textContent = randomMessage;
    }
}

function getRandomMotivationalMessage() {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
}

// Handle assessment completion
function handleAssessmentComplete() {
    console.log('Assessment completed');
    appState.assessmentCompleted = true;
    
    // Calculate final statistics
    const answeredQuestions = appState.answers.filter(answer => answer !== -1).length;
    const correctAnswers = appState.answers.filter((answer, index) => {
        return answer !== -1 && answer === questions[index].correct;
    }).length;
    
    appState.correctCount = correctAnswers;
    
    // Determine if retest is needed (if too many questions were skipped)
    const minimumAnswered = Math.ceil(questions.length * 0.5); // At least 50% answered
    const needsRetest = answeredQuestions < minimumAnswered;
    
    if (needsRetest) {
        showRetestResult(answeredQuestions);
    } else {
        showSuccessResult(answeredQuestions, correctAnswers);
    }
    
    showScreen('results');
    addCelebrationEffects();
}

// Show success results with celebration
function showSuccessResult(answeredQuestions, correctAnswers) {
    const successResult = document.getElementById('success-result');
    const retestResult = document.getElementById('retest-result');
    const finalLevelText = document.getElementById('final-level-text');
    const resultsMessage = document.getElementById('results-message');
    const answeredCount = document.getElementById('answered-count');
    const correctCount = document.getElementById('correct-count');
    const hintsUsedCount = document.getElementById('hints-used-count');
    
    if (successResult) successResult.classList.remove('hidden');
    if (retestResult) retestResult.classList.add('hidden');
    
    const finalLevel = `L${appState.currentLevel}`;
    const levelDescription = levelDescriptions[finalLevel];
    
    if (finalLevelText) finalLevelText.textContent = `${finalLevel}: ${levelDescription}`;
    if (resultsMessage) resultsMessage.textContent = `Wonderful work, ${appState.studentName}! 🌟 Based on your amazing effort, we've found your perfect learning level. You're ready for ${levelDescription.toLowerCase().replace(/[🌱🌿🌳🌟⭐🎯🏆👑]\s*/, '')}!`;
    
    if (answeredCount) answeredCount.textContent = answeredQuestions;
    if (correctCount) correctCount.textContent = correctAnswers;
    if (hintsUsedCount) hintsUsedCount.textContent = appState.hintsUsed;
    
    // Add celebration animation
    setTimeout(() => {
        addCelebrationEffects();
    }, 500);
}

// Show retest results
function showRetestResult(answeredQuestions) {
    const successResult = document.getElementById('success-result');
    const retestResult = document.getElementById('retest-result');
    const retestAnsweredCount = document.getElementById('retest-answered-count');
    const retestSkippedCount = document.getElementById('retest-skipped-count');
    
    if (successResult) successResult.classList.add('hidden');
    if (retestResult) retestResult.classList.remove('hidden');
    
    if (retestAnsweredCount) retestAnsweredCount.textContent = answeredQuestions;
    if (retestSkippedCount) retestSkippedCount.textContent = appState.skippedCount;
}

// Celebration and progress tracking
function celebrateProgress() {
    const progressPercentage = ((appState.currentQuestion) / questions.length) * 100;
    
    // Milestone celebrations
    if (progressPercentage === 50) {
        showNotification("🎉 Halfway there! You're doing incredible!", 'success');
    } else if (progressPercentage === 80) {
        showNotification("⭐ Almost finished! You're a superstar!", 'success');
    }
}

// Visual effects (simplified to avoid visual artifacts)
function addSparkleEffect(element = null) {
    // Simplified sparkle effect to avoid unintended animations
    console.log('✨ Sparkle effect triggered');
}

function addCelebrationEffects() {
    console.log('🎉 Celebration effects triggered');
}

// Audio feedback simulation
function playSound(type) {
    const soundEmojis = {
        button: '🔊',
        correct: '🎵',
        neutral: '🔔',
        skip: '🔇',
        hint: '💡',
        next: '▶️',
        complete: '🎉'
    };
    
    console.log(`Playing sound: ${soundEmojis[type] || '🔊'} ${type}`);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    `;
    
    const colors = {
        success: '#4ECDC4',
        info: '#8B7ED8',
        warning: '#FFD93D',
        error: '#FF8A80'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.style.color = type === 'warning' ? '#2D3748' : 'white';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts for accessibility
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (appState.currentScreen === 'assessment') {
            // Number keys 1-4 to select options
            if (e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const optionIndex = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option-button');
                if (options[optionIndex] && !options[optionIndex].classList.contains('selected')) {
                    selectOption(optionIndex);
                }
            }
            
            // H for hint
            if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                const hintBtn = document.getElementById('hint-btn');
                if (hintBtn && !hintBtn.disabled) {
                    handleHintRequest();
                }
            }
            
            // S for skip
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                const skipBtn = document.getElementById('skip-btn');
                if (skipBtn && !skipBtn.disabled) {
                    handleSkip();
                }
            }
            
            // Enter to proceed
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextBtn = document.getElementById('next-btn');
                const submitBtn = document.getElementById('submit-btn');
                if (nextBtn && !nextBtn.disabled) {
                    handleNext();
                } else if (submitBtn && !submitBtn.classList.contains('hidden')) {
                    handleSubmit();
                }
            }
        }
    });
}

// Handle restart
function handleRestart() {
    console.log('Restarting application');
    resetToWelcome();
}

// Real-time form validation
function setupFormValidation() {
    const studentNameInput = document.getElementById('student-name');
    if (studentNameInput) {
        studentNameInput.addEventListener('input', function() {
            // Keep only letters and spaces for names
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
            
            // Capitalize first letter
            if (this.value.length > 0) {
                this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
            }
        });
    }
}

// Initialize application
function initApp() {
    console.log('Initializing EduBloom app...');
    
    // Set up logo click handler with proper error handling
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', handleLogoClick);
        logoContainer.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
            }
        });
        
        // Make logo focusable for accessibility
        logoContainer.setAttribute('tabindex', '0');
        logoContainer.setAttribute('role', 'button');
        logoContainer.setAttribute('aria-label', 'EduBloom logo - click to return to welcome screen');
        
        console.log('Logo click handler set up successfully');
    } else {
        console.error('Logo container not found!');
    }
    
    // Set up start button with multiple event handling approaches
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', handleStartClick);
        startBtn.addEventListener('mousedown', handleStartClick);
        startBtn.addEventListener('touchstart', handleStartClick);
        
        // Also try with a slight delay to ensure DOM is fully ready
        setTimeout(() => {
            startBtn.removeEventListener('click', handleStartClick);
            startBtn.addEventListener('click', handleStartClick);
        }, 100);
        
        console.log('Start button event handlers set up successfully');
    } else {
        console.error('Start button not found!');
        
        // Try to find it with a delay
        setTimeout(() => {
            const delayedStartBtn = document.getElementById('start-btn');
            if (delayedStartBtn) {
                delayedStartBtn.addEventListener('click', handleStartClick);
                console.log('Start button found and configured with delay');
            } else {
                console.error('Start button still not found after delay');
            }
        }, 1000);
    }

    // Set up setup form
    const setupForm = document.getElementById('setup-form');
    if (setupForm) {
        setupForm.addEventListener('submit', handleSetupSubmit);
        console.log('Setup form handler set up successfully');
    }

    // Set up other button event listeners
    const hintBtn = document.getElementById('hint-btn');
    const skipBtn = document.getElementById('skip-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    if (hintBtn) hintBtn.addEventListener('click', handleHintRequest);
    if (skipBtn) skipBtn.addEventListener('click', handleSkip);
    if (nextBtn) nextBtn.addEventListener('click', handleNext);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    if (restartBtn) restartBtn.addEventListener('click', handleRestart);
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Form validation
    setupFormValidation();
    
    // Initialize first screen
    showScreen('welcome');
    
    console.log('App initialized successfully!');
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

// Add notification styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded with multiple fallbacks
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting app initialization');
    initApp();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to EduBloom! Click "Start Your Learning Adventure" to begin! 🌟', 'success');
    }, 1000);
});

// Backup initialization in case DOMContentLoaded doesn't fire
window.addEventListener('load', function() {
    console.log('Window loaded - backup initialization');
    if (!document.querySelector('.screen.active')) {
        initApp();
    }
});

// Another backup with timeout
setTimeout(() => {
    if (!document.querySelector('.screen.active')) {
        console.log('Timeout backup initialization');
        initApp();
    }
}, 2000);