import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import process from 'process';
import camelcase from "camelcase";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const CONFIG = {
  ICONS_ROOT: path.join(__dirname, '../src/icons'),
  META_ROOT: path.join(__dirname, '../src/metadata'),
  MATRIX_DIR: path.join(__dirname, '../src/matrix'),
  BACKUP_DIR: path.join(__dirname, '../src/backup', new Date().toISOString().replace(/[:.]/g, '-')),
};

async function catalogIcons() {
  try {
    await setupEnvironment();
    await processMainCategories();
    await processMatrixCategories();
    console.log('✅ Cataloging completed successfully!');
  } catch (error) {
    console.error(`❌ Critical errorа: ${error.message}`);
    process.exit(1);
  }
}

async function setupEnvironment() {
  await Promise.all([
    fs.mkdir(CONFIG.META_ROOT, { recursive: true }),
    fs.mkdir(CONFIG.MATRIX_DIR, { recursive: true }),
    fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
  ]);
}

async function processMainCategories() {
  console.log('⏳ Processing of main categories...');

  const mainCategories = await getDirectoryList(CONFIG.ICONS_ROOT);

  for (const category of mainCategories) {
    const categoryPath = path.join(CONFIG.ICONS_ROOT, category);
    const metaCategoryPath = path.join(CONFIG.META_ROOT, category);

    await fs.mkdir(metaCategoryPath, { recursive: true });

    const icons = await getIconFiles(categoryPath);

    for (const iconFile of icons) {
      const iconName = path.basename(iconFile, path.extname(iconFile));
      const iconNameFormatted = prepareIconName(category, iconName);
      const metaPath = path.join(metaCategoryPath, `${iconNameFormatted}.json`);

      await createOrUpdateMetaFile(metaPath, {
        category: category,
        fileName: iconFile
      });
    }
  }
}

async function processMatrixCategories() {
  console.log('⏳ Processing the category matrix...');

  const matrixCategories = await getDirectoryList(CONFIG.MATRIX_DIR);

  for (const matrixCat of matrixCategories) {
    const matrixCatPath = path.join(CONFIG.MATRIX_DIR, matrixCat);
    const iconLinks = await getIconFiles(matrixCatPath);

    for (const link of iconLinks) {
      const iconName = path.basename(link, path.extname(link));
      const metaPath = await findMetaFile(iconName);

      if (metaPath) {
        await addSubCategory(metaPath, matrixCat);
      } else {
        console.warn(`⚠️ Meta file not found for ${iconName} in the matrix category ${matrixCat}`);
      }
    }
  }
}

// region Work With Meta ////
async function createOrUpdateMetaFile(metaPath, data) {
  let metaContent;

  const category = toUpperFirstChar(camelcase(data.category))
  try {
    const fileData = await fs.readFile(metaPath, 'utf8');
    metaContent = JSON.parse(fileData);
  } catch {
    metaContent = {
      id: path.basename(metaPath, '.json'),
      fileName: data.fileName,
      updatedAt: null,
      category: category,
      subCategories: [],
      labels: []
    };
  }

  const needsUpdate =
    metaContent.category !== category ||
    metaContent.fileName !== data.fileName;

  if (needsUpdate) {
    metaContent.category = category;
    metaContent.fileName = data.fileName;
    metaContent.updatedAt = new Date().toISOString();
  }

  await fs.writeFile(metaPath, JSON.stringify(metaContent, null, 2));

  if (needsUpdate) {
    console.log(`🔄 Updated: ${path.relative(CONFIG.META_ROOT, metaPath)}`);
  }
}

async function addSubCategory(metaPath, subCategory) {
  const data = await fs.readFile(metaPath, 'utf8');
  const meta = JSON.parse(data);

  if (!meta.subCategories.includes(subCategory)) {
    meta.subCategories = [...new Set([...meta.subCategories, subCategory])].sort();
    meta.updatedAt = new Date().toISOString();
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
    console.log(`📂 Added subcategory: ${path.basename(metaPath)} → ${subCategory}`);
    return true;
  }
  return false;
}

async function findMetaFile(iconName) {
  const categories = await getDirectoryList(CONFIG.META_ROOT);

  for (const category of categories) {
    const iconNameFormatted = prepareIconName(category, iconName);
    const metaPath = path.join(CONFIG.META_ROOT, category, `${iconNameFormatted}.json`);
    try {
      await fs.access(metaPath);
      return metaPath;
    } catch {}
  }
  return null;
}
// endregion ////

// region Tools ////
async function getDirectoryList(dirPath) {
  try {
    const items = await fs.readdir(dirPath);
    const directories = [];

    for (const item of items) {
      if (item.startsWith('.')) continue;
      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);
      if (stat.isDirectory()) directories.push(item);
    }

    return directories;
  } catch (error) {
    console.warn(`⚠️ Error reading directory ${dirPath}: ${error.message}`);
    return [];
  }
}

async function getIconFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files.filter(file =>
      !file.startsWith('.') &&
      /\.(svg)$/i.test(file)
    );
  } catch (error) {
    console.warn(`⚠️ Error reading icons in ${dirPath}: ${error.message}`);
    return [];
  }
}

function toUpperFirstChar(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function prepareIconName(type, fileName) {
  let componentName = camelcase(
    fileName.replace(/\.svg$/, '')
      //.replaceAll('-', '')
      .replaceAll(' ', '')
      .replaceAll('(', '').replaceAll(')', '')
      .replaceAll('[', '').replaceAll(']', '')
      .replaceAll('{', '').replaceAll('}', ''),
    {
      pascalCase: true,
    }
  );

  /**
   * @memo clear component name
   */
  componentName = componentName
    .replace('Ui', '')
    .replace('White', '').replace('Black', '')
    .replace('Light', '').replace('Dark', '');

  if (type === 'common-service') {
    componentName = componentName.replace('Service', '');
  }

  componentName = toUpperFirstChar(componentName);

  return `${ componentName }Icon`;
}
// endregion ////

catalogIcons();
