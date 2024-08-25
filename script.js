function lenisScroll() {
  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    console.log(e);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
lenisScroll();

function canvasMain() {
  const canvas = document.querySelector(".canvas");
  const scene = new THREE.Scene();
  const fontLoader = new THREE.FontLoader();

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = new THREE.PerspectiveCamera(
    70,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  camera.position.z = 3;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const grp = new THREE.Group();
  let text = {};

  // Load and apply a military-style font
  fontLoader.load("./source/4n213h58945n.json", (font) => {
    const textGeometry = new THREE.TextGeometry(`CALL OF DUTY`, {
      font,
      size: 0.8,
      // color: 0xaaaaaa,
      height: 0.06,
      curveSegments: 16,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 10,
    });
    textGeometry.center();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      // emissive: 0x000000,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.5,
    });

    text = new THREE.Mesh(textGeometry, material);
    // textGeometry.center();
    scene.add(text);

    // Fire-like particle effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x5d6164, // Fire color
      size: 0.1,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      // map: new THREE.TextureLoader().load('./assets/img/5849nrf423mr.jpg'), // Use a fire/spark texture
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Add bullet casings/debris
    const bulletGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 32);
    for (let i = 0; i < 50; i++) {
      const bullet = new THREE.Mesh(bulletGeometry, material);
      bullet.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      bullet.rotation.x = Math.random() * Math.PI;
      bullet.rotation.y = Math.random() * Math.PI;
      grp.add(bullet);
    }
    scene.add(grp);
  });

  // Dramatic lighting
  const spotLight = new THREE.SpotLight(0xffffff, 1.5);
  spotLight.position.set(2, 5, 5);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.5;
  spotLight.castShadow = true;
  scene.add(spotLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  // Background texture
  // Create a video element
  const video = document.createElement("video");
  video.src = "./assets/identities/Cerberus_KA_NO-LOGO.mp4";
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true; // Optionally mute the video
  video.play();

  video.style.position = "absolute";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vw";
  video.style.objectFit = "cover";

  // Create a video texture
  const videoTexture = new THREE.VideoTexture(video);

  // video texture to the scene background
  scene.background = videoTexture;

  // Fog effect
  const fogColor = new THREE.Color(0x333333);
  scene.fog = new THREE.Fog(fogColor, 1, 15);

  // Text animation
  gsap.to(text.scale, {
    x: 1.1,
    y: 1.1,
    z: 1.1,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut",
  });

  // Animate scene
  const tick = () => {
    grp.rotation.x += 0.005;
    grp.rotation.y += 0.005;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();

  // Camera movement on mouse move
  window.addEventListener("mousemove", (e) => {
    camera.position.x = (e.clientX / sizes.width - 0.5) * 0.3;
    camera.position.y = (e.clientY / sizes.height - 0.5) * 0.3;
    camera.lookAt(new THREE.Vector3(0));
  });

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
canvasMain();

function noiseVoid() {
  let viewWidth,
    viewHeight,
    canvas = document.getElementById("canvas-noise"),
    ctx;

  // change these settings
  let patternSize = 100,
    patternScaleX = 3,
    patternScaleY = 1,
    patternRefreshInterval = 4,
    patternAlpha = 18; // int between 0 and 255,

  let patternPixelDataLength = patternSize * patternSize * 4,
    patternCanvas,
    patternCtx,
    patternData,
    frame = 0;

  window.onload = function () {
    initCanvas();
    initGrain();
    requestAnimationFrame(loop);
  };

  // create a canvas which will render the grain
  function initCanvas() {
    viewWidth = canvas.width = canvas.clientWidth;
    viewHeight = canvas.height = canvas.clientHeight;
    ctx = canvas.getContext("2d");

    ctx.scale(patternScaleX, patternScaleY);
  }

  // create a canvas which will be used as a pattern
  function initGrain() {
    patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    patternCtx = patternCanvas.getContext("2d");
    patternData = patternCtx.createImageData(patternSize, patternSize);
  }

  // put a random shade of gray into every pixel of the pattern
  function update() {
    let value;

    for (let i = 0; i < patternPixelDataLength; i += 4) {
      value = (Math.random() * 255) | 0;

      patternData.data[i] = value;
      patternData.data[i + 1] = value;
      patternData.data[i + 2] = value;
      patternData.data[i + 3] = patternAlpha;
    }

    patternCtx.putImageData(patternData, 0, 0);
  }

  // fill the canvas using the pattern
  function draw() {
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillRect(0, 0, viewWidth, viewHeight);
  }

  function loop() {
    if (++frame % patternRefreshInterval === 0) {
      update();
      draw();
    }

    requestAnimationFrame(loop);
  }
}
noiseVoid();

function navigationSidebar() {
  let closeBtn = document.querySelector(".btn-close-menu");
  // let menuSideBar = document.querySelector(".sidebar");
  let appendBtn = document.querySelector(".btn-menu-appeand");
  const card = document.querySelector(".sidebar");
  appendBtn.addEventListener("click", () => {
    // appendBtn.style.display = 'none'
    gsap.to(card, {
      right: "2%",
      top: "3%",
      opacity: 1,
      ease: Expo.easeInOut,
      duration: 1,
    });
  });
  closeBtn.addEventListener("click", () => {
    // appendBtn.style.display = 'block'
    gsap.to(card, {
      right: "-100%",
      top: "-100%",
      ease: Expo.easeInOut,
      duration: 1,
    });
  });

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // X coordinate of the mouse within the card
    const y = e.clientY - rect.top; // Y coordinate of the mouse within the card

    const rotationX = (y / rect.height - 0.5) * 8; // Tilt based on Y
    const rotationY = (x / rect.width - 0.5) * -8; // Tilt based on X

    gsap.to(card, {
      rotationX: rotationX,
      rotationY: rotationY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.2,
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      ease: "power2.out",
      duration: 0.5,
    });
  });
}
navigationSidebar();

function navbarTop() {
  let navigationMain = document.querySelector(".nav-bar");
  gsap.to(navigationMain, {
    backgroundColor: "#00000048",
    backdropFilter: "blur(20px)",
    scrollTrigger: {
      trigger: "#section1",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}
navbarTop();

function reelWarzone() {
  let reelCon = document.querySelector(".showreelContainer");
  gsap.to(reelCon, {
    width: "100%",
    height: "100%",
    // ease: Expo.easeInOut,
    scrollTrigger: {
      trigger: "canvas",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}
reelWarzone();

function clutterSubSec() {
  let subH1Text = document.querySelectorAll(".sub-text");
  subH1Text.forEach((elem) => {
    let clutter = "";
    let h1Text = elem.textContent;
    let spltdTxt = h1Text.split("");
    spltdTxt.forEach((e) => {
      clutter += `<span>${e}</span>`;
    });
    elem.innerHTML = clutter;
  });

  gsap.to(".section4-wrapper h1 span", {
    color: "#dadada",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".section4-wrapper h1",
      scroller: "body",
      start: "top 90%",
      end: "top 10%",
      scrub: 1,
    },
  });
}
clutterSubSec();

function allLazy() {
  document.addEventListener("DOMContentLoaded", function () {
    var lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy", // Specify the class for lazy-loaded elements
    });
  });
}
allLazy();

function swiperRams() {
  var swiper = new Swiper(".mySwiper", {
    loop: true,
    effect: "coverflow",
    keyboard: {
      enabled: true,
    },
  });
}
swiperRams();

function bodyScrollFrames() {
  let fadeAnimateElem = document.querySelectorAll(".element-scrollTrigger");
  gsap.utils.toArray(fadeAnimateElem).forEach((elem) => {
    gsap.from(elem, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elem,
        start: "top 93%", // Adjust this value to control when the animation starts
        end: "top 50%",
        scrub: true,
      },
    });
  });
}
bodyScrollFrames();

function tiltAll() {
  /* Store the element in el */
  let elements = document.querySelectorAll(".tilt");

  elements.forEach((el) => {
    const height = el.clientHeight;
    const width = el.clientWidth;

    el.addEventListener("mousemove", handleMove);

    function handleMove(e) {
      const xVal = e.layerX;
      const yVal = e.layerY;

      const yRotation = 20 * ((xVal - width / 2) / width);

      const xRotation = -20 * ((yVal - height / 2) / height);

      const string =
        "perspective(500px) scale(1.1) rotateX(" +
        xRotation +
        "deg) rotateY(" +
        yRotation +
        "deg)";

      el.style.transform = string;
    }

    el.addEventListener("mouseout", function () {
      el.style.transform = "perspective(500px) scale(1) rotateX(0) rotateY(0)";
    });

    el.addEventListener("mousedown", function () {
      el.style.transform =
        "perspective(500px) scale(0.9) rotateX(0) rotateY(0)";
    });

    el.addEventListener("mouseup", function () {
      el.style.transform =
        "perspective(500px) scale(1.1) rotateX(0) rotateY(0)";
    });
  });
}
tiltAll();

function olyMouse() {
  let cursor = document.getElementById("olyCursor");
  let vidSelf = document.querySelector(".cod--reel");
  let onVidCon = document.querySelector(".showreelContainer");
  let swiperVoid = document.querySelector(".mySwiper");
  let anchoEffectBigCursor = document.querySelectorAll(".on-big-big");
  window.addEventListener("mousemove", (dets) => {
    gsap.to(cursor, {
      left: dets.x,
      top: dets.y,
    });
  });
  // video
  onVidCon.addEventListener("mouseenter", () => {
    cursor.innerHTML = "sound off";
    cursor.style.width = "90px";
    cursor.style.height = "25px";
    cursor.style.borderRadius = "100px";
  });

  onVidCon.addEventListener("mouseleave", () => {
    cursor.innerHTML = "";
    cursor.style.width = "17px";
    cursor.style.height = "17px";
    cursor.style.borderRadius = "100%";
  });

  onVidCon.addEventListener("click", () => {
    cursor.innerHTML = vidSelf.muted ? "sound on" : "sound off";
    vidSelf.muted = !vidSelf.muted;
  });

  // swiper
  swiperVoid.addEventListener("mouseenter", () => {
    cursor.innerHTML = "Drag";
    cursor.style.height = "50px";
    cursor.style.width = "50px";
    cursor.style.borderRadius = "100px";
  });

  swiperVoid.addEventListener("mouseleave", () => {
    cursor.innerHTML = "";
    cursor.style.height = "15px";
    cursor.style.width = "15px";
    cursor.style.borderRadius = "50%";
  });

  // anchor Tags
  anchoEffectBigCursor.forEach((mmd) => {
    mmd.addEventListener("mouseenter", () => {
      cursor.style.height = "22px";
      cursor.style.width = "22px";
    });

    mmd.addEventListener("mouseleave", () => {
      cursor.style.height = "15px";
      cursor.style.width = "15px";
    });
  });
}
olyMouse();

let loaderFrame = document.getElementById('loader');
gsap.to(loaderFrame, {
  duration: 3,
  delay: 3,
  scaleY: 100,
  scaleX: 100,
  ease: Expo.easeInOut,
  onComplete: function () {
    gsap.to(loaderFrame, {
      duration: 0.5,
      opacity: 0,
      ease: "power1.out",
      onComplete: function () {
        gsap.set(loaderFrame, {
          duration: 1,
          opacity: 0,
          display: "none",
        });
      },
    });
  },
});
