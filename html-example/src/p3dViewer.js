class P3DViewer {
  constructor(container) {
    this.container = container;
    this.images = [];
    this.framesPerAngle = 36;  // Number of frames for horizontal rotation
    this.verticalAngles = 10;  // Total vertical angles (from 0° to 90°)
    this.currentFrame = 0;  // Current frame for horizontal rotation
    this.currentAngle = 0;  // Current vertical angle
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.accumulatedDeltaX = 0;
    this.accumulatedDeltaY = 0;

    // Create an image element for displaying the frames
    this.viewerElement = document.createElement('img');
    this.container.appendChild(this.viewerElement);

    // Add event listeners for drag rotation
    this.addEventListeners();

    // Prevent default drag behavior
    this.viewerElement.addEventListener('dragstart', (event) => event.preventDefault());
  }

  resetViewer() {
    this.images = [];
    this.currentFrame = 0;
    this.currentAngle = 0;
    this.viewerElement.src = ''; // Reset the image source
  }

  addEventListeners() {
    this.container.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        this.accumulatedDeltaX = 0;
        this.accumulatedDeltaY = 0;
      }
    });

    window.addEventListener('mousemove', (event) => this.handleDrag(event));
    window.addEventListener('mouseup', () => (this.isDragging = false));
  }

  handleDrag(event) {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.lastMouseX;
    const deltaY = event.clientY - this.lastMouseY;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    this.accumulatedDeltaX += deltaX;
    const horizontalThreshold = 30;
    if (Math.abs(this.accumulatedDeltaX) > horizontalThreshold) {
      const frameChange = Math.sign(this.accumulatedDeltaX);
      this.updateHorizontalFrame(frameChange);
      this.accumulatedDeltaX = 0;
    }

    this.accumulatedDeltaY += deltaY;
    const verticalThreshold = 30;
    if (Math.abs(this.accumulatedDeltaY) > verticalThreshold) {
      const angleChange = Math.sign(this.accumulatedDeltaY);
      this.updateVerticalAngle(angleChange);
      this.accumulatedDeltaY = 0;
    }
  }

  updateHorizontalFrame(frameChange) {
    const totalFrames = this.framesPerAngle;
    this.currentFrame = (this.currentFrame - frameChange + totalFrames) % totalFrames;
    this.updateFrame();
  }

  updateVerticalAngle(angleChange) {
    const totalAngles = this.verticalAngles;  // Fixed vertical angle range (0 to 9)
    this.currentAngle = (this.currentAngle + angleChange + totalAngles) % totalAngles;  // Loop the angles correctly
    this.updateFrame();
  }

  updateFrame() {
    const frameIndex = (this.currentAngle * this.framesPerAngle) + this.currentFrame;
    if (this.images.length > 0 && this.images[frameIndex]) {
      this.viewerElement.src = this.images[frameIndex];
    }
  }

  loadP3DFromData(data) {
    const jszip = new JSZip();
    jszip.loadAsync(data).then((zip) => {
      zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.name.match(/\.(png|jpg|jpeg)$/i)) {
          zipEntry.async('blob').then((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            this.images.push(imageUrl);
            if (this.images.length === 1) {
              this.updateFrame();
            }
          });
        }
      });
    });
  }
}

const uploadSection = document.getElementById('uploadSection');
const viewerSection = document.getElementById('viewerSection');
const uploadInput = document.getElementById('uploadInput');
const backArrow = document.getElementById('backArrow');
const viewerContainer = document.getElementById('viewer');

const viewer = new P3DViewer(viewerContainer);

uploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      viewer.loadP3DFromData(e.target.result);
      uploadSection.classList.remove('active');
      viewerSection.classList.add('active');
    };
    reader.readAsArrayBuffer(file);
  }
});

backArrow.addEventListener('click', () => {
  viewerSection.classList.remove('active');
  uploadSection.classList.add('active');
  viewer.resetViewer(); // Reset the viewer when going back
});