#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { config } from 'dotenv';
import { createSystemPrompt, JSON_SCHEMA } from './prompt-template.mjs';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  docsGlob: 'docs/**/*.{md,mdx}',
  outputFile: 'static/llms-ctx.txt',
  temperature: 0.1
};

class LLMContextGenerator {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.verbose = process.argv.includes('--verbose');
    
    if (!this.apiKey) {
      console.error('L DEEPSEEK_API_KEY environment variable is required');
      process.exit(1);
    }
  }

  async run() {
    console.log('= Starting LLM context generation...');
    
    try {
      // Step 1: Ingest documentation
      const documentation = await this.ingestDocumentation();
      this.log(`=� Ingested ${documentation.files.length} documentation files`);
      
      // Step 2: Fetch and load FastHTML reference
      const fasthtmlReference = await this.fetchAndLoadFasthtmlReference();
      this.log('📄 Fetched and loaded FastHTML reference file');
      
      // Step 3: Generate context with DeepSeek
      const structuredData = await this.generateStructuredContext(documentation.content, fasthtmlReference);
      this.log('> Generated structured context via DeepSeek API');
      
      // Step 4: Convert to text format
      const textOutput = this.convertToTextFormat(structuredData);
      
      // Step 5: Write output file
      await this.writeOutputFile(textOutput);
      
      console.log(' Successfully generated llms-ctx.txt');
      
    } catch (error) {
      console.error('L Error generating LLM context:', error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  async ingestDocumentation() {
    const docsDir = path.resolve(__dirname, '..');
    const pattern = path.join(docsDir, CONFIG.docsGlob);
    
    this.log(`= Searching for files: ${pattern}`);
    
    const files = await glob(pattern, { 
      ignore: ['**/node_modules/**', '**/build/**'] 
    });
    
    if (files.length === 0) {
      throw new Error('No documentation files found');
    }

    let combinedContent = '';
    const processedFiles = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(docsDir, file);
        
        combinedContent += `\n\n--- ${relativePath} ---\n`;
        combinedContent += content;
        
        processedFiles.push(relativePath);
        this.log(`=� Processed: ${relativePath}`);
        
      } catch (error) {
        console.warn(`�  Failed to read ${file}: ${error.message}`);
      }
    }

    return {
      files: processedFiles,
      content: combinedContent.trim()
    };
  }

  async fetchAndLoadFasthtmlReference() {
    const referencePath = path.resolve(__dirname, 'fasthtml-llms-ctx.txt');
    const fasthtmlUrl = 'https://www.fastht.ml/docs/llms-ctx.txt';
    
    try {
      // Try to fetch from internet first
      this.log(`🌐 Fetching FastHTML docs from: ${fasthtmlUrl}`);
      
      const response = await fetch(fasthtmlUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Save the fetched content locally for caching
      fs.writeFileSync(referencePath, content, 'utf-8');
      this.log(`💾 Cached FastHTML docs to: ${referencePath}`);
      
      return content;
      
    } catch (fetchError) {
      console.warn(`⚠️  Could not fetch FastHTML docs from internet: ${fetchError.message}`);
      
      // Fallback to local file if it exists
      try {
        const content = fs.readFileSync(referencePath, 'utf-8');
        console.warn(`📖 Using cached local file: ${referencePath}`);
        return content;
      } catch (localError) {
        console.warn(`⚠️  No local cache found at ${referencePath}`);
        console.warn(`   Continuing without FastHTML reference`);
        return "No FastHTML reference available";
      }
    }
  }

  async generateStructuredContext(documentationContent, fasthtmlReference) {
    console.log('🚀 Processing with DeepSeek API...');
    
    const systemPrompt = createSystemPrompt(fasthtmlReference);
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user', 
        content: `Here is the complete Menlo Platform documentation:\n\n${documentationContent}\n\nPlease extract and structure this information into the specified JSON format.`
      }
    ];

    const requestBody = {
      model: CONFIG.model,
      messages: messages,
      response_format: { type: "json_object" },
      temperature: CONFIG.temperature
    };

    this.log(`=� Request: ${CONFIG.model} with ${messages[1].content.length} chars`);

    const response = await fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    
    try {
      const structuredData = JSON.parse(content);
      this.validateStructuredData(structuredData);
      return structuredData;
    } catch (error) {
      // Log the problematic response for debugging
      console.error('=== PROBLEMATIC RESPONSE ===');
      console.error('Response length:', content.length);
      console.error('Response around error position:');
      const errorPos = 15607; // From the error message
      const start = Math.max(0, errorPos - 100);
      const end = Math.min(content.length, errorPos + 100);
      console.error(content.slice(start, end));
      console.error('=== END RESPONSE ===');
      
      // Try to fix common JSON issues
      let fixedContent = content;
      
      // Remove trailing commas before closing brackets/braces
      fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');
      
      // Try parsing the fixed version
      try {
        const structuredData = JSON.parse(fixedContent);
        console.warn('⚠️  Fixed malformed JSON automatically');
        this.validateStructuredData(structuredData);
        return structuredData;
      } catch (fixError) {
        throw new Error(`Failed to parse JSON response: ${error.message}`);
      }
    }
  }

  validateStructuredData(data) {
    const required = ['project_summary', 'api_endpoints', 'models'];
    
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    if (!Array.isArray(data.api_endpoints)) {
      throw new Error('api_endpoints must be an array');
    }
    
    if (!Array.isArray(data.models)) {
      throw new Error('models must be an array');
    }
    
    this.log(' JSON structure validation passed');
  }

  convertToTextFormat(data) {
    let output = '';
    
    // Project header
    output += `<project title="Menlo Platform" summary="${data.project_summary}">\n\n`;
    
    // Key concepts
    if (data.key_concepts && data.key_concepts.length > 0) {
      output += 'Key things to remember when working with Menlo APIs:\n\n';
      data.key_concepts.forEach(concept => {
        output += `- ${concept}\n`;
      });
      output += '\n';
    }

    // Models section
    if (data.models && data.models.length > 0) {
      output += 'Available Models:\n';
      data.models.forEach(model => {
        output += `- **${model.name}**: ${model.description}`;
        if (model.capabilities && model.capabilities.length > 0) {
          output += ` (${model.capabilities.join(', ')})`;
        }
        output += '\n';
      });
      output += '\n';
    }

    // API endpoints
    if (data.api_endpoints && data.api_endpoints.length > 0) {
      data.api_endpoints.forEach(endpoint => {
        output += `## ${endpoint.name}\n\n`;
        output += `${endpoint.description}\n\n`;
        
        if (endpoint.example_request) {
          output += '```bash\n';
          output += endpoint.example_request;
          output += '\n```\n\n';
        }
        
        if (endpoint.parameters && endpoint.parameters.length > 0) {
          output += 'Parameters:\n';
          endpoint.parameters.forEach(param => {
            const required = param.required ? '(required)' : '(optional)';
            let paramLine = `- **${param.name}** ${required}: ${param.description}`;
            
            if (param.type) {
              paramLine += ` (type: ${param.type})`;
            }
            if (param.default) {
              paramLine += ` (default: ${param.default})`;
            }
            if (param.constraints) {
              paramLine += ` (constraints: ${param.constraints})`;
            }
            
            output += paramLine + '\n';
          });
          output += '\n';
        }
        
        if (endpoint.example_response) {
          output += 'Example Response:\n```json\n';
          output += endpoint.example_response;
          output += '\n```\n\n';
        }
      });
    }

    output += '</project>';
    
    return output;
  }

  async writeOutputFile(content) {
    // Create versioned copy for manual review (don't auto-update main file)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const versionDir = path.resolve(__dirname, '..', 'llms-ctx-versions');
    const versionPath = path.join(versionDir, `llms-ctx-${timestamp}.txt`);
    
    // Ensure versions directory exists
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
    }
    
    fs.writeFileSync(versionPath, content, 'utf-8');
    
    const stats = fs.statSync(versionPath);
    console.log(`📊 Generated version: ${stats.size} bytes`);
    console.log(`🗂️  Version saved: ${path.basename(versionPath)}`);
    
    // List recent versions for comparison
    const versions = fs.readdirSync(versionDir)
      .filter(f => f.startsWith('llms-ctx-') && f.endsWith('.txt'))
      .sort()
      .slice(-5); // Last 5 versions
    
    if (versions.length >= 1) {
      console.log('\n📈 Recent versions for comparison:');
      versions.forEach(v => console.log(`   ${v}`));
      console.log(`\n💡 Compare versions in: ${versionDir}`);
      console.log(`\n⚠️  MANUAL ACTION REQUIRED:`);
      console.log(`   Review the generated version and manually copy the best one to:`);
      console.log(`   static/llms-ctx.txt`);
      console.log(`   before committing changes.`);
    }
  }

  log(message) {
    if (this.verbose) {
      console.log(message);
    }
  }
}

// Run the generator
const generator = new LLMContextGenerator();
generator.run();