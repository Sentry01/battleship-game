import './styles.css';
import { GameState } from './game/gameState.js';
import { AIPlayer } from './game/aiPlayer.js';

class BattleshipGame {
  constructor() {
    this.gameState = new GameState();
    this.aiPlayer = new AIPlayer('medium');
    this.app = document.getElementById('app');
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.app.innerHTML = `
      <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-black mb-2">Battleship</h1>
            <p class="text-dark text-lg">Test your strategy against AI</p>
          </header>

          ${this.renderGameSetup()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderGameSetup() {
    return `
      <div class="card p-8 rounded-card animate-slide-in">
        <h2 class="text-3xl font-bold text-black mb-6">Game Setup</h2>
        
        <div class="mb-6">
          <label class="block text-dark font-semibold mb-3 text-lg">AI Difficulty</label>
          <select id="difficulty" class="w-full p-4 border-2 border-gray-300 rounded-card bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all">
            <option value="easy">Easy - Random targeting</option>
            <option value="medium" selected>Medium - Basic strategy</option>
            <option value="hard">Hard - Advanced probability targeting</option>
          </select>
        </div>

        <div class="mb-8">
          <label class="block text-dark font-semibold mb-3 text-lg">Ship Placement</label>
          <div class="flex gap-4">
            <button id="randomPlacement" class="flex-1 btn-primary text-white py-4 px-6 rounded-card font-semibold">
              Random Placement
            </button>
            <button id="manualPlacement" class="flex-1 btn-secondary bg-white text-black py-4 px-6 rounded-card border-2 border-black font-semibold">
              Manual Placement
            </button>
          </div>
        </div>

        <button id="startGame" class="w-full btn-primary text-white py-4 px-6 rounded-card font-bold text-lg">
          Start Game
        </button>
      </div>
    `;
  }

  renderGameBoard() {
    const gameBoardHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" id="gameBoard">
        <div class="card p-6 rounded-card">
          <h3 class="text-2xl font-bold text-black mb-4">Your Fleet</h3>
          ${this.renderGrid(this.gameState.playerGrid, 'player')}
          <div class="mt-4 text-base text-dark font-medium">
            <p>Your ships: ${this.gameState.playerShips.filter(s => !s.sunk).length}/5 remaining</p>
          </div>
        </div>

        <div class="card p-6 rounded-card">
          <h3 class="text-2xl font-bold text-black mb-4">AI Fleet</h3>
          ${this.renderGrid(this.gameState.playerAttacks, 'ai')}
          <div class="mt-4 text-base text-dark font-medium">
            <p>AI ships: ${this.gameState.aiShips.filter(s => !s.sunk).length}/5 remaining</p>
          </div>
        </div>
      </div>

      <div class="mt-8 status-bar text-white p-6 rounded-card">
        <p id="gameStatus" class="text-center text-xl font-semibold">
          ${this.gameState.currentPlayer === 'player' ? 'Your turn - Click on AI grid to attack' : 'AI is thinking...'}
        </p>
      </div>

      <div class="mt-6 flex gap-4">
        <button id="restartGame" class="flex-1 btn-secondary bg-white text-black py-4 px-6 rounded-card border-2 border-black font-semibold">
          New Game
        </button>
        <button id="backToSetup" class="flex-1 btn-secondary bg-light text-black py-4 px-6 rounded-card border-2 border-gray-300 font-semibold">
          Back to Setup
        </button>
      </div>
    `;
    return gameBoardHTML;
  }

  updateGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    if (gameBoard) {
      gameBoard.innerHTML = `
        <div class="card p-6 rounded-card">
          <h3 class="text-2xl font-bold text-black mb-4">Your Fleet</h3>
          ${this.renderGrid(this.gameState.playerGrid, 'player')}
          <div class="mt-4 text-base text-dark font-medium">
            <p>Your ships: ${this.gameState.playerShips.filter(s => !s.sunk).length}/5 remaining</p>
          </div>
        </div>

        <div class="card p-6 rounded-card">
          <h3 class="text-2xl font-bold text-black mb-4">AI Fleet</h3>
          ${this.renderGrid(this.gameState.playerAttacks, 'ai')}
          <div class="mt-4 text-base text-dark font-medium">
            <p>AI ships: ${this.gameState.aiShips.filter(s => !s.sunk).length}/5 remaining</p>
          </div>
        </div>
      `;
      this.attachEventListeners();
    }
  }

  renderGrid(grid, type) {
    const attackRecord = type === 'player' ? this.gameState.aiAttacks : this.gameState.playerAttacks;
    
    const cells = grid.map((row, rowIndex) => 
      row.map((cell, colIndex) => {
        let cellClass = 'grid-cell w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-sm font-semibold cursor-pointer rounded-md';
        let cellContent = '';
        let tabIndex = '0';
        let ariaLabel = `Cell ${rowIndex}, ${colIndex}`;
        
        if (type === 'player') {
          // Show player's ships and AI's attacks
          if (attackRecord[rowIndex][colIndex] === 'hit') {
            cellClass += ' hit';
            cellContent = '✕';
            ariaLabel += ' - Hit by AI';
          } else if (attackRecord[rowIndex][colIndex] === 'miss') {
            cellClass += ' miss';
            cellContent = '○';
            ariaLabel += ' - Missed by AI';
          } else if (cell) {
            cellClass += ' ship';
            cellContent = cell[0];
            ariaLabel += ` - ${cell}`;
          }
        } else {
          // Show player's attacks on AI grid
          if (cell === 'hit') {
            cellClass += ' hit';
            cellContent = '✕';
            ariaLabel += ' - Hit';
          } else if (cell === 'miss') {
            cellClass += ' miss';
            cellContent = '○';
            ariaLabel += ' - Miss';
          }
        }

        return `<div class="${cellClass}" data-row="${rowIndex}" data-col="${colIndex}" data-type="${type}" tabindex="${tabIndex}" role="button" aria-label="${ariaLabel}">${cellContent}</div>`;
      }).join('')
    ).join('');

    return `<div class="grid grid-cols-10 gap-2 mx-auto" style="max-width: 480px;">${cells}</div>`;
  }

  renderGameOver() {
    const winner = this.gameState.winner;
    const message = winner === 'player' ? '🎉 You Win!' : '💥 AI Wins!';
    const messageClass = winner === 'player' ? 'text-accent' : 'text-dark';

    return `
      <div class="card p-10 rounded-card text-center animate-slide-in">
        <h2 class="text-4xl font-bold ${messageClass} mb-4">${message}</h2>
        <p class="text-dark text-xl mb-8">Game Over</p>
        
        <div class="flex gap-4">
          <button id="playAgain" class="flex-1 btn-primary text-white py-4 px-6 rounded-card font-bold text-lg">
            Play Again
          </button>
          <button id="backToSetupGameOver" class="flex-1 btn-secondary bg-white text-black py-4 px-6 rounded-card border-2 border-black font-bold text-lg">
            Back to Setup
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const difficultySelect = document.getElementById('difficulty');
    const randomPlacementBtn = document.getElementById('randomPlacement');
    const manualPlacementBtn = document.getElementById('manualPlacement');
    const startGameBtn = document.getElementById('startGame');

    if (difficultySelect) {
      difficultySelect.addEventListener('change', (e) => {
        this.aiPlayer = new AIPlayer(e.target.value);
      });
    }

    if (randomPlacementBtn) {
      randomPlacementBtn.addEventListener('click', () => {
        this.setupRandomGame();
      });
    }

    if (manualPlacementBtn) {
      manualPlacementBtn.addEventListener('click', () => {
        // Manual placement coming soon - using random placement for now
        this.setupRandomGame();
      });
    }

    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Grid click handlers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('grid-cell') && e.target.dataset.type === 'ai') {
        this.handlePlayerAttack(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
      }
    });

    // Grid keyboard handlers for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('grid-cell') && e.target.dataset.type === 'ai') {
          e.preventDefault();
          this.handlePlayerAttack(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
        }
      }
    });

    // Game control buttons
    document.addEventListener('click', (e) => {
      if (e.target.id === 'restartGame') {
        this.gameState.reset();
        this.aiPlayer.reset();
        this.setupRandomGame();
        this.startGame();
      } else if (e.target.id === 'backToSetup' || e.target.id === 'backToSetupGameOver') {
        this.gameState.reset();
        this.aiPlayer.reset();
        this.render();
      } else if (e.target.id === 'playAgain') {
        this.gameState.reset();
        this.aiPlayer.reset();
        this.setupRandomGame();
        this.startGame();
      }
    });
  }

  setupRandomGame() {
    const playerPlaced = this.gameState.placeAllShipsRandomly(this.gameState.playerGrid, this.gameState.playerShips);
    const aiPlaced = this.gameState.placeAllShipsRandomly(this.gameState.aiGrid, this.gameState.aiShips);

    if (!playerPlaced || !aiPlaced) {
      alert('Failed to place ships randomly. Please try again.');
      return false;
    }

    return true;
  }

  startGame() {
    if (!this.setupRandomGame()) {
      return;
    }

    this.gameState.currentPlayer = 'player';
    this.app.innerHTML = `
      <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-black mb-2">Battleship</h1>
            <p class="text-dark text-lg">Test your strategy against AI</p>
          </header>

          ${this.renderGameBoard()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  handlePlayerAttack(row, col) {
    if (this.gameState.currentPlayer !== 'player' || this.gameState.gameOver) {
      return;
    }

    const result = this.gameState.processAttack(row, col, this.gameState.aiGrid, this.gameState.aiShips, this.gameState.playerAttacks);

    if (!result.success) {
      return;
    }

    if (result.hit) {
      this.aiPlayer.recordHit(row, col);
    } else {
      this.aiPlayer.recordMiss(row, col);
    }

    this.updateGameStatus(result.message);
    this.updateGameBoard(); // Update to show player attack

    if (this.gameState.checkGameOver()) {
      this.renderGameOverScreen();
      return;
    }

    this.gameState.currentPlayer = 'ai';
    this.updateGameStatus('AI is thinking...');

    setTimeout(() => {
      this.handleAITurn();
    }, 1000);
  }

  handleAITurn() {
    if (this.gameState.gameOver) {
      return;
    }

    const target = this.aiPlayer.getTarget(this.gameState.playerGrid, this.gameState.aiAttacks);
    const result = this.gameState.processAttack(target.row, target.col, this.gameState.playerGrid, this.gameState.playerShips, this.gameState.aiAttacks);

    if (result.hit) {
      this.aiPlayer.recordHit(target.row, target.col);
    } else {
      this.aiPlayer.recordMiss(target.row, target.col);
    }

    this.updateGameStatus(`AI attacks (${target.row}, ${target.col}): ${result.message}`);
    this.updateGameBoard(); // Update to show AI attack

    if (this.gameState.checkGameOver()) {
      this.renderGameOverScreen();
      return;
    }

    this.gameState.currentPlayer = 'player';
    this.updateGameStatus('Your turn - Click on AI grid to attack');
  }

  updateGameStatus(message) {
    const statusElement = document.getElementById('gameStatus');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  renderGameOverScreen() {
    this.app.innerHTML = `
      <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-black mb-2">Battleship</h1>
            <p class="text-dark text-lg">Test your strategy against AI</p>
          </header>

          ${this.renderGameOver()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BattleshipGame();
});