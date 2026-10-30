(function() {
    console.log("🔮 Menu 3D Hologram & Particle Showcase Plugin Initialized!");

    function openHologramModal() {
        if(document.getElementById('skmHologramModal')) {
            document.getElementById('skmHologramModal').style.display = 'flex';
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'skmHologramModal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 100000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(10px); font-family: 'Battambang', sans-serif; padding: 20px;`;
        
        modal.innerHTML = `
            <div style="background: rgba(15,23,42,0.9); color: #fff; padding: 20px; border-radius: 24px; width: 100%; max-width: 440px; text-align: center; border: 1px solid rgba(6,182,212,0.4); box-shadow: 0 0 50px rgba(6,182,212,0.3); position: relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #06b6d4; margin:0;"><i class="fa-solid fa-cube"></i> ផ្ទាំងបង្ហាញទំនិញ 3D ហូឡូក្រាម</h3>
                    <button onclick="document.getElementById('skmHologramModal').style.display='none'" style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#ef4444; width:28px; height:28px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">ប្រើប្រាស់ Mouse ដើម្បីបង្វិលមើលទំនិញក្នុងលំហ 3D ហូឡូក្រាម៖</p>
                
                <div id="threeJsCanvasContainer" style="width: 100%; height: 300px; border-radius: 16px; background: #090d16; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; position: relative;"></div>

                <button class="btn-act btn-green" style="width: 100%; background: linear-gradient(135deg, #06b6d4, #2563eb); border: none; border-radius: 14px; padding: 12px; font-weight: bold;" onclick="document.getElementById('skmHologramModal').style.display='none'">បិទផ្ទាំង 3D</button>
            </div>
        `;
        document.body.appendChild(modal);

        loadThreeJsAndInit();
    }

    function loadThreeJsAndInit() {
        if (window.THREE) {
            initThreeScene();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            initThreeScene();
        };
        document.head.appendChild(script);
    }

    function initThreeScene() {
        const container = document.getElementById('threeJsCanvasContainer');
        if (!container || container.children.length > 0) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x06b6d4, 2, 50);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Create a glowing 3D Hologram Cube / Product Shape
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            roughness: 0.2,
            metalness: 0.8,
            wireframe: false
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Add wireframe outer shell
        const wireGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
        const wireCube = new THREE.Mesh(wireGeometry, wireMaterial);
        scene.add(wireCube);

        camera.position.z = 5;

        // Mouse interaction for rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.onmousedown = (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; };
        container.onmousemove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            cube.rotation.y += deltaX * 0.01;
            cube.rotation.x += deltaY * 0.01;
            wireCube.rotation.y = cube.rotation.y;
            wireCube.rotation.x = cube.rotation.x;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };
        window.onmouseup = () => { isDragging = false; };

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            if (!isDragging) {
                cube.rotation.y += 0.01;
                cube.rotation.x += 0.005;
                wireCube.rotation.y = cube.rotation.y;
                wireCube.rotation.x = cube.rotation.x;
            }
            renderer.render(scene, camera);
        }
        animate();
    }

    const initInt = setInterval(() => {
        if (typeof window.registerMenuTool === 'function') {
            window.registerMenuTool('🔮', 'បង្ហាញទំនិញ 3D ហូឡូក្រាម', openHologramModal);
            clearInterval(initInt);
        }
    }, 500);
})();