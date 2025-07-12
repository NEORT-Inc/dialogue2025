// template is from https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages

let uniformsShader;
let smallFBO, largeFBO;
let aspectRatio;
let randonclrpos = [];
let randomGauss = [];
let lensType;

function preload() {
  uniformsShader = loadShader("uniform.vert", "uniform.frag");
}

function setup() {
  pixelDensity(1);

  // random color(combo1&combo2) every time
  //33% r 33% g 33% b
  for (let i = 0; i < 6; i++) {
    randonclrpos.push(Math.floor(Math.random() * 3));
  }
  // random combinedGauss
  for (let i = 0; i < 5; i++) {
    let sign = Math.random() > 0.5 ? 1 : -1;
    let strength = 0.1 + Math.random() * 0.9;
    randomGauss.push(sign * strength);
  }
  resultString = randonclrpos.map(x => ['r','g','b'][x]).join('');
  console.log(randonclrpos);

  // square canvas (90vh)
  let canvasSize = min(windowWidth * 0.9, windowHeight * 0.9);
  canvasSize = max(400, min(canvasSize, 800)); // min 400px，max 800px
  
  createCanvas(canvasSize, canvasSize, WEBGL);

  aspectRatio = 1.0;

  let highRes = canvasSize * 2; // 2x resolution
  
  smallFBO = createFramebuffer({
    width: highRes,
    height: highRes,
    format: UNSIGNED_BYTE,
    density: 1,
  });

  noStroke();

  lensType = Math.floor(random(0, 4));
}

function draw() {

  renderToFBO(smallFBO);

  background(0);
  imageMode(CENTER);

  image(smallFBO, 0, 0, width, height);

  if (frameCount > 10000) {
    window.location.reload();
  }
}

function renderToFBO(fbo) {
  fbo.begin();

  // Clear the FBO
  clear();

  // shader() sets the active shader with our shader
  shader(uniformsShader);

  // Send uniforms to shader
  uniformsShader.setUniform("time", millis() / 1000);
  uniformsShader.setUniform("width", fbo.width);
  uniformsShader.setUniform("height", fbo.height);
  uniformsShader.setUniform("rand", randonclrpos);
  uniformsShader.setUniform("gauss", randomGauss);
  uniformsShader.setUniform("lensType", lensType);
  
  // Draw a rect that covers the full FBO size
  push();
  noStroke();
  // Flip Y-axis to match shader coordinate system
  scale(1, -1);
  rect(-fbo.width / 2, -fbo.height / 2, fbo.width, fbo.height);
  pop();

  fbo.end();
}

function windowResized() {
  // recalculate canvas size
  let canvasSize = min(windowWidth * 0.9, windowHeight * 0.9);
  canvasSize = max(400, min(canvasSize, 800));
  
  resizeCanvas(canvasSize, canvasSize);
  
  let highRes = canvasSize * 2;
  
  smallFBO = createFramebuffer({
    width: highRes,
    height: highRes,
    format: UNSIGNED_BYTE,
    density: 1,
  });
}



//------------------------------------
// download pic (high res)

function keyPressed() {
  if (key === 's' || key === 'S') {
    let currentWidth = width;
    let currentHeight = height;
    
    resizeCanvas(4000, 4000);
    
    // re render
    renderToFBO(smallFBO);
    background(0);
    image(smallFBO, 0, 0, 4000, 4000);
    
    // save
    saveCanvas('output', 'png');
    
    // ori size
    resizeCanvas(currentWidth, currentHeight);
    
    console.log("高解析度圖片已儲存！");
  }
}

// monitor fps

// function displayFPS() {
//   fill(255);
//   textAlign(LEFT);
//   text('FPS: ' + Math.round(frameRate()), 10, 20);
//   text('Canvas: ' + width + 'x' + height, 10, 40);
//   text('FBO: ' + smallFBO.width + 'x' + smallFBO.height, 10, 60);
// }