import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export default function Guide() {
  const steps = [
    {
      title: "1. Define Core Features",
      items: [
        "Form Autofill with Encryption: Securely store user data and autofill forms using encrypted information.",
        "Internet Usage Encryption: Track and encrypt user browsing data to prevent third-party access.",
        "Data Encryption: Use AES-256 encryption for all stored data, with secure key management.",
        "Optional Features: Consider adding ad/tracker blockers and VPN integration for enhanced privacy."
      ]
    },
    {
      title: "2. Choose Technologies and Tools",
      items: [
        "Frontend: Use React or Angular for the user interface, or Electron for a desktop app.",
        "Backend: Utilize Python with Flask or Django, or Node.js for handling encryption and data storage.",
        "Database: Implement SQLite with SQLCipher for local encrypted storage or a cloud database with end-to-end encryption.",
        "Browser Extension: Develop using the WebExtensions API for cross-browser compatibility.",
        "Encryption: Leverage Python's cryptography library for AES encryption."
      ]
    },
    {
      title: "3. Develop Core Features",
      items: [
        "Secure Data Storage: Implement encrypted storage solutions to protect user information.",
        "Form Autofill: Create functionality to automatically fill forms using stored, encrypted data.",
        "Internet Usage Tracking and Encryption: Monitor and encrypt browsing data to ensure privacy."
      ]
    },
    {
      title: "4. Implement Security Measures",
      items: [
        "Ensure robust encryption for data at rest and in transit.",
        "Use secure key management practices to protect encryption keys."
      ]
    },
    {
      title: "5. Design User-Friendly Interface",
      items: [
        "Create an intuitive UI that simplifies form filling and privacy management for users.",
        "Ensure the app integrates seamlessly with browsers and does not disrupt user experience."
      ]
    },
    {
      title: "6. Testing and Iteration",
      items: [
        "Conduct thorough security and functionality testing.",
        "Optimize performance to prevent impact on device or browsing speed.",
        "Gather user feedback and refine the app for better usability and functionality."
      ]
    },
    {
      title: "7. Deployment and Maintenance",
      items: [
        "Prepare the app for release, ensuring all security measures are in place.",
        "Publish the app on appropriate platforms and provide user support.",
        "Monitor performance and update regularly to maintain security and add features."
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Privacy App Development Guide</h2>
          <p className="text-slate-500 text-sm">Organized steps to build secure and privacy-focused applications.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                {index + 1}
              </span>
              {step.title.split('. ')[1]}
            </h3>
            <ul className="space-y-3">
              {step.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
        <p className="text-blue-800 font-medium">
          By following these steps, you can develop a privacy-focused app that effectively protects user data while maintaining usability and performance.
        </p>
      </div>
    </div>
  );
}
