$links = Get-Content -Path "./fish-icon.txt"
$outputPath = "./icons"

Foreach ($link in $links) {
    $filename = [System.Net.WebRequest]::Create($link).GetResponse()
    # Write-Output $filename
    $basename = Split-Path($filename.ResponseUri.OriginalString) -leaf
    $uri = $filename.ResponseUri
    $filename.Close()
    $output = Join-Path $outputPath $basename
    # Write-Output $output
    Invoke-WebRequest -Uri $uri -Outfile $output
}