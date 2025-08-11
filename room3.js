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
    typing: {
      id: 'typing',
      name: 'Typing Challenge',
      icon: '⌨️',
      color: 'typing',
      generate: () => {
        const sentences = [
          { q: 'Type: "Learning never exhausts the mind."', a: 'Learning never exhausts the mind', h: 'A famous quote by Leonardo da Vinci' },
          { q: 'Type: "The quick brown fox jumps over the lazy dog."', a: 'The quick brown fox jumps over the lazy dog', h: 'Classic sentence with every alphabet' },
          { q: 'Type: "Consistency beats intensity."', a: 'Consistency beats intensity', h: 'Small efforts daily > big bursts rarely' },
          { q: 'Type: "JavaScript is fun and versatile"', a: 'JavaScript is fun and versatile', h: 'Async code made easy' },
        ];
        return sentences[Math.floor(Math.random() * sentences.length)];
      }
    },
  
    emoji: {
      id: 'emoji',
      name: 'Emoji Decoder',
      icon: '😎',
      color: 'emoji',
      generate: () => {
        const puzzles = [
          { q: '🚗💨💥 ➡️ ?', a: 'crash', h: 'What happens when car speeds up too fast?' },
          { q: '🦄🌈✨ ➡️ ?', a: 'magic', h: 'Mythical and sparkly' },
          { q: '🍞🥓🍳 ➡️ ?', a: 'breakfast', h: 'Common morning combo' }
        ];
        return puzzles[Math.floor(Math.random() * puzzles.length)];
      }
    },
  
    riddle: {
      id: 'riddle',
      name: 'Riddle Room',
      icon: '🧠',
      color: 'riddle',
      generate: () => {
        const riddles = [
          { q: 'What has to be broken before you can use it?', a: 'egg', h: 'It’s fragile and often eaten for breakfast' },
          { q: 'I’m tall when I’m young, and short when I’m old. What am I?', a: 'candle', h: 'Melts with fire' },
          { q: 'What gets wetter the more it dries?', a: 'towel', h: 'You use it after a bath' },
          { q: 'What has hands but can’t clap?', a: 'clock', h: 'It tells time' },
          { q: 'I speak without a mouth and hear without ears. What am I?', a: 'echo', h: 'Sound reflection' }
        ];
        return riddles[Math.floor(Math.random() * riddles.length)];
      }
    },
  
    scramble: {
        id: 'scramble',
        name: 'Word Scramble',
        icon: '🔀',
        color: 'scramble',
        generate: () => {
          const words = [
            { original: 'planet', hint: 'We live on one of them' },
            { original: 'jungle', hint: 'A dense forest' },
            { original: 'python', hint: 'Programming language and a snake' },
            { original: 'guitar', hint: '6-string musical instrument' },
            { original: 'window', hint: 'You look through it' }
          ];
          const chosen = words[Math.floor(Math.random() * words.length)];
          const scrambled = chosen.original
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('');
          return {
            q: `Unscramble: ${scrambled}`,
            a: chosen.original,
            h: chosen.hint
          };
        }
      }
    }
  
 
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
    const roomOrder = ['typing', 'emoji', 'riddle', 'scramble'];
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
    
  }
  
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
  }
  
  const handleCorrectAnswer = () => {
    if (timer) timer.stop();
    
   
    const timeBonus = gameState.timeLeft * 10;
    const comboBonus = gameState.combo * 50;
    const totalPoints = 100 + timeBonus + comboBonus;
    
    gameState.score += totalPoints;
    gameState.combo++;
    gameState.completedRooms.add(gameState.currentRoom);

    // Set localStorage for room3Completed if current room is 'scramble'
  if (gameState.currentRoom === 'scramble') {
    localStorage.setItem("room3Completed", "true");
  }
  
    showToast(`Correct! +${totalPoints} points (Combo x${gameState.combo})`, 'success');
     showCongratsBox();
        
    
      
   
    if (gameState.completedRooms.size >= 4) {
      setTimeout(() => showCompletion(), 1500);
    } else {
      setTimeout(() => {
        showSection('roomSelection');
        updateStats();
      }, 1500);
    }
  };
  
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
  // Disable copy, cut, paste in answer input
elements.answerInput.addEventListener('copy', (e) => e.preventDefault());
elements.answerInput.addEventListener('cut', (e) => e.preventDefault());
elements.answerInput.addEventListener('paste', (e) => e.preventDefault());

// Disable right click on question and input (optional)
elements.puzzleQuestion.addEventListener('contextmenu', e => e.preventDefault());
elements.answerInput.addEventListener('contextmenu', e => e.preventDefault());

localStorage.setItem("room3Completed", "true");
  
