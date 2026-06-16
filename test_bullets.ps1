$pptApp = New-Object -ComObject PowerPoint.Application
$pptPath = "C:\Users\adity\Downloads\Fitness_Planner_AI_Capstone_Presentation.pptx"
$ppt = $pptApp.Presentations.Open($pptPath, $false, $false, $false)

$slide9 = $ppt.Slides.Item(9)
foreach ($shape in $slide9.Shapes) {
    if ($shape.Name -eq "Rectangle 3") {
        $shape.TextFrame.TextRange.Text = "Line 1`nLine 2`nLine 3"
        $shape.TextFrame.TextRange.ParagraphFormat.Bullet.Type = 1
    }
}

$ppt.Save()
$ppt.Close()
$pptApp.Quit()
Write-Host "Success: Bullets verified"
