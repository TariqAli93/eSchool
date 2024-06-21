#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const resourceName = process.argv[2]
const resourceNamePlural = `${resourceName}s`
const resourceNameCapitalized =
  resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
const resourceNamePluralCapitalized =
  resourceNamePlural.charAt(0).toUpperCase() + resourceNamePlural.slice(1)

if (!resourceName) {
  console.error('Please provide a resource name (e.g., student, teacher)')
  process.exit(1)
}

const controllerDir = path.join(__dirname, 'controllers')
const modelDir = path.join(__dirname, 'models')
const routeDir = path.join(__dirname, 'routes')

// Ensure directories exist
;[controllerDir, modelDir, routeDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
})

// Controller Template
const controllerTemplate = `
import ${resourceNameCapitalized}Model from '../models/${resourceName}.model.js';

// Get all ${resourceNamePlural}
export const getAll${resourceNamePluralCapitalized} = async (req, res) => {
  try {
    const ${resourceNamePlural} = await ${resourceNameCapitalized}Model.getAll();
    res.send(${resourceNamePlural});
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving ${resourceNamePlural}.',
    });
  }
};

// Get a single ${resourceName}
export const get${resourceNamePluralCapitalized}ById = async (req, res) => {
  try {
    const { id } = req.params;
    const ${resourceName} = await ${resourceNameCapitalized}Model.getById(id);
    if (!${resourceName}) {
      res.status(404).send({ message: 'Not found' });
    } else {
      res.send(${resourceName});
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving ${resourceName}.',
    });
  }
};

// Create a new ${resourceName}
export const create${resourceNamePluralCapitalized} = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  try {
    const new${resourceNameCapitalized} = await ${resourceNameCapitalized}Model.create(req.body);
    res.send(new${resourceNameCapitalized});
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the ${resourceName}.',
    });
  }
};

// Update an existing ${resourceName}
export const update${resourceNamePluralCapitalized} = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  try {
    const { id } = req.params;
    const updated${resourceNameCapitalized} = await ${resourceNameCapitalized}Model.updateById(id, req.body);
    if (!updated${resourceNameCapitalized}) {
      res.status(404).send({ message: 'Not found' });
    } else {
      res.send(updated${resourceNameCapitalized});
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while updating the ${resourceName}.',
    });
  }
};

// Delete a ${resourceName}
export const delete${resourceNamePluralCapitalized} = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted${resourceNameCapitalized} = await ${resourceNameCapitalized}Model.remove(id);
    if (!deleted${resourceNameCapitalized}) {
      res.status(404).send({ message: 'Not found' });
    } else {
      res.send({ message: 'Deleted' });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while deleting the ${resourceName}.',
    });
  }
};

// delete all ${resourceName}
export const deleteAll${resourceNamePluralCapitalized} = async (req, res) => { /* ... (Implementation) ... */ }
`

// Model Template - Still empty, as Prisma handles models
const modelTemplate = `
// Prisma model
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ${resourceNamePluralCapitalized} = function(${resourceNamePluralCapitalized}) {

};

${resourceNamePluralCapitalized}.getAll = async (result) => {}

${resourceNamePluralCapitalized}.getById = async (id, result) => {}

${resourceNamePluralCapitalized}.create = async (new${resourceNameCapitalized}, result) => {}

${resourceNamePluralCapitalized}.updateById = async (id, ${resourceName}, result) => {}

${resourceNamePluralCapitalized}.remove = async (id, result) => {}

${resourceNamePluralCapitalized}.removeAll = async (result) => {}

export default ${resourceNamePluralCapitalized};
`

// Route Template
const routeTemplate = `
import { getAll${resourceNamePluralCapitalized}, get${resourceNamePluralCapitalized}ById, create${resourceNamePluralCapitalized}, update${resourceNamePluralCapitalized}, delete${resourceNamePluralCapitalized} } from '../controllers/${resourceName}.controller.js';

const ${resourceName}Routes = (app) => {
  app.get('/${resourceNamePlural}', getAll${resourceNamePluralCapitalized});
  app.get('/${resourceNamePlural}/:id', get${resourceNamePluralCapitalized}ById);
  app.post('/${resourceNamePlural}', create${resourceNamePluralCapitalized});
  app.put('/${resourceNamePlural}/:id', update${resourceNamePluralCapitalized});
  app.delete('/${resourceNamePlural}/:id', delete${resourceNamePluralCapitalized});
};

export default ${resourceName}Routes;
`

// File Writing with Error Handling
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content)
    console.log(`Created ${filePath}`)
  } catch (error) {
    console.error(`Error creating ${filePath}: ${error.message}`)
  }
}

writeFile(
  path.join(controllerDir, `${resourceName}.controller.js`),
  controllerTemplate,
)

writeFile(path.join(modelDir, `${resourceName}.model.js`), modelTemplate)

writeFile(path.join(routeDir, `${resourceName}.routes.js`), routeTemplate)
