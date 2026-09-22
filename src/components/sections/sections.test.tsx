import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProjectCase } from "@/components/sections/ProjectCase";
import { projects, site } from "@/lib/site";
import { renderWithTwin } from "@/test/render";

describe("page sections", () => {
  it("renders the hero identity and calls to action", () => {
    renderWithTwin(<Hero />);

    expect(
      screen.getByRole("heading", { name: /uziel chechik/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /selected work/i })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(
      screen.getByRole("button", { name: /ask the twin/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );
    expect(screen.getByText("2017–22")).toBeInTheDocument();
    expect(screen.getByText("2022–Now")).toBeInTheDocument();
    expect(screen.getByText("Chevron offshore security")).toBeInTheDocument();
    expect(screen.getByText("Maglan team lead")).toBeInTheDocument();
  });

  it("renders about copy from the profile", () => {
    render(<About />);

    expect(screen.getByRole("heading", { name: /about me/i })).toBeInTheDocument();
    expect(screen.getByText(/maglan unit/i)).toBeInTheDocument();
    expect(screen.getByText(/chevron israel/i)).toBeInTheDocument();
    expect(screen.getAllByText(/open university of israel/i).length).toBeGreaterThan(0);
  });

  it("renders the career journey timeline", () => {
    render(<Journey />);

    expect(screen.getByRole("heading", { name: /journey/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /team leader/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /offshore platform security/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /b\.sc\. computer science/i }),
    ).toBeInTheDocument();
  });

  it("links selected work into the future portfolio", () => {
    render(<Work />);

    expect(screen.getByRole("link", { name: /calorieai/i })).toHaveAttribute(
      "href",
      "/work/calorie-ai",
    );
    expect(
      screen.getByRole("link", { name: /automatic exam solver/i }),
    ).toHaveAttribute("href", "/work/exam-solver");
    expect(
      screen.getByRole("link", { name: /cosmetics clinic os/i }),
    ).toHaveAttribute("href", "/work/clinic-os");
    expect(
      screen.getByRole("link", { name: /open full portfolio/i }),
    ).toHaveAttribute("href", "/work");
  });

  it("hides the future archive CTA in compact portfolio mode", () => {
    render(<Work heading="Case files" compact />);

    expect(
      screen.queryByRole("link", { name: /open full portfolio/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /case files/i })).toBeInTheDocument();
  });

  it("can render the portfolio grid without a section heading", () => {
    render(<Work compact showHeading={false} />);

    expect(
      screen.queryByRole("heading", { name: /selected work/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /calorieai/i })).toBeInTheDocument();
  });

  it("renders the technical index", () => {
    render(<Skills />);

    expect(screen.getByRole("heading", { name: /systems/i })).toBeInTheDocument();
    expect(screen.getByText("Python (FastAPI)")).toBeInTheDocument();
    expect(screen.getByText("Prompt Engineering")).toBeInTheDocument();
  });

  it("exposes contact channels", () => {
    renderWithTwin(<Contact />);

    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );
    expect(screen.getByRole("link", { name: site.phone })).toHaveAttribute(
      "href",
      site.phoneHref,
    );
    expect(
      screen.getByRole("button", { name: /ask the twin/i }),
    ).toBeInTheDocument();
  });
});

describe("portfolio case files", () => {
  it("renders a project card that routes to its case page", () => {
    const project = projects[0];
    if (!project) {
      throw new Error("expected a project");
    }

    render(<ProjectCard project={project} />);

    expect(
      screen.getByRole("link", { name: new RegExp(project.title, "i") }),
    ).toHaveAttribute("href", `/work/${project.slug}`);
  });

  it("shows forthcoming portfolio links on a case page", () => {
    const project = projects[1];
    if (!project) {
      throw new Error("expected a project");
    }

    render(<ProjectCase project={project} />);

    expect(
      screen.getByRole("heading", { name: project.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(/live product/i)).toBeInTheDocument();
    expect(screen.getByText(/source repository/i)).toBeInTheDocument();
    expect(screen.getAllByText(/soon/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /portfolio/i })).toHaveAttribute(
      "href",
      "/work",
    );
  });
});
