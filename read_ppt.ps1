$pptApp = New-Object -ComObject PowerPoint.Application
$pptPath = "C:\Users\adity\Downloads\Fitness_Planner_AI_Capstone_Presentation.pptx"
$ppt = $pptApp.Presentations.Open($pptPath, $true, $true, $false)
for ($idx = 1; $idx -le $ppt.Slides.Count; $idx++) {
    $slide = $ppt.Slides.Item($idx)
    Write-Host "=== Slide $idx ==="
    foreach ($shape in $slide.Shapes) {
        $text = ""
        if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
            $text = $shape.TextFrame.TextRange.Text
        }
        Write-Host "Shape: Name=$($shape.Name), Type=$($shape.Type), Left=$($shape.Left), Top=$($shape.Top), Width=$($shape.Width), Height=$($shape.Height), Text='$text'"
    }
}
$ppt.Close()
$pptApp.Quit()
