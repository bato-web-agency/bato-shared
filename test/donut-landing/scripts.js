import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Lenis Connect

const lenis = new Lenis({
	smooth: true,
	multiplier: 0.5,
	easing: (t) => t * (2 - t),
	smoothTouch: true,
	lerp: 0.05,
	duration: 1.2,
});

function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger, SplitText);

// Scene

const scene = new THREE.Scene();

// Camera Position

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(0, 0, 0);
scene.add(camera);

// Renderer Functional

const modelContainer = document.querySelector('#donut');

const renderer = new THREE.WebGLRenderer({
	alpha: true
});
renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
modelContainer.appendChild(renderer.domElement);

// Light Functional

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
ambientLight.position.set(0, 1, 10);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);

// Model Loading

let model;
const loader = new GLTFLoader();

loader.load('./models/drip_donut.glb', (gltf) => {
	model = gltf.scene;

	model.children[0].children[0].children[0].children[0].children[1].children[0].children[0].material.color.set('#ffc6f3');
	model.rotation.set(0, 1.5, 0.75);
	scene.add(model);

	setupGsapAnimations(model);
	handleResponsive();
});

const animate = () => {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}
animate();

// Model Responsive

const handleResponsive = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;

	if (!model) return;

	const dots = [
		{ width: 1300, scale: 1, position: [0, -0.1, -2], z: 5 },
		{ width: 1280, scale: 1, position: [0.2, 0, -2], z: 5 },
		{ width: 1200, scale: 1, position: [0, 0, -2], z: 5 },
		{ width: 1024, scale: 1, position: [0.5, 0, -3], z: 5.5 },
		{ width: 960, scale: 1, position: [0.5, 0, -3], z: 6 },
		{ width: 768, scale: 0.7, position: [0.5, 0, -1.2], z: 6.5 },
		{ width: 640, scale: 0.7, position: [0.45, 0, -1.2], z: 7 },
		{ width: 575, scale: 0.6, position: [0.45, -0.1, -1.2], z: 7 },
		{ width: 475, scale: 0.5, position: [0.3, -0.1, -1.2], z: 7 },
		{ width: 375, scale: 0.35, position: [0.3, -0.1, -1.2], z: 7.5 },
		{ width: 0, scale: 0.35, position: [0.25, -0.5, -1.2], z: 7.5 }
	];

	const dot = dots.find(d => width >= d.width) || dots[dots.length - 1];

	model.scale.set(dot.scale, dot.scale, dot.scale);
	model.position.set(...dot.position);
	camera.position.z = dot.z;

	camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
}

function debounce(func, delay = 200) {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

let lastWidth = window.innerWidth;

const onResize = debounce(() => {
	const currentWidth = window.innerWidth;

	if (currentWidth !== lastWidth) {
		handleResponsive();
		lastWidth = currentWidth;
		window.location.reload();
	}
}, 200);

window.addEventListener('resize', onResize);

// Site GSAP Animations

const setupGsapAnimations = (model) => {
	const donutTop = model.children[0].children[0].children[0].children[0].children[1].children[0].children[0].material;
	const donutParticles = model.children[0].children[0].children[0].children[0].children[2].children[0].children[0];
	donutParticles.material.transparent = true;
	donutParticles.material.opacity = 1;

	// Hero Section Animations

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: '#hero',
			start: 'top top',
			end: () => `+=${window.innerHeight}px`,
			pin: true,
			pinSpacing: false,
			scrub: true,
		}
	});

	timeline
		.to(model.rotation, { y: Math.PI * 4.5, duration: 1 });

	// Transition Section Animations

	const timeline2 = gsap.timeline({
		scrollTrigger: {
			trigger: '#transition',
			start: 'top bottom',
			end: () => `+=${window.innerHeight / 2}px`,
			scrub: true,
		}
	});

	timeline2
		.to(model.rotation, { x: 0, z: 0.8, duration: 1})
		.to(model.scale, { x: window.innerWidth < 575 ? 1.75 : 2.25, y: window.innerWidth < 575 ? 1.75 : 2.25, z: window.innerWidth < 575 ? 1.75 : 2.25, duration: 1,}, '<')
		.to(model.position, { x: 0, y: 0, z: -5, duration: 1 }, '<')
		.to(modelContainer, { x: '0vw', y: window.innerWidth < 1024 ? '20vh' : '20vh', duration: 1 }, '<+=0.1');

	// Flip Section Animations

	const flipShadow = document.querySelector('.flip__shadow');

	const timeline3 = gsap.timeline({
		scrollTrigger: {
			trigger: '#flip',
			start: 'top top',
			end: () => `+=${window.innerHeight * 1.5}px`,
			scrub: 1,
			pin: true,
			pinSpacing: false,
		}
	});

	timeline3
		.to(model.rotation, { y: Math.PI * 0.5, duration: 1} )
		.to('.flip__heading', {opacity: 1, y: 0, duration: 0.5}, '<')
		.to('.flip__text', {opacity: 1, y: 0, duration: 0.5}, '<')

	// Steps Section Animations

	const cards = [...document.querySelectorAll('.steps__card')];
	const cardsArray = Array.from(cards);

	const colors = [
		{ r: 0.62, g: 0.80, b: 0.39 },
		{ r: 0.9568627450980393, g: 0.9254901960784314, b: 0.8666666666666667 },
		{ r: 0.9098039215686274, g: 0.5490196078431373, b: 0.7333333333333333 },
		{ r: 0.16862745098039217, g: 0.047058823529411764, b: 0.011764705882352941 },
	];

	const timeline4 = gsap.timeline({
		scrollTrigger: {
			trigger: '#steps',
			start: 'top top',
			end: () => `+=${window.innerHeight * 4}`,
			scrub: true,
			pin: true,
			pinSpacing: false
		}
	});

	timeline4
		.to(modelContainer, {
			y: () => {
				return window.innerWidth < 768
					? '25vh'
					: '5vh'
			},
			duration: 1
		}, 0)
		.to(model.scale, { x: window.innerWidth < 1300 ? 1.5 : 2.25,  y: window.innerWidth < 1300 ? 1.5 : 2.25,  z: window.innerWidth < 1300 ? 1.5 : 2.25,  duration: 1}, '<')
		.to('.steps__heading', {opacity: 1, y: 0, duration: 0.5}, '<');

	timeline4.to(`.steps__indicator:nth-child(1)`, {
		opacity: 1,
		duration: 1,
		ease: 'power2.out',
	}, 0);

	cardsArray.forEach((card, index) => {
		const y = `-${((index + 1) * 96)}vh`;
		const color = colors[index % colors.length];
		const stepTime = (index + 1) * 5;
		const delayTime = stepTime + 0.3;

		timeline4
			.to(card, { y: y, duration: 5, ease: 'power3.out' }, stepTime)
			.to(donutTop.color, {r: color.r, g: color.g, b: color.b, duration: 5, ease: 'power3.out' }, stepTime - 3)
			.to(model.rotation, {
				y: "+=" + Math.PI * 2,
				duration: 5,
				ease: "power2.out"
			}, delayTime - 3)

		timeline4.to(`.steps__indicator:nth-child(${index + 1})`, {
			opacity: 1,
			duration: 1,
			ease: 'power2.out'
		}, stepTime );

		if (index > 0) {
			timeline4.to(`.steps__indicator:nth-child(${index})`, {
				opacity: 0.2,
				duration: 1,
				ease: 'power2.out'
			}, stepTime);
		}

		if (index === cardsArray.length - 1) {
			timeline4.to('.steps__indicator', {
				opacity: 0.2,
				duration: 1,
				ease: 'power2.out'
			}, stepTime + 10);
		}

		if (index === 2) {
			timeline4.to(donutParticles.material, { opacity: 0, duration: 3, ease: 'power2.out' }, stepTime + 1);
		}
	});

	// Second Transition Section

	const timeline5 = gsap.timeline({
		scrollTrigger: {
			trigger: '#second-transition',
			start: 'top bottom',
			end: () => `+=${window.innerHeight * 2}px`,
			scrub: true,
		}
	});

	timeline5
		.to(donutTop.color, { r: 0.9098039215686274, g: 0.5490196078431373, b: 0.7333333333333333, duration: 5, ease: 'power3.out' }, '0')
		.to(donutParticles.material, { opacity: 1, duration: 1, ease: 'power2.out' }, '<')
		.to(model.scale, {
			x: (window.innerHeight < 600 || window.innerWidth < 1024) ? 1.5 : 2.25,
			y: (window.innerHeight < 600 || window.innerWidth < 1024) ? 1.5 : 2.25,
			z: (window.innerHeight < 600 || window.innerWidth < 1024) ? 1.5 : 2.25,
			duration: 1
		}, '<')
		.to(modelContainer, {
			x: () => {
				if (window.innerWidth < 640) return '0vw';
				if (window.innerHeight < 600) return '0';
				return '25vw';
			},
			y: () => {
				if (window.innerHeight < 600) return '30vh';
				if (window.innerWidth < 640) return '25vh';
				return window.innerWidth < 1200 ? '5vh' : '15vh';
			},
			duration: 1
		}, '<')


	// Numbers Section Animations

	const items = gsap.utils.toArray('.numbers__item');

	const timeline6 = gsap.timeline({
		scrollTrigger: {
			trigger: '#numbers',
			start: 'top top',
			end: () => `+=${window.innerHeight * items.length - 2}`,
			scrub: true,
			pin: true,
			pinSpacing: false,
		}
	});

	timeline6
		.to('.numbers__heading', {opacity: 1, y: 0, duration: 1}, '-=1');

	items.forEach((item, i) => {
		const others = items.filter((item, index) => index !== i);

		timeline6
			.to(others, {
				opacity: 0.3,
				duration: 0.5,
				ease: 'power1.out'
			}, i)

			.to(item, {
				opacity: 1,
				duration: 1,
				ease: 'power2.out'
			}, i)

			.to(model.rotation, {
				y: "+=" + Math.PI * 2,
				duration: 1,
				ease: "power2.out"
			}, i)
	});

	// Final Section Animations

	const finalText = document.querySelector('.final__order-box');

	const timeline7 = gsap.timeline({
		scrollTrigger: {
			trigger: '#final',
			start: 'top-=400 top',
			end: () => `+=${window.innerHeight}px`,
			scrub: true,
			onEnter: () => {
				controlModel = true
				modelContainer.style.pointerEvents = 'auto';
				hasSavedRotation = false;
				rotationReset = false;
				savedRotation = null;
				isModelRestored = false;
			},
			onLeaveBack: () => {
				controlModel = false;
				hasSavedRotation = false;
				rotationReset = false;
				savedRotation = null;
				modelContainer.style.pointerEvents = 'none';
				gsap.to(model.position, {x: 0, y: -0.01, z: -5, duration: 1});
			},
			onUpdate: (self) => {
				if (self.progress < 0.01 && self.direction === -1) {
					model.position.set(0, -0.01, -5);
					controlModel = false;
					modelContainer.style.pointerEvents = 'none';
				}
			}
		}
	});

	timeline7
		.to('.final__order-box', { opacity: 1, y: 0, duration: 0.5 }, '<')
		.to(donutTop.color, { r: 0.62, g: 0.80, b: 0.39, duration: 0.5 }, '<')
		.to(donutParticles.material, { opacity: 1, duration: 1, ease: 'power2.out' }, '<')
		.to(modelContainer, {
			x: () => {
				if ((window.innerHeight < 600) && (window.innerWidth < 575)) return '0vw';
				if (window.innerHeight < 600) return '-30vw';
				if (window.innerWidth < 768) return '0vw';
				if (window.innerWidth < 575) return '0vw';
				return '-40vw';
			},
			y: () => {
				if (window.innerWidth < 1024 && window.innerHeight < 600) return '30vh';
				if (window.innerHeight < 600) return '10vh';
				if (window.innerWidth < 1200) return '30vh';
				return '5vh';
			},
			duration: 1
		}, '<')
		.to(model.scale, {
			x: window.innerWidth < 1024 ? 1.5 : 2.25,
			y: window.innerWidth < 1024 ? 1.5 : 2.25,
			z: window.innerWidth < 1024 ? 1.5 : 2.25,
			duration: 1
		}, '<')
}

// Control Model Functional

let isDragging = false;
let prevMousePosition = { x: 0, y: 0};
let controlModel = false;
let rotationReset = false;
let hasSavedRotation = false;
let savedRotation = null;
let isModelRestored = false;

window.addEventListener('mousedown', (event) => {
	if (controlModel) {
		if (!isDragging && !hasSavedRotation && model) {
			savedRotation = model.rotation.clone();
			hasSavedRotation = true;
		}
		rotationReset = false;
		isModelRestored = false;
	}

	if (!isDragging) {
		isDragging = true;
	}

	prevMousePosition = { x: event.clientX, y: event.clientY };
	if (!savedRotation) return;
});

window.addEventListener('mousemove', (event) => {
	if (!isDragging || !controlModel  || !savedRotation) return;

	if (isModelRestored) return;

	const mouseMove = {
		x: event.clientX - prevMousePosition.x,
		y: event.clientY - prevMousePosition.y
	};

	if (model) {
		model.rotation.y += mouseMove.x * 0.0025;
		model.rotation.x += mouseMove.y * 0.0025;
	}

	prevMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener('touchstart', (event) => {
	if (event.touches.length === 2 && controlModel) {
		if (!isDragging && !hasSavedRotation && model) {
			savedRotation = model.rotation.clone();
			hasSavedRotation = true;
		}
		rotationReset = false;
	}

	if (event.touches.length === 2) {
		isDragging = true;
		prevMousePosition = {
			x: event.touches[0].clientX,
			y: event.touches[0].clientY
		};
	}
});

window.addEventListener('touchmove', (event) => {
	if (!isDragging || !controlModel || event.touches.length !== 2 || !savedRotation) return;

	const touch = event.touches[0];
	const mouseMove = {
		x: touch.clientX - prevMousePosition.x,
		y: touch.clientY - prevMousePosition.y
	};

	if (model) {
		model.rotation.y += mouseMove.x * 0.0025;
		model.rotation.x += mouseMove.y * 0.0025;
	}

	prevMousePosition = {
		x: touch.clientX,
		y: touch.clientY
	};

	event.preventDefault();
}, { passive: false });

window.addEventListener('touchend', () => {
	isDragging = false;
});

window.addEventListener('mouseup', () => {
	isDragging = false;
});

// Main Site Functional

document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.header');
	const openMenu= document.querySelector('#openMenu');
	const closeMenu= document.querySelector('#closeMenu');
	const mobileMenu = document.querySelector('#mobile-menu');
	const mousePointer = document.querySelector('#scroll-btn');
	const menuLinks = [...document.querySelectorAll('a[href^="#"]')];

	// Header Scrolling

	window.addEventListener('scroll', () => {
		if (window.scrollY > 100) {
			header.classList.add('scrolling');
		} else {
			header.classList.remove('scrolling');
		}

		if (controlModel && !rotationReset && savedRotation) {
			rotationReset = true;
			isModelRestored = true;

			gsap.to(model.rotation, {
				x: savedRotation.x,
				y: savedRotation.y,
				z: savedRotation.z,
				duration: 1,
				ease: "power2.out",
			});
		}
	});

	// Mobile Menu

	if(openMenu) {
		openMenu.addEventListener('click', () => {
			document.body.classList.add('menu-open');
			mobileMenu.classList.add('active');
		})
	}

	if(closeMenu) {
		closeMenu.addEventListener('click', () => {
			document.body.classList.remove('menu-open');
			mobileMenu.classList.remove('active');
		})
	}

	// Mouse Scrolling

	if(mousePointer) {
		mousePointer.addEventListener('click', () => {
			lenis.scrollTo(window.scrollY + (window.innerHeight * 3), {
				immediate: false,
				offset: 350,
				duration: 5,
			});
		})
	}

	// Menu Links Scroll

	menuLinks.forEach(anchor => {
		anchor.addEventListener('click', (e) => {
			e.preventDefault();
			mobileMenu.classList.remove('active');

			const target = document.querySelector(anchor.getAttribute('href'));
			if (target) {
				lenis.scrollTo(target, {
					immediate: false,
					offset: 700,
					duration: 5,
				});
			}
		});
	});
})