package doomfire;

import javax.swing.SwingUtilities;

import doomfire.gui.MainWindow;

public class Main {

	public static void main(String[] args) throws InterruptedException {
		SwingUtilities.invokeLater(() -> {
			MainWindow window = new MainWindow();
			window.setVisible(true);
		});
	}

}
