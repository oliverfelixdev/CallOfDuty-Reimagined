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

/* function clutterSubSec() {
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

  gsap.to(".section2-wrapper h1 span", {
    color: "#dadada",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".section2-wrapper h1",
      scroller: "body",
      start: "top 90%",
      end: "top 10%",
      scrub: 1,
    },
  });
}
clutterSubSec(); */

function allLazy() {
  document.addEventListener("DOMContentLoaded", function () {
    var lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy", // Specify the class for lazy-loaded elements
    });
  });
}
allLazy();

/* function parallaxButtons() {
  const docStyle = document.documentElement.style;
  const aElem = document.querySelector(".cta-btn");
  const boundingClientRect = aElem.getBoundingClientRect();

  aElem.onmousemove = function (e) {
    const x = e.clientX - boundingClientRect.left;
    const y = e.clientY - boundingClientRect.top;

    const xc = boundingClientRect.width / 2;
    const yc = boundingClientRect.height / 2;

    const dx = x - xc;
    const dy = y - yc;

    docStyle.setProperty("--rx", `${dy / -1}deg`);
    docStyle.setProperty("--ry", `${dx / 10}deg`);
  };

  aElem.onmouseleave = function (e) {
    docStyle.setProperty("--ty", "0");
    docStyle.setProperty("--rx", "0");
    docStyle.setProperty("--ry", "0");
  };

  aElem.onmousedown = function (e) {
    docStyle.setProperty("--tz", "-25px");
  };

  document.body.onmouseup = function (e) {
    docStyle.setProperty("--tz", "-12px");
  };
} parallaxButtons(); */