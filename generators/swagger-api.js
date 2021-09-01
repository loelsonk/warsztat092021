const path = require('path');
const { generateApi } = require('swagger-typescript-api');

generateApi({
  name: 'swagger-typescript-api.ts',
  url: 'https://g9n41.sse.codesandbox.io/v3/docs/swagger.json',
  output: path.join(__dirname, 'generated'),
  generateClient: true,
}).catch((e) => console.error(e));
