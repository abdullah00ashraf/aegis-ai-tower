import puppeteer from 'puppeteer';

export class AutonomousWebScraper {
  /**
   * Launch Puppeteer headless browser to scrape target URL and extract high-value text.
   * Optimizes performance by intercepting requests to drop fonts, stylesheets, images, and media assets.
   */
  async scrapeLiveIntel(targetUrl: string): Promise<{ source: string; url: string; rawText: string }> {
    const startTime = Date.now();
    console.log(`[AUTONOMOUS_SCRAPER] Spawning Puppeteer to ingest: ${targetUrl}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Enable request interception
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (
          resourceType === 'image' || 
          resourceType === 'media' || 
          resourceType === 'stylesheet' || 
          resourceType === 'font'
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate with timeout protocol - 15 seconds limit
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Gather title and body text elements (focusing on paragraphs and list elements)
      const rawBlocks = await page.evaluate(() => {
        const paragraphs = Array.from(document.querySelectorAll('p'));
        const listItems = Array.from(document.querySelectorAll('li'));
        
        return [...paragraphs, ...listItems]
          .map(el => el.textContent?.trim() || '')
          .filter(text => text.length > 5);
      });

      // Filter out boilerplates
      const sanitizedText = this.sanitizeScrapedText(rawBlocks);
      const latency = Date.now() - startTime;
      const byteSize = Buffer.byteLength(sanitizedText, 'utf8');
      
      console.log(`[AUTONOMOUS_SCRAPER] Completed scrape of ${targetUrl}. Latency: ${latency}ms, Size: ${byteSize} bytes`);

      return {
        source: "LIVE_INTERNET",
        url: targetUrl,
        rawText: sanitizedText || "Fallback - No high-value textual content found on target webpage."
      };
    } catch (error: any) {
      console.error(`[AUTONOMOUS_SCRAPER] ERR scraping ${targetUrl}:`, error.message);
      return {
        source: "LIVE_INTERNET",
        url: targetUrl,
        rawText: `Ingestion failed: connection timeout or unresolved network endpoint for ${targetUrl}. Error: ${error.message}`
      };
    } finally {
      await browser.close();
    }
  }

  private sanitizeScrapedText(blocks: string[]): string {
    const boilerplateRegex = /(sign in|log in|privacy policy|terms of service|cookie policy|copyright|all rights reserved|navigation|menu|subscribe|newsletter|advertisement|footer)/i;
    
    const cleanBlocks = blocks.filter(text => {
      const trimmed = text.trim();
      // Must be at least 5 words and not match boilerplate patterns
      if (trimmed.split(/\s+/).length < 5) return false;
      if (boilerplateRegex.test(trimmed)) return false;
      return true;
    });

    return cleanBlocks.join('\n\n').slice(0, 4000); // Cap at 4k chars to avoid LLM bloating
  }
}
