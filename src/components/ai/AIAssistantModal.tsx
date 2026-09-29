import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Bot, User as UserIcon, ShieldAlert } from 'lucide-react';

export const AIAssistantModal: React.FC = () => {
  const {
    isAIModalOpen,
    setIsAIModalOpen,
    currentUser,
    hasPermission,
    currentTenant,
    products,
    customers,
    orders,
    formatMoney,
  } = useApp();

  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: `Hello ${currentUser.name}! I am your Be Shad Trader AI Assistant for "${currentTenant.name}". Ask me about low stock alerts, top selling products, customer receivables, or distribution orders!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAIModalOpen) return null;

  const quickQuestions = [
    'Which products are low in stock?',
    'What were my total sales this month?',
    'Who owes us the most money?',
    'What are our top selling items?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const query = userMsg.toLowerCase();

      // Check for restricted questions if user is ORDER_TAKER, SALESMAN, CASHIER etc.
      const isFinancialQuery =
        query.includes('profit') ||
        query.includes('total sale') ||
        query.includes('revenue') ||
        query.includes('cost') ||
        query.includes('margin') ||
        query.includes('balance sheet');

      if (isFinancialQuery && !hasPermission('canViewFinancials')) {
        reply = `Access Restricted: As a "${currentUser.role}", your security profile does not have permission to access company-wide financial metrics, net profits, or purchase costs. You can however ask about product stock availability, delivery routes, and assigned customer orders.`;
      } else if (query.includes('low stock') || query.includes('stock alert') || query.includes('out of stock')) {
        const lowStock = products.filter((p) => p.currentStock <= p.minStock);
        if (lowStock.length === 0) {
          reply = `Great news! All products are currently above their minimum stock thresholds across warehouses.`;
        } else {
          reply = `Here are the ${lowStock.length} products currently below safe stock limits:\n` +
            lowStock.slice(0, 5).map((p) => `• ${p.name} (Current: ${p.currentStock} ${p.unit}, Min: ${p.minStock})`).join('\n') +
            (lowStock.length > 5 ? `\n...and ${lowStock.length - 5} more items.` : '');
        }
      } else if (query.includes('sale') || query.includes('revenue')) {
        const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const orderCount = orders.length;
        reply = `For ${currentTenant.name}, total recorded sales across all channels stand at ${formatMoney(totalSales)} across ${orderCount} completed and pending orders.`;
      } else if (query.includes('owe') || query.includes('debtor') || query.includes('receivable')) {
        const topDebtors = [...customers].sort((a, b) => b.currentBalance - a.currentBalance).slice(0, 4);
        reply = `Top customers with outstanding balances:\n` +
          topDebtors.map((c) => `• ${c.name} (${c.company}): ${formatMoney(c.currentBalance)}`).join('\n');
      } else if (query.includes('top selling') || query.includes('popular') || query.includes('best product')) {
        const top = products.slice(0, 4);
        reply = `Our highest demand inventory lines this season:\n` +
          top.map((p) => `• ${p.name} (${p.category}) - Wholesale ${formatMoney(p.wholesalePrice)}`).join('\n');
      } else {
        reply = `Based on current live data for ${currentTenant.name}: You have ${products.length} products cataloged, ${customers.length} registered business accounts, and ${orders.length} active distribution orders. How else can I assist your distribution operations today?`;
      }

      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full flex flex-col h-[580px] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Be Shad AI Business Copilot</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  RBAC PROTECTED
                </span>
              </h3>
              <p className="text-xs text-indigo-200">Distribution, Inventory & Accounts Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'
                }`}
              >
                {m.role === 'ai' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs ${
                  m.role === 'ai'
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>Analyzing live database records...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full shrink-0 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
            placeholder={`Ask about inventory, receivables or sales (Logged in as ${currentUser.role})...`}
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer attribution */}
        <div className="py-1 px-4 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium">
          Presented by Hayeshad Media
        </div>
      </div>
    </div>
  );
};
