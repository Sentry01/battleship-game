export class AIPlayer {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.previousHits = [];
    this.potentialTargets = [];
  }

  getTarget(playerGrid, attackRecord) {
    switch (this.difficulty) {
      case 'easy':
        return this.getEasyTarget(attackRecord);
      case 'medium':
        return this.getMediumTarget(playerGrid, attackRecord);
      case 'hard':
        return this.getHardTarget(playerGrid, attackRecord);
      default:
        return this.getMediumTarget(playerGrid, attackRecord);
    }
  }

  getEasyTarget(attackRecord) {
    // Random target from available positions
    const availableTargets = this.getAvailableTargets(attackRecord);
    return availableTargets[Math.floor(Math.random() * availableTargets.length)];
  }

  getMediumTarget(playerGrid, attackRecord) {
    // If we have hits that haven't been fully explored, target adjacent cells
    if (this.potentialTargets.length > 0) {
      const target = this.potentialTargets.shift();
      if (this.isValidTarget(target.row, target.col, attackRecord)) {
        return target;
      }
    }

    // Look for hits that might indicate a ship
    const hitCells = this.findAdjacentTargets(playerGrid, attackRecord);
    if (hitCells.length > 0) {
      return hitCells[Math.floor(Math.random() * hitCells.length)];
    }

    // Otherwise, use probability-based targeting
    return this.getProbabilityTarget(attackRecord);
  }

  getHardTarget(playerGrid, attackRecord) {
    // Advanced probability-based targeting with hunt and destroy
    if (this.potentialTargets.length > 0) {
      const target = this.potentialTargets.shift();
      if (this.isValidTarget(target.row, target.col, attackRecord)) {
        return target;
      }
    }

    // Use hit tracking to finish ships
    const hitCells = this.findAdjacentTargets(playerGrid, attackRecord);
    if (hitCells.length > 0) {
      // Prioritize cells that are more likely to hit based on ship patterns
      return this.getBestAdjacentTarget(hitCells, playerGrid, attackRecord);
    }

    // Use advanced probability matrix
    return this.getAdvancedProbabilityTarget(playerGrid, attackRecord);
  }

  getAvailableTargets(attackRecord) {
    const targets = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (attackRecord[row][col] === null) {
          targets.push({ row, col });
        }
      }
    }
    return targets;
  }

  isValidTarget(row, col, attackRecord) {
    return row >= 0 && row < 10 && col >= 0 && col < 10 && attackRecord[row][col] === null;
  }

  findAdjacentTargets(playerGrid, attackRecord) {
    const targets = [];
    const gridSize = 10;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (attackRecord[row][col] === 'hit') {
          // Check adjacent cells for continuation
          const adjacent = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 }
          ];

          for (const adj of adjacent) {
            if (this.isValidTarget(adj.row, adj.col, attackRecord)) {
              targets.push(adj);
            }
          }
        }
      }
    }

    return targets;
  }

  getProbabilityTarget(attackRecord) {
    const targets = this.getAvailableTargets(attackRecord);
    // Simple probability: center and checkerboard pattern preferred
    const weightedTargets = targets.map(target => {
      let weight = 1;
      // Prefer center positions
      const distanceFromCenter = Math.abs(target.row - 4.5) + Math.abs(target.col - 4.5);
      weight += (9 - distanceFromCenter) * 0.5;
      // Prefer checkerboard pattern
      if ((target.row + target.col) % 2 === 0) {
        weight += 1;
      }
      return { ...target, weight };
    });

    // Sort by weight and pick from top 3
    weightedTargets.sort((a, b) => b.weight - a.weight);
    const topTargets = weightedTargets.slice(0, 3);
    return topTargets[Math.floor(Math.random() * topTargets.length)];
  }

  getAdvancedProbabilityTarget(playerGrid, attackRecord) {
    const targets = this.getAvailableTargets(attackRecord);
    const gridSize = 10;

    // Build probability matrix based on remaining ship sizes
    const probabilityMatrix = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(0)
    );

    // Calculate probability for each cell based on ship placement possibilities
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (attackRecord[row][col] !== null) {
          probabilityMatrix[row][col] = 0;
          continue;
        }

        // Calculate how many ships of each size could fit here
        // This is a simplified version - full implementation would track remaining ships
        const shipSizes = [5, 4, 3, 3, 2];
        for (const size of shipSizes) {
          // Check horizontal placement
          let canPlaceHorizontal = true;
          for (let i = 0; i < size; i++) {
            if (col + i >= gridSize || attackRecord[row][col + i] !== null) {
              canPlaceHorizontal = false;
              break;
            }
          }
          if (canPlaceHorizontal) {
            probabilityMatrix[row][col] += 1;
          }

          // Check vertical placement
          let canPlaceVertical = true;
          for (let i = 0; i < size; i++) {
            if (row + i >= gridSize || attackRecord[row + i][col] !== null) {
              canPlaceVertical = false;
              break;
            }
          }
          if (canPlaceVertical) {
            probabilityMatrix[row][col] += 1;
          }
        }
      }
    }

    // Find cell with highest probability
    let maxProbability = 0;
    let bestTargets = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (probabilityMatrix[row][col] > maxProbability) {
          maxProbability = probabilityMatrix[row][col];
          bestTargets = [{ row, col }];
        } else if (probabilityMatrix[row][col] === maxProbability) {
          bestTargets.push({ row, col });
        }
      }
    }

    return bestTargets[Math.floor(Math.random() * bestTargets.length)];
  }

  getBestAdjacentTarget(adjacentTargets, playerGrid, attackRecord) {
    // Prioritize targets that continue a line of hits
    // This is a simplified version - full implementation would track ship orientation
    return adjacentTargets[Math.floor(Math.random() * adjacentTargets.length)];
  }

  recordHit(row, col) {
    this.previousHits.push({ row, col });
    // Add adjacent cells to potential targets for follow-up (with boundary checking)
    const adjacent = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 }
    ];
    // Only add valid positions (within grid bounds)
    const validAdjacent = adjacent.filter(
      pos => pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 10
    );
    this.potentialTargets.push(...validAdjacent);
  }

  recordMiss(row, col) {
    // Remove this position from potential targets if it exists
    this.potentialTargets = this.potentialTargets.filter(
      target => !(target.row === row && target.col === col)
    );
  }

  reset() {
    this.previousHits = [];
    this.potentialTargets = [];
  }
}