const pptxgen = require("pptxgenjs");

let pptx = new pptxgen();

// ─── Theme Colors ─────────────────────────────────────────────
const PRIMARY       = "0E76A8";   // Darker blue
const ACCENT        = "00A2E8";   // Bright blue / Cyan
const SLATE_GRAY    = "4F5B66";   // Dark slate gray for first bar
const LIGHT_GRAY    = "A0A0A0";   // Light gray for third bar
const DARK_BG       = "3A4F59";   // Presenter box background
const WHITE         = "FFFFFF";
const DARK_TEXT     = "1E293B";
const GRAY          = "64748B";

// ─── Helpers ─────────────────────────────────────────────────
function addTopBars(slide) {
  // Three top bars: Slate Gray, Bright Blue/Cyan, Light Gray
  slide.addShape(pptx.ShapeType.rect, { x: 0.4, y: 0.2, w: 3.0, h: 0.08, fill: { color: SLATE_GRAY } });
  slide.addShape(pptx.ShapeType.rect, { x: 3.5, y: 0.2, w: 3.0, h: 0.08, fill: { color: ACCENT } });
  slide.addShape(pptx.ShapeType.rect, { x: 6.6, y: 0.2, w: 3.0, h: 0.08, fill: { color: LIGHT_GRAY } });
}

function addEdunetLogo(slide) {
  // Bottom-right Edunet Foundation branding text
  slide.addText([
    { text: "edu", options: { color: "0B3B60", bold: true, fontSize: 16 } },
    { text: "net", options: { color: "D9534F", bold: true, fontSize: 16 } },
    { text: "\nfoundation", options: { color: "777777", fontSize: 9 } }
  ], { x: 8.2, y: 5.0, w: 1.5, h: 0.5, align: "right", fontFace: "Calibri" });
}

function addSlideHeader(slide, title) {
  // Add the top bars
  addTopBars(slide);
  
  // Title
  slide.addText(title, {
    x: 0.4, y: 0.4, w: "90%", h: 0.5,
    fontSize: 22, bold: true, color: PRIMARY, fontFace: "Calibri"
  });
  
  // Edunet Logo
  addEdunetLogo(slide);
}

function addBullets(slide, items, yStart) {
  items.forEach((item, i) => {
    // Bullet point text
    slide.addText("•  " + item, {
      x: 0.5, y: yStart + i * 0.52, w: 9.0, h: 0.48,
      fontSize: 14, color: DARK_TEXT, fontFace: "Calibri", valign: "top"
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 1 — CAPSTONE PROJECT / TITLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s1 = pptx.addSlide();
s1.background = { color: WHITE };

addTopBars(s1);

s1.addText("CAPSTONE PROJECT", {
  x: 0.5, y: 0.8, w: "90%", h: 0.5,
  fontSize: 28, bold: true, color: PRIMARY, align: "center", fontFace: "Calibri"
});

s1.addText("FITNESS PLANNER AI", {
  x: 0.5, y: 1.4, w: "90%", h: 0.6,
  fontSize: 36, bold: true, color: ACCENT, align: "center", fontFace: "Calibri"
});

// Presenter Box
s1.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 2.3, w: 9.0, h: 2.5,
  fill: { color: DARK_BG }
});

s1.addText("Presented By:", {
  x: 0.8, y: 2.5, w: 8.4, h: 0.4,
  fontSize: 16, bold: true, color: ACCENT, fontFace: "Calibri"
});

s1.addText("1.  Student Name- Aditya Dhanraj\n2.  College Name- Gandhi Engineering College\n3.  Department- CSE", {
  x: 0.8, y: 2.9, w: 8.4, h: 1.5,
  fontSize: 15, bold: true, color: ACCENT, fontFace: "Calibri", lineSpacing: 24
});

addEdunetLogo(s1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 2 — OUTLINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s2 = pptx.addSlide();
s2.background = { color: WHITE };
addSlideHeader(s2, "OUTLINE");

const outlineItems = [
  "Problem Statement",
  "Proposed Solution",
  "System Approach",
  "Algorithm & Deployment",
  "Result",
  "Conclusion",
  "Future Scope",
  "References"
];
addBullets(s2, outlineItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 3 — PROBLEM STATEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s3 = pptx.addSlide();
s3.background = { color: WHITE };
addSlideHeader(s3, "PROBLEM STATEMENT");

const problemItems = [
  "Generic Solutions: Modern fitness applications offer generic, one-size-fits-all workout and diet plans that completely ignore individual body metrics, fitness levels, and cultural restrictions.",
  "High Cost Barriers: Custom workout plans, personal trainers, and certified nutritionists are expensive and financially inaccessible to the average user.",
  "Data Privacy Concerns: Popular fitness apps require users to upload highly sensitive body metrics and personal details to external cloud servers, risking user data privacy.",
  "Lack of Cultural Adaptation: Existing diet generator systems fail to take into account cultural food preferences (e.g., North Indian, South Indian, Jain, Vegan), leading to unsustainable dietary changes."
];
addBullets(s3, problemItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 4 — PROPOSED SOLUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s4 = pptx.addSlide();
s4.background = { color: WHITE };
addSlideHeader(s4, "PROPOSED SOLUTION");

const solutionItems = [
  "AI-Powered Personalization: Automatically computes personalized fitness metrics including BMR, TDEE, BMI, and customized caloric targets in real-time.",
  "100% Local Processing: Runs a built-in AI rules engine entirely on the local backend server without relying on expensive or privacy-violating external APIs.",
  "Science-Backed Planning: Implements the Mifflin-St Jeor equation and standard exercise physiology ratios to generate customized 7-day workout schedules.",
  "Cultural Nutrition Customization: Curates personalized daily meal plans across 5 distinct food profiles: North Indian, South Indian, Jain, Vegan, and Mixed diets.",
  "Completely Free & Open Source: Deployed online for public access, breaking the cost barrier of personal fitness coaching."
];
addBullets(s4, solutionItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 5 — SYSTEM APPROACH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s5 = pptx.addSlide();
s5.background = { color: WHITE };
addSlideHeader(s5, "SYSTEM APPROACH");

// 2-column layout for Frontend & Backend Tech stack
s5.addText("Frontend Tech Stack", { x: 0.5, y: 1.0, w: 4.2, h: 0.4, fontSize: 16, bold: true, color: PRIMARY, fontFace: "Calibri" });
const frontendTech = [
  "HTML5 & CSS3: Custom dark-themed responsive user interface optimized for mobile and desktop viewports.",
  "Vanilla JavaScript: Modular client-side router (SPA), state management, and direct REST API integrations.",
  "Dynamic Charts & Stats: Live visualization of BMI, BMR, daily calories, and water intake goals."
];
addBullets(s5, frontendTech, 1.4);

s5.addText("Backend & Database Stack", { x: 0.5, y: 3.1, w: 4.2, h: 0.4, fontSize: 16, bold: true, color: PRIMARY, fontFace: "Calibri" });
const backendTech = [
  "Node.js & Express: Lightweight RESTful API server for session, profile, workout, and diet endpoints.",
  "Better-SQLite3 / LibSQL: Embedded relational database for storing encrypted profiles and local datasets.",
  "JWT & bcryptjs: Token-based authentication and secure password hashing with role-based access controls."
];
addBullets(s5, backendTech, 3.5);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 6 — ALGORITHM & DEPLOYMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s6 = pptx.addSlide();
s6.background = { color: WHITE };
addSlideHeader(s6, "ALGORITHM & DEPLOYMENT");

const algoItems = [
  "BMR Calculation: Evaluates Basal Metabolic Rate using Mifflin-St Jeor: BMR = (10 × W) + (6.25 × H) - (5 × A) + s (where s is +5 for men, -161 for women).",
  "TDEE Calculation: TDEE = BMR × Activity Multiplier (from Sedentary 1.2 up to Extremely Active 1.9).",
  "Caloric Adjustments: Adjusts calories for user goals: Muscle Gain (+300 to +500 kcal) or Fat Loss (-500 to -750 kcal).",
  "Macro split: Minimum protein threshold set at 1.6g/kg of body weight, with balanced carbs (50%) and fats (25%).",
  "Deployment: Automated CI/CD pipeline deploying the front-end and server environment to Vercel."
];
addBullets(s6, algoItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 7 — RESULT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s7 = pptx.addSlide();
s7.background = { color: WHITE };
addSlideHeader(s7, "RESULT");

const resultItems = [
  "Fully functional, responsive web application launched and publicly accessible.",
  "Instantly generates custom 7-day workout plans tailored to fitness goals, target muscle groups, and available equipment.",
  "Accurately generates customized daily meal plans that adhere strictly to target caloric budgets and macro ranges.",
  "Secure user authentication (JWT) with password recovery, profile editing, and progress persistence.",
  "Interactive dashboard displays progress metrics, daily checklist, and live health stats.",
  "Fully operational Admin panel showing server statistics, registered user metrics, and account types."
];
addBullets(s7, resultItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 8 — CONCLUSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s8 = pptx.addSlide();
s8.background = { color: WHITE };
addSlideHeader(s8, "CONCLUSION");

const conclusionItems = [
  "Successfully developed a local, privacy-first alternative to commercial fitness apps.",
  "Proved that high-quality, scientifically sound personalization can be achieved using a rule-based AI engine on server-side without calling external LLM APIs.",
  "Eliminated the high financial barriers of health and fitness planning by providing a free, accessible platform.",
  "Enhanced usability and long-term compliance by directly integrating cultural food profiles into the nutrition planning algorithm."
];
addBullets(s8, conclusionItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 9 — FUTURE SCOPE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s9 = pptx.addSlide();
s9.background = { color: WHITE };
addSlideHeader(s9, "FUTURE SCOPE");

const futureItems = [
  "Mobile Application: Port the responsive SPA to a cross-platform mobile application (React Native / Flutter).",
  "Wearable Integrations: Connect with Apple HealthKit, Google Fit, and smartwatches for automatic step and calorie tracking.",
  "Natural Language AI: Integrate a lightweight, open-source local LLM (e.g., Llama 3) for conversational fitness coaching.",
  "Social Features: Allow users to share progress, form workout challenges, and build fitness communities.",
  "Expanded Databases: Incorporate broader food databases with global cultural preferences and local grocery pricing."
];
addBullets(s9, futureItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 10 — REFERENCES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s10 = pptx.addSlide();
s10.background = { color: WHITE };
addSlideHeader(s10, "REFERENCES");

const refItems = [
  "Mifflin, M. D., et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. The American Journal of Clinical Nutrition.",
  "Node.js Runtime Documentation. OpenJS Foundation. URL: https://nodejs.org/",
  "Express.js Web Application Framework. URL: https://expressjs.com/",
  "JSON Web Token (JWT) Specifications (RFC 7519). URL: https://jwt.io/",
  "pptxgenjs Presentation Generation Library. URL: https://gitbrent.github.io/PptxGenJS/",
  "SQLite Database Engine. URL: https://www.sqlite.org/"
];
addBullets(s10, refItems, 1.1);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 11 — APPLICATION LINK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s11 = pptx.addSlide();
s11.background = { color: WHITE };
addSlideHeader(s11, "APPLICATION LINK");

s11.addText("Live Deployed Application:", {
  x: 0.5, y: 1.5, w: 9.0, h: 0.5,
  fontSize: 18, bold: true, color: PRIMARY, fontFace: "Calibri"
});

s11.addText("🌐  https://fitness-seven-sand.vercel.app", {
  x: 0.5, y: 2.1, w: 9.0, h: 0.6,
  fontSize: 22, bold: true, color: ACCENT, fontFace: "Calibri"
});

s11.addText("Source Code Repository:", {
  x: 0.5, y: 3.1, w: 9.0, h: 0.5,
  fontSize: 18, bold: true, color: PRIMARY, fontFace: "Calibri"
});

s11.addText("📦  https://github.com/adityadhanrajpathak/fitness-planner-ai", {
  x: 0.5, y: 3.7, w: 9.0, h: 0.6,
  fontSize: 22, bold: true, color: ACCENT, fontFace: "Calibri"
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 12 — THANK YOU
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let s12 = pptx.addSlide();
s12.background = { color: WHITE };

// Top bars and logo
addTopBars(s12);
addEdunetLogo(s12);

s12.addText("THANK YOU", {
  x: 0.5, y: 2.0, w: "90%", h: 1.5,
  fontSize: 54, bold: true, color: PRIMARY, align: "center", fontFace: "Calibri"
});

s12.addText("Questions & Feedback Welcome", {
  x: 0.5, y: 3.3, w: "90%", h: 0.5,
  fontSize: 20, color: SLATE_GRAY, align: "center", italic: true, fontFace: "Calibri"
});

// ─── Write File ───────────────────────────────────────────────
pptx.writeFile({ fileName: "Fitness_Planner_AI_Presentation.pptx" }).then(fileName => {
  console.log(`✅  Created: ${fileName}`);
});

