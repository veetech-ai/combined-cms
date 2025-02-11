import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; // Import morgan
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';

import { config } from './config';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Combined CMS API',
      version: '1.0.0',
      description: 'API documentation for the Combined CMS application'
    },
    servers: [
      {
        url: `${config.baseUrl}/api/v1`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./server/api/**/*.ts'] // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

import { errorHandler } from './middleware/error.middleware';
import { ensureValidToken } from './middleware/auth.middleware';

import authRoutes from './api/auth/auth.route';
import userRoutes from './api/users/users.routes';
import organizationRoutes from './api/organizations/organizations.routes';
import storeRoutes from './api/stores/stores.routes';
import storeModulesRoutes from './api/store-modules/store-modules.routes';
import displayRoutes from './api/displays/displays.routes';
import posRoutes from './api/pos/pos.routes';
import orderRoutes from './api/orders/orders.routes';
import { DBService } from './services/db.service';
import { prisma } from './db';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add request logger
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed logs in production
} else {
  app.use(morgan('dev')); // Simple logs in development
}

app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use CORS middleware
app.use(
  cors({
    origin: config.cors.origin, // Replace with allowed origins
    credentials: true // Allow cookies and credentials
  })
);

app.use(cookieParser());

const clientBuildPath = path.join(__dirname, '..', 'dist');

// Serve static files from the React build directory
app.use(express.static(clientBuildPath));

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Public routes that don't require authentication
app.use('/api/v1/displays', displayRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1', posRoutes);

// Protected routes middleware
app.use('/api/v1', ensureValidToken);

// Protected routes that require authentication
app.use('/api/v1', userRoutes);
app.use('/api/v1', organizationRoutes);
app.use('/api/v1', storeRoutes);
app.use('/api/v1', storeModulesRoutes);

// not found handler for /api endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Resource not found: ${req.originalUrl}` });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  // Check if it's an API route
  if (req.url.startsWith('/api/')) {
    return res
      .status(404)
      .json({ error: `Resource not found: ${req.originalUrl}` });
  }

  // For all other routes, serve the React app
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handling
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to restrict cross-origin requests to specific domains.
    credentials: false // Don't require credentials for socket connection
  }
});

const generateRandomCode = () => {
  return Array(4)
    .fill(0)
    .map(() =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0')
    )
    .join(' ');
};

// Emit a random hex code when the client connects
io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(`🔵 Client Connected: ${socket.id}`);

  const randomCode = generateRandomCode();
  // Send the generated code to the client
  socket.emit('receiveCode', { code: randomCode });

  // Generate new code on request
  socket.on('generateCode', () => {
    const newCode = generateRandomCode();
    socket.emit('receiveCode', { code: newCode });
    console.log('New code generated and sent:', newCode);
  });

  // Handle disconnect - remove redirect on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Remove the redirect on disconnect
    // socket.emit('redirect', { url: '/login' });
  });
});

server.listen(config.port, async () => {
  try {
    await new DBService(prisma).testConnection();
    console.log(
      `Server running on port ${config.port} (${
        process.env.NODE_ENV ?? 'development'
      } mode)`
    );
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      console.log('Unable to connect to DB:', error.message);
      process.exit(10);
    }
  }
});

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(11);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(12);
});

export { io };
