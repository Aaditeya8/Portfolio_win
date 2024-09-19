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
    icon.addEventListener('dblclick', () => {
      const windowId = icon.getAttribute('data-window');
      openWindow(windowId);
    });
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
  
  // Bring Window to Front on Click
  document.querySelectorAll('.window').forEach(windowElement => {
    windowElement.addEventListener('mousedown', () => {
      windowElement.style.zIndex = getMaxZIndex() + 1;
    });
  });
  
  // Draggable Windows
  function makeDraggable(element) {
    let isMouseDown = false;
    let offset = [0, 0];
  
    const header = element.querySelector('.window-header');
    header.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      offset = [
        element.offsetLeft - e.clientX,
        element.offsetTop - e.clientY
      ];
      element.style.zIndex = getMaxZIndex() + 1;
      document.body.style.userSelect = 'none';
    });
  
    document.addEventListener('mouseup', () => {
      isMouseDown = false;
      document.body.style.userSelect = 'auto';
    });
  
    document.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if (isMouseDown) {
        element.style.left = (e.clientX + offset[0]) + 'px';
        element.style.top = (e.clientY + offset[1]) + 'px';
      }
    });
  }
  
  // Apply Draggable Function to All Windows
  document.querySelectorAll('.window').forEach(windowElement => {
    makeDraggable(windowElement);
  });// Show Notification Function
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
  

