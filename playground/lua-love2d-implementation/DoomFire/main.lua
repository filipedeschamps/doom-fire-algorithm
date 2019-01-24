
-- Doom Fire Algorithm
-- Author: WesleyCSJ - wesleyjr10@gmail.com
fireBlocks = {}
tilesize = 8
numberWidthBlocks = math.floor(love.graphics.getWidth() / tilesize)
numberHeightBlocks = math.floor(love.graphics.getHeight() / tilesize)
colors = {
  {r=7,g=7,b=7},
  {r=31,g=7,b=7},
  {r=47,g=15,b=7},
  {r=71,g=15,b=7},
  {r=87,g=23,b=7},
  {r=103,g=31,b=7},
  {r=119,g=31,b=7},
  {r=143,g=39,b=7},
  {r=159,g=47,b=7},
  {r=175,g=63,b=7},
  {r=191,g=71,b=7},
  {r=199,g=71,b=7},
  {r=223,g=79,b=7},
  {r=223,g=87,b=7},
  {r=223,g=87,b=7},
  {r=215,g=95,b=7},
  {r=215,g=95,b=7},
  {r=215,g=103,b=15},
  {r=207,g=111,b=15},
  {r=207,g=119,b=15},
  {r=207,g=127,b=15},
  {r=207,g=135,b=23},
  {r=199,g=135,b=23},
  {r=199,g=143,b=23},
  {r=199,g=151,b=31},
  {r=191,g=159,b=31},
  {r=191,g=159,b=31},
  {r=191,g=167,b=39},
  {r=191,g=167,b=39},
  {r=191,g=175,b=47},
  {r=183,g=175,b=47},
  {r=183,g=183,b=47},
  {r=183,g=183,b=55},
  {r=207,g=207,b=111},
  {r=223,g=223,b=159},
  {r=239,g=239,b=199},
  {r=255,g=255,b=255}
}
function love.load()
  for line = 1,numberHeightBlocks - 1 do
    table.insert(fireBlocks, {})
    for col = 1,numberWidthBlocks do
      table.insert(fireBlocks[line], {x = (col-1) * tilesize, y = (line-1) * tilesize, color = 1})
    end
  end
  table.insert(fireBlocks, {})
  for col = 1,numberWidthBlocks do
    table.insert(fireBlocks[numberHeightBlocks], {x = (col-1) * tilesize, y = (numberHeightBlocks-1) * tilesize, color = 36})
  end
end

function love.draw()
  for line in ipairs(fireBlocks) do
    for col in ipairs(fireBlocks[line]) do
      love.graphics.setColor((colors[fireBlocks[line][col].color].r/255),(colors[fireBlocks[line][col].color].g/255),(colors[fireBlocks[line][col].color].b/255),1)
      love.graphics.rectangle('fill', fireBlocks[line][col].x, fireBlocks[line][col].y, tilesize, tilesize)
    end
  end
end
function love.update(dt)
  for line = 1,numberHeightBlocks - 1 do
    for col = 2,numberWidthBlocks do
      local leftOrRight = math.random()
      local decay = math.floor(math.random() * 3)
      if leftOrRight > 0.5 then
        if fireBlocks[line+1][col].color - decay > 1 then
          fireBlocks[line][col].color = fireBlocks[line+1][col].color - decay
        else
          fireBlocks[line][col].color = 1
        end
      else
        if fireBlocks[line+1][col].color - decay > 1 then
          fireBlocks[line][col-1].color = fireBlocks[line+1][col].color - decay
        else
          fireBlocks[line][col-1].color = 1
        end
      end
    end
  end
end
