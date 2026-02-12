#version 300 es
// #extension GL_OES_standard_derivatives : enable
precision highp float;

// basic setting
in vec2 vTexCoord;
uniform float time;
uniform float width;
uniform float height;
uniform sampler2D colorTex;
uniform int rand[6];
uniform float gauss[5];
// uniform int lensType;

out vec4 outputColor;

// gaussian fun
const float PI = 3.1415926535897932384626433832795;
float gaussian(float x, float sigma) {
    return exp(-(x * x) / (2.0 * sigma * sigma));
}


// random color(combo1&combo2) every time
float getclrpos(vec3 color, int idx) {
    if (idx == 0) return color.r;
    if (idx == 1) return color.g;
    return color.b;
}


// 2D gaussian fun
float gaussian2D(vec2 pos, float sigma) {
    float dist = length(pos);
    return exp(-(dist * dist) / (2.0 * sigma * sigma));
}

float random(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
}

// color correction function
vec3 ContrastSaturationBrightness(vec3 color, float brt, float sat, float con) {
    const float AvgLumR = 0.5;
    const float AvgLumG = 0.5;
    const float AvgLumB = 0.5;

    const vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);
    
    vec3 AvgLumin  = vec3(AvgLumR, AvgLumG, AvgLumB);
    vec3 brtColor  = clamp(color,vec3(0),vec3(1)) * brt*1.01;
    vec3 intensity = vec3(dot(brtColor, LumCoeff));
    vec3 satColor  = mix(intensity, brtColor, sat);
    vec3 conColor  = mix(AvgLumin, satColor, con);

    return conColor;
}

float vignette(vec2 uv) {
    float s0 = smoothstep(0.04, 0.0, uv.x);
    float s1 = smoothstep(0.04, 0.0, uv.y);
    float s2 = smoothstep(0.98, 1.0, uv.x);
    float s3 = smoothstep(0.98, 1.0, uv.y);
    return mix(1.0, 0.7, max(max(s0, s1), max(s2, s3)));
}

float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
}

float valueNoise(vec2 pos) {
    vec2 i = floor(pos);
    vec2 f = fract(pos);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 pos) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
        sum += amp * valueNoise(pos);
        pos *= 2.0;
        amp *= 0.5;
    }
    return sum;
}

// excerpted from https://iquilezles.org/articles/distfunctions2d/
float sdCircleWave(vec2 p, float tb, float ra) {
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}

// vec4 color_fun(in vec2 uv, float t){
//     float strength = 0.0;
//     vec3 col = vec3(.0);
//     vec2 pos = uv*2.0-1.0;
    
//     // add multi center...
//     vec2 center1 = vec2(sin(t * 0.1 + sin(t) * 0.1) * 0.5, sin(t * 0.15 - sin(t * 1.0) * 0.5) * 0.5); // modulate animation a bit...
//     vec2 center2 = vec2(cos(t * 0.08) * 0.3, -sin(t * 0.12) * 0.3);
//     vec2 center3 = vec2(-sin(t * 0.13) * 0.6, cos(t * 0.9) * 0.4);
    
//     // center-dist
//     float dist1 = distance(pos, center1);
//     float dist2 = distance(pos, center2)+exp(-(dist1 * dist1) / 0.1);
//     float dist3 = distance(pos, center3)+exp((dist2 * dist2) / 0.1);

//     float gauss1 = exp(-(dist1 * dist1) / 0.3);
//     float gauss2 = exp(-(dist2 * dist2) / 0.6);
//     float gauss3 = exp(-(dist3 * dist3) / 1.0);
    
//     float combinedGauss = gauss[0] + gauss[1] * 0.7 + gauss[2] * 0.5 ;
    
//     float secondaryGauss = gauss3 * gauss[3] * 0.6; 
//     float bonusInfluence = gauss[4] * gauss[2] * 0.3;
    
//     float totalGaussInfluence = combinedGauss + secondaryGauss * 0.8 + bonusInfluence * 0.4;
//     // slow down the time
//     float slowTime = t * 0.08 * (1.0 + combinedGauss * 0.5);

//     // Simple Caustics Calculation
//     vec3 focus = vec3(4.0, 6.0, 8.0);
//     vec3 timeFreq = vec3(3.0, 4.5, 6.0);
//     vec3 distFreq = vec3(dist1, dist2, dist3);
    
//     vec3 baseCaustics = 1.0 / (0.1 + distFreq * distFreq * focus);
//     vec3 flickers = 0.5 + 0.5 * sin(slowTime * timeFreq + distFreq * distFreq);
    
//     vec3 causticsVec = baseCaustics * flickers;
//     float caustic1 = causticsVec.x;
//     float caustic2 = causticsVec.y;
//     float caustic3 = causticsVec.z;
    
//     // ripple system
//     vec2 waveDir1 = vec2(cos(slowTime * 0.01), sin(slowTime * 0.01));
//     vec2 waveDir2 = vec2(cos(slowTime * 0.15 + 1.5), sin(slowTime * 0.15 + 1.5));
//     vec2 waveDir3 = vec2(cos(slowTime * 0.08 + 3.0), sin(slowTime * 0.08 + 3.0));
    
//     float wave1 = sin(dot(pos, waveDir1) * 12.0 - slowTime * 3.0) * 0.06;
//     float wave2 = sin(dot(pos, waveDir2) * 8.0 - slowTime * 2.2) * 0.12;
//     float wave3 = sin(dot(pos, waveDir3) * 15.0 - slowTime * 4.1) * 0.08;
    
//     float totalWaveHeight = wave1 - wave2 + wave3;
    
//     // lens reflection effect
//     float lensStrength = 0.5;
//     // vec2 lensOffset1 = normalize(pos + center1) * lensStrength / (1.0 + dist1 * 1.0);
//     // vec2 lensOffset2 = normalize(pos + center2) * lensStrength / (1.0 + dist2 * 2.0);
//     // vec2 lensOffset3 = normalize(pos + center3) * lensStrength / (1.0 + dist3 * 3.0);
//     vec2 lensOffset1 = normalize(pos + center1) * lensStrength / (1.0 + max(dist1, 2.0)); 
//     vec2 lensOffset2 = normalize(pos + center2) * lensStrength / (1.0 + sqrt(dist1)); 
//     vec2 lensOffset3= normalize(pos + center3) * lensStrength / (1.5 );
    
//     // apply lens offset
//     pos += lensOffset1 + lensOffset2 * sin(time)*0.01 + lensOffset3 * 0.5;

//     // radial ripples
//     vec3 radialWaves = sin(distFreq * vec3(9.0, 10.0, 12.0) - slowTime * vec3(1.0, 1.8, 2.5)) 
//                       * exp(-distFreq * vec3(1.5, 2.0, 1.2));
//     float radialWaveHeight = dot(radialWaves, vec3(0.5, 0.12, 0.18));
    
//     // combination of ripples
//     float combinedWaveHeight = totalWaveHeight + radialWaveHeight * 0.5;
    
//     // deformation+loop
//     for(int i = 1; i < 4; i++){ 
//         float noise = random(pos);
        
//         // basic deformation
//         pos.x += strength * sin(2.0*slowTime + float(i)*100.0 * pos.y * noise) + slowTime * 0.00001;
//         pos.y += strength * cos(float(i)*50.0 * pos.x) + slowTime * 0.00002;
        
//         // wave-influenced distortion! 🌊
//         float waveInfluence = combinedWaveHeight * 5.0;
//         float chaos_x = sin(pos.y*6.0 + slowTime*1.1 + waveInfluence) * cos(pos.x*3.0 + slowTime*1.7);
//         float chaos_y = cos(pos.x*1.0 + slowTime*10. + waveInfluence) * sin(pos.y*1.3 + slowTime*0.3);
        
//         // combine distortion..
//         vec2 globalDeform = vec2(chaos_x, chaos_y) * 0.3;
//         vec2 centerDeform = vec2(chaos_x, chaos_y) * 0.25 * combinedGauss;
        
//         pos += globalDeform + centerDeform;
//     }
//     float phase = slowTime;
//     float eps = 0.003;
//     float h = combinedWaveHeight;
//     float hx = (
//         sin(dot(pos + vec2(eps, 0.0), waveDir1) * 12.0 - slowTime * 3.0) * 0.06 +
//         sin(dot(pos + vec2(eps, 0.0), waveDir2) * 8.0 - slowTime * 2.2) * 0.12 +
//         sin(dot(pos + vec2(eps, 0.0), waveDir3) * 15.0 - slowTime * 4.1) * 0.08
//     );
//     float hy = (
//         sin(dot(pos + vec2(0.0, eps), waveDir1) * 12.0 - slowTime * 3.0) * 0.06 +
//         sin(dot(pos + vec2(0.0, eps), waveDir2) * 8.0 - slowTime * 2.2) * 0.12 +
//         sin(dot(pos + vec2(0.0, eps), waveDir3) * 15.0 - slowTime * 4.1) * 0.08
//     );
//     vec2 normal2d = normalize(vec2(hx - h, hy - h)) + vec2(noise(pos)) * 0.3;

//     // Focus strength (the greater the normal change the stronger the bright spot)
//     float focusStrength = 1.0 / (0.02 + length(normal2d) * 20.0);
//     focusStrength = pow(focusStrength, 1.5); // bright spots are more concentrated

//     // dispersion
//     vec3 dispersion = vec3(
//         0.8 + 0.2*sin(pos.x*10.0 + t),
//         0.8 + 0.2*sin(pos.y*12.0 + t + 2.0),
//         0.8 + 0.2*sin((pos.x+pos.y)*8.0 + t + 4.0)
//     );
//     // stronger color
//     vec3 color1 = vec3(
//         0.5 + 0.6*sin(phase + pos.x*2.0 + 0.0),
//         0.5 + 0.6*sin(phase + pos.y*2.0 + 2.1),
//         0.5 + 0.6*sin(phase + pos.x*pos.y + 4.2)
//     );
    
//     vec3 color2 = vec3(
//         0.5 + 0.6*sin(phase + pos.y*1.5 + 1.0),
//         0.5 + 0.6*sin(phase + pos.x*1.5 + 3.1),
//         0.5 + 0.6*sin(phase + pos.x*pos.y*0.5 + 5.2)
//     );
    
//     vec3 color3 = vec3(
//         0.5 + 0.6*sin(phase + pos.x*3.0 + 2.0),
//         0.5 + 0.6*sin(phase + pos.y*3.0 + 4.1),
//         0.5 + 0.6*sin(phase + (pos.x+pos.y)*2.0 + 0.2)
//     );
    
//     float weight1 = gauss1 * 0.2;
//     float weight2 = gauss2 * 0.9;
//     float weight3 = gauss3 * 0.9;
    
//     float totalWeight = max(weight1 + weight2 + weight3 , 0.1);
    
//     col = (color1 * weight1 + color2 * weight2 + color3 * weight3) / totalWeight;
    
//     col = pow(col, vec3(0.5));
    
//     // Caustics enhancement
//     float totalCaustics = (caustic1 + caustic2 + caustic3) * 0.1;
//     col += focusStrength * dispersion;
    
//     return vec4(col, 1.0); // 10.0 is meaningless lol
// }

// vec4 color_fun(in vec2 uv, float t){
//     float strength = 0.02;
//     vec3 col = vec3(0.0);
//     float aspect = width / height;
//     vec2 pos;
//     if (width > height) {
//         pos = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
//     } else {
//         pos = (uv * 2.0 - 1.0) * vec2(1.0, 1.0 / aspect);
//     }
    
//     // gaussian center point
//     vec2 center1 = vec2(sin(t * 0.1) * 0.5, cos(t * 0.15) * 0.5);
//     vec2 center2 = vec2(cos(t * 0.08) * 0.3, sin(t * 0.12) * 0.3);
//     vec2 center3 = vec2(sin(t * 0.13) * 0.4, cos(t * 0.09) * 0.6);
//     vec2 center4 = vec2(cos(t * 0.11) * 0.7, sin(t * 0.14) * 0.2);
//     vec2 center5 = vec2(sin(t * 0.07) * 0.6, cos(t * 0.16) * 0.4);
    
//     // center-dist
//     float gauss1 = gaussian2D(pos - center1, 0.4);
//     float gauss2 = gaussian2D(pos - center2, 0.6);
//     float gauss3 = gaussian2D(pos - center3, 0.3);
//     float gauss4 = gaussian2D(pos - center4, 0.8);
//     float gauss5 = gaussian2D(pos - center5, 0.5);
    
//     float combinedGauss = gauss1 * gauss[0] + gauss2 * gauss[1] + gauss[2];  // 原有
//     float secondaryGauss = gauss3 * gauss[3]*0.6+ gauss4 * gauss[4]*0.6; 
//     float bonusInfluence = gauss5 * gauss[2];
    
//     float totalGaussInfluence = combinedGauss + secondaryGauss * 0.6 + bonusInfluence * 0.4;
    
//     float slowTime = t * 0.1 * (1.0 + totalGaussInfluence * 0.5);
    
//     for(int i = 1; i < 10; i++){ 
//         float noise = fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
        
//         pos.x += strength * sin(2.0*slowTime+float(i)*10.0 * pos.y*noise) + slowTime * 0.00001;
//         pos.y += strength * cos(float(i)*50.0 * pos.x);
        
//         float chaos_x = sin(pos.y*6.0 + slowTime*1.1) * cos(pos.x*3.0 + slowTime*1.7);
//         float chaos_y = cos(pos.x*1.0 + slowTime*10.) * sin(pos.y*1.3 + slowTime*0.3);
//         pos += vec2(chaos_x, chaos_y) * .5 * totalGaussInfluence;  // 使用 totalGaussInfluence
//     }
    
//     col += 0.5 + 0.5*sin(slowTime+pos.xyx+pos.yyy+pos.xxx+vec3(0.675,0.239,2.000));
//     col = pow(col, vec3(0.5));
//     return vec4(col,1.0);
// }

vec4 color_fun(in vec2 uv, float t) {
    float aspect = width/height;
    vec2 pos = (width > height) ? (uv * 2.0 - 1.0) * vec2(aspect, 1.0) : (uv * 2.0 - 1.0) * vec2(1.0, 1.0 / aspect);
    
    vec2 center1 = vec2(sin(t * 0.01) * 0.5, cos(t * 0.15) * 0.5)* gauss[0];
    vec2 center2 = vec2(cos(t * 0.08) * 0.3, sin(t * 0.12) * 0.3)* gauss[2];
    float gauss1 = gaussian2D(pos - center1, 0.5);
    float gauss2 = gaussian2D(pos - center2, 0.7);
    float influence = (gauss1 * gauss[0] + gauss2 * gauss[1] + gauss[2]) * 0.5;
    
    float slowTime = t * 0.05;
    vec2 q = vec2(fbm(pos + vec2(0.0, 0.0) + slowTime * 0.2),
                  fbm(pos + vec2(5.2, 1.3) + slowTime * 0.15));
    
    vec2 r = vec2(fbm(pos + 4.0 * q + vec2(1.7, 9.2) + slowTime * 0.1),
                  fbm(pos + 4.0 * q + vec2(8.3, 2.8) + slowTime * 0.12));

    vec2 warpedPos = pos + 0.5 * r;

    float strength = 0.01 + influence * 0.1; 
    for(int i = 1; i < 4; i++) {
        float fi = float(i);
        float angle = slowTime + length(warpedPos) * 0.5;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(cos(angle)));
        
        warpedPos *= rot;
        warpedPos.x += strength * sin(fi * warpedPos.y + slowTime);
        warpedPos.y += strength * cos(fi * warpedPos.x + slowTime);
    }

    //mix color
    vec3 col = vec3(0.0);
    col.r = fbm(warpedPos + slowTime);
    col.g = fbm(warpedPos + vec2(1.0));
    col.b = fbm(warpedPos + vec2(2.0, 4.0));

    // ripples
    col += 0.3 * sin(slowTime + length(warpedPos) * 10.0 + vec3(0.0, 2.0, 4.0));
    
    col = mix(col, col*(2.-2.*col), 0.5);
    col = pow(col, vec3(0.8));

    return vec4(col, 1.0);
}

vec4 color_gaussian_wave(in vec2 uv, float t){
    float strength = 0.02;
    vec3 col = vec3(0.0);
    vec2 pos = uv*2.0-1.0;
    
    // waving (time)
    float wave1 = sin(t * 0.05) * 0.5 + 0.5;  // 0-1
    float wave2 = cos(t * 0.03) * 0.5 + 0.5;
    
    // gauss -> Speed
    float gaussSpeed = gaussian(wave1 - 0.5, 0.3) + gaussian(wave2 - 0.5, 0.4);
    float slowTime = t * (0.1 + gaussSpeed * 0.2); 
    
    for(int i = 1; i < 6; i++){ 
        float noise = fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
        
        // posGauss pos
        float posGauss = gaussian2D(pos, 0.8);
        pos.x += strength * sin(2.0*slowTime+float(i)*100.0 * pos.y*noise) + slowTime * 0.00001 * posGauss;
        pos.y += strength * cos(float(i)*50.0 * pos.x) * (1.0 + posGauss * 0.3);
        
        float chaos_x = sin(pos.y*4.0 + slowTime*1.1) * cos(pos.x*3.0 + slowTime*1.7);
        float chaos_y = cos(pos.x*1.0 + slowTime*2.0) * sin(pos.y*1.3 + slowTime*0.3);
        pos += vec2(chaos_x, chaos_y) * 0.5 * (0.1 + gaussSpeed * 0.5);
    }
    
    col += 0.5 + 0.5*sin(slowTime);
    col = pow(col, vec3(0.5));
    return vec4(col,10.0);
}

vec3 calcNormal(vec3 pos) {
    return normalize(cross(dFdx(pos), dFdy(pos)));
}

float phongShading(vec3 p, vec3 n) {
    vec3 lightPos = vec3(sin(time*1.0), cos(time*1.0), cos(time * 0.4) + 3.0);
    vec3 lightDir = normalize(p - lightPos);
    vec3 viewDir = vec3(0, 0, -1);

    float diff = max(0.0, dot(n, lightDir)) * 1.2;
    float spec = pow(max(0.0, dot(viewDir, reflect(n, lightDir))), 8.0) * 2.0;
    float atten = 2.0 / (pow(distance(lightPos, p), 2.0) + 0.01);
    return (diff + spec * 1.0) * atten;
} 
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
void main()
{
    //shader position
    vec2 uv = vTexCoord;
    vec2 pos = uv * vec2(width, height);
    vec2 center = vec2(width/2.0, height/2.0);

    float aspect = width / height;
    float minDim = min(width, height);
    float maxDim = max(width, height);

    vec2 centerRatio = vec2(0.5);
    centerRatio += vec2(0.2, -0.1);

    vec2 pixelCenter = vec2(width, height) * centerRatio;
    vec2 pixelPos = pos - pixelCenter;  // pos = uv * vec2(width, height)

    float pixelDist = length(pixelPos);
    float circleRadius = minDim * 0.5;
    float normDist = pixelDist/circleRadius;
    vec2 normCoord = pixelPos/circleRadius;

    // reversing distance field
    // timeControl enhance shadow & lens effect
    float timeControl = smoothstep(-0.2, 1.0, (sin(time * 0.2) + 1.0) * 0.5);

    float d = 0.0;
    float h = 0.0;
    float wave = sin(time) * 0.5 + 0.5;

    d = mod(normDist, 0.2);
    h = smoothstep(-0.5, 1.0, sin(d * PI * 2.0 + wave * 0.5));

    // see as a heightmap, apply phongshading
    vec3 vpos = vec3(normCoord, h);
    float shadow = 1.0 - phongShading(vpos, calcNormal(vpos)) * timeControl;
    shadow = clamp(shadow, 0.0, 1.0);

    // refraction-like deformation based on height (screen-space gradient)
    vec2 heightGrad = vec2(dFdx(h), dFdy(h));
    float heightMask = smoothstep(1.05, 0.2, normDist);
    float refractStrength = 0.05 * timeControl;

    for (int ring = 1; ring <= 4; ring++) {
        float ringRadius = float(ring) * 0.25;
        float ringWidth = 0.4;

        if (abs(normDist - ringRadius) < ringWidth * 0.5) {
            float localDist = abs(normDist - ringRadius);
            float lensPct = 1.0 - (localDist / (ringWidth * 0.5));

            float dStrength = d;
            float lensEffectPixels = sin(lensPct * 20.0 + dStrength * 30.0 * sin(time*0.2)) * 10.0
                                * timeControl
                                * (0.8 + 0.4 * cos(time * 0.01 + float(ring)));

            vec2 dirVec = normalize(pixelPos);
            uv += dirVec * lensEffectPixels / vec2(width, height);

            break;
        }
    }

    // slow down the time
    float gaussTimeMain = time * 0.02; 
    
    float ii = 0.0;
    float loopGauss = gaussian(sin(gaussTimeMain * 0.1 + ii * 0.1), 0.4);
    
    // compute the deformed position first
    vec2 modifiedPos = pos;
    modifiedPos.y += cos(modifiedPos.y*40. + ii*10.) * 10.0 * gaussTimeMain * (0.2 + loopGauss * 0.8);
    
    //convert to uv coordinates
    vec2 modifiedUV = modifiedPos / vec2(width, height);
    float dist = distance(modifiedUV, vec2(0.5, 0.5)); // based on screen center

    float ss = smoothstep(0.04, 0.1, time);
    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    vec2 polarOffset = vec2(angle * 25.0, dist * 25.0);
    vec2 organicFlow = vec2(fbm(uv * 1.0 + time * 0.1), fbm(uv * 3.5 - time * 0.1));

    float ccc = mix(1., 1., sin(time) * 0.05 + 0.5);
    float angleTemp = map(ii, 0., 12., 0., PI * PI) + organicFlow.x * 2.0; 
    float radius = 600. + 300. * sin(ii * 123.123) * ii;

    vec2 warpedUV = uv + organicFlow * 0.1;
    vec2 sampleOffset = vec2(
        random(floor(warpedUV * (100.0 + organicFlow.x * 20.0))), 
        random(floor(warpedUV * (130.0 + organicFlow.y * 20.0)))
    ) * (0.001 + smoothstep(0.05, 0.6, distance(uv, vec2(0.5))) * 0.02);

    sampleOffset.x += sin(uv.x * ii + organicFlow.y * 10.0) * 0.1 + fract(dist * 0.03 + organicFlow.x);
    sampleOffset.y += sin(uv.y * ii * ii + organicFlow.x * 10.0) * 0.1 + fract(dist * 0.03 + organicFlow.y);

    float osc = sin(gaussTimeMain * 0.02) * 0.05 + (0.06 * gaussTimeMain + cos(time * 0.04) * PI) * 8.0;
    vec4 wr = color_fun(uv - sampleOffset, osc * sin(uv.x) / uv.x - abs(pow(dist * 30.0, 0.45)));

    // vec2 sampleOffset = vec2(
    //     random(floor(uv * 100.0)), 
    //     random(floor(uv * 100.0 * 1.3))
    // ) * (0.001 + smoothstep(0.05, 0.6, distance(uv, vec2(0.5))) * 0.02); 

    // sampleOffset.x += sin(uv.x * ii) * 0.1 + fract(dist * 0.03);
    // sampleOffset.y += sin(uv.y * ii * ii) * 0.1 + fract(dist * 0.03);
    // // final color
    // // I usually mess with this function a lot to see what's the surprise...
    // float osc = sin(time * 0.008) * 0.1 + sin(0.002 * time + cos(time * 0.04) * PI) * 8.0;

    // // use a unified distance calculation method
    // vec4 wr = color_fun(uv+sampleOffset, osc + (pow(dist*10.0, 0.2))+pos.x*0.01*float(ii)*noise(uv+pos));

    vec3 bright = pow(wr.rgb, vec3(0.7, 0.3, 0.4));
    vec3 original = wr.rgb;
    wr = vec4(mix(original, bright, 0.5), 1.0);
    vec3 modCol = sin(wr.rgb * 0.3) * 0.5 + 0.5;
    // wr = vec4(mix(wr.rgb, modCol, 0.5), 1.0);

    vec3 combo1 = vec3(
        getclrpos(wr.rgb, rand[0]),
        getclrpos(wr.rgb, rand[1]),
        getclrpos(wr.rgb, rand[2])
    );
    
    vec3 combo2 = vec3(
        getclrpos(wr.rgb, rand[3]),
        getclrpos(wr.rgb, rand[4]),
        getclrpos(wr.rgb, rand[5])

    );
    
    float sat1 = 0.2 + abs(sin(time * 0.2)) * 1.1;
    float sat2 = 0.2 + abs(sin(time * 0.1)) * 2.2;

    vec3 col0 = ContrastSaturationBrightness(combo1, 1.0, sat1, 1.0);
    vec3 col1 = ContrastSaturationBrightness(combo2, 1.0, sat2, 1.0);
    wr.rgb = mix(col0, col1, sin(time * 0.15) * 0.5 + 0.5);
    // wr.rgb *= vignette(vTexCoord);
    wr.rgb = mix(wr.rgb, wr.rgb * 0.8, shadow);

    // cloud-like noise + soften edges
    float cloud = fbm(uv * 1.0 + vec2(time * 0.02, -time * 0.015));
    float cloud2 = fbm(uv * 6.0 - vec2(time * 0.01, time * 0.02));
    float cloudMix = pow(smoothstep(0.2, 0.8, mix(cloud, cloud2, 0.5)), 1.0);

    // desaturate + brighten overall
    wr.rgb = mix(
        ContrastSaturationBrightness(wr.rgb, 1.2, 1.0, 0.5),
        ContrastSaturationBrightness(wr.rgb, 3.0, 0.5, 0.6),
        cloudMix
    );
    modCol = sin(wr.rgb * PI * 20.0) * 0.5 + 0.5;
    wr = vec4(mix(wr.rgb, modCol, 0.2), 1.0);
    outputColor = wr;
    //outputColor = vec4(vec3(d), 1.0);
}
// }
