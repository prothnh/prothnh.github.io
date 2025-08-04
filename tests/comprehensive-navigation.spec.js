const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Navigation test results tracking
let testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  issues: []
};

test.describe('Comprehensive Portal Navigation Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set up authentication with correct credentials
    await page.goto('file://' + path.resolve(__dirname, '../index.html'));
    
    // Wait for login form to be visible
    await page.waitForSelector('#username', { timeout: 10000 });
    
    // Fill in the correct credentials
    await page.fill('#username', 'NJSPIRIT');
    await page.fill('#password', 'spirit2025');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for successful login and redirect to portal
    await page.waitForSelector('.page-title', { timeout: 10000 });
    
    // Verify we're on the portal page
    const title = await page.textContent('.page-title');
    if (!title.includes('NJ SPIRIT')) {
      throw new Error('Login failed - not redirected to portal');
    }
  });

  test('Portal.html - All navigation elements', async ({ page }) => {
    console.log('🔍 Testing portal.html navigation...');
    
    // Test Quick Access Links
    const quickLinks = [
      { selector: '.quick-links a[href="presentation.html#slide-1"]', expectedText: '📊 Executive Summary', expectedDestination: 'presentation.html#slide-1' },
      { selector: '.quick-links a[href="presentation.html#decision-calculator"]', expectedText: '🎯 Decision Calculator', expectedDestination: 'presentation.html#decision-calculator' },
      { selector: '.quick-links a[href="team-guide.html#option-comparison"]', expectedText: '⚖️ Technical Comparison', expectedDestination: 'team-guide.html#option-comparison' },
      { selector: '.quick-links a[href="team-guide.html#code-examples"]', expectedText: '💻 Code Examples', expectedDestination: 'team-guide.html#code-examples' },
      { selector: '.quick-links a[href="presentation.html#slide-5"]', expectedText: '📈 Implementation Summary', expectedDestination: 'presentation.html#slide-5' }
    ];

    for (const link of quickLinks) {
      testResults.totalTests++;
      try {
        const element = await page.locator(link.selector);
        await expect(element).toBeVisible();
        
        const actualText = await element.textContent();
        const actualHref = await element.getAttribute('href');
        
        if (actualText.trim() !== link.expectedText) {
          testResults.issues.push(`Portal Quick Link text mismatch: Expected "${link.expectedText}", got "${actualText.trim()}"`);
          testResults.failedTests++;
        } else if (actualHref !== link.expectedDestination) {
          testResults.issues.push(`Portal Quick Link href mismatch: Expected "${link.expectedDestination}", got "${actualHref}"`);
          testResults.failedTests++;
        } else {
          testResults.passedTests++;
          console.log(`✅ Quick Link: ${link.expectedText} -> ${actualHref}`);
        }
      } catch (error) {
        testResults.issues.push(`Portal Quick Link missing: ${link.selector} - ${error.message}`);
        testResults.failedTests++;
      }
    }

    // Test Resource Card Actions
    const resourceActions = [
      { selector: '.resource-actions a[href="presentation.html"]', expectedText: 'View Presentation' },
      { selector: '.resource-actions a[href="presentation.html#slide-4"]', expectedText: 'Strategic Recommendation' },
      { selector: '.resource-actions a[href="team-guide.html"]', expectedText: 'View Guide' },
      { selector: '.resource-actions a[href="team-guide.html#code-examples"]', expectedText: 'Code Examples' }
    ];

    for (const action of resourceActions) {
      testResults.totalTests++;
      try {
        const element = await page.locator(action.selector);
        await expect(element).toBeVisible();
        
        const actualText = await element.textContent();
        if (actualText.includes(action.expectedText)) {
          testResults.passedTests++;
          console.log(`✅ Resource Action: ${action.expectedText}`);
        } else {
          testResults.issues.push(`Resource Action text mismatch: Expected "${action.expectedText}", got "${actualText}"`);
          testResults.failedTests++;
        }
      } catch (error) {
        testResults.issues.push(`Resource Action missing: ${action.selector} - ${error.message}`);
        testResults.failedTests++;
      }
    }

    // Check for missing Decision Calculator
    testResults.totalTests++;
    const decisionCalculatorExists = await page.locator('text=Decision Calculator').count();
    if (decisionCalculatorExists === 0) {
      testResults.issues.push('❌ CRITICAL: Decision Calculator button is completely missing from portal');
      testResults.failedTests++;
    } else {
      // Find if Decision Calculator button actually navigates correctly
      const calculatorButtons = await page.locator('text=Decision Calculator').all();
      let foundWorkingCalculator = false;
      
      for (const button of calculatorButtons) {
        const href = await button.getAttribute('href');
        if (href && href.includes('decision') || href.includes('calculator')) {
          foundWorkingCalculator = true;
          break;
        }
      }
      
      if (!foundWorkingCalculator) {
        testResults.issues.push('❌ CRITICAL: Decision Calculator button exists but does not link to calculator functionality');
        testResults.failedTests++;
      } else {
        testResults.passedTests++;
      }
    }
  });

  test('Presentation.html - All slide navigation', async ({ page }) => {
    console.log('🔍 Testing presentation.html navigation...');
    
    await page.goto('file://' + path.resolve(__dirname, '../presentation.html'));
    
    // Test slide navigation
    const slides = ['slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5', 'slide-6'];
    
    for (const slideId of slides) {
      testResults.totalTests++;
      try {
        // Use more specific selector to avoid strict mode violations - use the main nav, not compact nav
        const navLink = await page.locator(`.nav-links a[href="#${slideId}"]`);
        await expect(navLink).toBeVisible();
        
        // Test slide element exists
        const slideElement = await page.locator(`#${slideId}`);
        await expect(slideElement).toBeAttached();
        
        // Click navigation and verify
        await navLink.first().click();
        await page.waitForTimeout(500); // Allow for smooth scrolling
        
        const isVisible = await slideElement.isVisible();
        if (isVisible) {
          testResults.passedTests++;
          console.log(`✅ Slide Navigation: ${slideId}`);
        } else {
          testResults.issues.push(`Slide ${slideId} navigation does not scroll to correct position`);
          testResults.failedTests++;
        }
      } catch (error) {
        testResults.issues.push(`Slide ${slideId} navigation failed: ${error.message}`);
        testResults.failedTests++;
      }
    }

    // Check for Decision Calculator within presentation
    testResults.totalTests++;
    const presentationCalculator = await page.locator('text=Decision Calculator').count();
    if (presentationCalculator === 0) {
      testResults.issues.push('❌ Decision Calculator not found in presentation.html');
      testResults.failedTests++;
    } else {
      testResults.passedTests++;
      console.log('✅ Decision Calculator found in presentation');
    }
  });

  test('Team-guide.html - All anchor navigation', async ({ page }) => {
    console.log('🔍 Testing team-guide.html navigation...');
    
    try {
      await page.goto('file://' + path.resolve(__dirname, '../team-guide.html'));
      
      // Test common anchor targets
      const anchors = ['option-comparison', 'code-examples', 'performance-analysis', 'implementation-details'];
      
      for (const anchor of anchors) {
        testResults.totalTests++;
        try {
          const element = await page.locator(`#${anchor}, [name="${anchor}"]`);
          const count = await element.count();
          
          if (count > 0) {
            testResults.passedTests++;
            console.log(`✅ Anchor found: ${anchor}`);
          } else {
            testResults.issues.push(`❌ Missing anchor target: ${anchor} in team-guide.html`);
            testResults.failedTests++;
          }
        } catch (error) {
          testResults.issues.push(`Anchor ${anchor} test failed: ${error.message}`);
          testResults.failedTests++;
        }
      }
    } catch (error) {
      testResults.issues.push(`❌ CRITICAL: team-guide.html file not accessible: ${error.message}`);
      testResults.failedTests += 4; // Add expected test count as failures
      testResults.totalTests += 4;
    }
  });

  test.afterAll(async () => {
    // Generate comprehensive test report
    console.log('\n📊 COMPREHENSIVE NAVIGATION TEST RESULTS');
    console.log('========================================');
    console.log(`Total Tests: ${testResults.totalTests}`);
    console.log(`Passed: ${testResults.passedTests} ✅`);
    console.log(`Failed: ${testResults.failedTests} ❌`);
    console.log(`Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
    
    if (testResults.issues.length > 0) {
      console.log('\n🔍 ISSUES FOUND:');
      console.log('================');
      testResults.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    // Write results to file for analysis
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: testResults.totalTests,
        passed: testResults.passedTests,
        failed: testResults.failedTests,
        successRate: ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)
      },
      issues: testResults.issues
    };

    fs.writeFileSync(
      path.resolve(__dirname, '../navigation-test-report.json'), 
      JSON.stringify(reportData, null, 2)
    );
    
    console.log('\n📄 Detailed report saved to: navigation-test-report.json');
  });
});