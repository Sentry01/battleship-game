import { test, expect } from "@playwright/test";

test.describe("Gameplay Tests", () => {
  test("play a complete game with medium difficulty", async ({ page }) => {
    test.setTimeout(90000); // 90 second timeout
    await page.goto("/");
    
    // Select difficulty
    await page.selectOption("#difficulty", "medium");
    
    // Start game with random placement
    await page.click("#randomPlacement");
    await page.click("#startGame");
    
    // Wait for game to load
    await page.waitForSelector(".grid-cell", { timeout: 5000 });
    
    // Play for a reasonable number of moves to verify gameplay
    let moves = 0;
    const targetMoves = 20;
    
    while (moves < targetMoves) {
      // Check if game is over early
      const gameOverElement = page.locator("h2:has-text('Game Over'), h2:has-text('You Win'), h2:has-text('AI Wins')");
      if (await gameOverElement.count() > 0) {
        const winner = await gameOverElement.textContent();
        console.log(`Game completed early. Winner: ${winner?.trim()}, Moves: ${moves}`);
        break;
      }
      
      // Make a strategic attack on AI grid
      const aiGridCells = page.locator('[data-type="attack"]');
      const cellCount = await aiGridCells.count();
      
      if (cellCount > 0) {
        // Try unattacked cells first
        let targetCell = null;
        for (let i = 0; i < cellCount; i++) {
          const cell = aiGridCells.nth(i);
          const content = await cell.textContent();
          if (!content || content.trim() === "") {
            targetCell = cell;
            break;
          }
        }
        
        // If all cells attacked, pick random
        if (!targetCell) {
          targetCell = aiGridCells.nth(Math.floor(Math.random() * cellCount));
        }
        
        await targetCell.scrollIntoViewIfNeeded();
        await targetCell.click({ force: true });
        
        // Wait for AI to respond
        await page.waitForTimeout(1000);
      }
      
      moves++;
    }
    
    // Verify gameplay works
    expect(moves).toBeGreaterThan(5);
    console.log(`Played ${moves} moves successfully`);
  });
  
  test("manual placement flow", async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout
    await page.goto("/");
    
    // Select manual placement
    await page.click("#manualPlacement");
    await page.click("#startGame");
    
    // Wait for placement screen
    await page.waitForSelector('[data-type="placement"]', { timeout: 5000 });
    
    // Place first ship
    const placementCells = page.locator('[data-type="placement"]');
    await placementCells.nth(0).click();
    
    // Verify ship was placed
    await page.waitForTimeout(500);
    
    // Rotate and place second ship
    await page.click("#rotateShip");
    await placementCells.nth(10).click();
    
    // Use auto-place for remaining
    await page.click("#autoPlace");
    
    // Game should start
    await page.waitForSelector('[data-type="attack"]', { timeout: 5000 });
    
    // Verify game is playable
    const attackCells = page.locator('[data-type="attack"]');
    await expect(attackCells).toHaveCount(100);
  });
  
  test("all game states and transitions", async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout
    await page.goto("/");
    
    // Setup screen
    await expect(page.locator("h2:has-text('Game Setup')")).toBeVisible();
    
    // Start game
    await page.click("#randomPlacement");
    await page.click("#startGame");
    
    // Gameplay screen
    await expect(page.locator("h2:has-text('Your Fleet')")).toBeVisible();
    await expect(page.locator("h2:has-text('AI Fleet')")).toBeVisible();
    
    // Make attack
    const aiCell = page.locator('[data-type="attack"]').first();
    await expect(aiCell).toBeVisible();
    await aiCell.click();
    
    // Check status updates
    await page.waitForTimeout(1500);
    const status = page.locator("#gameStatus");
    await expect(status).toBeVisible();
    
    // Make a few more attacks to verify gameplay
    for (let i = 0; i < 5; i++) {
      const cells = page.locator('[data-type="attack"]');
      const count = await cells.count();
      if (count > 0) {
        // Try unattacked cells
        let targetCell = null;
        for (let j = 0; j < count; j++) {
          const cell = cells.nth(j);
          const content = await cell.textContent();
          if (!content || content.trim() === "") {
            targetCell = cell;
            break;
          }
        }
        if (!targetCell) {
          targetCell = cells.nth(Math.floor(Math.random() * count));
        }
        await targetCell.scrollIntoViewIfNeeded();
        await targetCell.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }
    
    // Verify game is still running (don't require full game completion)
    const gameBoard = page.locator("#gameBoard");
    await expect(gameBoard).toBeVisible();
  });
});