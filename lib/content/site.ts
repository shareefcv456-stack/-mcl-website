import type { Office } from "@/types/content";

export const SITE = {
  name: "MCL – Meem Continental Logistics",
  shortName: "MCL",
  legalName: "Meem Continental Logistics (MCL)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.meemcontinental.com",
  phone: { label: "+91 6238399011", tel: "+916238399011" },
  phoneAlt: { label: "+91 4952481111", tel: "+914952481111" },
  email: "director@meemcontinental.com",
  whatsapp: "https://wa.me/+916238399011",
  instagram: "https://www.instagram.com/continentalwcc?igsh=YTQwZjQ0NmI0OA%3D%3D&utm_source=qr",
  credit: { label: "Gedexo Technologies", href: "https://gedexo.com/" },
  tagline:
    "At MCL, our years of experience, unwavering commitment, and reliability have made us a trusted partner in logistics support.",
} as const;

/** Main navigation: the five primary pages. Blogs, Careers and Reviews stay reachable from the footer and from links
 * in the page content (the home testimonials link to /review). */
export const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Tracking", href: "/tracking" },
  { label: "Contact", href: "/contact" },
] as const;

/** Footer link columns. "Get a Quote" opens the quote dialog, so the footer renders it as a QuoteTrigger. */
export const FOOTER_COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;
export const FOOTER_QUICK = [
  { label: "Tracking", href: "/tracking" },
  { label: "Careers", href: "/career" },
  { label: "Blogs", href: "/blogs" },
] as const;
export const FOOTER_LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
] as const;

// Kochi: the live site shows two addresses (Aluva in the header panel, Elamakkara in footer + contact).
// Using the Elamakkara one (2 of 3 sources) — flagged in README for MCL to confirm.
export const OFFICES: Office[] = [
  {
    region: "UK",
    name: "United Kingdom",
    address: "286 A Lodge Avenue, Porters Avenue Street, Dagenham – London, RM8 2HF",
    phones: [{ label: "+44 7404 396481", tel: "+447404396481" }],
  },
  {
    region: "India",
    name: "Calicut",
    address: "A1 Ground Floor, Variyath Plaza, Feroke City Rd, Cheruvannur, Calicut, Kerala – 673631",
    phones: [
      { label: "+91 6238399011", tel: "+916238399011" },
      { label: "+91 4952481111", tel: "+914952481111" },
    ],
  },
  {
    region: "India",
    name: "Kochi",
    address: "Sakthi Enclave, Opposite Federal Bank, Perandoor Road, Elamakkara PO – 682026, Ernakulam",
    phones: [
      { label: "+91 6238399011", tel: "+916238399011" },
      { label: "+91 9249551711", tel: "+919249551711" },
    ],
  },
];

export const CANADA_NOTICE =
  "Canada, get ready! We're coming on your way. Our services will soon be available across the country.";
