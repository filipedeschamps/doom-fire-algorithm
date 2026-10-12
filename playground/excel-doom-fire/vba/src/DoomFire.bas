Attribute VB_Name = "DoomFire"
' Doom fire algorithm - VBA port of fire.js @854c39f
' Upstream: playground/1st-implementation-with-tables/fire.js
' SPEC-105: faithful in-place push-form propagation with wind shift
' SPEC-106: SeedRng / StepFrames / ResetFire test hooks

Option Explicit

' --- Constants (fire.js L2-5) ---
Private Const fireWidth As Long = 60
Private Const fireHeight As Long = 40
Private Const fireIntensity As Long = 36
Private Const frameMs As Long = 50

' --- Pixel state: 1-D Long array (D-11, SPEC-105) ---
Private firePixels(0 To 2399) As Long

' --- Animation control ---
Private bRunning As Boolean

' ============================================================
' PUBLIC BUTTON MACROS (SPEC-103, SPEC-105)
' ============================================================

' Start the animation loop (fire.js L8-13)
Public Sub StartFire()
    bRunning = True
    Dim elapsed As Double
    Do While bRunning
        calculateFirePropagation
        DoEvents
        elapsed = Timer
        Do While Timer - elapsed < frameMs / 1000 And bRunning
            DoEvents
        Loop
    Loop
End Sub

' Stop the animation loop (Stop is a reserved word in VBA, hence StopFire)
Public Sub StopFire()
    bRunning = False
End Sub

' Create the fire source: bottom row = 36 (fire.js L82-89)
Public Sub CreateFireSource()
    Dim c As Long
    For c = 0 To fireWidth - 1
        firePixels((fireHeight - 1) * fireWidth + c) = fireIntensity
    Next c
    renderFire
End Sub

' Destroy the fire source: bottom row = 0 (fire.js L91-98)
Public Sub DestroyFireSource()
    Dim c As Long
    For c = 0 To fireWidth - 1
        firePixels((fireHeight - 1) * fireWidth + c) = 0
    Next c
    renderFire
End Sub

' Increase fire source: each bottom pixel +rand(0..13), capped at 36 (fire.js L100-114)
Public Sub IncreaseFireSource()
    Dim c As Long, p As Long, increase As Long, v As Long
    For c = 0 To fireWidth - 1
        p = (fireHeight - 1) * fireWidth + c
        v = firePixels(p)
        If v < fireIntensity Then
            increase = Int(Rnd * 14)
            v = v + increase
            If v > fireIntensity Then v = fireIntensity
            firePixels(p) = v
        End If
    Next c
    renderFire
End Sub

' Decrease fire source: each bottom pixel -rand(0..13), floored at 0 (fire.js L116-130)
Public Sub DecreaseFireSource()
    Dim c As Long, p As Long, decay As Long, v As Long
    For c = 0 To fireWidth - 1
        p = (fireHeight - 1) * fireWidth + c
        v = firePixels(p)
        If v > 0 Then
            decay = Int(Rnd * 14)
            v = v - decay
            If v < 0 Then v = 0
            firePixels(p) = v
        End If
    Next c
    renderFire
End Sub

' ============================================================
' TEST HOOKS (SPEC-106, D-14)
' ============================================================

' Seed the VBA Rnd for deterministic tests: Rnd -1 then Randomize seed
Public Sub SeedRng(ByVal seed As Long)
    Rnd -1
    Randomize seed
End Sub

' Step n frames without delay (for test harness; each frame = propagate + render)
Public Sub StepFrames(ByVal n As Long)
    Dim i As Long
    For i = 1 To n
        calculateFirePropagation
    Next i
End Sub

' Reset the fire grid to all zeros and render (D-14)
Public Sub ResetFire()
    Dim i As Long
    For i = 0 To fireWidth * fireHeight - 1
        firePixels(i) = 0
    Next i
    renderFire
End Sub

' ============================================================
' CORE LOGIC (fire.js L23-49, D-11)
' ============================================================

' One propagation frame: column-outer, row-inner, push form in place (fire.js L23-49)
Private Sub calculateFirePropagation()
    Dim c As Long, r As Long
    Dim pixelIndex As Long, belowPixelIndex As Long
    Dim decay As Long, belowVal As Long, newVal As Long, target As Long

    For c = 0 To fireWidth - 1
        For r = 0 To fireHeight - 1
            pixelIndex = c + fireWidth * r
            belowPixelIndex = pixelIndex + fireWidth

            ' Bottom row: no pixel below, skip (fire.js L38-41)
            If belowPixelIndex < fireWidth * fireHeight Then
                decay = Int(Rnd * 3)
                belowVal = firePixels(belowPixelIndex)
                newVal = belowVal - decay
                If newVal < 0 Then newVal = 0

                ' Wind shift: write to index - decay (fire.js L48)
                target = pixelIndex - decay
                If target >= 0 Then
                    firePixels(target) = newVal
                End If
                ' Negative target (row 0 wind): skip, not an error (SPEC-114)
            End If
        Next r
    Next c

    renderFire
End Sub

' Render the grid to FireGrid as one 2-D Variant array (D-12, SPEC-105)
Private Sub renderFire()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Worksheets("Fire")

    Dim arr(1 To 40, 1 To 60) As Long
    Dim r As Long, c As Long
    For r = 0 To fireHeight - 1
        For c = 0 To fireWidth - 1
            arr(r + 1, c + 1) = firePixels(c + fireWidth * r)
        Next c
    Next r

    ws.Range("FireGrid").Value2 = arr
End Sub
