"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProgram = exports.CreateSheader = exports.StartWevGl = void 0;
const graphics_1 = require("./graphics");
function StartWevGl() {
    let canvas = document.getElementsByTagName("canvas")[0];
    //* Cria a classe de controle do canvas
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        return false;
    }
    //* Crias os dois shaders para renderizar os bagulho
    let vertexShader = CreateSheader(gl, gl.VERTEX_SHADER, graphics_1.vertexSource), fragmentShader = CreateSheader(gl, gl.FRAGMENT_SHADER, graphics_1.fragmentSource);
    if (!vertexShader || !fragmentShader) {
        return false;
    }
    //* Criando programa para executar os dois shaders
    let program = CreateProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        return false;
    }
    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        0.5, 0.5,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 4; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);
    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
    return true;
}
exports.StartWevGl = StartWevGl;
function CreateSheader(gl, type, source) {
    let shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        }
        else {
            console.info(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
    }
    console.log(`Não foi possivel criar shaders do tipo ${type}`);
    return null;
}
exports.CreateSheader = CreateSheader;
function CreateProgram(gl, vertex, fragment) {
    let program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
        else {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
    }
    return null;
}
exports.CreateProgram = CreateProgram;


