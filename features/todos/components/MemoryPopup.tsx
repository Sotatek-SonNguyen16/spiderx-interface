"use client";

interface MemoryPopupProps {
  onClose?: () => void;
}

export default function MemoryPopup({ onClose }: MemoryPopupProps) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[700px] max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-8 animate-[slideUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Memory</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-[#f5f5f7] text-xl transition-colors hover:bg-[#e5e5e7]"
          >
            ×
          </button>
        </div>
        <div className="markdown-content leading-relaxed text-[#1d1d1f]">
          <h1 className="mb-4 text-[28px] font-semibold">NoteX Product Memory</h1>

          <h2 className="mb-4 mt-6 text-[22px] font-semibold">🎯 Vision & Mission</h2>
          <p className="mb-4">
            NoteX is an AI-powered meeting and content summarization application serving both
            B2C and B2B markets. We help individuals and businesses save time and improve
            work efficiency through AI technology.
          </p>

          <h2 className="mb-4 mt-6 text-[22px] font-semibold">✨ Core Features</h2>
          <ul className="mb-4 ml-6 list-disc space-y-2">
            <li>
              <strong>AI Transcription:</strong> Convert audio/video to text with high accuracy
            </li>
            <li>
              <strong>Smart Summary:</strong> Intelligent summarization of meetings and documents
            </li>
            <li>
              <strong>Mindmap Generation:</strong> Automatically generate mindmaps from content
            </li>
            <li>
              <strong>Multi-language Translation:</strong> Support for multi-language translation
            </li>
            <li>
              <strong>Content Creation Tools:</strong> AI-powered content creation tools
            </li>
          </ul>

          <h2 className="mb-4 mt-6 text-[22px] font-semibold">🤝 Major Clients</h2>
          <ul className="mb-4 ml-6 list-disc space-y-2">
            <li>
              <strong>Vietnam Airlines:</strong> Currently in pilot and technical
              demonstration phase
            </li>
            <li>
              <strong>Musinsa (Korea):</strong> E-commerce company, currently in client
              relationship management process
            </li>
          </ul>

          <h2 className="mb-4 mt-6 text-[22px] font-semibold">🚀 Recent Development</h2>
          <p className="mb-4">
            We are focusing on developing the "Re-generate Summary" feature with version
            management capabilities, improving Vietnamese localization for AI features, and
            optimizing competitive analysis of meeting transcription tools.
          </p>

          <blockquote className="mb-4 ml-0 border-l-4 border-[#007aff] pl-4 italic text-[#666]">
            "Our goal is to make every meeting more productive and every piece of content more
            accessible through the power of AI."
          </blockquote>

          <h2 className="mb-4 mt-6 text-[22px] font-semibold">📊 Market Strategy</h2>
          <p className="mb-4">
            NoteX is transitioning from B2C to B2B market with a focus on enterprise customers. We
            are building comprehensive feature specifications, user stories for development
            teams, and optimizing customer support processes.
          </p>

          <h3 className="mb-2 mt-5 text-lg font-semibold">Key Metrics</h3>
          <ul className="mb-4 ml-6 list-disc space-y-2">
            <li>User engagement tracking through database analytics</li>
            <li>AI summarization accuracy monitoring</li>
            <li>Multi-language performance optimization</li>
            <li>Customer satisfaction and retention rates</li>
          </ul>

          <pre className="mb-4 overflow-x-auto rounded-lg bg-[#f5f5f7] p-4">
            <code className="font-mono text-sm">
              {`// Sample API Integration
const noteX = {
  transcribe: async (audioFile) => {
    return await ai.transcribe(audioFile, { language: 'vi' });
  },
  summarize: async (text) => {
    return await ai.summarize(text, { format: 'structured' });
  }
};`}
            </code>
          </pre>

          <h2 className="mb-4 mt-6 text-[22px] font-semibold">🔧 Technical Stack</h2>
          <p className="mb-4">
            NoteX uses cutting-edge technologies including Large Language Models, n8n workflow
            automation, computer vision systems, and advanced database management for performance
            analysis and optimization.
          </p>
        </div>
      </div>
    </div>
  );
}

