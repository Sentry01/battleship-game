export class GameState {
  constructor() {
    this.gridSize = 10;
    this.playerGrid = this.createEmptyGrid();
    this.aiGrid = this.createEmptyGrid();
    this.playerShips = this.initializeShips();
    this.aiShips = this.initializeShips();
    this.playerAttacks = this.createEmptyGrid();
    this.aiAttacks = this.createEmptyGrid();
    this.currentPlayer = 'player';
    this.gameOver = false;
    this.winner = null;
  }

  createEmptyGrid() {
    return Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill(null)
    );
  }

  initializeShips() {
    return [
      { name: 'Carrier', size: 5, hits: 0, sunk: false },
      { name: 'Battleship', size: 4, hits: 0, sunk: false },
      { name: 'Cruiser', size: 3, hits: 0, sunk: false },
      { name: 'Submarine', size: 3, hits: 0, sunk: false },
      { name: 'Destroyer', size: 2, hits: 0, sunk: false }
    ];
  }

  isValidPlacement(grid, ship, row, col, isHorizontal) {
    if (isHorizontal) {
      if (col + ship.size > this.gridSize) return false;
      for (let i = 0; i < ship.size; i++) {
        if (grid[row][col + i] !== null) return false;
      }
    } else {
      if (row + ship.size > this.gridSize) return false;
      for (let i = 0; i < ship.size; i++) {
        if (grid[row + i][col] !== null) return false;
      }
    }
    return true;
  }

  placeShip(grid, ship, row, col, isHorizontal) {
    if (!this.isValidPlacement(grid, ship, row, col, isHorizontal)) {
      return false;
    }

    for (let i = 0; i < ship.size; i++) {
      if (isHorizontal) {
        grid[row][col + i] = ship.name;
      } else {
        grid[row + i][col] = ship.name;
      }
    }
    return true;
  }

  placeAllShipsRandomly(grid, ships) {
    for (const ship of ships) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const row = Math.floor(Math.random() * this.gridSize);
        const col = Math.floor(Math.random() * this.gridSize);
        const isHorizontal = Math.random() < 0.5;

        if (this.placeShip(grid, ship, row, col, isHorizontal)) {
          placed = true;
        }
        attempts++;
      }

      if (!placed) {
        return false;
      }
    }
    return true;
  }

  processAttack(row, col, defenderGrid, defenderShips, attackRecord) {
    if (attackRecord[row][col] !== null) {
      return { success: false, message: 'Already attacked this position' };
    }

    const target = defenderShips.find(ship => ship.name === defenderGrid[row][col]);
    
    if (target) {
      target.hits++;
      attackRecord[row][col] = 'hit';
      
      if (target.hits >= target.size) {
        target.sunk = true;
        return { success: true, hit: true, sunk: target.name, message: `Hit! ${target.name} sunk!` };
      }
      
      return { success: true, hit: true, message: 'Hit!' };
    } else {
      attackRecord[row][col] = 'miss';
      return { success: true, hit: false, message: 'Miss!' };
    }
  }

  checkGameOver() {
    const allPlayerShipsSunk = this.playerShips.every(ship => ship.sunk);
    const allAiShipsSunk = this.aiShips.every(ship => ship.sunk);

    if (allPlayerShipsSunk) {
      this.gameOver = true;
      this.winner = 'AI';
      return true;
    }

    if (allAiShipsSunk) {
      this.gameOver = true;
      this.winner = 'player';
      return true;
    }

    return false;
  }

  reset() {
    this.playerGrid = this.createEmptyGrid();
    this.aiGrid = this.createEmptyGrid();
    this.playerShips = this.initializeShips();
    this.aiShips = this.initializeShips();
    this.playerAttacks = this.createEmptyGrid();
    this.aiAttacks = this.createEmptyGrid();
    this.currentPlayer = 'player';
    this.gameOver = false;
    this.winner = null;
  }
}