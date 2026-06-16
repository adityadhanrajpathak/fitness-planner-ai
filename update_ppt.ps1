$pptApp = New-Object -ComObject PowerPoint.Application
$pptPath = "C:\Users\adity\Downloads\Fitness_Planner_AI_Capstone_Presentation.pptx"
$ppt = $pptApp.Presentations.Open($pptPath, $false, $false, $false)

# Slide 1
$slide1 = $ppt.Slides.Item(1)
$toDelete1 = @()
foreach ($shape in $slide1.Shapes) {
    if ($shape.Name -eq "TextBox 2") {
        $toDelete1 += $shape
    }
}
foreach ($shape in $toDelete1) { $shape.Delete() }

foreach ($shape in $slide1.Shapes) {
    if ($shape.Name -eq "TextBox 3") {
        $shape.TextFrame.TextRange.Text = "Presented By:`n1.  Student Name- Aditya Dhanraj`n2.  College Name- Gandhi Engineering College`n3.  Department- CSE"
        $shape.TextFrame.TextRange.Font.Color.RGB = 0x00A2E8
        $shape.TextFrame.TextRange.Font.Size = 16
        $shape.TextFrame.TextRange.Font.Bold = $true
    }
}

# Slide 3
$slide3 = $ppt.Slides.Item(3)
foreach ($shape in $slide3.Shapes) {
    if ($shape.Name -eq "Content Placeholder 1") {
        $shape.TextFrame.TextRange.Text = "Personalized Workout & Diet Planner with AI`nMost fitness apps give generic workout or diet plans that don't consider individual student needs, cultural food habits, or available resources. Students require a system that generates personalized routines and meal plans using AI, ensuring they are practical, budget-friendly, and effective."
        $shape.TextFrame.TextRange.Font.Size = 16
        $shape.TextFrame.TextRange.Paragraphs(1).Font.Bold = $true
    }
}

# Slide 4
$slide4 = $ppt.Slides.Item(4)
foreach ($shape in $slide4.Shapes) {
    if ($shape.Name -eq "Content Placeholder 1") {
        $shape.TextFrame.TextRange.Text = "AI-powered customization calculates BMR, TDEE, BMI, and calorie budgets in real-time.`n100% local processing runs the rules engine entirely on the backend server, protecting user privacy.`nScientific accuracy using Mifflin-St Jeor formulas and balanced macro planning.`nCultural diet customization tailored to North/South Indian, Jain, Vegan, and Mixed food preferences.`nFree and open-source platform, removing financial barriers to personal coaching."
        $shape.TextFrame.TextRange.Font.Size = 14
    }
}

# Slide 5
$slide5 = $ppt.Slides.Item(5)
foreach ($shape in $slide5.Shapes) {
    if ($shape.Name -eq "Rectangle 1") {
        $shape.TextFrame.TextRange.Text = "Frontend Tech Stack:`nHTML5, Custom CSS3, and Modular Vanilla JavaScript for a fast, responsive Single Page Application (SPA).`nBackend Server & Logic:`nNode.js and Express.js REST API with a local rules engine running calculations.`nDatabase & Security:`nbetter-sqlite3 database for user profiles and datasets, secured with JWT and bcryptjs."
        $shape.TextFrame.TextRange.Font.Size = 13
        $shape.Width = 850
        $shape.Height = 380
        $shape.Top = 110
        $shape.Left = 45
    }
}

# Slide 6
$slide6 = $ppt.Slides.Item(6)
foreach ($shape in $slide6.Shapes) {
    if ($shape.Name -eq "Rectangle 1") {
        $shape.TextFrame.TextRange.Text = "BMR Calculation: Mifflin-St Jeor Formula -> BMR = (10 * W) + (6.25 * H) - (5 * A) + s (s is +5 for men, -161 for women).`nTDEE Calculation: BMR * Activity Multiplier (1.2 for sedentary up to 1.9 for active).`nGoal Matching: Muscle gain (+300 to +500 kcal) or fat loss (-500 to -750 kcal) adjust target intake.`nMacro Distribution: Set to 1.6g/kg minimum protein, 50% carbohydrates, and 25% fats.`nDeployment: CI/CD workflow deploying the Express server and client files to Vercel."
        $shape.TextFrame.TextRange.Font.Size = 14
        $shape.Width = 850
        $shape.Height = 350
        $shape.Top = 110
        $shape.Left = 45
    }
}

# Slide 7
$slide7 = $ppt.Slides.Item(7)
foreach ($shape in $slide7.Shapes) {
    if ($shape.Name -eq "Rectangle 1") {
        $shape.TextFrame.TextRange.Text = "Fully functional, responsive web application launched and publicly accessible.`nInstant generation of custom 7-day workout plans matching fitness level and available equipment.`nDaily meal plans generated according to calorie budgets and macro goals.`nInteractive user dashboard showing logs, stats, and a daily completion checklist.`nSecure login sessions with profile editing and persistence.`nAdministrator portal to monitor user metrics and server statistics."
        $shape.TextFrame.TextRange.Font.Size = 14
        $shape.Width = 850
        $shape.Height = 350
        $shape.Top = 110
        $shape.Left = 45
    }
}

# Slide 8
$slide8 = $ppt.Slides.Item(8)
foreach ($shape in $slide8.Shapes) {
    if ($shape.Name -eq "Content Placeholder 1") {
        $shape.TextFrame.TextRange.Text = "Created a local, privacy-first alternative to commercial health and fitness tracking apps.`nProved that high-quality, scientifically sound personalization can be achieved locally without external AI APIs.`nRemoved the cost barriers of structured fitness coaching by offering a free platform.`nImproved diet adherence by directly integrating cultural food profiles into the meal generator."
        $shape.TextFrame.TextRange.Font.Size = 14
    }
}

# Slide 9
$slide9 = $ppt.Slides.Item(9)
foreach ($shape in $slide9.Shapes) {
    if ($shape.Name -eq "Title 4") {
        $shape.TextFrame.TextRange.Text = "Future Scope"
        $shape.TextFrame.TextRange.Font.Size = 22
        $shape.TextFrame.TextRange.Font.Bold = $true
        $shape.TextFrame.TextRange.Font.Color.RGB = 0x0E76A8
    }
    if ($shape.Name -eq "Rectangle 3") {
        $shape.TextFrame.TextRange.Text = "Mobile Applications: Port the responsive client to iOS and Android versions using React Native or Flutter.`nWearable Integration: Sync with smartwatches and health apps (Apple Health, Google Fit) for live tracking.`nConversational AI Coach: Integrate a lightweight local LLM (e.g., Llama 3) for conversational advice.`nProgress Analytics: Add interactive graphs to track weight trends and strength progress over time.`nExpanded Food Database: Include local grocery pricing and wider global cultural diets."
        $shape.TextFrame.TextRange.Font.Size = 14
        $shape.TextFrame.TextRange.ParagraphFormat.Bullet.Type = 1
        $shape.Width = 850
        $shape.Height = 350
        $shape.Top = 120
        $shape.Left = 45
    }
}

# Slide 10
$slide10 = $ppt.Slides.Item(10)
$toDelete10 = @()
foreach ($shape in $slide10.Shapes) {
    if ($shape.Name -eq "TextBox 2") {
        $shape.TextFrame.TextRange.Text = "Mifflin, M. D., et al. (1990). A new predictive equation for resting energy expenditure. AJCN.`nNode.js Runtime & Express.js Web Application Framework Documentation.`nJSON Web Token (JWT) Specifications & bcryptjs Encryption Standards.`npptxgenjs Presentation Library & SQLite Relational Database Engine."
        $shape.TextFrame.TextRange.Font.Size = 14
        $shape.TextFrame.TextRange.ParagraphFormat.Bullet.Type = 1
        $shape.Width = 850
        $shape.Height = 320
        $shape.Top = 110
        $shape.Left = 45
    }
    if ($shape.Name -in "TextBox 5", "TextBox 7", "TextBox 9") {
        $toDelete10 += $shape
    }
}
foreach ($shape in $toDelete10) { $shape.Delete() }

# Slide 11
$slide11 = $ppt.Slides.Item(11)
foreach ($shape in $slide11.Shapes) {
    if ($shape.Name -eq "Title 1") {
        $shape.TextFrame.TextRange.Text = "APPLICATION LINKS"
    }
    if ($shape.Name -eq "Content Placeholder 2") {
        $shape.TextFrame.TextRange.Text = "Live Deployed Application:`nhttps://fitness-seven-sand.vercel.app`n`nSource Code Repository:`nhttps://github.com/adityadhanrajpathak/fitness-planner-ai"
        $shape.TextFrame.TextRange.Font.Size = 18
        
        $line2 = $shape.TextFrame.TextRange.Lines(2)
        $action2 = $line2.ActionSettings.Item(1)
        $action2.Action = 7
        $action2.Hyperlink.Address = "https://fitness-seven-sand.vercel.app"
        $line2.Font.Underline = $true
        $line2.Font.Color.RGB = 0x00A2E8
        
        $line5 = $shape.TextFrame.TextRange.Lines(5)
        $action5 = $line5.ActionSettings.Item(1)
        $action5.Action = 7
        $action5.Hyperlink.Address = "https://github.com/adityadhanrajpathak/fitness-planner-ai"
        $line5.Font.Underline = $true
        $line5.Font.Color.RGB = 0x00A2E8
    }
}

$ppt.Save()
$ppt.Close()
$pptApp.Quit()
Write-Host "Success: Edited and removed unwanted spaces"
