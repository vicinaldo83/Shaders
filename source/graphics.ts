export const vertexSource = `#version 300 es
#pragma vscode_glsllint_stage : vert
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// all shaders have a main function
void main() {
  gl_Position = a_position;
}
`;

export const fragmentSource = `#version 300 es
#pragma vscode_glsllint_stage:frag

precision highp float;

out vec4 outColor;

void main(){
  outColor = vec4(0.9);
}
`;
