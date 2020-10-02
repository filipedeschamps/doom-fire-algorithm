<p align="center">
  <a href="https://github.com/thadeucity">
    <img src="./doom-fire.gif" width="490">
  </a>
</p>

# Doom Fire Algorithm With CSS Grid
Another version of the Doom Fire, this time using CSS Grid to render the Fire.

```js

let html = `<div style="width: ${4*fireWidth}px; display:grid; grid-template-columns: repeat(${fireWidth}, auto)">`;

for (let i = 0; i<fireValuesArray.length; i++){
  html += `<div class="pixel" style="background-color: var(--color-${fireValuesArray[i]})"></div>`;
}

html += '</div>';

```

<center>

## This Version Author

| [<img src="https://avatars0.githubusercontent.com/u/6117516?s=460&u=359134f6d9803d68deffbdca7beecac73e47d8e8&v=3&s=115" width="120"><br><sub>@thadeucity</sub>](https://github.com/thadeucity) |
| :---: |



## Original Doom Fire Author

| [<img src="https://avatars0.githubusercontent.com/u/4248081?v=3&s=115" width="120"><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) |
| :---: |

</center>