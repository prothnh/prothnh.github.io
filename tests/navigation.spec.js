const { test, expect } = require('@playwright/test');

test.describe('NJ SPIRIT Portal Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start at the portal page
    await page.goto('file://' + __dirname + '/../portal.html');
  });

  test('Portal loads with correct title and logo', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('NJ SPIRIT Frontend Upgrade - Project Portal');
    
    // Check North Highland logo is visible
    const logo = page.locator('.logo img');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('alt', 'North Highland');
  });

  test('Quick links navigate to correct sections', async ({ page }) => {
    // Test Executive Summary link
    const execLink = page.locator('a:has-text("Executive Summary")');
    await execLink.click();
    await expect(page).toHaveURL(/presentation\.html#slide-1/);

    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');

    // Test RESTful Bridge Approach link
    const bridgeLink = page.locator('a:has-text("RESTful Bridge Approach")');
    await bridgeLink.click();
    await expect(page).toHaveURL(/presentation\.html#slide-2/);

    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');

    // Test Technical Comparison link
    const techLink = page.locator('a:has-text("Technical Comparison")');
    await techLink.click();
    await expect(page).toHaveURL(/team-guide\.html#option-comparison/);

    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');

    // Test Code Examples link
    const codeLink = page.locator('a:has-text("Code Examples")');
    await codeLink.click();
    await expect(page).toHaveURL(/team-guide\.html#code-examples/);
  });

  test('Card action buttons navigate correctly', async ({ page }) => {
    // Test View Presentation button
    const presentationBtn = page.locator('a:has-text("View Presentation")').first();
    await presentationBtn.click();
    await expect(page).toHaveURL(/presentation\.html/);

    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');

    // Test Strategic Recommendation button
    const calcBtn = page.locator('a:has-text("Strategic Recommendation")');
    await calcBtn.click();
    await expect(page).toHaveURL(/presentation\.html#slide-4/);

    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');

    // Test View Guide button
    const guideBtn = page.locator('a:has-text("View Guide")').first();
    await guideBtn.click();
    await expect(page).toHaveURL(/team-guide\.html/);

    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');

    // Test Code Samples button
    const codeBtn = page.locator('a:has-text("Code Samples")');
    await codeBtn.click();
    await expect(page).toHaveURL(/team-guide\.html#code-examples/);
  });
});

test.describe('Team Guide Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../team-guide.html');
  });

  test('Team Guide loads with North Highland logo', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Development Team Collaboration Guide - NJ SPIRIT Frontend Upgrade');
    
    // Check North Highland logo is visible
    const logo = page.locator('.logo img');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', 'https://northhighland.com/hubfs/Logos/NHL_Logo_Primary_White.svg');
  });

  test('Section titles are fully visible when navigating via anchors', async ({ page }) => {
    // Navigate to option-comparison section
    await page.goto('file://' + __dirname + '/../team-guide.html#option-comparison');
    
    // Wait for smooth scroll
    await page.waitForTimeout(500);
    
    // Check that section title is visible and not cut off
    const sectionTitle = page.locator('#option-comparison .section-title');
    await expect(sectionTitle).toBeVisible();
    
    // Get the bounding box of the section title
    const titleBox = await sectionTitle.boundingBox();
    const headerBox = await page.locator('.header').boundingBox();
    
    // Verify title is below header (not overlapped)
    expect(titleBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
    
    // Navigate to code-examples section
    await page.goto('file://' + __dirname + '/../team-guide.html#code-examples');
    
    // Wait for smooth scroll
    await page.waitForTimeout(500);
    
    // Check that code examples section title is visible
    const codeTitle = page.locator('#code-examples .section-title');
    await expect(codeTitle).toBeVisible();
    
    // Get the bounding box of the code section title
    const codeTitleBox = await codeTitle.boundingBox();
    
    // Verify title is below header (not overlapped)
    expect(codeTitleBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
  });

  test('Navigation buttons work correctly', async ({ page }) => {
    // Test Back to Portal button
    const backBtn = page.locator('a:has-text("Back to Portal")');
    await backBtn.click();
    await expect(page).toHaveURL(/portal\.html/);

    // Go back to team guide
    await page.goto('file://' + __dirname + '/../team-guide.html');

    // Test Presentation button
    const presentationBtn = page.locator('a:has-text("Presentation")');
    await presentationBtn.click();
    await expect(page).toHaveURL(/presentation\.html/);
  });

  test('Table of contents navigation works', async ({ page }) => {
    // Click on a TOC link
    const tocLink = page.locator('.toc-link').first();
    const linkText = await tocLink.textContent();
    await tocLink.click();
    
    // Wait for smooth scroll
    await page.waitForTimeout(500);
    
    // Verify URL has changed to include the anchor
    const url = page.url();
    expect(url).toContain('#');
  });
});

test.describe('Presentation Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../presentation.html');
  });

  test('Presentation loads with correct structure', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Struts.*REST API Modernization/);
    
    // Check North Highland logo is visible in header
    const logo = page.locator('.nh-logo');
    await expect(logo).toBeVisible();
    
    // Check first slide is active
    const firstSlide = page.locator('#slide-1');
    await expect(firstSlide).toHaveClass(/active/);
  });

  test('Slide navigation works correctly', async ({ page }) => {
    // Navigate to slide 2
    await page.goto('file://' + __dirname + '/../presentation.html#slide-2');
    
    // Check slide 2 content is visible
    const slide2 = page.locator('#slide-2');
    await expect(slide2).toBeVisible();
    
    // Navigate to slide 4 (Strategic Recommendation)
    await page.goto('file://' + __dirname + '/../presentation.html#slide-4');
    
    // Check slide 4 content is visible
    const slide4 = page.locator('#slide-4');
    await expect(slide4).toBeVisible();
    
    // Verify slide title contains "Strategic Recommendation"
    const slideTitle = slide4.locator('.slide-title');
    await expect(slideTitle).toContainText('Strategic Recommendation');
  });

  test('Navigation menu links work', async ({ page }) => {
    // Check if navigation menu exists
    const nav = page.locator('nav');
    if (await nav.isVisible()) {
      // Test navigation links
      const navLinks = nav.locator('a');
      const count = await navLinks.count();
      
      // Verify we have navigation links
      expect(count).toBeGreaterThan(0);
      
      // Test first navigation link
      if (count > 0) {
        await navLinks.first().click();
        // Verify navigation occurred
        const url = page.url();
        expect(url).toContain('#slide-');
      }
    }
  });
});

test.describe('Cross-Page Navigation Tests', () => {
  test('Complete user journey through all materials', async ({ page }) => {
    // Start at portal
    await page.goto('file://' + __dirname + '/../portal.html');
    await expect(page).toHaveTitle(/Project Portal/);
    
    // Navigate to presentation
    await page.locator('a:has-text("View Presentation")').first().click();
    await expect(page).toHaveURL(/presentation\.html/);
    
    // Navigate to a specific slide
    await page.goto('file://' + __dirname + '/../presentation.html#slide-2');
    const slide2Title = page.locator('#slide-2 .slide-title');
    await expect(slide2Title).toContainText('RESTful Bridge Approach');
    
    // Go back to portal
    await page.goto('file://' + __dirname + '/../portal.html');
    
    // Navigate to team guide
    await page.locator('a:has-text("View Guide")').first().click();
    await expect(page).toHaveURL(/team-guide\.html/);
    
    // Navigate to specific section
    await page.goto('file://' + __dirname + '/../team-guide.html#option-comparison');
    
    // Verify section is visible and not cut off
    const sectionTitle = page.locator('#option-comparison .section-title');
    await expect(sectionTitle).toBeVisible();
    
    // Navigate back to portal
    await page.locator('a:has-text("Back to Portal")').click();
    await expect(page).toHaveURL(/portal\.html/);
  });

  test('All quick links lead to valid destinations', async ({ page }) => {
    await page.goto('file://' + __dirname + '/../portal.html');
    
    const quickLinks = page.locator('.quick-link');
    const linkCount = await quickLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      await page.goto('file://' + __dirname + '/../portal.html');
      const link = quickLinks.nth(i);
      const href = await link.getAttribute('href');
      
      // Click the link
      await link.click();
      
      // Verify navigation occurred
      const url = page.url();
      expect(url).toContain(href.split('#')[0]);
      
      // If it's an anchor link, verify the element exists
      if (href.includes('#')) {
        const anchor = href.split('#')[1];
        const element = page.locator(`#${anchor}`);
        await expect(element).toBeVisible();
      }
    }
  });
});