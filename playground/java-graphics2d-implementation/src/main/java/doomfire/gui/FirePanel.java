package doomfire.gui;

import static doomfire.gui.color.ColorPalette.colorPalette;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import javax.swing.JPanel;
import javax.swing.SwingWorker;

public class FirePanel extends JPanel {

	private static final long serialVersionUID = 1L;

	private static final int PIXEL_SIZE = 4;

	private final int fireWidth;
	private final int fireHeight;
	private final int panelWidth;
	private final int panelHeight;

	private int numberOfPixels;
	private int[] firePixelsArray;

	public FirePanel(final int fireWidth, final int fireHeight) {
		this.fireWidth = fireWidth;
		this.fireHeight = fireHeight;

		this.panelWidth = fireWidth * PIXEL_SIZE;
		this.panelHeight = fireHeight * PIXEL_SIZE;
		this.numberOfPixels = fireWidth * fireHeight;
		this.firePixelsArray = new int[numberOfPixels];

		setLayout(null);
		setSize(panelWidth, panelHeight);
		start();
	}

	public void start() {
		createFireDataStructure();
		createFireSource();

		new ThreadWorker().execute();
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

	private void calculateFirePropagation() {
		for (int column = 0; column < fireWidth; column++) {
			for (int row = 0; row < fireHeight; row++) {
				int pixelIndex = column + (fireWidth * row);
				updateFireIntensityPerPixel(pixelIndex);
			}
		}
		repaint();
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

	@Override
	protected void paintComponent(Graphics g) {
		super.paintComponent(g);

		Graphics2D g2d = (Graphics2D) g.create();

		BufferedImage bufferedImage = new BufferedImage(panelWidth, panelHeight, BufferedImage.TYPE_INT_ARGB);
		Graphics2D bufferedGraphics = null;

		try {

			bufferedGraphics = bufferedImage.createGraphics();
			bufferedGraphics.setBackground(Color.BLACK);

			for (int row = 0; row < fireHeight; row++) {

				for (int column = 0; column < fireWidth; column++) {

					int pixelIndex = column + (fireWidth * row);
					int fireIntensity = firePixelsArray[pixelIndex];
					bufferedGraphics.setColor(colorPalette[fireIntensity]);
					bufferedGraphics.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
				}
			}

		} finally {
			if (bufferedGraphics != null) {
				bufferedGraphics.dispose();
			}
		}

		g2d.drawImage(bufferedImage, 0, 0, panelWidth, panelHeight, 0, 0, bufferedImage.getWidth(),
				bufferedImage.getHeight(), null);
	}

	class ThreadWorker extends SwingWorker<Void, Void> {

		@Override
		protected Void doInBackground() {
			while (true) {
				calculateFirePropagation();
				sleep();
			}
		}

		private void sleep() {
			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

	}

}
