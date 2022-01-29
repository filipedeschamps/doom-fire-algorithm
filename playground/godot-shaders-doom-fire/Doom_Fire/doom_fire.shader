shader_type canvas_item;

// Controlled from GDscript
uniform sampler2D palette;
uniform float px = 2.0;
uniform float doBottom = 1.0;

// Kinda random I guess?
int random(vec2 co, float threshold) {
	return int(step(fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) ,threshold));
}

// We have a palette texture. It has 36 colours in it. We use it to get the palette colour
// Done since Godot has no array
vec3 getFireColour(int a) {
	return texture(palette, vec2(float(a)/36.0, 0.5)).rgb;
}

// get the palette index from a colour. 0 if none.
int getFireIndex(vec3 col) {
	for(int x = 0; x <= 36; x++) {
		if (col == getFireColour(x)) {
			return int(x);
		}
	}
	return 0;
}

vec4 getColor(vec4 cc, float time, vec2 uv, vec2 sz, in sampler2D tex) {
	// Bottom line is the brightest and hottest
	float bottom = step(1.0-sz.y, uv.y);
	vec4 bottomCol = vec4(getFireColour(36), 1.0) * float(bottom) * doBottom;
	// Horizontal movement, flicker of the flames
	float randx = float(random(vec2(uv.x+time, uv.y+time), 0.2));
	uv += vec2(randx, 1.) * sz*px;
	uv.x = mod(uv.x, 1.0);
	
	vec3 col = texture(tex, uv).rgb;
	int belowIndex = getFireIndex(col);
	vec4 prospectiveCol = vec4(getFireColour(belowIndex - random(vec2(uv.x+time, uv.y+time), 0.5 )) , 1.0);//*float(1.bottom);
	return bottomCol + prospectiveCol;
}

void fragment() {

	vec2 uv = SCREEN_UV;
	vec2 sz = SCREEN_PIXEL_SIZE;

	COLOR = getColor(texture(TEXTURE, uv), TIME, uv, sz, TEXTURE);
}