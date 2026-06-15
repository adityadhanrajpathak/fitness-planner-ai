const pptxgen = require("pptxgenjs");

let pptx = new pptxgen();

// ─── Theme Colors ─────────────────────────────────────────────
const PRIMARY   = "1A73E8";   // blue
const ACCENT    = "34D399";   // green
const DARK_BG   = "0F172A";   // dark navy
const LIGHT_BG  = "F0F9FF";   // light blue-white
const WHITE     = "FFFFFF";
const DARK_TEXT = "1E293B";
const GRAY      = "64748B";

// ─── Helpers ─────────────────────────────────────────────────
function addSlideHeader(slide, title) {
  // Top accent bar
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.12, fill: { color: ACCENT } });
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.2, w: "90%", h: 0.7,
    fontSize: 26, bold: true, color: PRIMARY, fontFace: "Calibri"
  });
  // Divider line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.4, y: 0.85, w: 9, h: 0,
    line: { color: ACCENT, width: 1.5 }
  });
}

function addBullets(slide, items, yStart) {
  items.forEach((item, i) => {
    // Bullet circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.4, y: yStart + i * 0.65 + 0.08, w: 0.18, h: 0.18,
      fill: { color: ACCENT }
    });
    slide.addText(item, {
      x: 0.72, y: yStart + i * 0.65, w: 8.7, h: 0.6,
      fontSize: 15, color: DARK_TEXT, fontFace: "Calibri", valign: "middle"
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 1 — TITLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s1 = pptx.addSlide();
// Full dark background
s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: DARK_BG } });
// Green accent top bar
s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.18, fill: { color: ACCENT } });
// Blue left bar
s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: "100%", fill: { color: PRIMARY } });

s1.addText("CAPSTONE PROJECT", {
  x: 0.5, y: 0.9, w: "90%", h: 0.6,
  fontSize: 20, bold: false, color: ACCENT, align: "center", fontFace: "Calibri"
});
s1.addText("Fitness Planner AI", {
  x: 0.5, y: 1.6, w: "90%", h: 1.0,
  fontSize: 44, bold: true, color: WHITE, align: "center", fontFace: "Calibri"
});
s1.addText("Personalized Workout & Diet Planner", {
  x: 0.5, y: 2.65, w: "90%", h: 0.5,
  fontSize: 18, color: "94A3B8", align: "center", italic: true, fontFace: "Calibri"
});
// Info box
s1.addShape(pptx.ShapeType.rect, {
  x: 2.3, y: 3.4, w: 5.4, h: 1.8,
  fill: { color: "1E293B" }, line: { color: ACCENT, width: 1 }
});
s1.addText(
  "Presented By:\n\nName   :  Aditya Dhanraj\nDept    :  CSE\nLive App:  fitness-seven-sand.vercel.app",
  {
    x: 2.5, y: 3.5, w: 5.0, h: 1.65,
    fontSize: 14, color: WHITE, fontFace: "Calibri", valign: "middle"
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 2 — OUTLINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s2 = pptx.addSlide();
s2.background = { color: LIGHT_BG };
addSlideHeader(s2, "Outline");

const outlineItems = [
  "1.  Problem Statement",
  "2.  Proposed Solution",
  "3.  System Architecture & Tech Stack",
  "4.  Algorithm & Deployment",
  "5.  Key Features & Results",
  "6.  Conclusion & Future Scope",
  "7.  References"
];
addBullets(s2, outlineItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 3 — PROBLEM STATEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s3 = pptx.addSlide();
s3.background = { color: WHITE };
addSlideHeader(s3, "Problem Statement");

const problemItems = [
  "Generic Solutions: Fitness apps offer one-size-fits-all plans ignoring individual body metrics and dietary needs.",
  "Cost Barriers: Personal fitness coaching and specialized dietitians are expensive and inaccessible.",
  "Data Privacy: Health apps relying on cloud AI APIs expose sensitive body metrics to third-party servers.",
  "Cultural Blindspot: Most plans ignore cultural food preferences, making them hard to follow in the long run."
];
addBullets(s3, problemItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 4 — PROPOSED SOLUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s4 = pptx.addSlide();
s4.background = { color: LIGHT_BG };
addSlideHeader(s4, "Proposed Solution");

const solutionItems = [
  "AI-Powered Personalization: Generates custom workout + meal plans from user body metrics (age, weight, height, activity level).",
  "100% Local Processing: Built-in AI engine on the backend — no external API calls, full data privacy guaranteed.",
  "Scientific Accuracy: Uses the Mifflin-St Jeor BMR equation with TDEE multipliers for precise calorie calculation.",
  "Cultural Meal Plans: Supports North Indian, South Indian, Jain, Vegan and Mixed food preferences.",
  "Free & Accessible: Fully deployed web app at fitness-seven-sand.vercel.app — free for everyone."
];
addBullets(s4, solutionItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 5 — SYSTEM ARCHITECTURE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s5 = pptx.addSlide();
s5.background = { color: WHITE };
addSlideHeader(s5, "System Architecture & Tech Stack");

// Two column layout
const techCols = [
  { label: "Frontend", items: ["HTML5 + CSS3 (Vanilla)", "Modular JavaScript (SPA)", "Responsive Design", "Dark Theme UI"] },
  { label: "Backend", items: ["Node.js + Express.js", "JWT Authentication", "bcryptjs Password Hashing", "@libsql/client (Turso DB)"] }
];
techCols.forEach((col, ci) => {
  const xBase = ci === 0 ? 0.4 : 5.2;
  s5.addShape(pptx.ShapeType.rect, { x: xBase, y: 1.05, w: 4.4, h: 0.45, fill: { color: PRIMARY } });
  s5.addText(col.label, { x: xBase, y: 1.05, w: 4.4, h: 0.45, fontSize: 15, bold: true, color: WHITE, align: "center", fontFace: "Calibri" });
  col.items.forEach((item, i) => {
    s5.addShape(pptx.ShapeType.rect, {
      x: xBase, y: 1.55 + i * 0.65, w: 4.4, h: 0.6,
      fill: { color: i % 2 === 0 ? LIGHT_BG : WHITE }, line: { color: "CBD5E1", width: 0.5 }
    });
    s5.addText(item, { x: xBase + 0.1, y: 1.55 + i * 0.65, w: 4.2, h: 0.6, fontSize: 13, color: DARK_TEXT, valign: "middle", fontFace: "Calibri" });
  });
});

// Deployment info
s5.addText("🚀  Deployed on Vercel  |  GitHub: adityadhanrajpathak/fitness-planner-ai", {
  x: 0.4, y: 4.6, w: "90%", h: 0.4,
  fontSize: 12, color: GRAY, italic: true, fontFace: "Calibri"
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 6 — ALGORITHM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s6 = pptx.addSlide();
s6.background = { color: LIGHT_BG };
addSlideHeader(s6, "Algorithm & Core Engine");

const algoItems = [
  "Step 1 – BMR Calculation: Mifflin-St Jeor Equation → BMR = (10×W) + (6.25×H) – (5×A) ± 5",
  "Step 2 – TDEE Calculation: BMR × Activity Multiplier (Sedentary 1.2 → Very Active 1.9)",
  "Step 3 – Goal Adjustment: Weight Loss (−500 cal), Maintenance (±0), Muscle Gain (+300 cal)",
  "Step 4 – Macro Split: Protein 1.6g/kg body weight, Carbs 50%, Fat 25% of remaining calories",
  "Step 5 – Plan Generation: Algorithmic matching of exercises & meals from internal curated database"
];
addBullets(s6, algoItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 7 — KEY FEATURES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s7 = pptx.addSlide();
s7.background = { color: WHITE };
addSlideHeader(s7, "Key Features");

const features = [
  { icon: "📊", title: "Live Dashboard", desc: "BMI, BMR, daily calories & water intake at a glance" },
  { icon: "💪", title: "Workout Plans", desc: "Day-by-day exercise routines matched to equipment & goals" },
  { icon: "🥗", title: "Diet Plans", desc: "3-meal daily plans with calories, protein & cultural preferences" },
  { icon: "📈", title: "Progress Tracking", desc: "Log weight, meals & workout completion daily" },
  { icon: "🔐", title: "Secure Auth", desc: "JWT tokens + bcrypt password hashing, role-based access" },
  { icon: "👑", title: "Admin Panel", desc: "Platform statistics and user management dashboard" }
];
features.forEach((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const xBase = 0.3 + col * 3.3;
  const yBase = 1.1 + row * 1.8;
  s7.addShape(pptx.ShapeType.rect, { x: xBase, y: yBase, w: 3.1, h: 1.6, fill: { color: LIGHT_BG }, line: { color: ACCENT, width: 1 } });
  s7.addText(f.icon + " " + f.title, { x: xBase + 0.1, y: yBase + 0.1, w: 2.9, h: 0.45, fontSize: 14, bold: true, color: PRIMARY, fontFace: "Calibri" });
  s7.addText(f.desc, { x: xBase + 0.1, y: yBase + 0.55, w: 2.9, h: 0.95, fontSize: 12, color: DARK_TEXT, fontFace: "Calibri", valign: "top" });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 8 — RESULTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s8 = pptx.addSlide();
s8.background = { color: LIGHT_BG };
addSlideHeader(s8, "Results");

const resultItems = [
  "Functional full-stack web application live at: fitness-seven-sand.vercel.app",
  "Successfully generates personalized workout plans (7-day weekly schedule) in under 1 second.",
  "Diet plans meet user's exact caloric targets with proper macro distribution per meal.",
  "Secure registration, login, and profile management fully operational.",
  "Admin panel provides platform-wide statistics and user management.",
  "Google Search Console verified — site indexed for public discovery."
];
addBullets(s8, resultItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 9 — CONCLUSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s9 = pptx.addSlide();
s9.background = { color: WHITE };
addSlideHeader(s9, "Conclusion");

const conclusionItems = [
  "Fitness Planner AI successfully bridges the gap between generic fitness apps and expensive personal coaching.",
  "By leveraging server-side algorithmic generation, it provides scientifically sound, personalized health recommendations.",
  "Proves that effective, highly personalized health planning can be achieved without external AI APIs.",
  "The app is accessible to anyone for free, breaking the cost barrier of fitness coaching."
];
addBullets(s9, conclusionItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 10 — FUTURE SCOPE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s10 = pptx.addSlide();
s10.background = { color: LIGHT_BG };
addSlideHeader(s10, "Future Scope");

const futureItems = [
  "📱  Mobile App: Convert to native iOS and Android applications.",
  "⌚  Wearable Integration: Sync with smartwatches for real-time calorie and step tracking.",
  "🤖  LLM Integration: Use open-source language models for natural language fitness advice.",
  "📊  Visual Analytics: Add graphs to visualize weight trends, strength progress over time.",
  "🌍  Expanded Database: More cultural food datasets (South Asian, Middle Eastern, East Asian)."
];
addBullets(s10, futureItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 11 — REFERENCES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s11 = pptx.addSlide();
s11.background = { color: WHITE };
addSlideHeader(s11, "References");

const refItems = [
  "Mifflin, M. D., et al. (1990). A new predictive equation for resting energy expenditure. The American Journal of Clinical Nutrition.",
  "Node.js Foundation. Node.js Documentation. https://nodejs.org/",
  "OpenJS Foundation. Express.js Framework. https://expressjs.com/",
  "JSON Web Tokens Standard. https://jwt.io/",
  "Vercel Inc. Vercel Deployment Platform. https://vercel.com/",
  "pptxgenjs Library. https://gitbrent.github.io/PptxGenJS/"
];
addBullets(s11, refItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 12 — THANK YOU
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s12 = pptx.addSlide();
s12.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: DARK_BG } });
s12.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.18, fill: { color: ACCENT } });
s12.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: "100%", fill: { color: PRIMARY } });

s12.addText("Thank You!", {
  x: 0.5, y: 1.4, w: "90%", h: 1.2,
  fontSize: 54, bold: true, color: WHITE, align: "center", fontFace: "Calibri"
});
s12.addText("Questions & Feedback Welcome", {
  x: 0.5, y: 2.7, w: "90%", h: 0.5,
  fontSize: 20, color: ACCENT, align: "center", italic: true, fontFace: "Calibri"
});
s12.addText("🌐  https://fitness-seven-sand.vercel.app\n📦  github.com/adityadhanrajpathak/fitness-planner-ai", {
  x: 1.5, y: 3.5, w: "70%", h: 0.9,
  fontSize: 14, color: "94A3B8", align: "center", fontFace: "Calibri"
});

// ─── Write File ───────────────────────────────────────────────
pptx.writeFile({ fileName: "Fitness_Planner_AI_Presentation.pptx" }).then(fileName => {
  console.log(`✅  Created: ${fileName}`);
});
