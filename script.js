import {
				BufferGeometry,
				Color,
				DirectionalLight,
				DoubleSide,
				Group,
				LineSegments,
				LineBasicMaterial,
				Mesh,
				MeshPhongMaterial,
				PerspectiveCamera,
				Scene,
				SphereGeometry,
				WireframeGeometry,
				WebGLRenderer,
                TextureLoader
			} from 'three';
			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



			function updateGroupGeometry( mesh, geometry ) {

				mesh.children[ 0 ].geometry.dispose();
				mesh.children[ 1 ].geometry.dispose();

				mesh.children[ 0 ].geometry = new WireframeGeometry( geometry );
				mesh.children[ 1 ].geometry = geometry;


			}

			const guis = {

				SphereGeometry: function ( mesh ) {

					const data = {
						radius: 10,
						widthSegments: 32,
						heightSegments: 16,
						phiStart: 0,
						phiLength: Math.PI * 2,
						thetaStart: 0,
						thetaLength: Math.PI
					};

					function generateGeometry() {

						updateGroupGeometry( mesh,
							new SphereGeometry(
								data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength
							)
						);

					}

					generateGeometry();

				},
			};

			function sphereGeometry( mesh ) {

				const selectedGeometry = 'SphereGeometry';

				if ( guis[ selectedGeometry ] !== undefined ) {

					guis[ selectedGeometry ]( mesh );

				}

			}

			const scene = new Scene();
			scene.background = new Color( 0x000000 );

			const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
			camera.position.z = 30;

			const renderer = new WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			const orbit = new OrbitControls( camera, renderer.domElement );
			orbit.enableZoom = false;

			const lights = [];
			lights[ 0 ] = new DirectionalLight( 0xffffff, 3);
			lights[ 1 ] = new DirectionalLight( 0xffffff, 2);
			lights[ 2 ] = new DirectionalLight( 0xffffff, 3);
			lights[ 3 ] = new DirectionalLight( 0xffffff, 1);

			lights[ 0 ].position.set( 0, 500, 0 );
			lights[ 1 ].position.set( 100, 200, 100 );
			lights[ 2 ].position.set( - 100, - 200, - 100 );
            lights[ 3 ].position.set(50,0,100);

			scene.add( lights[ 0 ] );
			scene.add( lights[ 1 ] );
			scene.add( lights[ 2 ] );
            scene.add(lights[3]);

			const group = new Group();

			const geometry = new BufferGeometry();

            const textureLoader = new TextureLoader();
            const texture = textureLoader.load('disco.jpg');

			const lineMaterial = new LineBasicMaterial( { transparent: true, opacity: 0 } );
			const meshMaterial = new MeshPhongMaterial( { map: texture, side: DoubleSide, flatShading: true, castShadow: false } );

			group.add( new LineSegments( geometry, lineMaterial ) );
			group.add( new Mesh( geometry, meshMaterial ) );

			sphereGeometry( group );

			scene.add( group );

			function animate() {

				requestAnimationFrame( animate );
				group.rotation.y += 0.005;

				renderer.render( scene, camera );
    

			}

			window.addEventListener( 'resize', function () {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}, false );

			animate();