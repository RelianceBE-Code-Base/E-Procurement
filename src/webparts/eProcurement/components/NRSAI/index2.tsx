import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import AI_CONFIG from "../../../../config/aiConfig";

// ═══════════════════════════════════════════════════════════════════════
// FIRSAIChatPane.tsx  —  SPFx TypeScript
//
// A floating chatbot drawer that mounts on EVERY page of the NRS
// procurement system. No separate key-entry screen — key comes from
// aiConfig.ts. The bot greets the user, asks what they want to do,
// and handles all 11 procurement AI tools conversationally.
// Users can switch tool/topic at any time mid-conversation.
// ═══════════════════════════════════════════════════════════════════════

// ─── Types ────────────────────────────────────────────────────────────

//interface GeminiPart   { text: string; }
//interface GeminiContent { role: "user" | "model"; parts: GeminiPart[]; }

// interface GeminiRequest {
//   systemInstruction: { parts: GeminiPart[] };
//   contents: GeminiContent[];
//   generationConfig: { maxOutputTokens: number; temperature: number };
// }

// interface GeminiResponse {
//   candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
//   error?: { message: string };
// }

interface ORMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ORRequest {
  model: string;
  messages: ORMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface ORResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  error?: {
    message: string;
  };
}


interface ChatMessage {
  role: "user" | "model";
  text: string;
  /** optional quick-reply chips attached to a bot message */
  chips?: string[];
  /** tool mode active when this message was produced */
  tool?: ToolId;
}

type ToolId =
  | "general"   | "annual"  | "requisition" | "approval"
  | "validator" | "method"  | "sbd"         | "evaluation"
  | "award"     | "risk"    | "payment";

interface Tool {
  id: ToolId;
  icon: string;
  label: string;
  stage: string;
  systemPrompt: string;
  greeting: string;
  chips: string[];
}

// ─── OpenRouter API ───────────────────────────────────────────────────────

async function callOpenRouter(
  systemPrompt: string,
  history: ORMessage[]
): Promise<string> {

  const messages: ORMessage[] = [
    { role: "system", content: systemPrompt },
    ...history
  ];

  const body: ORRequest = {
    model: "meta-llama/llama-3.1-8b-instruct",
    messages,
    temperature: 0.4,
    max_tokens: 800
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,

      // Required for OpenRouter ranking + avoids some CORS filters
      "HTTP-Referer": window.location.origin,
      "X-Title": "NRS Procurement AI POC"
    },
    body: JSON.stringify(body)
  });

  const data: ORResponse = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || `OpenRouter error ${res.status}`);
  }

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Empty response from model.");
  }

  return text;
}

const BASE_CONTEXT = `
      You are NRS Procurement AI, an intelligent assistant embedded in the NRS 
      (Nigeria Revenue Service) e-Procurement System. 
      You know the full 10-stage NRS procurement workflow:
        Stage 0 – Annual Procurement Preparation
        Stage 1 – Requisition Initiation
        Stage 2 – EC Approval & Internal Routing
        Stage 3 – Procurement Plan Validation
        Stage 4 – Tendering Process Initiation
        Stage 5 – Tender Planning & Execution (SBDs)
        Stage 6 – Evaluation Recommendation & Approval Routing
        Stage 7 – Contract Award
        Stage 8 – Project Monitoring
        Stage 9 – Project Completion & Payment Processing

      You also know Nigerian Public Procurement Act (PPA) 2007, BPP guidelines, and 
      approval thresholds (Executive Chairman, Tenders Board, BPP, FEC).

      IMPORTANT BEHAVIOUR RULES:
      - You are conversational. Gather information through friendly dialogue.
      - Ask clarifying questions ONE at a time when you need more detail.
      - When you have enough information, produce a complete, formal output 
        (memo, letter, evaluation report, risk register, etc.).
      - Always offer to refine or switch to a different task after completing one.
      - Keep responses concise unless producing a formal document.
      - Use ₦ for Nigerian Naira amounts.
      - If the user says something like "switch to...", "I want to...", "help me with...", 
        "go back to...", honour it immediately.
      `.trim();

const TOOLS: Tool[] = [
  {
    id: "general",
    icon: "💬",
    label: "General Help",
    stage: "All Stages",
    systemPrompt: BASE_CONTEXT + `
\nYou are in GENERAL mode. Help the user with any procurement question, 
explain stages, clarify PPA 2007 rules, or guide them to the right tool.
After answering, suggest relevant tools they might find useful.`,
    greeting: "Hello! 👋 I'm your **NRS Procurement AI Assistant**.\n\nI can help you with any part of the procurement process — from annual planning to payment processing.\n\nWhat would you like to do today?",
    chips: ["Annual Planning", "Write a Requisition Memo", "Approval Routing", "Draft an SBD", "Evaluate Bids", "Risk Assessment"],
  },
  {
    id: "annual",
    icon: "📅",
    label: "Annual Planner",
    stage: "Stage 0",
    systemPrompt: BASE_CONTEXT + `
\nYou are in ANNUAL PLAN mode (Stage 0). 
Help the user prepare an executive Annual Procurement Plan summary.
Gather: (1) total approved budget, (2) departmental needs list.
Then produce: budget vs requests analysis, priority rankings, deferral recommendations, 
quarterly timeline, and key risks. Format as an executive summary.`,
    greeting: "📅 **Annual Procurement Planner** (Stage 0)\n\nI'll help you compile departmental needs into an executive procurement plan summary.\n\nLet's start — what is the **total approved annual budget** (₦)?",
    chips: ["Use sample data", "What format is the output?", "Switch tool"],
  },
  {
    id: "requisition",
    icon: "📝",
    label: "Requisition Memo",
    stage: "Stage 1",
    systemPrompt: BASE_CONTEXT + `
\nYou are in REQUISITION MEMO mode (Stage 1).
Draft formal procurement requisition memos addressed to the Executive Chairman.
Gather conversationally: item/service title, requesting department, category (Goods/Works/Services), 
estimated amount, and brief justification.
Then produce a complete formal memo in Nigerian government format including: 
letterhead reference, RE: subject, background, request, justification, PPA 2007 compliance note, 
and formal closing.`,
    greeting: "📝 **Requisition Memo Writer** (Stage 1)\n\nI'll draft a formal procurement requisition memo for you.\n\nFirst — what **item or service** do you want to procure?",
    chips: ["Office furniture", "IT equipment", "Construction works", "Consulting services", "Switch tool"],
  },
  {
    id: "approval",
    icon: "🔀",
    label: "Approval Router",
    stage: "Stage 2",
    systemPrompt: BASE_CONTEXT + `
\nYou are in APPROVAL ROUTING mode (Stage 2–6).
Determine the correct approval authority and routing path for a procurement.
Gather: amount (₦), procurement category, brief description.
Then provide: authority (EC / Tenders Board / BPP / FEC) with threshold justification, 
step-by-step routing path, required documents per stage, timeline, and compliance flags.`,
    greeting: "🔀 **Approval Route Advisor** (Stages 2–6)\n\nI'll determine the correct approval chain based on PPA 2007 thresholds.\n\nWhat is the **procurement amount** (₦)?",
    chips: ["Under ₦5M", "₦5M–₦50M", "₦50M–₦100M", "Over ₦100M", "Switch tool"],
  },
  {
    id: "validator",
    icon: "✅",
    label: "Plan Validator",
    stage: "Stage 3",
    systemPrompt: BASE_CONTEXT + `
\nYou are in PLAN VALIDATION mode (Stage 3).
Help the Director of Procurement validate requisitions against the approved annual plan.
Gather: item/service, department, amount, whether it is in the approved plan.
Then provide: validation status (Approved/Conditional/Rejected), justification, 
steps to add if not in plan, budget assessment, and recommended action.`,
    greeting: "✅ **Procurement Plan Validator** (Stage 3)\n\nI'll check if a requisition aligns with the approved annual procurement plan.\n\nWhat **item or service** needs to be validated?",
    chips: ["It's in the plan", "It's NOT in the plan", "Not sure", "Switch tool"],
  },
  {
    id: "method",
    icon: "🎯",
    label: "Method Advisor",
    stage: "Stage 4",
    systemPrompt: BASE_CONTEXT + `
\nYou are in PROCUREMENT METHOD mode (Stage 4).
Recommend the optimal procurement method per PPA 2007.
Gather: what is being procured, estimated value, category, urgency level.
Evaluate: Open Competitive Bidding, Restricted Tendering, Direct Procurement, Shopping, RFQ.
Provide: recommended method with PPA 2007 section, justification, execution steps, timeline, risks.`,
    greeting: "🎯 **Procurement Method Advisor** (Stage 4)\n\nI'll recommend the best procurement method per PPA 2007.\n\nWhat are you looking to procure?",
    chips: ["Goods (low value)", "Works (construction)", "Consulting services", "Emergency procurement", "Switch tool"],
  },
  {
    id: "sbd",
    icon: "📄",
    label: "SBD Drafter",
    stage: "Stage 5",
    systemPrompt: BASE_CONTEXT + `
\nYou are in SBD DRAFTING mode (Stage 5).
Draft Standard Bidding Document sections for NRS tenders.
Gather: tender title, category (Goods/Works/Services), estimated value, key specifications.
Then produce full SBD sections: Invitation to Tender, Scope, Eligibility Criteria, 
Evaluation Criteria (with weightings), Submission Requirements, Timeline, Special Conditions.
Use formal Nigerian public procurement language.`,
    greeting: "📄 **SBD Drafter** (Stage 5)\n\nI'll draft Standard Bidding Document sections for your tender.\n\nWhat is the **tender title**?",
    chips: ["Supply of goods", "Construction works", "Professional services", "IT procurement", "Switch tool"],
  },
  {
    id: "evaluation",
    icon: "⚖️",
    label: "Bid Evaluator",
    stage: "Stage 6",
    systemPrompt: BASE_CONTEXT + `
\nYou are in BID EVALUATION mode (Stage 6).
Conduct formal tender evaluations per PPA 2007.
Gather: evaluation criteria with weightings, and details of each submitted bid.
Then produce a formal Tender Evaluation Report: scoring table, total scores, ranking, 
compliance checks, recommended winner, value for money assessment, and next steps.
Format as an official evaluation report per BPP guidelines.`,
    greeting: "⚖️ **Bid Evaluation Assistant** (Stage 6)\n\nI'll help you evaluate and rank vendor bids.\n\nFirst, what are the **evaluation criteria and weightings**?\n(e.g. Price 40%, Technical 35%, Experience 25%)",
    chips: ["Use standard criteria", "Price-based only", "Technical-focused", "Switch tool"],
  },
  {
    id: "award",
    icon: "🏆",
    label: "Award Letter",
    stage: "Stage 7",
    systemPrompt: BASE_CONTEXT + `
\nYou are in CONTRACT AWARD mode (Stage 7).
Draft formal contract award letters from NRS to successful contractors.
Gather: contractor name, project/contract description, contract value, delivery period, reference number.
Produce a complete formal award letter: letterhead, RE: AWARD OF CONTRACT, congratulatory opening, 
contract scope & value, 10% performance bond requirement, contract signing instruction, 
commencement date, signatory block (Director of Procurement).`,
    greeting: "🏆 **Contract Award Letter** (Stage 7)\n\nI'll draft a formal award letter to the successful contractor.\n\nWhat is the **contractor's name**?",
    chips: ["Include mobilisation fee", "Add penalty clause", "International contractor", "Switch tool"],
  },
  {
    id: "risk",
    icon: "🔍",
    label: "Risk Register",
    stage: "Stage 8",
    systemPrompt: BASE_CONTEXT + `
\nYou are in PROJECT RISK mode (Stage 8).
Create comprehensive risk registers for NRS procurement projects.
Gather: project name/description, vendor, category, contract value, duration.
Produce: top 8 risks (Risk ID, Description, Likelihood H/M/L, Impact H/M/L, Rating, Mitigation, Owner), 
5 monitoring KPIs, red flags for escalation, and overall risk rating.`,
    greeting: "🔍 **Project Risk Register** (Stage 8)\n\nI'll create a risk register for your procurement project.\n\nWhat is the **project name or description**?",
    chips: ["IT project", "Construction", "Supply contract", "Consultancy", "Switch tool"],
  },
  {
    id: "payment",
    icon: "💳",
    label: "Payment Check",
    stage: "Stage 9",
    systemPrompt: BASE_CONTEXT + `
\nYou are in PAYMENT VERIFICATION mode (Stage 9).
Verify payment readiness for completed procurement contracts.
Gather: contractor name, project, invoice amount, whether Job Completion Certificate is issued, 
whether invoice matches contract, tax clearance status, any issues.
Produce: Payment Readiness Status (READY/CONDITIONAL/HOLD/REJECT), document checklist, 
NRS compliance checks (TCC, WHT, VAT), risk flags, recommended actions, resolution timeline.`,
    greeting: "💳 **Payment Readiness Check** (Stage 9)\n\nI'll verify if a payment request is ready for processing.\n\nWhat is the **contractor's name**?",
    chips: ["Certificate issued", "Invoice mismatch", "Tax clearance pending", "Switch tool"],
  },
];

const TOOL_MAP = new Map<ToolId, Tool>(TOOLS.map(t => [t.id, t]));

// ─── Detect if a message is requesting a tool switch ──────────────────

const TOOL_TRIGGERS: Record<string, ToolId> = {
  "annual plan":    "annual",   "annual planner":   "annual",
  "requisition":    "requisition", "memo":           "requisition",
  "approval":       "approval",   "routing":         "approval",
  "validate":       "validator",  "plan validator":  "validator",
  "method":         "method",     "procurement method": "method",
  "sbd":            "sbd",        "bidding document": "sbd",
  "evaluate":       "evaluation", "bid eval":        "evaluation",
  "evaluation":     "evaluation",
  "award":          "award",      "award letter":    "award",
  "risk":           "risk",       "risk register":   "risk",
  "payment":        "payment",    "pay check":       "payment",
  "general":        "general",    "help":            "general",
  "switch":         "general",    "go back":         "general",
};

function detectToolSwitch(text: string): ToolId | null {
  const lower = text.toLowerCase();
  for (const [trigger, toolId] of Object.entries(TOOL_TRIGGERS)) {
    if (lower.includes(trigger)) return toolId;
  }
  return null;
}

// ─── Styles (all inline — no Tailwind/CSS modules needed in SPFx) ──────

const S = {
  // Floating toggle button
  fab: (open: boolean): React.CSSProperties => ({
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: open ? "#1e40af" : "linear-gradient(135deg,#2563eb,#4f46e5)",
    border: "none",
    boxShadow: "0 4px 16px rgba(37,99,235,.45)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    transition: "all 0.2s ease",
  }),

  // Chat pane
  pane: (open: boolean): React.CSSProperties => ({
    position: "fixed",
    bottom: 86,
    right: 24,
    width: 380,
    height: 580,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 40px rgba(0,0,0,.18)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    zIndex: 9998,
    overflow: "hidden",
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
    pointerEvents: open ? "all" : "none",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  }),

  header: {
    background: "linear-gradient(135deg,#1d4ed8,#4338ca)",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  } as React.CSSProperties,

  toolBar: {
    display: "flex",
    gap: 4,
    padding: "8px 10px",
    overflowX: "auto" as const,
    borderBottom: "1px solid #f1f5f9",
    flexShrink: 0,
    scrollbarWidth: "none" as const,
  } as React.CSSProperties,

  toolChip: (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    borderRadius: 999,
    border: active ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
    background: active ? "#eff6ff" : "#fff",
    color: active ? "#1d4ed8" : "#64748b",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
    transition: "all 0.15s",
  }),

  messages: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  } as React.CSSProperties,

  bubble: (role: "user" | "model"): React.CSSProperties => ({
    maxWidth: "82%",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    padding: "9px 13px",
    borderRadius: role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    background: role === "user" ? "#2563eb" : "#f8fafc",
    color: role === "user" ? "#fff" : "#1e293b",
    fontSize: 13,
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word" as const,
    border: role === "model" ? "1px solid #e2e8f0" : "none",
    boxShadow: role === "model" ? "0 1px 3px rgba(0,0,0,.05)" : "none",
  }),

  chips: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  } as React.CSSProperties,

  chip: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1d4ed8",
    cursor: "pointer",
    fontWeight: 500,
  } as React.CSSProperties,

  inputRow: {
    display: "flex",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid #f1f5f9",
    flexShrink: 0,
    background: "#fff",
  } as React.CSSProperties,

  input: {
    flex: 1,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    outline: "none",
    resize: "none" as const,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    lineHeight: 1.4,
    maxHeight: 80,
    overflowY: "auto" as const,
  } as React.CSSProperties,

  sendBtn: (disabled: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    background: disabled ? "#e2e8f0" : "#2563eb",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "flex-end",
    transition: "background 0.15s",
  }),

  typingDot: (delay: number): React.CSSProperties => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#94a3b8",
    animation: "firsTyping 1.2s infinite",
    animationDelay: `${delay}ms`,
  }),
};

// ─── Typing Indicator ─────────────────────────────────────────────────

const TypingIndicator: React.FC = () => (
  <div style={{ ...S.bubble("model"), display: "flex", gap: 4, alignItems: "center", padding: "10px 14px" }}>
    <style>{`@keyframes firsTyping{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    {[0, 160, 320].map(d => <span key={d} style={S.typingDot(d)} />)}
  </div>
);

// ─── Tool Switcher Bar ────────────────────────────────────────────────

interface ToolBarProps {
  activeTool: ToolId;
  onSwitch: (id: ToolId) => void;
}

const ToolSwitcherBar: React.FC<ToolBarProps> = ({ activeTool, onSwitch }) => (
  <div style={S.toolBar}>
    {TOOLS.map(t => (
      <button key={t.id} style={S.toolChip(activeTool === t.id)} onClick={() => onSwitch(t.id)} title={t.label}>
        <span>{t.icon}</span>
        <span style={{ display: activeTool === t.id ? "inline" : "none" }}>{t.label}</span>
      </button>
    ))}
  </div>
);

// ─── Message Renderer ─────────────────────────────────────────────────
// Supports **bold** markdown syntax since Gemini uses it

function renderText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

interface MessageBubbleProps {
  msg: ChatMessage;
  onChipClick: (chip: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, onChipClick }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <div style={S.bubble(msg.role)}>{renderText(msg.text)}</div>
    {msg.role === "model" && msg.chips && msg.chips.length > 0 && (
      <div style={S.chips}>
        {msg.chips.map(c => (
          <button key={c} style={S.chip} onClick={() => onChipClick(c)}>{c}</button>
        ))}
      </div>
    )}
  </div>
);

// ─── Main Chatbot Pane Component ──────────────────────────────────────

const FIRSAIChatPane: React.FC = () => {
  const [open, setOpen]           = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<ToolId>("general");
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [input, setInput]         = useState<string>("");
  const [loading, setLoading]     = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initialize with greeting when pane first opens
  useEffect(() => {
    if (open && !initialized) {
      const tool = TOOL_MAP.get("general")!;
      setMessages([{
        role: "model",
        text: tool.greeting,
        chips: tool.chips,
        tool: "general",
      }]);
      setInitialized(true);
    }
  }, [open, initialized]);

  // Build OpenRouter chat history
  const buildHistory = useCallback((msgs: ChatMessage[]): ORMessage[] => {
    return msgs.slice(-14).map(m => ({
      role: (m.role === "model" ? "assistant" : "user") as "user" | "assistant",
      content: m.text
    }));
  }, []);

  // Switch to a different tool
  const switchTool = useCallback((toolId: ToolId): void => {
    if (toolId === activeTool) return;
    const tool = TOOL_MAP.get(toolId)!;
    setActiveTool(toolId);

    const switchMsg: ChatMessage = {
      role: "model",
      text: `Switching to **${tool.label}** (${tool.stage}) ✨\n\n${tool.greeting}`,
      chips: tool.chips,
      tool: toolId,
    };
    setMessages(prev => [...prev, switchMsg]);
  }, [activeTool]);

  // Send a message
  const sendMessage = useCallback(async (text: string): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Detect tool switch in user message
    const switchTarget = detectToolSwitch(trimmed);

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let targetToolId = switchTarget ?? activeTool;

      // If switching, update tool state and prepend context
      if (switchTarget && switchTarget !== activeTool) {
        setActiveTool(switchTarget);
        targetToolId = switchTarget;
      }

      const tool = TOOL_MAP.get(targetToolId)!;
      const history = buildHistory([...messages, userMsg]);
      const reply   = await callOpenRouter(tool.systemPrompt, history);

      // Determine chips to attach: use tool defaults or a generic "switch" offer
      const responseChips: string[] =
        reply.length < 400 ? tool.chips.slice(0, 4) : ["Refine this", "Copy output", "Switch tool", "End this conversation"];

      setMessages(prev => [...prev, {
        role: "model",
        text: reply,
        chips: responseChips,
        tool: targetToolId,
      }]);

    } catch (e) {
      setMessages(prev => [...prev, {
        role: "model",
        text: "⚠️ " + (e instanceof Error ? e.message : "Something went wrong. Please try again."),
        chips: ["Try again", "Switch tool"],
      }]);
    }

    setLoading(false);
  }, [loading, activeTool, messages, buildHistory]);

  // Handle chip click
  const handleChip = useCallback((chip: string): void => {
    const lower = chip.toLowerCase();

    if (lower === "switch tool" || lower === "go back" || lower === "general help") {
      switchTool("general");
      return;
    }
    if (lower === "copy output") {
      const lastModel = [...messages].reverse().find(m => m.role === "model");
      if (lastModel) void navigator.clipboard.writeText(lastModel.text);
      return;
    }

    const toolSwitch = detectToolSwitch(chip);
    if (toolSwitch && toolSwitch !== activeTool) {
      switchTool(toolSwitch);
      return;
    }

    void sendMessage(chip);
  }, [messages, activeTool, sendMessage, switchTool]);

  // Handle Enter key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const tool = TOOL_MAP.get(activeTool)!;

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        .firs-ai-pane *::-webkit-scrollbar { width: 4px; height: 4px; }
        .firs-ai-pane *::-webkit-scrollbar-track { background: transparent; }
        .firs-ai-pane *::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .firs-ai-tool-bar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Floating Action Button */}
      <button
        style={S.fab(open)}
        onClick={() => setOpen(o => !o)}
        title="NRS Procurement AI"
        aria-label="Toggle AI Assistant"
      >
        {open ? (
          // X icon
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          // Sparkle/AI icon
          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.2H22l-6.2 4.6 2.4 7.2L12 17l-6.2 4 2.4-7.2L2 9.2h7.6z"/>
          </svg>
        )}
        {/* Unread pulse dot when closed */}
        {!open && (
          <span style={{ position:"absolute", top:2, right:2, width:10, height:10, borderRadius:"50%", background:"#f59e0b", border:"2px solid #fff" }} />
        )}
      </button>

      {/* Chat Pane */}
      <div style={S.pane(open)} className="firs-ai-pane" role="dialog" aria-label="NRS AI Assistant">

        {/* Header */}
        <div style={S.header}>
          <div style={{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:16 }}>{tool.icon}</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#fff", lineHeight:1 }}>NRS Procurement AI</p>
            <p style={{ margin:"3px 0 0", fontSize:11, color:"#bfdbfe", lineHeight:1 }}>{tool.label} · {tool.stage}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#34d399" }} />
            <span style={{ fontSize:11, color:"#bfdbfe" }}>Online</span>
          </div>
        </div>

        {/* Tool Switcher Bar */}
        <ToolSwitcherBar activeTool={activeTool} onSwitch={switchTool} />

        {/* Messages */}
        <div style={S.messages}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} onChipClick={handleChip} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Row */}
        <div style={S.inputRow}>
          <textarea
            ref={inputRef}
            style={S.input}
            rows={1}
            placeholder="Type a message or ask anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            style={S.sendBtn(loading || !input.trim())}
            onClick={() => void sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <svg width="16" height="16" fill="none" stroke={loading || !input.trim() ? "#94a3b8" : "#fff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

      </div>
    </>
  );
};

export default FIRSAIChatPane;