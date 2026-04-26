// Revisar: This file was not made by myself, credit goes to José Smiller

// Loading animation that auto-hides after 10 seconds

const rightPath = `<svg class="foot-svg" viewBox="0 0 75 80"><path d="M42.6375 14.5292C42.8567 10.9643 39.9996 0.222763 36.4347 0.00342044C32.8696 -0.215782 29.9467 10.1699 29.7275 13.7349C29.7275 13.7349 31.1443 43.8448 27.6986 46.7415C24.2529 49.6383 14.0801 21.9513 14.0801 21.9513C12.3606 18.8207 4.56528 13.784 1.43462 15.5035C-1.69603 17.223 1.02276 25.0475 2.74222 28.1781C2.74222 28.1781 21.8911 50.9547 25.0325 68.7619C25.2717 70.1179 25.1437 70.9355 25.5597 72.2481C26.639 75.6533 28.055 78.881 31.62 79.0996C35.1846 79.3176 38.2518 76.6054 38.4706 73.0408C38.4706 73.0408 38.5799 71.9806 38.576 71.2993C38.5721 70.6299 38.4795 70.1803 38.4547 69.5894C37.7396 52.5475 69.338 38.7044 69.338 38.7044C71.8635 36.1788 76.4605 30.7038 73.9351 28.1781C71.4094 25.6525 62.717 27.0328 60.1913 29.5584C60.1913 29.5584 42.9861 49.9503 40.505 49.2492C38.0239 48.5481 42.6375 14.5292 42.6375 14.5292Z" fill="#190A03" /></svg>`;
const leftPath = `<svg class="foot-svg" viewBox="0 0 70 68"><path d="M42.0826 14.1241C44.5598 11.5511 53.3613 8.33591 55.9343 10.813C58.5074 13.2903 53.878 20.5218 51.4006 23.0948C51.4006 23.0948 28.2668 42.4193 28.4643 46.9165C28.6617 51.4138 55.9342 40.177 55.9342 40.177C59.403 39.3256 68.2267 40.0335 69.0781 43.5023C69.9295 46.9711 62.4866 51.8879 59.0178 52.7393C59.0178 52.7393 29.2898 54.0437 14.0502 63.776C12.8897 64.5171 12.3741 65.1644 11.126 65.7459C7.88802 67.2545 4.55305 68.3951 1.98047 65.9173C-0.591334 63.4396 -0.668689 59.3458 1.80853 56.7734C1.80853 56.7734 2.51542 55.9758 3.01988 55.5178C3.51551 55.0678 3.90926 54.8319 4.36122 54.4505C17.396 43.449 6.21628 10.813 6.21628 10.813C6.36794 7.24458 7.55777 -0.149206 11.1262 0.00229119C14.6948 0.153901 19.2911 7.794 19.1395 11.3626C19.1395 11.3626 15.7598 37.8281 17.9545 39.1812C20.1492 40.5342 42.0826 14.1241 42.0826 14.1241Z" fill="#190A03"/></svg>`;

const LOADER_DURATION = 2000; // 1 second

function initLoader() {
  const stage = document.getElementById("stage");
  if (!stage) return; // Exit if loader container not found

  let progress = 0;
  let stepCount = 0;
  const totalDuration = LOADER_DURATION;
  const stepFrequency = 200;
  let animationFrameId = null;

  function animate() {
    progress += 16.67;
    let t = (progress % totalDuration) / totalDuration; // Normalize time 0 to 1

    // 1. Calculate X (linear left to right)
    const x = t * 120 - 10;

    // 2. INVERTED CURVE logic
    // By using (1 - Math.cos), the path starts flat and then curves "downward/outward"
    // before swinging up, creating the inverted arc.
    const y = Math.cos((t * Math.PI) / 2) * 95 - 5;

    // 3. Dynamic Rotation
    // We calculate the approximate "angle" of the curve to keep feet facing forward
    const nextT = t + 0.01;
    const nextX = nextT * 120 - 10;
    const nextY = 95 - Math.sin((nextT * Math.PI) / 2) * 95;
    const angle = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);

    if (Math.floor(progress / stepFrequency) > stepCount) {
      stepCount++;
      // Adjust the 'isRight' alternating logic to reset with 't'
      if (t < 0.05) stepCount = 0;
      dropFootprint(x, y, stepCount % 2 === 0, angle);
    }

    // Check if 10 seconds have passed
    if (progress >= totalDuration) {
      removeLoader();
      return;
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  function removeLoader() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    const loader = document.querySelector(".loader-container");
    if (loader) {
      // Add fade-out class to trigger CSS transition
      loader.classList.add("fade-out");
      // Remove from DOM after fade completes
      setTimeout(() => {
        if (loader.parentNode) {
          loader.remove();
        }
      }, 500);
    }
  }

  function dropFootprint(x, y, isRight, angle) {
    const print = document.createElement("div");
    print.className = "footprint";
    print.innerHTML = isRight ? rightPath : leftPath;

    print.style.left = `${x}%`;
    print.style.top = `${y}%`;

    // Perpendicular offset logic
    // We convert the path angle to radians to calculate the "sideways" push
    const offset = 25;
    const rad = (angle + 90) * (Math.PI / 180); // Perpendicular angle

    const translateX = isRight
      ? Math.cos(rad) * offset
      : -Math.cos(rad) * offset;
    const translateY = isRight
      ? Math.sin(rad) * offset
      : -Math.sin(rad) * offset;

    // Combine the path angle with the offset
    print.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${angle + 90}deg)`;

    stage.appendChild(print);
    setTimeout(() => print.remove(), 5000);
  }

  animate();
}

// Start loader when DOM is ready
document.addEventListener("DOMContentLoaded", initLoader);
