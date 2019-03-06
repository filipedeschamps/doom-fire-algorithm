package doomfire.gui;

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class MainWindow implements ApplicationListener {

	private DoomFire doomFire;
	private OrthographicCamera camera;
	private SpriteBatch batch;

	// time elapsed in milliseconds
	private long time;
	// how long to wait between ticks, in milliseconds
	private static final long TICK_TIME = 50L;
	// when did we last send a tick?
	private long lastTick;

	@Override
	public void create() {
		doomFire = new DoomFire(200, 100);

		camera = new OrthographicCamera();
		camera.setToOrtho(false, 200, 100);
		batch = new SpriteBatch();
	}

	@Override
	public void dispose() {
		batch.dispose();
	}

	@Override
	public void pause() {
	}

	@Override
	public void render() {

		camera.update();

		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

		batch.setProjectionMatrix(camera.combined);

		float delta = Gdx.graphics.getDeltaTime();
		
		// convert to milliseconds
		time += (long) (delta * 1000);
		
		// Simple substraction to see if enough time passed for calculateFirePropagation
		if (time - TICK_TIME > lastTick) {
			doomFire.calculateFirePropagation();
			lastTick = time - (time % TICK_TIME);
		}

		doomFire.render(batch);
	}

	@Override
	public void resize(int arg0, int arg1) {
	}

	@Override
	public void resume() {
	}

}
