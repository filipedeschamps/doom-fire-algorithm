# doom-fire-algorithm - KOF

[English](README.md)

Efeito de fogo do DOOM em [Kof](https://github.com/KofLang/Kof4j), uma linguagem nova, estaticamente tipada, que compila para JVM, nativo e web a partir do mesmo código-fonte.

Mesma lógica de propagação do original: a linha de baixo nasce com intensidade máxima, cada pixel copia o de baixo com decaimento aleatório e leve deriva horizontal, mapeado numa paleta de 36 passos. Renderizado como cor de fundo ANSI 24 bits, dois espaços por célula.

## Requisitos

- [Kof](https://github.com/KofLang/Kof4j/releases) (0.3.x-beta ou mais recente)

## Rodando

```
git clone https://github.com/filipedeschamps/doom-fire-algorithm.git
cd doom-fire-algorithm/playground/kof-implementation
kof run Main.kf --target jvm
```

Ctrl+C para parar, roda para sempre.

## Mais

Uma versão bilíngue (PT/EN) no browser, com slider de intensidade do fogo ao vivo, servida pelo próprio `kof.web`, além da versão de terminal acima: [obrenoalvim/doom-fire-kof](https://github.com/obrenoalvim/doom-fire-kof).
