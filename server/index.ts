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
  let responseBody: Record<string, any> | undefined;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    responseBody = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      const logMessage = `${req.method} ${path} ${res.statusCode} ${duration}ms`;
      const responseLog = responseBody ? ` :: ${JSON.stringify(responseBody)}` : '';
      log(`${logMessage}${responseLog.length > 50 ? responseLog.slice(0, 49) + '…' : responseLog}`);
    }
  });

  next();
});

async function startServer(port: number): Promise<void> {
  try {
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });

    // Set up static serving or Vite middleware
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    server.listen(port, "0.0.0.0", () => {
      log(`Server running on port ${port}`);
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('EADDRINUSE')) {
      throw new Error(`Port ${port} is in use`);
    }
    throw error;
  }
}

async function tryPorts(): Promise<void> {
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
}

tryPorts().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});