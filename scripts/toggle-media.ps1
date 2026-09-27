[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime] | Out-Null
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
$mgr = $asTask.MakeGenericMethod([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]).Invoke($null, @([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync())).GetAwaiter().GetResult()
$s = $mgr.GetCurrentSession()
if ($s) {
    $null = $asTask.MakeGenericMethod([bool]).Invoke($null, @($s.TryTogglePlayPauseAsync())).GetAwaiter().GetResult()
    Write-Output "TOGGLED_SUCCESS"
} else {
    Write-Output "NO_SESSION"
}
