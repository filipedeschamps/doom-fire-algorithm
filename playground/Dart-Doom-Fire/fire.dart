import 'dart:html';
import 'dart:math' as Math;
import 'dart:async';
import 'dart:convert';


//Variaveis globais
var firePixelArray = [];
var fireColorsPalette = [['7,7,7'],['31,7,7'],['47,15,7'],['71,15,7'],['87,23,7'],['103,31,7'],['119,31,7'],['143,39,7'],['159,47,7'],['175,63,7'],['191,71,7'],['199,71,7'],['223,79,7'],['223,87,7'],['223,87,7'],['215,95,7'],['215,95,7'],['215,103,15'],['207,111,15'],['207,119,15'],['207,127,15'],['207,135,23'],['199,135,23'],['199,143,23'],['199,151,31'],['191,159,31'],['191,159,31'],['191,167,39'],['191,167,39'],['191,175,47'],['183,175,47'],['183,183,47'],['183,183,55'],['207,207,111'],['223,223,159'],['239,239,199'],['255,255,255']];
int fireWidth = 50;
int fireHeight = 50;
var debug = false;

//Funcao que inicializa o codigo
void main(){

    createFireDataStructure();
    createFireSource();
    renderFire();

    runfire();    
} 

void createFireDataStructure(){
    
    //multiplicando a altura pela largura para criar a tabela
    var numberOfPixels = fireHeight * fireWidth;

    //preenche com 0 - "potencia" do fogo
      for (int i = 0; i < numberOfPixels; i++) {
        firePixelArray.add(0);
      }
}

void createFireSource() {
    for (var column = 0; column < fireWidth; column++) {
        /*
            Como o for utiliza base 0 e o array base 1, ao criar a variavel overflowPixelIndex, ele trará um numero a mais
            Sabendo disso, o pixelIndex faz o calculo de forma que se subtraia uma linha, e incremente uma coluna.
            Ex:
            Array de 2 x 2 = 4 posições, ou de 0 a 3
            
            0 1
            2 3
            
            overflowPixelIndex = 2 x 2 = 4
            * para a primeira rodada do for
            column = 0
            pixelIndex = 4 - 2 + 0 = 2
            * Segunda rodada
            column = 1
            pixelIndex = 4 - 2 + 1 = 3
        */
        var overflowPixelIndex = fireWidth * fireHeight;
        var pixelIndex = (overflowPixelIndex - fireWidth) + column;

        firePixelArray[pixelIndex] = 36;
        
    }
    
}

void renderFire() {
    
    //monta a tabela no hmtl para criar o fogo
    var html = '<table cellpadding=0 cellspacing=0>';

    //percorre as linhas
    for (var row = 0; row < fireHeight; row++) {
        
        html += '<tr>';
        
        //percorre as colunas
        for (var column = 0; column < fireWidth; column++) {
            //encontra o indice
            var pixelIndex = column + (fireWidth * row);
            //grava o array de intensidade
            var fireIntensity = firePixelArray[pixelIndex];
            var color = fireColorsPalette[fireIntensity].toString();
            color = color.substring(1,(color.length)-1);

            
            if (debug == true) {
                html += '<td>';
                html +=  '<div class="pixel-index">${pixelIndex} </div>';  
                html += '<div style="color: rgb(${color})">${fireIntensity}</div>';
                html += '</td>';
            }else{

                html += '<td class="pixel" style="background-color: rgb(${color})"> </td>';
            }


        }
        
        html += '</tr>';    
        }
        html += '</table>';
    //atribui o valor a tag
    DivElement fireCanvas = querySelector('#fireCanvas');
    fireCanvas.setInnerHtml(html,treeSanitizer: new NullTreeSanitizer());

}

void calculateFirePropagation(){
    /*
        Para cada pixel percorrido, ele olhará o de baixo e subtrai 1
        Causando o efeito de fogo
    */
    for (var column = 0; column < fireWidth; column++) {
        for (var row = 0; row < fireHeight; row++) {
            //encontra o indice
            var pixelIndex = column + (fireWidth * row);

            updateFireIntensityPerPixel(pixelIndex);           
        }
    }

    renderFire();
}

void updateFireIntensityPerPixel(currentPixelIndex) {
    /*
        Pega o pixel atual e soma a largura, assim posiciona no pixel a baixo.
        Se o indice for maior que o tamanho do array, não faz nada
    */
    var belowPixelIndex = currentPixelIndex + fireWidth;

    if (belowPixelIndex >= fireWidth * fireHeight) {
        return;
    }

    var random = new Math.Random();
    var decay =  random.nextInt(3);
    
    var belowPixelIntensity = firePixelArray[belowPixelIndex];
    var newFireIntensity = 
        belowPixelIntensity - decay >= 0 ? belowPixelIntensity - decay : 0;

    
    firePixelArray[currentPixelIndex - decay] = newFireIntensity;
}



void setDebug(){
    /*
        Ativa ou desativa o modo de debug
    */
    
    if (debug == false) {
        fireWidth = 35;
        fireHeight = 25;
        debug = true;
    } else {
        fireWidth = 42;
        fireHeight = 42;
        debug = false;
    }

    createFireDataStructure();
    //console.log(firePixelArray);
    createFireSource();
}

void runfire() {
  const oneSec = const Duration(milliseconds:10);
  new Timer.periodic(oneSec, (Timer t) => calculateFirePropagation());
}


class NullTreeSanitizer implements NodeTreeSanitizer {
  /*
    Burlando a segurança do dart
  */
void sanitizeTree(Node node) {}
}
