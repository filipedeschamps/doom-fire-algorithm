package doomfire.gui;

import java.awt.BorderLayout;

import javax.swing.JFrame;

public class MainWindow extends JFrame {

	private static final long serialVersionUID = 1L;

	public MainWindow() {
		setTitle("Java Doom Fire!!!");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setSize(800, 430);

		FirePanel firePanel = new FirePanel(200, 100);
		getContentPane().add(firePanel, BorderLayout.CENTER);
	}

}
