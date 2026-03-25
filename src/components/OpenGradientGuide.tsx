import React from 'react';
import { Cpu, Shield, Database, Network, Code, ExternalLink } from 'lucide-react';

export default function OpenGradientGuide() {
  const sections = [
    {
      title: "OpenGradient Overview",
      icon: <Network size={20} className="text-blue-500" />,
      content: "Vertically-integrated decentralized infrastructure for secure and verifiable AI execution, agent and application deployment, and AI model hosting."
    },
    {
      title: "Python SDK",
      icon: <Code size={20} className="text-emerald-500" />,
      content: "Build applications with OpenGradient's verified AI infrastructure. Run ML and LLM inference, manage models, and deploy automated workflows with full integrity guarantees."
    },
    {
      title: "Decentralized Model Hub",
      icon: <Database size={20} className="text-purple-500" />,
      content: "A permissionless repository supporting all model architectures. Upload, browse, and use models instantly available for inference on the OpenGradient network."
    },
    {
      title: "MemSync",
      icon: <Cpu size={20} className="text-amber-500" />,
      content: "Long-term memory layer for AI with persistent context management. Automatically extract, organize, and search memories to build personalized AI applications."
    },
    {
      title: "Secure LLM Inference",
      icon: <Shield size={20} className="text-red-500" />,
      content: "Verifiable reasoning and execution via x402. Ensure the integrity of your AI model's outputs and execution."
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
          <Network size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">OpenGradient Documentation</h2>
          <p className="text-slate-500 text-sm">Decentralized AI Infrastructure & Verifiable Execution</p>
        </div>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-50 rounded-lg">
                {section.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h4 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
          <ExternalLink size={18} />
          Quick Resources
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="https://docs.opengradient.ai/developers/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 transition-colors text-sm font-medium text-indigo-700"
          >
            Getting Started
            <ChevronRight size={16} />
          </a>
          <a 
            href="https://docs.opengradient.ai/learn/architecture/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 transition-colors text-sm font-medium text-indigo-700"
          >
            Network Architecture
            <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
