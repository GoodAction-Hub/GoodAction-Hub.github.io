$ErrorActionPreference = 'Stop'
$key = 'bc7e5b9c71bea7e3c1a71cc62e77190a'
$keywords = '培哥烟囱面包'
$city = '北京'
$kw = [System.Uri]::EscapeDataString($keywords)
$cty = [System.Uri]::EscapeDataString($city)
$url = "https://restapi.amap.com/v3/place/text?key=$key&keywords=$kw&city=$cty&children=1&offset=20&page=1&extensions=all"
Write-Host "Query URL:" $url
$data = Invoke-RestMethod -Uri $url -Method Get
$pois = $data.pois
$match = $pois | Where-Object { $_.name -like '*培哥*' -or $_.name -like '*烟囱面包*' }
if ($match) {
  $result = $match | Select-Object -First 1 -Property name, address, cityname, pname, location
} else {
  $result = $pois | Select-Object -First 3 -Property name, address, cityname, pname, location
}
$result | ConvertTo-Json -Depth 4