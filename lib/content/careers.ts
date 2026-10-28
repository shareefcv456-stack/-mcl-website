import type { Job } from "@/types/content";

export const CAREERS_INTRO =
  "Find the perfect job that matches your skills, passion, and goals. Discover opportunities in a supportive work environment that promotes growth, offers flexibility, and provides the right balance between career fulfillment and personal well-being.";

// Slug, title and requirements are copied from the live site as published. The slug says
// "python-develper" and the last three requirements read like a developer role — flagged in README.
export const JOBS: Job[] = [
  {
    slug: "python-develper",
    title: "Logistics Manager",
    employmentType: "Full time",
    company: "Meem Continental LLP",
    location: "Calicut",
    postedAt: "2024-07-08T11:14:00+05:30",
    requirements: [
      "In-depth understanding of logistics, transportation, and supply chain management principles and practices.",
      "Knowledge of cargo handling procedures and regulations.",
      "Ability to manage and motivate a team effectively.",
      "Excellent written and verbal communication skills.",
      "Ability to communicate with various stakeholders, including staff, clients, and vendors.",
      "Strong analytical skills to assess and optimize logistics processes.",
      "Ability to identify problems and implement effective solutions.",
      "Proficiency in logistics software and systems.",
      "Design and implement unit tests to ensure code reliability and maintainability.",
      "Collaborate with cross-functional teams to understand requirements and deliver high-quality solutions.",
      "Explore and integrate additional tools and technologies to enhance system capabilities.",
    ],
  },
];

export const getJob = (slug: string) => JOBS.find((j) => j.slug === slug);
export const jobHref = (slug: string) => `/career/detail/${slug}`;
