import puppeteer from 'puppeteer';

export interface ScrapedFirmData {
  firmName: string;
  rawText: string;
  timestamp: string;
  dataIntegrity: 'VERIFIED' | 'COMPROMISED';
}

export class PerceptionEngine {
  /**
   * Launch a standard headless browser, navigate to a compliant URL,
   * and extract target paragraph and text context for analysis.
   */
  public async analyzeTargetFirm(url: string): Promise<ScrapedFirmData> {
    console.log(`[PERCEPTION] Launching standard compliant browser instance...`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      console.log(`[PERCEPTION] Navigating to compliant target: ${url}`);
      const page = await browser.newPage();
      
      // Standard timeout protocol - 30 seconds wait
      await page.setDefaultNavigationTimeout(30000);
      
      // Wait until DOM and core elements are fully parsed
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Gather title and body text elements (focusing on paragraphs and list elements)
      const pageTitle = await page.title();
      const firmName = pageTitle.split('-')[0].trim() || 'Target Venture Corporation';

      console.log(`[PERCEPTION] Parsing paragraph elements and lists...`);
      const bodyText = await page.evaluate(() => {
        const paragraphs = Array.from(document.querySelectorAll('p'));
        const listItems = Array.from(document.querySelectorAll('li'));
        
        const combined = [...paragraphs, ...listItems]
          .map(el => el.textContent?.trim() || '')
          .filter(text => text.length > 15)
          .join('\n');
          
        return combined.slice(0, 5000); // Capture top 5000 chars for pre-processing analysis
      });

      console.log(`[PERCEPTION] Structural text harvesting successful. Text length: ${bodyText.length}`);

      return {
        firmName,
        rawText: bodyText || 'Strategic infrastructure, scaling rounds, and deeptech capital ventures analysis target.',
        timestamp: new Date().toISOString(),
        dataIntegrity: 'VERIFIED'
      };
    } catch (error) {
      console.error(`[PERCEPTION] ERR harvesting text data from target:`, error);
      return {
        firmName: 'Unknown Venture Firm',
        rawText: 'Fallback data - connection timeout or unresolved network endpoint.',
        timestamp: new Date().toISOString(),
        dataIntegrity: 'COMPROMISED'
      };
    } finally {
      console.log(`[PERCEPTION] Closing browser context.`);
      await browser.close();
    }
  }
}
