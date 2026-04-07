// ── LEAD STATUS LIFECYCLE ──
// Untouched → Attempted → Validated → Meeting Scheduled → Meeting Done → Proposal Sent → Converted
// "Not Qualified" can branch at any stage
export const leadStatuses = [
  'Untouched', 'Attempted', 'Validated', 'Meeting Scheduled',
  'Meeting Done', 'Proposal Sent', 'Converted', 'Not Qualified'
];

export const statusFlow = {
  'Untouched':          ['Attempted', 'Not Qualified'],
  'Attempted':          ['Validated', 'Not Qualified'],
  'Validated':          ['Meeting Scheduled', 'Not Qualified'],
  'Meeting Scheduled':  ['Meeting Done', 'Not Qualified'],
  'Meeting Done':       ['Proposal Sent', 'Not Qualified'],
  'Proposal Sent':      ['Converted', 'Not Qualified'],
  'Not Qualified':      ['Validated'],   // recycle path
  'Converted':          [],
};

export const statusColors = {
  'Untouched':          { bg: 'rgba(156,163,175,0.12)', color: '#9CA3AF', border: 'rgba(156,163,175,0.25)' },
  'Attempted':          { bg: 'rgba(96,165,250,0.12)',  color: '#60A5FA', border: 'rgba(96,165,250,0.25)' },
  'Validated':          { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24', border: 'rgba(251,191,36,0.25)' },
  'Meeting Scheduled':  { bg: 'rgba(168,137,68,0.12)',  color: '#A88944', border: 'rgba(168,137,68,0.25)' },
  'Meeting Done':       { bg: 'rgba(139,92,246,0.12)',  color: '#8B5CF6', border: 'rgba(139,92,246,0.25)' },
  'Proposal Sent':      { bg: 'rgba(236,72,153,0.12)',  color: '#EC4899', border: 'rgba(236,72,153,0.25)' },
  'Converted':          { bg: 'rgba(52,211,153,0.12)',  color: '#34D399', border: 'rgba(52,211,153,0.25)' },
  'Not Qualified':      { bg: 'rgba(248,113,113,0.12)', color: '#F87171', border: 'rgba(248,113,113,0.25)' },
};

// ── REGIONS ──
export const regions = [
  "Bangalore South", "Bangalore North", "Bangalore East", "Bangalore West",
  "Mumbai", "Hyderabad", "Kochi", "Chennai", "NCR", "UP"
];

// ── BUILDERS ──
export const builders = [
  "Prestige Group", "Sobha Limited", "Brigade Group", "Puravankara Limited",
  "Godrej Properties", "DLF Limited", "Lokesh Buildcon", "Embassy Group"
];

// ── LEAD SOURCES (updated: employee referral + direct) ──
export const leadSources = [
  "Customer Referral", "Employee Referral", "Direct", "Channel Partner",
  "Builder List", "Property Expo", "Walk-in at Experience Centre",
  "Inbound Call", "Website Inquiry", "Social Media", "Other"
];

// ── CONFIGURATIONS ──
export const configurations = [
  "1BHK", "2BHK", "2.5BHK", "3BHK", "3.5BHK", "4BHK", "4+BHK",
  "Penthouse", "Villa", "Duplex"
];

export const possessionStatuses = [
  "Not yet", "Possession letter received", "Keys in hand", "Already moved in"
];

export const propertyTypes = ["Residential", "Commercial", "Retail", "Office"];

// ── EXPECTED SERVICES (new — Design/MEP/Hard Finishing/Loose Furni/Soft Furni) ──
export const expectedServices = [
  "Design Consultation", "MEP (Mechanical/Electrical/Plumbing)",
  "Hard Finishing (Tiles/Flooring/Paint)", "Loose Furniture",
  "Soft Furnishing (Curtains/Upholstery)", "Modular Kitchen",
  "Wardrobes & Storage", "False Ceiling", "Civil Work", "Full Turnkey"
];

// ── SCOPE OPTIONS (existing) ──
export const scopeOptions = [
  "Full Home Interiors", "Modular Kitchen", "Wardrobes", "Living Room",
  "Bedrooms", "Study/Home Office", "Bathroom Renovation", "False Ceiling",
  "Electrical/Painting", "Balcony/Utility"
];

export const styleOptions = [
  "Modern Minimalist", "Contemporary", "Italian Luxury",
  "South Indian Traditional", "Scandinavian", "Industrial",
  "Art Deco", "Bohemian", "Classic Indian", "Not decided"
];

// ── CUSTOMER TIMELINE (updated: next 3/6 month) ──
export const customerTimelines = [
  "Immediately", "Next 3 Months", "Next 6 Months",
  "After Possession", "Not Decided"
];

export const readinessOptions = [
  "Want to start immediately", "Within 1 month",
  "Within 3 months", "Within 6 months", "After possession", "Not decided"
];

export const decisionMakerOptions = [
  "Husband", "Wife", "Both spouses", "Parents", "Tenant", "Other"
];

export const competitorOptions = [
  "None", "HomeLane", "Livspace", "Design Cafe", "Bonito", "Local Carpenter", "Other"
];

// ── LANGUAGES ──
export const languages = [
  "English", "Hindi", "Kannada", "Tamil", "Telugu", "Malayalam", "Marathi", "Bengali"
];

// ── PROJECTS ──
export const projects = [
  { id: 1, name: "Prestige Lakeside Habitat", builder: "Prestige Group", region: "Bangalore East", city: "Bangalore", towers: ["A","B","C","D"], configs: ["2BHK","3BHK","4BHK"], status: "Active" },
  { id: 2, name: "Sobha Dream Gardens", builder: "Sobha Limited", region: "Bangalore North", city: "Bangalore", towers: ["T1","T2","T3","T5","T7"], configs: ["2BHK","3BHK"], status: "Active" },
  { id: 3, name: "Brigade Cornerstone Utopia", builder: "Brigade Group", region: "Bangalore East", city: "Bangalore", towers: ["A","B","C"], configs: ["2BHK","3BHK","3.5BHK"], status: "Active" },
  { id: 4, name: "Purva Palm Beach", builder: "Puravankara Limited", region: "Bangalore East", city: "Bangalore", towers: ["T1","T2","T3"], configs: ["3BHK","4BHK"], status: "Active" },
  { id: 5, name: "Godrej Eternity", builder: "Godrej Properties", region: "Bangalore South", city: "Bangalore", towers: ["Phase 1","Phase 2"], configs: ["2BHK","3BHK","3.5BHK","4BHK"], status: "Active" },
  { id: 6, name: "Prestige Finsbury Park", builder: "Prestige Group", region: "Bangalore North", city: "Bangalore", towers: ["A","B","C","D","E"], configs: ["2BHK","3BHK"], status: "Active" },
  { id: 7, name: "Brigade Woods", builder: "Brigade Group", region: "Bangalore East", city: "Bangalore", towers: ["A","B","C"], configs: ["2.5BHK","3BHK"], status: "Active" },
  { id: 8, name: "DLF The Crest", builder: "DLF Limited", region: "NCR", city: "Gurugram", towers: ["T1","T2","T3"], configs: ["3BHK","4BHK","4+BHK"], status: "Active" },
  { id: 9, name: "Embassy Lake Terraces", builder: "Embassy Group", region: "Bangalore North", city: "Bangalore", towers: ["T1","T2"], configs: ["3BHK","4BHK","Penthouse"], status: "Active" },
  { id: 10, name: "Puravankara Zenium", builder: "Puravankara Limited", region: "Mumbai", city: "Mumbai", towers: ["A","B"], configs: ["2BHK","3BHK"], status: "Inactive" },
];

// ── TEAM MEMBERS (extended: Sales Manager, Regional Manager, Sales Executive) ──
export const teamMembers = [
  // Pre-sales Executives
  { id: "E001", name: "Rahul V", role: "Pre-sales Executive", region: "Bangalore East", email: "rahul.v@morph.com", phone: "+91 98765 00001", dailyTarget: 25, active: true, language: "Kannada" },
  { id: "E002", name: "Sneha G", role: "Pre-sales Executive", region: "Bangalore North", email: "sneha.g@morph.com", phone: "+91 98765 00002", dailyTarget: 25, active: true, language: "English" },
  { id: "E003", name: "Deepak M", role: "Pre-sales Executive", region: "Bangalore South", email: "deepak.m@morph.com", phone: "+91 98765 00003", dailyTarget: 20, active: true, language: "Kannada" },
  { id: "E004", name: "Meera K", role: "Pre-sales Executive", region: "Mumbai", email: "meera.k@morph.com", phone: "+91 98765 00004", dailyTarget: 30, active: true, language: "Marathi" },
  { id: "E005", name: "Arun P", role: "Pre-sales Executive", region: "Hyderabad", email: "arun.p@morph.com", phone: "+91 98765 00005", dailyTarget: 20, active: false, language: "Telugu" },
  // Regional Managers
  { id: "RM01", name: "Karthik R", role: "Regional Manager", region: "Bangalore", email: "karthik.r@morph.com", phone: "+91 98765 00010", dailyTarget: 0, active: true, language: "Kannada" },
  { id: "RM02", name: "Neha Joshi", role: "Regional Manager", region: "Mumbai", email: "neha.j@morph.com", phone: "+91 98765 00011", dailyTarget: 0, active: true, language: "Hindi" },
  // Sales Managers
  { id: "SM01", name: "Vishal Reddy", role: "Sales Manager", region: "Bangalore", email: "vishal.r@morph.com", phone: "+91 98765 00030", dailyTarget: 0, active: true, language: "English" },
  { id: "SM02", name: "Priyanka Das", role: "Sales Manager", region: "Mumbai", email: "priyanka.d@morph.com", phone: "+91 98765 00031", dailyTarget: 0, active: true, language: "Hindi" },
  // Sales Executives
  { id: "SE01", name: "Ankit Sharma", role: "Sales Executive", region: "Bangalore East", email: "ankit.s@morph.com", phone: "+91 98765 00040", dailyTarget: 8, active: true, language: "English" },
  { id: "SE02", name: "Divya Menon", role: "Sales Executive", region: "Bangalore North", email: "divya.m@morph.com", phone: "+91 98765 00041", dailyTarget: 8, active: true, language: "Malayalam" },
  { id: "SE03", name: "Ravi Patel", role: "Sales Executive", region: "Mumbai", email: "ravi.p@morph.com", phone: "+91 98765 00042", dailyTarget: 10, active: true, language: "Hindi" },
  // CRM Head
  { id: "H001", name: "Vikram Singh", role: "CRM Head", region: "All", email: "vikram.s@morph.com", phone: "+91 98765 00020", dailyTarget: 0, active: true, language: "English" },
];

// ── NOTIFICATION RULES ──
export const notificationRules = [
  { id: 1, name: "New lead assigned", trigger: "Builder list upload or manual creation", recipients: "Assigned executive", channel: "In-app + Push", active: true },
  { id: 2, name: "Lead SLA breach", trigger: "Lead not contacted within 48 hours", recipients: "Executive + Manager", channel: "In-app + Email", active: true },
  { id: 3, name: "Review queue alert", trigger: "Lead waiting > 2 hours for review", recipients: "Regional Manager", channel: "Push notification", active: true },
  { id: 4, name: "Handoff confirmed", trigger: "Manager approves lead for sales", recipients: "Executive + Sales Manager", channel: "In-app + Email", active: true },
  { id: 5, name: "Possession approaching", trigger: "Lead possession date < 6 months away", recipients: "Assigned executive", channel: "In-app", active: true },
  { id: 6, name: "Nurture re-engagement", trigger: "Nurture lead enters 6-month window", recipients: "Executive + Manager", channel: "In-app + Email", active: false },
  { id: 7, name: "Weekly digest", trigger: "Every Friday 5 PM", recipients: "Manager + CRM Head", channel: "Email (PDF)", active: true },
  { id: 8, name: "Escalation - No first call", trigger: "Pre-sales not attempted in 48h", recipients: "Regional Manager", channel: "In-app + Email + SMS", active: true },
  { id: 9, name: "Escalation - Sales no contact", trigger: "Sales rep hasn't talked to lead after handoff", recipients: "Pre-sales + Regional Manager", channel: "In-app + Email", active: true },
  { id: 10, name: "Not Qualified review", trigger: "Lead marked Not Qualified", recipients: "Regional Manager", channel: "In-app", active: true },
];

// ── ESCALATION MATRIX ──
export const escalationMatrix = [
  { id: 1, scenario: "First call not attempted within 48 hours", level1: "Pre-sales Executive", level2: "Regional Manager", level3: "CRM Head", slaHours: 48, action: "Auto-reassign + Notify" },
  { id: 2, scenario: "Sales rep has not contacted lead after handoff", level1: "Sales Executive", level2: "Sales Manager", level3: "Regional Manager", slaHours: 24, action: "Pre-sales follows up" },
  { id: 3, scenario: "Lead in 'Validated' for >72 hours without meeting scheduled", level1: "Sales Manager", level2: "Regional Manager", level3: "CRM Head", slaHours: 72, action: "Escalate + Notify" },
  { id: 4, scenario: "Not Qualified lead not reviewed by Regional Manager", level1: "Regional Manager", level2: "CRM Head", level3: "—", slaHours: 24, action: "Auto-assign to CRM" },
  { id: 5, scenario: "Meeting scheduled but not done within 7 days", level1: "Sales Executive", level2: "Sales Manager", level3: "Regional Manager", slaHours: 168, action: "Reschedule or escalate" },
];

// ── CATALOGUE / BROCHURES ──
export const catalogues = [
  { id: 1, name: "Morph 2026 Interiors Portfolio", type: "Brochure", format: "PDF", size: "8.2 MB", uploadedBy: "Vikram Singh", uploadDate: "2026-03-01", channels: ["WhatsApp", "Email"], url: "/catalogues/morph-portfolio-2026.pdf" },
  { id: 2, name: "Modular Kitchen Designs", type: "Catalogue", format: "PDF", size: "4.5 MB", uploadedBy: "Karthik R", uploadDate: "2026-02-15", channels: ["WhatsApp"], url: "/catalogues/kitchen-catalogue.pdf" },
  { id: 3, name: "Italian Luxury Collection", type: "Catalogue", format: "PDF", size: "12.1 MB", uploadedBy: "Vikram Singh", uploadDate: "2026-01-20", channels: ["Email"], url: "/catalogues/italian-luxury.pdf" },
  { id: 4, name: "Budget-Friendly Packages", type: "Brochure", format: "PDF", size: "3.2 MB", uploadedBy: "Neha Joshi", uploadDate: "2026-03-10", channels: ["WhatsApp", "Email"], url: "/catalogues/budget-packages.pdf" },
  { id: 5, name: "Wardrobe Solutions 2026", type: "Catalogue", format: "PDF", size: "5.7 MB", uploadedBy: "Karthik R", uploadDate: "2026-02-28", channels: ["WhatsApp", "Email"], url: "/catalogues/wardrobe-solutions.pdf" },
];

// ── STICKY ROUTING ──
export const stickyRouting = [
  { id: 1, type: "Region", match: "Bangalore East", assignTo: "E001", assignName: "Rahul V", priority: 1 },
  { id: 2, type: "Region", match: "Bangalore North", assignTo: "E002", assignName: "Sneha G", priority: 1 },
  { id: 3, type: "Region", match: "Bangalore South", assignTo: "E003", assignName: "Deepak M", priority: 1 },
  { id: 4, type: "Region", match: "Mumbai", assignTo: "E004", assignName: "Meera K", priority: 1 },
  { id: 5, type: "Language", match: "Kannada", assignTo: "E001", assignName: "Rahul V", priority: 2 },
  { id: 6, type: "Language", match: "Malayalam", assignTo: "SE02", assignName: "Divya Menon", priority: 2 },
  { id: 7, type: "Project", match: "Prestige Lakeside Habitat", assignTo: "E001", assignName: "Rahul V", priority: 3 },
  { id: 8, type: "Project", match: "Sobha Dream Gardens", assignTo: "E002", assignName: "Sneha G", priority: 3 },
];

// ── MOCK LEADS (updated with full lifecycle fields) ──
export const mockLeads = [
  {
    id: "L-1001",
    name: "Rohan Krishnan",
    phone: "+91 98860 12345",
    alternatePhone: "+91 98860 54321",
    email: "rohan.k@gmail.com",
    whatsapp: "+91 98860 12345",
    coApplicants: [{ name: "Meera Krishnan", phone: "+91 98860 99999", email: "meera.k@gmail.com", relation: "Spouse" }],
    project: "Prestige Lakeside Habitat",
    builder: "Prestige Group",
    tower: "B", floor: 12, unit: "B-1204",
    config: "3BHK", area: 1450, value: 22.5,
    possession: "2026-06-15",
    possessionStatus: "Possession letter received",
    propertyType: "Residential",
    status: "Meeting Scheduled",
    previousStatus: "Validated",
    score: 88,
    lastContact: "2026-03-29T10:30:00",
    source: "Builder List",
    language: "Kannada",
    notes: "High interest in modular kitchen and master bedroom wardrobes.",
    scope: ["Modular Kitchen", "Wardrobes", "Living Room"],
    expectedServices: ["Design Consultation", "Modular Kitchen", "Wardrobes & Storage"],
    budget: 22,
    customerTimeline: "Next 3 Months",
    decisionMaker: "Both spouses",
    readiness: "Want to start immediately",
    stylePreference: ["Modern Minimalist"],
    competition: "None",
    region: "Bangalore East",
    assignedTo: "SM01", assignedToName: "Vishal Reddy", assignedRole: "Sales Manager",
    presalesOwner: "E001", presalesOwnerName: "Rahul V",
    followUps: [{ type: 'Pre-sales', date: "2026-04-05T10:00:00", completed: false }, { type: 'Sales', date: "2026-04-06T14:00:00", completed: false }],
    meetings: [{ datetime: "2026-04-06T14:00:00", location: "Morph Experience Centre, Whitefield", attendees: ["Rohan Krishnan", "Meera Krishnan", "Ankit Sharma"], locationUrl: "https://maps.google.com/?q=morph+whitefield" }],
    aiSummary: "Customer is highly interested with keys expected in June. Wife Meera drives decision. Need vastu-compliant modular kitchen. Budget aligned at ₹22L. Competitor-free. Schedule site visit ASAP.",
    callHistory: [
      { date: "2026-03-29T10:30:00", duration: "12:45", outcome: "Connected", notes: "Discussed 3BHK layout. Interested in modular kitchen.", aiSummary: "Customer confirmed budget, wife on call. Interested in kitchen + wardrobes. No competitors approached." },
      { date: "2026-03-27T14:15:00", duration: "0:45", outcome: "No Answer", notes: "Scheduled callback.", aiSummary: null },
      { date: "2026-03-26T17:00:00", duration: "5:20", outcome: "Connected", notes: "First pitch made. Wife very interested.", aiSummary: "Initial contact. Wife Meera drove the conversation. Interested in modern minimalist design." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-25T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-26T17:00:00", by: "Rahul V" },
      { status: "Validated", date: "2026-03-29T10:30:00", by: "Rahul V" },
      { status: "Meeting Scheduled", date: "2026-03-30T11:00:00", by: "Vishal Reddy" },
    ],
    moengage: { pushed: true, lastSync: "2026-03-30T11:05:00", events: ["lead_created", "status_attempted", "status_validated", "status_meeting_scheduled"] },
  },
  {
    id: "L-1002",
    name: "Priya Sharma",
    phone: "+91 99000 54321",
    alternatePhone: "",
    email: "priya.sharma@yahoo.com",
    whatsapp: "+91 99000 54321",
    coApplicants: [],
    project: "Sobha Dream Gardens",
    builder: "Sobha Limited",
    tower: "T7", floor: 4, unit: "T7-402",
    config: "2BHK", area: 1100, value: 12.0,
    possession: "2026-09-20",
    possessionStatus: "Not yet",
    propertyType: "Residential",
    status: "Validated",
    previousStatus: "Attempted",
    score: 62,
    lastContact: "2026-03-31T09:15:00",
    source: "Website Inquiry",
    language: "English",
    notes: "Looking for modern minimalist style. Budget is tight.",
    scope: ["Modular Kitchen", "Wardrobes"],
    expectedServices: ["Design Consultation", "Modular Kitchen"],
    budget: 10,
    customerTimeline: "Next 6 Months",
    decisionMaker: "Wife",
    readiness: "Within 3 months",
    stylePreference: ["Modern Minimalist", "Scandinavian"],
    competition: "Livspace",
    region: "Bangalore North",
    assignedTo: "SM01", assignedToName: "Vishal Reddy", assignedRole: "Sales Manager",
    presalesOwner: "E002", presalesOwnerName: "Sneha G",
    followUps: [{ type: 'Pre-sales', date: "2026-04-04T15:00:00", completed: false }],
    meetings: [],
    aiSummary: "Budget-conscious buyer. Interested but comparing with Livspace. Possession Sep 2026. Needs nurturing with portfolio samples to build confidence.",
    callHistory: [
      { date: "2026-03-31T09:15:00", duration: "8:30", outcome: "Connected", notes: "Discussed budget concerns. Mentioned Livspace quote.", aiSummary: "Buyer has Livspace quote. Our differentiator: quality + warranty. Send kitchen catalogue." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-28T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-30T10:00:00", by: "Sneha G" },
      { status: "Validated", date: "2026-03-31T09:15:00", by: "Sneha G" },
    ],
    moengage: { pushed: true, lastSync: "2026-03-31T09:20:00", events: ["lead_created", "status_attempted", "status_validated"] },
  },
  {
    id: "L-1003",
    name: "Amit Hegde",
    phone: "+91 98450 67890",
    alternatePhone: "+91 97654 33210",
    email: "amit.h@outlook.com",
    whatsapp: "+91 98450 67890",
    coApplicants: [{ name: "Sunita Hegde", phone: "+91 97654 33210", email: "sunita.h@gmail.com", relation: "Spouse" }],
    project: "Godrej Eternity",
    builder: "Godrej Properties",
    tower: "Phase 1", floor: 0, unit: "Phase 1 - G03",
    config: "3.5BHK", area: 1850, value: 35.0,
    possession: "2026-04-10",
    possessionStatus: "Keys in hand",
    propertyType: "Residential",
    status: "Meeting Done",
    previousStatus: "Meeting Scheduled",
    score: 94,
    lastContact: "2026-04-02T14:45:00",
    source: "Customer Referral",
    language: "Kannada",
    notes: "Keys expected next week. Wants to start immediately. Vastu compliance required.",
    scope: ["Full Home Interiors"],
    expectedServices: ["Full Turnkey", "Design Consultation", "MEP (Mechanical/Electrical/Plumbing)"],
    budget: 35,
    customerTimeline: "Immediately",
    decisionMaker: "Both spouses",
    readiness: "Want to start immediately",
    stylePreference: ["Contemporary", "South Indian Traditional"],
    competition: "Design Cafe",
    referrer: "Vikram Kulkarni (existing client)",
    region: "Bangalore South",
    assignedTo: "SE01", assignedToName: "Ankit Sharma", assignedRole: "Sales Executive",
    presalesOwner: "E003", presalesOwnerName: "Deepak M",
    followUps: [{ type: 'Sales', date: "2026-04-04T10:00:00", completed: false }],
    meetings: [{ datetime: "2026-04-02T14:00:00", location: "Godrej Eternity Site Office", attendees: ["Amit Hegde", "Sunita Hegde", "Ankit Sharma", "Deepak M"], locationUrl: "https://maps.google.com/?q=godrej+eternity+bangalore" }],
    aiSummary: "High-value lead (₹35L). Keys in hand. Meeting done at site — both spouses very positive. Competing with Design Cafe. Send proposal within 48hrs. Vastu-compliant design critical.",
    callHistory: [
      { date: "2026-04-02T14:45:00", duration: "5:00", outcome: "Connected", notes: "Post-meeting follow up call. Very positive feedback.", aiSummary: "Meeting went excellent. Both spouses liked showroom samples. Wants vastu-compliant proposal within the week." },
      { date: "2026-03-30T14:45:00", duration: "18:20", outcome: "Connected", notes: "Detailed discussion. Full home interiors needed. Vastu important.", aiSummary: "Full turnkey project. Vastu is non-negotiable. Budget ₹35L confirmed. Wife prefers Contemporary style." },
      { date: "2026-03-28T11:00:00", duration: "6:40", outcome: "Connected", notes: "Initial call. Very enthusiastic. Referred by Vikram.", aiSummary: "Referred by existing client Vikram Kulkarni. High enthusiasm. Ground floor unit with garden." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-27T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-28T11:00:00", by: "Deepak M" },
      { status: "Validated", date: "2026-03-30T14:45:00", by: "Deepak M" },
      { status: "Meeting Scheduled", date: "2026-03-31T10:00:00", by: "Vishal Reddy" },
      { status: "Meeting Done", date: "2026-04-02T16:00:00", by: "Ankit Sharma" },
    ],
    moengage: { pushed: true, lastSync: "2026-04-02T16:05:00", events: ["lead_created", "status_attempted", "status_validated", "status_meeting_scheduled", "status_meeting_done"] },
  },
  {
    id: "L-1004",
    name: "Anjali Rao",
    phone: "+91 96111 22334",
    alternatePhone: "",
    email: "arao_id@proton.me",
    whatsapp: "+91 96111 22334",
    coApplicants: [],
    project: "Brigade Woods",
    builder: "Brigade Group",
    tower: "C", floor: 2, unit: "C-201",
    config: "3BHK", area: 1550, value: 18.5,
    possession: "2027-01-15",
    possessionStatus: "Not yet",
    propertyType: "Residential",
    status: "Attempted",
    previousStatus: "Untouched",
    score: 45,
    lastContact: "2026-03-28T11:00:00",
    source: "Property Expo",
    language: "Telugu",
    notes: "Wait for possession. Just exploring design options for now.",
    scope: ["Modular Kitchen"],
    expectedServices: ["Design Consultation"],
    budget: 12,
    customerTimeline: "Next 6 Months",
    decisionMaker: "Husband",
    readiness: "After possession",
    stylePreference: ["Not decided"],
    competition: "None",
    region: "Bangalore East",
    assignedTo: "E001", assignedToName: "Rahul V", assignedRole: "Pre-sales Executive",
    presalesOwner: "E001", presalesOwnerName: "Rahul V",
    followUps: [{ type: 'Pre-sales', date: "2026-04-10T11:00:00", completed: false }],
    meetings: [],
    aiSummary: "Early-stage exploration. Possession not until Jan 2027. Low urgency. Add to nurture sequence and re-engage in 3 months.",
    callHistory: [
      { date: "2026-03-28T11:00:00", duration: "4:10", outcome: "Connected", notes: "Met at Bangalore Property Expo. Exploring options.", aiSummary: "Met at expo. Husband exploring on behalf of family. No budget finalized. Possession Jan 2027." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-28T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-28T11:00:00", by: "Rahul V" },
    ],
    moengage: { pushed: true, lastSync: "2026-03-28T11:05:00", events: ["lead_created", "status_attempted"] },
  },
  {
    id: "L-1005",
    name: "Suresh Menon",
    phone: "+91 97400 11223",
    alternatePhone: "+91 94430 55667",
    email: "suresh.menon@kerala.com",
    whatsapp: "+91 97400 11223",
    coApplicants: [{ name: "Lakshmi Menon", phone: "+91 94430 55667", email: "lakshmi.m@gmail.com", relation: "Spouse" }],
    project: "Purva Palm Beach",
    builder: "Puravankara Limited",
    tower: "T2", floor: 11, unit: "T2-1105",
    config: "4BHK", area: 2400, value: 45.0,
    possession: "2026-05-30",
    possessionStatus: "Possession letter received",
    propertyType: "Residential",
    status: "Proposal Sent",
    previousStatus: "Meeting Done",
    score: 91,
    lastContact: "2026-04-01T08:00:00",
    source: "Walk-in at Experience Centre",
    language: "Malayalam",
    notes: "Luxury interiors. Vastu compliance is a must. Full home including home theater.",
    scope: ["Full Home Interiors"],
    expectedServices: ["Full Turnkey", "Design Consultation", "MEP (Mechanical/Electrical/Plumbing)", "Loose Furniture", "Soft Furnishing (Curtains/Upholstery)"],
    budget: 45,
    customerTimeline: "Immediately",
    decisionMaker: "Both spouses",
    readiness: "Within 1 month",
    stylePreference: ["Italian Luxury", "Contemporary"],
    competition: "HomeLane",
    region: "Bangalore East",
    assignedTo: "SE01", assignedToName: "Ankit Sharma", assignedRole: "Sales Executive",
    presalesOwner: "E001", presalesOwnerName: "Rahul V",
    followUps: [{ type: 'Sales', date: "2026-04-05T16:00:00", completed: false }],
    meetings: [{ datetime: "2026-03-31T14:00:00", location: "Morph Experience Centre, Whitefield", attendees: ["Suresh Menon", "Lakshmi Menon", "Ankit Sharma"], locationUrl: "https://maps.google.com/?q=morph+whitefield" }],
    aiSummary: "Premium luxury lead ₹45L. Both spouses visited experience centre and loved kitchen display. Home theater is priority. Proposal sent — awaiting confirmation. Counter HomeLane with warranty.",
    callHistory: [
      { date: "2026-04-01T08:00:00", duration: "10:00", outcome: "Connected", notes: "Discussed proposal details. Customer reviewing. Follow up in 3 days.", aiSummary: "Proposal received well. Customer comparing with HomeLane. Our edge: quality + warranty + home theatre expertise." },
      { date: "2026-03-31T08:00:00", duration: "22:15", outcome: "Connected", notes: "Walk-in at experience centre. Very impressed with kitchen display. Wants home theater.", aiSummary: "Walk-in customer. Wife Lakshmi loved modular kitchen. Husband wants home theater. Budget confirmed ₹45L." },
      { date: "2026-03-29T16:30:00", duration: "3:00", outcome: "Connected", notes: "Initial outbound. Confirmed walk-in appointment.", aiSummary: "Initial contact. Confirmed walk-in for next day. Wife will accompany." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-28T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-29T16:30:00", by: "Rahul V" },
      { status: "Validated", date: "2026-03-31T08:00:00", by: "Rahul V" },
      { status: "Meeting Scheduled", date: "2026-03-31T10:00:00", by: "Vishal Reddy" },
      { status: "Meeting Done", date: "2026-03-31T16:00:00", by: "Ankit Sharma" },
      { status: "Proposal Sent", date: "2026-04-01T09:00:00", by: "Ankit Sharma" },
    ],
    moengage: { pushed: true, lastSync: "2026-04-01T09:05:00", events: ["lead_created", "status_attempted", "status_validated", "status_meeting_scheduled", "status_meeting_done", "status_proposal_sent"] },
  },
  {
    id: "L-1006",
    name: "Ramesh Babu",
    phone: "+91 90081 55667",
    alternatePhone: "",
    email: "ramesh.b@gmail.com",
    whatsapp: "+91 90081 55667",
    coApplicants: [],
    project: "DLF The Crest",
    builder: "DLF Limited",
    tower: "T1", floor: 8, unit: "T1-802",
    config: "4BHK", area: 2800, value: 50.0,
    possession: "2026-07-15",
    possessionStatus: "Not yet",
    propertyType: "Residential",
    status: "Not Qualified",
    previousStatus: "Attempted",
    score: 30,
    lastContact: "2026-03-30T09:00:00",
    source: "Inbound Call",
    language: "Hindi",
    notes: "Caller said budget is too low for their area. May reconsider after possession.",
    scope: [],
    expectedServices: [],
    budget: 8,
    customerTimeline: "Not Decided",
    decisionMaker: "Husband",
    readiness: "Not decided",
    stylePreference: [],
    competition: "None",
    region: "NCR",
    assignedTo: "RM02", assignedToName: "Neha Joshi", assignedRole: "Regional Manager",
    presalesOwner: "E004", presalesOwnerName: "Meera K",
    followUps: [{ type: 'Pre-sales', date: "2026-04-08T10:00:00", completed: false }],
    meetings: [],
    aiSummary: "Marked not qualified due to budget mismatch (₹8L for 2800 sqft). Regional Manager to review if they can be moved to budget packages.",
    notQualifiedReason: "Budget mismatch — ₹8L for 2800 sqft is far below minimum",
    callHistory: [
      { date: "2026-03-30T09:00:00", duration: "3:20", outcome: "Connected", notes: "Budget too low. Not interested in premium interiors.", aiSummary: "Budget mismatch. Customer wants ₹8L for 2800 sqft. Suggest budget packages if available." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-29T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-30T09:00:00", by: "Meera K" },
      { status: "Not Qualified", date: "2026-03-30T09:05:00", by: "Meera K", reason: "Budget mismatch" },
    ],
    moengage: { pushed: true, lastSync: "2026-03-30T09:10:00", events: ["lead_created", "status_attempted", "status_not_qualified"] },
  },
  {
    id: "L-1007",
    name: "Kavitha Nair",
    phone: "+91 98760 44556",
    alternatePhone: "+91 98760 77889",
    email: "kavitha.n@hotmail.com",
    whatsapp: "+91 98760 44556",
    coApplicants: [{ name: "Rajesh Nair", phone: "+91 98760 77889", email: "rajesh.n@gmail.com", relation: "Spouse" }],
    project: "Prestige Finsbury Park",
    builder: "Prestige Group",
    tower: "D", floor: 6, unit: "D-602",
    config: "3BHK", area: 1380, value: 18.0,
    possession: "2026-08-20",
    possessionStatus: "Not yet",
    propertyType: "Residential",
    status: "Untouched",
    previousStatus: null,
    score: 0,
    lastContact: null,
    source: "Website Inquiry",
    language: "Malayalam",
    notes: "",
    scope: [],
    expectedServices: [],
    budget: 0,
    customerTimeline: null,
    decisionMaker: null,
    readiness: null,
    stylePreference: [],
    competition: null,
    region: "Bangalore North",
    assignedTo: "E002", assignedToName: "Sneha G", assignedRole: "Pre-sales Executive",
    presalesOwner: "E002", presalesOwnerName: "Sneha G",
    followUps: [],
    meetings: [],
    aiSummary: null,
    callHistory: [],
    statusHistory: [
      { status: "Untouched", date: "2026-04-03T14:00:00", by: "System" },
    ],
    moengage: { pushed: true, lastSync: "2026-04-03T14:01:00", events: ["lead_created"] },
  },
  {
    id: "L-1008",
    name: "Vijay Kumar",
    phone: "+91 99001 66778",
    alternatePhone: "",
    email: "vijay.k@proton.me",
    whatsapp: "+91 99001 66778",
    coApplicants: [],
    project: "Embassy Lake Terraces",
    builder: "Embassy Group",
    tower: "T1", floor: 14, unit: "T1-1401",
    config: "Penthouse", area: 4200, value: 85.0,
    possession: "2026-06-01",
    possessionStatus: "Possession letter received",
    propertyType: "Residential",
    status: "Converted",
    previousStatus: "Proposal Sent",
    score: 98,
    lastContact: "2026-04-01T09:00:00",
    source: "Direct",
    language: "English",
    notes: "Signed design contract. Full turnkey penthouse project.",
    scope: ["Full Home Interiors"],
    expectedServices: ["Full Turnkey", "Design Consultation", "MEP (Mechanical/Electrical/Plumbing)", "Hard Finishing (Tiles/Flooring/Paint)", "Loose Furniture", "Soft Furnishing (Curtains/Upholstery)"],
    budget: 85,
    customerTimeline: "Immediately",
    decisionMaker: "Both spouses",
    readiness: "Want to start immediately",
    stylePreference: ["Italian Luxury"],
    competition: "None",
    region: "Bangalore North",
    assignedTo: "SE02", assignedToName: "Divya Menon", assignedRole: "Sales Executive",
    presalesOwner: "E002", presalesOwnerName: "Sneha G",
    followUps: [],
    meetings: [{ datetime: "2026-03-28T10:00:00", location: "Embassy Lake Terraces Clubhouse", attendees: ["Vijay Kumar", "Divya Menon", "Sneha G"], locationUrl: "https://maps.google.com/?q=embassy+lake+terraces" }],
    aiSummary: "CONVERTED. ₹85L penthouse project. Full turnkey contract signed. Start immediately after possession in June.",
    callHistory: [
      { date: "2026-04-01T09:00:00", duration: "15:00", outcome: "Connected", notes: "Contract signed. Start date confirmed.", aiSummary: "Contract signed successfully. ₹85L full turnkey. Work begins immediately after possession." }
    ],
    statusHistory: [
      { status: "Untouched", date: "2026-03-20T09:00:00", by: "System" },
      { status: "Attempted", date: "2026-03-21T10:00:00", by: "Sneha G" },
      { status: "Validated", date: "2026-03-22T11:00:00", by: "Sneha G" },
      { status: "Meeting Scheduled", date: "2026-03-24T10:00:00", by: "Vishal Reddy" },
      { status: "Meeting Done", date: "2026-03-28T12:00:00", by: "Divya Menon" },
      { status: "Proposal Sent", date: "2026-03-29T10:00:00", by: "Divya Menon" },
      { status: "Converted", date: "2026-04-01T09:30:00", by: "Divya Menon" },
    ],
    moengage: { pushed: true, lastSync: "2026-04-01T09:35:00", events: ["lead_created", "status_attempted", "status_validated", "status_meeting_scheduled", "status_meeting_done", "status_proposal_sent", "status_converted"] },
  },
  {
    id: "L-1009",
    name: "Fatima Khan",
    phone: "+91 88001 22334",
    alternatePhone: "",
    email: "fatima.khan@gmail.com",
    whatsapp: "+91 88001 22334",
    coApplicants: [],
    project: "Prestige Lakeside Habitat",
    builder: "Prestige Group",
    tower: "A", floor: 5, unit: "A-504",
    config: "2BHK", area: 980, value: 10.0,
    possession: "2026-07-01",
    possessionStatus: "Not yet",
    propertyType: "Residential",
    status: "Untouched",
    previousStatus: null,
    score: 0,
    lastContact: null,
    source: "Inbound Call",
    language: "Hindi",
    notes: "",
    scope: [],
    expectedServices: [],
    budget: 0,
    customerTimeline: null,
    decisionMaker: null,
    readiness: null,
    stylePreference: [],
    competition: null,
    region: "Bangalore East",
    assignedTo: "E001", assignedToName: "Rahul V", assignedRole: "Pre-sales Executive",
    presalesOwner: "E001", presalesOwnerName: "Rahul V",
    followUps: [],
    meetings: [],
    aiSummary: null,
    callHistory: [],
    statusHistory: [
      { status: "Untouched", date: "2026-04-04T08:00:00", by: "System" },
    ],
    moengage: { pushed: true, lastSync: "2026-04-04T08:01:00", events: ["lead_created"] },
  },
];

// ── MOENGAGE MOCK EVENTS LOG ──
export const moengageEventLog = [
  { id: 1, leadId: "L-1001", event: "status_meeting_scheduled", timestamp: "2026-03-30T11:05:00", payload: { status: "Meeting Scheduled", score: 88 }, synced: true },
  { id: 2, leadId: "L-1003", event: "status_meeting_done", timestamp: "2026-04-02T16:05:00", payload: { status: "Meeting Done", score: 94 }, synced: true },
  { id: 3, leadId: "L-1005", event: "status_proposal_sent", timestamp: "2026-04-01T09:05:00", payload: { status: "Proposal Sent", score: 91 }, synced: true },
  { id: 4, leadId: "L-1006", event: "status_not_qualified", timestamp: "2026-03-30T09:10:00", payload: { status: "Not Qualified", reason: "Budget mismatch" }, synced: true },
  { id: 5, leadId: "L-1008", event: "status_converted", timestamp: "2026-04-01T09:35:00", payload: { status: "Converted", value: 85 }, synced: true },
];

// ── MASTER FIELDS REFERENCE ──
export const masterFields = {
  leadInfo: [
    { field: "Lead Name", type: "Text", required: true },
    { field: "Primary Phone", type: "Phone", required: true },
    { field: "Alternate Phone", type: "Phone", required: false },
    { field: "Email", type: "Email", required: false },
    { field: "WhatsApp", type: "Phone", required: false },
    { field: "Preferred Language", type: "Dropdown", required: false, values: "English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali" },
    { field: "Lead Source", type: "Dropdown", required: true, values: "Customer Referral, Employee Referral, Direct, Channel Partner, Builder List, Property Expo, Walk-in, Inbound Call, Website Inquiry, Social Media" },
    { field: "Referrer Name", type: "Text", required: false },
  ],
  coApplicants: [
    { field: "Co-Applicant Name", type: "Text", required: false },
    { field: "Co-Applicant Phone", type: "Phone", required: false },
    { field: "Co-Applicant Email", type: "Email", required: false },
    { field: "Relation", type: "Dropdown", required: false, values: "Spouse, Parent, Sibling, Friend, Business Partner" },
  ],
  property: [
    { field: "Builder / Developer", type: "Dropdown (Master)", required: true },
    { field: "Project Name", type: "Dropdown (Linked)", required: true },
    { field: "Tower / Block", type: "Text/Dropdown", required: true },
    { field: "Floor", type: "Number", required: false },
    { field: "Flat Number", type: "Text", required: true },
    { field: "Configuration", type: "Dropdown", required: true, values: "1BHK, 2BHK, 2.5BHK, 3BHK, 3.5BHK, 4BHK, 4+BHK, Penthouse, Villa, Duplex" },
    { field: "Carpet Area (sq ft)", type: "Number", required: true },
    { field: "Possession Status", type: "Dropdown", required: true, values: "Not yet, Possession letter received, Keys in hand, Already moved in" },
    { field: "Expected Possession Date", type: "Date", required: true },
    { field: "Property Type", type: "Dropdown", required: true, values: "Residential, Commercial, Retail, Office" },
  ],
  discovery: [
    { field: "Budget (₹L)", type: "Range Slider (5-100)", required: true },
    { field: "Customer Expected Timeline", type: "Dropdown", required: true, values: "Immediately, Next 3 Months, Next 6 Months, After Possession, Not Decided" },
    { field: "Expected Services", type: "Multi-select", required: true, values: "Design Consultation, MEP, Hard Finishing, Loose Furniture, Soft Furnishing, Modular Kitchen, Wardrobes, False Ceiling, Civil Work, Full Turnkey" },
    { field: "Scope of Work", type: "Multi-select Chips", required: true, values: "Full Home Interiors, Modular Kitchen, Wardrobes, Living Room, Bedrooms, Study, Bathroom, False Ceiling, Electrical/Painting, Balcony" },
    { field: "Decision Maker", type: "Dropdown", required: true, values: "Husband, Wife, Both spouses, Parents, Tenant, Other" },
    { field: "Style Preference", type: "Multi-select Chips", required: false },
    { field: "Competition Check", type: "Dropdown + Text", required: false },
    { field: "Special Requirements", type: "Textarea", required: false },
    { field: "Interior Point of View", type: "Dropdown", required: false, values: "Premium Luxury, Mid-Premium, Budget-Friendly, Ultra Luxury, Minimalist Functional" },
  ],
  salesCapture: [
    { field: "Meeting Date & Time", type: "DateTime", required: true },
    { field: "Meeting Location / URL", type: "Text/URL", required: true },
    { field: "Attendees Involved", type: "Multi-text", required: true },
    { field: "Meeting Notes", type: "Textarea", required: false },
    { field: "Proposal Amount (₹L)", type: "Number", required: false },
    { field: "Follow-up Date for Sales", type: "DateTime", required: false },
  ],
  assignment: [
    { field: "Assigned To", type: "User Dropdown", required: true },
    { field: "Assigned Role", type: "Auto (from user)", required: true },
    { field: "Pre-sales Owner", type: "User Dropdown", required: true },
    { field: "Follow-up Date (Pre-sales)", type: "DateTime", required: false },
    { field: "Follow-up Date (Sales)", type: "DateTime", required: false },
  ],
};

// ── INTERIOR POINT OF VIEW OPTIONS ──
export const interiorPovOptions = [
  "Premium Luxury", "Mid-Premium", "Budget-Friendly", "Ultra Luxury", "Minimalist Functional"
];

// ── CHANNEL PARTNERS ──
export const channelPartners = [
  { id: "CP001", name: "GreenBuild Realtors", firm: "GreenBuild Pvt Ltd", region: "Bangalore East", phone: "+91 98765 11111", email: "cp@greenbuild.in", status: "Active", leadsReferred: 42, conversions: 8 },
  { id: "CP002", name: "PropertyFirst", firm: "PropertyFirst Solutions", region: "Bangalore North", phone: "+91 98765 22222", email: "info@propertyfirst.in", status: "Active", leadsReferred: 31, conversions: 5 },
  { id: "CP003", name: "HomeBridge Associates", firm: "HomeBridge Consulting", region: "Mumbai", phone: "+91 98765 33333", email: "hello@homebridge.in", status: "Active", leadsReferred: 18, conversions: 3 },
  { id: "CP004", name: "RealValue Partners", firm: "RealValue Corp", region: "Bangalore South", phone: "+91 98765 44444", email: "sales@realvalue.in", status: "Inactive", leadsReferred: 10, conversions: 1 },
];

// ── SITE VISIT STATUS OPTIONS ──
export const siteVisitStatuses = [
  "Scheduled", "Customer Arrived", "OTP Verified", "In Progress",
  "Completed", "Customer No-Show", "Sales Rep No-Show"
];

// ── MOCK SITE VISITS ──
export const mockSiteVisits = [
  {
    id: "SV-001", leadId: "L-1001", leadName: "Rohan Krishnan",
    scheduledDate: "2026-04-06T14:00:00", location: "Morph Experience Centre, Whitefield",
    locationUrl: "https://maps.google.com/?q=morph+whitefield",
    salesRep: { id: "SE01", name: "Ankit Sharma" },
    presalesOwner: { id: "E001", name: "Rahul V" },
    channelPartner: null,
    otpVerified: false, otpCode: null, otpSentAt: null,
    qrScanned: false, qrScannedAt: null, qrScannedBy: null,
    status: "Scheduled",
    customerNoShow: false, salesRepNoShow: false,
    visitRemarks: "",
    remarksLocked: false,
    visitProject: "Prestige Lakeside Habitat",
    isOtherProject: false, otherProjectName: "",
    attendees: ["Rohan Krishnan", "Meera Krishnan", "Ankit Sharma"],
    meetingDoneAt: null,
    smsSentToCustomer: true,
    smsContent: "Dear Rohan, your site visit is confirmed for Apr 6, 2:00 PM at Morph Experience Centre. For any queries, contact CRM: +91 98765 00020",
  },
  {
    id: "SV-002", leadId: "L-1003", leadName: "Amit Hegde",
    scheduledDate: "2026-04-02T14:00:00", location: "Godrej Eternity Site Office",
    locationUrl: "https://maps.google.com/?q=godrej+eternity",
    salesRep: { id: "SE01", name: "Ankit Sharma" },
    presalesOwner: { id: "E003", name: "Deepak M" },
    channelPartner: null,
    otpVerified: false, otpCode: null, otpSentAt: null,
    qrScanned: true, qrScannedAt: "2026-04-02T14:05:00", qrScannedBy: "Ankit Sharma",
    status: "Completed",
    customerNoShow: false, salesRepNoShow: false,
    visitRemarks: "Customer very positive. Both spouses attended. Discussed full turnkey.",
    remarksLocked: true,
    visitProject: "Godrej Eternity",
    isOtherProject: false, otherProjectName: "",
    attendees: ["Amit Hegde", "Sunita Hegde", "Ankit Sharma", "Deepak M"],
    meetingDoneAt: "2026-04-02T16:00:00",
    smsSentToCustomer: true,
    smsContent: "Dear Amit, your site visit is confirmed for Apr 2, 2:00 PM at Godrej Eternity Site Office. For any queries, contact CRM: +91 98765 00020",
  },
  {
    id: "SV-003", leadId: "L-1005", leadName: "Suresh Menon",
    scheduledDate: "2026-03-31T14:00:00", location: "Morph Experience Centre, Whitefield",
    locationUrl: "https://maps.google.com/?q=morph+whitefield",
    salesRep: { id: "SE01", name: "Ankit Sharma" },
    presalesOwner: { id: "E001", name: "Rahul V" },
    channelPartner: { id: "CP001", name: "GreenBuild Realtors" },
    otpVerified: true, otpCode: "847291", otpSentAt: "2026-03-31T14:02:00",
    qrScanned: true, qrScannedAt: "2026-03-31T14:06:00", qrScannedBy: "Ankit Sharma",
    status: "Completed",
    customerNoShow: false, salesRepNoShow: false,
    visitRemarks: "Walk-in. Both spouses loved kitchen display. Home theater priority.",
    remarksLocked: true,
    visitProject: "Purva Palm Beach",
    isOtherProject: false, otherProjectName: "",
    attendees: ["Suresh Menon", "Lakshmi Menon", "Ankit Sharma"],
    meetingDoneAt: "2026-03-31T16:00:00",
    smsSentToCustomer: true,
    smsContent: "Thank you for visiting, registered with GreenBuild Realtors. For queries, contact CRM: +91 98765 00020",
  },
];

// ── ESTIMATION PROCESS ──
export const estimationStatuses = ["Draft", "Pending Verification", "Verified", "Authorized", "Shared with Customer", "Revised"];

export const mockEstimations = [
  {
    id: "EST-2026-001", leadId: "L-1003", leadName: "Amit Hegde",
    project: "Godrej Eternity", config: "3.5BHK", area: 1850,
    createdBy: { id: "SE01", name: "Ankit Sharma", role: "Sales Executive", date: "2026-04-03T10:00:00" },
    verifiedBy: { id: "SM01", name: "Vishal Reddy", role: "Sales Manager", date: "2026-04-03T14:00:00" },
    authorizedBy: { id: "RM01", name: "Karthik R", role: "Regional Manager", date: "2026-04-03T16:00:00" },
    status: "Authorized",
    items: [
      { category: "Modular Kitchen", description: "L-Shaped Kitchen with Acrylic Finish", qty: 1, rate: 285000, amount: 285000 },
      { category: "Wardrobes", description: "3-Door Sliding Wardrobe x3 (Master + Kids)", qty: 3, rate: 125000, amount: 375000 },
      { category: "Living Room", description: "TV Unit + Crockery Unit + Shoe Rack", qty: 1, rate: 180000, amount: 180000 },
      { category: "False Ceiling", description: "Gypsum False Ceiling (all rooms)", qty: 1, rate: 220000, amount: 220000 },
      { category: "Painting", description: "Full Home Asian Royale Paint", qty: 1, rate: 175000, amount: 175000 },
      { category: "Electrical", description: "Wiring + Switch Plates + Light Points", qty: 1, rate: 145000, amount: 145000 },
      { category: "Civil Work", description: "Bathroom + Balcony Waterproofing", qty: 1, rate: 90000, amount: 90000 },
    ],
    totalAmount: 1470000,
    discountPercent: 5,
    finalAmount: 1396500,
    gst: 251370,
    grandTotal: 1647870,
    validUntil: "2026-04-18",
    digitalSignature: { signed: true, signedBy: "Karthik R", signedDate: "2026-04-03T16:00:00" },
    sharedWithCustomer: true, sharedDate: "2026-04-03T17:00:00", sharedVia: "Email + WhatsApp",
    notes: "Vastu-compliant design. Italian Luxury finish for kitchen.",
    revisionHistory: [],
  },
  {
    id: "EST-2026-002", leadId: "L-1005", leadName: "Suresh Menon",
    project: "Purva Palm Beach", config: "4BHK", area: 2400,
    createdBy: { id: "SE01", name: "Ankit Sharma", role: "Sales Executive", date: "2026-04-01T11:00:00" },
    verifiedBy: { id: "SM01", name: "Vishal Reddy", role: "Sales Manager", date: "2026-04-01T15:00:00" },
    authorizedBy: null,
    status: "Verified",
    items: [
      { category: "Full Turnkey", description: "Complete Home Interiors Package", qty: 1, rate: 3200000, amount: 3200000 },
      { category: "Home Theater", description: "7.1 Surround Sound Room", qty: 1, rate: 650000, amount: 650000 },
      { category: "Loose Furniture", description: "Sofa Set + Dining + Beds (Italian Import)", qty: 1, rate: 850000, amount: 850000 },
    ],
    totalAmount: 4700000,
    discountPercent: 3,
    finalAmount: 4559000,
    gst: 820620,
    grandTotal: 5379620,
    validUntil: "2026-04-15",
    digitalSignature: { signed: false, signedBy: null, signedDate: null },
    sharedWithCustomer: false, sharedDate: null, sharedVia: null,
    notes: "Premium Italian luxury package. Home theater setup per Dolby specs.",
    revisionHistory: [],
  },
];

// ── QUOTATION (from Estimation) ──
export const quotationStatuses = ["Draft", "Sent to Customer", "Customer Accepted", "Customer Rejected", "Expired", "Revised"];

export const mockQuotations = [
  {
    id: "QTN-2026-001", estimationId: "EST-2026-001", leadId: "L-1003", leadName: "Amit Hegde",
    project: "Godrej Eternity", config: "3.5BHK",
    createdDate: "2026-04-03T17:30:00",
    grandTotal: 1647870,
    paymentTerms: "30% Advance, 40% Mid-project, 20% Pre-handover, 10% Post-handover",
    validUntil: "2026-04-18",
    status: "Sent to Customer",
    digitalSignature: { signed: true, signedBy: "Vishal Reddy", signedDate: "2026-04-03T17:30:00" },
    sentVia: "Email + WhatsApp", sentDate: "2026-04-03T18:00:00",
    customerResponse: null,
  },
];

// ── PAYMENT COLLECTION ──
export const paymentStatuses = ["Pending", "Collected", "Receipt Uploaded", "Verified by Accounts"];

export const mockPayments = [
  {
    id: "PAY-001", leadId: "L-1008", leadName: "Vijay Kumar",
    quotationId: "QTN-2026-000", estimationId: "EST-2026-000",
    project: "Embassy Lake Terraces", config: "Penthouse",
    collectedBy: { id: "SE02", name: "Divya Menon", role: "Sales Executive" },
    collectionDate: "2026-04-01T10:00:00",
    amount: 2550000, // 30% of 85L
    paymentMode: "Bank Transfer",
    panNumber: "ABCPK1234L", panVerified: true,
    remarks: "30% advance payment collected.",
    receiptUploadedBy: null, // Sales team does NOT share receipt
    receiptProvided: false, // Only Account team provides receipt
    accountTeamReceipt: { uploaded: true, receiptNo: "RCP-2026-0089", uploadedBy: "Accounts Team", uploadDate: "2026-04-01T14:00:00", fileUrl: "/receipts/RCP-2026-0089.pdf" },
    status: "Verified by Accounts",
  },
  {
    id: "PAY-002", leadId: "L-1003", leadName: "Amit Hegde",
    quotationId: "QTN-2026-001", estimationId: "EST-2026-001",
    project: "Godrej Eternity", config: "3.5BHK",
    collectedBy: { id: "SE01", name: "Ankit Sharma", role: "Sales Executive" },
    collectionDate: "2026-04-04T09:00:00",
    amount: 494361, // 30% of total
    paymentMode: "Cheque",
    panNumber: "BCHPH5678M", panVerified: false,
    remarks: "30% advance. Cheque deposited.",
    receiptUploadedBy: null,
    receiptProvided: false,
    accountTeamReceipt: null,
    status: "Collected",
  },
];

// ── CONTRACT VALUE ──
export const contractStatuses = ["Draft", "Value Entered", "Validated by SM", "Confirmed by RM", "Active"];

export const mockContracts = [
  {
    id: "CNT-001", leadId: "L-1008", leadName: "Vijay Kumar",
    project: "Embassy Lake Terraces", config: "Penthouse",
    contractValue: 8500000,
    enteredBy: { id: "SE02", name: "Divya Menon", role: "Sales Executive", date: "2026-04-01T09:30:00" },
    validatedBy: { id: "SM01", name: "Vishal Reddy", role: "Sales Manager", date: "2026-04-01T11:00:00" },
    confirmedBy: { id: "RM01", name: "Karthik R", role: "Regional Manager", date: "2026-04-01T12:00:00" },
    status: "Active",
    startDate: "2026-06-15",
    estimatedCompletion: "2026-12-15",
    paymentSchedule: [
      { milestone: "Advance (30%)", amount: 2550000, dueDate: "2026-04-01", status: "Paid" },
      { milestone: "Mid-project (40%)", amount: 3400000, dueDate: "2026-08-15", status: "Upcoming" },
      { milestone: "Pre-handover (20%)", amount: 1700000, dueDate: "2026-11-15", status: "Upcoming" },
      { milestone: "Post-handover (10%)", amount: 850000, dueDate: "2026-12-30", status: "Upcoming" },
    ],
  },
];

// ── COLLISION RULES ──
export const collisionRules = [
  { id: 1, scenario: "Internal team attempted but CP brings customer for site visit", resolution: "Business Decision — CP receives credit", priority: "High" },
  { id: 2, scenario: "CP and internal team both claim lead simultaneously", resolution: "First registration timestamp wins", priority: "Medium" },
  { id: 3, scenario: "Lead already locked to CP but customer walks in directly", resolution: "CP credit maintained if within 90-day window", priority: "Medium" },
];

// ══════════════════════════════════════════
// POST-CONVERSION: PROJECT LIFECYCLE
// ══════════════════════════════════════════

// ── PROJECT PHASES ──
export const projectPhases = [
  { id: 1, name: "Onboarding", desc: "10% payment collected, customer onboarded, CRM allocates Design Manager", color: "#34D399" },
  { id: 2, name: "Design Phase", desc: "Design Manager assigned, multiple designs prepared with customer, costing finalized", color: "#60A5FA" },
  { id: 3, name: "Design Sign-off", desc: "Design signed by customer, 50% payment collected. Do NOT move to production until both complete", color: "#8B5CF6" },
  { id: 4, name: "Production Phase", desc: "Production Manager assigned, manufacturing begins, notes tracked", color: "#FBBF24" },
  { id: 5, name: "QC & Dispatch", desc: "QC Manager inspects, Account Manager confirms payment, dispatch coordinated", color: "#EC4899" },
  { id: 6, name: "Installation", desc: "Project Manager leads on-site installation, progress tracked", color: "#F97316" },
  { id: 7, name: "Handover", desc: "OTP verification with customer/applicant, final handover completed", color: "#14B8A6" },
];

// ── TEAM MEMBERS (Project Lifecycle roles) ──
export const projectTeam = [
  // Design Managers
  { id: "DM01", name: "Arjun Nair", role: "Design Manager", region: "Bangalore", email: "arjun.n@morph.com", phone: "+91 98765 50001", active: true, currentProjects: 3 },
  { id: "DM02", name: "Kavya Reddy", role: "Design Manager", region: "Bangalore", email: "kavya.r@morph.com", phone: "+91 98765 50002", active: true, currentProjects: 2 },
  { id: "DM03", name: "Sanjay Mishra", role: "Design Manager", region: "Mumbai", email: "sanjay.m@morph.com", phone: "+91 98765 50003", active: true, currentProjects: 4 },
  // Production Managers
  { id: "PM01", name: "Rakesh Gupta", role: "Production Manager", region: "Factory - Bangalore", email: "rakesh.g@morph.com", phone: "+91 98765 60001", active: true, currentProjects: 5 },
  { id: "PM02", name: "Sunil Verma", role: "Production Manager", region: "Factory - Bangalore", email: "sunil.v@morph.com", phone: "+91 98765 60002", active: true, currentProjects: 3 },
  { id: "PM03", name: "Manoj Kumar", role: "Production Manager", region: "Factory - Mumbai", email: "manoj.k@morph.com", phone: "+91 98765 60003", active: true, currentProjects: 2 },
  // QC Managers
  { id: "QC01", name: "Ravi Shankar", role: "QC Manager", region: "Bangalore", email: "ravi.s@morph.com", phone: "+91 98765 70001", active: true },
  { id: "QC02", name: "Deepa Nair", role: "QC Manager", region: "Mumbai", email: "deepa.n@morph.com", phone: "+91 98765 70002", active: true },
  // Project Managers (Installation)
  { id: "PJM01", name: "Vijay Krishnan", role: "Project Manager", region: "Bangalore", email: "vijay.kr@morph.com", phone: "+91 98765 80001", active: true, currentProjects: 2 },
  { id: "PJM02", name: "Seema Patel", role: "Project Manager", region: "Mumbai", email: "seema.p@morph.com", phone: "+91 98765 80002", active: true, currentProjects: 1 },
  // Account Managers
  { id: "AM01", name: "Pradeep S", role: "Account Manager", region: "Bangalore", email: "pradeep.s@morph.com", phone: "+91 98765 90001", active: true },
  { id: "AM02", name: "Nidhi Gupta", role: "Account Manager", region: "Mumbai", email: "nidhi.g@morph.com", phone: "+91 98765 90002", active: true },
];

// ── MOCK PROJECTS (Post-Conversion) ──
export const mockProjects = [
  {
    id: "PRJ-001",
    leadId: "L-1008", customerName: "Vijay Kumar",
    customerPhone: "+91 99001 66778", customerEmail: "vijay.k@proton.me",
    projectName: "Embassy Lake Terraces", config: "Penthouse", area: 4200,
    contractValue: 8500000,
    currentPhase: "Production Phase",
    phaseHistory: [
      { phase: "Onboarding", startDate: "2026-04-01T10:00:00", endDate: "2026-04-03T10:00:00", completedBy: "Vikram Singh" },
      { phase: "Design Phase", startDate: "2026-04-03T10:00:00", endDate: "2026-04-20T16:00:00", completedBy: "Arjun Nair" },
      { phase: "Design Sign-off", startDate: "2026-04-20T16:00:00", endDate: "2026-04-22T11:00:00", completedBy: "Vishal Reddy" },
      { phase: "Production Phase", startDate: "2026-04-22T12:00:00", endDate: null, completedBy: null },
    ],

    // Onboarding
    onboardingPayment: { amount: 850000, percentage: 10, status: "Paid", date: "2026-04-01T10:00:00", mode: "Bank Transfer", sapValidated: true, sapRef: "SAP-2026-00451" },

    // Design Phase
    designManager: { id: "DM01", name: "Arjun Nair", assignedBy: "Vikram Singh", assignedDate: "2026-04-03T10:00:00" },
    designs: [
      { id: "D1", version: "v1.0", name: "Italian Luxury - Option A", status: "Revised", createdDate: "2026-04-05T10:00:00", costing: 8200000, pdfUrl: "/designs/vijay-v1.pdf", sentToCustomer: true, sentVia: "WhatsApp + Email", sentDate: "2026-04-06T09:00:00" },
      { id: "D2", version: "v2.0", name: "Italian Luxury - Option B (Vastu)", status: "Revised", createdDate: "2026-04-10T14:00:00", costing: 8500000, pdfUrl: "/designs/vijay-v2.pdf", sentToCustomer: true, sentVia: "WhatsApp", sentDate: "2026-04-10T16:00:00" },
      { id: "D3", version: "v3.0 (Final)", name: "Italian Luxury - Final Design", status: "Approved", createdDate: "2026-04-18T11:00:00", costing: 8500000, pdfUrl: "/designs/vijay-v3-final.pdf", sentToCustomer: true, sentVia: "Email + WhatsApp", sentDate: "2026-04-18T14:00:00" },
    ],
    designSignedOff: true,
    designSignOffDate: "2026-04-20T16:00:00",
    designSignedBy: "Vijay Kumar",

    // Design Phase Payment (50%)
    designPayment: { amount: 4250000, percentage: 50, status: "Paid", date: "2026-04-22T09:00:00", mode: "Bank Transfer", confirmedByAccounts: true, accountManagerId: "AM01" },

    // Production Phase
    productionManagers: [
      { id: "PM01", name: "Rakesh Gupta", assignedBy: "Vishal Reddy", assignedDate: "2026-04-22T12:00:00", scope: "Modular Kitchen + Wardrobes", notes: "Acrylic finish kitchen, 5-door wardrobe for master", progress: 65 },
    ],
    productionNotes: [
      { date: "2026-04-25T10:00:00", by: "Rakesh Gupta", note: "Kitchen shutters production started. Acrylic panels ordered.", visible: true },
      { date: "2026-04-28T14:00:00", by: "Rakesh Gupta", note: "Wardrobe carcass cutting complete. Hardware sourced.", visible: true },
      { date: "2026-05-02T09:00:00", by: "Rakesh Gupta", note: "Kitchen assembly 50% done. On track for May 15 dispatch.", visible: true },
    ],

    // QC & Dispatch
    qcManager: null,
    qcChecklist: [],
    dispatchDate: null,

    // Installation
    projectManager: null,
    installationNotes: [],
    installationProgress: 0,

    // Handover
    handoverOtp: null,
    handoverCompleted: false,
    handoverDate: null,

    // Payment Summary
    payments: [
      { milestone: "Onboarding (10%)", amount: 850000, status: "Paid", date: "2026-04-01" },
      { milestone: "Design Phase (50%)", amount: 4250000, status: "Paid", date: "2026-04-22" },
      { milestone: "Production Complete (30%)", amount: 2550000, status: "Pending", date: null },
      { milestone: "Handover (10%)", amount: 850000, status: "Pending", date: null },
    ],
    totalPaid: 5100000,
    totalPending: 3400000,

    // CCAvenue
    onlinePaymentEnabled: true,
    ccavenueOrderId: "MORPH-PRJ001-2026",
  },
  {
    id: "PRJ-002",
    leadId: "L-1003", customerName: "Amit Hegde",
    customerPhone: "+91 98450 67890", customerEmail: "amit.h@outlook.com",
    projectName: "Godrej Eternity", config: "3.5BHK", area: 1850,
    contractValue: 1647870,
    currentPhase: "Design Phase",
    phaseHistory: [
      { phase: "Onboarding", startDate: "2026-04-04T10:00:00", endDate: "2026-04-05T10:00:00", completedBy: "Vikram Singh" },
      { phase: "Design Phase", startDate: "2026-04-05T10:00:00", endDate: null, completedBy: null },
    ],

    onboardingPayment: { amount: 164787, percentage: 10, status: "Paid", date: "2026-04-04T10:00:00", mode: "Cheque", sapValidated: false, sapRef: null },

    designManager: { id: "DM02", name: "Kavya Reddy", assignedBy: "Vikram Singh", assignedDate: "2026-04-05T10:00:00" },
    designs: [
      { id: "D1", version: "v1.0", name: "Contemporary Vastu - Draft", status: "In Progress", createdDate: "2026-04-06T10:00:00", costing: 1647870, pdfUrl: null, sentToCustomer: false, sentVia: null, sentDate: null },
    ],
    designSignedOff: false,
    designSignOffDate: null,
    designSignedBy: null,

    designPayment: { amount: 823935, percentage: 50, status: "Pending", date: null, mode: null, confirmedByAccounts: false, accountManagerId: null },

    productionManagers: [],
    productionNotes: [],

    qcManager: null,
    qcChecklist: [],
    dispatchDate: null,

    projectManager: null,
    installationNotes: [],
    installationProgress: 0,

    handoverOtp: null,
    handoverCompleted: false,
    handoverDate: null,

    payments: [
      { milestone: "Onboarding (10%)", amount: 164787, status: "Paid", date: "2026-04-04" },
      { milestone: "Design Phase (50%)", amount: 823935, status: "Pending", date: null },
      { milestone: "Production Complete (30%)", amount: 494361, status: "Pending", date: null },
      { milestone: "Handover (10%)", amount: 164787, status: "Pending", date: null },
    ],
    totalPaid: 164787,
    totalPending: 1483083,

    onlinePaymentEnabled: true,
    ccavenueOrderId: "MORPH-PRJ002-2026",
  },
];

// ── QC CHECKLIST TEMPLATE ──
export const qcChecklistTemplate = [
  { id: 1, category: "Kitchen", item: "Shutter alignment & finish", required: true },
  { id: 2, category: "Kitchen", item: "Hardware functionality (hinges, channels)", required: true },
  { id: 3, category: "Kitchen", item: "Countertop level & finish", required: true },
  { id: 4, category: "Kitchen", item: "Plumbing fitting check", required: true },
  { id: 5, category: "Wardrobes", item: "Door alignment & sliding mechanism", required: true },
  { id: 6, category: "Wardrobes", item: "Internal fittings & accessories", required: true },
  { id: 7, category: "Wardrobes", item: "Locking mechanism", required: false },
  { id: 8, category: "False Ceiling", item: "Level check & finish", required: true },
  { id: 9, category: "False Ceiling", item: "Light point alignment", required: true },
  { id: 10, category: "Painting", item: "Color consistency & finish", required: true },
  { id: 11, category: "Painting", item: "Touch-up completion", required: true },
  { id: 12, category: "Electrical", item: "Switch & socket functionality", required: true },
  { id: 13, category: "Electrical", item: "Light fixture installation", required: true },
  { id: 14, category: "Civil", item: "Waterproofing test", required: true },
  { id: 15, category: "Overall", item: "Cleaning & site handover readiness", required: true },
];
