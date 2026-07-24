import { Request, Response } from "express";
import multer from "multer";
import { storagePut } from "../storage";
import crypto from "crypto";

// Configurar multer para memória (não salva em disco)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"));
    }
  },
});

// Configurar multer para arquivos de produto (PDF, MP3, etc.) - limite maior
const uploadProductFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB para PDFs e audiobooks
  },
  fileFilter: (req, file, cb) => {
    // Aceitar PDF, MP3, MP4, ZIP e outros formatos de produto digital
    const allowed = [
      "application/pdf",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "video/mp4",
      "application/zip",
      "application/x-zip-compressed",
    ];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido. Use PDF, MP3, MP4 ou ZIP."));
    }
  },
});

export function setupUploadRoute(app: any) {
  // Endpoint de upload de arquivo de produto (PDF, MP3, etc.)
  app.post("/api/upload/product-file", uploadProductFile.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      // Gerar nome único para o arquivo
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
      const filePath = `product-files/${fileName}`;

      // Fazer upload para S3
      const result = await storagePut(filePath, req.file.buffer, req.file.mimetype);

      // Retornar URL pública
      res.json({
        url: result.url,
        key: result.key,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      });
    } catch (error) {
      console.error("Erro no upload do arquivo de produto:", error);
      res.status(500).json({ error: "Erro ao fazer upload do arquivo" });
    }
  });

  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      // Gerar nome único para o arquivo
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
      const filePath = `products/${fileName}`;

      // Fazer upload para S3
      const result = await storagePut(filePath, req.file.buffer, req.file.mimetype);

      // Retornar URL pública
      res.json({
        url: result.url,
        key: result.key,
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: "Erro ao fazer upload" });
    }
  });
}
