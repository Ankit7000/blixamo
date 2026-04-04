param(
  [string[]]$Slugs = @()
)

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$PostsDir = Join-Path $RepoRoot 'content\posts'
$ImagesDir = Join-Path $RepoRoot 'public\images\posts'
$AuthorAvatar = Join-Path $RepoRoot 'public\images\author-avatar.jpg'

$CategoryMap = @{
  'how-to' = @{ Label = 'HOW-TO'; Symbol = 'CLI'; Color = '#0891b2'; Accent = '#0ea5e9' }
  'ai' = @{ Label = 'AI'; Symbol = 'AI'; Color = '#7c3aed'; Accent = '#a78bfa' }
  'developer-tools' = @{ Label = 'DEV TOOLS'; Symbol = 'DEV'; Color = '#d97706'; Accent = '#f59e0b' }
  'indie-hacking' = @{ Label = 'INDIE'; Symbol = 'BIZ'; Color = '#e11d48'; Accent = '#fb7185' }
  'self-hosting' = @{ Label = 'SELF HOST'; Symbol = 'OPS'; Color = '#059669'; Accent = '#34d399' }
  'vps-cloud' = @{ Label = 'VPS'; Symbol = 'VPS'; Color = '#2563eb'; Accent = '#60a5fa' }
  'web-dev' = @{ Label = 'WEB DEV'; Symbol = 'WEB'; Color = '#ea580c'; Accent = '#fb923c' }
  'automation' = @{ Label = 'AUTOMATION'; Symbol = 'AUT'; Color = '#db2777'; Accent = '#f472b6' }
  'free-tools' = @{ Label = 'FREE TOOLS'; Symbol = 'OSS'; Color = '#0d9488'; Accent = '#2dd4bf' }
}

function Get-HexColor([string]$Hex, [int]$Alpha = 255) {
  $hexValue = $Hex.TrimStart('#')
  return [System.Drawing.Color]::FromArgb(
    $Alpha,
    [Convert]::ToInt32($hexValue.Substring(0, 2), 16),
    [Convert]::ToInt32($hexValue.Substring(2, 2), 16),
    [Convert]::ToInt32($hexValue.Substring(4, 2), 16)
  )
}

function Get-MdxValue([string]$Text, [string]$Key) {
  $pattern = '(?m)^{0}:\s*"?([^"\r\n]+)"?' -f [regex]::Escape($Key)
  $match = [regex]::Match($Text, $pattern)
  if ($match.Success) { return $match.Groups[1].Value.Trim() }
  return ''
}

function Set-MdxValue([string]$Text, [string]$Key, [string]$Value) {
  $replacePattern = '(?m)^{0}:\s*.*$' -f [regex]::Escape($Key)
  $replaceValue = ('{0}: "{1}"' -f $Key, $Value)

  if ([regex]::IsMatch($Text, $replacePattern)) {
    return [regex]::Replace($Text, $replacePattern, $replaceValue)
  }

  $frontmatter = [regex]::Match($Text, '(?s)^---\r?\n.*?\r?\n---')
  if (-not $frontmatter.Success) {
    throw 'Frontmatter block missing in post content'
  }

  $replacement = $frontmatter.Value -replace '\r?\n---$', ("`r`n{0}`r`n---" -f $replaceValue)
  return $Text.Substring(0, $frontmatter.Index) + $replacement + $Text.Substring($frontmatter.Index + $frontmatter.Length)
}

function Get-ReadingTimeLabel([string]$Body) {
  $wordCount = ($Body -split '\s+' | Where-Object { $_ }).Count
  $minutes = [math]::Max([math]::Ceiling($wordCount / 200), 1)
  return "$minutes min read"
}

function Get-CategoryStyle([string]$Category) {
  $key = $Category.ToLower().Trim()
  if ($CategoryMap.ContainsKey($key)) {
    return $CategoryMap[$key]
  }
  return @{ Label = 'BLIXAMO'; Symbol = 'BLX'; Color = '#6c63ff'; Accent = '#a78bfa' }
}

function Get-ShortLabel([string]$Text, [int]$Max = 8) {
  $clean = ($Text -replace '[^A-Za-z0-9+.]', ' ').Trim()
  if (-not $clean) { return 'ITEM' }

  $parts = $clean -split '\s+' | Where-Object { $_ }
  if ($parts.Count -gt 1) {
    $abbr = ($parts | ForEach-Object { $_.Substring(0, 1) }) -join ''
    if ($abbr.Length -ge 2 -and $abbr.Length -le $Max) {
      return $abbr.ToUpperInvariant()
    }
  }

  if ($clean.Length -gt $Max) {
    return $clean.Substring(0, $Max).ToUpperInvariant()
  }

  return $clean.ToUpperInvariant()
}

function Get-CompareLabel([string]$Part) {
  $cleanPart = ($Part -replace '(?i)\s+for\s+.*$', '').Trim()
  if (-not $cleanPart) { return 'ITEM' }

  $normalized = $cleanPart.ToLowerInvariant()
  $knownMatches = @(
    @{ Pattern = 'chatgpt|gpt-4o|gpt4o|gpt-4|gpt4'; Label = 'GPT' }
    @{ Pattern = 'claude'; Label = 'CLAUDE' }
    @{ Pattern = 'openai'; Label = 'OPENAI' }
    @{ Pattern = 'hetzner'; Label = 'HETZNER' }
    @{ Pattern = 'digitalocean'; Label = 'DO' }
    @{ Pattern = 'lightsail'; Label = 'LIGHTSAIL' }
    @{ Pattern = 'linode'; Label = 'LINODE' }
    @{ Pattern = 'vultr'; Label = 'VULTR' }
    @{ Pattern = 'aws'; Label = 'AWS' }
    @{ Pattern = 'oracle'; Label = 'ORACLE' }
    @{ Pattern = 'postgresql|postgres'; Label = 'POSTGRES' }
    @{ Pattern = '\bn8n\b'; Label = 'N8N' }
    @{ Pattern = 'zapier'; Label = 'ZAPIER' }
    @{ Pattern = '\bmake\b'; Label = 'MAKE' }
    @{ Pattern = 'coolify'; Label = 'COOLIFY' }
    @{ Pattern = 'caprover'; Label = 'CAPROVER' }
    @{ Pattern = 'dokku'; Label = 'DOKKU' }
    @{ Pattern = 'tailwind'; Label = 'TAILWIND' }
    @{ Pattern = 'css modules'; Label = 'CSS MOD' }
    @{ Pattern = 'wise'; Label = 'WISE' }
    @{ Pattern = 'payoneer'; Label = 'PAYONEER' }
  )

  foreach ($match in $knownMatches) {
    if ($normalized -match $match.Pattern) {
      return $match.Label
    }
  }

  $words = ($cleanPart -replace '[^A-Za-z0-9+.]', ' ' -split '\s+') | Where-Object { $_ }
  $candidate = $words | Where-Object {
    $_.Length -gt 1 -and $_.ToLowerInvariant() -notin @('best', 'free', 'developers', 'developer', 'guide', 'setup', 'complete', 'which', 'one')
  } | Select-Object -First 1

  if ($candidate) {
    return Get-ShortLabel $candidate 8
  }

  return Get-ShortLabel $cleanPart 8
}

function Get-Intent([hashtable]$Post) {
  $title = $Post.Title.ToLowerInvariant()
  $category = $Post.Category.ToLowerInvariant()

  if ($title -match '\bvs\b|comparison|compare|which wins') { return 'comparison' }
  if ($title -match 'security|harden|ssh|firewall|lock|shield') { return 'security' }
  if ($title -match 'search console|seo|index|traffic|query') { return 'seo' }
  if ($title -match 'performance|speed|slow|load time|optimization|306ms') { return 'performance' }
  if ($title -match 'postgres|database|sql') { return 'database' }
  if ($title -match '^\d+\s|\bbest\b|open source|free tools|worth switching') { return 'tool-grid' }
  if ($title -match 'automation|n8n|workflow|claude|chatgpt|openai|bot|assistant|ai') { return 'automation' }
  if ($category -eq 'indie-hacking' -or $title -match 'card|payment|billing|saas|freelancer|wise|payoneer|razorpay') { return 'business' }
  if ($title -match 'how to|guide|setup|deploy|install|integration|complete') { return 'guide' }
  if ($category -in @('self-hosting', 'vps-cloud')) { return 'infrastructure' }
  return 'guide'
}

function Get-CompareLabels([string]$Title) {
  $compact = ($Title -replace '\s+in\s+20\d\d.*$', '') -replace '\s+[-\u2014].*$', ''
  $parts = $compact -split '(?i)\s+vs\s+'
  if ($parts.Count -lt 2) {
    return @('A', 'B', 'C')
  }

  $labels = foreach ($part in $parts) {
    Get-CompareLabel $part
  }

  return $labels[0..([Math]::Min($labels.Count - 1, 2))]
}

function Get-GuideSteps([hashtable]$Post) {
  $title = $Post.Title.ToLowerInvariant()
  if ($title -match 'next\.js|nextjs') { return @('VPS', 'BUILD', 'LIVE') }
  if ($title -match 'nginx|proxy') { return @('ROUTE', 'TLS', 'SHIP') }
  if ($title -match 'docker|compose|coolify') { return @('IMAGE', 'STACK', 'DEPLOY') }
  if ($title -match 'search console|seo') { return @('VERIFY', 'MAP', 'INDEX') }
  if ($title -match 'telegram|whatsapp|bot') { return @('INPUT', 'LOGIC', 'REPLY') }
  return @('PREP', 'CONFIG', 'SHIP')
}

function Get-ToolLabels([hashtable]$Post) {
  switch ($Post.Category) {
    'ai' { return @('LLM', 'API', 'BOT', 'OPS') }
    'developer-tools' { return @('CLI', 'IDE', 'DB', 'OPS') }
    'free-tools' { return @('OSS', 'CI', 'HOST', 'MON') }
    'web-dev' { return @('WEB', 'UI', 'SSR', 'DX') }
    default { return @('APP', 'OPS', 'DB', 'AUT') }
  }
}

function New-RoundRectPath([float]$X, [float]$Y, [float]$Width, [float]$Height, [float]$Radius) {
  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundRect($Graphics, $Brush, [float]$X, [float]$Y, [float]$Width, [float]$Height, [float]$Radius) {
  $path = New-RoundRectPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  $Graphics.FillPath($Brush, $path)
  $path.Dispose()
}

function Draw-RoundRect($Graphics, $Pen, [float]$X, [float]$Y, [float]$Width, [float]$Height, [float]$Radius) {
  $path = New-RoundRectPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  $Graphics.DrawPath($Pen, $path)
  $path.Dispose()
}

function Draw-Chip($Graphics, [string]$Text, [float]$X, [float]$Y, [System.Drawing.Color]$BorderColor, [System.Drawing.Color]$FillColor, [System.Drawing.Color]$TextColor) {
  $font = New-Object System.Drawing.Font('Segoe UI Semibold', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $size = $Graphics.MeasureString($Text, $font)
  $width = [math]::Ceiling($size.Width) + 26
  $height = 34
  $fillBrush = New-Object System.Drawing.SolidBrush($FillColor)
  $borderPen = New-Object System.Drawing.Pen($BorderColor, 1)
  $textBrush = New-Object System.Drawing.SolidBrush($TextColor)
  Fill-RoundRect $Graphics $fillBrush $X $Y $width $height 17
  Draw-RoundRect $Graphics $borderPen $X $Y $width $height 17
  $Graphics.DrawString($Text, $font, $textBrush, $X + 13, $Y + 8)
  $fillBrush.Dispose(); $borderPen.Dispose(); $textBrush.Dispose(); $font.Dispose()
  return $width
}

function Draw-Grid($Graphics) {
  $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 255, 255, 255), 1)
  for ($x = 0; $x -le 1200; $x += 48) { $Graphics.DrawLine($linePen, $x, 0, $x, 630) }
  for ($y = 0; $y -le 630; $y += 48) { $Graphics.DrawLine($linePen, 0, $y, 1200, $y) }
  $linePen.Dispose()
}

function Draw-Title($Graphics, [string]$Title, [float]$X, [float]$Y, [float]$Width) {
  $sizes = @(58, 52, 46, 40)
  foreach ($size in $sizes) {
    $font = New-Object System.Drawing.Font('Segoe UI Semibold', $size, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $lineHeight = [math]::Round($size * 1.12)
    $words = $Title -split '\s+'
    $lines = New-Object System.Collections.Generic.List[string]
    $line = ''
    foreach ($word in $words) {
      $test = if ($line) { "$line $word" } else { $word }
      $measure = $Graphics.MeasureString($test, $font)
      if ($measure.Width -gt $Width -and $line) {
        $lines.Add($line)
        $line = $word
      } else {
        $line = $test
      }
    }
    if ($line) { $lines.Add($line) }

    if ($lines.Count -le 3) {
      $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
      for ($i = 0; $i -lt $lines.Count; $i++) {
        $Graphics.DrawString($lines[$i], $font, $brush, $X, $Y + ($i * $lineHeight))
      }
      $brush.Dispose(); $font.Dispose()
      return $Y + ($lines.Count * $lineHeight)
    }
    $font.Dispose()
  }

  return $Y + 150
}

function Draw-PanelFrame($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  $panelRect = [System.Drawing.Rectangle]::new(760, 76, 380, 478)
  $panelFill = New-Object System.Drawing.Drawing2D.LinearGradientBrush($panelRect, [System.Drawing.Color]::FromArgb(56, $PrimaryColor), [System.Drawing.Color]::FromArgb(28, $AccentColor), 90)
  $panelBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 255, 255, 255), 1)
  Fill-RoundRect $Graphics $panelFill 760 76 380 478 28
  Draw-RoundRect $Graphics $panelBorder 760 76 380 478 28
  $panelFill.Dispose(); $panelBorder.Dispose()
}

function Draw-Node($Graphics, [float]$X, [float]$Y, [float]$Size, [string]$Label, [System.Drawing.Color]$Fill, [System.Drawing.Color]$Border, [System.Drawing.Color]$TextColor) {
  $fillBrush = New-Object System.Drawing.SolidBrush($Fill)
  $borderPen = New-Object System.Drawing.Pen($Border, 1)
  Fill-RoundRect $Graphics $fillBrush $X $Y $Size $Size 18
  Draw-RoundRect $Graphics $borderPen $X $Y $Size $Size 18
  $font = New-Object System.Drawing.Font('Segoe UI Semibold', 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $textBrush = New-Object System.Drawing.SolidBrush($TextColor)
  $sizeMeasure = $Graphics.MeasureString($Label, $font)
  $Graphics.DrawString($Label, $font, $textBrush, $X + (($Size - $sizeMeasure.Width) / 2), $Y + (($Size - $sizeMeasure.Height) / 2) - 2)
  $fillBrush.Dispose(); $borderPen.Dispose(); $font.Dispose(); $textBrush.Dispose()
}

function Draw-ComparisonVisual($Graphics, [hashtable]$Post, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $labels = Get-CompareLabels $Post.Title
  $nodes = @(
    @{ X = 810; Y = 155; Label = $labels[0] },
    @{ X = 980; Y = 155; Label = if ($labels.Count -gt 1) { $labels[1] } else { 'ALT' } },
    @{ X = 895; Y = 330; Label = if ($labels.Count -gt 2) { $labels[2] } else { 'BEST' } }
  )
  foreach ($node in $nodes) {
    Draw-Node $Graphics $node.X $node.Y 110 $node.Label ([System.Drawing.Color]::FromArgb(168, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $PrimaryColor)) ([System.Drawing.Color]::White)
  }
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $AccentColor), 3)
  $Graphics.DrawLine($pen, 920, 210, 980, 210)
  $Graphics.DrawLine($pen, 920, 265, 950, 330)
  $Graphics.DrawLine($pen, 1035, 265, 1005, 330)
  $vsFont = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $vsBrush = New-Object System.Drawing.SolidBrush($AccentColor)
  $Graphics.DrawString('VS', $vsFont, $vsBrush, 947, 220)
  $pen.Dispose(); $vsFont.Dispose(); $vsBrush.Dispose()
}

function Draw-GuideVisual($Graphics, [hashtable]$Post, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $steps = Get-GuideSteps $Post
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $AccentColor), 4)
  $Graphics.DrawLine($pen, 830, 315, 1065, 315)
  $positions = @(810, 925, 1040)
  for ($i = 0; $i -lt 3; $i++) {
    Draw-Node $Graphics $positions[$i] 260 90 ("0{0}" -f ($i + 1)) ([System.Drawing.Color]::FromArgb(168, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $PrimaryColor)) ([System.Drawing.Color]::White)
    $font = New-Object System.Drawing.Font('Segoe UI Semibold', 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $Graphics.DrawString($steps[$i], $font, $brush, $positions[$i] - 5, 372)
    $font.Dispose(); $brush.Dispose()
  }
  $bannerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 12, 18, 30))
  Fill-RoundRect $Graphics $bannerBrush 825 150 260 62 16
  $bannerBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, $PrimaryColor), 1)
  Draw-RoundRect $Graphics $bannerBorder 825 150 260 62 16
  $font2 = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush2 = New-Object System.Drawing.SolidBrush($AccentColor)
  $Graphics.DrawString('SETUP FLOW', $font2, $brush2, 855, 166)
  $bannerBrush.Dispose(); $bannerBorder.Dispose(); $font2.Dispose(); $brush2.Dispose(); $pen.Dispose()
}

function Draw-ToolGridVisual($Graphics, [hashtable]$Post, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $labels = Get-ToolLabels $Post
  $positions = @(
    @{ X = 808; Y = 150 }, @{ X = 958; Y = 150 },
    @{ X = 808; Y = 300 }, @{ X = 958; Y = 300 }
  )
  for ($i = 0; $i -lt 4; $i++) {
    Draw-Node $Graphics $positions[$i].X $positions[$i].Y 110 $labels[$i] ([System.Drawing.Color]::FromArgb(168, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $PrimaryColor)) ([System.Drawing.Color]::White)
  }
  $font = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($AccentColor)
  $Graphics.DrawString('STACK PICKS', $font, $brush, 855, 450)
  $font.Dispose(); $brush.Dispose()
}

function Draw-InfrastructureVisual($Graphics, [hashtable]$Post, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $rackFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 15, 23, 42))
  $rackBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $PrimaryColor), 1)
  for ($i = 0; $i -lt 3; $i++) {
    $y = 150 + ($i * 92)
    Fill-RoundRect $Graphics $rackFill 825 $y 240 66 14
    Draw-RoundRect $Graphics $rackBorder 825 $y 240 66 14
    for ($j = 0; $j -lt 4; $j++) {
      $indicatorBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, $AccentColor))
      $Graphics.FillEllipse($indicatorBrush, 850 + ($j * 32), $y + 26, 12, 12)
      $indicatorBrush.Dispose()
    }
  }
  $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $AccentColor), 3)
  $Graphics.DrawLine($linePen, 945, 420, 945, 465)
  $Graphics.DrawLine($linePen, 945, 465, 1090, 465)
  Draw-Node $Graphics 1045 420 90 'LIVE' ([System.Drawing.Color]::FromArgb(168, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $AccentColor)) ([System.Drawing.Color]::White)
  $rackFill.Dispose(); $rackBorder.Dispose(); $linePen.Dispose()
}

function Draw-DatabaseVisual($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, $PrimaryColor), 3)
  $fill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(168, 15, 23, 42))
  for ($i = 0; $i -lt 3; $i++) {
    $y = 175 + ($i * 72)
    $Graphics.FillEllipse($fill, 860, $y, 180, 44)
    $Graphics.FillRectangle($fill, 860, $y + 22, 180, 28)
    $Graphics.DrawEllipse($pen, 860, $y, 180, 44)
    $Graphics.DrawLine($pen, 860, $y + 22, 860, $y + 50)
    $Graphics.DrawLine($pen, 1040, $y + 22, 1040, $y + 50)
  }
  $font = New-Object System.Drawing.Font('Segoe UI', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($AccentColor)
  $Graphics.DrawString('QUERY STACK', $font, $brush, 845, 430)
  $pen.Dispose(); $fill.Dispose(); $font.Dispose(); $brush.Dispose()
}

function Draw-AutomationVisual($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  Draw-Node $Graphics 915 220 90 'AI' ([System.Drawing.Color]::FromArgb(168, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $PrimaryColor)) ([System.Drawing.Color]::White)
  Draw-Node $Graphics 805 150 78 'API' ([System.Drawing.Color]::FromArgb(160, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $AccentColor)) ([System.Drawing.Color]::White)
  Draw-Node $Graphics 1047 150 78 'BOT' ([System.Drawing.Color]::FromArgb(160, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $AccentColor)) ([System.Drawing.Color]::White)
  Draw-Node $Graphics 805 355 78 'OPS' ([System.Drawing.Color]::FromArgb(160, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $AccentColor)) ([System.Drawing.Color]::White)
  Draw-Node $Graphics 1047 355 78 'SHIP' ([System.Drawing.Color]::FromArgb(160, 15, 23, 42)) ([System.Drawing.Color]::FromArgb(90, $AccentColor)) ([System.Drawing.Color]::White)
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $AccentColor), 3)
  $Graphics.DrawLine($pen, 850, 185, 920, 245)
  $Graphics.DrawLine($pen, 1085, 185, 1005, 245)
  $Graphics.DrawLine($pen, 850, 392, 920, 305)
  $Graphics.DrawLine($pen, 1085, 392, 1005, 305)
  $pen.Dispose()
}

function Draw-AnalyticsVisual($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $axisPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 2)
  $chartPen = New-Object System.Drawing.Pen($AccentColor, 4)
  $barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, $PrimaryColor))
  $Graphics.DrawLine($axisPen, 820, 430, 1080, 430)
  $Graphics.DrawLine($axisPen, 820, 430, 820, 180)
  $bars = @(120, 170, 90, 210)
  for ($i = 0; $i -lt $bars.Count; $i++) {
    $x = 850 + ($i * 56)
    $Graphics.FillRectangle($barBrush, $x, 430 - $bars[$i], 32, $bars[$i])
  }
  $points = @(
    [System.Drawing.Point]::new(850, 355),
    [System.Drawing.Point]::new(908, 320),
    [System.Drawing.Point]::new(964, 290),
    [System.Drawing.Point]::new(1020, 220)
  )
  $Graphics.DrawLines($chartPen, $points)
  foreach ($point in $points) {
    $dotBrush = New-Object System.Drawing.SolidBrush($AccentColor)
    $Graphics.FillEllipse($dotBrush, $point.X - 6, $point.Y - 6, 12, 12)
    $dotBrush.Dispose()
  }
  $axisPen.Dispose(); $chartPen.Dispose(); $barBrush.Dispose()
}

function Draw-PerformanceVisual($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $PrimaryColor), 12)
  $Graphics.DrawArc($pen, 835, 160, 220, 220, 200, 130)
  $accentPen = New-Object System.Drawing.Pen($AccentColor, 12)
  $Graphics.DrawArc($accentPen, 835, 160, 220, 220, 200, 96)
  $needlePen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 4)
  $Graphics.DrawLine($needlePen, 945, 270, 1018, 215)
  $font = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($AccentColor)
  $Graphics.DrawString('FAST', $font, $brush, 885, 410)
  $pen.Dispose(); $accentPen.Dispose(); $needlePen.Dispose(); $font.Dispose(); $brush.Dispose()
}

function Draw-SecurityVisual($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $shieldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, $PrimaryColor), 5)
  $shieldFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(165, 15, 23, 42))
  $points = @(
    [System.Drawing.PointF]::new(950, 145),
    [System.Drawing.PointF]::new(1050, 185),
    [System.Drawing.PointF]::new(1030, 330),
    [System.Drawing.PointF]::new(950, 415),
    [System.Drawing.PointF]::new(870, 330),
    [System.Drawing.PointF]::new(850, 185)
  )
  $Graphics.FillPolygon($shieldFill, $points)
  $Graphics.DrawPolygon($shieldPen, $points)
  $lockPen = New-Object System.Drawing.Pen($AccentColor, 4)
  $Graphics.DrawArc($lockPen, 915, 210, 70, 72, 200, 140)
  $Graphics.DrawRectangle($lockPen, 905, 255, 90, 78)
  $shieldPen.Dispose(); $shieldFill.Dispose(); $lockPen.Dispose()
}

function Draw-BusinessVisual($Graphics, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  Draw-PanelFrame $Graphics $PrimaryColor $AccentColor
  $cardFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 15, 23, 42))
  $cardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, $PrimaryColor), 1)
  Fill-RoundRect $Graphics $cardFill 820 170 250 150 22
  Draw-RoundRect $Graphics $cardBorder 820 170 250 150 22
  $font = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($AccentColor)
  $Graphics.DrawString('PAY', $font, $brush, 905, 220)
  $font2 = New-Object System.Drawing.Font('Segoe UI', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $Graphics.DrawString('EUR', $font2, $brush2, 845, 360)
  $Graphics.DrawString('USD', $font2, $brush2, 955, 360)
  $Graphics.DrawString('LIVE', $font2, $brush2, 1050, 360)
  $cardFill.Dispose(); $cardBorder.Dispose(); $font.Dispose(); $brush.Dispose(); $font2.Dispose(); $brush2.Dispose()
}

function Draw-VisualPanel($Graphics, [hashtable]$Post, [string]$Intent, [System.Drawing.Color]$PrimaryColor, [System.Drawing.Color]$AccentColor) {
  switch ($Intent) {
    'comparison' { Draw-ComparisonVisual $Graphics $Post $PrimaryColor $AccentColor; break }
    'tool-grid' { Draw-ToolGridVisual $Graphics $Post $PrimaryColor $AccentColor; break }
    'database' { Draw-DatabaseVisual $Graphics $PrimaryColor $AccentColor; break }
    'automation' { Draw-AutomationVisual $Graphics $PrimaryColor $AccentColor; break }
    'seo' { Draw-AnalyticsVisual $Graphics $PrimaryColor $AccentColor; break }
    'performance' { Draw-PerformanceVisual $Graphics $PrimaryColor $AccentColor; break }
    'security' { Draw-SecurityVisual $Graphics $PrimaryColor $AccentColor; break }
    'business' { Draw-BusinessVisual $Graphics $PrimaryColor $AccentColor; break }
    'infrastructure' { Draw-InfrastructureVisual $Graphics $Post $PrimaryColor $AccentColor; break }
    default { Draw-GuideVisual $Graphics $Post $PrimaryColor $AccentColor; break }
  }
}

function Draw-Avatar($Graphics, [float]$X, [float]$Y, [float]$Size) {
  if (-not (Test-Path $AuthorAvatar)) { return }

  $image = [System.Drawing.Image]::FromFile($AuthorAvatar)
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddEllipse($X, $Y, $Size, $Size)
  $state = $Graphics.Save()
  $Graphics.SetClip($clip)
  $Graphics.DrawImage($image, $X, $Y, $Size, $Size)
  $Graphics.Restore($state)
  $clip.Dispose()
  $image.Dispose()

  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 1)
  $Graphics.DrawEllipse($pen, $X, $Y, $Size, $Size)
  $pen.Dispose()
}

function New-PostImage([hashtable]$Post) {
  $style = Get-CategoryStyle $Post.Category
  $primaryColor = Get-HexColor $style.Color
  $accentColor = Get-HexColor $style.Accent
  $intent = Get-Intent $Post

  $bitmap = New-Object System.Drawing.Bitmap 1200, 630
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $backgroundRect = [System.Drawing.Rectangle]::new(0, 0, 1200, 630)
  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($backgroundRect, [System.Drawing.Color]::FromArgb(255, 9, 12, 19), [System.Drawing.Color]::FromArgb(255, 16, 22, 35), 20)
  $graphics.FillRectangle($backgroundBrush, $backgroundRect)
  $backgroundBrush.Dispose()

  $ellipseBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(38, $accentColor))
  $graphics.FillEllipse($ellipseBrush1, -90, -80, 360, 300)
  $ellipseBrush1.Dispose()
  $ellipseBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, $primaryColor))
  $graphics.FillEllipse($ellipseBrush2, 860, 360, 300, 240)
  $ellipseBrush2.Dispose()

  Draw-Grid $graphics

  $barRect = [System.Drawing.Rectangle]::new(0, 0, 10, 630)
  $barBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($barRect, $primaryColor, $accentColor, 90)
  $graphics.FillRectangle($barBrush, 0, 0, 10, 630)
  $barBrush.Dispose()

  $brandFont = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brandBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, $accentColor))
  $graphics.DrawString('BLIXAMO', $brandFont, $brandBrush, 62, 52)
  $brandFont.Dispose(); $brandBrush.Dispose()

  $chipBorder = [System.Drawing.Color]::FromArgb(82, $accentColor)
  $chipFill = [System.Drawing.Color]::FromArgb(58, 255, 255, 255)
  $chipText = [System.Drawing.Color]::FromArgb(235, 255, 255, 255)
  $categoryWidth = Draw-Chip $graphics $style.Label 62 82 $chipBorder $chipFill $chipText
  $null = Draw-Chip $graphics $style.Symbol (76 + $categoryWidth) 82 ([System.Drawing.Color]::FromArgb(65, 255, 255, 255)) ([System.Drawing.Color]::FromArgb(34, 255, 255, 255)) $chipText

  $titleBottom = Draw-Title $graphics $Post.Title 62 152 620

  $subFont = New-Object System.Drawing.Font('Segoe UI', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(196, 214, 220, 230))
  $subText = if ($Post.Keyword) { $Post.Keyword } else { $Post.Description }
  if ($subText.Length -gt 72) { $subText = $subText.Substring(0, 72).Trim() + '...' }
  $graphics.DrawString($subText, $subFont, $subBrush, 62, $titleBottom + 18)
  $subFont.Dispose(); $subBrush.Dispose()

  Draw-VisualPanel $graphics $Post $intent $primaryColor $accentColor

  $intentLabel = switch ($intent) {
    'comparison' { 'Comparison' }
    'tool-grid' { 'Tool picks' }
    'database' { 'Database guide' }
    'automation' { 'Automation flow' }
    'seo' { 'SEO workflow' }
    'performance' { 'Performance tuning' }
    'security' { 'Security setup' }
    'business' { 'Business stack' }
    'infrastructure' { 'Infrastructure' }
    default { 'Guide' }
  }

  $metaY = 512
  $x = 62
  foreach ($item in @($intentLabel, $Post.ReadTime, $Post.Difficulty)) {
    if (-not $item) { continue }
    $width = Draw-Chip $graphics $item $x $metaY ([System.Drawing.Color]::FromArgb(48, 255, 255, 255)) ([System.Drawing.Color]::FromArgb(22, 255, 255, 255)) $chipText
    $x += $width + 10
  }

  $keywordFont = New-Object System.Drawing.Font('Consolas', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $keywordBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 169, 177, 190))
  $keywordLabel = if ($Post.Keyword) { $Post.Keyword.ToUpperInvariant() } else { $Post.Category.ToUpperInvariant() }
  $graphics.DrawString($keywordLabel, $keywordFont, $keywordBrush, 62, 566)
  $keywordFont.Dispose(); $keywordBrush.Dispose()

  Draw-Avatar $graphics 980 564 32
  $authorFont = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $authorBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 255, 255, 255))
  $graphics.DrawString('Ankit Sorathiya | blixamo.com', $authorFont, $authorBrush, 1020, 571)
  $authorFont.Dispose(); $authorBrush.Dispose()

  $graphics.Dispose()
  return $bitmap
}

function Save-Png([System.Drawing.Bitmap]$Bitmap, [string]$Path) {
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

$files = Get-ChildItem $PostsDir -Filter *.mdx | Sort-Object Name
$processed = @()

foreach ($file in $files) {
  $slug = $file.BaseName
  if ($Slugs.Count -gt 0 -and ($Slugs -notcontains $slug)) { continue }

  $raw = Get-Content -Raw $file.FullName
  $frontmatterBlock = [regex]::Match($raw, '(?s)^---\r?\n(.*?)\r?\n---')
  if (-not $frontmatterBlock.Success) {
    throw "Missing frontmatter in $slug"
  }

  $body = $raw.Substring($frontmatterBlock.Index + $frontmatterBlock.Length).Trim()
  $post = @{
    Slug = $slug
    Title = Get-MdxValue $raw 'title'
    Description = Get-MdxValue $raw 'description'
    Category = Get-MdxValue $raw 'category'
    Keyword = Get-MdxValue $raw 'keyword'
    Difficulty = Get-MdxValue $raw 'difficulty'
    TimeToComplete = Get-MdxValue $raw 'timeToComplete'
    ReadTime = Get-ReadingTimeLabel $body
  }

  if (-not $post.Difficulty) { $post.Difficulty = 'Developer guide' }
  $bitmap = New-PostImage $post
  $featuredPath = Join-Path $ImagesDir "$slug\featured.png"
  $ogPath = Join-Path $ImagesDir "$slug\og.png"
  Save-Png $bitmap $featuredPath
  Save-Png $bitmap $ogPath
  $bitmap.Dispose()

  $updated = Set-MdxValue $raw 'featuredImage' "/images/posts/$slug/featured.png"
  Set-Content -Path $file.FullName -Value $updated

  $processed += $slug
}

Write-Output ("Generated title images for {0} posts." -f $processed.Count)
$processed

