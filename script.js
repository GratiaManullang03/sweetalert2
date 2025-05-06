// Define the Toast mixin once
const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.onmouseenter = Swal.stopTimer;
		toast.onmouseleave = Swal.resumeTimer;
	},
});

// Helper function to get icon HTML for custom icons
function getCustomIconHtml(iconName) {
	const iconMap = {
		'custom-cog': '<i class="fas fa-cog fa-2x"></i>',
		'custom-bell': '<i class="fas fa-bell fa-2x"></i>',
		'custom-code': '<i class="fas fa-code fa-2x"></i>',
		'custom-server': '<i class="fas fa-server fa-2x"></i>',
	};

	return iconMap[iconName] || '';
}

// Helper function to get animation class
function getAnimationClass(animation) {
	const animationMap = {
		fade: 'swal2-fade',
		slide: 'swal2-slide-from-top',
		bounce: 'swal2-bounce',
		shake: 'swal2-shake',
		flip: 'swal2-flip',
	};

	return animationMap[animation] || 'swal2-fade';
}

// Function to display toast
function showToast(
	code,
	description,
	icon,
	bgColor,
	textColor = '#ffffff',
	animation
) {
	// Create a unique ID for this toast's styles
	const styleId = `toast-style-${Date.now()}`;
	const style = document.createElement('style');
	style.id = styleId;
	style.textContent = `
        .swal2-toast {
            background-color: ${bgColor} !important;
        }
        .swal2-toast .swal2-title {
            color: ${textColor} !important;
            font-family: 'Poppins', sans-serif;
        }
        .swal2-toast .swal2-icon {
            color: ${textColor} !important;
        }
        .swal2-toast .swal2-timer-progress-bar {
            background: ${textColor}40 !important;
        }
    `;
	document.head.appendChild(style);

	Toast.fire({
		title: `${code}: ${description}`,
		icon: icon,
		customClass: {
			popup: getAnimationClass(animation),
		},
		didOpen: (toast) => {
			toast.onmouseenter = () => {
				Swal.stopTimer();
				// Ensure styles remain during hover
				document.getElementById(styleId)?.remove();
				document.head.appendChild(style.cloneNode(true));
			};
			toast.onmouseleave = () => {
				Swal.resumeTimer();
			};
		},
		willClose: () => {
			// Remove the style element when toast is closed
			document.getElementById(styleId)?.remove();
		},
	});
}

// Helper function to get animation CSS
function getAnimationCSS(animation) {
	const cssMap = {
		shake: `.swal2-shake {
            animation: swal2-shake 0.5s;
        }
        @keyframes swal2-shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }`,
		slide: `.swal2-slide-from-top {
            animation: swal2-slide-from-top 0.3s;
        }
        @keyframes swal2-slide-from-top {
            0% { transform: translateY(-100px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }`,
		bounce: `.swal2-bounce {
            animation: swal2-bounce 0.5s;
        }
        @keyframes swal2-bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }`,
		flip: `.swal2-flip {
            animation: swal2-flip 0.5s;
        }
        @keyframes swal2-flip {
            0% { transform: perspective(400px) rotateX(90deg); opacity: 0; }
            100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }
        }`,
	};

	return cssMap[animation] || '';
}

// Event listeners for preset buttons
document.querySelectorAll('.status-btn').forEach((button) => {
	button.addEventListener('click', () => {
		const code = button.getAttribute('data-code');
		const description = button.getAttribute('data-description');
		const icon = button.getAttribute('data-icon');
		const textColor = '#ffffff'; // Set default white text color

		// Get appropriate background color based on button class and status code
		let bgColor;
		switch (code) {
			case '304':
				bgColor = '#6366f1'; // indigo
				break;
			case '400':
				bgColor = '#ef4444'; // red-500
				break;
			case '401':
				bgColor = '#f59e0b'; // amber-500
				break;
			case '403':
				bgColor = '#dc2626'; // red-600
				break;
			case '404':
				bgColor = '#ef4444'; // red-500
				break;
			case '405':
				bgColor = '#f59e0b'; // amber-500
				break;
			case '500':
				bgColor = '#b91c1c'; // red-700
				break;
			case '502':
				bgColor = '#dc2626'; // red-600
				break;
			case '503':
				bgColor = '#ef4444'; // red-500
				break;
			case '200':
				bgColor = '#10b981'; // emerald-500
				break;
			default:
				bgColor = '#6366f1'; // default indigo
		}

		showToast(code, description, icon, bgColor, textColor);
	});
});

// Event listener for custom toast
document.getElementById('copyCodeBtn').addEventListener('click', () => {
	const code = document.getElementById('generatedCode').textContent;
	navigator.clipboard
		.writeText(code)
		.then(() => {
			Swal.fire({
				toast: true,
				icon: 'success',
				title: 'Code copied to clipboard!',
				position: 'top-end',
				showConfirmButton: false,
				timer: 2000,
				background: '#10b981', // emerald-500 for success
				color: '#ffffff',
				iconColor: '#ffffff',
			});
		})
		.catch((err) => {
			Swal.fire({
				toast: true,
				icon: 'error',
				title: 'Failed to copy code',
				position: 'top-end',
				showConfirmButton: false,
				timer: 2000,
				background: '#ef4444', // red-500 for error
				color: '#ffffff',
				iconColor: '#ffffff',
			});
		});
});

// Update color value displays
document.getElementById('bgColor').addEventListener('input', (e) => {
	document.getElementById('bgColorValue').textContent = e.target.value;
});

document.getElementById('textColor').addEventListener('input', (e) => {
	document.getElementById('textColorValue').textContent = e.target.value;
});

// Fungsi untuk generate kode
function generateCode(code, description, icon, bgColor, textColor, animation) {
	// Escape single quotes in description
	const escapedDescription = description.replace(/'/g, "\\'");

	return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SweetAlert2 Toast Demo</title>
        
        <!-- SweetAlert2 CSS -->
        <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.21.0/dist/sweetalert2.min.css" rel="stylesheet">
        
        <style>
        .swal2-toast {
            background-color: ${bgColor} !important;
        }
        .swal2-toast .swal2-title {
            color: ${textColor} !important;
            font-family: 'Arial', sans-serif;
        }
        .swal2-toast .swal2-icon {
            color: ${textColor} !important;
        }
        </style>
    </head>
    <body>
        <!-- SweetAlert2 JS -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.21.0/dist/sweetalert2.all.min.js"><\/script>
        
        <script>
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        // Function untuk menampilkan toast
        function showToast() {
            Toast.fire({
                title: '${code}: ${escapedDescription}',
                icon: '${icon}'
            });
        }

        // Auto trigger toast saat halaman dimuat
        window.addEventListener('load', showToast);
        <\/script>
    </body>
    </html>`;
}

// Event listener untuk custom toast
document.getElementById('showCustomToast').addEventListener('click', () => {
	const code = document.getElementById('customCode').value;
	const description = document.getElementById('customDescription').value;
	const icon = document.getElementById('icon').value;
	const bgColor = document.getElementById('bgColor').value;
	const textColor = document.getElementById('textColor').value;
	const animation = document.getElementById('animation').value;

	// Show the toast
	showToast(code, description, icon, bgColor, textColor, animation);

	// Generate and display the code
	const generatedCode = generateCode(
		code,
		description,
		icon,
		bgColor,
		textColor,
		animation
	);
	document.getElementById('generatedCode').textContent = generatedCode;
});
