programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Matematica --> m
	inclua biblioteca Util --> u
	inclua biblioteca Teclado --> t
	inclua biblioteca Texto

	// Intervalo entre a renderizacao de cada quadro
	inteiro delay_por_frame = 50 // milisegundos

	// Tamanho de cada pixel
	const inteiro tamanho_pixel = 5


	/**
	 * Quantidade de pixels de largura e altura.
	 * 
	 * O tamanho do vetor deve ser calculado manualmente, 
	 * pois o portugol studio não permite atribuir expressões a variaveis constantes
	 */
	const inteiro largura = 100
	const inteiro altura = 50
	const inteiro tamanho_vetor = 5000 // tipo constante nao pode ser inicializado por expressao. == largura * altura	

	// Vetor que armazena as intencidades de cada pixel
	inteiro vetor_do_fogo[tamanho_vetor]

	// Vetor com as cores que compoem a paleta do fogo
	inteiro cores[37]

	// Tempos para calcular a velocidade da animacao do fogo
	inteiro t1 = u.tempo_decorrido()
	inteiro t2 = u.tempo_decorrido()
	
	funcao inicio()
	{
		// Inicializacao da biblioteca gráfica
		g.iniciar_modo_grafico(verdadeiro)
		g.definir_dimensoes_janela(largura * tamanho_pixel, altura * tamanho_pixel)
		g.definir_titulo_janela("Fogo do Doom - versao Portugol Studio - mshlz")

		// Aloca as cores no vetor de cores
		iniciar_vetor_de_cores()

		// Inicializa o vetor dos pixels
		iniciar_estrutura_de_dados()

		// Inicializa a base do fogo
		criar_fonte_do_fogo()

		// Loop infinito, que atualiza a intencidade dos pixels e renderiza na tela
		enquanto(verdadeiro){

			// Verifica se alguma tecla de comando foi pressionada
			se (t.tecla_pressionada(t.TECLA_C))
			{
				cessar_fogo()
			}
			se (t.tecla_pressionada(t.TECLA_F))
			{
				criar_fonte_do_fogo()
			}
			se (t.tecla_pressionada(t.TECLA_SETA_ACIMA))
			{
				delay_por_frame--
								
				se (delay_por_frame < 0)
				{
					delay_por_frame = 0
				}
			}
			se (t.tecla_pressionada(t.TECLA_SETA_ABAIXO))
			{
				delay_por_frame++
			}

			calcular_propagacao_do_fogo()
			renderizar_banner_de_ajuda()
				
			g.renderizar() // Renderiza o frame na tela
			u.aguarde(17) // [60 fps] ==> 1s = 1000ms ==> 1000ms / 60 frames ~= 17ms
		}
	}

	funcao iniciar_estrutura_de_dados()
	{
		para (inteiro i = 0; i < tamanho_vetor; i++)
		{
			// Inicializa todas as posições do vetor com a intencidade 0
			vetor_do_fogo[i] = 0
		}
	}

	funcao iniciar_vetor_de_cores()
	{	
		cores[0] = g.criar_cor(7, 7, 7)
		cores[1] = g.criar_cor(31, 7, 7)
		cores[2] = g.criar_cor(47, 15, 7)
		cores[3] = g.criar_cor(71, 15, 7)
		cores[4] = g.criar_cor(87, 23, 7)
		cores[5] = g.criar_cor(103, 31, 7)
		cores[6] = g.criar_cor(119, 31, 7)
		cores[7] = g.criar_cor(143, 39, 7)
		cores[8] = g.criar_cor(159, 47, 7)
		cores[9] = g.criar_cor(175, 63, 7)
		cores[10] = g.criar_cor(191, 71, 7)
		cores[11] = g.criar_cor(199, 71, 7)
		cores[12] = g.criar_cor(223, 79, 7)
		cores[13] = g.criar_cor(223, 87, 7)
		cores[14] = g.criar_cor(223, 87, 7)
		cores[15] = g.criar_cor(215, 95, 7)
		cores[16] = g.criar_cor(215, 95, 7)
		cores[17] = g.criar_cor(215, 103, 15)
		cores[18] = g.criar_cor(207, 111, 15)
		cores[19] = g.criar_cor(207, 119, 15)
		cores[20] = g.criar_cor(207, 127, 15)
		cores[21] = g.criar_cor(207, 135, 23)
		cores[22] = g.criar_cor(199, 135, 23)
		cores[23] = g.criar_cor(199, 143, 23)
		cores[24] = g.criar_cor(199, 151, 31)
		cores[25] = g.criar_cor(191, 159, 31)
		cores[26] = g.criar_cor(191, 159, 31)
		cores[27] = g.criar_cor(191, 167, 39)
		cores[28] = g.criar_cor(191, 167, 39)
		cores[29] = g.criar_cor(191, 175, 47)
		cores[30] = g.criar_cor(183, 175, 47)
		cores[31] = g.criar_cor(183, 183, 47)
		cores[32] = g.criar_cor(183, 183, 55)
		cores[33] = g.criar_cor(207, 207, 111)
		cores[34] = g.criar_cor(223, 223, 159)
		cores[35] = g.criar_cor(239, 239, 199)
		cores[36] = g.criar_cor(255, 255, 255)
	}

	funcao criar_fonte_do_fogo()
	{
		// Calcula o primeiro indice da ultima linha
		inteiro indice_pixel = largura * altura - largura
		
		// Calcula o ultimo indice (consequentemente o ultimo da última linha tambem)
		inteiro ultimo_indice = largura * altura - 1

		enquanto (indice_pixel <= ultimo_indice)
		{
			vetor_do_fogo[indice_pixel] = 36
			indice_pixel++
		}
	}

	funcao cessar_fogo()
	{
		// Calcula o primeiro indice da ultima linha
		inteiro indice_pixel = largura * altura - largura
		
		// Calcula o ultimo indice (consequentemente o ultimo da ultima linha também)
		inteiro ultimo_indice = largura * altura - 1

		enquanto (indice_pixel <= ultimo_indice)
		{
			vetor_do_fogo[indice_pixel] = 0
			indice_pixel++
		}
	}
	
	funcao calcular_propagacao_do_fogo()
	{
		// Somente atualiza se ja tiver passado o tempo minimo para gerar os novos indices
		se(t2 - t1 > delay_por_frame) {
			// Primeiro índice
			inteiro indice_pixel = 0
			
			// Ultimo indice
			inteiro ultimo_indice = largura * altura - 1
	
			// Atualiza cada um dos pixels
			enquanto(indice_pixel <= ultimo_indice)
			{
				atualizar_intencidade_por_pixel(indice_pixel)
				indice_pixel++
			}
			t1 = t2
		}
		t2 = u.tempo_decorrido()			
	
		// Renderiza a estrutura na tela (mostra o fogo na tela!)
  		renderizar_fogo()
	}

	funcao atualizar_intencidade_por_pixel(inteiro indice)
	{
		inteiro indice_pixel_abaixo = indice + largura

		// Tratamento de erro para a ultima linha (overflow)
		se (indice_pixel_abaixo >= largura * altura) {
			retorne
		}

		inteiro decremento = u.sorteia(0, 3)
		inteiro intencidade_pixel_abaixo = vetor_do_fogo[indice_pixel_abaixo]
		
		inteiro nova_intencidade = intencidade_pixel_abaixo - decremento

		// Previne que a intencidade receba valores negativos
		se (nova_intencidade < 0)
		{
			nova_intencidade = 0
		}

		// Garante que o indice atual e suficientemente grande para ser decrementado
		se (indice >= decremento) 
		{
			vetor_do_fogo[indice - decremento] = nova_intencidade
		}
		senao 
		{
			vetor_do_fogo[indice] = nova_intencidade
		}
	}

	funcao renderizar_fogo()
	{
		inteiro i = 0
		para (inteiro linha = 0; linha < altura; linha++)
		{
			para (inteiro coluna = 0; coluna < largura; coluna++)
			{
				g.definir_cor(cores[vetor_do_fogo[i]])
				g.desenhar_retangulo(coluna * tamanho_pixel, linha * tamanho_pixel, tamanho_pixel, tamanho_pixel, falso, verdadeiro)
				i++
			}
		}
	}

	// Variaveis para a animacao do texto com as instrucoes
	inteiro x_texto = 10
	inteiro y_texto = 10
	inteiro incrementador = 1
	inteiro tempo_1 = u.tempo_decorrido()
	inteiro tempo_2 = u.tempo_decorrido()
	inteiro tempo_3 = u.tempo_decorrido()
	inteiro tempo_4 = u.tempo_decorrido()
	
	funcao renderizar_banner_de_ajuda()
	{
		// Desenha a faixa em preto na parte superior
		g.definir_cor(g.COR_PRETO)
		g.desenhar_retangulo(0, 0, largura*tamanho_pixel, 30, falso, verdadeiro)

		// Define a cor, a fonte do texto e o texto
		g.definir_cor(g.COR_BRANCO)
		g.definir_fonte_texto("consolas")
		cadeia texto = "Pressione [F] para iniciar o fogo. Pressione [C] para cessar o fogo. [SETA ACIMA] aumenta a velocidade. [SETA ABAIXO] diminui a velocidade.  - Implementado por mshlz, baseado no codigo de @filipedeschamps -    (Delay atual: " + delay_por_frame + ")"

		// Calculos para a animacao
		inteiro tamanho_texto = Texto.numero_caracteres(texto)

		// Posicao da segunda copia (pos. atual do texto + o tamanho que o texto ocupa + uma margem)
		inteiro x2 = x_texto + tamanho_texto * 7 + 20

		// Calculos para a animacao ficar desacoplada do ciclo de atualizacao, suave.
		se (tempo_2 - tempo_1 > 100)
		{
			// modifica a posicao vertical
			y_texto += incrementador
			tempo_1 = tempo_2
		}
		se (tempo_4 - tempo_3 > 10)
		{
			// modifica a posicao horizontal
			x_texto--
			tempo_3 = tempo_4
		}
		tempo_2 = u.tempo_decorrido()
		tempo_4 = u.tempo_decorrido()

		// Quando alcanca o maximo ou minimo, inverte a direcao
		se (y_texto > 10)
		{
			incrementador = -1
		}
		senao se (y_texto < 4)
		{
			incrementador = 1
		}

		// Desenha o texto
		g.desenhar_texto(x_texto, y_texto, texto)
		g.desenhar_texto(x2, y_texto, texto)

		// Reseta a posicao horizontal no momento que o primeiro ja estiver [quase] completo
		se (Texto.numero_caracteres(texto) * 7 < m.valor_absoluto(x_texto))
		{
			x_texto = x2
		}

	}
}