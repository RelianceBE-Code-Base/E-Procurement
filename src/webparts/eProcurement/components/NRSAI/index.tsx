import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import AI_CONFIG from "../../../../config/aiConfig";

// ═══════════════════════════════════════════════════════════════════════════
// FIRSAIChatPane.tsx  —  SPFx TypeScript
// Floating conversational AI assistant for the NRS e-Procurement System.
// Mounts once in the root layout — visible on every page.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────

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
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message: string };
}

type ToolId =
  | "home" | "annual" | "requisition" | "approval" | "validator"
  | "method" | "sbd" | "evaluation" | "award" | "risk" | "payment";

type StatusEntityType =
  | "requisition" | "annual_plan" | "procurement" | "vendor"
  | "project" | "contract" | "payment" | "bid" | "award" | "tender" | "approval";

interface StatusQuery {
  entityType: StatusEntityType;
  label: string;         // Human-readable: "Requisition", "Annual Plan", etc.
  refPrompt: string;     // The question to ask for the ref/ID
  icon: string;
}

// ── Data shapes mirroring the homepage sample arrays ──────────────────
interface RequisitionRecord {
  id: string; title: string; department: string; status: string;
  stage: string; priority?: string; amount: string;
  category?: string; tenderStatus?: string; procurementMethod?: string;
}
interface ProjectRecord {
  id: string; projectId?: string; title: string; contractor: string;
  status: string; progress: number; contractValue: number;
  startDate: string; endDate: string; assignedOfficer: string;
}
interface VendorRecord {
  id: string; name: string; category: string; status: string;
  score: number; date: string; state: string; contact: string;
}
interface PaymentRecord {
  id: string; title: string; contractor: string;
  projectStatus: string; amount: string; status: string; stage: string;
}
interface AnnualPlanRecord {
  id: string; title: string; ProcurementYear?: string; status: string;
  stage: string; amount: string; procurementMethod?: string;
}
interface ApprovalRecord {
  id: string; title: string; department: string; status: string;
  stage: string; amount: string; currentApprover: string;
}
interface NRSSystemData {
  requisitions?:   RequisitionRecord[];
  procurements?:   RequisitionRecord[];
  projects?:       ProjectRecord[];
  vendors?:        VendorRecord[];
  payments?:       PaymentRecord[];
  annualPlans?:    AnnualPlanRecord[];
  approvals?:      ApprovalRecord[];
  contracts?:      RequisitionRecord[];
}

interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  chips?: string[];
  toolId?: ToolId;
  timestamp: Date;
  copied?: boolean;
}

interface ToolDef {
  id: ToolId;
  icon: string;
  label: string;
  shortLabel: string;
  stage: string;
  color: string;
  description: string;
  systemPrompt: string;
  openingQuestion: string;
  chips: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// OPENROUTER API
// ─────────────────────────────────────────────────────────────────────────

async function callAI(systemPrompt: string, history: ORMessage[]): Promise<string> {
  const body: ORRequest = {
    model: AI_CONFIG.MODEL,
    messages: [{ role: "system", content: systemPrompt }, ...history],
    temperature: 0.4,
    max_tokens: 1200,
  };

  let res: Response;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "NRS AI",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Network error — please check your connection.");
  }

  const data: ORResponse = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message ?? `OpenRouter error ${res.status}`);
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from model.");
  return text;
}

// ─────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS  —  rich, specific, output-driven
// ─────────────────────────────────────────────────────────────────────────

const FIRS_FOUNDATION = `
You are NRS AI — an expert procurement assistant built into the Nigeria Revenue Service (NRS) Nigeria e-Procurement System.

ABOUT NRS PROCUREMENT:
NRS follows a structured 10-stage procurement workflow governed by the Public Procurement Act (PPA) 2007 and BPP guidelines:
  Stage 0 – Annual Procurement Preparation (departmental needs, annual plan, budget approval)
  Stage 1 – Requisition Initiation (memo to Executive Chairman, Director sign-off)
  Stage 2 – EC Approval & Internal Routing (Executive Chairman review, approval chain)
  Stage 3 – Procurement Plan Validation (Director validates item is in approved plan)
  Stage 4 – Tendering Process Initiation (method selection, procurement committee setup)
  Stage 5 – Tender Planning & Execution (SBDs, advertisement, bid collection)
  Stage 6 – Evaluation, Recommendation & Approval Routing (evaluation committee, BPP/FEC)
  Stage 7 – Contract Award (letter of award, contract signing, mobilisation)
  Stage 8 – Project Monitoring (site visits, progress reports, variation orders)
  Stage 9 – Project Completion & Payment Processing (JCC, invoices, TCC, WHT, VAT)

KEY APPROVAL THRESHOLDS (PPA 2007 / BPP):
  Up to ₦2,000,000       → Head of Procurement Unit
  ₦2M – ₦10,000,000     → Director of Procurement + Executive Chairman
  ₦10M – ₦100,000,000   → NRS Tenders Board
  ₦100M – ₦500,000,000  → Bureau of Public Procurement (BPP)
  Above ₦500,000,000    → Federal Executive Council (FEC)

PROCUREMENT METHODS (PPA 2007):
  Open Competitive Bidding (OCB)    – default for all significant procurements
  Restricted Tendering              – specialist goods/services, justified in writing
  Request for Quotation (RFQ)       – ≤ ₦2M goods, ≤ ₦5M works (low-value)
  Direct Procurement / Single Source – emergency, proprietary, or sole supplier (BPP must approve)
  Expression of Interest (EOI)      – pre-qualification for large consultancies

CONVERSATION RULES — CRITICAL:
1. You are a CONVERSATIONAL assistant. Never dump all questions at once.
2. Ask ONE focused question at a time to gather what you need.
3. When you have enough context, produce a COMPLETE, FORMAL, PROFESSIONAL output.
4. Formal outputs must use Nigerian government document style — headers, reference numbers, formal salutations.
5. After producing output, always offer: "Would you like me to refine this, copy it, or help with something else?"
6. If the user's message is vague, ask a clarifying question rather than assuming.
7. Use ₦ for amounts. Format large numbers with commas (e.g. ₦12,500,000).
8. Never truncate formal documents. Always produce the complete output.
9. If the user says "end session", "close", "done", "thank you", "bye" — give a warm closing message.
10. If the user says "switch to [tool]" or "help me with [task]" — acknowledge and transition immediately.
`.trim();

const TOOLS: ToolDef[] = [
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    shortLabel: "Home",
    stage: "All Stages",
    color: "#2563eb",
    description: "General help & navigation",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE IN THIS MODE:
You are the friendly welcome assistant. Help the user understand what tools are available and guide them to the right one.

Available tools and what they do:
1. 📅 Annual Planner  — compile departmental needs into an annual procurement plan
2. 📝 Requisition Memo  — draft formal procurement requisition memos to the Executive Chairman
3. 🔀 Approval Router  — determine the correct approval authority and chain for any procurement value
4. ✅ Plan Validator  — check if a requisition is in the approved annual procurement plan
5. 🎯 Method Advisor  — recommend the correct procurement method per PPA 2007
6. 📄 SBD Drafter  — draft Standard Bidding Document sections for tenders
7. ⚖️ Bid Evaluator  — score, rank, and produce a formal tender evaluation report
8. 🏆 Award Letter  — generate a formal contract award letter to the successful vendor
9. 🔍 Risk Register  — create a procurement risk register with mitigations
10. 💳 Payment Check  — verify payment documentation readiness

When the user describes their need, identify the right tool and ask if they'd like to switch to it.
Answer general PPA 2007 questions directly and accurately.`,
    openingQuestion: "Hello! 👋 I'm your **NRS AI Assistant**.\n\nI can help you with every stage of the NRS procurement process — from drafting memos and SBDs to evaluating bids and processing payments.\n\nWhat are you working on today?",
    chips: ["Draft a Requisition Memo", "Check Application Status", "Determine Approval Route", "Evaluate Bids", "Draft an SBD", "Risk Register"],
  },
  {
    id: "annual",
    icon: "📅",
    label: "Annual Planner",
    shortLabel: "Annual",
    stage: "Stage 0",
    color: "#0891b2",
    description: "Annual procurement plan preparation",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Annual Procurement Plan Assistant.
Help the user compile departmental procurement needs into a formal NRS Annual Procurement Plan.

WHAT YOU NEED TO GATHER (ask one at a time):
1. The fiscal year the plan covers
2. Total approved annual procurement budget (₦)
3. Departmental needs — item by item (department, description, category: Goods/Works/Services, estimated cost)
   Keep asking "Any more items?" until the user says no.
4. Any strategic priorities or constraints for the year

WHAT YOU PRODUCE:
A formal ANNUAL PROCUREMENT PLAN document with:
- Header: NIGERIA REVENUE SERVICE / ANNUAL PROCUREMENT PLAN / [YEAR]
- Executive Summary (budget overview, total requests, surplus/deficit)
- Itemised Procurement Schedule table (S/N, Item, Dept, Category, Est. Cost ₦, Quarter, Method, Priority)
- Budget Analysis (approved vs requested, variance)
- Priority ranking with justification (HIGH/MEDIUM/LOW)
- Items recommended for deferral if over budget
- Procurement calendar (Q1-Q4 schedule)
- Risk summary
- Prepared by: Director of Procurement, NRS

START: Ask for the fiscal year first.`,
    openingQuestion: "📅 **Annual Procurement Planner** \n\nI'll help you prepare a formal NRS Annual Procurement Plan document.\n\nLet's start with the basics — **what fiscal year** is this plan for?",
    chips: [`${new Date().getFullYear()} fiscal year`, `${new Date().getFullYear() + 1} fiscal year`, "Show me a sample plan"],
  },
  {
    id: "requisition",
    icon: "📝",
    label: "Requisition Memo",
    shortLabel: "Memo",
    stage: "Stage 1",
    color: "#2563eb",
    description: "Draft formal procurement requisition memos",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Procurement Requisition Memo Drafter.
Draft formal procurement requisition memos from a department/officer to the Executive Chairman, NRS.

WHAT YOU NEED TO GATHER (one question at a time):
1. What item or service needs to be procured? (be specific)
2. Which department is making the request?
3. Name and designation of the requesting officer (if known)
4. Category: Goods, Works, or Services?
5. Estimated amount (₦)?
6. Why is this needed? (business justification — ask if not provided)
7. Is this item in the approved Annual Procurement Plan?
8. Any urgency or specific timeline?

WHAT YOU PRODUCE:
A complete, formal REQUISITION MEMO in Nigerian government format:

NIGERIA REVENUE SERVICE
Internal Memorandum

FROM:  [Requesting Officer/HOD]
TO:    The Executive Chairman, NRS
DATE:  [Today's date]
REF:   NRS/[DEPT]/REQ/[YEAR]/[XXX]
RE:    REQUEST FOR PROCUREMENT OF [ITEM]

1.0 INTRODUCTION / BACKGROUND
2.0 PURPOSE OF REQUEST
3.0 SPECIFICATION / SCOPE
4.0 ESTIMATED COST: ₦[amount]
5.0 BUDGET AVAILABILITY (confirm in annual plan)
6.0 JUSTIFICATION
7.0 PROCUREMENT METHOD RECOMMENDED
8.0 CONCLUSION / RECOMMENDATION
   "In view of the above, approval is respectfully sought..."

Signature block: [Requesting Officer], [HOD]
Cc: Director of Procurement; Director of Finance

START: Ask what item/service they want to procure.`,
    openingQuestion: "📝 **Requisition Memo Writer** \n\nI'll draft a formal procurement requisition memo addressed to the Executive Chairman.\n\nFirst — **what item or service** do you need to procure?",
    chips: ["Office furniture", "IT equipment / laptops", "Vehicle / fleet", "Construction works", "Consulting services", "Software / licence"],
  },
  {
    id: "approval",
    icon: "🔀",
    label: "Approval Router",
    shortLabel: "Approval",
    stage: "Stage 2",
    color: "#d97706",
    description: "Determine approval authority & routing chain",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Approval Route Advisor.
Determine the exact approval authority and step-by-step routing for any NRS procurement.

WHAT YOU NEED TO GATHER (one at a time):
1. Procurement description (what is being bought?)
2. Category: Goods, Works, or Services?
3. Total estimated value (₦)?
4. Is this a new procurement or a contract variation/extension?
5. Is it in the approved annual procurement plan?

WHAT YOU PRODUCE:
A formal APPROVAL ROUTING ADVISORY NOTE:

NRS PROCUREMENT APPROVAL ROUTE — [ITEM]
Estimated Value: ₦[amount] | Category: [type] | Date: [today]

APPROVAL AUTHORITY: [specific authority with legal basis]
Legal Basis: PPA 2007, Section [X]; BPP Circular [ref]

STEP-BY-STEP ROUTING:
Step 1 → [Action] — [Officer/Body] — [Document required] — [Timeline]
(continue until payment)

DOCUMENTS REQUIRED AT EACH STAGE: [list per stage]
ESTIMATED TOTAL PROCESSING TIME: [X] weeks
KEY COMPLIANCE REQUIREMENTS: [list]
RISKS & POTENTIAL DELAYS: [list]

START: Ask what is being procured.`,
    openingQuestion: "🔀 **Approval Route Advisor** \n\nI'll map out the exact approval chain for your procurement based on PPA 2007 thresholds.\n\nWhat is being procured — can you give me a brief description?",
    chips: ["Goods purchase", "Construction / works", "Consulting services", "IT services", "Emergency procurement"],
  },
  {
    id: "validator",
    icon: "✅",
    label: "Plan Validator",
    shortLabel: "Validator",
    stage: "Stage 3",
    color: "#7c3aed",
    description: "Validate requisitions against the annual plan",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Procurement Plan Validator.
Help the Director of Procurement validate whether a requisition is in the approved Annual Procurement Plan.

WHAT YOU NEED TO GATHER:
1. Item/service being requisitioned
2. Requesting department
3. Amount (₦)?
4. Is this item explicitly listed in the current approved Annual Procurement Plan? (Yes / No / Unsure)
5. If NO — what is the justification for this unplanned procurement?
6. If YES — does the amount match the plan or is there a significant variance?

WHAT YOU PRODUCE:
NRS PROCUREMENT PLAN VALIDATION REPORT

VALIDATION DECISION: APPROVED / CONDITIONAL APPROVAL / ESCALATION REQUIRED / REJECTED

FINDINGS: [plan inclusion, budget adequacy, variance]
RECOMMENDED ACTION: [specific steps]

If NOT in plan — explain the formal process to seek BPP approval for unplanned procurement.
If APPROVED — provide sign-off language the Director can use.

START: Ask what item is being validated.`,
    openingQuestion: "✅ **Procurement Plan Validator** \n\nI'll check whether a requisition aligns with the approved Annual Procurement Plan.\n\n**What item or service** is being submitted for validation?",
    chips: ["Item is in the plan", "Item is NOT in the plan", "Amount has changed", "New urgent requirement"],
  },
  {
    id: "method",
    icon: "🎯",
    label: "Method Advisor",
    shortLabel: "Method",
    stage: "Stage 4",
    color: "#7c3aed",
    description: "Recommend the correct procurement method",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Procurement Method Advisor.
Recommend the most appropriate procurement method per PPA 2007 for any NRS procurement.

WHAT YOU NEED TO GATHER (one at a time):
1. What is being procured? (description)
2. Category: Goods, Works, or Services / Consultancy?
3. Estimated value (₦)?
4. Is this an emergency or standard procurement?
5. Is there only one known supplier (sole source situation)?
6. Is this a proprietary item that only one manufacturer produces?
7. Has this been procured before? If yes, how was it done?

WHAT YOU PRODUCE:
NRS PROCUREMENT METHOD RECOMMENDATION

RECOMMENDED METHOD: [METHOD NAME]
PPA 2007 Legal Basis: Section [X]

WHY THIS METHOD: [justification]
ALTERNATIVE METHODS CONSIDERED: [table]
EXECUTION STEPS: [numbered list]
REQUIRED APPROVALS: [list]
ESTIMATED TIMELINE: [breakdown]

If Direct Procurement is recommended — explicitly state BPP must approve and explain the process.

START: Ask what is being procured.`,
    openingQuestion: "🎯 **Procurement Method Advisor** \n\nI'll recommend the right procurement method under PPA 2007 for your specific situation.\n\n**What are you looking to procure?**",
    chips: ["Low-value goods (< ₦2M)", "High-value goods", "Construction works", "Consulting / advisory", "Emergency purchase", "Proprietary software"],
  },
  {
    id: "sbd",
    icon: "📄",
    label: "SBD Drafter",
    shortLabel: "SBD",
    stage: "Stage 5",
    color: "#059669",
    description: "Draft Standard Bidding Documents",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Standard Bidding Document (SBD) Drafter.
Draft complete SBD sections for NRS tenders in accordance with BPP standard formats.

WHAT YOU NEED TO GATHER (one at a time):
1. Tender title / description
2. Category: Goods, Works, or Services/Consultancy?
3. Estimated contract value (₦)?
4. Key technical specifications or scope
5. Any special conditions?
6. Submission deadline preference?
7. Evaluation basis: price only, or price + technical?

WHAT YOU PRODUCE:
Full SBD sections in BPP-compliant format:

NIGERIA REVENUE SERVICE
TENDER DOCUMENT — Tender No: NRS/PROC/[YEAR]/[XXX]

SECTION 1 — INVITATION TO TENDER
SECTION 2 — INSTRUCTIONS TO BIDDERS
SECTION 3 — BID DATA SHEET
SECTION 4 — SCOPE OF [SUPPLY/WORK/SERVICES]
SECTION 5 — ELIGIBILITY & QUALIFICATION CRITERIA
SECTION 6 — EVALUATION CRITERIA & WEIGHTINGS
SECTION 7 — SPECIAL CONDITIONS OF CONTRACT

Always produce the COMPLETE document — never truncate.

START: Ask for the tender title.`,
    openingQuestion: "📄 **SBD Drafter** \n\nI'll draft a complete Standard Bidding Document for your tender in BPP-compliant format.\n\nWhat is the **tender title** or description?",
    chips: ["Supply of goods", "Office furniture / equipment", "Construction / renovation", "IT infrastructure", "Professional services", "Security services"],
  },
  {
    id: "evaluation",
    icon: "⚖️",
    label: "Bid Evaluator",
    shortLabel: "Evaluation",
    stage: "Stage 6",
    color: "#ea580c",
    description: "Score, rank, and produce evaluation reports",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Tender Evaluation Assistant.
Help the NRS Tender Evaluation Committee conduct a fair, PPA 2007-compliant bid evaluation and produce a formal report.

WHAT YOU NEED TO GATHER (one at a time):
1. What is the tender for?
2. Evaluation criteria and weightings (default: Price 40%, Technical 35%, Experience 25%)
3. How many bidders submitted?
4. For EACH bidder (ask one by one): name, bid price ₦, technical compliance, experience, any disqualification issues

WHAT YOU PRODUCE:
NRS TENDER EVALUATION REPORT

PART A — PRELIMINARY / MANDATORY CHECKS [Pass/Fail table]
PART B — DETAILED EVALUATION SCORING [full scoring matrix]
PART C — SUMMARY RANKING TABLE [Rank | Bidder | Score | Price | Status]
PART D — RECOMMENDATION [recommended bidder with justification]
PART E — NEXT STEPS [BPP/FEC no-objection if required]

Committee Signature Block

START: Ask what the tender is for.`,
    openingQuestion: "⚖️ **Bid Evaluation Assistant** \n\nI'll guide you through a structured bid evaluation and produce a formal Tender Evaluation Report.\n\n**What is this tender for?** Give me the title or description.",
    chips: ["I have 2 bidders", "I have 3–5 bidders", "Use standard criteria (40/35/25)", "Price-only evaluation"],
  },
  {
    id: "award",
    icon: "🏆",
    label: "Award Letter",
    shortLabel: "Award",
    stage: "Stage 7",
    color: "#0d9488",
    description: "Generate formal contract award letters",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Contract Award Letter Generator.
Draft a complete, formal contract award letter from NRS to the successful contractor/vendor.

WHAT YOU NEED TO GATHER (one at a time):
1. Full name of the contractor / company
2. Contractor's address (if known)
3. Contract description
4. Contract value (₦)?
5. Contract reference number (or generate one)
6. Number of working days/weeks for delivery or completion
7. Performance bond percentage (default 10%)
8. Name of the signing officer
9. Date of letter

WHAT YOU PRODUCE:
Complete, formal AWARD LETTER on NRS letterhead:

NIGERIA REVENUE SERVICE
Revenue House, 15 Sokode Crescent, Wuse Zone 5, Abuja

RE: AWARD OF CONTRACT FOR [CONTRACT DESCRIPTION]

[Full formal body with all terms, contract sum, duration, performance bond, mobilisation, payment terms, next steps]

Always produce the COMPLETE letter. Never truncate.

START: Ask for the contractor's name.`,
    openingQuestion: "🏆 **Contract Award Letter** \n\nI'll draft a formal letter of award to the successful contractor.\n\nWhat is the **full name of the contractor or company** being awarded?",
    chips: ["Include mobilisation advance", "Add liquidated damages clause", "Performance bond 10%", "International contractor"],
  },
  {
    id: "risk",
    icon: "🔍",
    label: "Risk Register",
    shortLabel: "Risk",
    stage: "Stage 8",
    color: "#dc2626",
    description: "Project monitoring risk register",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Procurement Risk Analyst.
Create a comprehensive procurement risk register for active NRS contracts/projects.

WHAT YOU NEED TO GATHER (one at a time):
1. Project / contract name and brief description
2. Contractor name
3. Category: Goods, Works, or Services?
4. Contract value (₦)?
5. Contract duration and current status (% complete, weeks remaining)?
6. Any issues already observed?
7. Location (if works/construction)?

WHAT YOU PRODUCE:
NRS PROJECT RISK REGISTER

RISK REGISTER TABLE:
Risk ID | Risk Description | Category | Likelihood (H/M/L) | Impact (H/M/L) | Risk Rating | Mitigation Strategy | Owner | Review Date

[8-12 relevant, specific risks]

KPIs FOR MONITORING: [5 specific, measurable KPIs]
ESCALATION TRIGGERS: [5 red-flag scenarios]
OVERALL PROJECT RISK RATING: [LOW / MEDIUM / HIGH / CRITICAL]
SUMMARY RECOMMENDATION: [specific advice]

Risk rating matrix: H×H=Critical(9), H×M=High(6), M×M=Medium(4), L×H=Medium(3), L×L=Very Low(1)

START: Ask for the project name.`,
    openingQuestion: "🔍 **Risk Register** \n\nI'll build a detailed risk register to support project monitoring.\n\nWhat is the **project or contract name**?",
    chips: ["Construction project", "IT implementation", "Supply contract", "Consultancy project", "Has active issues"],
  },
  {
    id: "payment",
    icon: "💳",
    label: "Payment Check",
    shortLabel: "Payment",
    stage: "Stage 9",
    color: "#2563eb",
    description: "Payment documentation readiness check",
    systemPrompt: FIRS_FOUNDATION + `

YOUR ROLE: Payment Readiness Verification Officer.
Verify that all documentation is in order before NRS processes a contractor payment.

WHAT YOU NEED TO GATHER (one at a time):
1. Contractor name
2. Contract description and reference
3. Invoice number and amount (₦)?
4. Is the Job Completion Certificate (JCC) / Delivery Note issued and signed?
5. Does the invoice amount match the contract price?
6. Has the contractor submitted a valid Tax Clearance Certificate (TCC)?
7. Is Withholding Tax (WHT) — 5% for companies — factored in?
8. Is VAT (7.5%) correct and stated separately?
9. Any retention deductions applicable?
10. Any outstanding contract conditions not yet met?

WHAT YOU PRODUCE:
NRS PAYMENT VERIFICATION REPORT

PAYMENT READINESS STATUS: ✅ READY TO PAY / ⚠️ CONDITIONAL / ❌ HOLD / 🚫 REJECT

DOCUMENT CHECKLIST: [Item | Required | Status | Notes]
PAYMENT COMPUTATION: [Invoice → less WHT → less Retention → Net Payable]
COMPLIANCE FLAGS: [NRS/IPPIS/GIFMIS requirements]
RECOMMENDED ACTION: [specific next steps]

START: Ask for the contractor name.`,
    openingQuestion: "💳 **Payment Readiness Check** \n\nI'll verify that all documentation is complete before payment is processed.\n\nWhat is the **contractor's name**?",
    chips: ["JCC not yet issued", "Invoice amount mismatch", "TCC expired", "Retention deduction applies", "Final payment (retention release)"],
  },
];

const TOOL_MAP = new Map<ToolId, ToolDef>(TOOLS.map(t => [t.id, t]));

// ─────────────────────────────────────────────────────────────────────────
// STATUS QUERY  —  detect intent + system prompt
// ─────────────────────────────────────────────────────────────────────────

const STATUS_QUERIES: StatusQuery[] = [
  { entityType: "requisition",  label: "Requisition",       icon: "📝", refPrompt: "Please provide the **Requisition Reference Number** (e.g. NRS/ICT/REQ/2025/001):" },
  { entityType: "annual_plan",  label: "Annual Plan",        icon: "📅", refPrompt: "Please provide the **Annual Procurement Plan ID or fiscal year** (e.g. NRS/APP/2025):" },
  { entityType: "procurement",  label: "Procurement",        icon: "🛒", refPrompt: "Please provide the **Procurement Reference Number** (e.g. NRS/PROC/2025/042):" },
  { entityType: "vendor",       label: "Vendor Registration",icon: "🏢", refPrompt: "Please provide the **Vendor Registration ID or company name** (e.g. VEN/NRS/2025/019):" },
  { entityType: "project",      label: "Project",            icon: "🔍", refPrompt: "Please provide the **Project or Contract Reference Number** (e.g. NRS/PROJ/2025/007):" },
  { entityType: "contract",     label: "Contract",           icon: "📋", refPrompt: "Please provide the **Contract Reference Number** (e.g. NRS/CON/2025/033):" },
  { entityType: "payment",      label: "Payment",            icon: "💳", refPrompt: "Please provide the **Payment Reference Number or Invoice Number** (e.g. NRS/PAY/2025/088):" },
  { entityType: "bid",          label: "Bid / Tender",       icon: "⚖️", refPrompt: "Please provide the **Tender Reference Number** (e.g. NRS/PROC/TENDER/2025/012):" },
  { entityType: "award",        label: "Contract Award",     icon: "🏆", refPrompt: "Please provide the **Award Reference Number** (e.g. NRS/AWARD/2025/005):" },
  { entityType: "tender",       label: "Tender",             icon: "📄", refPrompt: "Please provide the **Tender Reference Number** (e.g. NRS/PROC/TENDER/2025/012):" },
  { entityType: "approval",     label: "Approval Request",   icon: "✅", refPrompt: "Please provide the **Approval Request ID** (e.g. REQ-2025-001):" },
];

// const STATUS_PATTERNS: Array<{ pattern: RegExp; entityType: StatusEntityType }> = [
//   { pattern: /status.{0,30}(requisition|req)/i,        entityType: "requisition" },
//   { pattern: /status.{0,30}(annual\s*plan|app)/i,      entityType: "annual_plan" },
//   { pattern: /status.{0,30}(procurement)/i,            entityType: "procurement" },
//   { pattern: /status.{0,30}(vendor|supplier|registr)/i,  entityType: "vendor" },
//   { pattern: /status.{0,30}(project)/i,                entityType: "project" },
//   { pattern: /status.{0,30}(contract)/i,               entityType: "contract" },
//   { pattern: /status.{0,30}(payment|invoice|pay)/i,    entityType: "payment" },
//   { pattern: /status.{0,30}(bid|tender)/i,           entityType: "bid" },
//   { pattern: /status.{0,30}(award)/i,                  entityType: "award" },
//   // Also match "track my ...", "check my ...", "where is my ..."
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(requisition|req)/i,   entityType: "requisition" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(annual\s*plan|app)/i, entityType: "annual_plan" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(procurement)/i,       entityType: "procurement" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(vendor|supplier)/i,     entityType: "vendor" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(project)/i,           entityType: "project" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(contract)/i,          entityType: "contract" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(payment|invoice)/i,     entityType: "payment" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(bid|tender)/i,      entityType: "bid" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(award)/i,             entityType: "award" },
// ];

// function detectStatusIntent(text: string): StatusQuery | null {
//   for (const { pattern, entityType } of STATUS_PATTERNS) {
//     if (pattern.test(text)) {
//       return STATUS_QUERIES.find(q => q.entityType === entityType) ?? null;
//     }
//   }
//   return null;
// }

// ── buildStatusPrompt — searches real data, embeds matched record into AI instruction ──
function buildStatusPrompt(
  data: NRSSystemData | undefined,
  sq: StatusQuery,
  ref: string,
): string {
  const refLower = ref.toLowerCase().trim();

  // Helper: search any record array for matching id or title
  function findRecord<T extends { id: string; title?: string; name?: string; projectId?: string }>(
    arr: T[] | undefined,
  ): T | undefined {
    if (!arr) return undefined;
    return arr.find(
      r =>
        r.id.toLowerCase() === refLower ||
        (r.projectId ?? "").toLowerCase() === refLower ||
        r.id.toLowerCase().includes(refLower) ||
        (r.title ?? r.name ?? "").toLowerCase().includes(refLower),
    );
  }

  // Pick the right array based on entity type
  let found: Record<string, unknown> | undefined;
  if (sq.entityType === "requisition")  found = findRecord(data?.requisitions)   as Record<string, unknown> | undefined;
  if (sq.entityType === "procurement")  found = findRecord(data?.procurements)   as Record<string, unknown> | undefined;
  if (sq.entityType === "project")      found = findRecord(data?.projects)       as Record<string, unknown> | undefined;
  if (sq.entityType === "vendor")       found = findRecord(data?.vendors)        as Record<string, unknown> | undefined;
  if (sq.entityType === "payment")      found = findRecord(data?.payments)       as Record<string, unknown> | undefined;
  if (sq.entityType === "annual_plan")  found = findRecord(data?.annualPlans)    as Record<string, unknown> | undefined;
  if (sq.entityType === "approval")     found = findRecord(data?.approvals)      as Record<string, unknown> | undefined;
  if (sq.entityType === "contract")     found = findRecord(data?.contracts ?? data?.procurements) as Record<string, unknown> | undefined;
  if (sq.entityType === "award")        found = findRecord(data?.contracts ?? data?.procurements) as Record<string, unknown> | undefined;
  if (sq.entityType === "bid" || sq.entityType === "tender") found = findRecord(data?.procurements) as Record<string, unknown> | undefined;

  const recordBlock = found
    ? `LIVE RECORD FOUND IN SYSTEM:
${JSON.stringify(found, null, 2)}

Use the above real data fields to populate the status card exactly. Do not invent values that contradict the record.`
    : `No exact record was found for reference "${ref}". Produce a plausible status card for a ${sq.label} and note that the exact reference could not be matched — ask the user to verify the ID.`;

  return FIRS_FOUNDATION + `

YOUR ROLE IN THIS MODE: Application Status Checker.
The user is checking the status of a ${sq.label} with reference/ID: "${ref}".

${recordBlock}

PRODUCE a STATUS CARD in this exact format:

---
${sq.icon} **${sq.label.toUpperCase()} STATUS REPORT**
🔖 **Reference:** ${ref}
📅 **Date Checked:** ${new Date().toLocaleDateString("en-NG", { day:"2-digit", month:"long", year:"numeric" })}

**CURRENT STATUS:** [One of: ⏳ Pending Review | 🔄 In Progress | ✅ Approved | ❌ Rejected | 🚫 On Hold | 🏁 Completed | 💰 Awaiting Payment — derive from the record's status field]

**TITLE / DESCRIPTION:** [from record]
**DEPARTMENT:** [from record]
**AMOUNT / VALUE:** [from record]
**STAGE:** [from record — current workflow stage]
**ASSIGNED TO / APPROVER:** [from record if available]

**TIMELINE:**
[Reconstruct completed → current → pending stages based on the stage field and NRS 10-stage workflow]
✅ [Earlier stage] — Completed
🔄 [Current stage] — In Progress  
⏳ [Next stage] — Pending

**NEXT ACTION REQUIRED:**
[Specific actionable step — who needs to do what to move this forward]

**ESTIMATED COMPLETION:** [Derive from stage position in the 10-stage workflow]

**NOTES / FLAGS:**
[Any compliance concerns, missing documents, or important observations based on the record data]
---

After the card, ask: "Would you like me to help with anything related to this ${sq.label}? I can draft a follow-up memo, check the approval route, or assist with the next stage."

RULES:
- Derive ALL values from the LIVE RECORD if provided — do not contradict it
- Map the record's status/stage to the NRS 10-stage procurement workflow
- If no record was found, say so clearly and ask the user to verify the reference
`;
}

// ─────────────────────────────────────────────────────────────────────────
// TOOL SWITCH DETECTION
// ─────────────────────────────────────────────────────────────────────────

const SWITCH_PATTERNS: Array<{ pattern: RegExp; toolId: ToolId }> = [
  { pattern: /annual\s*plan|annual\s*planner|stage\s*0|procurement\s*plan\s*prep/i, toolId: "annual" },
  { pattern: /requisition|memo|stage\s*1/i, toolId: "requisition" },
  { pattern: /approv(al|e)\s*(route|routing|chain|advisor)|stage\s*2/i, toolId: "approval" },
  { pattern: /validat(e|or|ion)|plan\s*check|stage\s*3/i, toolId: "validator" },
  { pattern: /method\s*advis|procurement\s*method|stage\s*4/i, toolId: "method" },
  { pattern: /sbd|standard\s*bidding|tender\s*doc|stage\s*5/i, toolId: "sbd" },
  { pattern: /evaluat(e|ion|or)|bid\s*eval|stage\s*6/i, toolId: "evaluation" },
  { pattern: /award\s*letter|contract\s*award|stage\s*7/i, toolId: "award" },
  { pattern: /risk\s*register|project\s*monitor|stage\s*8/i, toolId: "risk" },
  { pattern: /payment\s*check|payment\s*ready|stage\s*9/i, toolId: "payment" },
  { pattern: /home|general|start\s*over|main\s*menu|help\s*me/i, toolId: "home" },
];

function detectSwitch(text: string): ToolId | null {
  const lower = text.toLowerCase();
  const switchPhrases = ["switch to", "go to", "open", "use the", "help me with", "i need", "take me to", "back to"];
  const hasSwitchIntent = switchPhrases.some(p => lower.includes(p));
  if (!hasSwitchIntent && !lower.includes("stage")) return null;
  for (const { pattern, toolId } of SWITCH_PATTERNS) {
    if (pattern.test(text)) return toolId;
  }
  return null;
}

const END_SESSION_PATTERNS = /\b(end session|close chat|close|done for now|that'?s? all|goodbye|bye|thank you|thanks|no more|finish|exit)\b/i;

// ─────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
}

function renderMarkdown(text: string): React.ReactNode[] {
  return text.split("\n").map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={pi}>{part.slice(2, -2)}</strong>
        : <React.Fragment key={pi}>{part}</React.Fragment>
    );
    return <React.Fragment key={li}>{parts}{li < text.split("\n").length - 1 && <br />}</React.Fragment>;
  });
}

// ─────────────────────────────────────────────────────────────────────────
// COLOUR TOKENS
// ─────────────────────────────────────────────────────────────────────────

const C = {
  primary:   "#1d4ed8",
  primaryDk: "#1e3a8a",
  surface:   "#ffffff",
  bg:        "#f8fafc",
  border:    "#e2e8f0",
  textMain:  "#0f172a",
  textSub:   "#64748b",
  textMuted: "#94a3b8",
  userBg:    "#1d4ed8",
  botBg:     "#f1f5f9",
  green:     "#10b981",
};

// ─────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────

const TypingDots: React.FC = () => (
  <div style={{ display:"flex", gap:4, padding:"10px 14px", background:C.botBg, borderRadius:"16px 16px 16px 4px", alignSelf:"flex-start", border:`1px solid ${C.border}` }}>
    <style>{`@keyframes fDot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    {[0,160,320].map(d => (
      <span key={d} style={{ width:6, height:6, borderRadius:"50%", background:C.textMuted, display:"block", animation:"fDot 1.2s infinite", animationDelay:`${d}ms` }} />
    ))}
  </div>
);

const BotAvatar: React.FC = () => (
  <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.primary},#6366f1)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, color:"#fff", fontWeight:700, alignSelf:"flex-end", marginBottom:2 }}>
    AI
  </div>
);

interface BubbleProps {
  msg: ChatMessage;
  onChip: (c: string) => void;
  onCopy: (id: string, text: string) => void;
  showTime: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ msg, onChip, onCopy, showTime }) => {
  const isUser   = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) {
    return (
      <div style={{ textAlign:"center", margin:"4px 0" }}>
        <span style={{ fontSize:11, color:C.textMuted, background:C.bg, padding:"2px 10px", borderRadius:999, border:`1px solid ${C.border}` }}>
          {msg.text}
        </span>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems: isUser ? "flex-end" : "flex-start", gap:4 }}>
      <div style={{ display:"flex", alignItems:"flex-end", gap:6, flexDirection: isUser ? "row-reverse" : "row" }}>
        {!isUser && <BotAvatar />}
        <div style={{ maxWidth:"100%", display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{
            padding:"9px 13px",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: isUser ? C.userBg : C.botBg,
            color: isUser ? "#fff" : C.textMain,
            fontSize:13, lineHeight:1.6,
            border: isUser ? "none" : `1px solid ${C.border}`,
            boxShadow:"0 1px 2px rgba(0,0,0,.06)",
            wordBreak:"break-word", position:"relative",
          }}>
            {isUser ? msg.text : renderMarkdown(msg.text)}
            {!isUser && (
              <button
                onClick={() => onCopy(msg.id, msg.text)}
                title={msg.copied ? "✓ Copied!" : "Copy message"}
                className={msg.copied ? "nrs-copy nrs-copy-flash" : "nrs-copy"}
                style={{
                  position:"absolute", top:6, right:6,
                  background: msg.copied ? "#dcfce7" : "transparent",
                  border:"none", cursor:"pointer",
                  opacity: msg.copied ? 1 : 0.35,
                  fontSize:11,
                  color: msg.copied ? "#16a34a" : C.textSub,
                  padding:"2px 4px", lineHeight:1,
                  transition:"opacity .15s, background .15s, color .15s",
                  borderRadius:4,
                }}
              >
                {msg.copied ? "✓ Copied" : "⎘"}
              </button>
            )}
          </div>
          {!isUser && msg.chips && msg.chips.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, paddingLeft:2 }}>
              {msg.chips.map(c => (
                <button key={c} onClick={() => onChip(c)}
                  //className="nrs-chip"
                  className={`${msg.copied ? "nrs-copy nrs-copy-flash" : "nrs-copy"} ${
                          msg.chips?.some(c => c.startsWith("✓"))
                            ? "bg-green-100 text-green-700 border-green-300"
                            : ""
                        }`}
                  style={{
                    fontSize:11, padding:"4px 10px", borderRadius:999,
                    border:`1px solid #bfdbfe`, background:"#eff6ff",
                    color:C.primary, cursor:"pointer", fontWeight:500,
                    transition:"background .15s, border-color .15s, transform .1s, box-shadow .15s",
                  }}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {showTime && (
        <span style={{ fontSize:10, color:C.textMuted, paddingLeft: isUser ? 0 : 34, paddingRight: isUser ? 4 : 0 }}>
          {formatTime(msg.timestamp)}
        </span>
      )}
    </div>
  );
};

// ── Tool switcher pill row ──────────────────────────────────────────────
interface ToolBarProps { active: ToolId; onSwitch: (id: ToolId) => void; }

const ToolBar: React.FC<ToolBarProps> = ({ active, onSwitch }) => (
  <div className="nrs-tb" style={{ display:"flex", gap:4, padding:"6px 10px", overflowX:"auto", borderBottom:`1px solid ${C.border}`, scrollbarWidth:"none", flexShrink:0 }}>
    {TOOLS.map(t => {
      const isActive = t.id === active;
      return (
        <button
          key={t.id}
          onClick={() => onSwitch(t.id)}
          title={`${t.label} — ${t.stage}`}
          style={{
            display:"flex", alignItems:"center", gap:4,
            padding: isActive ? "4px 10px" : "4px 7px",
            borderRadius:999,
            border: isActive ? `1.5px solid ${C.primary}` : `1.5px solid ${C.border}`,
            background: isActive ? "#eff6ff" : "transparent",
            color: isActive ? C.primary : C.textSub,
            fontSize:11, fontWeight: isActive ? 700 : 500,
            cursor:"pointer", flexShrink:0, transition:"all .15s",
          }}
        >
          <span style={{ fontSize:13 }}>{t.icon}</span>
          {isActive && <span>{t.shortLabel}</span>}
        </button>
      );
    })}
  </div>
);

// ── End session confirmation banner ────────────────────────────────────
interface EndSessionBannerProps { onConfirm: () => void; onCancel: () => void; }

const EndSessionBanner: React.FC<EndSessionBannerProps> = ({ onConfirm, onCancel }) => (
  <div style={{ margin:"0 12px 8px", padding:"12px 14px", background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:10, flexShrink:0 }}>
    <p style={{ margin:"0 0 4px", fontSize:12, color:"#92400e", fontWeight:700 }}>End this session?</p>
    <p style={{ margin:"0 0 10px", fontSize:11, color:"#78350f", lineHeight:1.4 }}>The conversation will be cleared and the chat will close.</p>
    <div style={{ display:"flex", gap:8 }}>
      <button
        onClick={onConfirm}
        style={{ flex:1, padding:"6px 0", borderRadius:8, border:"none", background:"#d97706", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}
      >
        Yes, end session
      </button>
      <button
        onClick={onCancel}
        style={{ flex:1, padding:"6px 0", borderRadius:8, border:`1px solid #fcd34d`, background:"#fff", color:"#92400e", fontSize:12, fontWeight:600, cursor:"pointer" }}
      >
        Cancel
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────

const FIRSAIChatPane: React.FC<{ data?: NRSSystemData }> = ({ data }) => {
  const [open, setOpen]                           = useState<boolean>(false);
  const [activeTool, setActiveTool]               = useState<ToolId>("home");
  const [messages, setMessages]                   = useState<ChatMessage[]>([]);
  const [input, setInput]                         = useState<string>("");
  const [loading, setLoading]                     = useState<boolean>(false);
  const [initialized, setInitialized]             = useState<boolean>(false);
  const [showEndConfirm, setShowEndConfirm]       = useState<boolean>(false);
  const [showToolSwitcher, setShowToolSwitcher]   = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible]       = useState<boolean>(true);
  const [unread, setUnread]                       = useState<boolean>(false);
  // Tracks an in-progress status lookup — set when intent detected, cleared after ID is received
  const [pendingStatus, setPendingStatus]         = useState<StatusQuery | null>(null);
  // "picking" = waiting for entity type, "ref" = waiting for ref/ID, null = idle
  const [statusStep, setStatusStep]               = useState<"picking" | "ref" | null>(null);

  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 80) + "px";
    }
  }, [input]);

  // Init greeting on first open
  useEffect(() => {
    if (open && !initialized) {
      const t = TOOL_MAP.get("home")!;
      setMessages([{ id: uid(), role: "model", text: t.openingQuestion, chips: t.chips, toolId: "home", timestamp: new Date() }]);
      setInitialized(true);
    }
    if (open) setUnread(false);
  }, [open, initialized]);

  // ── Beep (Web Audio API — no external file) ──────────────────────────
  const playBeep = useCallback((): void => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx  = new AudioCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    } catch { /* silently ignore if AudioContext blocked */ }
  }, []);

  // Play beep every 60 s while pane is closed
  useEffect(() => {
    if (open) return;
    playBeep();
    const id = setInterval(playBeep, 60000);
    return () => clearInterval(id);
  }, [open, playBeep]);

  // Build OpenRouter message history (last 16 turns, no system dividers)
  const buildHistory = useCallback((msgs: ChatMessage[]): ORMessage[] => {
    return msgs
      .filter(m => m.role !== "system")
      .slice(-16)
      .map(m => ({
        role: (m.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: m.text,
      }));
  }, []);

  // ── addMsg — clears chips on all prior messages, appends new one ─────
  const addMsg = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">): ChatMessage => {
    const full: ChatMessage = { ...msg, id: uid(), timestamp: new Date() };
    setMessages(prev => [...prev.map(m => ({ ...m, chips: undefined })), full]);
    return full;
  }, []);

  // ── Switch tool ───────────────────────────────────────────────────────
  const switchTool = useCallback((toolId: ToolId, silent?: boolean): void => {
    if (toolId === activeTool && !silent) return;
    const t = TOOL_MAP.get(toolId)!;
    setActiveTool(toolId);
    if (!silent) {
      const divider: ChatMessage  = { id: uid(), role: "system", text: `Switched to ${t.label} — ${t.description}`, timestamp: new Date() };
      const greeting: ChatMessage = { id: uid(), role: "model",  text: t.openingQuestion, chips: t.chips, toolId, timestamp: new Date() };
      setMessages(prev => [...prev.map(m => ({ ...m, chips: undefined })), divider, greeting]);
    }
  }, [activeTool]);

  // ── End session ───────────────────────────────────────────────────────
  const endSession = useCallback((): void => {
    setMessages([]);
    setActiveTool("home");
    setInitialized(false);
    setShowEndConfirm(false);
    setOpen(false);
    setTooltipVisible(true);
    setPendingStatus(null);
    setStatusStep(null);
  }, []);

  // ── Copy message to clipboard ─────────────────────────────────────────
     const handleCopy = useCallback((id: string, text: string): void => {
      void navigator.clipboard.writeText(text).then(() => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
        setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
      });
    }, []);

  // ── Send message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");

    // End-session intent
    if (END_SESSION_PATTERNS.test(trimmed)) {
      addMsg({ role: "user", text: trimmed });
      setShowEndConfirm(true);
      return;
    }

    // ── Status flow step 3: user entered a ref/ID, run the lookup ────────
    if (statusStep === "ref" && pendingStatus) {
      const sq = pendingStatus;
      setPendingStatus(null);
      setStatusStep(null);
      addMsg({ role: "user", text: trimmed });
      setLoading(true);
      try {
        const statusPrompt = buildStatusPrompt(data, sq, trimmed);
        const history = buildHistory([...messages, { id: "", role: "user" as const, text: trimmed, timestamp: new Date() }]);
        const reply   = await callAI(statusPrompt, history);
        addMsg({ role: "model", text: reply, chips: ["Check another status", "Draft follow-up memo", "Switch tool", "Start a new task"] });
        if (!open) setUnread(true);
      } catch (e) {
        addMsg({ role: "model", text: "⚠️ " + (e instanceof Error ? e.message : "Something went wrong."), chips: ["Try again"] });
      }
      setLoading(false);
      return;
    }

    // ── Status flow step 2: user typed entity type (fallback if no chip) ──
    if (statusStep === "picking") {
      const lower2 = trimmed.toLowerCase();
      const matched = STATUS_QUERIES.find(q =>
        lower2.includes(q.entityType.replace("_", " ")) ||
        lower2.includes(q.label.toLowerCase())
      );
      if (matched) {
        addMsg({ role: "user", text: trimmed });
        setPendingStatus(matched);
        setStatusStep("ref");
        addMsg({ role: "model", text: matched.icon + " **" + matched.label + " Status Lookup**\n\n" + matched.refPrompt, chips: [] });
        return;
      }
      addMsg({ role: "user", text: trimmed });
      addMsg({ role: "model", text: "I didn't recognise that. Please pick from the options below:", chips: STATUS_QUERIES.map(q => q.icon + " " + q.label) });
      return;
    }

    // ── Status flow step 1: detect "check status" intent, show picker ─────
    const isStatusIntent = /check.{0,20}status|status.{0,20}(of|for|a|an|my)|i want.{0,10}(check|status)|application.{0,10}status/i.test(trimmed);
    if (isStatusIntent) {
      addMsg({ role: "user", text: trimmed });
      setStatusStep("picking");
      addMsg({ role: "model", text: "🔍 **Application Status Check**\n\nWhich type of application would you like to check?\n\nPlease select one:", chips: STATUS_QUERIES.map(q => q.icon + " " + q.label) });
      return;
    }

    // ── Tool-switch intent ────────────────────────────────────────────────
    const switchTarget = detectSwitch(trimmed);
    addMsg({ role: "user", text: trimmed });

    if (switchTarget && switchTarget !== activeTool) {
      switchTool(switchTarget);
      return;
    }

    setLoading(true);
    try {
      const currentTool = TOOL_MAP.get(activeTool)!;
      const snapshot    = [...messages, { id: "", role: "user" as const, text: trimmed, timestamp: new Date(), chips: undefined }];
      const history     = buildHistory(snapshot);
      const reply       = await callAI(currentTool.systemPrompt, history);
      const chips: string[] = reply.length > 500
        ? ["Refine this output", "Copy this", "Start a new task", "Switch tool"]
        : currentTool.chips.slice(0, 4);
      addMsg({ role: "model", text: reply, chips, toolId: currentTool.id });
      if (!open) setUnread(true);
    } catch (e) {
      addMsg({
        role: "model",
        text: "⚠️ " + (e instanceof Error ? e.message : "Something went wrong. Please try again."),
        chips: ["Try again", "Switch tool"],
      });
      if (!open) setUnread(true);
    }
    setLoading(false);
  }, [loading, activeTool, messages, buildHistory, addMsg, switchTool, open, pendingStatus, statusStep, data]);

  // ── Chip click ────────────────────────────────────────────────────────
  const handleChip = useCallback((chip: string): void => {
    const lower = chip.toLowerCase();

         if (lower === "copy this" || lower === "copy output") {
          const last = messages.slice().reverse().find(m => m.role === "model");

          if (!last) return;

          handleCopy(last.id, last.text);

          // change ONLY the clicked chip
          setMessages(prev =>
            prev.map(msg => {
              if (msg.id !== last.id || !msg.chips) return msg;

              return {
                ...msg,
                chips: msg.chips.map(c =>
                  c.toLowerCase() === "copy this"
                    ? "✓ Copied to clipboard"
                    : c
                )
              };
            })
          );

          // revert after 5 seconds
          setTimeout(() => {
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id !== last.id || !msg.chips) return msg;

                return {
                  ...msg,
                  chips: msg.chips.map(c =>
                    c === "✓ Copied to clipboard"
                      ? "Copy this"
                      : c
                  )
                };
              })
            );
          }, 5000);

          return;
        }
    

    // if (lower === "copy this" || lower === "copy output") {
    //   const last = [...messages].reverse().find(m => m.role === "model");
    //   if (last) handleCopy(last.id, last.text);
    //   return;
    // }
    if (lower === "switch tool" || lower === "main menu") { setShowToolSwitcher(true); return; }
    if (lower === "start a new task" || lower === "start over") { switchTool("home"); return; }
    if (lower === "end session" || lower === "close") { setShowEndConfirm(true); return; }
    // Re-trigger status picker
    if (lower === "check another status" || lower === "check application status") {
      void sendMessage("I want to check status");
      return;
    }
    // ── Entity-type chip pick (status step 2) ─────────────────────────
    if (statusStep === "picking") {
      const matched = STATUS_QUERIES.find(q => chip.includes(q.label));
      if (matched) {
        addMsg({ role: "user", text: chip });
        setPendingStatus(matched);
        setStatusStep("ref");
        setMessages(prev => [
          ...prev.map(m => ({ ...m, chips: undefined })),
          { id: uid(), role: "model" as const, text: matched.icon + " **" + matched.label + " Status Lookup**\n\n" + matched.refPrompt, chips: [], timestamp: new Date() },
        ]);
        return;
      }
    }
    const toolSwitch = detectSwitch(chip);
    if (toolSwitch && toolSwitch !== activeTool) { switchTool(toolSwitch); return; }
    void sendMessage(chip);
  }, [messages, activeTool, handleCopy, sendMessage, switchTool, statusStep, addMsg]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const currentTool = TOOL_MAP.get(activeTool)!;
  const canSend     = input.trim().length > 0 && !loading;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* ═══ GLOBAL STYLES + KEYFRAMES ══════════════════════════════════ */}
      <style>{`
        .nrs-pane *::-webkit-scrollbar          { width: 3px; }
        .nrs-pane *::-webkit-scrollbar-thumb    { background: #cbd5e1; border-radius: 99px; }
        .nrs-pane *::-webkit-scrollbar-track    { background: transparent; }
        .nrs-tb::-webkit-scrollbar              { display: none; }
        /* Send button */
        .nrs-send:hover:not(:disabled)          { background: #1e40af !important; }
        /* Tooltip quick-picks */
        .nrs-qchip:hover                        { background: rgba(255,255,255,.22) !important; }
        /* Message chips */
        .nrs-chip:hover                         { background: #dbeafe !important; border-color: #93c5fd !important; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(29,78,216,.15); }
        .nrs-chip:active                        { transform: translateY(0); }
        /* Copy button */
        .nrs-copy:hover                         { opacity: 1 !important; background: #f0fdf4 !important; border-radius: 4px; }
        .nrs-copy-flash                         { background: #dcfce7 !important; border-radius: 4px; }
        /* Tool switcher modal backdrop */
        .nrs-switcher-backdrop                  { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: nrsFadeIn .15s ease; }
        .nrs-switcher-item:hover                { background: #eff6ff !important; border-color: #93c5fd !important; }
        .nrs-switcher-item:active               { background: #dbeafe !important; }
        @keyframes nrsFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes nrsPopIn  { from { opacity:0; transform: scale(.95) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }

        /* FAB bounce (closed only) */
        @keyframes nrsBounce {
          0%, 60%, 100% { transform: translateY(0);     }
          20%           { transform: translateY(-10px); }
          40%           { transform: translateY(-5px);  }
        }
        /* Pulse ring */
        @keyframes nrsRing {
          0%   { transform: scale(1);   opacity: .65; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        /* Beep ripple on FAB */
        @keyframes nrsBeep {
          0%,88%,100% { box-shadow: 0 6px 24px rgba(29,78,216,.55); }
          91%         { box-shadow: 0 6px 24px rgba(29,78,216,.55), 0 0 0 10px rgba(99,102,241,.3); }
          95%         { box-shadow: 0 6px 24px rgba(29,78,216,.55), 0 0 0 20px rgba(99,102,241,.08); }
        }
        /* Tooltip slide-in */
        @keyframes nrsSlide {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0);    }
        }

        /* Responsive — full-screen on small viewports */
        @media (max-width: 500px) {
          .nrs-pane-outer {
            right: 0    !important;
            bottom: 0   !important;
            width: 100vw !important;
            height: 92dvh !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .nrs-fab-col {
            right: 16px !important;
            bottom: 16px !important;
          }
        }
      `}</style>

      {/* ═══ FAB COLUMN (tooltip card + pulse ring + button) ════════════ */}
      <div
        className="nrs-fab-col"
        style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}
      >
        {/* Tooltip / quick-pick card — shown when pane is closed */}
        {!open && tooltipVisible && (
          <div style={{
            background:"#0f2b4a", borderRadius:16, padding:"14px 16px", width:248,
            boxShadow:"0 8px 32px rgba(0,0,0,.3)", animation:"nrsSlide .28s ease",
            position:"relative",
          }}>
            {/* Dismiss */}
            <button
              onClick={() => setTooltipVisible(false)}
              aria-label="Dismiss tooltip"
              style={{ position:"absolute", top:8, right:8, background:"transparent", border:"none", cursor:"pointer", color:"rgba(255,255,255,.45)", fontSize:14, lineHeight:1, padding:2 }}
            >
              ✕
            </button>
            <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:600, color:"#fff", lineHeight:1.45, paddingRight:18 }}>
              👋 Hello! I'm your <strong>NRS AI</strong>.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {([
                { id:"requisition" as ToolId, label:"📝  Write a Requisition Memo",  isStatus: false },
                { id:"approval"    as ToolId, label:"🔀  Check Approval Route",       isStatus: false },
                { id:"sbd"         as ToolId, label:"📄  Draft a Tender Document",    isStatus: false },
                { id:"evaluation"  as ToolId, label:"⚖️  Evaluate Bids",             isStatus: false },
                { id:"payment"     as ToolId, label:"💳  Payment Readiness Check",    isStatus: false },
                { id:"home"        as ToolId, label:"🔍  Check Application Status",   isStatus: true  },
              ] as Array<{ id: ToolId; label: string; isStatus: boolean }>).map(opt => (
                <button
                  key={opt.label}
                  className="nrs-qchip"
                  onClick={() => {
                    setOpen(true);
                    setTooltipVisible(false);
                    setUnread(false);
                    if (opt.isStatus) {
                      setTimeout(() => void sendMessage("I want to check status"), 120);
                    } else {
                      setTimeout(() => switchTool(opt.id, false), 80);
                    }
                  }}
                  style={{
                    textAlign:"left", background:"rgba(255,255,255,.1)",
                    border:"1.5px solid rgba(255,255,255,.18)", borderRadius:10,
                    padding:"7px 12px", color:"#fff", fontSize:12, fontWeight:500,
                    cursor:"pointer", transition:"background .15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Caret pointing toward FAB */}
            <div style={{ position:"absolute", bottom:-8, right:28, width:0, height:0, borderLeft:"8px solid transparent", borderRight:"8px solid transparent", borderTop:"8px solid #0f2b4a" }} />
          </div>
        )}

        {/* FAB + pulse ring + label */}
        <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          {/* Pulse ring (only when closed) */}

            {!open && (
            <span style={{
              position:"absolute", inset:-5, borderRadius:"50%",
              background:"rgba(99,102,241,.32)",
              animation:"nrsRing 2.2s ease-out infinite",
              pointerEvents:"none",
            }} />
          )}

          <button
            aria-label="Toggle NRS AI Assistant"
            onClick={() => {
              const next = !open;
              setOpen(next);
              setUnread(false);
              if (next) setTooltipVisible(false);
              else      setTooltipVisible(true);
            }}
            style={{
              width:64, height:64, borderRadius:"50%", border:"none", cursor:"pointer",
              background: open ? "#1e3a8a" : "linear-gradient(145deg,#1d4ed8,#4338ca)",
              animation: open
                ? "nrsBeep 6s ease infinite"
                : "nrsBounce 2.4s ease infinite, nrsBeep 6s ease infinite",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative", transition:"background .2s", flexShrink:0,
            }}
          >
            {open
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2H22l-6.2 4.6 2.4 7.2L12 17l-6.2 4 2.4-7.2L2 9.2h7.6z"/>
                </svg>
            }
            {/* Unread badge */}
            {!open && unread && (
              <span style={{ position:"absolute", top:2, right:2, width:17, height:17, borderRadius:"50%", background:"#f59e0b", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff" }}>
                1
              </span>
            )}
             {!open && (
              <span style={{ position:"absolute", top:2, right:2, width:10, height:10, borderRadius:"50%", background:"#f59e0b", border:"2px solid #fff" }} />
             )}
          </button>

          {/* "AI Assistant" label pill */}
          {!open && (
            <div style={{ background:"#0f2b4a", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:999, whiteSpace:"nowrap", border:"1.5px solid rgba(255,255,255,.2)", letterSpacing:"0.04em" }}>
              AI Assistant
            </div>
          )}
        </div>
      </div>

      {/* ═══ CHAT PANE ══════════════════════════════════════════════════ */}
      <div
        className="nrs-pane nrs-pane-outer"
        role="dialog"
        aria-label="NRS AI Assistant"
        aria-modal="false"
        style={{
          position:"fixed", bottom:108, right:24,
          width:440, height:640,
          background:C.surface, borderRadius:18,
          boxShadow:"0 12px 48px rgba(0,0,0,.2), 0 2px 8px rgba(0,0,0,.1)",
          border:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column",
          zIndex:9998, overflow:"hidden",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          pointerEvents: open ? "all" : "none",
          transition:"opacity .22s ease, transform .22s ease",
        }}
      >
        {/* ── Header ── */}
        <div style={{ background:`linear-gradient(135deg,${C.primaryDk},#3730a3)`, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
            {currentTool.icon}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.2 }}>NRS AI</p>
            <p style={{ margin:"2px 0 0", fontSize:11, color:"#bfdbfe", lineHeight:1 }}>{currentTool.label} · {currentTool.shortLabel}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background: loading ? "#f59e0b" : C.green, transition:"background .3s" }} />
              <span style={{ fontSize:10, color:"#bfdbfe" }}>{loading ? "Thinking…" : "Online"}</span>
            </div>
            <button
              onClick={() => setShowEndConfirm(true)}
              title="End session"
              style={{ background:"rgba(255,255,255,.12)", border:"none", borderRadius:6, padding:"4px 8px", cursor:"pointer", color:"#bfdbfe", fontSize:10, fontWeight:600 }}
            >
              End
            </button>
          </div>
        </div>

        {/* ── Tool switcher bar (ToolBar component) ── */}
        <ToolBar active={activeTool} onSwitch={switchTool} />

        {/* ── Messages ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 12px 4px", display:"flex", flexDirection:"column", gap:10 }}>
          {messages.length === 0 && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, opacity:.5 }}>
              <span style={{ fontSize:32 }}>🤖</span>
              <p style={{ fontSize:12, color:C.textSub, margin:0 }}>Starting up…</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <Bubble
              key={msg.id}
              msg={msg}
              onChip={handleChip}
              onCopy={handleCopy}
              showTime={i === messages.length - 1 || messages[i + 1]?.role !== msg.role}
            />
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:6 }}>
              <BotAvatar />
              <TypingDots />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* ── Tool Switcher Modal ── */}
        {showToolSwitcher && (
          <div
            className="nrs-switcher-backdrop"
            onClick={() => setShowToolSwitcher(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background:"#fff", borderRadius:16, padding:"20px 0 12px",
                width:300, maxHeight:"70vh", overflowY:"auto",
                boxShadow:"0 20px 60px rgba(0,0,0,.25)",
                animation:"nrsPopIn .2s ease",
              }}
            >
              <div style={{ padding:"0 16px 12px", borderBottom:`1px solid ${C.border}`, marginBottom:8 }}>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.textMain }}>Switch Tool</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:C.textSub }}>Select a tool/module to continue with</p>
              </div>
              {TOOLS.filter(t => t.id !== activeTool).map(t => (
                <button
                  key={t.id}
                  className="nrs-switcher-item"
                  onClick={() => { switchTool(t.id); setShowToolSwitcher(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    width:"100%", textAlign:"left",
                    padding:"10px 16px", border:"none",
                    background:"transparent", cursor:"pointer",
                    transition:"background .12s, border-color .12s",
                    borderBottom:`1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize:20, flexShrink:0, width:28, textAlign:"center" }}>{t.icon}</span>
                  <div style={{ minWidth:0 }}>
                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.textMain }}>{t.label}</p>
                    <p style={{ margin:"1px 0 0", fontSize:11, color:C.textSub }}>{t.stage} · {t.description}</p>
                  </div>
                </button>
              ))}
              <div style={{ padding:"8px 16px 0" }}>
                <button
                  onClick={() => setShowToolSwitcher(false)}
                  style={{ width:"100%", padding:"8px", borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.textSub, fontSize:12, fontWeight:600, cursor:"pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── End session banner (EndSessionBanner component) ── */}
        {showEndConfirm && (
          <EndSessionBanner
            onConfirm={endSession}
            onCancel={() => setShowEndConfirm(false)}
          />
        )}

        {/* ── Input area ── */}
        <div style={{ padding:"8px 10px 10px", borderTop:`1px solid ${C.border}`, flexShrink:0, display:"flex", flexDirection:"column", gap:4 }}>
          <p style={{ margin:0, fontSize:10, color:C.textMuted, paddingLeft:2 }}>
            Press <kbd style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:3, padding:"0 3px", fontSize:10 }}>Enter</kbd> to send · Shift+Enter for new line
          </p>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end" }}>
            <textarea
              ref={inputRef}
              rows={1.5}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={loading ? "AI is thinking…" : "Type a message…."}
              style={{
                flex:1, border:`1px solid ${canSend ? C.primary : C.border}`,
                borderRadius:10, padding:"8px 10px", fontSize:13, lineHeight:1.4,
                outline:"none", resize:"none", overflow:"hidden",
                fontFamily:"'Segoe UI', system-ui, sans-serif",
                background: loading ? C.bg : C.surface,
                color:C.textMain, transition:"border-color .15s", maxHeight:100,
              }}
            />
            <button
              className="nrs-send"
              onClick={() => void sendMessage(input)}
              disabled={!canSend}
              aria-label="Send"
              style={{
                width:38, height:38, borderRadius:10, border:"none",
                background: canSend ? C.primary : C.border,
                cursor: canSend ? "pointer" : "not-allowed",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, transition:"background .15s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={canSend ? "#fff" : C.textMuted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default FIRSAIChatPane;




















// import * as React from "react";
// import { useState, useRef, useEffect, useCallback } from "react";
// import AI_CONFIG from "../../../../config/aiConfig";

// // ═══════════════════════════════════════════════════════════════════════════
// // FIRSAIChatPane.tsx  —  SPFx TypeScript
// // Floating conversational AI assistant for the NRS e-Procurement System.
// // Mounts once in the root layout — visible on every page.
// // ═══════════════════════════════════════════════════════════════════════════

// // ─────────────────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────────────────

// interface ORMessage {
//   role: "system" | "user" | "assistant";
//   content: string;
// }

// interface ORRequest {
//   model: string;
//   messages: ORMessage[];
//   temperature?: number;
//   max_tokens?: number;
// }

// interface ORResponse {
//   choices?: Array<{ message?: { content?: string } }>;
//   error?: { message: string };
// }

// type ToolId =
//   | "home" | "annual" | "requisition" | "approval" | "validator"
//   | "method" | "sbd" | "evaluation" | "award" | "risk" | "payment";


// type StatusEntityType =
//   | "requisition" | "annual_plan" | "procurement" | "vendor"
//   | "project" | "contract" | "payment" | "bid" | "award" | "tender";
 
// interface StatusQuery {
//   entityType: StatusEntityType;
//   label: string;         // Human-readable: "Requisition", "Annual Plan", etc.
//   refPrompt: string;     // The question to ask for the ref/ID
//   icon: string;
// }

// interface ChatMessage {
//   id: string;
//   role: "user" | "model" | "system";
//   text: string;
//   chips?: string[];
//   toolId?: ToolId;
//   timestamp: Date;
//   copied?: boolean;
// }

// interface ToolDef {
//   id: ToolId;
//   icon: string;
//   label: string;
//   shortLabel: string;
//   stage: string;
//   color: string;
//   description: string;
//   systemPrompt: string;
//   openingQuestion: string;
//   chips: string[];
// }

// // ─────────────────────────────────────────────────────────────────────────
// // OPENROUTER API
// // ─────────────────────────────────────────────────────────────────────────

// async function callAI(systemPrompt: string, history: ORMessage[]): Promise<string> {
//   const body: ORRequest = {
//     model: AI_CONFIG.MODEL,
//     messages: [{ role: "system", content: systemPrompt }, ...history],
//     temperature: 0.4,
//     max_tokens: 1200,
//   };

//   let res: Response;
//   try {
//     res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
//         "HTTP-Referer": window.location.origin,
//         "X-Title": "NRS AI",
//       },
//       body: JSON.stringify(body),
//     });
//   } catch {
//     throw new Error("Network error — please check your connection.");
//   }

//   const data: ORResponse = await res.json();
//   if (!res.ok) {
//     throw new Error(data.error?.message ?? `OpenRouter error ${res.status}`);
//   }

//   const text = data.choices?.[0]?.message?.content;
//   if (!text) throw new Error("Empty response from model.");
//   return text;
// }

// // ─────────────────────────────────────────────────────────────────────────
// // SYSTEM PROMPTS  —  rich, specific, output-driven
// // ─────────────────────────────────────────────────────────────────────────

// const FIRS_FOUNDATION = `
// You are NRS AI — an expert procurement assistant built into the Nigeria Revenue Service (NRS) Nigeria e-Procurement System.

// ABOUT NRS PROCUREMENT:
// NRS follows a structured 10-stage procurement workflow governed by the Public Procurement Act (PPA) 2007 and BPP guidelines:
//   Stage 0 – Annual Procurement Preparation (departmental needs, annual plan, budget approval)
//   Stage 1 – Requisition Initiation (memo to Executive Chairman, Director sign-off)
//   Stage 2 – EC Approval & Internal Routing (Executive Chairman review, approval chain)
//   Stage 3 – Procurement Plan Validation (Director validates item is in approved plan)
//   Stage 4 – Tendering Process Initiation (method selection, procurement committee setup)
//   Stage 5 – Tender Planning & Execution (SBDs, advertisement, bid collection)
//   Stage 6 – Evaluation, Recommendation & Approval Routing (evaluation committee, BPP/FEC)
//   Stage 7 – Contract Award (letter of award, contract signing, mobilisation)
//   Stage 8 – Project Monitoring (site visits, progress reports, variation orders)
//   Stage 9 – Project Completion & Payment Processing (JCC, invoices, TCC, WHT, VAT)

// KEY APPROVAL THRESHOLDS (PPA 2007 / BPP):
//   Up to ₦2,000,000       → Head of Procurement Unit
//   ₦2M – ₦10,000,000     → Director of Procurement + Executive Chairman
//   ₦10M – ₦100,000,000   → NRS Tenders Board
//   ₦100M – ₦500,000,000  → Bureau of Public Procurement (BPP)
//   Above ₦500,000,000    → Federal Executive Council (FEC)

// PROCUREMENT METHODS (PPA 2007):
//   Open Competitive Bidding (OCB)    – default for all significant procurements
//   Restricted Tendering              – specialist goods/services, justified in writing
//   Request for Quotation (RFQ)       – ≤ ₦2M goods, ≤ ₦5M works (low-value)
//   Direct Procurement / Single Source – emergency, proprietary, or sole supplier (BPP must approve)
//   Expression of Interest (EOI)      – pre-qualification for large consultancies

// CONVERSATION RULES — CRITICAL:
// 1. You are a CONVERSATIONAL assistant. Never dump all questions at once.
// 2. Ask ONE focused question at a time to gather what you need.
// 3. When you have enough context, produce a COMPLETE, FORMAL, PROFESSIONAL output.
// 4. Formal outputs must use Nigerian government document style — headers, reference numbers, formal salutations.
// 5. After producing output, always offer: "Would you like me to refine this, copy it, or help with something else?"
// 6. If the user's message is vague, ask a clarifying question rather than assuming.
// 7. Use ₦ for amounts. Format large numbers with commas (e.g. ₦12,500,000).
// 8. Never truncate formal documents. Always produce the complete output.
// 9. If the user says "end session", "close", "done", "thank you", "bye" — give a warm closing message.
// 10. If the user says "switch to [tool]" or "help me with [task]" — acknowledge and transition immediately.
// `.trim();

// const TOOLS: ToolDef[] = [
//   {
//     id: "home",
//     icon: "🏠",
//     label: "Home",
//     shortLabel: "Home",
//     stage: "All Stages",
//     color: "#2563eb",
//     description: "General help & navigation",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE IN THIS MODE:
// You are the friendly welcome assistant. Help the user understand what tools are available and guide them to the right one.

// Available tools and what they do:
// 1. 📅 Annual Planner  — compile departmental needs into an annual procurement plan
// 2. 📝 Requisition Memo  — draft formal procurement requisition memos to the Executive Chairman
// 3. 🔀 Approval Router  — determine the correct approval authority and chain for any procurement value
// 4. ✅ Plan Validator  — check if a requisition is in the approved annual procurement plan
// 5. 🎯 Method Advisor  — recommend the correct procurement method per PPA 2007
// 6. 📄 SBD Drafter  — draft Standard Bidding Document sections for tenders
// 7. ⚖️ Bid Evaluator  — score, rank, and produce a formal tender evaluation report
// 8. 🏆 Award Letter  — generate a formal contract award letter to the successful vendor
// 9. 🔍 Risk Register  — create a procurement risk register with mitigations
// 10. 💳 Payment Check  — verify payment documentation readiness
// 11. 🏠 Check Application Status — check the status of requisitions, procurements, vendors, projects, payments, etc.

// When the user describes their need, identify the right tool and ask if they'd like to switch to it.
// Answer general PPA 2007 questions directly and accurately.`,
//     openingQuestion: "Hello! 👋 I'm your **NRS AI Assistant**.\n\nI can help you with every stage of the NRS procurement process — from drafting memos and SBDs to evaluating bids, checking application status, and processing payments.\n\nWhat are you working on today?",
//     chips: ["Draft a Requisition Memo", "Determine Approval Route", "Evaluate Bids", "Draft an SBD", "Award Letter", "Risk Register", "Payment Check", "Check Application Status"],
//   },
//   {
//     id: "annual",
//     icon: "📅",
//     label: "Annual Planner",
//     shortLabel: "Annual",
//     stage: "Stage 0",
//     color: "#0891b2",
//     description: "Annual procurement plan preparation",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Annual Procurement Plan Assistant.
// Help the user compile departmental procurement needs into a formal NRS Annual Procurement Plan.

// WHAT YOU NEED TO GATHER (ask one at a time):
// 1. The fiscal year the plan covers
// 2. Total approved annual procurement budget (₦)
// 3. Departmental needs — item by item (department, description, category: Goods/Works/Services, estimated cost)
//    Keep asking "Any more items?" until the user says no.
// 4. Any strategic priorities or constraints for the year

// WHAT YOU PRODUCE:
// A formal ANNUAL PROCUREMENT PLAN document with:
// - Header: NIGERIA REVENUE SERVICE / ANNUAL PROCUREMENT PLAN / [YEAR]
// - Executive Summary (budget overview, total requests, surplus/deficit)
// - Itemised Procurement Schedule table (S/N, Item, Dept, Category, Est. Cost ₦, Quarter, Method, Priority)
// - Budget Analysis (approved vs requested, variance)
// - Priority ranking with justification (HIGH/MEDIUM/LOW)
// - Items recommended for deferral if over budget
// - Procurement calendar (Q1-Q4 schedule)
// - Risk summary
// - Prepared by: Director of Procurement, NRS

// START: Ask for the fiscal year first.`,
//     openingQuestion: "📅 **Annual Procurement Planner** \n\nI'll help you prepare a formal NRS Annual Procurement Plan document.\n\nLet's start with the basics — **what fiscal year** is this plan for?",
//     chips: [`${new Date().getFullYear()} fiscal year`, `${new Date().getFullYear() - 1} fiscal year`, "Show me a sample plan"],
//   },
//   {
//     id: "requisition",
//     icon: "📝",
//     label: "Requisition Memo",
//     shortLabel: "Memo",
//     stage: "Stage 1",
//     color: "#2563eb",
//     description: "Draft formal procurement requisition memos",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Procurement Requisition Memo Drafter.
// Draft formal procurement requisition memos from a department/officer to the Executive Chairman, NRS.

// WHAT YOU NEED TO GATHER (one question at a time):
// 1. What item or service needs to be procured? (be specific)
// 2. Which department is making the request?
// 3. Name and designation of the requesting officer (if known)
// 4. Category: Goods, Works, or Services?
// 5. Estimated amount (₦)?
// 6. Why is this needed? (business justification — ask if not provided)
// 7. Is this item in the approved Annual Procurement Plan?
// 8. Any urgency or specific timeline?

// WHAT YOU PRODUCE:
// A complete, formal REQUISITION MEMO in Nigerian government format:

// NIGERIA REVENUE SERVICE
// Internal Memorandum

// FROM:  [Requesting Officer/HOD]
// TO:    The Executive Chairman, NRS
// DATE:  [Today's date]
// REF:   NRS/[DEPT]/REQ/[YEAR]/[XXX]
// RE:    REQUEST FOR PROCUREMENT OF [ITEM]

// 1.0 INTRODUCTION / BACKGROUND
// 2.0 PURPOSE OF REQUEST
// 3.0 SPECIFICATION / SCOPE
// 4.0 ESTIMATED COST: ₦[amount]
// 5.0 BUDGET AVAILABILITY (confirm in annual plan)
// 6.0 JUSTIFICATION
// 7.0 PROCUREMENT METHOD RECOMMENDED
// 8.0 CONCLUSION / RECOMMENDATION
//    "In view of the above, approval is respectfully sought..."

// Signature block: [Requesting Officer], [HOD]
// Cc: Director of Procurement; Director of Finance

// START: Ask what item/service they want to procure.`,
//     openingQuestion: "📝 **Requisition Memo Writer** \n\nI'll draft a formal procurement requisition memo addressed to the Executive Chairman.\n\nFirst — **what item or service** do you need to procure?",
//     chips: ["Office furniture", "IT equipment / laptops", "Vehicle / fleet", "Construction works", "Consulting services", "Software / licence"],
//   },
//   {
//     id: "approval",
//     icon: "🔀",
//     label: "Approval Router",
//     shortLabel: "Approval",
//     stage: "Stage 2",
//     color: "#d97706",
//     description: "Determine approval authority & routing chain",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Approval Route Advisor.
// Determine the exact approval authority and step-by-step routing for any NRS procurement.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. Procurement description (what is being bought?)
// 2. Category: Goods, Works, or Services?
// 3. Total estimated value (₦)?
// 4. Is this a new procurement or a contract variation/extension?
// 5. Is it in the approved annual procurement plan?

// WHAT YOU PRODUCE:
// A formal APPROVAL ROUTING ADVISORY NOTE:

// NRS PROCUREMENT APPROVAL ROUTE — [ITEM]
// Estimated Value: ₦[amount] | Category: [type] | Date: [today]

// APPROVAL AUTHORITY: [specific authority with legal basis]
// Legal Basis: PPA 2007, Section [X]; BPP Circular [ref]

// STEP-BY-STEP ROUTING:
// Step 1 → [Action] — [Officer/Body] — [Document required] — [Timeline]
// (continue until payment)

// DOCUMENTS REQUIRED AT EACH STAGE: [list per stage]
// ESTIMATED TOTAL PROCESSING TIME: [X] weeks
// KEY COMPLIANCE REQUIREMENTS: [list]
// RISKS & POTENTIAL DELAYS: [list]

// START: Ask what is being procured.`,
//     openingQuestion: "🔀 **Approval Route Advisor** \n\nI'll map out the exact approval chain for your procurement based on PPA 2007 thresholds.\n\nWhat is being procured — can you give me a brief description?",
//     chips: ["Goods purchase", "Construction / works", "Consulting services", "IT services", "Emergency procurement"],
//   },
//   {
//     id: "validator",
//     icon: "✅",
//     label: "Plan Validator",
//     shortLabel: "Validator",
//     stage: "Stage 3",
//     color: "#7c3aed",
//     description: "Validate requisitions against the annual plan",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Procurement Plan Validator.
// Help the Director of Procurement validate whether a requisition is in the approved Annual Procurement Plan.

// WHAT YOU NEED TO GATHER:
// 1. Item/service being requisitioned
// 2. Requesting department
// 3. Amount (₦)?
// 4. Is this item explicitly listed in the current approved Annual Procurement Plan? (Yes / No / Unsure)
// 5. If NO — what is the justification for this unplanned procurement?
// 6. If YES — does the amount match the plan or is there a significant variance?

// WHAT YOU PRODUCE:
// NRS PROCUREMENT PLAN VALIDATION REPORT

// VALIDATION DECISION: APPROVED / CONDITIONAL APPROVAL / ESCALATION REQUIRED / REJECTED

// FINDINGS: [plan inclusion, budget adequacy, variance]
// RECOMMENDED ACTION: [specific steps]

// If NOT in plan — explain the formal process to seek BPP approval for unplanned procurement.
// If APPROVED — provide sign-off language the Director can use.

// START: Ask what item is being validated.`,
//     openingQuestion: "✅ **Procurement Plan Validator** \n\nI'll check whether a requisition aligns with the approved Annual Procurement Plan.\n\n**What item or service** is being submitted for validation?",
//     chips: ["Item is in the plan", "Item is NOT in the plan", "Amount has changed", "New urgent requirement"],
//   },
//   {
//     id: "method",
//     icon: "🎯",
//     label: "Method Advisor",
//     shortLabel: "Method",
//     stage: "Stage 4",
//     color: "#7c3aed",
//     description: "Recommend the correct procurement method",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Procurement Method Advisor.
// Recommend the most appropriate procurement method per PPA 2007 for any NRS procurement.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. What is being procured? (description)
// 2. Category: Goods, Works, or Services / Consultancy?
// 3. Estimated value (₦)?
// 4. Is this an emergency or standard procurement?
// 5. Is there only one known supplier (sole source situation)?
// 6. Is this a proprietary item that only one manufacturer produces?
// 7. Has this been procured before? If yes, how was it done?

// WHAT YOU PRODUCE:
// NRS PROCUREMENT METHOD RECOMMENDATION

// RECOMMENDED METHOD: [METHOD NAME]
// PPA 2007 Legal Basis: Section [X]

// WHY THIS METHOD: [justification]
// ALTERNATIVE METHODS CONSIDERED: [table]
// EXECUTION STEPS: [numbered list]
// REQUIRED APPROVALS: [list]
// ESTIMATED TIMELINE: [breakdown]

// If Direct Procurement is recommended — explicitly state BPP must approve and explain the process.

// START: Ask what is being procured.`,
//     openingQuestion: "🎯 **Procurement Method Advisor** \n\nI'll recommend the right procurement method under PPA 2007 for your specific situation.\n\n**What are you looking to procure?**",
//     chips: ["Low-value goods (< ₦2M)", "High-value goods", "Construction works", "Consulting / advisory", "Emergency purchase", "Proprietary software"],
//   },
//   {
//     id: "sbd",
//     icon: "📄",
//     label: "SBD Drafter",
//     shortLabel: "SBD",
//     stage: "Stage 5",
//     color: "#059669",
//     description: "Draft Standard Bidding Documents",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Standard Bidding Document (SBD) Drafter.
// Draft complete SBD sections for NRS tenders in accordance with BPP standard formats.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. Tender title / description
// 2. Category: Goods, Works, or Services/Consultancy?
// 3. Estimated contract value (₦)?
// 4. Key technical specifications or scope
// 5. Any special conditions?
// 6. Submission deadline preference?
// 7. Evaluation basis: price only, or price + technical?

// WHAT YOU PRODUCE:
// Full SBD sections in BPP-compliant format:

// NIGERIA REVENUE SERVICE
// TENDER DOCUMENT — Tender No: NRS/PROC/[YEAR]/[XXX]

// SECTION 1 — INVITATION TO TENDER
// SECTION 2 — INSTRUCTIONS TO BIDDERS
// SECTION 3 — BID DATA SHEET
// SECTION 4 — SCOPE OF [SUPPLY/WORK/SERVICES]
// SECTION 5 — ELIGIBILITY & QUALIFICATION CRITERIA
// SECTION 6 — EVALUATION CRITERIA & WEIGHTINGS
// SECTION 7 — SPECIAL CONDITIONS OF CONTRACT

// Always produce the COMPLETE document — never truncate.

// START: Ask for the tender title.`,
//     openingQuestion: "📄 **SBD Drafter** \n\nI'll draft a complete Standard Bidding Document for your tender in BPP-compliant format.\n\nWhat is the **tender title** or description?",
//     chips: ["Supply of goods", "Office furniture / equipment", "Construction / renovation", "IT infrastructure", "Professional services", "Security services"],
//   },
//   {
//     id: "evaluation",
//     icon: "⚖️",
//     label: "Bid Evaluator",
//     shortLabel: "Evaluation",
//     stage: "Stage 6",
//     color: "#ea580c",
//     description: "Score, rank, and produce evaluation reports",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Tender Evaluation Assistant.
// Help the NRS Tender Evaluation Committee conduct a fair, PPA 2007-compliant bid evaluation and produce a formal report.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. What is the tender for?
// 2. Evaluation criteria and weightings (default: Price 40%, Technical 35%, Experience 25%)
// 3. How many bidders submitted?
// 4. For EACH bidder (ask one by one): name, bid price ₦, technical compliance, experience, any disqualification issues

// WHAT YOU PRODUCE:
// NRS TENDER EVALUATION REPORT

// PART A — PRELIMINARY / MANDATORY CHECKS [Pass/Fail table]
// PART B — DETAILED EVALUATION SCORING [full scoring matrix]
// PART C — SUMMARY RANKING TABLE [Rank | Bidder | Score | Price | Status]
// PART D — RECOMMENDATION [recommended bidder with justification]
// PART E — NEXT STEPS [BPP/FEC no-objection if required]

// Committee Signature Block

// START: Ask what the tender is for.`,
//     openingQuestion: "⚖️ **Bid Evaluation Assistant** \n\nI'll guide you through a structured bid evaluation and produce a formal Tender Evaluation Report.\n\n**What is this tender for?** Give me the title or description.",
//     chips: ["I have 2 bidders", "I have 3–5 bidders", "Use standard criteria (40/35/25)", "Price-only evaluation"],
//   },
//   {
//     id: "award",
//     icon: "🏆",
//     label: "Award Letter",
//     shortLabel: "Award",
//     stage: "Stage 7",
//     color: "#0d9488",
//     description: "Generate formal contract award letters",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Contract Award Letter Generator.
// Draft a complete, formal contract award letter from NRS to the successful contractor/vendor.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. Full name of the contractor / company
// 2. Contractor's address (if known)
// 3. Contract description
// 4. Contract value (₦)?
// 5. Contract reference number (or generate one)
// 6. Number of working days/weeks for delivery or completion
// 7. Performance bond percentage (default 10%)
// 8. Name of the signing officer
// 9. Date of letter

// WHAT YOU PRODUCE:
// Complete, formal AWARD LETTER on NRS letterhead:

// NIGERIA REVENUE SERVICE
// Revenue House, 15 Sokode Crescent, Wuse Zone 5, Abuja

// RE: AWARD OF CONTRACT FOR [CONTRACT DESCRIPTION]

// [Full formal body with all terms, contract sum, duration, performance bond, mobilisation, payment terms, next steps]

// Always produce the COMPLETE letter. Never truncate.

// START: Ask for the contractor's name.`,
//     openingQuestion: "🏆 **Contract Award Letter** \n\nI'll draft a formal letter of award to the successful contractor.\n\nWhat is the **full name of the contractor or company** being awarded?",
//     chips: ["Include mobilisation advance", "Add liquidated damages clause", "Performance bond 10%", "International contractor"],
//   },
//   {
//     id: "risk",
//     icon: "🔍",
//     label: "Risk Register",
//     shortLabel: "Risk",
//     stage: "Stage 8",
//     color: "#dc2626",
//     description: "Project monitoring risk register",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Procurement Risk Analyst.
// Create a comprehensive procurement risk register for active NRS contracts/projects.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. Project / contract name and brief description
// 2. Contractor name
// 3. Category: Goods, Works, or Services?
// 4. Contract value (₦)?
// 5. Contract duration and current status (% complete, weeks remaining)?
// 6. Any issues already observed?
// 7. Location (if works/construction)?

// WHAT YOU PRODUCE:
// NRS PROJECT RISK REGISTER

// RISK REGISTER TABLE:
// Risk ID | Risk Description | Category | Likelihood (H/M/L) | Impact (H/M/L) | Risk Rating | Mitigation Strategy | Owner | Review Date

// [8-12 relevant, specific risks]

// KPIs FOR MONITORING: [5 specific, measurable KPIs]
// ESCALATION TRIGGERS: [5 red-flag scenarios]
// OVERALL PROJECT RISK RATING: [LOW / MEDIUM / HIGH / CRITICAL]
// SUMMARY RECOMMENDATION: [specific advice]

// Risk rating matrix: H×H=Critical(9), H×M=High(6), M×M=Medium(4), L×H=Medium(3), L×L=Very Low(1)

// START: Ask for the project name.`,
//     openingQuestion: "🔍 **Risk Register** \n\nI'll build a detailed risk register to support project monitoring.\n\nWhat is the **project or contract name**?",
//     chips: ["Construction project", "IT implementation", "Supply contract", "Consultancy project", "Has active issues"],
//   },
//   {
//     id: "payment",
//     icon: "💳",
//     label: "Payment Check",
//     shortLabel: "Payment",
//     stage: "Stage 9",
//     color: "#2563eb",
//     description: "Payment documentation readiness check",
//     systemPrompt: FIRS_FOUNDATION + `

// YOUR ROLE: Payment Readiness Verification Officer.
// Verify that all documentation is in order before NRS processes a contractor payment.

// WHAT YOU NEED TO GATHER (one at a time):
// 1. Contractor name
// 2. Contract description and reference
// 3. Invoice number and amount (₦)?
// 4. Is the Job Completion Certificate (JCC) / Delivery Note issued and signed?
// 5. Does the invoice amount match the contract price?
// 6. Has the contractor submitted a valid Tax Clearance Certificate (TCC)?
// 7. Is Withholding Tax (WHT) — 5% for companies — factored in?
// 8. Is VAT (7.5%) correct and stated separately?
// 9. Any retention deductions applicable?
// 10. Any outstanding contract conditions not yet met?

// WHAT YOU PRODUCE:
// NRS PAYMENT VERIFICATION REPORT

// PAYMENT READINESS STATUS: ✅ READY TO PAY / ⚠️ CONDITIONAL / ❌ HOLD / 🚫 REJECT

// DOCUMENT CHECKLIST: [Item | Required | Status | Notes]
// PAYMENT COMPUTATION: [Invoice → less WHT → less Retention → Net Payable]
// COMPLIANCE FLAGS: [NRS/IPPIS/GIFMIS requirements]
// RECOMMENDED ACTION: [specific next steps]

// START: Ask for the contractor name.`,
//     openingQuestion: "💳 **Payment Readiness Check** \n\nI'll verify that all documentation is complete before payment is processed.\n\nWhat is the **contractor's name**?",
//     chips: ["JCC not yet issued", "Invoice amount mismatch", "TCC expired", "Retention deduction applies", "Final payment (retention release)"],
//   },
// ];

// const TOOL_MAP = new Map<ToolId, ToolDef>(TOOLS.map(t => [t.id, t]));


// // ─────────────────────────────────────────────────────────────────────────
// // STATUS QUERY  —  detect intent + system prompt
// // ─────────────────────────────────────────────────────────────────────────
 
// const STATUS_QUERIES: StatusQuery[] = [
//   { entityType: "requisition",  label: "Requisition",       icon: "📝", refPrompt: "Please provide the **Requisition Reference Number** (e.g. NRS/ICT/REQ/2025/001):" },
//   { entityType: "annual_plan",  label: "Annual Plan",        icon: "📅", refPrompt: "Please provide the **Annual Procurement Plan ID or fiscal year** (e.g. NRS/APP/2025):" },
//   { entityType: "procurement",  label: "Procurement",        icon: "🛒", refPrompt: "Please provide the **Procurement Reference Number** (e.g. NRS/PROC/2025/042):" },
//   { entityType: "vendor",       label: "Vendor Registration",icon: "🏢", refPrompt: "Please provide the **Vendor Registration ID or company name** (e.g. VEN/NRS/2025/019):" },
//   { entityType: "project",      label: "Project",            icon: "🔍", refPrompt: "Please provide the **Project or Contract Reference Number** (e.g. NRS/PROJ/2025/007):" },
//   { entityType: "contract",     label: "Contract",           icon: "📋", refPrompt: "Please provide the **Contract Reference Number** (e.g. NRS/CON/2025/033):" },
//   { entityType: "payment",      label: "Payment",            icon: "💳", refPrompt: "Please provide the **Payment Reference Number or Invoice Number** (e.g. NRS/PAY/2025/088):" },
//   { entityType: "bid",          label: "Bid / Tender",       icon: "⚖️", refPrompt: "Please provide the **Tender Reference Number** (e.g. NRS/PROC/TENDER/2025/012):" },
//   { entityType: "award",        label: "Contract Award",     icon: "🏆", refPrompt: "Please provide the **Award Reference Number** (e.g. NRS/AWARD/2025/005):" },
//   { entityType: "tender",       label: "Tender",             icon: "📄", refPrompt: "Please provide the **Tender Reference Number** (e.g. NRS/PROC/TENDER/2025/012):" },
// ];
 
// const STATUS_PATTERNS: Array<{ pattern: RegExp; entityType: StatusEntityType }> = [
//   { pattern: /status.{0,30}(requisition|req)/i,        entityType: "requisition" },
//   { pattern: /status.{0,30}(annual\s*plan|app)/i,      entityType: "annual_plan" },
//   { pattern: /status.{0,30}(procurement)/i,            entityType: "procurement" },
//   { pattern: /status.{0,30}(vendor|supplier|registr)/i,  entityType: "vendor" },
//   { pattern: /status.{0,30}(project)/i,                entityType: "project" },
//   { pattern: /status.{0,30}(contract)/i,               entityType: "contract" },
//   { pattern: /status.{0,30}(payment|invoice|pay)/i,    entityType: "payment" },
//   { pattern: /status.{0,30}(bid|tender)/i,           entityType: "bid" },
//   { pattern: /status.{0,30}(award)/i,                  entityType: "award" },
//   // Also match "track my ...", "check my ...", "where is my ..."
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(requisition|req)/i,   entityType: "requisition" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(annual\s*plan|app)/i, entityType: "annual_plan" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(procurement)/i,       entityType: "procurement" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(vendor|supplier)/i,     entityType: "vendor" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(project)/i,           entityType: "project" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(contract)/i,          entityType: "contract" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(payment|invoice)/i,     entityType: "payment" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(bid|tender)/i,      entityType: "bid" },
//   { pattern: /(track|check|where\s*is|follow\s*up).{0,20}(award)/i,             entityType: "award" },
// ];
 
// function detectStatusIntent(text: string): StatusQuery | null {
//   for (const { pattern, entityType } of STATUS_PATTERNS) {
//     if (pattern.test(text)) {
//       return STATUS_QUERIES.find(q => q.entityType === entityType) ?? null;
//     }
//   }
//   return null;
// }
 
// const STATUS_SYSTEM_PROMPT = FIRS_FOUNDATION + `
 
// YOUR ROLE IN THIS MODE: Application Status Checker.
// The user wants to check the status of a specific NRS procurement application.
 
// IMPORTANT — YOU ARE SIMULATING A STATUS LOOKUP:
// Since you do not have direct database access, you will SIMULATE a realistic, plausible status response
// based on the reference number pattern and entity type provided. Make the simulation feel real and useful.
 
// WHAT YOU PRODUCE when given a Ref/ID — a STATUS CARD in this exact format:
 
// ---
// 📋 **[ENTITY TYPE] STATUS REPORT**
// 🔖 **Reference:** [ref number]
// 📅 **Date Checked:** [today's date]
 
// **CURRENT STATUS:** [One of: ⏳ Pending Review | 🔄 In Progress | ✅ Approved | ❌ Rejected | 🚫 On Hold | 📤 Submitted | 🏁 Completed | 💰 Awaiting Payment]
 
// **STAGE:** [Current procurement stage name — Stage 0–10 or specific stage name]
// **LAST ACTION:** [Most recent action taken, e.g. "Submitted to Director of Procurement for review"]
// **LAST UPDATED:** [Realistic recent date]
// **ASSIGNED TO:** [Officer/Unit responsible, e.g. "Director of Procurement, NRS"]
 
// **TIMELINE:**
// ✅ [Stage name] — [date] — Completed
// ✅ [Stage name] — [date] — Completed
// 🔄 [Current stage] — [date] — In Progress
// ⏳ [Next stage] — Pending
// ⏳ [Future stage] — Pending
 
// **NEXT ACTION REQUIRED:**
// [Specific, actionable next step — who needs to do what]
 
// **ESTIMATED COMPLETION:** [Realistic estimate]
 
// **NOTES / FLAGS:**
// [Any compliance notes, missing documents, or flags relevant to this ref number]
// ---
 
// After producing the status card, always ask:
// "Would you like me to help you with anything related to this [entity]? For example, Check another status, I can draft a follow-up memo, check approval routes, or assist with the next stage."
 
// RULES:
// - Base the simulated stage and status on the ref number format and entity type
// - Make dates realistic (within the last 6 months)
// - Keep status plausible — not everything is approved, some should be pending or in progress
// - If the ref number format looks invalid or unrecognisable, say so clearly and ask for the correct format
// `;

// // ─────────────────────────────────────────────────────────────────────────
// // TOOL SWITCH DETECTION
// // ─────────────────────────────────────────────────────────────────────────

// const SWITCH_PATTERNS: Array<{ pattern: RegExp; toolId: ToolId }> = [
//   { pattern: /annual\s*plan|annual\s*planner|stage\s*0|procurement\s*plan\s*prep/i, toolId: "annual" },
//   { pattern: /requisition|memo|stage\s*1/i, toolId: "requisition" },
//   { pattern: /approv(al|e)\s*(route|routing|chain|advisor)|stage\s*2/i, toolId: "approval" },
//   { pattern: /validat(e|or|ion)|plan\s*check|stage\s*3/i, toolId: "validator" },
//   { pattern: /method\s*advis|procurement\s*method|stage\s*4/i, toolId: "method" },
//   { pattern: /sbd|standard\s*bidding|tender\s*doc|stage\s*5/i, toolId: "sbd" },
//   { pattern: /evaluat(e|ion|or)|bid\s*eval|stage\s*6/i, toolId: "evaluation" },
//   { pattern: /award\s*letter|contract\s*award|stage\s*7/i, toolId: "award" },
//   { pattern: /risk\s*register|project\s*monitor|stage\s*8/i, toolId: "risk" },
//   { pattern: /payment\s*check|payment\s*ready|stage\s*9/i, toolId: "payment" },
//   { pattern: /home|general|start\s*over|main\s*menu|help\s*me/i, toolId: "home" },
// ];

// function detectSwitch(text: string): ToolId | null {
//   const lower = text.toLowerCase();
//   const switchPhrases = ["switch to", "go to", "open", "use the", "help me with", "i need", "take me to", "back to"];
//   const hasSwitchIntent = switchPhrases.some(p => lower.includes(p));
//   //if (!hasSwitchIntent && !lower.includes("stage")) return null;
//   if (!hasSwitchIntent) {
//    for (const { pattern, toolId } of SWITCH_PATTERNS) {
//       if (pattern.test(text)) return toolId;
//    }
//    return null;
// }
//   for (const { pattern, toolId } of SWITCH_PATTERNS) {
//     if (pattern.test(text)) return toolId;
//   }
//   return null;
// }

// const END_SESSION_PATTERNS = /\b(end session|close chat|close|done for now|that'?s? all|goodbye|bye|thank you|thanks|no more|finish|exit)\b/i;

// // ─────────────────────────────────────────────────────────────────────────
// // UTILITIES
// // ─────────────────────────────────────────────────────────────────────────

// function uid(): string {
//   return Math.random().toString(36).slice(2, 10);
// }

// function formatTime(d: Date): string {
//   return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
// }

// function renderMarkdown(text: string): React.ReactNode[] {
//   return text.split("\n").map((line, li) => {
//     const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
//       part.startsWith("**") && part.endsWith("**")
//         ? <strong key={pi}>{part.slice(2, -2)}</strong>
//         : <React.Fragment key={pi}>{part}</React.Fragment>
//     );
//     return <React.Fragment key={li}>{parts}{li < text.split("\n").length - 1 && <br />}</React.Fragment>;
//   });
// }

// // ─────────────────────────────────────────────────────────────────────────
// // COLOUR TOKENS
// // ─────────────────────────────────────────────────────────────────────────

// const C = {
//   primary:   "#1d4ed8",
//   primaryDk: "#1e3a8a",
//   surface:   "#ffffff",
//   bg:        "#f8fafc",
//   border:    "#e2e8f0",
//   textMain:  "#0f172a",
//   textSub:   "#64748b",
//   textMuted: "#94a3b8",
//   userBg:    "#1d4ed8",
//   botBg:     "#f1f5f9",
//   green:     "#10b981",
// };

// // ─────────────────────────────────────────────────────────────────────────
// // SUB-COMPONENTS
// // ─────────────────────────────────────────────────────────────────────────

// const TypingDots: React.FC = () => (
//   <div style={{ display:"flex", gap:4, padding:"10px 14px", background:C.botBg, borderRadius:"16px 16px 16px 4px", alignSelf:"flex-start", border:`1px solid ${C.border}` }}>
//     <style>{`@keyframes fDot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
//     {[0,160,320].map(d => (
//       <span key={d} style={{ width:6, height:6, borderRadius:"50%", background:C.textMuted, display:"block", animation:"fDot 1.2s infinite", animationDelay:`${d}ms` }} />
//     ))}
//   </div>
// );

// const BotAvatar: React.FC = () => (
//   <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.primary},#6366f1)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, color:"#fff", fontWeight:700, alignSelf:"flex-end", marginBottom:2 }}>
//     AI
//   </div>
// );

// interface BubbleProps {
//   msg: ChatMessage;
//   onChip: (c: string) => void;
//   onCopy: (id: string, text: string) => void;
//   showTime: boolean;
// }

// const Bubble: React.FC<BubbleProps> = ({ msg, onChip, onCopy, showTime }) => {
//   const isUser   = msg.role === "user";
//   const isSystem = msg.role === "system";

//   if (isSystem) {
//     return (
//       <div style={{ textAlign:"center", margin:"4px 0" }}>
//         <span style={{ fontSize:11, color:C.textMuted, background:C.bg, padding:"2px 10px", borderRadius:999, border:`1px solid ${C.border}` }}>
//           {msg.text}
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems: isUser ? "flex-end" : "flex-start", gap:4 }}>
//       <div style={{ display:"flex", alignItems:"flex-end", gap:6, flexDirection: isUser ? "row-reverse" : "row" }}>
//         {!isUser && <BotAvatar />}
//         <div style={{ maxWidth:"78%", display:"flex", flexDirection:"column", gap:4 }}>
//           <div style={{
//             padding:"9px 13px",
//             borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
//             background: isUser ? C.userBg : C.botBg,
//             color: isUser ? "#fff" : C.textMain,
//             fontSize:13, lineHeight:1.6,
//             border: isUser ? "none" : `1px solid ${C.border}`,
//             boxShadow:"0 1px 2px rgba(0,0,0,.06)",
//             wordBreak:"break-word", position:"relative",
//           }}>
//             {isUser ? msg.text : renderMarkdown(msg.text)}
//             {!isUser && (
//               <button
//                 onClick={() => onCopy(msg.id, msg.text)}
//                 title={msg.copied ? "Copied!" : "Copy message"}
//                 // className={msg.copied ? "nrs-copy nrs-copy-flash" : "nrs-copy"}
//                 className={`${msg.copied ? "nrs-copy nrs-copy-flash" : "nrs-copy"} ${
//                           msg.chips?.some(c => c.startsWith("✓"))
//                             ? "bg-green-100 text-green-700 border-green-300"
//                             : ""
//                         }`}
//                 style={{
//                   position:"absolute", top:6, right:6,
//                   background: msg.copied ? "#dcfce7" : "transparent",
//                   border:"none", cursor:"pointer",
//                   opacity: msg.copied ? 1 : 0.35,
//                   fontSize:11,
//                   color: msg.copied ? "#16a34a" : C.textSub,
//                   padding:"2px 4px", lineHeight:1,
//                   transition:"opacity .15s, background .15s, color .15s",
//                   borderRadius:4,
//                 }}
//               >
//                 {msg.copied ? "✓ Copied" : "Copy message"}
//               </button>
//             )}
//           </div>
//           {!isUser && msg.chips && msg.chips.length > 0 && (
//             <div style={{ display:"flex", flexWrap:"wrap", gap:5, paddingLeft:2 }}>
//               {msg.chips.map(c => (
//                 <button key={c} onClick={() => onChip(c)}
//                   // className="nrs-chip"
//                   className={`nrs-chip ${
//                           c.startsWith("✓")
//                             ? "bg-green-100 text-green-700 border-green-300"
//                             : ""
//                         }`}
//                   style={{
//                     fontSize:11, padding:"4px 10px", borderRadius:999,
//                     border:`1px solid #bfdbfe`, background:"#eff6ff",
//                     color:C.primary, cursor:"pointer", fontWeight:500,
//                     transition:"background .15s, border-color .15s, transform .1s, box-shadow .15s",
//                   }}>
//                   {c}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {showTime && (
//         <span style={{ fontSize:10, color:C.textMuted, paddingLeft: isUser ? 0 : 34, paddingRight: isUser ? 4 : 0 }}>
//           {formatTime(msg.timestamp)}
//         </span>
//       )}
//     </div>
//   );
// };

// // ── Tool switcher pill row ──────────────────────────────────────────────
// interface ToolBarProps { active: ToolId; onSwitch: (id: ToolId) => void; }

// const ToolBar: React.FC<ToolBarProps> = ({ active, onSwitch }) => (
//   <div className="nrs-tb" style={{ display:"flex", gap:4, padding:"6px 10px", overflowX:"auto", borderBottom:`1px solid ${C.border}`, scrollbarWidth:"none", flexShrink:0 }}>
//     {TOOLS.map(t => {
//       const isActive = t.id === active;
//       return (
//         <button
//           key={t.id}
//           onClick={() => onSwitch(t.id)}
//           title={`${t.label} — ${t.description}`}
//           style={{
//             display:"flex", alignItems:"center", gap:4,
//             padding: isActive ? "4px 10px" : "4px 7px",
//             borderRadius:999,
//             border: isActive ? `1.5px solid ${C.primary}` : `1.5px solid ${C.border}`,
//             background: isActive ? "#eff6ff" : "transparent",
//             color: isActive ? C.primary : C.textSub,
//             fontSize:11, fontWeight: isActive ? 700 : 500,
//             cursor:"pointer", flexShrink:0, transition:"all .15s",
//           }}
//         >
//           <span style={{ fontSize:13 }}>{t.icon}</span>
//           {isActive && <span>{t.shortLabel}</span>}
//         </button>
//       );
//     })}
//   </div>
// );

// // ── End session confirmation banner ────────────────────────────────────
// interface EndSessionBannerProps { onConfirm: () => void; onCancel: () => void; }

// const EndSessionBanner: React.FC<EndSessionBannerProps> = ({ onConfirm, onCancel }) => (
//   <div style={{ margin:"0 12px 8px", padding:"12px 14px", background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:10, flexShrink:0 }}>
//     <p style={{ margin:"0 0 4px", fontSize:12, color:"#92400e", fontWeight:700 }}>End this session?</p>
//     <p style={{ margin:"0 0 10px", fontSize:11, color:"#78350f", lineHeight:1.4 }}>The conversation will be cleared and the chat will close.</p>
//     <div style={{ display:"flex", gap:8 }}>
//       <button
//         onClick={onConfirm}
//         style={{ flex:1, padding:"6px 0", borderRadius:8, border:"none", background:"#d97706", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}
//       >
//         Yes, end session
//       </button>
//       <button
//         onClick={onCancel}
//         style={{ flex:1, padding:"6px 0", borderRadius:8, border:`1px solid #fcd34d`, background:"#fff", color:"#92400e", fontSize:12, fontWeight:600, cursor:"pointer" }}
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────

// const FIRSAIChatPane: React.FC = () => {
//   const [open, setOpen]                     = useState<boolean>(false);
//   const [activeTool, setActiveTool]         = useState<ToolId>("home");
//   const [messages, setMessages]             = useState<ChatMessage[]>([]);
//   const [input, setInput]                   = useState<string>("");
//   const [loading, setLoading]               = useState<boolean>(false);
//   const [initialized, setInitialized]       = useState<boolean>(false);
//   const [showEndConfirm, setShowEndConfirm] = useState<boolean>(false);
//   const [showToolSwitcher, setShowToolSwitcher] = useState<boolean>(false);
//   const [tooltipVisible, setTooltipVisible] = useState<boolean>(true);
//   const [unread, setUnread]                 = useState<boolean>(false);

//   const [pendingStatus, setPendingStatus]   = useState<StatusQuery | null>(null);

//   const endRef   = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.style.height = "auto";
//       inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 80) + "px";
//     }
//   }, [input]);

//   // Init greeting on first open
//   useEffect(() => {
//     if (open && !initialized) {
//       const t = TOOL_MAP.get("home")!;
//       setMessages([{ id: uid(), role: "model", text: t.openingQuestion, chips: t.chips, toolId: "home", timestamp: new Date() }]);
//       setInitialized(true);
//     }
//     if (open) setUnread(false);
//   }, [open, initialized]);

//   // ── Beep (Web Audio API — no external file) ──────────────────────────
//   const playBeep = useCallback((): void => {
//     try {
//       const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
//       const ctx  = new AudioCtx();
//       const osc  = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.type = "sine";
//       osc.frequency.setValueAtTime(880, ctx.currentTime);
//       osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
//       gain.gain.setValueAtTime(0.18, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
//       osc.start(ctx.currentTime);
//       osc.stop(ctx.currentTime + 0.22);
//     } catch { /* silently ignore if AudioContext blocked */ }
//   }, []);

//   // Play beep every 60 s while pane is closed
//   useEffect(() => {
//     if (open) return;
//     playBeep();
//     const id = setInterval(playBeep, 60000);
//     return () => clearInterval(id);
//   }, [open, playBeep]);

//   // Build OpenRouter message history (last 16 turns, no system dividers)
//   const buildHistory = useCallback((msgs: ChatMessage[]): ORMessage[] => {
//     return msgs
//       .filter(m => m.role !== "system")
//       .slice(-30)
//       .map(m => ({
//         role: (m.role === "model" ? "assistant" : "user") as "user" | "assistant",
//         content: m.text,
//       }));
//   }, []);

//   // ── addMsg — clears chips on all prior messages, appends new one ─────
//   const addMsg = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">): ChatMessage => {
//     const full: ChatMessage = { ...msg, id: uid(), timestamp: new Date() };
//     setMessages(prev => [...prev.map(m => ({ ...m, chips: undefined })), full]);
//     return full;
//   }, []);

//   // ── Switch tool ───────────────────────────────────────────────────────
//   const switchTool = useCallback((toolId: ToolId, silent?: boolean): void => {
//     if (toolId === activeTool && !silent) return;
//     const t = TOOL_MAP.get(toolId)!;
//     setActiveTool(toolId);
//     if (!silent) {
//       const divider: ChatMessage  = { id: uid(), role: "system", text: `Switched to ${t.label} — ${t.description}`, timestamp: new Date() };
//       const greeting: ChatMessage = { id: uid(), role: "model",  text: t.openingQuestion, chips: t.chips, toolId, timestamp: new Date() };
//       setMessages(prev => [...prev.map(m => ({ ...m, chips: undefined })), divider, greeting]);
//     }
//   }, [activeTool]);
  

//   // ── End session ───────────────────────────────────────────────────────
//   const endSession = useCallback((): void => {
//     setMessages([]);
//     setActiveTool("home");
//     setInitialized(false);
//     setShowEndConfirm(false);
//     setOpen(false);
//     setTooltipVisible(true);
//   }, []);

 
//   // ── Copy message to clipboard ─────────────────────────────────────────
//   // const handleCopy = useCallback((id: string, text: string): void => {
//   //   // Flash the UI immediately — don't wait on clipboard (blocked in some SPFx iframes)
//   //   const flash = (): void => {
//   //     setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
//   //     setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
//   //   };
 
//   //   // Try modern clipboard API first
//   //   if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
//   //     navigator.clipboard.writeText(text).then(flash).catch(() => {
//   //       // Fallback: execCommand (works in SPFx iframes without HTTPS clipboard perms)
//   //       const ta = document.createElement("textarea");
//   //       ta.value = text;
//   //       ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
//   //       document.body.appendChild(ta);
//   //       ta.focus();
//   //       ta.select();
//   //       try { document.execCommand("copy"); } catch { /* best-effort */ }
//   //       document.body.removeChild(ta);
//   //       flash();
//   //     });
//   //   } else {
//   //     // execCommand fallback for environments without clipboard API
//   //     const ta = document.createElement("textarea");
//   //     ta.value = text;
//   //     ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
//   //     document.body.appendChild(ta);
//   //     ta.focus();
//   //     ta.select();
//   //     try { document.execCommand("copy"); } catch { /* best-effort */ }
//   //     document.body.removeChild(ta);
//   //     flash();
//   //   }
//   // }, []);


//     const handleCopy = useCallback((id: string, text: string): void => {
//       void navigator.clipboard.writeText(text).then(() => {
//         setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
//         setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
//       });
//     }, []);

//   // ── Send message ──────────────────────────────────────────────────────
//   const sendMessage = useCallback(async (text: string): Promise<void> => {
//     const trimmed = text.trim();
//     if (!trimmed || loading) return;
//     setInput("");

//     // End-session intent
//     if (END_SESSION_PATTERNS.test(trimmed)) {
//       addMsg({ role: "user", text: trimmed });
//       setShowEndConfirm(true);
//       return;
//     }

//     // ── Status lookup: step 1 — detect status intent, ask for ref ────────
//     const statusIntent = detectStatusIntent(trimmed);
//     if (statusIntent) {
//       addMsg({ role: "user", text: trimmed });
//       setPendingStatus(statusIntent);
//       addMsg({
//         role: "model",
//         text: `${statusIntent.icon} **${statusIntent.label} Status Lookup**
 
//       ${statusIntent.refPrompt}`,
//         chips: [],
//       });
//       return;
//     }

//     // ── Status lookup: step 2 — user has provided a ref/ID ─────────────
//     if (pendingStatus) {
//       const sq = pendingStatus;
//       setPendingStatus(null);
//       addMsg({ role: "user", text: trimmed });
//       setLoading(true);
//       try {
//         const prompt = `The user is looking up the status of a ${sq.label} with reference/ID: "${trimmed}". ${STATUS_SYSTEM_PROMPT}`;
//         const history = buildHistory([...messages, { id: "", role: "user" as const, text: trimmed, timestamp: new Date() }]);
//         const reply   = await callAI(prompt, history);
//         addMsg({ role: "model", text: reply, chips: ["Check another status", "Draft follow-up memo", "Switch tool", "Start a new task"] });
//         if (!open) setUnread(true);
//       } catch (e) {
//         addMsg({ role: "model", text: "⚠️ " + (e instanceof Error ? e.message : "Something went wrong."), chips: ["Try again"] });
//       }
//       setLoading(false);
//       return;
//     }


//     // Tool-switch intent
//     const switchTarget = detectSwitch(trimmed);
//     addMsg({ role: "user", text: trimmed });

//     if (switchTarget && switchTarget !== activeTool) {
//       switchTool(switchTarget);
//       return;
//     }

//     setLoading(true);
//     try {
//       const currentTool = TOOL_MAP.get(activeTool)!;
//       const snapshot    = [...messages, { id: "", role: "user" as const, text: trimmed, timestamp: new Date(), chips: undefined }];
//       const history     = buildHistory(snapshot);
//       const reply       = await callAI(currentTool.systemPrompt, history);
//       const chips: string[] = reply.length > 500
//         ? ["Refine this output", "Copy this", "Start a new task", "Switch tool"]
//         : currentTool.chips.slice(0, 4);
//       addMsg({ role: "model", text: reply, chips, toolId: currentTool.id });
//       if (!open) setUnread(true);
//     } catch (e) {
//       addMsg({
//         role: "model",
//         text: "⚠️ " + (e instanceof Error ? e.message : "Something went wrong. Please try again."),
//         chips: ["Try again", "Switch tool"],
//       });
//       if (!open) setUnread(true);
//     }
//     setLoading(false);
//   }, [loading, activeTool, messages, buildHistory, addMsg, switchTool, open]);

//   // ── Chip click ────────────────────────────────────────────────────────
//   const handleChip = useCallback((chip: string): void => {
//     const lower = chip.toLowerCase();
//     // if (lower === "copy this" || lower === "copy output") {
//     //   const last = [...messages].reverse().find(m => m.role === "model");
//     //   if (last) handleCopy(last.id, last.text);
//     //   return;
//     // }

//     if (lower === "copy this" || lower === "copy output") {
//       const last = messages.slice().reverse().find(m => m.role === "model");

//       if (!last) return;

//       handleCopy(last.id, last.text);

//       // change ONLY the clicked chip
//       setMessages(prev =>
//         prev.map(msg => {
//           if (msg.id !== last.id || !msg.chips) return msg;

//           return {
//             ...msg,
//             chips: msg.chips.map(c =>
//               c.toLowerCase() === "copy this"
//                 ? "✓ Copied to clipboard"
//                 : c
//             )
//           };
//         })
//       );

//       // revert after 5 seconds
//       setTimeout(() => {
//         setMessages(prev =>
//           prev.map(msg => {
//             if (msg.id !== last.id || !msg.chips) return msg;

//             return {
//               ...msg,
//               chips: msg.chips.map(c =>
//                 c === "✓ Copied to clipboard"
//                   ? "Copy this"
//                   : c
//               )
//             };
//           })
//         );
//       }, 5000);

//       return;
//     }

//     if (lower === "switch tool" || lower === "main menu") { setShowToolSwitcher(true); return; }
//     if (lower === "start a new task" || lower === "start over") { switchTool("home"); return; }
//     if (lower === "end session" || lower === "close") { setShowEndConfirm(true); return; }
//     if (lower === "check another status") { void sendMessage("I want to check a status"); return; }
//     const toolSwitch = detectSwitch(chip);
//     if (toolSwitch && toolSwitch !== activeTool) { switchTool(toolSwitch); return; }
//     void sendMessage(chip);
//   }, [messages, activeTool, handleCopy, sendMessage, switchTool]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       void sendMessage(input);
//     }
//   };

//   const currentTool = TOOL_MAP.get(activeTool)!;
//   const canSend     = input.trim().length > 0 && !loading;

//   // ── Render ────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ═══ GLOBAL STYLES + KEYFRAMES ══════════════════════════════════ */}
//       <style>{`
//         .nrs-pane *::-webkit-scrollbar          { width: 3px; }
//         .nrs-pane *::-webkit-scrollbar-thumb    { background: #cbd5e1; border-radius: 99px; }
//         .nrs-pane *::-webkit-scrollbar-track    { background: transparent; }
//         .nrs-tb::-webkit-scrollbar              { display: none; }
//         /* Send button */
//         .nrs-send:hover:not(:disabled)          { background: #1e40af !important; }
//         /* Tooltip quick-picks */
//         .nrs-qchip:hover                        { background: rgba(255,255,255,.22) !important; }
//         /* Message chips */
//         .nrs-chip:hover                         { background: #dbeafe !important; border-color: #93c5fd !important; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(29,78,216,.15); }
//         .nrs-chip:active                        { transform: translateY(0); }
//         /* Copy button */
//         .nrs-copy:hover                         { opacity: 1 !important; background: #f0fdf4 !important; border-radius: 4px; }
//         .nrs-copy-flash                         { background: #dcfce7 !important; border-radius: 4px; }
//         /* Tool switcher modal backdrop */
//         .nrs-switcher-backdrop                  { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: nrsFadeIn .15s ease; }
//         .nrs-switcher-item:hover                { background: #eff6ff !important; border-color: #93c5fd !important; }
//         .nrs-switcher-item:active               { background: #dbeafe !important; }
//         @keyframes nrsFadeIn { from { opacity:0; } to { opacity:1; } }
//         @keyframes nrsPopIn  { from { opacity:0; transform: scale(.95) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
 
//         /* FAB bounce (closed only) */
//         @keyframes nrsBounce {
//           0%, 60%, 100% { transform: translateY(0);     }
//           20%           { transform: translateY(-10px); }
//           40%           { transform: translateY(-5px);  }
//         }
//         /* Pulse ring */
//         @keyframes nrsRing {
//           0%   { transform: scale(1);   opacity: .65; }
//           100% { transform: scale(2.4); opacity: 0;   }
//         }
//         /* Beep ripple on FAB */
//         @keyframes nrsBeep {
//           0%,88%,100% { box-shadow: 0 6px 24px rgba(29,78,216,.55); }
//           91%         { box-shadow: 0 6px 24px rgba(29,78,216,.55), 0 0 0 10px rgba(99,102,241,.3); }
//           95%         { box-shadow: 0 6px 24px rgba(29,78,216,.55), 0 0 0 20px rgba(99,102,241,.08); }
//         }
//         /* Tooltip slide-in */
//         @keyframes nrsSlide {
//           from { opacity: 0; transform: translateX(10px); }
//           to   { opacity: 1; transform: translateX(0);    }
//         }
 
//         /* Responsive — full-screen on small viewports */
//         @media (max-width: 500px) {
//           .nrs-pane-outer {
//             right: 0    !important;
//             bottom: 0   !important;
//             width: 100vw !important;
//             height: 92dvh !important;
//             border-radius: 16px 16px 0 0 !important;
//           }
//           .nrs-fab-col {
//             right: 16px !important;
//             bottom: 16px !important;
//           }
//         }
//       `}</style>

//       {/* ═══ FAB COLUMN (tooltip card + pulse ring + button) ════════════ */}
//       <div
//         className="nrs-fab-col"
//         style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}
//       >
//         {/* Tooltip / quick-pick card — shown when pane is closed */}
//         {!open && tooltipVisible && (
//           <div style={{
//             background:"#0f2b4a", borderRadius:16, padding:"14px 16px", width:248,
//             boxShadow:"0 8px 32px rgba(0,0,0,.3)", animation:"nrsSlide .28s ease",
//             position:"relative",
//           }}>
//             {/* Dismiss */}
//             <button
//               onClick={() => setTooltipVisible(false)}
//               aria-label="Dismiss tooltip"
//               style={{ position:"absolute", top:8, right:8, background:"transparent", border:"none", cursor:"pointer", color:"rgba(255,255,255,.45)", fontSize:14, lineHeight:1, padding:2 }}
//             >
//               ✕
//             </button>
//             <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:600, color:"#fff", lineHeight:1.45, paddingRight:18 }}>
//               👋 Hello! I'm your <strong>NRS AI</strong>.
//             </p>
//             <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
//               {[
//                 { id:"requisition" as ToolId, label:"📝  Write a Requisition Memo"   },
//                 { id:"approval"    as ToolId, label:"🔀  Check Approval Route"        },
//                 { id:"sbd"         as ToolId, label:"📄  Draft a Tender Document"     },
//                 { id:"evaluation"  as ToolId, label:"⚖️  Evaluate Bids"              },
//                 { id:"payment"     as ToolId, label:"💳  Payment Readiness Check"     },
//                 { id:"status"      as ToolId, label:"🏠  I want to check a status" },
//               ].map(opt => (
//                 <button
//                   key={opt.id}
//                   className="nrs-qchip"
//                   onClick={() => {
//                     setOpen(true);
//                     setTooltipVisible(false);
//                     setUnread(false);
//                     setTimeout(() => switchTool(opt.id, false), 80);
//                   }}
//                   style={{
//                     textAlign:"left", background:"rgba(255,255,255,.1)",
//                     border:"1.5px solid rgba(255,255,255,.18)", borderRadius:10,
//                     padding:"7px 12px", color:"#fff", fontSize:12, fontWeight:500,
//                     cursor:"pointer", transition:"background .15s",
//                   }}
//                 >
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//             {/* Caret pointing toward FAB */}
//             <div style={{ position:"absolute", bottom:-8, right:28, width:0, height:0, borderLeft:"8px solid transparent", borderRight:"8px solid transparent", borderTop:"8px solid #0f2b4a" }} />
//           </div>
//         )}

//         {/* FAB + pulse ring + label */}
//         <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
//           {/* Pulse ring (only when closed) */}
//           {!open && (
//             <span style={{
//               position:"absolute", inset:-5, borderRadius:"50%",
//               background:"rgba(99,102,241,.32)",
//               animation:"nrsRing 2.2s ease-out infinite",
//               pointerEvents:"none",
//             }} />
//           )}

//           <button
//             aria-label="Toggle NRS AI Assistant"
//             onClick={() => {
//               const next = !open;
//               setOpen(next);
//               setUnread(false);
//               if (next) setTooltipVisible(false);
//               else      setTooltipVisible(true);
//             }}
//             style={{
//               width:64, height:64, borderRadius:"50%", border:"none", cursor:"pointer",
//               background: open ? "#1e3a8a" : "linear-gradient(145deg,#1d4ed8,#4338ca)",
//               animation: open
//                 ? "nrsBeep 6s ease infinite"
//                 : "nrsBounce 2.4s ease infinite, nrsBeep 6s ease infinite",
//               display:"flex", alignItems:"center", justifyContent:"center",
//               position:"relative", transition:"background .2s", flexShrink:0,
//             }}
//           >
//             {open
//               ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
//               : <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//                     <path d="M12 2l2.4 7.2H22l-6.2 4.6 2.4 7.2L12 17l-6.2 4 2.4-7.2L2 9.2h7.6z"/>
//                 </svg>
//             }
//             {/* Unread badge */}
//             {!open && unread && (
//               <span style={{ position:"absolute", top:2, right:2, width:17, height:17, borderRadius:"50%", background:"#f59e0b", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff" }}>
//                 1
//               </span>
//             )}
//              {!open && (
//               <span style={{ position:"absolute", top:2, right:2, width:10, height:10, borderRadius:"50%", background:"#f59e0b", border:"2px solid #fff" }} />
//              )}
//           </button>

//           {/* "AI Assistant" label pill */}
//           {!open && (
//             <div style={{ background:"#0f2b4a", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:999, whiteSpace:"nowrap", border:"1.5px solid rgba(255,255,255,.2)", letterSpacing:"0.04em" }}>
//               AI Assistant
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ═══ CHAT PANE ══════════════════════════════════════════════════ */}
//       <div
//         className="nrs-pane nrs-pane-outer"
//         role="dialog"
//         aria-label="NRS AI Assistant"
//         aria-modal="false"
//         style={{
//           position:"fixed", bottom:108, right:24,
//           width:440, height:640,
//           background:C.surface, borderRadius:18,
//           boxShadow:"0 12px 48px rgba(0,0,0,.2), 0 2px 8px rgba(0,0,0,.1)",
//           border:`1px solid ${C.border}`,
//           display:"flex", flexDirection:"column",
//           zIndex:9998, overflow:"hidden",
//           opacity: open ? 1 : 0,
//           transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
//           pointerEvents: open ? "all" : "none",
//           transition:"opacity .22s ease, transform .22s ease",
//         }}
//       >
//         {/* ── Header ── */}
//         <div style={{ background:`linear-gradient(135deg,${C.primaryDk},#3730a3)`, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
//           <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
//             {currentTool.icon}
//           </div>
//           <div style={{ flex:1, minWidth:0 }}>
//             <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.2 }}>NRS AI</p>
//             <p style={{ margin:"2px 0 0", fontSize:11, color:"#bfdbfe", lineHeight:1 }}>{currentTool.label}</p>
//           </div>
//           <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//             <div style={{ display:"flex", alignItems:"center", gap:4 }}>
//               <span style={{ width:7, height:7, borderRadius:"50%", background: loading ? "#f59e0b" : C.green, transition:"background .3s" }} />
//               <span style={{ fontSize:10, color:"#bfdbfe" }}>{loading ? "Thinking…" : "Online"}</span>
//             </div>
//             <button
//               onClick={() => setShowEndConfirm(true)}
//               title="End session"
//               style={{ background:"rgba(255,255,255,.12)", border:"none", borderRadius:6, padding:"4px 8px", cursor:"pointer", color:"#bfdbfe", fontSize:10, fontWeight:600 }}
//             >
//               End
//             </button>
//           </div>
//         </div>

//         {/* ── Tool switcher bar (ToolBar component) ── */}
//         <ToolBar active={activeTool} onSwitch={switchTool} />

//         {/* ── Messages ── */}
//         <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
//           {messages.length === 0 && (
//             <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, opacity:.5 }}>
//               <span style={{ fontSize:32 }}>🤖</span>
//               <p style={{ fontSize:12, color:C.textSub, margin:0 }}>Starting up…</p>
//             </div>
//           )}
//           {messages.map((msg, i) => (
//             <Bubble
//               key={msg.id}
//               msg={msg}
//               onChip={handleChip}
//               onCopy={handleCopy}
//               showTime={i === messages.length - 1 || messages[i + 1]?.role !== msg.role}
//             />
//           ))}
//           {loading && (
//             <div style={{ display:"flex", alignItems:"flex-end", gap:6 }}>
//               <BotAvatar />
//               <TypingDots />
//             </div>
//           )}
//           <div ref={endRef} />
//         </div>


//         {/* ── Tool Switcher Modal ── */}
//         {showToolSwitcher && (
//           <div
//             className="nrs-switcher-backdrop"
//             onClick={() => setShowToolSwitcher(false)}
//           >
//             <div
//               onClick={e => e.stopPropagation()}
//               style={{
//                 background:"#fff", borderRadius:16, padding:"20px 0 12px",
//                 width:300, maxHeight:"70vh", overflowY:"auto",
//                 boxShadow:"0 20px 60px rgba(0,0,0,.25)",
//                 animation:"nrsPopIn .2s ease",
//               }}
//             >
//               <div style={{ padding:"0 16px 12px", borderBottom:`1px solid ${C.border}`, marginBottom:8 }}>
//                 <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.textMain }}>Switch Tool</p>
//                 <p style={{ margin:"2px 0 0", fontSize:11, color:C.textSub }}>Select a procurement tool to continue with</p>
//               </div>
//               {TOOLS.filter(t => t.id !== activeTool).map(t => (
//                 <button
//                   key={t.id}
//                   className="nrs-switcher-item"
//                   onClick={() => { switchTool(t.id); setShowToolSwitcher(false); }}
//                   style={{
//                     display:"flex", alignItems:"center", gap:12,
//                     width:"100%", textAlign:"left",
//                     padding:"10px 16px", border:"none",
//                     background:"transparent", cursor:"pointer",
//                     transition:"background .12s, border-color .12s",
//                     borderBottom:`1px solid ${C.border}`,
//                   }}
//                 >
//                   <span style={{ fontSize:20, flexShrink:0, width:28, textAlign:"center" }}>{t.icon}</span>
//                   <div style={{ minWidth:0 }}>
//                     <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.textMain }}>{t.label}</p>
//                     <p style={{ margin:"1px 0 0", fontSize:11, color:C.textSub }}>{t.stage} · {t.description}</p>
//                   </div>
//                 </button>
//               ))}
//               <div style={{ padding:"8px 16px 0" }}>
//                 <button
//                   onClick={() => setShowToolSwitcher(false)}
//                   className="hover:opacity-80 whitespace-nowrap bg-gray-400"
//                   style={{ width:"100%", padding:"8px", borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.textSub, fontSize:12, fontWeight:600, cursor:"pointer" }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── End session banner (EndSessionBanner component) ── */}
//         {showEndConfirm && (
//           <EndSessionBanner
//             onConfirm={endSession}
//             onCancel={() => setShowEndConfirm(false)}
//           />
//         )}

//         {/* ── Input area ── */}
//         <div style={{ padding:"8px 10px 10px", borderTop:`1px solid ${C.border}`, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
//           <p style={{ margin:0, fontSize:10, color:C.textMuted, paddingLeft:2 }}>
//             Press <kbd style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:3, padding:"0 3px", fontSize:10 }}>Enter</kbd> to send · Shift+Enter for new line
//           </p>
//           <div style={{ display:"flex", gap:6, alignItems:"flex-end" }}>
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               disabled={loading}
//               placeholder={loading ? "AI is thinking…" : "Type a message…"}
//               style={{
//                 flex:1, border:`1px solid ${canSend ? C.primary : C.border}`,
//                 borderRadius:10, padding:"8px 10px", fontSize:13, lineHeight:1.4,
//                 outline:"none", resize:"none", overflow:"hidden",
//                 fontFamily:"'Segoe UI', system-ui, sans-serif",
//                 background: loading ? C.bg : C.surface,
//                 color:C.textMain, transition:"border-color .15s", maxHeight:80,
//               }}
//             />
//             <button
//               className="nrs-send"
//               onClick={() => void sendMessage(input)}
//               disabled={!canSend}
//               aria-label="Send"
//               style={{
//                 width:38, height:38, borderRadius:10, border:"none",
//                 background: canSend ? C.primary : C.border,
//                 cursor: canSend ? "pointer" : "not-allowed",
//                 display:"flex", alignItems:"center", justifyContent:"center",
//                 flexShrink:0, transition:"background .15s",
//               }}
//             >
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={canSend ? "#fff" : C.textMuted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="22" y1="2" x2="11" y2="13"/>
//                 <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//               </svg>
//             </button>
//           </div>
//         </div>

//       </div>
//     </>
//   );
// };

// export default FIRSAIChatPane;