'use strict';

// Check if the device is a touch device
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Open Window Function
function openWindow(windowId) {
  const windowElement = document.getElementById(windowId);

  // If window was minimized, remove the minimized state
  if (windowElement.classList.contains('minimized')) {
    windowElement.classList.remove('minimized');
  }

  windowElement.style.display = 'flex'; // Reset display property to make window visible
  // Force reflow to ensure the transition occurs
  windowElement.offsetHeight; // Trigger a reflow
  windowElement.classList.add('show');
  windowElement.style.zIndex = getMaxZIndex() + 1;
}

// Close Window Function
function closeWindow(event) {
  event.preventDefault();
  event.stopPropagation();
  const windowElement = event.currentTarget.closest('.window');
  windowElement.classList.remove('show');
  windowElement.classList.remove('maximized'); // Remove maximized state if any
  setTimeout(() => {
    windowElement.style.display = 'none';
  }, 300); // Duration matches the CSS transition
}

// Minimize Window Function
function minimizeWindow(event) {
  event.preventDefault();
  event.stopPropagation();
  const windowElement = event.currentTarget.closest('.window');
  windowElement.classList.remove('show');
  windowElement.classList.remove('maximized'); // Remove maximized state if any
  windowElement.classList.add('minimized');
  setTimeout(() => {
    windowElement.style.display = 'none';
  }, 300); // Duration matches the CSS transition
}

// Maximize/Restore Window Function
function maximizeWindow(event) {
  event.preventDefault();
  event.stopPropagation();
  const windowElement = event.currentTarget.closest('.window');
  if (!windowElement.classList.contains('maximized')) {
    // Save current position and size
    windowElement.dataset.prevLeft = windowElement.style.left;
    windowElement.dataset.prevTop = windowElement.style.top;
    windowElement.dataset.prevWidth = windowElement.style.width;
    windowElement.dataset.prevHeight = windowElement.style.height;

    // Maximize the window
    windowElement.style.left = '0';
    windowElement.style.top = '0';
    windowElement.style.width = '100%';
    windowElement.style.height = '100%';
    windowElement.classList.add('maximized');
  } else {
    // Restore previous position and size
    windowElement.style.left = windowElement.dataset.prevLeft;
    windowElement.style.top = windowElement.dataset.prevTop;
    windowElement.style.width = windowElement.dataset.prevWidth;
    windowElement.style.height = windowElement.dataset.prevHeight;
    windowElement.classList.remove('maximized');
  }
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

// Function to handle button clicks/touches
function handleWindowButtonEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  const button = event.currentTarget;

  if (button.classList.contains('close-btn')) {
    closeWindow(event);
  } else if (button.classList.contains('minimize-btn')) {
    minimizeWindow(event);
  } else if (button.classList.contains('maximize-btn')) {
    maximizeWindow(event);
  }
}

// Event Listeners for Window Buttons
document.querySelectorAll('.window-buttons span').forEach(button => {
  button.addEventListener('click', handleWindowButtonEvent);
  button.addEventListener('touchstart', handleWindowButtonEvent, { passive: false });
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
    const windowElement = document.getElementById(windowId);

    // If the window is minimized, restore it
    if (windowElement.classList.contains('minimized')) {
      windowElement.classList.add('show');
      windowElement.classList.remove('minimized');
      windowElement.style.display = 'flex';
      windowElement.style.zIndex = getMaxZIndex() + 1;
    } else if (!windowElement.classList.contains('show')) {
      // If the window is not open, open it
      openWindow(windowId);
    } else {
      // If the window is already open and not minimized, bring it to front
      windowElement.style.zIndex = getMaxZIndex() + 1;
    }
  });
});

// Hide Loading Screen After Page Load
window.addEventListener('load', () => {
  // Delay to allow the progress bar animation to complete
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    // Remove the loading screen from the DOM after the fade-out
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500); // Duration matches the CSS transition
  }, 3500); // Adjust this delay to match the progress bar animation duration

  // Show the notification after the loading screen hides
  setTimeout(() => {
    showNotification();
  }, 4000); // Adjusted to occur after the loading screen hides
});
