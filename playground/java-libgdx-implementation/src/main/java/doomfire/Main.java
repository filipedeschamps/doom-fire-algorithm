package doomfire;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;

import doomfire.gui.MainWindow;

public class Main {

	public static void main(String[] args) {
		LwjglApplicationConfiguration cfg = new LwjglApplicationConfiguration();
		cfg.title = "Doom Fire";
		cfg.width = 800;
		cfg.height = 600;
		
		new LwjglApplication(new MainWindow(), cfg);
	}
}
