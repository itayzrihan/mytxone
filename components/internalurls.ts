//add the base URL for internal links exporting it 
//if development, use the local server URL
//if production, use the production server URL
export const ISDEV = 'development';

export const BASE_URL = ISDEV
  ? 'http://localhost:3000'
    : 'https://mytx.one';
