import { LocalIngestEngine } from './LocalIngest';
import { AutonomousWebScraper } from './WebScraper';

export class DataBroker {
  private localIngest = new LocalIngestEngine();
  private webScraper = new AutonomousWebScraper();

  /**
   * Unified coordinate engine for tool calls.
   * Logs execution latency and byte-size metrics directly to the system console.
   */
  async handleToolCall(toolName: string, args: any): Promise<any> {
    const startTime = Date.now();
    console.log(`[DATA_BROKER] Orchestrator processing request: "${toolName}" with arguments:`, args);

    try {
      if (toolName === 'query_internal_knowledge') {
        const topic = args.topic || '';
        const result = await this.localIngest.fetchInternalAsset(topic);
        const latency = Date.now() - startTime;
        console.log(`[DATA_BROKER] [METRIC] tool: "${toolName}", latency: ${latency}ms, size: ${Buffer.byteLength(result.rawText, 'utf8')} bytes`);
        return result;
      } else if (toolName === 'scrape_external_web') {
        const url = args.url || '';
        const result = await this.webScraper.scrapeLiveIntel(url);
        const latency = Date.now() - startTime;
        console.log(`[DATA_BROKER] [METRIC] tool: "${toolName}", latency: ${latency}ms, size: ${Buffer.byteLength(result.rawText, 'utf8')} bytes`);
        return result;
      } else {
        throw new Error(`Unknown target tool: "${toolName}"`);
      }
    } catch (error: any) {
      console.error(`[DATA_BROKER] ERR executing tool "${toolName}":`, error.message);
      return {
        error: error.message,
        source: toolName === 'query_internal_knowledge' ? 'IN_HOUSE_REPOS' : 'LIVE_INTERNET',
        rawText: `Ingestion failed: ${error.message}`
      };
    }
  }
}
