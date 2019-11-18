extends Sprite


export(int) var pixel_scale = 10

const COLORS = [
	Color(7, 7, 7), Color( 31,  7,  7), Color( 47, 15,  7), Color( 71, 15,  7), Color( 87, 23,  7), Color(103, 31,  7), Color(119, 31,  7), Color(143, 39,  7),
	Color(159, 47,  7), Color(175, 63,  7), Color(191, 71,  7), Color(199, 71,  7), Color(223, 79,  7), Color(223, 87,  7), Color(223, 87,  7), Color(215, 95,  7),
	Color(215, 95,  7), Color(215,103, 15), Color(207,111, 15), Color(207,119, 15), Color(207,127, 15), Color(207,135, 23), Color(199,135, 23), Color(199,143, 23),
	Color(199,151, 31), Color(191,159, 31), Color(191,159, 31), Color(191,167, 39), Color(191,167, 39), Color(191,175, 47), Color(183,175, 47), Color(183,183, 47),
	Color(183,183, 55), Color(207,207,111), Color(223,223,159), Color(239,239,199), Color(255,255,255)
]


func _ready():
	global_position = Vector2(1024, 500) / 2.0
	scale = Vector2(pixel_scale, pixel_scale)


func render(target):
	if texture != null:
		texture = null
	
	var img = Image.new()
	img.create(target.width, target.height, false, Image.FORMAT_RGBA8)
	
	for x in range(target.width):
		for y in range(target.height):
			var col = COLORS[clamp(abs(target.get_pixel(Vector2(x, y))), 0, target.max_id)]
			
			img.lock()
			img.set_pixel(x, y, Color(col.r / 255.0, col.g / 255.0, col.b / 255))
			img.unlock()
	
	var tex = ImageTexture.new()
	tex.create_from_image(img)
	tex.flags = 0
	texture = tex
	update()
	
	img = null