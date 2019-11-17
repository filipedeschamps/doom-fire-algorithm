extends Sprite


export(Vector2) var size = Vector2(40, 40)
export(int) var pixel_scale = 10

const COLORS = [Color.white, Color.black]


func _ready():
	centered = false
	scale = Vector2(pixel_scale, pixel_scale)
	render()


func render():
	var img = Image.new()
	img.create(size.x, size.y, false, Image.FORMAT_RGB8)
	
	for x in range(img.get_width()):
		for y in range(img.get_height()):
			randomize()
			img.lock()
			img.set_pixel(x, y, Color(randf(), randf(), randf()))
			img.unlock()
	
	var tex = ImageTexture.new()
	tex.create_from_image(img)
	tex.flags = 0
	texture = tex
	update()