import type { LegalPage, LegalSection } from "@/types/content";

const CHANGES: LegalSection = {
  heading: "Changes to the Terms",
  intro: "We reserve the right to modify these Terms at any time. Users will be notified of any significant changes.",
};
const REFUND_LINK = [{ text: "Read our refund policy", href: "/refund-policy" }];

export const LEGAL_PAGES: Record<"privacy" | "terms" | "refund" | "shipping", LegalPage> = {
  privacy: {
    slug: "privacy-policy",
    title: "Privacy Policy",
    sections: [
      { heading: "Introduction", intro: "Meem Continental Logistics (MCL), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services." },
      {
        heading: "Information We Collect",
        intro: "We may collect information about you in various ways, including:",
        items: [
          { term: "Personal Information", detail: "When you register for an account, make a purchase, or contact us, we may collect personal information such as your name, email address, phone number, billing address, and shipping address." },
          { term: "Payment Information", detail: "We collect payment information to process transactions, including credit card numbers and billing details." },
          { term: "Automatically Collected Information", detail: "We may automatically collect information about your device, browsing actions, and usage patterns when you visit the Website, such as your IP address, browser type, operating system, and pages visited." },
        ],
      },
      {
        heading: "How We Use Your Information",
        intro: "We may use the information we collect from you in the following ways:",
        items: [
          { term: "To Provide Services", detail: "To process and manage your orders, shipments, and other services you request." },
          { term: "To Communicate", detail: "To send you emails or other communications related to your orders, account, or other inquiries." },
          { term: "To Improve Our Services", detail: "To analyze data and improve the functionality and performance of our Website." },
          { term: "To Comply with Legal Obligations", detail: "To comply with legal requirements, such as tax laws and regulations." },
        ],
      },
      {
        heading: "Sharing Your Information",
        intro: "We may share your information with:",
        items: [
          { term: "Service Providers", detail: "Third-party service providers who assist with payment processing, shipping, data analysis, and other business operations." },
          { term: "Legal Compliance", detail: "If required by law, we may disclose your information to comply with legal obligations, such as court orders or regulatory requirements." },
          { term: "Business Transfers", detail: "In the event of a merger, sale, or transfer of our business, your information may be transferred to the new owner." },
        ],
      },
      { heading: "Cookies and Tracking Technologies", intro: "We use cookies and similar tracking technologies to enhance your experience on our Website. You can control the use of cookies through your browser settings, but disabling them may affect the functionality of the Website." },
      { heading: "Data Security", intro: "We implement reasonable security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no security system is impenetrable, and we cannot guarantee the absolute security of your information." },
      { heading: "Data Retention", intro: "We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law." },
      { heading: "Your Rights", intro: "Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. If you wish to exercise these rights, please contact us using the information provided below." },
      { heading: "Children's Privacy", intro: "Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it." },
      CHANGES,
    ],
  },
  terms: {
    slug: "terms-of-service",
    title: "Terms of Service",
    sections: [
      { heading: "Acceptance of Terms", intro: "By accessing or using the services provided by MCL, we through the Website, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the Website." },
      { heading: "Services Provided", intro: "MCL has been a pioneer in the logistics field for several years, offering top-notch transportation services to businesses worldwide. Our team of professionals is dedicated to providing reliable, efficient, and timely logistics solutions, ensuring your cargo reaches its destination safely and on time. Our mission is to be the most trusted and professional logistics provider, continually working towards enhancing customer satisfaction through innovative solutions and exceptional service. At MCL, we believe in building long-lasting relationships with our clients by understanding their unique needs and delivering customized solutions." },
      {
        heading: "Prohibited Activities",
        intro: "Users are prohibited from:",
        items: [
          { term: "Illegal use", detail: "Using the Website for illegal activities." },
          { term: "Legal compliance", detail: "Violating any laws or regulations." },
          { term: "Website security", detail: "Interfering with the security or operation of the Website." },
        ],
      },
      {
        heading: "Payment Terms",
        intro: "Users agree to pay all applicable fees for the services rendered. We accept all payment methods.",
        items: [{ term: "Refund Policy", detail: REFUND_LINK }],
      },
      { heading: "Limitation of Liability", intro: "We are not liable for any indirect, incidental, or consequential damages arising from the use of our services." },
      {
        heading: "Dispute Resolution",
        // "Jurisdiction" is an unfilled placeholder on the live site — kept verbatim, flagged in README.
        items: [
          { term: "Governing Law", detail: "These Terms are governed by the laws of Jurisdiction." },
          { term: "Arbitration", detail: "Any disputes arising out of these Terms will be resolved through binding arbitration in Jurisdiction." },
          { term: "Refund Policy", detail: REFUND_LINK },
        ],
      },
      { heading: "Privacy Policy", intro: ["Your use of the Website is also governed by our Privacy Policy, which can be found ", { text: "here", href: "/privacy-policy" }, "."] },
      CHANGES,
    ],
  },
  refund: {
    slug: "refund-policy",
    title: "Refund Policy",
    sections: [
      { heading: "Introduction", intro: "Meem Continental Logistics (MCL), we strive to provide excellent service and customer satisfaction. This Refund Policy outlines the terms under which you may request a refund for services purchased through our website." },
      {
        heading: "Eligibility for Refunds",
        intro: "Refunds may be issued under the following circumstances:",
        items: [
          { term: "Service Cancellations", detail: "If you cancel a shipment or service before it has been processed or dispatched, you may be eligible for a full or partial refund." },
          { term: "Service Errors", detail: "If there was an error in the service provided by us, such as incorrect routing, mislabeling, or failure to deliver due to our fault, you may be eligible for a refund." },
          { term: "Non-Delivery", detail: "If the cargo is not delivered within the promised timeframe and the delay is not due to reasons beyond our control (e.g., natural disasters, customs delays), a refund may be considered." },
        ],
      },
      {
        heading: "Non-Refundable Services",
        intro: "Certain services are non-refundable, including:",
        items: [
          { term: "Completed Shipments", detail: "Once a shipment has been processed and dispatched, it is generally not eligible for a refund." },
          { term: "Customs Fees and Duties", detail: "Any customs fees, taxes, or duties paid are non-refundable." },
          { term: "Special Handling Charges", detail: "Fees for special handling, express services, or other premium services are non-refundable once the service has been initiated." },
        ],
      },
      {
        heading: "Refund Request Process",
        intro: "To request a refund, please follow these steps:",
        items: [
          { term: "Contact Customer Support", detail: ["Contact our customer support team at ", { text: "director@meemcontinental.com", href: "mailto:director@meemcontinental.com" }, " within 7 days of the service date to initiate a refund request."] },
          { term: "Provide Documentation", detail: "You may be required to provide documentation such as your order number, proof of payment, and details of the issue to support your refund request." },
          { term: "Review Process", detail: "Once we receive your refund request, we will review it and notify you of the outcome within 5 business days." },
        ],
      },
      {
        heading: "Refund Method",
        intro: "Approved refunds will be processed as follows:",
        items: [
          { term: "Original Payment Method", detail: "Refunds will be issued to the original payment method used at the time of purchase." },
          { term: "Processing Time", detail: "Refunds may take 7 business days to appear on your account, depending on your payment provider." },
        ],
      },
      {
        heading: "Exceptions and Exclusions",
        intro: "Refunds will not be granted in the following cases:",
        items: [
          { term: "Incorrect Information", detail: "Refunds will not be issued if the issue was caused by incorrect or incomplete information provided by the customer, such as wrong delivery address or incorrect shipment details." },
          { term: "Customer Cancellation", detail: "If a customer cancels a service after it has been initiated or is in progress, no refund will be provided." },
        ],
      },
      CHANGES,
    ],
  },
  shipping: {
    slug: "shipping-policy",
    title: "Shipping Policy",
    sections: [
      { heading: "Introduction", intro: "Meem Continental Logistics (MCL), we are committed to providing reliable and efficient shipping services. This Shipping Policy outlines the terms and conditions related to the shipment of goods through our website." },
      {
        heading: "Shipping Destinations",
        intro: "We offer shipping services to the following locations:",
        items: [
          { term: "Domestic Shipping", detail: "We ship to all major cities and regions within India, UK, European, Middle East Countries." },
          { term: "International Shipping", detail: "We provide shipping services to select international destinations. Please check our website or contact customer support for the list of countries we ship to." },
          { term: "Non-Delivery", detail: "If the cargo is not delivered within the promised timeframe and the delay is not due to reasons beyond our control (e.g., natural disasters, customs delays), a refund may be considered." },
        ],
      },
      {
        heading: "Shipping Costs",
        intro: "Shipping costs are calculated based on the following factors:",
        items: [
          { term: "Weight and Dimensions", detail: "The weight and size of the cargo determine the shipping cost." },
          { term: "Destination", detail: "The shipping destination affects the cost, with international shipments generally being more expensive." },
          { term: "Shipping Method", detail: "The chosen shipping method (Standard, Express, Freight) also impacts the cost." },
        ],
      },
      {
        heading: "Order Processing Time",
        items: [
          { term: "Processing Time", detail: "Orders are typically processed within 3 business days after payment is confirmed. Processing times may vary depending on the nature of the order and peak shipping periods." },
          { term: "Custom Orders", detail: "Orders that require special handling or custom services may take longer to process." },
        ],
      },
      {
        heading: "Delivery Times",
        intro: "Delivery times vary based on the shipping method and destination:",
        items: [
          { term: "Estimated Delivery", detail: "Delivery times provided are estimates and may vary due to factors such as customs clearance, weather conditions, and carrier delays." },
          { term: "Tracking", detail: "You will receive a tracking number once your order has been dispatched, allowing you to monitor the status of your shipment." },
        ],
      },
      {
        heading: "Shipping Restrictions",
        intro: "Certain items may be subject to shipping restrictions:",
        items: [
          { term: "Hazardous Materials", detail: "Items classified as hazardous materials may have restrictions and require special handling." },
          { term: "Prohibited Items", detail: "We do not ship items that are prohibited by law or carrier regulations." },
        ],
      },
      CHANGES,
    ],
  },
};
