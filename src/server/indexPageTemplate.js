import path from 'path';
import fs from 'fs';
import template from 'lodash/string/template';

let indexPageTemplate = template(String(fs.readFileSync(path.join(__dirname, '/index.html'))));
export default indexPageTemplate;
