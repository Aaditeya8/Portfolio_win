'use strict';

// Check if the device is a touch device
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Open Window Function
function openWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  windowElement.style.display = 'flex'; // Reset display property to make window visible
  // Force reflow to ensure the transition occurs
  windowElement.offsetHeight; // Trigger a reflow
  windowElement.classList.add('show');
  windowElement.style.zIndex = getMaxZIndex() + 1;
}

function closeWindow(event) {
  const windowElement = event.target.closest('.window');
  windowElement.classList.remove('show');
  setTimeout(() => {
    windowElement.style.display = 'none';
  }, 300); // Duration matches the CSS transition
}

// Get Maximum z-index Value
function getMaxZIndex() {
  let maxZ = 0;
  document.querySelectorAll('.window').forEach(win => {
    const z = parseInt(window.getComputedStyle(win).zIndex) || 0;
    if (z > maxZ) maxZ = z;
  });
  return maxZ;
}

// Event Listeners for Desktop Icons
document.querySelectorAll('.icon').forEach(icon => {
  if (isTouchDevice()) {
    // For touch devices, use single tap (click) to open windows
    icon.addEventListener('click', () => {
      const windowId = icon.getAttribute('data-window');
      openWindow(windowId);
    });
  } else {
    // For non-touch devices, keep double-click to open windows
    icon.addEventListener('dblclick', () => {
      const windowId = icon.getAttribute('data-window');
      openWindow(windowId);
    });
  }
});

// Event Listeners for Dock Icons
document.querySelectorAll('.dock-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const windowId = icon.getAttribute('data-window');
    openWindow(windowId);
  });
});

// Event Listeners for Window Close Buttons
document.querySelectorAll('.close-btn').forEach(button => {
  button.addEventListener('click', closeWindow);
});

// Bring Window to Front on Click or Touch
document.querySelectorAll('.window').forEach(windowElement => {
  windowElement.addEventListener('mousedown', () => {
    windowElement.style.zIndex = getMaxZIndex() + 1;
  });

  windowElement.addEventListener('touchstart', () => {
    windowElement.style.zIndex = getMaxZIndex() + 1;
  });
});

// Draggable Windows
let isDragging = false;
let dragElement = null;
let offset = { x: 0, y: 0 };

function makeDraggable(element) {
  const header = element.querySelector('.window-header');

  // Mouse events
  header.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    dragElement = element;
    offset.x = element.offsetLeft - e.clientX;
    offset.y = element.offsetTop - e.clientY;
    element.style.zIndex = getMaxZIndex() + 1;
    document.body.style.userSelect = 'none';
  });

  // Touch events
  header.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    dragElement = element;
    const touch = e.touches[0];
    offset.x = element.offsetLeft - touch.clientX;
    offset.y = element.offsetTop - touch.clientY;
    element.style.zIndex = getMaxZIndex() + 1;
    document.body.style.userSelect = 'none';
  }, { passive: false });
}

// Event listeners for dragging (global)
document.addEventListener('mousemove', (e) => {
  if (isDragging && dragElement) {
    e.preventDefault();
    dragElement.style.left = (e.clientX + offset.x) + 'px';
    dragElement.style.top = (e.clientY + offset.y) + 'px';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  dragElement = null;
  document.body.style.userSelect = 'auto';
});

document.addEventListener('touchmove', (e) => {
  if (isDragging && dragElement) {
    e.preventDefault();
    const touch = e.touches[0];
    dragElement.style.left = (touch.clientX + offset.x) + 'px';
    dragElement.style.top = (touch.clientY + offset.y) + 'px';
  }
}, { passive: false });

document.addEventListener('touchend', () => {
  isDragging = false;
  dragElement = null;
  document.body.style.userSelect = 'auto';
});

// Apply Draggable Function to All Windows
document.querySelectorAll('.window').forEach(windowElement => {
  makeDraggable(windowElement);
});

// Show Notification Function
function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.add('show');

  // Hide the notification after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

// Hide Notification Function
function hideNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('show');
  notification.classList.add('hide');

  // Remove the hide class after the animation completes
  setTimeout(() => {
    notification.classList.remove('hide');
  }, 500); // Duration matches the CSS animation
}

// Trigger the notification after a delay (e.g., 3 seconds after page load)
window.addEventListener('load', () => {
  setTimeout(() => {
    showNotification();
  }, 3000);
});
