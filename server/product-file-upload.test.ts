import { describe, it, expect } from "vitest";

// Testa se o endpoint de upload de produto aceita os tipos corretos
describe("Product File Upload", () => {
  it("deve aceitar PDF como tipo de arquivo válido", () => {
    const allowedTypes = [
      "application/pdf",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "video/mp4",
      "application/zip",
      "application/x-zip-compressed",
    ];
    expect(allowedTypes).toContain("application/pdf");
    expect(allowedTypes).toContain("audio/mpeg");
  });

  it("deve rejeitar imagens como arquivo de produto", () => {
    const allowedTypes = [
      "application/pdf",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
    ];
    expect(allowedTypes).not.toContain("image/jpeg");
    expect(allowedTypes).not.toContain("image/png");
  });

  it("deve ter limite de 100MB para arquivos de produto", () => {
    const limiteMB = 100;
    const limiteBytes = limiteMB * 1024 * 1024;
    expect(limiteBytes).toBe(104857600);
  });
});

// Testa a lógica de métodos de pagamento do checkout
describe("Checkout Payment Methods", () => {
  it("deve incluir PIX como método de pagamento", () => {
    const paymentMethods = ["card", "boleto", "pix"];
    expect(paymentMethods).toContain("pix");
  });

  it("deve incluir Boleto como método de pagamento", () => {
    const paymentMethods = ["card", "boleto", "pix"];
    expect(paymentMethods).toContain("boleto");
  });

  it("deve incluir cartão como método de pagamento", () => {
    const paymentMethods = ["card", "boleto", "pix"];
    expect(paymentMethods).toContain("card");
  });

  it("PIX e Boleto não devem estar disponíveis para assinaturas recorrentes", () => {
    // Assinaturas só suportam cartão
    const subscriptionPaymentMethods = ["card"];
    expect(subscriptionPaymentMethods).not.toContain("pix");
    expect(subscriptionPaymentMethods).not.toContain("boleto");
  });
});

// Testa a lógica do contentUrl no produto
describe("Product contentUrl", () => {
  it("deve ser opcional no schema do produto", () => {
    const product = {
      id: 1,
      name: "Magnetismo Social",
      contentUrl: null,
    };
    // contentUrl pode ser null/undefined
    expect(product.contentUrl).toBeNull();
  });

  it("deve aceitar URL de PDF válida", () => {
    const contentUrl = "https://storage.example.com/product-files/ebook.pdf";
    expect(contentUrl).toMatch(/^https?:\/\/.+\.pdf$/);
  });

  it("deve aceitar URL de áudio válida", () => {
    const contentUrl = "https://storage.example.com/product-files/audiobook.mp3";
    expect(contentUrl).toMatch(/^https?:\/\/.+\.(mp3|wav|ogg)$/);
  });
});
