import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExportCard } from "./ExportCard";

// Mock URL setup
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

describe("ExportCard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly", () => {
    render(<ExportCard />);
    expect(screen.getByText("Extrato Completo")).toBeDefined();
    expect(screen.getByText("Gerar Arquivo (.csv)")).toBeDefined();
  });

  it("handles successful export", async () => {
    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["mock csv data"])),
    });

    render(<ExportCard />);
    const button = screen.getByText("Gerar Arquivo (.csv)");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Exportação concluída com sucesso!")).toBeDefined();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/export");
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("handles failed export", async () => {
    // Mock failed fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    render(<ExportCard />);
    const button = screen.getByText("Gerar Arquivo (.csv)");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Erro ao exportar dados")).toBeDefined();
    });
  });
});
