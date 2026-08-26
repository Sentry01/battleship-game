import "./styles.css";
import { GameState } from "./game/gameState.js";
import { AIPlayer } from "./game/aiPlayer.js";

class BattleshipGame {
  constructor() {
    this.gameState = new GameState();
    this.aiPlayer = new AIPlayer("medium");
    this.app = document.getElementById("app");
    this.currentShipIndex = 0;
    this.isHorizontal = true;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.app.innerHTML = `
      <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded-card">
        Skip to main content
      </a>
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main id="main-content" role="main">
            ${this.renderGameSetup()}
          </main>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderGameSetup() {
    return `
      <div class="card p-10 rounded-card animate-slide-in glow-effect" role="region" aria-label="Game setup">
        <h2 class="text-4xl font-bold mb-8 text-gradient" id="setup-title">Game Setup</h2>

        <div class="mb-8">
          <label for="difficulty" class="block text-white font-semibold mb-3 text-lg" id="difficulty-label">AI Difficulty</label>
          <select id="difficulty" class="w-full p-4 rounded-card focus:outline-none transition-all text-lg" aria-labelledby="difficulty-label" aria-describedby="difficulty-description">
            <option value="easy">Easy - Random targeting</option>
            <option value="medium" selected>Medium - Basic strategy</option>
            <option value="hard">Hard - Advanced probability targeting</option>
          </select>
          <p id="difficulty-description" class="text-white/60 text-sm mt-2">Choose how smart the AI opponent should be</p>
        </div>

        <div class="mb-8">
          <span class="block text-white font-semibold mb-3 text-lg" id="placement-label">Ship Placement</span>
          <div class="flex gap-4" role="radiogroup" aria-labelledby="placement-label">
            <button id="randomPlacement" class="flex-1 btn-primary text-white py-4 px-6 rounded-card font-semibold text-lg" aria-pressed="false">
              🎲 Random Placement
            </button>
            <button id="manualPlacement" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold text-lg" aria-pressed="false">
              🎯 Manual Placement
            </button>
          </div>
        </div>

        <button id="startGame" class="w-full btn-primary text-white py-5 px-6 rounded-card font-bold text-xl" aria-describedby="start-hint">
          🚀 Start Game
        </button>
        <p id="start-hint" class="text-white/60 text-sm mt-2 text-center">Choose placement option first</p>
      </div>
    `;
  }

  renderGameBoard() {
    const revealShips = this.gameState.gameOver;
    const gameBoardHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" id="gameBoard">
        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🚢 Your Fleet</h2>
          ${this.renderGrid(this.gameState.playerGrid, "player")}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>Your ships: ${this.gameState.playerShips.filter((s) => !s.sunk).length}/5 remaining</p>
          </div>
        </section>

        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🤖 AI Fleet${revealShips ? " (Revealed)" : ""}</h2>
          ${this.renderGrid(this.gameState.playerAttacks, "ai", revealShips)}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>AI ships: ${this.gameState.aiShips.filter((s) => !s.sunk).length}/5 remaining</p>
          </div>
        </section>
      </div>

      <div class="mt-8 status-bar p-6 rounded-card">
        <p id="gameStatus" class="text-center text-xl font-semibold">
          ${this.gameState.gameOver ? "Game Over" : this.gameState.currentPlayer === "player" ? "Your turn - Click on AI grid to attack" : "AI is thinking..."}
        </p>
      </div>

      <div class="mt-6 flex gap-4">
        <button id="restartGame" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold text-lg">
          🔄 New Game
        </button>
        <button id="backToSetup" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold text-lg">
          ⚙️ Back to Setup
        </button>
      </div>
    `;
    return gameBoardHTML;
  }

  updateGameBoard() {
    const gameBoard = document.getElementById("gameBoard");
    if (gameBoard) {
      const revealShips = this.gameState.gameOver;
      gameBoard.innerHTML = `
        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🚢 Your Fleet</h2>
          ${this.renderGrid(this.gameState.playerGrid, "player")}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>Your ships: ${this.gameState.playerShips.filter((s) => !s.sunk).length}/5 remaining</p>
          </div>
        </section>

        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🤖 AI Fleet${revealShips ? " (Revealed)" : ""}</h2>
          ${this.renderGrid(this.gameState.playerAttacks, "ai", revealShips)}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>AI ships: ${this.gameState.aiShips.filter((s) => !s.sunk).length}/5 remaining</p>
          </div>
        </section>
      `;
      this.attachEventListeners();
    }
  }

  renderGrid(grid, type, revealShips = false) {
    const attackRecord =
      type === "player" ? this.gameState.aiAttacks : this.gameState.playerAttacks;
    const ships = type === "player" ? this.gameState.playerShips : this.gameState.aiShips;
    const actualGrid = type === "player" ? this.gameState.playerGrid : this.gameState.aiGrid;

    const cells = grid
      .map((row, rowIndex) =>
        row
          .map((cell, colIndex) => {
            let cellClass =
              "grid-cell w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-sm font-semibold cursor-pointer rounded-md";
            let cellContent = "";
            const tabIndex = "0";
            let ariaLabel = `Cell ${rowIndex}, ${colIndex}`;

            if (type === "player") {
              // Show player's ships and AI's attacks
              if (attackRecord[rowIndex][colIndex] === "hit") {
                cellClass += " hit";
                cellContent = "✕";
                ariaLabel += " - Hit by AI";
              } else if (attackRecord[rowIndex][colIndex] === "miss") {
                cellClass += " miss";
                cellContent = "○";
                ariaLabel += " - Missed by AI";
              } else if (cell) {
                // Check if this ship is sunk
                const ship = ships.find((s) => s.name === cell);
                if (ship && ship.sunk) {
                  cellClass += " ship-sunk";
                } else {
                  cellClass += " ship";
                }
                cellContent = cell[0];
                ariaLabel += ` - ${cell}`;
              }
            } else {
              // Show player's attacks on AI grid
              if (cell === "hit") {
                cellClass += " hit";
                cellContent = "✕";
                ariaLabel += " - Hit";
              } else if (cell === "miss") {
                cellClass += " miss";
                cellContent = "○";
                ariaLabel += " - Miss";
              } else if (revealShips && actualGrid[rowIndex][colIndex]) {
                // Reveal AI ships on game over
                const ship = ships.find((s) => s.name === actualGrid[rowIndex][colIndex]);
                if (ship && ship.sunk) {
                  cellClass += " ship-sunk";
                } else {
                  cellClass += " ship";
                }
                cellContent = actualGrid[rowIndex][colIndex][0];
                ariaLabel += ` - ${actualGrid[rowIndex][colIndex]}`;
              }
            }

            return `<div class="${cellClass}" data-row="${rowIndex}" data-col="${colIndex}" data-type="${type}" tabindex="${tabIndex}" role="button" aria-label="${ariaLabel}">${cellContent}</div>`;
          })
          .join("")
      )
      .join("");

    return `<div class="grid grid-cols-10 gap-2 mx-auto" style="max-width: 480px;">${cells}</div>`;
  }

  renderGameOver() {
    const winner = this.gameState.winner;
    const message = winner === "player" ? "🎉 You Win!" : "💥 AI Wins!";
    const messageClass = winner === "player" ? "text-gradient" : "text-white";

    return `
      <div class="card p-10 rounded-card text-center animate-slide-in glow-effect">
        <h2 class="text-5xl font-bold ${messageClass} mb-4">${message}</h2>
        <p class="text-white/80 text-xl mb-8">Game Over</p>

        <div class="flex gap-4">
          <button id="playAgain" class="flex-1 btn-primary text-white py-4 px-6 rounded-card font-bold text-lg">
            🔄 Play Again
          </button>
          <button id="backToSetupGameOver" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-bold text-lg">
            ⚙️ Back to Setup
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const difficultySelect = document.getElementById("difficulty");
    const randomPlacementBtn = document.getElementById("randomPlacement");
    const manualPlacementBtn = document.getElementById("manualPlacement");
    const startGameBtn = document.getElementById("startGame");

    if (difficultySelect) {
      difficultySelect.addEventListener("change", (e) => {
        this.aiPlayer = new AIPlayer(e.target.value);
      });
    }

    if (randomPlacementBtn) {
      randomPlacementBtn.addEventListener("click", () => {
        this.setupRandomGame();
      });
    }

    if (manualPlacementBtn) {
      manualPlacementBtn.addEventListener("click", () => {
        this.startManualPlacement();
      });
    }

    if (startGameBtn) {
      startGameBtn.addEventListener("click", () => {
        this.startGame();
      });
    }

    // Grid click handlers
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell") && e.target.dataset.type === "ai") {
        this.handlePlayerAttack(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
      } else if (
        e.target.classList.contains("grid-cell") &&
        e.target.dataset.type === "placement"
      ) {
        this.handlePlacementClick(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
      }
    });

    // Grid keyboard handlers for accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.classList.contains("grid-cell") && e.target.dataset.type === "ai") {
          e.preventDefault();
          this.handlePlayerAttack(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
        } else if (
          e.target.classList.contains("grid-cell") &&
          e.target.dataset.type === "placement"
        ) {
          e.preventDefault();
          this.handlePlacementClick(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
        }
      }
    });

    // Game control buttons
    document.addEventListener("click", (e) => {
      if (e.target.id === "restartGame") {
        this.gameState.reset();
        this.aiPlayer.reset();
        this.setupRandomGame();
        this.startGame();
      } else if (
        e.target.id === "backToSetup" ||
        e.target.id === "backToSetupGameOver" ||
        e.target.id === "backToSetupFromManual"
      ) {
        this.gameState.reset();
        this.aiPlayer.reset();
        this.render();
      } else if (e.target.id === "playAgain") {
        this.gameState.reset();
        this.aiPlayer.reset();
        this.setupRandomGame();
        this.startGame();
      } else if (e.target.id === "rotateShip") {
        this.isHorizontal = !this.isHorizontal;
        this.app.innerHTML = `
          <div class="min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-6xl w-full">
              <header class="text-center mb-8">
                <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
                <p class="text-xl text-white/80">Test your strategy against AI</p>
              </header>

              ${this.renderManualPlacement()}
            </div>
          </div>
        `;
        this.attachEventListeners();
      } else if (e.target.id === "autoPlace") {
        // Place remaining ships randomly
        for (let i = this.currentShipIndex; i < this.gameState.playerShips.length; i++) {
          const ship = this.gameState.playerShips[i];
          let placed = false;
          let attempts = 0;
          const maxAttempts = 100;

          while (!placed && attempts < maxAttempts) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const isHorizontal = Math.random() < 0.5;

            if (this.gameState.placeShip(this.gameState.playerGrid, ship, row, col, isHorizontal)) {
              placed = true;
            }
            attempts++;
          }

          if (!placed) {
            // Show error message instead of alert
            const placementCard = document.querySelector('.card');
            if (placementCard) {
              const errorMsg = document.createElement('div');
              errorMsg.className = 'mt-4 p-4 bg-error/20 border border-error rounded-card text-error animate-fade-in';
              errorMsg.setAttribute('role', 'alert');
              errorMsg.textContent = 'Failed to auto-place ships. Please try manual placement.';
              placementCard.appendChild(errorMsg);
              setTimeout(() => errorMsg.remove(), 3000);
            }
            return;
          }
        }

        // All ships placed, start game
        this.gameState.placeAllShipsRandomly(this.gameState.aiGrid, this.gameState.aiShips);
        this.startGame(true);
      }
    });
  }

  setupRandomGame() {
    this.currentShipIndex = 0;
    this.isHorizontal = true;
    const playerPlaced = this.gameState.placeAllShipsRandomly(
      this.gameState.playerGrid,
      this.gameState.playerShips
    );
    const aiPlaced = this.gameState.placeAllShipsRandomly(
      this.gameState.aiGrid,
      this.gameState.aiShips
    );

    if (!playerPlaced || !aiPlaced) {
      // Show error message instead of alert
      const setupCard = document.querySelector('.card');
      if (setupCard) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'mt-4 p-4 bg-error/20 border border-error rounded-card text-error animate-fade-in';
        errorMsg.setAttribute('role', 'alert');
        errorMsg.textContent = 'Failed to place ships randomly. Please try again.';
        setupCard.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 3000);
      }
      return false;
    }

    return true;
  }

  startGame(skipRandomPlacement = false) {
    if (!skipRandomPlacement && !this.setupRandomGame()) {
      return;
    }

    this.gameState.currentPlayer = "player";
    this.app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main>
            ${this.renderGameBoard()}
          </main>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  handlePlayerAttack(row, col) {
    if (this.gameState.currentPlayer !== "player" || this.gameState.gameOver) {
      return;
    }

    // Show loading state
    this.updateGameStatus("Processing attack...");

    const result = this.gameState.processAttack(
      row,
      col,
      this.gameState.aiGrid,
      this.gameState.aiShips,
      this.gameState.playerAttacks
    );

    if (!result.success) {
      this.updateGameStatus(result.message);
      return;
    }

    if (result.hit) {
      this.aiPlayer.recordHit(row, col);
      if (result.sunk) {
        // Notify AI that a ship was sunk
        const sunkShip = this.gameState.aiShips.find((s) => s.name === result.sunk);
        if (sunkShip) {
          this.aiPlayer.updateRemainingShips(sunkShip.size);
        }
      }
    } else {
      this.aiPlayer.recordMiss(row, col);
    }

    this.updateGameStatus(result.message);
    this.updateGameBoard(); // Update to show player attack

    if (this.gameState.checkGameOver()) {
      this.renderGameOverScreen();
      return;
    }

    this.gameState.currentPlayer = "ai";
    this.updateGameStatus("AI is thinking...");

    setTimeout(() => {
      this.handleAITurn();
    }, 1000);
  }

  handleAITurn() {
    if (this.gameState.gameOver) {
      return;
    }

    const target = this.aiPlayer.getTarget(this.gameState.playerGrid, this.gameState.aiAttacks);
    const result = this.gameState.processAttack(
      target.row,
      target.col,
      this.gameState.playerGrid,
      this.gameState.playerShips,
      this.gameState.aiAttacks
    );

    if (result.hit) {
      this.aiPlayer.recordHit(target.row, target.col);
    } else {
      this.aiPlayer.recordMiss(target.row, target.col);
    }

    this.updateGameStatus(`AI attacks: ${result.message}`);
    this.updateGameBoard(); // Update to show AI attack

    if (this.gameState.checkGameOver()) {
      this.renderGameOverScreen();
      return;
    }

    this.gameState.currentPlayer = "player";
    this.updateGameStatus("Your turn - Click on AI grid to attack");
  }

  updateGameStatus(message) {
    const statusElement = document.getElementById("gameStatus");
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  renderGameOverScreen() {
    this.app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main>
            ${this.renderGameOver()}
          </main>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  startManualPlacement() {
    this.currentShipIndex = 0;
    this.isHorizontal = true;
    this.gameState.playerGrid = this.gameState.createEmptyGrid();
    this.gameState.playerShips = this.gameState.initializeShips();

    this.app.innerHTML = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main>
            ${this.renderManualPlacement()}
          </main>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderManualPlacement() {
    const currentShip = this.gameState.playerShips[this.currentShipIndex];
    const placedCount = this.currentShipIndex;
    const totalShips = this.gameState.playerShips.length;

    return `
      <div class="card p-8 rounded-card animate-slide-in glow-effect">
        <h2 class="text-4xl font-bold mb-6 text-gradient">Place Your Ships</h2>

        <div class="mb-6 text-center">
          <p class="text-white text-lg mb-2">
            Placing: <span class="font-bold text-gradient">${currentShip.name}</span> (Size: ${currentShip.size})
          </p>
          <p class="text-white/70 text-sm">Progress: ${placedCount}/${totalShips} ships placed</p>
        </div>

        <div class="mb-6 flex justify-center gap-4">
          <button id="rotateShip" class="btn-secondary text-white py-3 px-6 rounded-card font-semibold">
            🔄 Rotate (Current: ${this.isHorizontal ? "Horizontal" : "Vertical"})
          </button>
          <button id="autoPlace" class="btn-secondary text-white py-3 px-6 rounded-card font-semibold">
            ⚡ Auto-Place Remaining
          </button>
        </div>

        <div class="mb-6">
          ${this.renderPlacementGrid()}
        </div>

        <div class="mt-6 flex gap-4">
          <button id="backToSetupFromManual" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold">
            ⚙️ Back to Setup
          </button>
        </div>
      </div>
    `;
  }

  renderPlacementGrid() {
    const currentShip = this.gameState.playerShips[this.currentShipIndex];
    const cells = this.gameState.playerGrid
      .map((row, rowIndex) =>
        row
          .map((cell, colIndex) => {
            let cellClass =
              "grid-cell w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-sm font-semibold cursor-pointer rounded-md";
            let cellContent = "";
            let ariaLabel = `Cell ${rowIndex}, ${colIndex}`;

            if (cell) {
              cellClass += " ship";
              cellContent = cell[0];
              ariaLabel += ` - ${cell}`;
            }

            // Show preview of current ship placement
            const preview = this.canPlaceShipAt(rowIndex, colIndex, currentShip, this.isHorizontal);
            if (preview.valid && !cell) {
              cellClass += " bg-green-500/30 border-green-400";
            } else if (!cell) {
              cellClass += " hover:bg-white/10";
            }

            return `<div class="${cellClass}" data-row="${rowIndex}" data-col="${colIndex}" data-type="placement" tabindex="0" role="button" aria-label="${ariaLabel}">${cellContent}</div>`;
          })
          .join("")
      )
      .join("");

    return `<div class="grid grid-cols-10 gap-2 mx-auto" style="max-width: 480px;">${cells}</div>`;
  }

  canPlaceShipAt(row, col, ship, isHorizontal) {
    if (isHorizontal) {
      if (col + ship.size > 10) return { valid: false };
      for (let i = 0; i < ship.size; i++) {
        if (this.gameState.playerGrid[row][col + i] !== null) return { valid: false };
      }
    } else {
      if (row + ship.size > 10) return { valid: false };
      for (let i = 0; i < ship.size; i++) {
        if (this.gameState.playerGrid[row + i][col] !== null) return { valid: false };
      }
    }
    return { valid: true };
  }

  handlePlacementClick(row, col) {
    const currentShip = this.gameState.playerShips[this.currentShipIndex];
    const placed = this.gameState.placeShip(
      this.gameState.playerGrid,
      currentShip,
      row,
      col,
      this.isHorizontal
    );

    if (placed) {
      this.currentShipIndex++;

      if (this.currentShipIndex >= this.gameState.playerShips.length) {
        // All ships placed, start game
        this.gameState.placeAllShipsRandomly(this.gameState.aiGrid, this.gameState.aiShips);
        this.startGame(true);
      } else {
        // Render next ship
        this.app.innerHTML = `
          <div class="min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-6xl w-full">
              <header class="text-center mb-8">
                <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
                <p class="text-xl text-white/80">Test your strategy against AI</p>
              </header>

              ${this.renderManualPlacement()}
            </div>
          </div>
        `;
        this.attachEventListeners();
      }
    }
  }
}

// Initialize the game when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new BattleshipGame();
});
