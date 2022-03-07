#version 300 es
#pragma vscode_glsllint_stage:frag
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

// we need to declare an output for the fragment shader
out vec4 outColor;

bool circle(vec2 position,float radius){
    return bool(step(radius, length(position-vec2(.5))));
}

void main(){
    float r = u_time;
    vec2 pos=gl_FragCoord.xy / u_resolution;

    if(circle(pos, 0.2)) {
        outColor=vec4(1.0);
    }
    else {
        outColor=vec4(pos, 1.0, 1.0);
    }
    // Just set the output to a constant redish-purple
}