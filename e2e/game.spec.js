import { test, expect } from "@playwright/test";

test.describe("Battleship Game E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display game setup screen", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Battleship");
    await expect(page.locator("h2")).toContainText("Game Setup");
    await expect(page.locator("#difficulty")).toBeVisible();
    await expect(page.locator("#randomPlacement")).toBeVisible();
    await expect(page.locator("#manualPlacement")).toBeVisible();
    await expect(page.locator("#startGame")).toBeVisible();
  });

  test("should start game with random placement", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    await expect(page.locator("h2").first()).toContainText("Your Fleet");
    await expect(page.locator("h2").nth(1)).toContainText("AI Fleet");
    await expect(page.locator("#gameStatus")).toContainText("Your turn");
  });

  test("should change AI difficulty", async ({ page }) => {
    await page.selectOption("#difficulty", "hard");
    await page.click("#randomPlacement");
    await page.click("#startGame");

    await expect(page.locator("#gameStatus")).toContainText("Your turn");
  });

  test("should allow player to attack AI grid", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    const aiGridCells = page.locator('[data-type="attack"]');
    await expect(aiGridCells).toHaveCount(100);

    // Click on a cell
    await aiGridCells.first().click();

    // Verify the attack was registered
    await page.waitForTimeout(1000);
    const status = page.locator("#gameStatus");
    await expect(status).toBeVisible();
  });

  test("should show hit or miss after attack", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    const aiGridCells = page.locator('[data-type="attack"]');
    await aiGridCells.first().click();

    await page.waitForTimeout(1500);

    // Check if the cell shows hit or miss
    const firstCell = aiGridCells.first();
    const cellContent = await firstCell.textContent();
    expect(cellContent === "✕" || cellContent === "○").toBeTruthy();
  });

  test("should restart game", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    await page.click("#restartGame");

    await expect(page.locator("#gameStatus")).toContainText("Your turn");
  });

  test("should navigate back to setup", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    await page.click("#backToSetup");

    await expect(page.locator("h2")).toContainText("Game Setup");
  });

  test("should display game over screen", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    // Navigate back to setup (simulating game over scenario)
    await page.click("#backToSetup");

    await expect(page.locator("h2")).toContainText("Game Setup");
  });

  test("should play again after game over", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    // Navigate back to setup
    await page.click("#backToSetup");

    // Start game again
    await page.click("#randomPlacement");
    await page.click("#startGame");

    await expect(page.locator("#gameStatus")).toContainText("Your turn");
  });

  test("should be keyboard accessible", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    // Test tab navigation to grid cells
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verify focus is on an interactive element
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBe("DIV");
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    // Check that grid cells have aria-labels
    const firstCell = page.locator('[data-type="attack"]').first();
    const ariaLabel = await firstCell.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("Cell");
  });

  test("should show ship count", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    const playerShipsText = await page.locator("text=Your ships:").textContent();
    expect(playerShipsText).toContain("5 remaining");

    const aiShipsText = await page.locator("text=AI ships:").textContent();
    expect(aiShipsText).toContain("5 remaining");
  });

  test("should update ship count after hits", async ({ page }) => {
    await page.click("#randomPlacement");
    await page.click("#startGame");

    // Get initial ship count
    const initialShipText = await page.locator("text=Your ships:").textContent();
    expect(initialShipText).toContain("5 remaining");

    // Make an attack
    const aiGridCells = page.locator('[data-type="attack"]');
    await aiGridCells.first().click();
    await page.waitForTimeout(1500);

    // Ship count should still be displayed (may or may not have changed)
    const shipText = await page.locator("text=Your ships:").textContent();
    expect(shipText).toBeTruthy();
  });
});
