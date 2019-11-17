extends Node


var FireMap = preload("res://core/FireMap.gd").new()


func _ready():
	add_child(FireMap)