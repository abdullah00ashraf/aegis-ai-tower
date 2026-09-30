import re

query_internal_knowledge_schema = {
    'type': 'function',
    'function': {
        'name': 'query_internal_knowledge',
        'description': 'Query internal secured database for technical blue prints, structural parameters, hydrological specs, and dead load metrics.',
        'parameters': {
            'type': 'object',
            'properties': {
                'topic': {
                    'type': 'string',
                    'description': 'The query topic to search in internal repos (e.g., "structural_load", "hydrological_specs")'
                }
            },
            'required': ['topic']
        }
    }
}

scrape_external_web_schema = {
    'type': 'function',
    'function': {
        'name': 'scrape_external_web',
        'description': 'Autonomously scrape high-value paragraphs and text blocks from live external internet URLs.',
        'parameters': {
            'type': 'object',
            'properties': {
                'url': {
                    'type': 'string',
                    'description': 'The exact target HTTP or HTTPS URL to load and scrape'
                }
            },
            'required': ['url']
        }
    }
}

tools_definition = [query_internal_knowledge_schema, scrape_external_web_schema]

def detect_tool_heuristics(prompt: str) -> tuple[str | None, dict | None]:
    """
    Fallback regex/keyword parser in case Ollama is offline or doesn't support tools natively.
    Scans for high-value targets matching structural parameters or web URLs.
    """
    lower_prompt = prompt.lower()
    
    # 1. Check for URL scrape targets
    urls = re.findall(r'(https?://[^\s]+)', prompt)
    if urls:
        print(f"[TOOLS_HEURISTIC] Detected URL in query: \"{urls[0]}\". Activating external scraper.")
        return "scrape_external_web", {"url": urls[0]}
    
    if any(w in lower_prompt for w in ["scrape", "http", "website", "live internet", "web page"]):
        print("[TOOLS_HEURISTIC] Detected scraper request keywords. Activating external scraper fallback.")
        return "scrape_external_web", {"url": "https://example.com"}

    # 2. Check for local knowledge base topics
    if any(w in lower_prompt for w in ["load", "stress", "strain", "diagrid", "twist", "dead load", "structural"]):
        print("[TOOLS_HEURISTIC] Detected structural query terms. Activating internal database ingestion.")
        return "query_internal_knowledge", {"topic": "structural_load"}
        
    if any(w in lower_prompt for w in ["hydro", "water", "dewatering", "rainfall", "flood", "drainage", "specs"]):
        print("[TOOLS_HEURISTIC] Detected hydrological query terms. Activating internal database ingestion.")
        return "query_internal_knowledge", {"topic": "hydrological_specs"}
        
    if any(w in lower_prompt for w in ["internal", "knowledge", "asset", "database", "blueprint"]):
        print("[TOOLS_HEURISTIC] Detected generalized repo keywords. Activating internal database ingestion.")
        return "query_internal_knowledge", {"topic": "structural_load"}

    return None, None
