const fse = require('fs-extra');
const path = require('path');

const TYPES_OUTPUT_PATH = path.join(__dirname, '..', 'source', 'types');
const TYPES_INPUT_PATH = path.join(__dirname, '..', '..', 'source', 'types');

const ERRORS_INPUT_PATH = path.join(__dirname, '..', '..', 'source', 'errors');
const ERRORS_OUTPUT_PATH = path.join(__dirname, '..', 'source', 'errors', 'api-errors');

try {
    fse.copySync(TYPES_INPUT_PATH, TYPES_OUTPUT_PATH);
}
catch (error) {
    console.error(error);
}

try {
    fse.copySync(ERRORS_INPUT_PATH, ERRORS_OUTPUT_PATH, { overwrite: true });
}
catch (error) {
    console.error(error);
}
