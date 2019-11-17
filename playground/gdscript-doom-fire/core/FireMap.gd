extends Node


var map = []

export(int) var width = 40 setget , get_width
export(int) var height = 40 setget , get_height

const max_id = 27


var timer = Timer.new()


func _ready():
	fill()
	
	timer.connect("timeout", self, "generate_fire")
	timer.wait_time = 0.5
	timer.one_shot = false
	timer.autostart = true
	add_child(timer)


func fill():
	for x in range(width):
		for y in range(height):
			map.append(0)


func generate_fire():
	for x in range(width):
		for y in range(height):
			update_fire_intensity(Vector2(x, y))


func update_fire_intensity(vec):
	randomize()
	var decay = randi()%3+1
	
	var below_pixel = get_pixel(Vector2(vec.x - 1, vec.y))
	map[below_pixel] = get_pixel(vec) - decay
	
	if get_pixel(vec) - decay >= 0:
		map[get_map_id(vec)] = max_id - decay
	
#	if currentPixelIndex - decay >= 0:
#		firePixelsArray[currentPixelIndex - decay] = newIntensity
#    else:
#		firePixelsArray[0] = newIntensity


func get_map_id(vec):
	return vec.x + (height * vec.y)


func get_pixel(vec):
	return map[get_map_id(vec)]


func get_size():
	return map.size()


func get_width():
	return width


func get_height():
	return height