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
import { githubUrl, projects, site } from "@/lib/site";
import { Footer } from "@/components/layout/Footer";
import WorkPage from "@/app/work/page";
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
    expect(screen.getByText("Junior Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Selected projects")).toBeInTheDocument();
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

  it("links each project to its case file", () => {
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
    expect(screen.queryByText(/future archive/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/archive opens/i)).not.toBeInTheDocument();
  });

  it("can render the portfolio grid without a section heading", () => {
    render(<Work showHeading={false} />);

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
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      githubUrl,
    );
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/\+972/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ask the twin/i }),
    ).toBeInTheDocument();
  });

  it("keeps GitHub in the footer and leaves the phone number off the page", () => {
    renderWithTwin(<Footer />);

    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      githubUrl,
    );
    expect(screen.queryByRole("link", { name: /phone/i })).not.toBeInTheDocument();
  });

  it("renders the portfolio page without placeholder cards", () => {
    renderWithTwin(<WorkPage />);

    expect(screen.queryByText(/next case study/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/archive opens/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /calorieai/i })).toBeInTheDocument();
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

  it("shows build notes on a case page", () => {
    const project = projects[1];
    if (!project) {
      throw new Error("expected a project");
    }

    render(<ProjectCase project={project} />);

    expect(
      screen.getByRole("heading", { name: project.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(/build notes/i)).toBeInTheDocument();
    expect(screen.queryByText(/forthcoming/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^soon$/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /portfolio/i })).toHaveAttribute(
      "href",
      "/work",
    );
  });
});
