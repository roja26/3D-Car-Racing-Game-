import * as THREE from 'three';
import { CubeUVReflectionMapping, FrontSide, Vector3 } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

var clock = new THREE.Clock();

// state variable of toycar
var pos = new THREE.Vector3(-13, 0.5, -65);
var angle = 0;
var speed = 5;
var view_mode = 1;

// dashboard variables
var health = 5;
var fuel = 10000;
var score = 0;
var time = 0;
var tot_dist = 0;
let start = false;  

var ranklist = [];
var laps = [0,0,0];
var my_laps = 0;
// array of strings to store car names
var car_names = ["You", "yellow_car", "silver_car", "purple_car"];
const renderer = new THREE.WebGLRenderer({antialias: false}); // framerate

// create a new renderer and attach it to a new DOM element
document.getElementById("start").innerHTML = "<pre> Welcome to Car Racing!\n\nPress S to start the game\n\nUse arrow keys to move the car\nPress T for first person view\nPress B for birds eye view</pre>";
canvasElm = document.getElementById('map');
const renderer2 = new THREE.WebGLRenderer({antialias: true, canvas: canvasElm});
renderer2.setSize(window.innerWidth/5, window.innerHeight/5);
//document.body.appendChild(renderer2.domElement);

// create a new camera for the small view
const camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.lookAt(new THREE.Vector3(0, 0, 0));
camera2.position.set(0, 50, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-8, 2, -70); // normal view - 1
//camera.position.set(0, 300, 0); 
camera.lookAt (new THREE.Vector3(0,0,0));
orbit.update();

const grid = new THREE.GridHelper(500, 500);
//scene.add(grid); 


// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );


const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);


const gltfLoader = new GLTFLoader();
//renderer.outputEncoding = THREE.sRGBEncoding;
const rgbeLoader = new RGBELoader();

let my_car;
let y_car;
let s_car;
let p_car;
let track_1;
let track_2;

gltfLoader.load('./assets/red_car/scene.gltf', function(gltf){
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    my_car = model;
    my_car.scale.set(0.5, 0.5, 0.5);
    my_car.position.set(-13, 0.5, -65);
    my_car.rotation.y = 1.57;
});

gltfLoader.load('./assets/yellow_car/scene.gltf', function(gltf){
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    y_car = model;
    y_car.scale.set(0.15, 0.15, 0.15);
    y_car.position.set(-13, 0.2, -62);
    y_car.rotation.y= 1.57;
});

gltfLoader.load('./assets/silver_car/scene.gltf', function(gltf){
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    s_car = model;
    s_car.scale.set(0.5, 0.5, 0.5);
    s_car.position.set(-13, 0.3, -58);
    s_car.rotation.y= 1.57;
});

gltfLoader.load('./assets/superlite/scene.gltf', function(gltf){
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    p_car = model;
    p_car.scale.set(0.007, 0.007, 0.007);
    p_car.position.set(-13, 0.1, -54);
    p_car.rotation.y= 1.57;
});


//Create a closed wavey loop
const curve_mid = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 0.5, -60 ),
    new THREE.Vector3( 15, 0.5, -57 ),
    new THREE.Vector3( 32, 0.5, -40 ),
    new THREE.Vector3( 36, 0.5, 0),
    new THREE.Vector3( 31.5, 0.5, 57),
	new THREE.Vector3( 0, 0.5, 60 ),
    new THREE.Vector3( -15, 0.5, 57 ),
    new THREE.Vector3( -32, 0.5, 40 ),
	new THREE.Vector3( -36, 0.5, 0),
    new THREE.Vector3( -31.5, 0.5, -57),
]);
const curve_y = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 0.5, -60 ),
    new THREE.Vector3( 15, 0.5, -57 ),
    new THREE.Vector3( 32, 0.5, -40 ),
    new THREE.Vector3( 36, 0.5, 0),
    new THREE.Vector3( 31.5, 0.5, 57),
	new THREE.Vector3( 0, 0.5, 60 ),
    new THREE.Vector3( -15, 0.5, 57 ),
    new THREE.Vector3( -32, 0.5, 40 ),
	new THREE.Vector3( -36, 0.5, 0),
    new THREE.Vector3( -31.5, 0.5, -57),
] );
const curve_s = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 0.5, -60 ),
    new THREE.Vector3( 15, 0.5, -57 ),
    new THREE.Vector3( 32, 0.5, -40 ),
    new THREE.Vector3( 36, 0.5, 0),
    new THREE.Vector3( 31.5, 0.5, 57),
	new THREE.Vector3( 0, 0.5, 60 ),
    new THREE.Vector3( -15, 0.5, 57 ),
    new THREE.Vector3( -32, 0.5, 40 ),
	new THREE.Vector3( -36, 0.5, 0),
    new THREE.Vector3( -31.5, 0.5, -57),
] );
const curve_p = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 0.5, -60 ),
    new THREE.Vector3( 15, 0.5, -57 ),
    new THREE.Vector3( 32, 0.5, -40 ),
    new THREE.Vector3( 36, 0.5, 0),
    new THREE.Vector3( 31.5, 0.5, 57),
	new THREE.Vector3( 0, 0.5, 60 ),
    new THREE.Vector3( -15, 0.5, 57 ),
    new THREE.Vector3( -32, 0.5, 40 ),
	new THREE.Vector3( -36, 0.5, 0),
    new THREE.Vector3( -31.5, 0.5, -57),
] );

// get points of curve_mid
const tm = curve_mid.getPoints(1000);
const ty = curve_y.getPoints( 50 );
const ts = curve_s.getPoints( 50 );
const tp = curve_p.getPoints( 50 );


// render fuel cans on the track randomly
var fuelcan = [];
var fuel_pos = [];
for (var i = 0; i < 10; i++) {
    gltfLoader.load('./assets/fuelcan/scene.gltf', function(gltf){
        console.log(gltf);
        const model = gltf.scene;
        scene.add(model);
        model.scale.set(0.5, 0.5, 0.5);
        var index = Math.floor(Math.random()*tm.length);
        model.position.set(tm[index].x, 0.5, tm[index].z);
        fuelcan.push(model);
        fuel_pos.push(new THREE.Vector3(tm[index].x, 0.5, tm[index].z))
    });  
}

gltfLoader.load('./assets/t2/scene.gltf', function(gltf){
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    track_1 = model;
    track_1.scale.set(1.5, 1, 1.5);
    track_1.rotation.y = 3.14;
    track_1.position.set(0, 0.1, -35);
    
});
gltfLoader.load('./assets/t2/scene.gltf', function(gltf){
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    track_2 = model;
    track_2.scale.set(1.5, 1, 1.5);
    track_2.position.set(0, 0.1, 35);
    
});



for (let i = 0; i < curve_y.points.length; i++) {
    curve_y.points[i].x+=Math.random()*12-6;
    curve_y.points[i].z+=Math.random()*12-6;
}
for (let i = 0; i < curve_s.points.length; i++) {
    curve_s.points[i].x+=Math.random()*12-6;
    curve_s.points[i].z+=Math.random()*12-6;
}
for (let i = 0; i < curve_p.points.length; i++) {
    curve_p.points[i].x+=Math.random()*12-6;
    curve_p.points[i].z+=Math.random()*12-6;
}
curve_y.closed = true;
const points_y = curve_y.getPoints( 100 );
const curve_y_geometry = new THREE.BufferGeometry().setFromPoints( points_y );
const curve_y_material = new THREE.LineBasicMaterial( { color: 0xffff00 } );

// Create the final object to add to the scene
const curve_yObject = new THREE.Line( curve_y_geometry, curve_y_material );
curve_yObject.position.y = 1.0;
// scene.add( curve_yObject );

curve_s.closed = true;
const points_s = curve_s.getPoints( 100 );
const curve_s_geometry = new THREE.BufferGeometry().setFromPoints( points_s );
const curve_s_material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curve_sObject = new THREE.Line( curve_s_geometry, curve_s_material );
curve_sObject.position.y = 1.0;
//scene.add( curve_sObject );

curve_p.closed = true;
const points_p = curve_p.getPoints( 100 );
const curve_p_geometry = new THREE.BufferGeometry().setFromPoints( points_p );
const curve_p_material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );

// Create the final object to add to the scene
const curve_pObject = new THREE.Line( curve_p_geometry, curve_p_material );
curve_pObject.position.y = 1.0;
//scene.add( curve_pObject );

curve_mid.closed = true;
const points_mid = curve_mid.getPoints( 100 );
const curve_mid_geometry = new THREE.BufferGeometry().setFromPoints( points_mid );
const curve_mid_material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );

// Create the final object to add to the scene
const curve_midObject = new THREE.Line( curve_mid_geometry, curve_mid_material );
curve_midObject.position.y = 1.0;
//scene.add( curve_midObject );

//draw a circle
const textureLoader = new THREE.TextureLoader();
const texture=  textureLoader.load( './assets/images/grass.jpg' )
const geometry = new THREE.BoxGeometry( 180,1,180 );
const material = new THREE.MeshPhongMaterial( {map: texture, side: THREE.DoubleSide});
const circle = new THREE.Mesh( geometry, material );
circle.translateY(-0.5);
scene.add( circle );

const cover_geometry = new THREE.PlaneGeometry( 3, 13.7);
const cover_material = new THREE.MeshBasicMaterial( {color: 0x080707, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( cover_geometry, cover_material );
plane.position.set(11,0.17,59.9);
plane.rotation.x = 1.57;
scene.add( plane );

const a_textureLoader = new THREE.TextureLoader();
const a_texture=  a_textureLoader.load( './assets/images/crowd.jpg' )
const a_geometry = new THREE.BoxGeometry( 180,1,180 );
const a_material = new THREE.MeshPhongMaterial( {map: a_texture, side: THREE.DoubleSide});
const a_circle = new THREE.Mesh( a_geometry, a_material );
a_circle.translateY(60);
a_circle.translateX(108);
a_circle.rotation.z=1.3;
scene.add(a_circle );

const b_textureLoader = new THREE.TextureLoader();
const b_texture=  b_textureLoader.load( './assets/images/crowd.jpg' )
const b_geometry = new THREE.BoxGeometry( 180,1,280);
const b_material = new THREE.MeshPhongMaterial( {map: b_texture, side: THREE.DoubleSide});
const b_circle = new THREE.Mesh( b_geometry, b_material );
b_circle.translateY(60);
b_circle.translateZ(90);
b_circle.rotation.z=1.57;
b_circle.rotation.y=1.57;
scene.add(b_circle );

const c_textureLoader = new THREE.TextureLoader();
const c_texture=  c_textureLoader.load( './assets/images/crowd.jpg' )
const c_geometry = new THREE.BoxGeometry( 180,1,180 );
const c_material = new THREE.MeshPhongMaterial( {map: c_texture, side: THREE.DoubleSide});
const c_circle = new THREE.Mesh( c_geometry, c_material );
c_circle.translateY(60);
c_circle.translateX(-108);
c_circle.rotation.z=1.84;
scene.add(c_circle );

const d_textureLoader = new THREE.TextureLoader();
const d_texture=  d_textureLoader.load( './assets/images/crowd.jpg' )
const d_geometry = new THREE.BoxGeometry( 180,1,280 );
const d_material = new THREE.MeshPhongMaterial( {map: d_texture, side: THREE.DoubleSide});
const d_circle = new THREE.Mesh( d_geometry, d_material );
d_circle.translateY(60);
d_circle.translateZ(-90);
d_circle.rotation.z=1.57;
d_circle.rotation.y=1.57;
scene.add(d_circle );


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
let fraction_y = 0;
let fraction_s = 0;
let fraction_p = 0;
function animate(){
    var y_speed =12;
    var s_speed= 15;
    var p_speed= 17;
    // add style to canvas map if canvas exists 
    if(document.getElementById("map") != null){
        document.getElementById("map").style.border = "10px solid  rgba(4,217,255,0.7)";
    }
    //move y_car along curve_yObject starting at initital position
    if(y_car != undefined){
        const t = fraction_y
        const y_pos = curve_y.getPointAt(t);
        const tangent = curve_y.getTangentAt(t);
        const y_angle = Math.atan2(tangent.x, tangent.z);
        y_car.position.set(y_pos.x, y_pos.y,y_pos.z)
        y_car.rotation.y = (y_angle);
        fraction_y += 0.0001 * Math.random()*y_speed;
        if(fraction_y > 1){
            fraction_y = 0;
            laps[0] +=1;
            if(laps[0] == 3){
                // add y_car to ranklist
                ranklist.push(1);
                // remove y_car from scene
                scene.remove(y_car);
                y_car = undefined;
            }
        }
    }
    // move s_car along curve_sObject
    if(s_car != undefined){
        const t = fraction_s
        const s_pos = curve_s.getPointAt(t);
        const tangent = curve_s.getTangentAt(t);
        const s_angle = Math.atan2(tangent.x, tangent.z);
        s_car.position.set(s_pos.x, s_pos.y,s_pos.z)
        s_car.rotation.y = (s_angle + 3.14);
        fraction_s += 0.0001 * Math.random()*s_speed;
        if(fraction_s > 1){
            fraction_s = 0;
            laps[1] += 1;
            if(laps[1] == 3){
                // add s_car to ranklist
                ranklist.push(2);
                // remove s_car from scene
                scene.remove(s_car);
                s_car = undefined;
            }
        }

    }
    // move p_car along curve_pObject
    if(p_car != undefined){
        const t = fraction_p
        const p_pos = curve_p.getPointAt(t);
        const tangent = curve_p.getTangentAt(t);
        const p_angle = Math.atan2(tangent.x, tangent.z);
        p_car.position.set(p_pos.x, p_pos.y,p_pos.z)
        p_car.rotation.y = (p_angle);
        fraction_p += 0.0001 * Math.random()*p_speed;
        if(fraction_p > 1){
            fraction_p = 0;
            laps[2] += 1;
            if(laps[2] == 3){
                // add p_car to ranklist
                ranklist.push(3);
                // remove p_car from scene
                scene.remove(p_car);
                p_car = undefined;
            }
        }
    }

    
    var dt = clock.getDelta();
    var dir = new THREE.Vector3(1,0,0);
    dir.multiplyScalar (dt*speed);	//dir *= dt*speed;
    dir.applyAxisAngle (new THREE.Vector3(0,1,0), angle);
    pos.add (dir); 	//pos = pos + dir;
     
    if(my_car != undefined){
        fuel-=Math.floor(dt*speed*50);
        camera2.position.set(0, 50, -0.00001);
        camera2.position.x +=dir.x;
        camera2.position.z +=dir.z;
        camera2.lookAt(my_car.position);
        var min_dist = 100000;
        var min_index = 0;
        for(var i = 0; i<tm.length ; ++i){
            var dist = tm[i].distanceTo(my_car.position);
            if(dist < min_dist){
                min_dist = dist;
                min_index = i;
            }
        }
        if(my_car.position.x<0 && my_car.position.x >-26 && my_car.position.z <0){
            if(min_dist>17){
                speed = 1;
            }
        }
        else{
            if(min_dist>7){
                speed = 1;
            }
        }
        tot_dist += my_car.position.distanceTo(pos);
        my_laps = Math.floor(tot_dist/curve_mid.getLength());
        if(my_laps == 3){
            // if 0 not in ranklist add 0
            if(!ranklist.includes(0)){
                ranklist.push(0);
                my_car = undefined;
            }
        }
        
        // console.log(min_dist);
        // console.log(my_car.position.x, my_car.position.z);

    }
    if(my_car != undefined && view_mode ==1){ // third person / default
        my_car.position.set(pos.x, pos.y,pos.z)
        my_car.rotation.y = (angle + 1.57);
        var relativeCameraOffset = new THREE.Vector3 (0,2,-5);

        var cameraOffset = relativeCameraOffset.applyMatrix4(my_car.matrixWorld );
        // use lerp to smooth out the camera movement
        camera.position.x = cameraOffset.x + dir.x;
        camera.position.y = cameraOffset.y;
        camera.position.z = cameraOffset.z + dir.z;
        camera.lookAt(my_car.position);
        

    }
    else if(my_car != undefined && view_mode ==-1){ // birds view
        camera.position.set(0, 200, -0.00001);
        my_car.position.set(pos.x, pos.y,pos.z)
        my_car.rotation.y = (angle+ 1.57);
        camera.position.x +=dir.x;
        camera.position.z +=dir.z;
        camera.lookAt(my_car.position);
    }
    else if(my_car != undefined && view_mode ==0){ // first person
        camera.position.set(0, 2, -3);
        my_car.position.set(pos.x, pos.y,pos.z)
        my_car.rotation.y = (angle+1.57);
        var relativeCameraOffset = new THREE.Vector3 (0,2,-1);
        var cameraOffset = relativeCameraOffset.applyMatrix4(my_car.matrixWorld );

        camera.position.x = cameraOffset.x + dir.x;
        camera.position.y = cameraOffset.y - 0.28;
        camera.position.z = cameraOffset.z + dir.z;
        camera.rotation.y = -(angle);
        var front = new THREE.Vector3(0,0,0);
        front.add(my_car.position);
        front.x +=2* Math.cos(-angle);
        front.z +=2*Math.sin(-angle);
        camera.lookAt(front);
    }
    // collisions
    
    if(my_car !=undefined && y_car != undefined){
        if (my_car.position.x < y_car.position.x +1 && my_car.position.x > y_car.position.x -1  && my_car.position.z < y_car.position.z +1 && my_car.position.z > y_car.position.z -1){
            console.log("car hit!!");
            speed = 0;
            y_speed = 2;
            health -= 1;
            score -= 1000;
        }
    }
    if(my_car !=undefined && s_car != undefined){
        if (my_car.position.x < s_car.position.x +1 && my_car.position.x > s_car.position.x -1  && my_car.position.z < s_car.position.z +1 && my_car.position.z > s_car.position.z -1){
            console.log("car hit!!");
            speed = 0;
            s_speed = 2;
            health -= 1;
            score -= 1000;
        }
    }
    if(my_car !=undefined && p_car != undefined){
        if (my_car.position.x < p_car.position.x +1 && my_car.position.x > p_car.position.x -1  && my_car.position.z < p_car.position.z +1 && my_car.position.z > p_car.position.z -1){
            console.log("car hit!!");
            speed = 0;
            p_speed = 2;
            health -= 1;
            score -= 1000;
        }
    }
    for(var i = 0; i < fuelcan.length; i++){
        if(my_car !=undefined && fuelcan[i] != undefined){
            if (my_car.position.x < fuelcan[i].position.x +0.7 && my_car.position.x > fuelcan[i].position.x -0.7  && my_car.position.z < fuelcan[i].position.z +0.7 && my_car.position.z > fuelcan[i].position.z -0.7){
                console.log("yay fuel!!");
                fuel +=2000;
                score+= 100;
                scene.remove(fuelcan[i]);
                var index = Math.floor(Math.random()*tm.length);
                fuelcan[i].position.set(tm[index].x, 0.5, tm[index].z);
                fuel_pos[i] = (new THREE.Vector3(tm[index].x, 0.5, tm[index].z))
                scene.add(fuelcan[i])
            }
        }
    }
    if(my_car !=undefined){
        document.getElementById("laps").innerHTML = "Laps: " + my_laps + "/3";
        document.getElementById("health").innerHTML = "Health: " + health;
        document.getElementById("fuel").innerHTML = "Fuel: " + fuel;
        document.getElementById("score").innerHTML = "Score: " + score;
        var time = clock.elapsedTime;
        var hours = Math.floor(time / 3600);
        time -= hours * 3600;
        var minutes = Math.floor(time / 60);
        time -= minutes * 60;
        var seconds = Math.floor(time);
        time -= seconds;
        var milliseconds = Math.floor(time * 1000);
        document.getElementById("time").innerHTML = "Time: " + minutes + ":" + seconds + ":" + milliseconds;
        score += 1*Math.floor(speed); // mileage per litre value
        var nextfc = 1000;
        for(var i=0;i<fuel_pos.length;++i){
            if(my_car.position.distanceTo(fuel_pos[i])<nextfc){
                nextfc = Math.floor(my_car.position.distanceTo(fuel_pos[i]));
            }
        }
        document.getElementById("nextfc").innerHTML = "Next Fuel Can: " + nextfc;
    }
    
    requestAnimationFrame( animate );
    renderer2.render( scene, camera2 );
    renderer.render( scene, camera );
    

    if(fuel <=0 || health <=0){
        speed = 0;
        scene.remove(my_car);
        scene.remove(y_car);
        scene.remove(s_car);
        scene.remove(p_car);
        for(var i = 0; i < fuelcan.length; i++){
            scene.remove(fuelcan[i]);
        }
        document.getElementById("laps").innerHTML = "Laps: " + my_laps + "/3";
        if(fuel <= 0){
            document.getElementById("gameover").innerHTML = "<pre> Game Over\nNo fuel :(\nPress R to restart </pre>";
        }
        else{
            document.getElementById("gameover").innerHTML = "<pre> Game Over\nNo health :(\nPress R to restart </pre>";
        }
        document.getElementById("health").innerHTML = "Health: " + health;
        document.getElementById("fuel").innerHTML = "Fuel: 0";
        document.getElementById("score").innerHTML = "Score: " + score;
        document.getElementById("time").innerHTML = "";
        document.getElementById("nextfc").innerHTML = "";
        if(document.getElementById("map") != null){
            var canvas = document.getElementById("map");
            canvas.parentNode.removeChild(canvas);
        }
    }
    if(ranklist.includes(0)){
        speed = 0;
        scene.remove(my_car);
        scene.remove(y_car);
        scene.remove(s_car);
        scene.remove(p_car);
        for(var i = 0; i < fuelcan.length; i++){
            scene.remove(fuelcan[i]);
        }
        // index of 0 in ranklist
        var place = ranklist.indexOf(0);
        document.getElementById("laps").innerHTML = "Laps: " + my_laps + "/3";
        //document.getElementById("gameover").innerHTML = "<pre> Game Over\nYou Won!\nPress R to restart\n" + " Your Rank: " + (ranklist.indexOf(0)+1) + "/4</pre>";
        document.getElementById("gameover").innerHTML = "<pre> Game Over\nYou Won!\nPress R to restart</pre>";
        while(ranklist.length < 4){
            for(var i =1; i<4; ++i){
                if(!ranklist.includes(i)){
                    ranklist.push(i)
                }
            }
        }
        document.getElementById("leaderboard").innerHTML = "<pre> Leaderboard\n1. " + car_names[ranklist[0]] + "\n2. " + car_names[ranklist[1]] + "\n3. " + car_names[ranklist[2]] + "\n4. " + car_names[ranklist[3]] + "</pre>";
        document.getElementById("health").innerHTML = "Health: " + health;
        document.getElementById("fuel").innerHTML = "Fuel: " + fuel;
        document.getElementById("score").innerHTML = "Score: " + score;
        document.getElementById("time").innerHTML = "";
        document.getElementById("nextfc").innerHTML = "";
        if(document.getElementById("map") != null){
            var canvas = document.getElementById("map");
            canvas.parentNode.removeChild(canvas);
        } 

    }
    
    
}

if(start){
    animate();
}

var keyMap=[];
document.addEventListener("keydown", onDocumentKeyDown, true); 
document.addEventListener("keyup", onDocumentKeyUp, true);
function onDocumentKeyDown(event){ 
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
    executeMovement();
}
function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
    executeMovement();
}

function myclamp(x,lo,hi)
{
	if (x < lo) return lo;
	if (x > hi) return hi;
	return x;
}

function executeMovement(){
    var dt = clock.getDelta();
    if (keyMap[38]==true) {
        speed+=0.1; 
    } 
    else if (keyMap[40]==true) {
        speed-=0.1;
    } 
    else if (keyMap[37]==true) {
        angle += 3*dt;
    } 
    else if (keyMap[39]==true) {
        angle -= 3*dt;
    } 
    else if(keyMap[66] == true){
        if(view_mode==1 || view_mode == 0){
            view_mode = -1;
        }
        else{
            view_mode = 1;
        }
    }
    else if(keyMap[84] == true){
        if(view_mode==1 || view_mode == -1){
            view_mode = 0;
        }
        else{
            view_mode = 1;
        }
    }
    else if(keyMap[82] == true){
        location.reload();
    }
    // if s pressed start game
    else if(keyMap[83] == true){
        if(start == false){
            start = true;
            document.getElementById("start").innerHTML = "";
            animate();
        }
    }
    speed=myclamp(speed, 0.0,20.0);
};




