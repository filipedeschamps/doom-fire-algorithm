extends Node2D


export(Vector2) var size = Vector2(40, 40)

const COLORS = [Color.white, Color.black]

var pixel_scale = 10

var texture = ImageTexture.new()


func _ready():
	render()


func _draw():
	draw_texture(texture, Vector2())


func render():
	var img = Image.new()
	img.create(size.x, size.y, true, Image.FORMAT_RGBA8)
	img.fill(Color.black)
	img.lock()
	img.set_pixel(0, 0, Color.white)
	img.unlock()
	
	texture.create_from_image(img)