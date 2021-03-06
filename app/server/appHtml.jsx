/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import { h } from 'preact'; /** @jsx h */
import preactRenderToString from 'preact-render-to-string';
import App from '../components/App/App';
import {
  WEBPACK_BUNDLE,
} from '../constants';

const data = require(`../data/data.json`);

export default ({ dataFileName = `data.json`, scriptFileName, mode }) => {
  let scriptSrc;
  let styleTag = ``;

  if (mode === `production`) {
    scriptSrc = scriptFileName;

    const stylesPath = path.resolve(__dirname, `../../public/styles.css`);
    const styles = fs.readFileSync(stylesPath, `utf8`);

    styleTag = `<style>${styles}</style>`;
  } else {
    scriptSrc = `http://localhost:8081/${WEBPACK_BUNDLE}`;
  }

  const appHtml = preactRenderToString(<App data={data} version={process.env.npm_package_version} />);

  return `<!DOCTYPE html>
  <html>
    <head>
      <title>Know it all</title>
      
      <meta charset="utf8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <meta name="theme-color" content="#bf360c">
      <meta name="description" content="A big list of all the props, values, methods, functions, interfaces, modules, constants, constructors, events, attributes, parameters, return values, variables, elements, statements, operators, declarations, types, primatives, selectors and units of all the APIs related to web development.">

      <link rel="preload" href="${dataFileName}" />
      <link rel="preload" href="${scriptSrc}" as="script" />

      <link rel="prefetch" href="${dataFileName}" />
      <link rel="prefetch" href="${scriptSrc}" />

      <link rel="manifest" href="manifest.json">
      
      ${styleTag}
    </head>
    
    <body>
      ${appHtml}
      
      <script>
        (function() {
          window.APP_DATA = {
            dataFileName: '${dataFileName}',
            version: '${process.env.npm_package_version}',
          };
          
          var newBrowser = (
            'fetch' in window &&
            'Promise' in window &&
            'assign' in Object &&
            'keys' in Object
          );
          
          if (!newBrowser) {
            console.log('You need polyfills to do a job. Shame.');
            
            var scriptEl = document.createElement('script');
            scriptEl.src = '${scriptSrc}'.replace('app.', 'polyfills.');
          
            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(scriptEl, firstScript);
          }
        })();
      </script>
      
      <script src="${scriptSrc}"></script>
    </body>
  </html>
  `;
};

/* eslint-enable max-len */
