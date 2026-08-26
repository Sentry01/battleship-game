export class AIPlayer {
  constructor(difficulty = "medium") {
    this.difficulty = difficulty;
    this.previousHits = [];
    this.potentialTargets = [];
    this.shipOrientation = {}; // Track orientation of hit ships
    this.currentTargetShip = null; // Track which ship we're currently hunting
    this.remainingShips = [5, 4, 3, 3, 2]; // Default ship sizes
  }

  getTarget(playerGrid, attackRecord) {
    switch (this.difficulty) {
      case "easy":
        return this.getEasyTarget(attackRecord);
      case "medium":
        return this.getMediumTarget(playerGrid, attackRecord);
      case "hard":
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
        if (attackRecord[row][col] === "hit") {
          // Check adjacent cells for continuation
          const adjacent = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 },
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
    const weightedTargets = targets.map((target) => {
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

  getAdvancedProbabilityTarget(_playerGrid, attackRecord) {
    const gridSize = 10;

    // Build probability matrix based on remaining ship sizes
    const probabilityMatrix = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(0));

    // Calculate probability for each cell based on ship placement possibilities
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (attackRecord[row][col] !== null) {
          probabilityMatrix[row][col] = 0;
          continue;
        }

        // Calculate how many ships of each size could fit here
        for (const size of this.remainingShips) {
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

  getBestAdjacentTarget(adjacentTargets, _playerGrid, _attackRecord) {
    // Prioritize targets that continue a line of hits
    // Check if we have an established orientation for the current ship
    if (this.currentTargetShip && this.shipOrientation[this.currentTargetShip]) {
      const orientation = this.shipOrientation[this.currentTargetShip];
      const lastHit = this.previousHits[this.previousHits.length - 1];

      // Filter targets that match the orientation
      const orientedTargets = adjacentTargets.filter((target) => {
        if (orientation === "horizontal") {
          return target.row === lastHit.row;
        } else {
          return target.col === lastHit.col;
        }
      });

      if (orientedTargets.length > 0) {
        return orientedTargets[Math.floor(Math.random() * orientedTargets.length)];
      }
    }

    // If no orientation established, try to determine it
    const horizontalTargets = adjacentTargets.filter((t) => {
      const matchingHits = this.previousHits.filter((h) => h.row === t.row);
      return matchingHits.length > 0;
    });

    const verticalTargets = adjacentTargets.filter((t) => {
      const matchingHits = this.previousHits.filter((h) => h.col === t.col);
      return matchingHits.length > 0;
    });

    if (horizontalTargets.length > 0 && verticalTargets.length > 0) {
      // Both orientations possible, prefer the one with more hits
      if (horizontalTargets.length >= verticalTargets.length) {
        return horizontalTargets[Math.floor(Math.random() * horizontalTargets.length)];
      } else {
        return verticalTargets[Math.floor(Math.random() * verticalTargets.length)];
      }
    } else if (horizontalTargets.length > 0) {
      return horizontalTargets[Math.floor(Math.random() * horizontalTargets.length)];
    } else if (verticalTargets.length > 0) {
      return verticalTargets[Math.floor(Math.random() * verticalTargets.length)];
    }

    // Fallback to random
    return adjacentTargets[Math.floor(Math.random() * adjacentTargets.length)];
  }

  recordHit(row, col) {
    this.previousHits.push({ row, col });

    // Determine or update ship orientation
    if (this.previousHits.length >= 2) {
      const lastHit = this.previousHits[this.previousHits.length - 1];
      const secondLastHit = this.previousHits[this.previousHits.length - 2];

      if (lastHit.row === secondLastHit.row) {
        // Horizontal orientation
        if (!this.currentTargetShip) {
          this.currentTargetShip = `ship_${row}_${col}`;
        }
        this.shipOrientation[this.currentTargetShip] = "horizontal";
      } else if (lastHit.col === secondLastHit.col) {
        // Vertical orientation
        if (!this.currentTargetShip) {
          this.currentTargetShip = `ship_${row}_${col}`;
        }
        this.shipOrientation[this.currentTargetShip] = "vertical";
      }
    }

    // Add adjacent cells to potential targets for follow-up (with boundary checking)
    const adjacent = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
    // Only add valid positions (within grid bounds)
    const validAdjacent = adjacent.filter(
      (pos) => pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 10
    );
    this.potentialTargets.push(...validAdjacent);
  }

  recordMiss(row, col) {
    // Remove this position from potential targets if it exists
    this.potentialTargets = this.potentialTargets.filter(
      (target) => !(target.row === row && target.col === col)
    );
  }

  reset() {
    this.previousHits = [];
    this.potentialTargets = [];
    this.shipOrientation = {};
    this.currentTargetShip = null;
    this.remainingShips = [5, 4, 3, 3, 2];
  }

  updateRemainingShips(sunkShipSize) {
    // Remove the sunk ship from remaining ships
    const index = this.remainingShips.indexOf(sunkShipSize);
    if (index > -1) {
      this.remainingShips.splice(index, 1);
    }
    // Reset current ship tracking when a ship is sunk
    this.currentTargetShip = null;
  }
}
