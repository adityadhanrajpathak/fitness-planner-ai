$pptApp = New-Object -ComObject PowerPoint.Application
$pptApp.Visible = 1
$pptPath = "C:\Users\adity\OneDrive\Documents\Desktop\fitness\Fitness_Planner_AI_Presentation.pptx"
$pdfPath = "C:\Users\adity\OneDrive\Documents\Desktop\fitness\Fitness_Planner_AI_Presentation.pdf"
$ppt = $pptApp.Presentations.Open($pptPath)
$ppt.SaveAs($pdfPath, 32)
$ppt.Close()
$pptApp.Quit()
Write-Host "PDF created successfully at: $pdfPath"
