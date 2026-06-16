$pptApp = New-Object -ComObject PowerPoint.Application
$pptPath = "C:\Users\adity\Downloads\Fitness_Planner_AI_Capstone_Presentation.pptx"
$ppt = $pptApp.Presentations.Open($pptPath, $false, $false, $false)

$slide11 = $ppt.Slides.Item(11)
foreach ($shape in $slide11.Shapes) {
    if ($shape.Name -eq "Content Placeholder 2") {
        $tr = $shape.TextFrame.TextRange
        $line2 = $tr.Lines(2)
        $action2 = $line2.ActionSettings.Item(1)
        $action2.Action = 7
        $action2.Hyperlink.Address = "https://fitness-seven-sand.vercel.app"
        
        $line5 = $tr.Lines(5)
        $action5 = $line5.ActionSettings.Item(1)
        $action5.Action = 7
        $action5.Hyperlink.Address = "https://github.com/adityadhanrajpathak/fitness-planner-ai"
    }
}

$ppt.Save()
$ppt.Close()
$pptApp.Quit()
Write-Host "Success: Links made clickable"
