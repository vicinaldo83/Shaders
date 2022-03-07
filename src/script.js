// importing
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';


const Texture =
{
    Loader: new THREE.TextureLoader(),
    Robo: "/assets/Robo.png"
}
// Render objects
const Screen = 
{
    Canvas: document.querySelector('canvas.webgl'),
    Scene: new THREE.Scene(),
    Render: new THREE.WebGLRenderer({
        canvas: document.querySelector('canvas.webgl'),
        alpha: true
    }),
    Sizes:
    {
            width: window.innerWidth,
            height: window.innerHeight
    },

    Build: function()
    {
        this.Render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.Render.setSize(Screen.Sizes.width, Screen.Sizes.height);

        return this;
    }    
}
Screen.Build();

// Scenario objects
const Room =
{
    Camera: new THREE.PerspectiveCamera(80, Screen.Sizes.width / Screen.Sizes.height),
    Light: new THREE.PointLight("#ffffff", 1),
    setCamPosition: function (axisX, axisY, axisZ) {
        this.Camera.position.set(axisX, axisY, axisZ)
        return this;
    },
    Model:
    {
        wall: new THREE.Mesh(),
        floor: new THREE.Mesh()
    },
    getFloor: function()
    {
        let floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial());
        floor.material.color = new THREE.Color("#ff6f61");
        
        floor.rotation.set(-0.8, 0.0, 0.0);
        floor.position.set(0.0, 0.5, 1.4);
        return floor;
    },
    getWall: function()
    {
        let wall = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), new THREE.MeshBasicMaterial());

        wall.material.color = new THREE.Color(Math.random() * 0xffffff)

        return wall;
    },

    update: function()
    {
        this.Model.wall.rotation.x = this.Model.floor.rotation.x + (Math.PI / 2)
        this.Model.wall.rotation.y = this.Model.floor.rotation.z
        this.Model.wall.rotation.z = -this.Model.floor.rotation.y

        this.Model.wall.position.setX(this.Model.floor.position.x);
        this.Model.wall.position.setY(this.Model.floor.position.y + 2.5);
        this.Model.wall.position.setZ(this.Model.floor.position.z + 1.5);
        
    }
}
Room.setCamPosition(0, 0, 6);
Room.Model.floor = Room.getFloor();
//Room.Model.wall = Room.getWall();
//Room.update();

for(let model in Room.Model)
{
    Screen.Scene.add(Room.Model[model])
}
Screen.Scene.add(Room.Light);


// Player objects
const Player = 
{
    mapRotation: 0,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    moveSpeed: 0.1,
    target:
    {
        x: 0,
        y: 0,
        z: 0
    },
    Sprite: new THREE.Sprite(),
    getPlayer: function()
    {
        let p = new THREE.Sprite(new THREE.SpriteMaterial({
                map: Texture.Loader.load(Texture.Robo)
        }));
        
        p.scale.set(1, 1, 1)
        p.rotation.set(0.0, 0.5, 0);
        p.position.set(0.0, 0.5, 0);
        return p;
    }
}
Player.Sprite = Player.getPlayer();
Screen.Scene.add(Player.Sprite);

// JS Events
window.addEventListener('resize', () =>
{
    Screen.Sizes.width = window.innerWidth
    Screen.Sizes.height = window.innerHeight

    Room.Camera.aspect = Screen.Sizes.width / Screen.Sizes.height
    Room.Camera.updateProjectionMatrix()

    Screen.Render.setSize(Screen.Sizes.width, Screen.Sizes.height)
    Screen.Render.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function RotateRoom(Event)
{
    Player.mapRotation += Event.deltaY * 0.0025;
}
document.addEventListener('wheel', RotateRoom)


function MouseMove(Event)
{
    Player.mouse.x = (Event.clientX / Screen.Sizes.width * 2) - 1
    Player.mouse.y = -((Event.clientY / Screen.Sizes.height * 2) - 1)
    
}
document.addEventListener("mousemove", MouseMove)


function MouseClick(Event)
{
    const inters = Player.raycaster.intersectObjects(Screen.Scene.children);
    for(let inter in inters)
    {
        let cords = inters[inter].point;
        Player.target.x = cords.x;
        Player.target.y = cords.y;
        Player.target.z = cords.z;
    }
}
document.addEventListener("click", MouseClick)

// Debug tool
const gui = new dat.GUI();

const folders = 
{
    camera: gui.addFolder("Camera")
}
for(let model in Room.Model)
{
    console.log(model)
}

for(let model in Room.Model)
{
    let m = Room.Model[model];

    folders[model] = gui.addFolder(model);
    let mPos = folders[model].addFolder("Positon");
    mPos.add(m.position, 'x', -5, 5, 0.1);
    mPos.add(m.position, 'y', -5, 5, 0.1);
    mPos.add(m.position, 'z', -5, 5, 0.1);

    let mRot = folders[model].addFolder("Rotation");
    mRot.add(m.rotation, 'x', -Math.PI, Math.PI, 0.01);
    mRot.add(m.rotation, 'y', -Math.PI, Math.PI, 0.01);
    mRot.add(m.rotation, 'z', -Math.PI, Math.PI, 0.01);
}


let camPos = folders.camera.addFolder("Position");
camPos.add(Room.Camera.position, 'x', -20, 20, 0.5);
camPos.add(Room.Camera.position, 'y', -20, 20, 0.5);
camPos.add(Room.Camera.position, 'z', -10, 10, 0.5);

let camRot = folders.camera.addFolder("Rotation");
camRot.add(Room.Camera.rotation, 'x', -Math.PI, Math.PI, 0.01);
camRot.add(Room.Camera.rotation, 'y', -Math.PI, Math.PI, 0.01);
camRot.add(Room.Camera.rotation, 'z', -Math.PI, Math.PI, 0.01);

// Main looping

const clock = new THREE.Clock()


function Velocidade(atual, s) { return (Player.target[s] - atual) * Player.moveSpeed }
console.log()
const tick = () =>
{
    Player.raycaster.setFromCamera(Player.mouse, Room.Camera)

    Room.Model.floor.rotateZ(Player.mapRotation);
    Player.mapRotation *= 0.01

    Player.Sprite.position.x += Velocidade(Player.Sprite.position.x, "x");
    Player.Sprite.position.y += Velocidade(Player.Sprite.position.y, "y") + 0.045;
    Player.Sprite.position.z += Velocidade(Player.Sprite.position.z, "z");

    Screen.Render.render(Screen.Scene, Room.Camera)
    window.requestAnimationFrame(tick)
}

tick()