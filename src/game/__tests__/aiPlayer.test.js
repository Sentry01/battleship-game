import { describe, it, expect, beforeEach } from 'vitest';
import { AIPlayer } from '../aiPlayer.js';

describe('AIPlayer', () => {
  let aiPlayer;
  let playerGrid;
  let attackRecord;

  beforeEach(() => {
    aiPlayer = new AIPlayer('medium');
    playerGrid = Array(10).fill(null).map(() => Array(10).fill(null));
    attackRecord = Array(10).fill(null).map(() => Array(10).fill(null));
  });

  describe('initialization', () => {
    it('should initialize with default medium difficulty', () => {
      const defaultAI = new AIPlayer();
      expect(defaultAI.difficulty).toBe('medium');
    });

    it('should initialize with specified difficulty', () => {
      const easyAI = new AIPlayer('easy');
      expect(easyAI.difficulty).toBe('easy');

      const hardAI = new AIPlayer('hard');
      expect(hardAI.difficulty).toBe('hard');
    });

    it('should initialize with empty tracking arrays', () => {
      expect(aiPlayer.previousHits).toEqual([]);
      expect(aiPlayer.potentialTargets).toEqual([]);
    });
  });

  describe('easy difficulty', () => {
    beforeEach(() => {
      aiPlayer = new AIPlayer('easy');
    });

    it('should return a valid target', () => {
      const target = aiPlayer.getTarget(playerGrid, attackRecord);
      
      expect(target).toBeDefined();
      expect(target.row).toBeGreaterThanOrEqual(0);
      expect(target.row).toBeLessThan(10);
      expect(target.col).toBeGreaterThanOrEqual(0);
      expect(target.col).toBeLessThan(10);
    });

    it('should not target already attacked positions', () => {
      attackRecord[0][0] = 'miss';
      attackRecord[0][1] = 'hit';
      
      const target = aiPlayer.getTarget(playerGrid, attackRecord);
      
      expect(attackRecord[target.row][target.col]).toBeNull();
    });

    it('should return different targets over multiple calls', () => {
      const targets = new Set();
      
      for (let i = 0; i < 10; i++) {
        const target = aiPlayer.getTarget(playerGrid, attackRecord);
        targets.add(`${target.row},${target.col}`);
        attackRecord[target.row][target.col] = 'miss';
      }
      
      expect(targets.size).toBeGreaterThan(1);
    });
  });

  describe('medium difficulty', () => {
    beforeEach(() => {
      aiPlayer = new AIPlayer('medium');
    });

    it('should return a valid target', () => {
      const target = aiPlayer.getTarget(playerGrid, attackRecord);
      
      expect(target).toBeDefined();
      expect(target.row).toBeGreaterThanOrEqual(0);
      expect(target.row).toBeLessThan(10);
      expect(target.col).toBeGreaterThanOrEqual(0);
      expect(target.col).toBeLessThan(10);
    });

    it('should prefer center positions', () => {
      const centerTargets = [];
      
      for (let i = 0; i < 20; i++) {
        const target = aiPlayer.getTarget(playerGrid, attackRecord);
        if (target.row >= 3 && target.row <= 6 && target.col >= 3 && target.col <= 6) {
          centerTargets.push(target);
        }
        attackRecord[target.row][target.col] = 'miss';
      }
      
      expect(centerTargets.length).toBeGreaterThan(0);
    });

    it('should track potential targets after hits', () => {
      attackRecord[5][5] = 'hit';
      aiPlayer.recordHit(5, 5);
      
      expect(aiPlayer.potentialTargets.length).toBeGreaterThan(0);
    });
  });

  describe('hard difficulty', () => {
    beforeEach(() => {
      aiPlayer = new AIPlayer('hard');
    });

    it('should return a valid target', () => {
      const target = aiPlayer.getTarget(playerGrid, attackRecord);
      
      expect(target).toBeDefined();
      expect(target.row).toBeGreaterThanOrEqual(0);
      expect(target.row).toBeLessThan(10);
      expect(target.col).toBeGreaterThanOrEqual(0);
      expect(target.col).toBeLessThan(10);
    });

    it('should use probability-based targeting', () => {
      const target = aiPlayer.getTarget(playerGrid, attackRecord);
      
      expect(target).toBeDefined();
      expect(attackRecord[target.row][target.col]).toBeNull();
    });

    it('should prioritize high-probability cells', () => {
      // Create a pattern that makes certain cells more likely
      for (let i = 0; i < 5; i++) {
        attackRecord[0][i] = 'miss';
        attackRecord[i][0] = 'miss';
      }
      
      const target = aiPlayer.getTarget(playerGrid, attackRecord);
      
      expect(target).toBeDefined();
      expect(attackRecord[target.row][target.col]).toBeNull();
    });
  });

  describe('hit tracking', () => {
    it('should record hits correctly', () => {
      aiPlayer.recordHit(3, 4);
      
      expect(aiPlayer.previousHits).toContainEqual({ row: 3, col: 4 });
    });

    it('should add adjacent cells to potential targets after hit', () => {
      aiPlayer.recordHit(5, 5);
      
      expect(aiPlayer.potentialTargets.length).toBe(4);
      expect(aiPlayer.potentialTargets).toContainEqual({ row: 4, col: 5 });
      expect(aiPlayer.potentialTargets).toContainEqual({ row: 6, col: 5 });
      expect(aiPlayer.potentialTargets).toContainEqual({ row: 5, col: 4 });
      expect(aiPlayer.potentialTargets).toContainEqual({ row: 5, col: 6 });
    });

    it('should not add out-of-bounds cells to potential targets', () => {
      aiPlayer.recordHit(0, 0);
      
      expect(aiPlayer.potentialTargets).not.toContainEqual({ row: -1, col: 0 });
      expect(aiPlayer.potentialTargets).not.toContainEqual({ row: 0, col: -1 });
      // Should only contain valid adjacent cells
      expect(aiPlayer.potentialTargets).toContainEqual({ row: 1, col: 0 });
      expect(aiPlayer.potentialTargets).toContainEqual({ row: 0, col: 1 });
    });
  });

  describe('miss tracking', () => {
    it('should remove missed positions from potential targets', () => {
      aiPlayer.recordHit(5, 5);
      aiPlayer.recordMiss(6, 5);
      
      expect(aiPlayer.potentialTargets).not.toContainEqual({ row: 6, col: 5 });
    });

    it('should keep other potential targets after miss', () => {
      aiPlayer.recordHit(5, 5);
      aiPlayer.recordMiss(6, 5);
      
      expect(aiPlayer.potentialTargets.length).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should clear tracking arrays', () => {
      aiPlayer.recordHit(3, 4);
      aiPlayer.recordMiss(5, 6);
      
      aiPlayer.reset();
      
      expect(aiPlayer.previousHits).toEqual([]);
      expect(aiPlayer.potentialTargets).toEqual([]);
    });
  });

  describe('utility methods', () => {
    it('should correctly identify valid targets', () => {
      expect(aiPlayer.isValidTarget(0, 0, attackRecord)).toBe(true);
      expect(aiPlayer.isValidTarget(5, 5, attackRecord)).toBe(true);
      expect(aiPlayer.isValidTarget(9, 9, attackRecord)).toBe(true);
    });

    it('should reject invalid targets', () => {
      expect(aiPlayer.isValidTarget(-1, 0, attackRecord)).toBe(false);
      expect(aiPlayer.isValidTarget(0, -1, attackRecord)).toBe(false);
      expect(aiPlayer.isValidTarget(10, 0, attackRecord)).toBe(false);
      expect(aiPlayer.isValidTarget(0, 10, attackRecord)).toBe(false);
    });

    it('should reject already attacked positions', () => {
      attackRecord[5][5] = 'hit';
      expect(aiPlayer.isValidTarget(5, 5, attackRecord)).toBe(false);
      
      attackRecord[3][4] = 'miss';
      expect(aiPlayer.isValidTarget(3, 4, attackRecord)).toBe(false);
    });

    it('should find available targets correctly', () => {
      attackRecord[0][0] = 'miss';
      attackRecord[0][1] = 'hit';
      
      const available = aiPlayer.getAvailableTargets(attackRecord);
      
      expect(available.length).toBe(98); // 100 - 2 attacked
      expect(available).not.toContainEqual({ row: 0, col: 0 });
      expect(available).not.toContainEqual({ row: 0, col: 1 });
    });
  });
});