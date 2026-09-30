import * as fs from 'fs/promises';
import * as path from 'path';

export class LocalIngestEngine {
  private readonly kbPath = path.join(__dirname, '../../data/knowledge_base');

  /**
   * Look up a local file asynchronously under data/knowledge_base/ based on keyword/similarity matching.
   */
  async fetchInternalAsset(topic: string): Promise<{ source: string; rawText: string; integrity: string }> {
    const startTime = Date.now();
    console.log(`[LOCAL_INGEST] Ingesting internal asset for topic query: "${topic}"`);
    
    // Ensure directory exists
    await fs.mkdir(this.kbPath, { recursive: true });
    
    const files = await fs.readdir(this.kbPath);
    if (files.length === 0) {
      console.warn(`[LOCAL_INGEST] No assets found in knowledge base: ${this.kbPath}`);
      return {
        source: "IN_HOUSE_REPOS",
        rawText: `No internal assets found matching query: ${topic}`,
        integrity: "SECURE"
      };
    }

    // Match best file by name similarity
    let bestMatchFile: string | null = null;
    let maxMatchScore = -1;

    const queryWords = topic.toLowerCase().split(/[\s_\-\.]+/);

    for (const file of files) {
      const fileNameLower = file.toLowerCase();
      let score = 0;
      for (const word of queryWords) {
        if (word && fileNameLower.includes(word)) {
          score += 10; // direct word match in name has high weight
        }
      }

      if (score > maxMatchScore && score > 0) {
        maxMatchScore = score;
        bestMatchFile = file;
      }
    }

    // If no direct filename match, read and check content keywords
    if (!bestMatchFile) {
      for (const file of files) {
        const filePath = path.join(this.kbPath, file);
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;

        const content = await fs.readFile(filePath, 'utf8');
        const contentLower = content.toLowerCase();
        let score = 0;
        for (const word of queryWords) {
          if (word) {
            const matches = contentLower.split(word).length - 1;
            score += matches;
          }
        }

        if (score > maxMatchScore && score > 0) {
          maxMatchScore = score;
          bestMatchFile = file;
        }
      }
    }

    // Default fallback to first file if nothing matches
    if (!bestMatchFile) {
      bestMatchFile = files[0];
    }

    const targetFilePath = path.join(this.kbPath, bestMatchFile);
    console.log(`[LOCAL_INGEST] Selected best-match asset: "${bestMatchFile}" (Score: ${maxMatchScore})`);
    
    const fileContent = await fs.readFile(targetFilePath, 'utf8');
    const latency = Date.now() - startTime;
    const byteSize = Buffer.byteLength(fileContent, 'utf8');
    
    console.log(`[LOCAL_INGEST] Completed local ingest. Latency: ${latency}ms, Size: ${byteSize} bytes`);

    return {
      source: "IN_HOUSE_REPOS",
      rawText: fileContent,
      integrity: "SECURE"
    };
  }
}
