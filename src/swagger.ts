import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const routesGlob =
  process.env.NODE_ENV === 'production'
    ? path.resolve(process.cwd(), 'dist/routes/*.js')
    : path.resolve(process.cwd(), 'src/routes/*.ts');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'Quiz Engine API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
    servers: [
      { url: 'http://localhost:4000/api', description: 'Local' }
    ]
  },
  apis: [routesGlob],
};

export const swaggerSpec = swaggerJsdoc(options);