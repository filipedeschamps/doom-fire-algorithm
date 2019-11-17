extends Node


var FireMap = preload("res://core/FireMap.gd").new()
var Render = preload("res://core/Render.gd").new()


func _ready():
	add_child(FireMap)
	add_child(Render)