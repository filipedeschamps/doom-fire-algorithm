unit DoomFireClass;

interface

uses
  System.UITypes, FMX.Graphics, System.Threading;

type

  TDoomFireClass = class

  private
    FCanvas: TCanvas;
    FTask: iTask;

    firePixelsArray: array of Integer;
//    debug: Boolean;
    FDirection: Byte;

    procedure calculateFirePropagation;
    procedure createFireDataStructure;

    function GetAlphaColorRec(R, G, B: Byte): TAlphaColorRec;
    procedure renderFire;
    procedure start;
    procedure updateFireIntensityPerPixel(currentPixelIndex: integer);
  public
    constructor Create(Canvas: TCanvas);
    destructor Destroy; override;

    property Direction: Byte read FDirection write FDirection;

    procedure Initialize;
    procedure createFireSource;
    procedure decreaseFireSource;
    procedure destroyFireSource;
    procedure increaseFireSource;
  end;

  const
    fireWidth = 150;
    fireHeight = 100;
    drawSize = 5;
  //  debug = false;
    fireColorsPaletteR: array of Byte = [7,31,47,71,87,103,119,143,159,175,191,199,223,223,223,215,215,215,207,207,207,207,199,199,199,191,191,191,191,191,183,183,183,207,223,239,255];
    fireColorsPaletteG: array of Byte = [7,7,15,15,23,31,31,39,47,63,71,71,79,87,87,95,95,103,111,119,127,135,135,143,151,159,159,167,167,175,175,183,183,207,223,239,255];
    fireColorsPaletteB: array of Byte = [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,15,15,15,15,23,23,23,31,31,31,39,39,47,47,47,55,111,159,199,255];


implementation

uses
  System.Types;

constructor TDoomFireClass.Create(Canvas: TCanvas);
begin
  FCanvas := Canvas;
  FTask := TTask.Create(start);

  Direction := 1;
end;

destructor TDoomFireClass.Destroy;
begin
  FTask.Cancel;
  inherited;
end;

function TDoomFireClass.GetAlphaColorRec(R, G, B: Byte): TAlphaColorRec;
begin
  Result.A := $FF;
  Result.R := R;
  Result.G := G;
  Result.B := B;
end;

procedure TDoomFireClass.Initialize;
begin
  FTask.Start;
end;

procedure TDoomFireClass.start();
begin
  createFireDataStructure();
  createFireSource();
  renderFire();

  while Assigned(FTask) and (FTask.Status = TTaskStatus.Running) do
  begin
    calculateFirePropagation();
    FTask.Wait(50);
  end;
end;

procedure TDoomFireClass.createFireDataStructure();
var
  I, numberOfPixels: Integer;
begin
  numberOfPixels := fireWidth * fireHeight;

  SetLength(firePixelsArray, numberOfPixels);

  for i := 0 to numberOfPixels do
    firePixelsArray[i] := 0;
end;

procedure TDoomFireClass.calculateFirePropagation();
var
  column: Integer;
  row: Integer;
  pixelIndex: Integer;
begin
  for column := 0 to Pred(fireWidth) do
  begin
    for row := 0 to Pred(fireHeight) do
    begin
      pixelIndex := column + ( fireWidth * row );

      updateFireIntensityPerPixel(pixelIndex);
    end;
  end;

  renderFire();
end;

procedure TDoomFireClass.updateFireIntensityPerPixel(currentPixelIndex: integer);
var
  belowPixelIndex: Integer;
  decay: Integer;
  belowPixelFireIntensity: Integer;
  newFireIntensity: Integer;
begin
  belowPixelIndex := currentPixelIndex + fireWidth;

  // below pixel index overflows canvas
  if (belowPixelIndex >= fireWidth * fireHeight) then
    Exit;

  decay := Random(3);
  belowPixelFireIntensity := firePixelsArray[belowPixelIndex];

  if belowPixelFireIntensity - decay >= 0 then
    newFireIntensity := belowPixelFireIntensity - decay
  else
    newFireIntensity := 0;

  case Direction of
    0: firePixelsArray[currentPixelIndex - decay] := newFireIntensity; //wind comes to the left
    1: firePixelsArray[currentPixelIndex] := newFireIntensity;         //no wind (fire set to up)
    2: firePixelsArray[currentPixelIndex + decay] := newFireIntensity; //wind comes to the right
  end;
end;

procedure TDoomFireClass.renderFire();
var
  row: Integer;
  column: Integer;
  pixelIndex: Integer;
  fireIntensity: Integer;
begin
  FCanvas.BeginScene;
  try
    FCanvas.Fill.Kind := TBrushKind.Solid;
    FCanvas.Fill.Color := TAlphaColorRec.Red;

    FCanvas.Stroke.Color := TAlphaColorRec.Black;

    for row := 0 to Pred(fireHeight) do
    begin
      for column := 0 to Pred(fireWidth) do
      begin
        pixelIndex := column + ( fireWidth * row );
        fireIntensity := firePixelsArray[pixelIndex];

        FCanvas.Fill.Color := TAlphaColor(GetAlphaColorRec(
          fireColorsPaletteR[fireIntensity],
          fireColorsPaletteG[fireIntensity],
          fireColorsPaletteB[fireIntensity]));

        FCanvas.FillRect(
          TRectF.Create(
            column*drawSize,
            row*drawSize,
            drawSize + (column*drawSize),
            drawSize + (row*drawSize)),
          0,
          0,
          [],
          1);
      end;
    end;
  finally
    FCanvas.EndScene;
  end;
end;

procedure TDoomFireClass.createFireSource();
var
  column: Integer;
  overflowPixelIndex: Integer;
  pixelIndex: Integer;
begin
  for column := 0 to Pred(fireWidth) do
  begin
    overflowPixelIndex := fireWidth * fireHeight;
    pixelIndex := (overflowPixelIndex - fireWidth) + column;

    firePixelsArray[pixelIndex] := 36;
  end;
end;

procedure TDoomFireClass.destroyFireSource();
var
  column: Integer;
  overflowPixelIndex: Integer;
  pixelIndex: Integer;
begin
  for column := 0 to Pred(fireWidth)do
  begin
    overflowPixelIndex := fireWidth * fireHeight;
    pixelIndex := (overflowPixelIndex - fireWidth) + column;

    firePixelsArray[pixelIndex] := 0;
  end;
end;

procedure TDoomFireClass.increaseFireSource();
var
  column: Integer;
  overflowPixelIndex: Integer;
  pixelIndex: Integer;
  currentFireIntensity: Integer;
  newFireIntensity: Integer;
  increase: Integer;
begin
  for column := 0 to Pred(fireWidth) do
  begin
    overflowPixelIndex := fireWidth * fireHeight;
    pixelIndex := (overflowPixelIndex - fireWidth) + column;
    currentFireIntensity := firePixelsArray[pixelIndex];

    if (currentFireIntensity < 36) then
    begin
      increase := Random(14);
      if currentFireIntensity + increase >= 36 then
        newFireIntensity := 36
      else
        newFireIntensity := currentFireIntensity + increase;

      firePixelsArray[pixelIndex] := newFireIntensity;
    end;
  end;
end;

procedure TDoomFireClass.decreaseFireSource();
var
  column: Integer;
  overflowPixelIndex: Integer;
  pixelIndex: Integer;
  currentFireIntensity: Integer;
  newFireIntensity: Integer;
  decay: Integer;
begin
  for column := 0 to Pred(fireWidth) do
  begin
    overflowPixelIndex := fireWidth * fireHeight;
    pixelIndex := (overflowPixelIndex - fireWidth) + column;
    currentFireIntensity := firePixelsArray[pixelIndex];

    if (currentFireIntensity > 0) then
    begin
      decay := Random(14);
      if currentFireIntensity - decay >= 0 then
        newFireIntensity := currentFireIntensity - decay
      else
        newFireIntensity := 0;

      firePixelsArray[pixelIndex] := newFireIntensity;
    end;
  end;
end;

end.
