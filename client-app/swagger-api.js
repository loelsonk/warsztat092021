const path = require('path');
const { generateApi } = require('swagger-typescript-api');

generateApi({
  name: 'api.ts',
  url: 'https://g9n41.sse.codesandbox.io/v3/docs/swagger.json',
  output: path.join(__dirname),
  generateClient: true,
}).catch((e) => console.error(e));
