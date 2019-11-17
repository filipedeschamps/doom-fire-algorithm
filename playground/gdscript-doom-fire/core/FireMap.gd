extends Node


var map = []

var width = 40 setget , get_width
var height = 40 setget , get_height


func _ready():
	for x in range(width):
		for y in range(height):
			map.append(0)


func generate():
	pass


func get_pixel(vec):
	return map[vec.x + (height * vec.y)]


func get_size():
	return map.size()


func get_width():
	return width


func get_height():
	return height