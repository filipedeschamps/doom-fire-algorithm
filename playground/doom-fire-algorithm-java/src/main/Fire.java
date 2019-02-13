package main;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.Timer;

public class Fire extends JFrame {

	private static final long serialVersionUID = 1L;

	private static int fireHeight = 600;
	private static int fireWidth = 600;
	boolean debug = false;
	int senseFire = 0;

	// Propriedades do fogo
	private static final int sizeRect = 15;
	private static int sizeRectHeight = fireHeight / sizeRect;
	private static int sizeRectWidth = fireWidth / sizeRect;

	List<Integer> fireRectsArray = new ArrayList<>();
	List<Coordenada> coordrenderFire = new ArrayList<>();
	List<Color> palette = Arrays.asList(new Color(7, 7, 7), new Color(31, 7, 7), new Color(47, 15, 7),
			new Color(71, 15, 7), new Color(87, 23, 7), new Color(103, 31, 7), new Color(119, 31, 7),
			new Color(143, 39, 7), new Color(159, 47, 7), new Color(175, 63, 7), new Color(191, 71, 7),
			new Color(199, 71, 7), new Color(223, 79, 7), new Color(223, 87, 7), new Color(223, 87, 7),
			new Color(215, 95, 7), new Color(215, 95, 7), new Color(215, 103, 15), new Color(207, 111, 15),
			new Color(207, 119, 15), new Color(207, 127, 15), new Color(207, 135, 23), new Color(207, 135, 23),
			new Color(199, 135, 23), new Color(199, 143, 23), new Color(199, 151, 31), new Color(191, 159, 31),
			new Color(191, 159, 31), new Color(191, 167, 39), new Color(191, 167, 39), new Color(191, 175, 47),
			new Color(183, 175, 47), new Color(183, 183, 47), new Color(183, 183, 55), new Color(207, 207, 111),
			new Color(223, 223, 159), new Color(239, 239, 199), new Color(255, 255, 255));

	Fire() {
		janela();
	}

	public void janela() {
		
		setResizable(false);
		PanePaint p = new PanePaint();

		this.getContentPane().setPreferredSize(new Dimension(fireWidth, fireHeight+30));
		
		JPanel paneBotoes = new JPanel();
		paneBotoes.setPreferredSize(new Dimension(fireWidth, 30));
		paneBotoes.setLayout(new GridBagLayout());
		GridBagConstraints c = new GridBagConstraints();
		c.fill = GridBagConstraints.HORIZONTAL;
		

		JButton leftWind = new JButton("Left Wind");
		leftWind.setBounds(0, 0, 20, 20);
		leftWind.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				leftWind();
			}
		});
		paneBotoes.add(leftWind);
		
		JButton lessFire = new JButton("-");
		lessFire.setBounds(0, 0, 20, 20);
		lessFire.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				decreaseFireSource();
			}
		});
		paneBotoes.add(lessFire);
		
		JButton minFire = new JButton("Min Fire");
		minFire.setBounds(0, 0, 20, 20);
		minFire.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				destroyFireSource();
			}
		});
		paneBotoes.add(minFire);
		

		JButton centerWind = new JButton("Center Wind");
		centerWind.setBounds(0, 0, 20, 20);
		centerWind.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				centerWind();
			}
		});
		paneBotoes.add(centerWind);
		
		JButton maxFire = new JButton("Max Fire");
		maxFire.setBounds(0, 0, 20, 20);
		maxFire.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				createFireSource();
			}
		});
		paneBotoes.add(maxFire);
		
		JButton moreFire = new JButton("+");
		moreFire.setBounds(0, 0, 20, 20);
		moreFire.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				increaseFireSource();
			}
		});
		paneBotoes.add(moreFire);
		
		JButton rightWind = new JButton("Right Wind");
		rightWind.setBounds(0, 0, 20, 20);
		rightWind.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				rightWind();
			}
		});
		paneBotoes.add(rightWind);
		

		JButton debug = new JButton("debug");
		debug.setBounds(0, 0, 20, 20);
		debug.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				toggleDebugMode();
			}
		});
		paneBotoes.add(debug);
		
		p.setPreferredSize(new Dimension(fireWidth, fireHeight));
		
		this.getContentPane().add(p, BorderLayout.CENTER);
		this.getContentPane().add(paneBotoes, BorderLayout.PAGE_START);
		
		setTitle("Fire !");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		pack();
		setVisible(true);
		
		
		
	}

	private void createFireDataStructure() {
		int numberOfRects = sizeRectHeight * sizeRectWidth;

		for (int i = 0; i < numberOfRects; i++) {
			fireRectsArray.add(0);
		}
	}

	private void renderFire() {
		for (int row = 0; row < fireHeight; row += sizeRect) {
			for (int column = 0; column < fireWidth; column += sizeRect) {
				coordrenderFire.add(new Coordenada(column, row));
			}
		}
	}

	private void createFireSource() {
		for (int column = 0; column < sizeRectWidth; column++) {
			int overFlowRectIndex = sizeRectWidth * sizeRectHeight;
			int rectIndex = (overFlowRectIndex - sizeRectWidth) + column;

			fireRectsArray.set(rectIndex, new Integer(36));
		}
	}

	private void calculateFirePropagation() {
		for (int column = 0; column < sizeRectWidth; column++) {
			for (int row = 0; row < sizeRectHeight; row++) {
				int rectIndex = column + (sizeRectWidth * row);
				updateFireIntensityPerRect(rectIndex);
			}
		}
	}

	private void updateFireIntensityPerRect(int currentRectIndex) {
		Random random = new Random();
		int belowRectIndex = currentRectIndex + sizeRectWidth;
		if(belowRectIndex >= sizeRectWidth * sizeRectHeight) {
			return;
		}
		
		int decay = random.nextInt(3);
		int belowRectFireIntensity = fireRectsArray.get(belowRectIndex);
		int newFireIntensity = belowRectFireIntensity - decay >= 0 ? belowRectFireIntensity - decay : 0;
		
		switch (senseFire) {
		case 0:
			fireRectsArray.set(currentRectIndex - decay < 0 ? currentRectIndex : currentRectIndex - decay, new Integer(newFireIntensity));
			break;
		case 1:
			fireRectsArray.set(currentRectIndex, new Integer(newFireIntensity));
			break;
		case 2:
			fireRectsArray.set(currentRectIndex + decay, new Integer(newFireIntensity));
			break;
		default:
			break;
		}
		
	}
	
	private void decreaseFireSource() {
		Random random = new Random();
		for (int column = 0; column < sizeRectWidth; column++) {
			int overFlowRectIndex = sizeRectWidth * sizeRectHeight;
			int rectIndex = (overFlowRectIndex - sizeRectWidth) + column;
			int currentFireIntensity = fireRectsArray.get(rectIndex);
			
			if(currentFireIntensity > 0) {
				int decay = random.nextInt(14);
				int newFireIntensity = currentFireIntensity - decay >=0 ? currentFireIntensity - decay : 0;
				fireRectsArray.set(rectIndex, new Integer(newFireIntensity));
			}
		}
	}
	
	private void increaseFireSource() {
		Random random = new Random();
		for (int column = 0; column < sizeRectWidth; column++) {
			int overFlowRectIndex = sizeRectWidth * sizeRectHeight;
			int rectIndex = (overFlowRectIndex - sizeRectWidth) + column;
			int currentFireIntensity = fireRectsArray.get(rectIndex);
			
			if(currentFireIntensity < 36) {
				int decay = random.nextInt(14);
				int newFireIntensity = currentFireIntensity + decay >= 36 ? 36 : currentFireIntensity + decay;
				fireRectsArray.set(rectIndex, new Integer(newFireIntensity));
				System.err.println(newFireIntensity);
			}
		}
	}
	
	private void toggleDebugMode() {
		if(debug) {
			debug = false;
		}else {
			debug = true;
		}
	}
	
	private void leftWind() {
		senseFire = 0;
	}
	
	private void centerWind() {
		senseFire = 1;
	}
	
	private void rightWind() {
		senseFire = 2;
	}
	
	private void destroyFireSource() {
		for (int column = 0; column < sizeRectWidth; column++) {
			int overFlowRectIndex = sizeRectWidth * sizeRectHeight;
			int rectIndex = (overFlowRectIndex - sizeRectWidth) + column;

			fireRectsArray.set(rectIndex, new Integer(0));
		}
	}
	

	public class PanePaint extends JPanel {

		private static final long serialVersionUID = 1L;

		Timer timer = null;

		public PanePaint() {
			createFireDataStructure();
			createFireSource();
			renderFire();
			ActionListener animate = new ActionListener() {
				public void actionPerformed(ActionEvent ae) {
					repaint();
					calculateFirePropagation();
				}
			};
			timer = new Timer(50, animate);
			timer.start();
		}

		@Override
		public void paint(Graphics g) {
			int rectIndex = 0;
			if(debug) {
				for (Coordenada coo : coordrenderFire) {
					g.setColor(Color.BLACK);
					g.fillRect(coo.row, coo.column, sizeRectWidth, sizeRectHeight);
					g.setColor(Color.WHITE);
					g.drawRect(coo.row, coo.column, sizeRectWidth, sizeRectHeight);
					g.setColor(palette.get(fireRectsArray.get(rectIndex)));
					g.setFont(new Font("TimesRoman", Font.PLAIN, 9));
					g.drawString(String.valueOf(rectIndex), coo.row, coo.column + 10);
					g.setColor(palette.get(fireRectsArray.get(rectIndex)));
					g.setFont(new Font("TimesRoman", Font.PLAIN, 13));
					g.drawString(String.valueOf(fireRectsArray.get(rectIndex)), coo.row + 8, coo.column + 20);
					rectIndex++;
				}
			}else {
				for(Coordenada coo : coordrenderFire) {
					g.setColor(palette.get(fireRectsArray.get(rectIndex)));
					g.fillRect(coo.row, coo.column, sizeRectWidth, sizeRectHeight);
					rectIndex++;
				}
			}
			
		}

	}

	public class Coordenada {
		int row;
		int column;

		public Coordenada(int row, int column) {
			this.row = row;
			this.column = column;
		}
	}

	public static void main(String[] args) {
		new Fire();
	}

}
