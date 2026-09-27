import { describe, expect, it } from "vitest";
import {
  emailHref,
  getProject,
  githubUrl,
  journey,
  linkedInUrl,
  navItems,
  profileLinks,
  projects,
  site,
  skillGroups,
} from "@/lib/site";

describe("site content", () => {
  it("keeps identity and contact details from the profile", () => {
    expect(site.name).toBe("Uziel Chechik");
    expect(site.role).toBe("Junior Software Engineer");
    expect(site.email).toBe("Uzielchechik27@gmail.com");
    expect(emailHref()).toBe("mailto:Uzielchechik27@gmail.com");
    expect(githubUrl).toBe("https://github.com/uzielchechik27-design");
    expect(linkedInUrl).toBe("");
    expect(profileLinks()).toEqual([{ href: githubUrl, label: "GitHub" }]);
    expect(JSON.stringify(site)).not.toContain("+972");
  });

  it("exposes primary navigation targets", () => {
    expect(navItems.map((item) => item.label)).toEqual([
      "About",
      "Journey",
      "Work",
      "Contact",
    ]);
    expect(navItems.some((item) => item.href === "/work")).toBe(true);
  });

  it("covers the career journey in order", () => {
    expect(journey.map((entry) => entry.id)).toEqual([
      "maglan",
      "chevron",
      "openu",
    ]);
    expect(journey[0]?.organization).toContain("Maglan");
    expect(journey[1]?.organization).toContain("Chevron");
    expect(journey[2]?.role).toContain("Computer Science");
  });

  it("lists portfolio projects with unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(slugs).toEqual(["calorie-ai", "exam-solver", "clinic-os"]);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getProject("calorie-ai")?.title).toBe("CalorieAI");
    expect(getProject("missing")).toBeUndefined();
    const copy = JSON.stringify(projects);
    expect(copy).not.toContain("100%");
    expect(copy).not.toContain("zero data loss");
    expect(copy).not.toContain("shipped");
  });

  it("includes language and systems skill groups", () => {
    expect(skillGroups).toHaveLength(2);
    expect(skillGroups[0]?.items).toContain("Java");
    expect(skillGroups[1]?.items).toContain("System Design");
  });
});
