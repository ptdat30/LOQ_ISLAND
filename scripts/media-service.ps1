[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType = WindowsRuntime] | Out-Null
Add-Type -AssemblyName System.Runtime.WindowsRuntime

[Windows.Storage.Streams.IRandomAccessStreamWithContentType, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and
    $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
})[0]

$streamExtType = [AppDomain]::CurrentDomain.GetAssemblies() | ForEach-Object { try { $_.GetTypes() } catch {} } | Where-Object { $_.Name -eq 'WindowsRuntimeStreamExtensions' } | Select-Object -First 1
$asStreamMethod = if ($streamExtType) {
    ($streamExtType.GetMethods() | Where-Object { $_.Name -eq 'AsStream' -and $_.GetParameters().Count -eq 1 })[0]
} else { $null }

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

try {
    $asyncOp = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()
    $manager = Await $asyncOp ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])
} catch {
    [Console]::WriteLine("MEDIA_ERROR:Cannot initialize GSMTC Manager")
    exit 1
}

$lastTitle = ""
$lastStatus = ""
$lastPos = 0
$lastThumbnail = $null

while ($true) {
    try {
        $session = $manager.GetCurrentSession()
        if ($session) {
            $props = Await ($session.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
            $playback = $session.GetPlaybackInfo()
            $timeline = $session.GetTimelineProperties()

            if ($props.Title) {
                $status = $playback.PlaybackStatus.ToString()
                $pos = [Math]::Round($timeline.Position.TotalSeconds)
                $dur = [Math]::Round($timeline.EndTime.TotalSeconds)

                if ($props.Title -ne $lastTitle) {
                    $lastTitle = $props.Title
                    $lastThumbnail = $null
                    if ($props.Thumbnail -and $asStreamMethod) {
                        try {
                            $stream = Await ($props.Thumbnail.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
                            $netStream = $asStreamMethod.Invoke($null, @($stream))
                            $ms = New-Object System.IO.MemoryStream
                            $netStream.CopyTo($ms)
                            $bytes = $ms.ToArray()
                            if ($bytes.Length -gt 0) {
                                $lastThumbnail = "data:image/jpeg;base64," + [Convert]::ToBase64String($bytes)
                            }
                        } catch {
                            # Thumbnail reading failed silently
                        }
                    }
                }

                $info = @{
                    title = $props.Title
                    artist = $props.Artist
                    album = $props.AlbumTitle
                    status = $status
                    position = $pos
                    duration = $dur
                    thumbnail = $lastThumbnail
                }
                $json = $info | ConvertTo-Json -Compress
                [Console]::WriteLine("MEDIA_UPDATE:" + $json)
            }
        } else {
            [Console]::WriteLine("MEDIA_IDLE")
        }
    } catch {
        # Session could temporarily transition
    }

    Start-Sleep -Milliseconds 1000
}
