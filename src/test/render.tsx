import { render, type RenderOptions } from "@testing-library/react";
import { TwinProvider } from "@/components/twin/TwinProvider";

export function renderWithTwin(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    ...options,
    wrapper: TwinProvider,
  });
}
