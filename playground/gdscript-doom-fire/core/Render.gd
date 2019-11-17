extends Sprite


export(Vector2) var size = Vector2(40, 40)
export(int) var pixel_scale = 10
export(float) var update_time = 1 / 10.0

const COLORS = [Color.white, Color.black]

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
			img.set_pixel(x, y, COLORS[target.get_pixel(Vector2(x, y))])
			img.unlock()
	
	var tex = ImageTexture.new()
	tex.create_from_image(img)
	tex.flags = 0
	texture = tex
	update()
	
	img = null