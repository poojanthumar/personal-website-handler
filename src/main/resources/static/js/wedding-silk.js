/* Scroll-driven satin surface. The original image remains the no-WebGL fallback. */
(() => {
  'use strict';
  const host = document.querySelector('.silk-backdrop');
  const image = host?.querySelector('img');
  if (!image) return;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha:false, antialias:false, depth:false, powerPreference:'low-power' });
  if (!gl) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const vertex = `attribute vec2 position; varying vec2 uv;
    void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const fragment = `precision mediump float;
    varying vec2 uv; uniform sampler2D cloth; uniform float phase; uniform float energy;
    void main(){
      vec2 p=vec2(uv.x,1.-uv.y);
      // Keep the reading area calm; folds curl independently along both edges.
      float edge=pow(abs(p.x-.5)*2.,1.35);
      float envelope=sin(p.y*3.14159);
      float fold=sin(p.y*13.-phase*1.7+p.x*5.);
      float ripple=sin(p.y*25.+phase*2.1-p.x*8.);
      float strength=.009+energy*.035;
      vec2 shift=vec2(edge*envelope*strength*(fold+.3*ripple),
        edge*strength*.55*sin(p.x*15.+p.y*8.-phase*1.4));
      vec2 sampleAt=clamp((p-.5)*.94+.5+shift,.001,.999);
      vec3 colour=texture2D(cloth,sampleAt).rgb;
      // Moving crests catch light while troughs deepen, rather than moving a flat image.
      float light=edge*envelope*(.012+energy*.085)*cos(p.y*13.-phase*1.7+p.x*5.);
      gl_FragColor=vec4(clamp(colour+light,0.,1.),1.);
    }`;
  function shader(type, source) {
    const result=gl.createShader(type);gl.shaderSource(result,source);gl.compileShader(result);
    if (!gl.getShaderParameter(result,gl.COMPILE_STATUS)) {gl.deleteShader(result);return null;}
    return result;
  }
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
  if (!vs || !fs) return;
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  gl.deleteShader(vs);gl.deleteShader(fs);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const phaseUniform=gl.getUniformLocation(program,'phase'),energyUniform=gl.getUniformLocation(program,'energy');
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  let ready=false,frame=0,previousY=scrollY,target=scrollY/400,phase=target,energy=0,lastTime=0;
  const paused=()=>reduced.matches || document.body.classList.contains('motion-paused') || document.hidden;
  function resize(){const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);gl.viewport(0,0,canvas.width,canvas.height);wake();}
  function render(time){
    frame=0;if(!ready || paused()) return;
    const dt=Math.min((time-lastTime)||16.7,40)/16.7;lastTime=time;
    const distance=target-phase;phase+=distance*(1-Math.pow(.9,dt));energy*=Math.pow(.94,dt);
    gl.uniform1f(phaseUniform,phase);gl.uniform1f(energyUniform,energy);gl.drawArrays(gl.TRIANGLES,0,6);
    host.classList.add('silk-active');
    if(Math.abs(distance)>.001 || energy>.002) frame=requestAnimationFrame(render);
  }
  function wake(){if(ready && !frame && !paused()) {lastTime=0;frame=requestAnimationFrame(render);}}
  function motionChanged(){
    cancelAnimationFrame(frame);frame=0;host.classList.remove('silk-active');
    phase=target=scrollY/400;previousY=scrollY;energy=0;wake();
  }
  function load(){
    if(ready || !image.naturalWidth)return;
    gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    ready=true;host.append(canvas);resize();
  }
  image.addEventListener('load',load);if(image.complete)load();
  addEventListener('scroll',()=>{const delta=scrollY-previousY;previousY=scrollY;target=scrollY/400;
    if(!paused())energy=Math.min(1,energy+Math.abs(delta)/230);wake();},{passive:true});
  addEventListener('resize',resize,{passive:true});
  document.addEventListener('wedding:motion',motionChanged);reduced.addEventListener('change',motionChanged);
  document.addEventListener('visibilitychange',motionChanged);
  canvas.addEventListener('webglcontextlost',()=>{ready=false;cancelAnimationFrame(frame);host.classList.remove('silk-active');});
})();
