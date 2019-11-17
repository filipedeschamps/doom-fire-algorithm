extends Sprite


export(Vector2) var size = Vector2(40, 40)
export(int) var pixel_scale = 10
export(float) var update_time = 1 / 10.0

const COLORS = [
	Color(7, 7, 7), Color( 31,  7,  7), Color( 47, 15,  7), Color( 71, 15,  7), Color( 87, 23,  7), Color(103, 31,  7), Color(119, 31,  7), Color(143, 39,  7),
	Color(159, 47,  7), Color(175, 63,  7), Color(191, 71,  7), Color(199, 71,  7), Color(223, 79,  7), Color(223, 87,  7), Color(223, 87,  7), Color(215, 95,  7),
	Color(215, 95,  7), Color(215,103, 15), Color(207,111, 15), Color(207,119, 15), Color(207,127, 15), Color(207,135, 23), Color(199,135, 23), Color(199,143, 23),
	Color(199,151, 31), Color(191,159, 31), Color(191,159, 31), Color(191,167, 39), Color(191,167, 39), Color(191,175, 47), Color(183,175, 47), Color(183,183, 47),
	Color(183,183, 55), Color(207,207,111), Color(223,223,159), Color(239,239,199), Color(255,255,255)
]

var timer = Timer.new()

var target


func _ready():
	centered = false
	scale = Vector2(pixel_scale, pixel_scale)
	render()
	
	timer.connect("timeout", self, "request_render")
	timer.wait_time = update_time
	timer.one_shot = true
	timer.autostart = true
	
	add_child(timer)


func request_render():
	render()
	timer.wait_time = update_time
	timer.start()


func render():
	if texture != null:
		texture = null
	
	var img = Image.new()
	img.create(size.x, size.y, false, Image.FORMAT_RGBA8)
	
	for x in range(img.get_width()):
		for y in range(img.get_height()):
			img.lock()
			var col = COLORS[target.get_pixel(Vector2(x, y))]
			img.set_pixel(x, y, Color(col.r / 255.0, col.g / 255.0, col.b / 255))
			img.unlock()
	
	var tex = ImageTexture.new()
	tex.create_from_image(img)
	tex.flags = 0
	texture = tex
	update()
	
	img = null