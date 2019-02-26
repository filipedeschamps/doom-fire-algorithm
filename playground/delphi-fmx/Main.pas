unit Main;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Graphics, FMX.Dialogs,
  FMX.Controls.Presentation, FMX.StdCtrls, FMX.Objects, DoomFireClass;

type
  TfrmMain = class(TForm)
    Button1: TButton;
    GroupBox1: TGroupBox;
    RadioButton1: TRadioButton;
    RadioButton2: TRadioButton;
    RadioButton3: TRadioButton;
    Button2: TButton;
    Button3: TButton;
    Button4: TButton;
    procedure FormCreate(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure RadioButton1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure Button3Click(Sender: TObject);
    procedure Button4Click(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
    FDoomFireClass: TDoomFireClass;
  public
    { Public declarations }
  end;

var
  frmMain: TfrmMain;

implementation

{$R *.fmx}

procedure TfrmMain.Button1Click(Sender: TObject);
begin
  FDoomFireClass.destroyFireSource;
end;

procedure TfrmMain.Button2Click(Sender: TObject);
begin
  FDoomFireClass.createFireSource;
end;

procedure TfrmMain.Button3Click(Sender: TObject);
begin
  FDoomFireClass.increaseFireSource;
end;

procedure TfrmMain.Button4Click(Sender: TObject);
begin
  FDoomFireClass.decreaseFireSource;
end;

procedure TfrmMain.FormCreate(Sender: TObject);
begin
  FDoomFireClass := TDoomFireClass.Create(Self.Canvas);
end;

procedure TfrmMain.FormDestroy(Sender: TObject);
begin
  FDoomFireClass.Free;
end;

procedure TfrmMain.FormShow(Sender: TObject);
begin
  FDoomFireClass.Initialize;
end;

procedure TfrmMain.RadioButton1Click(Sender: TObject);
begin
  FDoomFireClass.Direction := TRadioButton(Sender).Tag;
end;

end.
