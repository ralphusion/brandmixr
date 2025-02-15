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
    // Register routes before setting up Vite or static serving
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // Set up static file serving or Vite after all API routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    return new Promise((resolve, reject) => {
      server.listen(port, "0.0.0.0", () => {
        log(`Server running on port ${port}`);
        resolve(server);
      }).on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          reject(new Error(`Port ${port} is in use`));
        } else {
          reject(error);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

const tryPorts = async () => {
  const ports = [5000, 5001, 5002, 5003];

  for (const port of ports) {
    try {
      await startServer(port);
      return;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Port')) {
        log(`Port ${port} is in use, trying next port...`);
        continue;
      }
      throw error;
    }
  }
  throw new Error('All ports in use. Please free up a port and try again.');
};

tryPorts().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});