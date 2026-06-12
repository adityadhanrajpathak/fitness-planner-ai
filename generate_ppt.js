const pptxgen = require("pptxgenjs");

let pptx = new pptxgen();

// Slide 1: Title
let slide1 = pptx.addSlide();
slide1.addText("CAPSTONE PROJECT", { x: 1, y: 1, w: "80%", h: 1, fontSize: 36, bold: true, color: "00A2D9", align: "center" });
slide1.addText("Fitness Planner AI", { x: 1, y: 2, w: "80%", h: 1, fontSize: 28, bold: true, color: "00A2D9", align: "center" });
slide1.addText("Presented By:\n1. Student Name- M NANTHINI\n2. College Name- XYZ\n3. Department- CSE", { x: 1, y: 3.5, w: "80%", h: 1.5, fontSize: 18, color: "00A2D9", align: "center" });

// Slide 2: OUTLINE
let slide2 = pptx.addSlide();
slide2.addText("OUTLINE", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide2.addText([
  { text: "Problem Statement\n" },
  { text: "Proposed Solution\n" },
  { text: "System Approach\n" },
  { text: "Algorithm & Deployment\n" },
  { text: "Result\n" },
  { text: "Conclusion & Future Scope\n" },
  { text: "References" }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 3: PROBLEM STATEMENT
let slide3 = pptx.addSlide();
slide3.addText("PROBLEM STATEMENT", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide3.addText([
  { text: "Generic Solutions: Most fitness applications offer generic workout and diet routines that do not account for individual body metrics or dietary constraints.\n" },
  { text: "Cost Barriers: Premium fitness coaching, specialized dietitians, and personalized gym training are expensive.\n" },
  { text: "Data Privacy Concerns: Many health apps rely on third-party APIs, raising concerns about sharing sensitive body metric data externally." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 4: PROPOSED SOLUTION
let slide4 = pptx.addSlide();
slide4.addText("PROPOSED SOLUTION", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide4.addText([
  { text: "Personalization: A web app that generates custom workout routines and 3-meal diet plans based on user metrics (age, weight, height, activity).\n" },
  { text: "Local Processing Engine: Built-in AI engine runs entirely on the backend server, eliminating third-party APIs and ensuring data privacy.\n" },
  { text: "Scientific Foundation: Utilizes established sports-science equations (e.g., Mifflin-St Jeor formula) for accurate caloric targets and macronutrients." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 5: SYSTEM APPROACH
let slide5 = pptx.addSlide();
slide5.addText("SYSTEM APPROACH", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide5.addText([
  { text: "Architecture: A robust Single Page Application (SPA) communicating with a secure RESTful API.\n" },
  { text: "Frontend: HTML5, CSS3, and modular Vanilla JavaScript for a fast, responsive dynamic dashboard.\n" },
  { text: "Backend: Node.js and Express.js, handling all routing and logic operations.\n" },
  { text: "Database & Security: Uses better-sqlite3 for local storage. Implements JWT and bcryptjs for secure authentication." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 6: ALGORITHM & DEPLOYMENT
let slide6 = pptx.addSlide();
slide6.addText("ALGORITHM & DEPLOYMENT", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide6.addText([
  { text: "BMR & TDEE Calculation: Uses Mifflin-St Jeor Equation with activity multipliers (1.2 - 1.9).\n" },
  { text: "Macro Splitting: Calculates specific protein (1.6g/kg floor), carbohydrate, and fat ratios based on goal (weight loss, maintain, muscle gain).\n" },
  { text: "Generative Algorithm: Dynamically selects exercises and meals from an internal local database that matches the user's needs.\n" },
  { text: "Deployment: Hosted locally (or Render/Vercel) using Node.js, running seamlessly across any modern web browser." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 7: RESULT
let slide7 = pptx.addSlide();
slide7.addText("RESULT", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide7.addText([
  { text: "Functional Dashboard: Users view real-time BMI, BMR, daily caloric needs, and daily water intake.\n" },
  { text: "Tailored Diet Plans: Successfully generates customized daily meal plans aligned strictly with caloric targets.\n" },
  { text: "Custom Workout Routines: Delivers structured, day-by-day exercise regimes matched to available equipment and goals.\n" },
  { text: "Secure Flow: User registration, profile management, and login workflows are fully operational." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 8: CONCLUSION
let slide8 = pptx.addSlide();
slide8.addText("CONCLUSION", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide8.addText([
  { text: "The Fitness Planner AI successfully bridges the gap between generic fitness apps and expensive personal coaching.\n" },
  { text: "By leveraging server-side algorithmic generation, the application provides scientifically sound health recommendations.\n" },
  { text: "The system proves that effective, highly personalized health planning can be achieved efficiently without external AI dependencies." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 9: FUTURE SCOPE
let slide9 = pptx.addSlide();
slide9.addText("FUTURE SCOPE", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide9.addText([
  { text: "Wearable Integration: Syncing the platform with smartwatches for real-time calorie tracking.\n" },
  { text: "Progress Analytics: Adding visual graphs to track weight change and strength improvements.\n" },
  { text: "Expanded Database: Incorporating more culturally diverse food datasets and advanced workout variations.\n" },
  { text: "Mobile Application: Converting the web app into native iOS and Android apps." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 10: REFERENCES
let slide10 = pptx.addSlide();
slide10.addText("REFERENCES", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide10.addText([
  { text: "Mifflin, M. D., et al. (1990). 'A new predictive equation for resting energy expenditure in healthy individuals.' The American Journal of Clinical Nutrition.\n" },
  { text: "Node.js Documentation: https://nodejs.org/\n" },
  { text: "Express.js Framework: https://expressjs.com/\n" },
  { text: "JSON Web Tokens (JWT) Industry Standards: https://jwt.io/" }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 11: APPENDIX
let slide11 = pptx.addSlide();
slide11.addText("APPENDIX", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "00A2D9" });
slide11.addText([
  { text: "Key Code Snippet: The server/ai/engine.js file contains the core local BMR calculation and macro splitting logic.\n" },
  { text: "Database Schema: User table includes id, name, email, password, age, weight, height, activityLevel, and goal." }
], { x: 0.5, y: 1.5, w: "90%", h: 3.5, fontSize: 18, bullet: true });

// Slide 12: THANK YOU
let slide12 = pptx.addSlide();
slide12.addText("THANK YOU", { x: 0.5, y: 2, w: "100%", h: 1, fontSize: 40, bold: true, color: "00A2D9", align: "center" });

pptx.writeFile({ fileName: "Fitness_Planner_AI_Presentation.pptx" }).then(fileName => {
    console.log(`created file: ${fileName}`);
});
