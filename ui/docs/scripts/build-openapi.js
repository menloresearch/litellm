#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const YAML_PATH = path.join(__dirname, '..', 'static', 'openapi', 'menlo-platform.yaml');
const JSON_PATH = path.join(__dirname, '..', 'static', 'openapi', 'menlo-platform.json');

try {
  console.log('🔄 Converting OpenAPI YAML to JSON...');
  
  // Read and parse YAML file
  const yamlContent = fs.readFileSync(YAML_PATH, 'utf8');
  const apiSpec = yaml.load(yamlContent);
  
  // Convert to JSON with proper formatting
  const jsonContent = JSON.stringify(apiSpec, null, 2);
  
  // Write JSON file
  fs.writeFileSync(JSON_PATH, jsonContent);
  
  console.log('✅ OpenAPI spec converted successfully!');
  console.log(`📄 Source: ${path.relative(process.cwd(), YAML_PATH)}`);
  console.log(`📄 Output: ${path.relative(process.cwd(), JSON_PATH)}`);
  
} catch (error) {
  console.error('❌ Error converting OpenAPI spec:', error.message);
  process.exit(1);
}