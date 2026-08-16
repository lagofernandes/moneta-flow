import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReportsPage from "./page";

// Mock do componente filho
vi.mock("@/components/reports/ExportCard", () => ({
  ExportCard: () => <div data-testid="mock-export-card">Mock ExportCard</div>
}));

describe("ReportsPage", () => {
  it("renders the page header correctly", () => {
    render(<ReportsPage />);
    expect(screen.getByText("Relatórios")).toBeDefined();
    expect(screen.getByText("Exporte seus dados e visualize análises detalhadas das suas finanças.")).toBeDefined();
  });

  it("renders the ExportCard component", () => {
    render(<ReportsPage />);
    expect(screen.getByTestId("mock-export-card")).toBeDefined();
  });

  it("renders the placeholder cards", () => {
    render(<ReportsPage />);
    expect(screen.getByText("Fluxo de Caixa")).toBeDefined();
    expect(screen.getByText("Por Categoria")).toBeDefined();
    expect(screen.getByText("Top Estabelecimentos")).toBeDefined();
    
    // Check if "Em Breve (V2)" badges are present
    const badges = screen.getAllByText("Em Breve (V2)");
    expect(badges.length).toBe(3);
  });
});
