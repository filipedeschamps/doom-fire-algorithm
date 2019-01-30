
-- Doom Fire Algorithm
-- Author: WesleyCSJ - wesleyjr10@gmail.com
fireBlocks = {}
tilesize = 1
numberWidthBlocks = math.floor(love.graphics.getWidth() / tilesize)
numberHeightBlocks = 48 -- means all the 36 colors with a little more space to remaining flames
colors = {}
offsetY = love.graphics.getHeight() - (numberHeightBlocks * tilesize)
-- Update Variables
local fps = 0
local delta = 0
-- For optimizing purpose
local optimizedRandom = math.random
local optimizedFloor = math.floor
function love.load()
  colorsImage = love.graphics.newImage('colors.png')
  for color = 1, 36 do
    table.insert(colors, love.graphics.newQuad((((color - 1) * 24) + color), 0, tilesize, tilesize, colorsImage:getDimensions()))
  end
  for line = 1,numberHeightBlocks do
    table.insert(fireBlocks, {})
    local yValue = (line - 1) * tilesize + offsetY
    for col = 1,numberWidthBlocks do
      if line < numberHeightBlocks - 1 then
        table.insert(fireBlocks[line], {x = (col-1) * tilesize, y = yValue, color = 1})
      else
        table.insert(fireBlocks[line], {x = (col-1) * tilesize, y = yValue, color = 36})
      end
    end
  end
end

function love.draw()
  for line in ipairs(fireBlocks) do
    for col in ipairs(fireBlocks[line]) do
      love.graphics.draw(colorsImage, colors[fireBlocks[line][col].color],fireBlocks[line][col].x, fireBlocks[line][col].y)
    end
  end
  love.graphics.print('FPS: ' .. fps, 10,10)
end
function love.update(dt)
  for line = 1,numberHeightBlocks - 1 do
    for col = 2,numberWidthBlocks - 1 do
      local windDirection = optimizedRandom()
      local decay = optimizedFloor(optimizedRandom() * 3)
      local collumn_To_Apply = col
      if windDirection < 0.2 then
        collumn_To_Apply = (col - 1)
      elseif windDirection > 0.8 then
        collumn_To_Apply = (col + 1)
      end
      if fireBlocks[line+1][col].color - decay > 1 then
        fireBlocks[line][collumn_To_Apply].color = fireBlocks[line+1][col].color - decay
      else
        fireBlocks[line][collumn_To_Apply].color = 1
      end
    end
  end
  if delta > 0.5 then
    fps = optimizedFloor(1 / dt)
    delta = 0
  else
    delta = delta + dt
  end
end
