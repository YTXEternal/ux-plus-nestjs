const fs = require('node:fs');
const path = require('node:path');

// 解析類屬性
function parseClassProperties(fileContent) {
  const properties = [];
  
  // Normalize newlines to \n
  const content = fileContent.replace(/\r\n/g, '\n');
  
  // Regex explanation:
  // (?:^\s*@.*(?:\n|$))*  -> Match preceding lines that start with @ (decorators), zero or more times.
  // ^\s*                 -> Start of property line, optional whitespace
  // (?:declare\s+)?      -> Optional 'declare' keyword
  // (\w+)                -> Capture Property Name (word characters only)
  // \??                  -> Optional question mark (optional property)
  // \s*:\s*              -> Colon and whitespace
  // ([^;\n]+)            -> Capture Property Type (anything until semicolon or newline)
  // ;                    -> End with semicolon
  const propertyRegex = /(?:^\s*@.*(?:\n|$))*\s*(?:declare\s+)?(\w+)\??\s*:\s*([^;\n]+);/gm;
  
  let match;
  
  while ((match = propertyRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const propertyName = match[1];
    const propertyType = match[2].trim();
    
    // 檢查是否有關聯裝飾器 in the full match (which includes decorators)
    const hasAssociationDecorator = ['HasOne', 'HasMany', 'BelongsTo', 'BelongsToMany'].some(decorator => 
      fullMatch.includes(`@${decorator}`)
    );
    
    if (!hasAssociationDecorator) {
      properties.push({ name: propertyName, type: propertyType });
    }
  }
  
  return properties;
}

function capitalizeFirstLetter(str) {
   return str.split('-').filter(Boolean).map(str=>str.charAt(0).toUpperCase() + str.slice(1)).join('')
}

// 生成 interface
function generateInterface(className, properties) {
  let interfaceString = `export interface ${capitalizeFirstLetter(className)}Inter {\n`;
  
  properties.forEach(prop => {
    interfaceString += `  ${prop.name}: ${prop.type};\n`;
  });
  
  interfaceString += '}\n';
  return interfaceString;
}

function generateInterfaceFromModel(modelFilePath) {
  try {
    // 讀取文件內容
    const fileContent = fs.readFileSync(modelFilePath, 'utf8');
    
    // 獲取類名
    const className = path.basename(modelFilePath, '.ts').replace('.model', '');
    
    // 解析屬性
    const properties = parseClassProperties(fileContent);
    
    // 生成 interface
    const interfaceString = generateInterface(className, properties);
    
    // 創建輸出目錄
    const outputDir = path.join(path.dirname(modelFilePath), '../interfaces');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 寫入文件
    const outputPath = path.join(outputDir, `${className}.interface.ts`);
    fs.writeFileSync(outputPath, interfaceString);
    console.log(`Generated interface for ${className}: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating interface for ${modelFilePath}:`, error);
  }
}

function main(dirPath) {
    const filePath = path.resolve(process.cwd(),dirPath);
    if (!fs.existsSync(filePath)) {
        console.error(`Directory not found: ${filePath}`);
        return;
    }
    const files = fs.readdirSync(filePath);
    files.forEach((fileName)=>{
        if(!fileName.includes('.model.ts')) return void 0;
        const fullPath = path.resolve(filePath,fileName);
        generateInterfaceFromModel(fullPath);
    })
}

main('./src/databases/mysql-database/model');
