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
  pixelDensity(window.devicePixelRatio || 2);

  // random color(combo1&combo2) every time
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

  let canvasWidth = windowWidth * 0.9;
  let canvasHeight = windowHeight * 0.9;

  createCanvas(canvasWidth, canvasHeight, WEBGL);

  aspectRatio = canvasWidth / canvasHeight;

  // 2x resolution for FBO
  smallFBO = createFramebuffer({
    width: canvasWidth * 2,
    height: canvasHeight * 2,
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
  // uniformsShader.setUniform("lensType", lensType);
  
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
  let w = windowWidth;
  let h = windowHeight;
  resizeCanvas(w, h);
  aspectRatio = w / h;

  if (smallFBO) smallFBO.remove();
  smallFBO = createFramebuffer({
    width: w * 2,
    height: h * 2,
    format: UNSIGNED_BYTE,
    density: 1,
  });
}



//------------------------------------
// download pic (high res)

function keyPressed() {
  if (key === 's' || key === 'S') {

    let exportSize_w = 1920*2;
    let exportSize_h = 1080*2;

    let exportFBO = createFramebuffer({
      width: exportSize_w,
      height: exportSize_h,
      format: UNSIGNED_BYTE,
      density: 1,
    });

    exportFBO.begin();
    clear();
    shader(uniformsShader);
    uniformsShader.setUniform("time", millis() / 1000);
    uniformsShader.setUniform("width", float(exportSize_w));
    uniformsShader.setUniform("height", float(exportSize_h));
    uniformsShader.setUniform("rand", randonclrpos);
    uniformsShader.setUniform("gauss", randomGauss);
    uniformsShader.setUniform("lensType", lensType);
    
    push();
    scale(1, -1);
    rect(-exportSize_w / 2, -exportSize_h / 2, exportSize_w, exportSize_h);
    pop();
    exportFBO.end();

    let img = exportFBO.get();
    img.save('output_highres', 'png');

    exportFBO.remove();
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