'use client';

import { useState, useRef, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function AIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState('default');
  const [toolLabel, setToolLabel] = useState('Select Tool');

  const textareaRef = useRef(null);

  const tools = [
    { key: 'text-to-question', label: 'Text to Question' },
    { key: 'mcq-generator', label: 'MCQ Generator' },
    { key: 'lesson-plan', label: 'Topic Wise Lesson Plan Maker' },
    { key: 'text-summarizer', label: 'Text Summarizer' },
  ];

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const handleSelectTool = (t) => {
    setTool(t.key);
    setToolLabel(t.label);
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], tool }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }

      const data = await res.json();
      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply ?? 'No reply',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `⚠️ Error: ${err.message || 'Unknown error'}`,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-tr from-white to-green-50">
      <div className="h-full flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-700 tracking-tight mb-4">
            How can <span className="text-green-600 tracking-wide font-extrabold">AI</span> assist you today?
          </h1>
        </div>

        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="px-6 pt-4 pb-2 max-h-[50vh] overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      m.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2 text-sm bg-gray-100 text-gray-800 animate-pulse">
                    Thinking…
                  </div>
                </div>
              )}
            </div>

            {tool !== 'default' && (
              <div className="px-6 pt-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
                  Using tool: {toolLabel}
                </span>
              </div>
            )}

            <form onSubmit={sendMessage} className="px-6 py-4 flex items-start gap-2">
              <textarea
                ref={textareaRef}
                placeholder="Ask anything"
                className="w-full text-gray-700 placeholder-gray-400 focus:outline-none resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2 rounded-full border-[1px] flex items-center justify-center cursor-pointer hover:bg-gray-50 disabled:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send-horizontal w-4 h-4"
                >
                  <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"></path>
                  <path d="M6 12h16"></path>
                </svg>
              </button>
            </form>

            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center space-x-4 text-gray-500">
                <button
                  type="button"
                  className="hover:text-gray-700"
                  onClick={() =>
                    setMessages((prev) => [
                      ...prev,
                      { id: crypto.randomUUID(), role: 'assistant', content: 'New tool soon…' },
                    ])
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>

                {/* Radix Dropdown Tool Selector */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="inline-flex w-56 justify-between items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                      {toolLabel}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content
                    className="min-w-[220px] bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50"
                    sideOffset={5}
                  >
                    {tools.map((t) => (
                      <DropdownMenu.Item
                        key={t.key}
                        className="cursor-pointer px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
                        onSelect={() => handleSelectTool(t)}
                      >
                        {t.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
