import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../gameState.js';

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('initialization', () => {
    it('should create empty grids of correct size', () => {
      expect(gameState.playerGrid).toHaveLength(10);
      expect(gameState.playerGrid[0]).toHaveLength(10);
      expect(gameState.aiGrid).toHaveLength(10);
      expect(gameState.aiGrid[0]).toHaveLength(10);
    });

    it('should initialize with correct number of ships', () => {
      expect(gameState.playerShips).toHaveLength(5);
      expect(gameState.aiShips).toHaveLength(5);
    });

    it('should have ships with correct sizes', () => {
      const shipSizes = gameState.playerShips.map(ship => ship.size);
      expect(shipSizes).toContain(5); // Carrier
      expect(shipSizes).toContain(4); // Battleship
      expect(shipSizes).toContain(3); // Cruiser
      expect(shipSizes).toContain(3); // Submarine
      expect(shipSizes).toContain(2); // Destroyer
    });
  });

  describe('ship placement', () => {
    it('should place ship horizontally correctly', () => {
      const ship = gameState.playerShips[0];
      const placed = gameState.placeShip(gameState.playerGrid, ship, 0, 0, true);
      
      expect(placed).toBe(true);
      expect(gameState.playerGrid[0][0]).toBe('Carrier');
      expect(gameState.playerGrid[0][1]).toBe('Carrier');
      expect(gameState.playerGrid[0][2]).toBe('Carrier');
      expect(gameState.playerGrid[0][3]).toBe('Carrier');
      expect(gameState.playerGrid[0][4]).toBe('Carrier');
    });

    it('should place ship vertically correctly', () => {
      const ship = gameState.playerShips[0];
      const placed = gameState.placeShip(gameState.playerGrid, ship, 0, 0, false);
      
      expect(placed).toBe(true);
      expect(gameState.playerGrid[0][0]).toBe('Carrier');
      expect(gameState.playerGrid[1][0]).toBe('Carrier');
      expect(gameState.playerGrid[2][0]).toBe('Carrier');
      expect(gameState.playerGrid[3][0]).toBe('Carrier');
      expect(gameState.playerGrid[4][0]).toBe('Carrier');
    });

    it('should reject invalid horizontal placement', () => {
      const ship = gameState.playerShips[0];
      const placed = gameState.placeShip(gameState.playerGrid, ship, 0, 8, true);
      
      expect(placed).toBe(false);
    });

    it('should reject placement on occupied cells', () => {
      const ship1 = gameState.playerShips[0];
      const ship2 = gameState.playerShips[1];
      
      gameState.placeShip(gameState.playerGrid, ship1, 0, 0, true);
      const placed = gameState.placeShip(gameState.playerGrid, ship2, 0, 0, true);
      
      expect(placed).toBe(false);
    });

    it('should place all ships randomly successfully', () => {
      const testGrid = gameState.createEmptyGrid();
      const testShips = gameState.initializeShips();
      
      const placed = gameState.placeAllShipsRandomly(testGrid, testShips);
      
      expect(placed).toBe(true);
    });
  });

  describe('attack processing', () => {
    beforeEach(() => {
      gameState.placeShip(gameState.aiGrid, gameState.aiShips[0], 0, 0, true);
    });

    it('should register a hit correctly', () => {
      const result = gameState.processAttack(0, 0, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.message).toBe('Hit!');
      expect(gameState.playerAttacks[0][0]).toBe('hit');
    });

    it('should register a miss correctly', () => {
      const result = gameState.processAttack(1, 1, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      
      expect(result.success).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.message).toBe('Miss!');
      expect(gameState.playerAttacks[1][1]).toBe('miss');
    });

    it('should reject attacking the same position twice', () => {
      gameState.processAttack(0, 0, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      const result = gameState.processAttack(0, 0, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Already attacked this position');
    });

    it('should detect when a ship is sunk', () => {
      const ship = gameState.aiShips[0];
      ship.size = 2; // Make it smaller for testing
      
      gameState.placeShip(gameState.aiGrid, ship, 0, 0, true);
      gameState.processAttack(0, 0, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      const result = gameState.processAttack(0, 1, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      
      expect(result.sunk).toBe('Carrier');
      expect(result.message).toBe('Hit! Carrier sunk!');
    });
  });

  describe('game over detection', () => {
    it('should detect when player wins', () => {
      gameState.aiShips.forEach(ship => {
        ship.hits = ship.size;
        ship.sunk = true;
      });
      
      const gameOver = gameState.checkGameOver();
      
      expect(gameOver).toBe(true);
      expect(gameState.winner).toBe('player');
    });

    it('should detect when AI wins', () => {
      gameState.playerShips.forEach(ship => {
        ship.hits = ship.size;
        ship.sunk = true;
      });
      
      const gameOver = gameState.checkGameOver();
      
      expect(gameOver).toBe(true);
      expect(gameState.winner).toBe('AI');
    });

    it('should not end game when ships remain', () => {
      const gameOver = gameState.checkGameOver();
      
      expect(gameOver).toBe(false);
      expect(gameState.winner).toBeNull();
    });
  });

  describe('game reset', () => {
    it('should reset game state to initial values', () => {
      gameState.processAttack(0, 0, gameState.playerAttacks, gameState.aiShips, gameState.playerAttacks);
      gameState.currentPlayer = 'AI';
      
      gameState.reset();
      
      expect(gameState.currentPlayer).toBe('player');
      expect(gameState.gameOver).toBe(false);
      expect(gameState.winner).toBeNull();
      expect(gameState.playerAttacks[0][0]).toBeNull();
    });
  });
});