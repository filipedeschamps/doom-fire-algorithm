using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using OrbitalShell.Component.CommandLine.CommandModel;
using OrbitalShell.Component.CommandLine.Processor;
using OrbitalShell.Component.Console;

namespace csharp_console_implementation
{
    public class Program
    {
        static void Main(string[] args)
        {
            new DoomFireAlgo().Run();
        }
    }

    public class DoomFireAlgo
    {
        public const string PalettePatternSeparator = "_";
        public const string DefaultFirePattern = " _ _ _ _ _ _ _ _ _ _░_░_▒_▒_▒_▒_▒_▒_▓_▓_▓_▓_▓_▓_▓_▓_█_█_█_█_█_█_█_█_█_";

        [Command("runs an ASCII Doom Fire Algorithm that output an animation into the console")]
        public CommandVoidResult Run(
            [Option("w", "width", "width in characters", true, true)] int width = 100,
            [Option("h", "height", "height in characters", true, true)] int height = 40,
            [Option("d", "decay-delta", "decay delta", true, true)] int decayDelta = 3,
            [Option("g", "gray", "gray mode - no colors")] bool gray = false,
            [Option("s", "slow", "0 max speed - pause time between images in ms", true, true)] int slow = 0,
            [Option("t", "no-text", "do not add text info above anim")] bool noText = false,
            [Option(null, "color-palette", "color palette. 36 symbols separated by " + PalettePatternSeparator, true, true)] string firePattern = DefaultFirePattern
        )
        {
            firePattern = firePattern.ToLower();

            var firePallete = firePattern.Split(PalettePatternSeparator);
            var sb = new StringBuilder(width * height * 20);

            if (!gray)
            {
                // add colors
                var n = firePallete.Length;
                var stp = 256 / n;
                int r = 0;
                int g = 0;
                int b = 0;
                for (int i = 0; i < firePallete.Length; i++)
                {
                    firePallete[i] = ANSI.SGR_SetForegroundColor24bits(r, g, b) + firePallete[i];
                    r += stp;
                    if (r > 100) g += stp;
                }
            }

            var o = new ConsoleTextWriterWrapper(System.Console.Out);
            var pixels = width * height;
            var pixelsArray = new int[pixels];
            var random = new Random();

            void createPixelsStructure()
            {
                for (var i = 0; i < pixels; i++)
                    pixelsArray[i] = 0;
            };

            void calculatePropagation()
            {
                for (var column = 0; column < width; column++)
                {
                    for (var row = 0; row < height; row++)
                    {
                        var index = column + (width * row);
                        updatePixelIntensity(index);
                    }
                }
            };

            void updatePixelIntensity(int index)
            {
                var belowIndex = index + width;
                if (belowIndex < width * height)
                {
                    var decay = (int)Math.Floor(random.NextDouble() * decayDelta);
                    var belowIntensity = pixelsArray[belowIndex];
                    var newIntensity = belowIntensity - decay;

                    if (index - decay > 0)
                        pixelsArray[index - decay] = newIntensity > 0 ? newIntensity : 0;
                }
            };

            void createSource()
            {
                for (var column = 0; column < width; column++)
                {
                    var overflowPixel = width * height;
                    var index = (overflowPixel - width) + column;

                    pixelsArray[index] = firePallete.Length - 1;
                }
            };

            void render()
            {
                sb.Clear();
                sb.Append(ANSI.CUP());
                try { o.HideCur(); } catch (Exception) { }

                for (var row = 0; row < height; row++)
                {
                    for (var column = 0; column < width; column++)
                    {
                        var index = column + (width * row);
                        var intensity = pixelsArray[index];
                        sb.Append(firePallete[intensity]);
                    }
                    sb.AppendLine();
                }
                o.WriteAsync(sb.ToString());
            };

            void start()
            {
                o.ClearScreen();
                try { o.HideCur(); } catch (Exception) { }
                createPixelsStructure();
                createSource();
            }

            start();

            var end = false;
            System.Console.CancelKeyPress += (o, e) => {
                System.Environment.Exit(0);
            };
            while (!end)
            {
                var sw0 = Stopwatch.StartNew();
                calculatePropagation();
                sw0.Stop();
                var sw1 = Stopwatch.StartNew();
                render();
                sw1.Stop();
                if (!noText) o.Echoln($"(rdc)Doom fire algo - {Math.Round(1d / (sw0.ElapsedMilliseconds + sw1.ElapsedMilliseconds) * 1000, 2)} fps");
                if (slow > 0) Thread.Sleep(slow);
            }

            try { o.ShowCur(); } catch (Exception) { };

            return CommandVoidResult.Instance;
        }
    }
}
