import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

const startServer = async (port: number) => {
  try {
    log("Starting server initialization...");

    // Register routes before setting up Vite or static serving
    log("Registering routes...");
    const server = await registerRoutes(app);
    log("Routes registered successfully");

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error handling request: ${status} - ${message}`);
      res.status(status).json({ message });
      console.error(err);
    });

    // Set up static file serving or Vite after all API routes
    if (app.get("env") === "development") {
      log("Setting up Vite development server...");
      await setupVite(app, server);
      log("Vite development server setup complete");
    } else {
      log("Setting up static file serving...");
      serveStatic(app);
      log("Static file serving setup complete");
    }

    return new Promise((resolve, reject) => {
      log(`Attempting to start server on port ${port}...`);
      server.listen(port, "0.0.0.0", () => {
        log(`Server running successfully on port ${port}`);
        resolve(server);
      }).on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          log(`Error: Port ${port} is in use`);
          reject(new Error(`Port ${port} is in use`));
        } else {
          log(`Error starting server: ${error.message}`);
          reject(error);
        }
      });
    });
  } catch (error) {
    log(`Fatal error during server initialization: ${error}`);
    throw error;
  }
};

const tryPorts = async () => {
  const ports = [5000, 5001, 5002, 5003];
  log("Starting port selection process...");

  for (const port of ports) {
    try {
      log(`Attempting to start server on port ${port}...`);
      await startServer(port);
      log(`Successfully started server on port ${port}`);
      return;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Port')) {
        log(`Port ${port} is in use, trying next port...`);
        continue;
      }
      log(`Unexpected error while trying port ${port}: ${error}`);
      throw error;
    }
  }
  throw new Error('All ports in use. Please free up a port and try again.');
};

log("Beginning server startup sequence...");
tryPorts().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});