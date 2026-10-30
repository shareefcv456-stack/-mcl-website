import {
  BookOpen, Boxes, Briefcase, ClipboardCheck, FileCheck, FileText, Gauge, Gift, Globe, Handshake, Headset, Check, House, Landmark, MapPin, PackageCheck, Pill, Plane,
  Shirt, Ship, ShoppingCart, SprayCan, Truck, Shield, Sparkles, Tag, Users, UtensilsCrossed, Volleyball, Zap,
} from "lucide-react";
import type { Faq } from "@/types/content";

export const INTRO =
  "Welcome to Meem Continental Logistics (MCL), your trusted partner in global logistics. With years of experience in the industry, we specialize in providing comprehensive transportation solutions across land, sea, and air. At MCL, we prioritize customer satisfaction and strive to deliver excellence in every shipment.";

export const ABOUT_SUMMARY =
  "MCL has been a pioneer in the logistics field for several years, offering top-notch transportation services to businesses worldwide.";

export const DELIVERED_STAT = { value: "1000+", label: "Delivered Goods" };

/**
 * Hero background footage. Empty until a licensed clip is added under public/videos; list the files here, e.g.
 *   { src: "/videos/hero-ship.webm", type: "video/webm", media: "(min-width: 768px)" },
 *   { src: "/videos/hero-ship.mp4", type: "video/mp4", media: "(min-width: 768px)" },
 *   { src: "/videos/hero-ship-mobile.mp4", type: "video/mp4" },
 * The current hero photo stays as poster and fallback. See components/home/HeroVideo.tsx.
 */
export const HERO_VIDEO: { src: string; type: "video/mp4" | "video/webm"; media?: string }[] = [];

export const BENEFITS = [
  {
    icon: Tag,
    title: "Transparent Pricing",
    text: "We provide clear, upfront information with no hidden fees or unexpected charges, ensuring you know exactly what you're paying for.",
  },
  {
    icon: Zap,
    title: "Speed and Efficiency You Can Trust",
    text: "At MCL, we understand that timely delivery is crucial. Our fast, efficient shipping process ensures that your shipments reach you quickly and reliably. We prioritize speed and efficiency, so you receive your items promptly and hassle-free.",
  },
];

export const CATEGORIES = [
  { title: "Documents and Paper works", icon: FileText, image: "/images/cat/paper-workes.webp" },
  { title: "Medicine and Pharma", icon: Pill, image: "/images/cat/Medicine.webp" },
  { title: "Personal Gifts", icon: Gift, image: "/images/cat/gift.webp" },
  { title: "Commercial Parcels", icon: Plane, image: "/images/cat/Commercial-Parcels.webp" },
  { title: "Books and Educational Materials", icon: BookOpen, image: "/images/cat/book.webp" },
  { title: "Beauty and Personal Care", icon: SprayCan, image: "/images/cat/beauty-item.webp" },
  { title: "Clothing and Apparels", icon: Shirt, image: "/images/cat/clothing.webp" },
  { title: "Household items", icon: House, image: "/images/cat/house-holding.webp" },
  { title: "Food and Perishable items", icon: UtensilsCrossed, image: "/images/cat/Food.webp" },
  { title: "Art and Antiques", icon: Landmark, image: "/images/cat/art.webp" },
  { title: "Grocery and Stationery", icon: ShoppingCart, image: "/images/cat/grocery.png" },
  { title: "Sports and Equipments", icon: Volleyball, image: "/images/cat/sports.webp" },
];

export const PROCESS = [
  { icon: ClipboardCheck, title: "Online Booking", text: "Book your shipments online easily." },
  { icon: Boxes, title: "Select Freight Type", text: "Choose the right freight type for your shipment." },
  { icon: Ship, title: "Book Shipping", text: "Arrange shipping for your cargo quickly." },
  { icon: MapPin, title: "Track Order", text: "Monitor your shipment in real time." },
  { icon: Truck, title: "Ship Movement", text: "Track the real-time movement of your ship." },
  { icon: PackageCheck, title: "Delivery", text: "Ensure the secure and reliable delivery of items." },
];

export const WHY_CHOOSE_US = [
  {
    icon: Briefcase,
    title: "Experience and Expertise",
    text: "With years of experience in the logistics industry, MCL has the expertise to handle all your transportation needs. Our professional team is dedicated to providing the highest level of service.",
  },
  {
    icon: Users,
    title: "Customer-Centric Approach",
    text: "At MCL, customer satisfaction is our top priority. We work closely with our clients to understand their needs and deliver tailored logistics solutions that meet their specific requirements.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    text: "Our extensive network enables us to provide seamless logistics services worldwide. Whether it's land, sea, or air transportation, MCL has the capabilities to deliver your cargo anywhere, anytime.",
  },
  {
    icon: Sparkles,
    title: "Innovative Solutions",
    text: "We continuously invest in the latest technology and innovative solutions to enhance our services and ensure efficient logistics operations.",
  },
  // The two below restate services MCL already describes on its service pages (Sea Cargo: packing, labeling and
  // customs clearance; Air Cargo: premium and economy service). No new claims.
  {
    icon: FileCheck,
    title: "Customs Clearance & Documentation",
    text: "From packing and labeling to customs clearance, we take care of the paperwork and formalities so your shipment moves through every checkpoint smoothly.",
  },
  {
    icon: Gauge,
    title: "Premium and Economy Options",
    text: "Choose premium service for expedited, priority handling or economy service for a cost-effective option, so every shipment fits your timeline and budget.",
  },
];

export const VALUES = [
  { icon: Handshake, title: "Reliability" },
  { icon: Shield, title: "Professionalism" },
  { icon: Headset, title: "Customer Satisfaction" },
  { icon: Sparkles, title: "Innovation" },
  { icon: Check, title: "Integrity" },
];

export const PORTFOLIO = [
  { title: "Product Distribution", image: "/images/work1-1.jpg", alt: "Crane loading a shipping container at port" },
  { title: "Transport For Product", image: "/images/work1-2.jpg", alt: "Aerial view of a loaded container ship" },
  { title: "Packing & Distribution", image: "/images/work1-3.jpg", alt: "Warehouse aisles with packed goods" },
  { title: "Effective Packaging", image: "/images/work1-4.jpg", alt: "Container ship at sea seen from above" },
];

export const TESTIMONIALS = [
  {
    name: "Arun",
    image: "/images/testi1-1_sahntIK.png",
    quote:
      "We have been using this cargo service for over a year now, and they have never disappointed. From timely pickups to safe deliveries, their service is impeccable. Highly recommended.",
  },
  {
    name: "Deepa",
    image: "/images/testimonial-4_aZ6jqhM.jpg",
    quote:
      "The entire process, from booking to delivery, was seamless. The team was professional and always available to answer our queries. Our cargo arrived on time and in perfect condition.",
  },
];

export const FAQ_INTRO =
  "These FAQs cover various aspects of your cargo services, helping customers find the information they need quickly and easily.";

export const FAQS: Faq[] = [
  {
    question: "What services do you offer?",
    answer:
      "We offer a wide range of cargo services including air freight, sea freight, road transport, and logistics solutions. Our services also include customs clearance, warehousing, and distribution.",
  },
  {
    question: "How do I book a shipment?",
    answer:
      "You can book a shipment through our online booking platform, by contacting our customer service team, or by visiting one of our office locations.",
  },
  {
    question: "How do I track my shipment?",
    answer:
      "You can track your shipment in real-time using our online tracking tool. Simply enter your tracking number on our website.",
  },
  {
    question: "What items are prohibited from being shipped?",
    answer:
      "Prohibited items include hazardous materials, flammable liquids, perishable goods (without proper packaging), illegal substances, and items restricted by international regulations. Please refer to our list of prohibited items for more details.",
  },
  {
    question: "What is your policy on damaged or lost goods?",
    answer:
      "In the event of damaged or lost goods, please contact our customer service team immediately. We will initiate an investigation and work with you to resolve the issue, including compensation if applicable.",
  },
  {
    question: "How can I get a quote for shipping?",
    answer:
      "You can request a quote through our website by filling out the quote request form, or you can contact our sales team directly at email or phone number. Provide details such as cargo type, weight, dimensions, and destination for an accurate quote.",
  },
  {
    question: "What documents are required for shipping?",
    answer:
      "Common documents include the Bill of Lading, Commercial Invoice, Packing List, and any required permits or certificates. Specific documents may vary based on the type of cargo and destination.",
  },
];

export const VOLUME_INTRO =
  "In accordance with international standards, the cost of your shipment is determined by both its volume and weight. Our volume conversion tool allows you to easily calculate your shipment's volumetric weight and compare it with its actual weight. We will use the higher weight between the two to calculate your shipping costs.";

export const SUPPORT_TEXT =
  "At MCL, we're always here to help. Get answers to your questions and the support you need with our on-call service and live chat, whenever you need it.";
