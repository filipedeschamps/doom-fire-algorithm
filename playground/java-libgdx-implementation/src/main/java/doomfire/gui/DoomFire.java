package doomfire.gui;

import static doomfire.gui.color.ColorPalette.PALETA_CORES;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Pixmap.Format;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;

public class DoomFire {

	private final int fireWidth;
	private final int fireHeight;

	private int numberOfPixels;
	private int[] firePixelsArray;

	public DoomFire(final int fireWidth, final int fireHeight) {
		this.fireWidth = fireWidth;
		this.fireHeight = fireHeight;
		this.numberOfPixels = fireWidth * fireHeight;
		this.firePixelsArray = new int[numberOfPixels];

		start();
	}

	public void start() {
		createFireDataStructure();
		createFireSource();
	}

	private void createFireDataStructure() {
		for (int i = 0; i < numberOfPixels; i++) {
			firePixelsArray[i] = 0;
		}
	}

	private void createFireSource() {
		for (int column = 0; column < fireWidth; column++) {
			int overflowPixelIndex = fireWidth * fireHeight;
			int pixelIndex = (overflowPixelIndex - fireWidth) + column;
			firePixelsArray[pixelIndex] = 36;
		}
	}

	public void calculateFirePropagation() {
		for (int column = 0; column < fireWidth; column++) {
			for (int row = 0; row < fireHeight; row++) {
				int pixelIndex = column + (fireWidth * row);
				updateFireIntensityPerPixel(pixelIndex);
			}
		}
	}

	private void updateFireIntensityPerPixel(int currentPixelIndex) {
		int belowPixelIndex = currentPixelIndex + fireWidth;

		if (belowPixelIndex >= numberOfPixels) {
			return;
		}

		int decay = (int) Math.floor(Math.random() * 2);
		int belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
		int newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;
		int windPixel = currentPixelIndex - decay >= 0 ? currentPixelIndex - decay : 0;
		firePixelsArray[windPixel] = newFireIntensity;
	}

	public void render(Batch batch) {

		Pixmap pixmap = new Pixmap(fireWidth, fireHeight, Format.RGBA8888);

		for (int row = 0; row < fireHeight; row++) {

			for (int column = 0; column < fireWidth; column++) {

				int pixelIndex = column + (fireWidth * row);
				int fireIntensity = firePixelsArray[pixelIndex];

				pixmap.drawPixel(column, row, Color.rgba8888(PALETA_CORES[fireIntensity]));
			}
		}

		Texture texture = new Texture(pixmap);
		pixmap.dispose();
		batch.begin();
		batch.draw(texture, 0, 0);
		batch.end();
	}
}
