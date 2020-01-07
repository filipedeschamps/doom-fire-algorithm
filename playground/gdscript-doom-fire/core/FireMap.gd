extends Node


var fire_pixels_array = []

export(int) var width = 50 setget , get_width
export(int) var height = 50 setget , get_height

var max_id = 36


var timer = Timer.new()

var target


func _ready():
	fill()
	
	timer.connect("timeout", self, "calculate_fire_propagation")
	timer.wait_time = 0.1
	timer.one_shot = false
	timer.autostart = true
	add_child(timer)


func fill():
	var length = width * height
	
	for i in range(length + 1):
		fire_pixels_array.append(0)


func calculate_fire_propagation():
	for x in range(width):
		for y in range(height):
			update_fire_intensity(Vector2(x, y))
	
	target.render(self)


func update_fire_intensity(current_pixel):
	randomize()
	var decay = randi()%2+1
	
	if get_id(current_pixel + Vector2(0, 1)) > width * height:
		return
	elif get_id(current_pixel - Vector2(0, 1)) < 0:
		return
	
	if current_pixel - Vector2(0, 1) > Vector2(0, 0):
		var below_pixel = get_id(current_pixel - Vector2(randi()%3+0, 1))
		fire_pixels_array[below_pixel] = get_pixel(current_pixel) - decay
	
	if get_pixel(current_pixel) - decay >= 0:
		fire_pixels_array[get_id(current_pixel)] = max_id - decay


func get_id(vec):
	return vec.x + (height * vec.y)


func get_pixel(vec):
	return fire_pixels_array[get_id(vec)]


func get_size():
	return fire_pixels_array.size()


func get_width():
	return width


func get_height():
	return height