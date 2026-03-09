$ErrorActionPreference = 'Stop'
$key = 'bc7e5b9c71bea7e3c1a71cc62e77190a'
$keywords = '培哥烟囱面包'
$city = '北京'
$kw = [System.Uri]::EscapeDataString($keywords)
$cty = [System.Uri]::EscapeDataString($city)
$url = "https://restapi.amap.com/v3/place/text?key=$key&keywords=$kw&city=$cty&children=1&offset=20&page=1&extensions=all"
Write-Host "Query URL:" $url
$data = Invoke-RestMethod -Uri $url -Method Get
$data | ConvertTo-Json -Depth 6