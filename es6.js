class PuzzleTimer {
    constructor(onTick, onComplete) {
      this.duration = 30;
      this.timeLeft = this.duration;
      this.onTick = onTick;
      this.onComplete = onComplete;
      this.interval = null;
    }
  
    start = () => {
      this.interval = setInterval(() => {
        this.timeLeft--;
        this.onTick(this.timeLeft);
        
        if (this.timeLeft <= 0) {
          this.stop();
          this.onComplete();
        }
      }, 1000);
    };
  
    stop = () => {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    };
  
    reset = () => {
      this.stop();
      this.timeLeft = this.duration;
    };
  }
  
  const puzzles = {
    math: {
      id: 'math',
      name: 'Math Matrix',
      icon: '🧮',
      color: 'math',
      generate: () => {
        const operations = [
          { q: 'What is 15 + 27?', a: '42', h: 'Break it down: 15 + 20 + 7' },
          { q: 'Calculate: 8 × 9', a: '72', h: 'Think of it as 8 × 10 - 8' },
          { q: 'What is 144 ÷ 12?', a: '12', h: 'How many 12s fit in 144?' },
          { q: 'Solve: 25² - 600', a: '25', h: '25² = 625, then subtract 600' },
          { q: 'What is 2³ + 3²?', a: '17', h: '2³ = 8, 3² = 9, add them' }
        ];
        return operations[Math.floor(Math.random() * operations.length)];
      }
    },
    
    logic: {
      id: 'logic',
      name: 'Logic Circuit',
      icon: '🧩',
      color: 'logic',
      generate: () => {
        const logicPuzzles = [
          { q: 'If all roses are flowers and some flowers are red, can all roses be red?', a: 'yes', h: 'Think about logical possibilities' },
          { q: 'Complete the pattern: 2, 4, 8, 16, ?', a: '32', h: 'Each number doubles' },
          { q: 'A = 1, B = 2, C = 3... What is the value of "CAB"?', a: '312', h: 'C=3, A=1, B=2' },
          { q: 'If CYBER = 12345, what is RACE?', a: '4125', h: 'R=4, A=1, C=2, E=5' },
          { q: 'Next in sequence: Z, Y, X, W, ?', a: 'v', h: 'Going backwards through alphabet' }
        ];
        return logicPuzzles[Math.floor(Math.random() * logicPuzzles.length)];
      }
    },
    
    word: {
      id: 'word',
      name: 'Word Processor',
      icon: '📝',
      color: 'word',
      generate: () => {
        const wordPuzzles = [
          { q: 'Anagram of "LISTEN"', a: 'silent', h: 'Rearrange the letters' },
          { q: 'What 5-letter word becomes shorter when you add 2 letters?', a: 'short', h: 'Think literally about the word "shorter"' },
          { q: 'Reverse "STRESSED" to find a dessert', a: 'desserts', h: 'Spell it backwards' },
          { q: 'What word starts with E, ends with E, but has only one letter?', a: 'envelope', h: 'Think about what contains letters' },
          { q: 'Complete: "The quick brown ___ jumps"', a: 'fox', h: 'Famous typing phrase' }
        ];
        return wordPuzzles[Math.floor(Math.random() * wordPuzzles.length)];
      }
    },
    
    pattern: {
      id: 'pattern',
      name: 'Pattern Engine',
      icon: '🔄',
      color: 'pattern',
      generate: () => {
        const patternPuzzles = [
          { q: 'Sequence: 1, 1, 2, 3, 5, 8, ?', a: '13', h: 'Each number is sum of previous two' },
          { q: 'Pattern: AZ, BY, CX, ?', a: 'dw', h: 'First letter goes up, second goes down' },
          { q: 'Numbers: 2, 6, 12, 20, 30, ?', a: '42', h: 'Differences: 4, 6, 8, 10, 12' },
        ];
        return patternPuzzles[Math.floor(Math.random() * patternPuzzles.length)];
      }
    },
  };
  
  let gameState = {
    currentRoom: null,
    score: 0,
    hintsUsed: 0,
    completedRooms: new Set(),
    timeLeft: 30,
    isPlaying: false,
    currentPuzzle: null,
    playerName: '',
    combo: 0
  };
  
  let timer = null;
  
  const elements = {
    nameSection: document.getElementById('nameSection'),
    roomSelection: document.getElementById('roomSelection'),
    puzzleSection: document.getElementById('puzzleSection'),
    completionSection: document.getElementById('completionSection'),
    gameStats: document.getElementById('gameStats'),
    playerNameInput: document.getElementById('playerNameInput'),
    scoreValue: document.getElementById('scoreValue'),
    timeValue: document.getElementById('timeValue'),
    hintsValue: document.getElementById('hintsValue'),
    roomValue: document.getElementById('roomValue'),
    puzzleTitle: document.getElementById('puzzleTitle'),
    puzzleQuestion: document.getElementById('puzzleQuestion'),
    answerInput: document.getElementById('answerInput'),
    answerForm: document.getElementById('answerForm'),
    hintContainer: document.getElementById('hintContainer'),
    hintText: document.getElementById('hintText'),
    hintBtn: document.getElementById('hintBtn'),
    timerText: document.getElementById('timerText'),
    timerCircle: document.getElementById('timerCircle'),
    toastContainer: document.getElementById('toastContainer'),
    completionMessage: document.getElementById('completionMessage'),
    finalScore: document.getElementById('finalScore'),
    finalHints: document.getElementById('finalHints'),
    finalRooms: document.getElementById('finalRooms')
  };
  

  
  const generatePuzzle = (roomId) => {
    const puzzleType = puzzles[roomId];
    if (!puzzleType) return null;
    
    return {
      ...puzzleType.generate(),
      type: roomId,
      id: `${roomId}_${Date.now()}`
    };
  };
  const startRoom = (roomId) => {
    const roomOrder = ['math', 'logic', 'word', 'pattern', 'room3'];
    const roomIndex = roomOrder.indexOf(roomId);

if (roomIndex > 0) {
  const previousRoom = roomOrder[roomIndex - 1];
  if (!gameState.completedRooms.has(previousRoom)) {
    showToast(`🚫 You must solve "${puzzles[previousRoom].name}" first!`, 'warning');
    return;
  }
}

    gameState.currentRoom = roomId;
    gameState.currentPuzzle = generatePuzzle(roomId);
    gameState.isPlaying = true;
    gameState.timeLeft = 30;
    
    if (!gameState.currentPuzzle) {
      showToast('Error generating puzzle!', 'error');
      return;
    }
    
    if (timer) timer.stop();
    timer = new PuzzleTimer(
      (time) => updateTimer(time),
      () => handleTimeUp()
    );
    
    showSection('puzzleSection');
    displayPuzzle();
    timer.start();
    updateStats();
    
    elements.answerInput.focus();
    showToast(`${puzzles[roomId].name} activated!`, 'success');
  };
  
  const displayPuzzle = () => {
    if (!gameState.currentPuzzle) return;
    
    const puzzleInfo = puzzles[gameState.currentPuzzle.type];
    elements.puzzleTitle.textContent = `${puzzleInfo.icon} ${puzzleInfo.name}`;
    elements.puzzleQuestion.textContent = gameState.currentPuzzle.q;
    elements.answerInput.value = '';
    elements.hintContainer.style.display = 'none';
    elements.hintBtn.disabled = false;
  };
  
  const checkAnswer = (input) => {
    if (!gameState.currentPuzzle) return false;
    
    const userAnswer = input.toLowerCase().trim();
    const correctAnswer = gameState.currentPuzzle.a.toLowerCase().trim();
    
    return userAnswer === correctAnswer;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const input = elements.answerInput.value.trim();
    if (!input) {
      showToast('Please enter an answer!', 'warning');
      return;
    }
    
    if (checkAnswer(input)) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };
  
  const handleCorrectAnswer = () => {
    if (timer) timer.stop();
    
   
    const timeBonus = gameState.timeLeft * 10;
    const comboBonus = gameState.combo * 50;
    const totalPoints = 100 + timeBonus + comboBonus;
    
    gameState.score += totalPoints;
    gameState.combo++;
    gameState.completedRooms.add(gameState.currentRoom);
    
    showToast(`Correct! +${totalPoints} points (Combo x${gameState.combo})`, 'success');
     showCongratsBox();
        
    
      
    
    const room2Puzzles = ['math', 'logic', 'word', 'pattern'];
    const allRoom2Completed = room2Puzzles.every(p => gameState.completedRooms.has(p));
    
    if (allRoom2Completed) {
      const room3 = document.getElementById('room3');
      if (room3) {
        room3.classList.remove('locked');
        room3.querySelector('p').textContent = 'Ready for the final challenge?';
      }
    }
     
    if (gameState.completedRooms.size >= 4) {
      setTimeout(() => showCompletion(), 1500);
    } else {
      setTimeout(() => {
        showSection('roomSelection');
        updateStats();
      }, 1500);
    }
  
      
  };
  function goToRoom3() {
    const room2Puzzles = [ 'math','logic', 'word', 'pattern']; 
  
    
    const allRoom2Completed = room2Puzzles.every(p => gameState.completedRooms.has(p));
  
    if (!allRoom2Completed) {
      alert("🚫 Please complete all challenges in Room 2 to unlock Room 3.");
      return;
    }
  
      
    
    window.location.href = 'room3.html';
  }
  const handleIncorrectAnswer = () => {
    gameState.combo = 0;
    showToast('Incorrect answer. Try again!', 'error');
    elements.answerInput.value = '';
    elements.answerInput.focus();
  };
  
  const handleTimeUp = () => {
    gameState.combo = 0;
    showToast('Time\'s up! Try another room.', 'warning');
    setTimeout(() => {
      showSection('roomSelection');
      updateStats();
    }, 2000);
  };
  
  const useHint = () => {
    if (!gameState.currentPuzzle) return;
    
    gameState.hintsUsed++;
    gameState.score = Math.max(0, gameState.score - 25);
    
    elements.hintText.textContent = gameState.currentPuzzle.h;
    elements.hintContainer.style.display = 'block';
    elements.hintBtn.disabled = true;
    
    updateStats();
    showToast('Hint revealed! -25 points', 'warning');
  };
  
  const updateTimer = (time) => {
    gameState.timeLeft = time;
    elements.timerText.textContent = time;
    elements.timeValue.textContent = time;
    
   
    elements.timerCircle.className = 'timer-circle';
    if (time <= 10) {
      elements.timerCircle.classList.add('danger');
    } else if (time <= 20) {
      elements.timerCircle.classList.add('warning');
    }
  };
  
  const updateStats = () => {
    elements.scoreValue.textContent = gameState.score.toLocaleString();
    elements.timeValue.textContent = gameState.timeLeft;
    elements.hintsValue.textContent = gameState.hintsUsed;
    elements.roomValue.textContent = `${gameState.completedRooms.size}/4`;
  };
  
  const showSection = (section) => {
  
    Object.values(elements).forEach(el => {
      if (el && el.style && (el.id.includes('Section') || el.id.includes('section'))) {
        el.style.display = 'none';
      }
    });
 
    const targetElement = elements[section] || document.getElementById(section);
    if (targetElement) {
      targetElement.style.display = 'block';
    }
  };
  
  const goBackToRooms = () => {
    if (timer) timer.stop();
    gameState.isPlaying = false;
    showSection('roomSelection');
    updateStats();
  };
  
  const viewCompletedRooms = () => {
    const completed = Array.from(gameState.completedRooms);
    const message = completed.length > 0 
      ? `Completed: ${completed.map(id => puzzles[id].name).join(', ')}`
      : 'No rooms completed yet!';
    showToast(message, 'success');
  };
  
  const showCompletion = () => {
    showSection('completionSection');
    
    elements.completionMessage.textContent = 
      `Congratulations, ${gameState.playerName}! You've mastered all puzzle rooms with incredible skill!`;
    elements.finalScore.textContent = gameState.score.toLocaleString();
    elements.finalHints.textContent = gameState.hintsUsed;
    elements.finalRooms.textContent = `${gameState.completedRooms.size}/4`;
    
    showToast('🎉 MISSION ACCOMPLISHED! 🎉', 'success');
  };
  
  const resetGame = () => {
    if (timer) timer.stop();
    
    gameState = {
      currentRoom: null,
      score: 0,
      hintsUsed: 0,
      completedRooms: new Set(),
      timeLeft: 30,
      isPlaying: false,
      currentPuzzle: null,
      playerName: '',
      combo: 0
    };
    
    elements.playerNameInput.value = '';
    elements.gameStats.style.display = 'none';
    showSection('nameSection');
    updateStats();
    showToast('Game reset! Ready for a new challenge?', 'success');
  };
  
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
   
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  };
  

  window.addEventListener('beforeunload', () => {
    if (timer) timer.stop();
  });
  const showCongratsBox = () => {
    const box = document.getElementById("congratsBox");
    if (box) box.classList.remove("hidden");
  };
  
  const closeCongratsBox = () => {
    const box = document.getElementById("congratsBox");
    if (box) box.classList.add("hidden");
    showSection('roomSelection');
  };
  document.addEventListener('DOMContentLoaded', () => {
    showSection('roomSelection'); 
    elements.gameStats.style.display = 'flex';
    updateStats();
    showToast('Welcome! Choose your first challenge.', 'success');
  });

localStorage.setItem("room2Completed", "true");

