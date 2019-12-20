#! /bin/bash

## legal o foguinho, olhei mais de uma vez o algoritimo
## e fiquei com aquela coceira na mão de implementar
## tava indo dormir e voltei e fiz em shell script (bash) !!!
## é lento que dói, só não implementei ainda o aumento de chamas
## e o decremento, mas diminuindo os valores de lin e col
## até fica parecido. minha escolha de cores não foi perfeita
## fui no olhômetro olhando uma palheta e não tem as 37 ou 36 cores
## se deixar espaço depois do primeiro "m" no array de cores
## a cor escura aparece, se deixar como está a cor fica transparente
## Have fun !!! :D Se puderem fazer um videozinho pra por no youtube
## se tua máquina for bem rápida. tput é muito lento, o echo salvou
## no final usando escape codes de posicionamento.
## sou viciado nesses screensaver de cli escrito em bash
## tem pipes.sh, vários do matrix e agora tem do fogo do DOOM !
## Meu game favorito, é tosco eu sei, qdoom is ma fav mod.
## viva o doomworld e moddb . Viva o Doom ! Fui !

lin=$(tput lines)
lin=40
col=$(tput cols)
col=180
tpx=$(($col * $lin))

declare -a fpx

# espaço na primeira or depois do primeiro "m"
# para mostrar fundo escuro
fcl=("\e[48;5;0m\e[m" "\e[48;5;52m \e[m"\
 "\e[48;5;88m \e[m" "\e[48;5;94m \e[m" "\e[48;5;124m \e[m"\
 "\e[48;5;1m \e[m" "\e[48;5;130m \e[m" "\e[48;5;136m \e[m"\
 "\e[48;5;160m \e[m" "\e[48;5;166m \e[m" "\e[48;5;167m \e[m"\
 "\e[48;5;172m \e[m" "\e[48;5;178m \e[m" "\e[48;5;196m \e[m"\
 "\e[48;5;202m \e[m" "\e[48;5;208m \e[m" "\e[48;5;214m \e[m"\
 "\e[48;5;220m \e[m" "\e[48;5;226m \e[m" "\e[48;5;11m \e[m"\
 "\e[48;5;190m \e[m" "\e[48;5;227m \e[m" "\e[48;5;228m \e[m"\
 "\e[48;5;229m \e[m" "\e[48;5;230m \e[m" "\e[48;5;231m \e[m"\
 "\e[48;5;15m \e[m")


# est for color array
#for i in {1..38};do echo -e ${fcl[$i]};done

Wind=$(($RANDOM%3)) # 0=left;1=nada;2=right


function start(){

# make cursor
# disapear
tput civis

#clear the screen
clear

makeDataArray
makeFireSauce
#fireRenderVousz

while true
do
  firePropeler
done

# get cursor back
tput cnorm

# include new line to 
# put prompt in a ...
# new line
echo -e '\n\n'

}

# function ok, it does what it
# has to do
function makeDataArray(){
str='0'
for i in $(seq ${str} ${tpx})
do
  fpx[$i]=0
done
}


function firePropeler(){
for ((colx=0;colx<col;colx++))
do
  for ((rowx=0;rowx<lin;rowx++))
  do
    otPidx=$(($colx + ( $col * $rowx) ))
    updateFireIntensity $otPidx
  done
done
fireRenderVousz
}


function fireRenderVousz(){

for ((rowr=0 ; rowr<lin ; rowr++))
do
  for ((colr=0 ; colr<col ; colr++))
  do
    pidx=$(($colr + ($col * $rowr)))
    fInt=${fpx[$pidx]} #fire intensity
    nClr=${fcl[$fInt]} # color
#tput cup $rowr $colr && echo -en ${nClr}
echo -en "\033[${rowr};${colr}H${nClr}\033[H"
  done
done
}

function updateFireIntensity(){
crPidx="$1" # currentPixelIndex
blPidx=$(( $crPidx + $col )) # BellowPixelIndex
cPLUSl=$(( $col * $lin ))

if [ $blPidx -gt $cPLUSl ]
then
  return
fi

decay=$(($RANDOM%3))

blFPint=${fpx[$blPidx]}  # belowFirePixelIntensity
nwFPint=$(($blFPint - $decay))   # newFirePixelIntensity

if [ $nwFPint -le 0 ]
then
  nwFPint=0
fi

if [ $Wind -eq 0 ]
then
  fpx[$(($crPidx - $decay))]=$nwFPint
fi

if [ $Wind -eq 1 ]
then
  fpx[$crPidx]=$nwFPint
fi

if [ $Wind -eq 2 ]
then
  fpx[$(($crPidx + $decay))]=$nwFPint
fi
}


function makeFireSauce(){
for ((cols=0 ;cols<col ;cols++))
do
  ovPidx=$(($lin * $col))
  nwPidx=$(($ovPidx - $col))
  nwPidx=$(($nwPidx + $cols))
  frInts=fpx[$nwPidx]
  fpx[$nwPidx]=36
done
}


start

