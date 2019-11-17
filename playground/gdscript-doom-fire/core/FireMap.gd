extends Node


var map = []

export(int) var width = 40 setget , get_width
export(int) var height = 40 setget , get_height
export(int) var decay = 1


var timer = Timer.new()


func _ready():
	fill()


func fill():
	for x in range(width):
		for y in range(height):
			map.append(0)


func generate_fire():
	for x in range(width):
		for y in range(height):
			map[get_map_id(Vector2(x, y))]


func update_fire_intensity(pixel):
	randomize()
	map[get_map_id(Vector2(39, 39))] = randi()%10


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