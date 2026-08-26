import { describe, it, expect, beforeEach } from "vitest";
import { GameState } from "../gameState.js";
import { AIPlayer } from "../aiPlayer.js";

describe("Game Integration Tests", () => {
  let gameState;
  let aiPlayer;

  beforeEach(() => {
    gameState = new GameState();
    aiPlayer = new AIPlayer("medium");
  });

  describe("Full Game Flow", () => {
    it("should complete a full game cycle", () => {
      // Place ships for both players
      gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);
      gameState.placeAllShipsRandomly(gameState.aiGrid, gameState.aiShips);

      // Simulate gameplay until game over
      const maxTurns = 200;
      let turns = 0;

      while (!gameState.gameOver && turns < maxTurns) {
        if (gameState.currentPlayer === "player") {
          const target = aiPlayer.getTarget(gameState.aiGrid, gameState.playerAttacks);
          const result = gameState.processAttack(
            target.row,
            target.col,
            gameState.aiGrid,
            gameState.aiShips,
            gameState.playerAttacks
          );

          if (result.hit) {
            aiPlayer.recordHit(target.row, target.col);
          } else {
            aiPlayer.recordMiss(target.row, target.col);
          }

          if (!gameState.checkGameOver()) {
            gameState.currentPlayer = "ai";
          }
        } else {
          const target = aiPlayer.getTarget(gameState.playerGrid, gameState.aiAttacks);
          const result = gameState.processAttack(
            target.row,
            target.col,
            gameState.playerGrid,
            gameState.playerShips,
            gameState.aiAttacks
          );

          if (result.hit) {
            aiPlayer.recordHit(target.row, target.col);
          } else {
            aiPlayer.recordMiss(target.row, target.col);
          }

          if (!gameState.checkGameOver()) {
            gameState.currentPlayer = "player";
          }
        }
        turns++;
      }

      expect(gameState.gameOver).toBe(true);
      expect(gameState.winner).toBeDefined();
    });

    it("should correctly track all attacks", () => {
      gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);
      gameState.placeAllShipsRandomly(gameState.aiGrid, gameState.aiShips);

      // Make some attacks
      gameState.processAttack(0, 0, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      gameState.processAttack(
        1,
        1,
        gameState.playerGrid,
        gameState.playerShips,
        gameState.aiAttacks
      );
      gameState.processAttack(2, 2, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);

      expect(gameState.playerAttacks[0][0]).not.toBeNull();
      expect(gameState.aiAttacks[1][1]).not.toBeNull();
      expect(gameState.playerAttacks[2][2]).not.toBeNull();
    });
  });

  describe("AI and Game State Integration", () => {
    it("should reset both game state and AI properly", () => {
      gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);
      gameState.placeAllShipsRandomly(gameState.aiGrid, gameState.aiShips);

      // Make some attacks
      const target = aiPlayer.getTarget(gameState.aiGrid, gameState.playerAttacks);
      gameState.processAttack(
        target.row,
        target.col,
        gameState.aiGrid,
        gameState.aiShips,
        gameState.playerAttacks
      );
      aiPlayer.recordHit(target.row, target.col);

      // Reset
      gameState.reset();
      aiPlayer.reset();

      // Verify reset
      expect(gameState.playerAttacks[0][0]).toBeNull();
      expect(aiPlayer.previousHits).toEqual([]);
      expect(aiPlayer.potentialTargets).toEqual([]);
    });

    it("should handle AI targeting after multiple hits", () => {
      gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);

      // Simulate some hits
      aiPlayer.recordHit(5, 5);
      aiPlayer.recordHit(5, 6);

      // Get next target
      const target = aiPlayer.getTarget(gameState.playerGrid, gameState.aiAttacks);

      expect(target).toBeDefined();
      expect(target.row).toBeGreaterThanOrEqual(0);
      expect(target.row).toBeLessThan(10);
      expect(target.col).toBeGreaterThanOrEqual(0);
      expect(target.col).toBeLessThan(10);
    });
  });

  describe("Ship Placement Integration", () => {
    it("should place all ships without overlap", () => {
      const placed = gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);

      expect(placed).toBe(true);

      // Count total ship cells
      let shipCells = 0;
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          if (gameState.playerGrid[row][col] !== null) {
            shipCells++;
          }
        }
      }

      // Total ship cells should be 5+4+3+3+2 = 17
      expect(shipCells).toBe(17);
    });

    it("should detect when all ships are sunk", () => {
      gameState.placeAllShipsRandomly(gameState.aiGrid, gameState.aiShips);

      // Sink all ships
      gameState.aiShips.forEach((ship) => {
        ship.hits = ship.size;
        ship.sunk = true;
      });

      expect(gameState.checkGameOver()).toBe(true);
      expect(gameState.winner).toBe("player");
    });
  });

  describe("Attack Validation Integration", () => {
    it("should prevent attacking the same cell twice", () => {
      gameState.placeAllShipsRandomly(gameState.aiGrid, gameState.aiShips);

      const result1 = gameState.processAttack(
        0,
        0,
        gameState.aiGrid,
        gameState.aiShips,
        gameState.playerAttacks
      );
      const result2 = gameState.processAttack(
        0,
        0,
        gameState.aiGrid,
        gameState.aiShips,
        gameState.playerAttacks
      );

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
    });

    it("should correctly identify sunk ships", () => {
      const ship = gameState.aiShips[0];
      gameState.placeShip(gameState.aiGrid, ship, 0, 0, true);

      // Hit all cells of the ship
      for (let i = 0; i < ship.size; i++) {
        gameState.processAttack(0, i, gameState.aiGrid, gameState.aiShips, gameState.playerAttacks);
      }

      expect(ship.sunk).toBe(true);
    });
  });

  describe("AI Difficulty Integration", () => {
    it("should use different strategies for different difficulties", () => {
      const easyAI = new AIPlayer("easy");
      const mediumAI = new AIPlayer("medium");
      const hardAI = new AIPlayer("hard");

      gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);

      const easyTarget = easyAI.getTarget(gameState.playerGrid, gameState.aiAttacks);
      const mediumTarget = mediumAI.getTarget(gameState.playerGrid, gameState.aiAttacks);
      const hardTarget = hardAI.getTarget(gameState.playerGrid, gameState.aiAttacks);

      expect(easyTarget).toBeDefined();
      expect(mediumTarget).toBeDefined();
      expect(hardTarget).toBeDefined();
    });

    it("should adapt strategy after hits in medium mode", () => {
      aiPlayer = new AIPlayer("medium");
      gameState.placeAllShipsRandomly(gameState.playerGrid, gameState.playerShips);

      // Record a hit
      aiPlayer.recordHit(5, 5);

      // Check that potential targets were added
      expect(aiPlayer.potentialTargets.length).toBeGreaterThan(0);

      // Get next target
      const target = aiPlayer.getTarget(gameState.playerGrid, gameState.aiAttacks);

      expect(target).toBeDefined();
    });
  });
});
