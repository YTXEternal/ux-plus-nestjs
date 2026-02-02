import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * 类属性接口
 * @interface ClassProperty
 */
interface ClassProperty {
  /** 属性名 */
  name: string;
  /** 属性类型 */
  type: string;
}

/**
 * 解析类属性
 * 
 * 从文件内容中解析出 TypeScript 类属性，忽略带有特定装饰器的属性
 *
 * @param {string} fileContent 文件内容
 * @returns {ClassProperty[]} 解析出的属性列表
 */
function parseClassProperties(fileContent: string): ClassProperty[] {
  const properties: ClassProperty[] = [];
  
  /** Normalize newlines to \n */
  const content = fileContent.replace(/\r\n/g, '\n');
  
  /**
   * Regex explanation:
   * (?:^\s*@.*(?:\n|$))*  -> Match preceding lines that start with @ (decorators), zero or more times.
   * ^\s*                 -> Start of property line, optional whitespace
   * (?:declare\s+)?      -> Optional 'declare' keyword
   * (\w+)                -> Capture Property Name (word characters only)
   * \??                  -> Optional question mark (optional property)
   * \s*:\s*              -> Colon and whitespace
   * ([^;\n]+)            -> Capture Property Type (anything until semicolon or newline)
   * ;                    -> End with semicolon
   */
  const propertyRegex = /(?:^\s*@.*(?:\n|$))*\s*(?:declare\s+)?(\w+)\??\s*:\s*([^;\n]+);/gm;
  
  let match: RegExpExecArray | null;
  
  while ((match = propertyRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const propertyName = match[1];
    const propertyType = match[2].trim();
    
    /** 检查是否有关连装饰器 in the full match (which includes decorators) */
    const hasAssociationDecorator = ['HasOne', 'HasMany', 'BelongsTo', 'BelongsToMany'].some(decorator => 
      fullMatch.includes(`@${decorator}`)
    );
    
    if (!hasAssociationDecorator) {
      properties.push({ name: propertyName, type: propertyType });
    }
  }
  
  return properties;
}

/**
 * 首字母大写转换
 *
 * @param {string} str 输入字符串
 * @returns {string} 转换后的字符串
 */
function capitalizeFirstLetter(str: string): string {
   return str.split('-').filter(Boolean).map(str=>str.charAt(0).toUpperCase() + str.slice(1)).join('');
}

/**
 * 生成 interface 字符串
 *
 * @param {string} className 类名
 * @param {ClassProperty[]} properties 属性列表
 * @returns {string} 生成的 interface 代码
 */
function generateInterface(className: string, properties: ClassProperty[]): string {
  let interfaceString = `export interface ${capitalizeFirstLetter(className)}Inter {\n`;
  
  properties.forEach(prop => {
    interfaceString += `  ${prop.name}: ${prop.type};\n`;
  });
  
  interfaceString += '}\n';
  return interfaceString;
}

/**
 * 从模型文件生成接口文件
 *
 * @param {string} modelFilePath 模型文件路径
 */
function generateInterfaceFromModel(modelFilePath: string): void {
  try {
    /** 读取文件内容 */
    const fileContent = fs.readFileSync(modelFilePath, 'utf8');
    
    /** 获取类名 */
    const className = path.basename(modelFilePath, '.ts').replace('.model', '');
    
    /** 解析属性 */
    const properties = parseClassProperties(fileContent);
    
    /** 生成 interface */
    const interfaceString = generateInterface(className, properties);
    
    /** 创建输出目录 */
    const outputDir = path.join(path.dirname(modelFilePath), '../interfaces');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    /** 写入文件 */
    const outputPath = path.join(outputDir, `${className}.interface.ts`);
    fs.writeFileSync(outputPath, interfaceString);
    console.log(`Generated interface for ${className}: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating interface for ${modelFilePath}:`, error);
  }
}

/**
 * 主函数
 *
 * @param {string} dirPath 扫描目录路径
 */
function main(dirPath: string): void {
    const filePath = path.resolve(process.cwd(), dirPath);
    if (!fs.existsSync(filePath)) {
        console.error(`Directory not found: ${filePath}`);
        return;
    }
    const files = fs.readdirSync(filePath);
    files.forEach((fileName) => {
        if(!fileName.includes('.model.ts')) return void 0;
        const fullPath = path.resolve(filePath, fileName);
        generateInterfaceFromModel(fullPath);
    });
}

main('./src/databases/mysql-database/model');
