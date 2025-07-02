# Menlo Platform Documentation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## OpenAPI Documentation

The interactive API reference is powered by Scalar and uses OpenAPI specifications. The source documentation is maintained in YAML format and converted to JSON for production use.

### Updating API Documentation

1. **Edit the source YAML file**:
   ```
   static/openapi/menlo-platform.yaml
   ```

2. **Convert YAML to JSON**:
   ```bash
   npm run openapi:build
   ```
   
   This script reads the YAML file and generates the corresponding JSON file that Scalar uses.

3. **Restart the development server** to see changes:
   ```bash
   npm run dev
   ```

### Files

- **Source**: `static/openapi/menlo-platform.yaml` - Edit this file to update API documentation
- **Generated**: `static/openapi/menlo-platform.json` - Auto-generated, do not edit directly
- **Interactive docs**: Available at `/docs/api-reference` when running the dev server

### Workflow

1. Make changes to `menlo-platform.yaml`
2. Run `npm run openapi:build` to update the JSON
3. Restart dev server to see changes in the interactive documentation
4. Commit both YAML and JSON files to git

## LLM Context Generation

The documentation includes an automated system for generating LLM context files that summarize the API documentation for use with language models. This follows the llms-txt standard [proposed by answer.ai](https://llmstxt.org/#proposal).

### Setup

1. **Install dependencies locally** (without modifying package.json):
   ```bash
   npm install dotenv glob --no-save
   ```
   - `glob` - for finding documentation files
   - `dotenv` - for loading environment variables

2. **Configure API access**:
   ```bash
   # Copy the environment template
   cp .env.example .env.local
   
   # Edit .env.local and add your DeepSeek API key
   DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
   ```

### Usage

Generate LLM context with basic output:
```bash
node scripts/generate-llmsctx.mjs
```

Generate with verbose logging:
```bash
node scripts/generate-llmsctx.mjs --verbose
```

### How It Works

The script performs the following steps:

1. **Documentation Ingestion**: 
   - Scans all `.mdx` and `.md` files in the `docs/` directory recursively
   - Extracts complete API documentation including parameters, examples, and constraints

2. **AI Processing**:
   - Sends documentation to DeepSeek Chat API with structured JSON mode
   - Uses the included FastHTML reference file as a template for output structure
   - Extracts comprehensive API information including all parameters, code examples, and response formats

3. **Output Generation**:
   - Creates/updates `static/llms-ctx.txt` with the processed context
   - Saves versioned copies in `llms-ctx-versions/` for comparison (gitignored)
   - Converts structured JSON to readable text format

### Output Files

- **`static/llms-ctx.txt`** - Main output file used by the application
- **`llms-ctx-versions/`** - Timestamped versions for manual review and comparison

### Version Management

Each run creates a timestamped version file allowing you to:
- Compare different iterations
- Review quality improvements
- **Manually select the best version** for production use

The script shows recent versions after each run:
```
📈 Recent versions for comparison:
   llms-ctx-2024-06-20T10-30-45-123Z.txt
   llms-ctx-2024-06-20T11-15-22-456Z.txt
   
💡 Compare versions in: /path/to/llms-ctx-versions
```

**Developer Action Required**: After generating multiple versions, manually review and choose the best one to replace `static/llms-ctx.txt` before committing changes.

### API Coverage

The script extracts comprehensive information including:
- **All API endpoints** with complete parameter lists
- **Request/response examples** in curl, Python, and JavaScript
- **Parameter details** including types, defaults, constraints, and validation rules
- **Model information** with capabilities and use cases
- **Authentication requirements** and error handling
- **Code examples** preserved exactly as documented

### Troubleshooting

**Common issues:**

1. **Missing API key**: Ensure `DEEPSEEK_API_KEY` is set in `.env.local`
2. **No documentation found**: Check that `.mdx` files exist in `docs/` directory
3. **API errors**: Verify your DeepSeek API key is valid and has sufficient credits

**Dependencies:**
- Node.js 18+
- DeepSeek API access
