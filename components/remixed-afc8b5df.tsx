import React, { useState, useEffect } from 'react';
import { 
  Brain, Mail, MessageSquare, MessageCircle, 
  Check, ArrowRight, Sparkles, Target, Calendar,
  Users, TrendingUp, Clock, X
} from 'lucide-react';

const SpiderXLanding = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);
  const [featureDescription, setFeatureDescription] = useState('');
  const [featurePriority, setFeaturePriority] = useState('Medium');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmailConfetti, setShowEmailConfetti] = useState(false);

  const handleSubmit = () => {
    if (email && email.includes('@')) {
      setShowEmailConfetti(true);
      setShowModal(true);
      setTimeout(() => {
        setShowEmailConfetti(false);
        setEmail('');
      }, 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleFeatureSubmit = () => {
    if (featureDescription.trim()) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowFeatureRequest(false);
        setFeatureDescription('');
        setFeaturePriority('Medium');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M9.31994 13.28H12.4099V20.48C12.4099 21.54 13.7299 22.04 14.4299 21.24L21.9999 12.64C22.6599 11.89 22.1299 10.72 21.1299 10.72H18.0399V3.51997C18.0399 2.45997 16.7199 1.95997 16.0199 2.75997L8.44994 11.36C7.79994 12.11 8.32994 13.28 9.31994 13.28Z" fill="#292D32"/>
                <path opacity="0.4" d="M8.5 4.75H1.5C1.09 4.75 0.75 4.41 0.75 4C0.75 3.59 1.09 3.25 1.5 3.25H8.5C8.91 3.25 9.25 3.59 9.25 4C9.25 4.41 8.91 4.75 8.5 4.75Z" fill="#292D32"/>
                <path opacity="0.4" d="M7.5 20.75H1.5C1.09 20.75 0.75 20.41 0.75 20C0.75 19.59 1.09 19.25 1.5 19.25H7.5C7.91 19.25 8.25 19.59 8.25 20C8.25 20.41 7.91 20.75 7.5 20.75Z" fill="#292D32"/>
                <path opacity="0.4" d="M4.5 12.75H1.5C1.09 12.75 0.75 12.41 0.75 12C0.75 11.59 1.09 11.25 1.5 11.25H4.5C4.91 11.25 5.25 11.59 5.25 12C5.25 12.41 4.91 12.75 4.5 12.75Z" fill="#292D32"/>
              </svg>
              <span className="text-xl font-semibold text-gray-900">SpiderX</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
            Never miss a task,
            <span className="block text-gray-500">Start getting things done</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI that spots and captures everything you need to act on
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
              />
              <button 
                onClick={handleSubmit}
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">Free for early adopters. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Managing multiple projects?<br />
              <span className="text-blue-600">These problems sound familiar.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6 h-48 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl blur-2xl opacity-60" />
                  <div className="relative grid grid-cols-4 gap-2">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${
                          i === 4 ? 'bg-gray-800 shadow-lg' : 
                          i === 5 ? 'bg-gray-600' :
                          i === 9 ? 'bg-gray-700' :
                          'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium mb-3">
                Daily Todo Capture
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Wasted</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Manually copying tasks from emails and chats to your todo app. Every. Single. Day.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6 h-48 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-2xl opacity-60" />
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto relative">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-2 bg-gray-300 top-0 left-1/2"
                          style={{
                            transform: `rotate(${i * 30}deg) translateX(-50%)`,
                            transformOrigin: 'center 64px'
                          }}
                        />
                      ))}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">7</div>
                          <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold shadow-xl">8</div>
                          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm">9</div>
                        </div>
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-700 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium mb-3">
                AI Prioritize
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Missing Tasks</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Important but not urgent tasks slip through when juggling 3+ projects simultaneously.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6 h-48 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl blur-2xl opacity-60" />
                  <div className="relative">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-lg ${
                            i === 6 ? 'bg-gray-800 flex items-center justify-center text-white font-mono text-sm shadow-2xl scale-110' : 
                            'bg-gray-200'
                          }`}
                        >
                          {i === 6 && 'A'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-xs font-medium mb-3">
                Team Sync & Check-ins
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Context Chaos</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Scattered todos across Gmail, Slack, WhatsApp. No single source of truth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gmail Demo - Simplified */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Works while you work
            </h2>
            <p className="text-xl text-gray-600">
              SpiderX sidebar captures tasks automatically while you work
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl aspect-video flex items-center justify-center">
            <p className="text-gray-500">Gmail + SpiderX Demo Screenshot</p>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Integrations
            </h2>
            <p className="text-xl text-gray-600">
              Connect SpiderX with your favorite tools
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">Connected</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div className="relative">
                  <div style={{ width: '120px', height: '120px' }} className="bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all hover:shadow-lg flex flex-col items-center justify-center cursor-pointer group p-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                      <Mail className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 text-center">Gmail</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>

                <div className="relative">
                  <div style={{ width: '120px', height: '120px' }} className="bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all hover:shadow-lg flex flex-col items-center justify-center cursor-pointer group p-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                      <MessageSquare className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 text-center">Google Chat</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">Coming Soon</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { name: 'Slack', icon: '#', color: 'purple' },
                  { name: 'WhatsApp', icon: <MessageCircle className="w-7 h-7 text-green-500" />, color: 'green' },
                  { name: 'Telegram', icon: '✈', color: 'blue' },
                  { name: 'Discord', icon: '🎮', color: 'indigo' }
                ].map((app, i) => (
                  <div key={i} className="relative">
                    <div style={{ width: '120px', height: '120px' }} className="bg-gray-50 border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center opacity-75 hover:opacity-90 transition-opacity cursor-pointer p-4">
                      <div className={`w-12 h-12 bg-${app.color}-50 rounded-xl flex items-center justify-center mb-2 text-2xl font-bold text-${app.color}-600`}>
                        {app.icon}
                      </div>
                      <div className="text-sm font-semibold text-gray-700 text-center">{app.name}</div>
                    </div>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Want to request an integration?</p>
            <button 
              onClick={() => setShowFeatureRequest(true)}
              className="px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Request Integration
            </button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
                Roadmap
              </h2>
              <p className="text-xl text-gray-600">
                See what we're building and suggest new features
              </p>
            </div>
            <button 
              onClick={() => setShowFeatureRequest(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Request Feature
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { title: 'Planned', color: 'blue', items: ['Slack Integration', 'Smart Reminders', 'Calendar Sync', 'Mobile App'] },
              { title: 'In Progress', color: 'purple', items: ['WhatsApp Detection', 'AI Priority Scoring', 'Team Collaboration'] },
              { title: 'Complete', color: 'green', items: ['Gmail Integration', 'Google Chat Monitor', 'Context Grouping', 'Ask AI Assistant'] }
            ].map((col, i) => (
              <div key={i} className={`bg-${col.color}-50 rounded-2xl p-6`}>
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-3 h-3 bg-${col.color}-500 rounded-full`} />
                  <h3 className="font-semibold text-lg">{col.title}</h3>
                </div>
                <div className="space-y-4">
                  {col.items.map((item, j) => (
                    <div key={j} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                      <div className="font-medium text-sm mb-2">{item}</div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Feature</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Have a feature idea?</h3>
            <p className="text-gray-600 mb-4">We'd love to hear your suggestions for SpiderX</p>
            <button 
              onClick={() => setShowFeatureRequest(true)}
              className="px-6 py-3 border-2 border-gray-300 rounded-full font-medium hover:border-gray-400 hover:bg-white transition-colors"
            >
              Request Feature
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
            Ready to stop missing tasks?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join 1,200+ professionals on the waitlist. Free for early adopters.
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-900"
              />
              <button onClick={handleSubmit} className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - COMPLETELY NEW AND SIMPLE */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9.31994 13.28H12.4099V20.48C12.4099 21.54 13.7299 22.04 14.4299 21.24L21.9999 12.64C22.6599 11.89 22.1299 10.72 21.1299 10.72H18.0399V3.51997C18.0399 2.45997 16.7199 1.95997 16.0199 2.75997L8.44994 11.36C7.79994 12.11 8.32994 13.28 9.31994 13.28Z" fill="#292D32"/>
            </svg>
            <span className="text-xl font-semibold text-gray-900">SpiderX</span>
          </div>
          
          <p className="text-gray-600">AI-powered task management</p>
          
          <p className="text-sm text-gray-500">© 2025 SpiderX. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {showEmailConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-20px',
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)],
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${Math.random() * 2 + 2}s`,
                      transform: `rotate(${Math.random() * 360}deg)`
                    }}
                  />
                ))}
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 z-10">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">You're on the list!</h3>
              <p className="text-gray-600 mb-6">Thanks for joining. We'll notify you when SpiderX launches.</p>
              <button onClick={() => setShowModal(false)} className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeatureRequest && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {!showConfetti ? (
              <>
                <button onClick={() => setShowFeatureRequest(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Request Feature</h3>
                  <p className="text-gray-600 mb-6">Tell us what you'd like to see in SpiderX</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your feature or problem
                      </label>
                      <textarea
                        value={featureDescription}
                        onChange={(e) => setFeatureDescription(e.target.value)}
                        placeholder="I would love to see..."
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={featurePriority}
                        onChange={(e) => setFeaturePriority(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                      >
                        <option value="Low">Low - Nice to have</option>
                        <option value="Medium">Medium - Would be helpful</option>
                        <option value="High">High - Critical for me</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => setShowFeatureRequest(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleFeatureSubmit}
                      className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)],
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${Math.random() * 2 + 2}s`,
                        transform: `rotate(${Math.random() * 360}deg)`
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center relative z-10 py-12">
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Thanks a lot, bro!</h3>
                  <p className="text-gray-600">We'll review your suggestion soon</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SpiderXLanding;