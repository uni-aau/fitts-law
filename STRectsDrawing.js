class STRectsDrawing {
  constructor(trial, trialNumber, Size, nums, onTargetClicked) {
    this.shape = trial.shape;
    this.startClicked = false;
    this.isTargetClicked = false;
    this.startIndex = trial.startIndex;
    this.targetIndex = trial.targetIndex;
    this.nums = nums;
    this.amplitude = trial.amplitude;
    this.startSize = trial.startSize;
    this.targetWidth = trial.targetWidth;
    this.targetHeight = trial.targetHeight;
    this.Size = Size;
    this.trialId = trial.trialId;
    this.trialDirection = trial.trialDirection;
    this.onTargetClicked = onTargetClicked;
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.trialNumber = trialNumber;
    this.intDevice = trial.intDevice;
  }

  showRects() {
      
    const canvas = document.getElementById("trialCanvas");
    const context = canvas.getContext("2d");

    let startSizePx = 0;

    let startX = 0;
    let startY = 0;
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    canvas.removeEventListener("click", this.handleCanvasClick);
    canvas.addEventListener("click", this.handleCanvasClick);
  
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const amplitudePx = mm2px(this.amplitude);
    const angle = (2 * Math.PI) / this.nums;
  
    context.strokeStyle = "black";
  
    startSizePx = mm2px(this.startSize);
  
    const startColor = "rgba(144, 238, 144, 0.8)";
    context.fillStyle = startColor;
  
    startX = centerX + amplitudePx * Math.cos(this.startIndex * angle);
    startY = centerY + amplitudePx * Math.sin(this.startIndex * angle);
  
    if (this.shape === "rectangle") {
      context.strokeRect(
        startX - startSizePx / 2,
        startY - startSizePx / 2,
        startSizePx,
        startSizePx
      );
      context.fillRect(
        startX - startSizePx / 2,
        startY - startSizePx / 2,
        startSizePx,
        startSizePx
      );
    } else if (this.shape === "circle") {
      context.beginPath();
      context.arc(startX, startY, startSizePx / 2, 0, 2 * Math.PI);
      context.stroke();
      context.fill();
    }
  
    const targetColor = "rgba(255, 102, 102, 0.8)";
    context.fillStyle = targetColor;
  
    const targetX = centerX + amplitudePx * Math.cos(this.targetIndex * angle);
    const targetY = centerY + amplitudePx * Math.sin(this.targetIndex * angle);
  
    if (this.shape === "rectangle") {
      this.targetWidthPx = mm2px(this.targetWidth);
      this.targetHeightPx = mm2px(this.targetHeight);
        
      context.strokeRect(
        targetX - this.targetWidthPx / 2,
        targetY - this.targetHeightPx / 2,
        this.targetWidthPx,
        this.targetHeightPx
      );
      context.fillRect(
        targetX - this.targetWidthPx / 2,
        targetY - this.targetHeightPx  / 2,
        this.targetWidthPx,
        this.targetHeightPx
      );
    } else if (this.shape === "circle") {
      targetSize = mm2px(this.targetWidth);
      context.beginPath();
      context.arc(targetX, targetY, targetSize / 2, 0, 2 * Math.PI);
      context.stroke();
      context.fill();
    }
    this.printToConsole();
  }
  

  handleCanvasClick(event) {
    const canvas = document.getElementById("trialCanvas");
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const amplitudePx = mm2px(this.amplitude);
    const angle = (2 * Math.PI) / this.nums;
  
    const startX = centerX + amplitudePx * Math.cos(this.startIndex * angle);
    const startY = centerY + amplitudePx * Math.sin(this.startIndex * angle);
    const targetX = centerX + amplitudePx * Math.cos(this.targetIndex * angle);
    const targetY = centerY + amplitudePx * Math.sin(this.targetIndex * angle);

    const startPx = mm2px(this.startSize);
    const targetWidthPx = mm2px(this.targetWidth); // Width of the target rectangle
    const targetHeightPx = mm2px(this.targetHeight); // Height of the target rectangle

    const distanceTotarget = Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
    const distanceToStart = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
  
    if (!this.startClicked && distanceToStart < startPx / 2) {
      // Clicked on the start 
      context.fillStyle = "rgba(0, 0, 139, 0.8)"; // Dark blue color
      

      context.beginPath();
      if (this.shape === "rectangle") {
        context.fillRect(targetX - targetWidthPx / 2, targetY - targetHeightPx / 2, targetWidthPx, targetHeightPx);
      } else if (this.shape === "circle") {
        const startSizePx = mm2px(this.startSize) / 2;
        context.arc( startX, startY, startSizePx, 0, 2 * Math.PI );
        context.fill();
      }
      this.startClicked = true;
    } else {
      // Clicked outside the start 
      const targetX = centerX + amplitudePx * Math.cos(this.targetIndex * angle);
      const targetY = centerY + amplitudePx * Math.sin(this.targetIndex * angle);

      const targetSize = this.shape === "rectangle"
        ? Math.max(mm2px(this.targetWidth), mm2px(this.targetHeight))
        : mm2px(this.targetWidth) / 2;
      const distanceToTarget = Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
  
      if (this.startClicked && !this.isTargetClicked && distanceToTarget < targetSize) {
        // Clicked on the target 
        context.beginPath();
        if (this.shape === "rectangle") {
          context.fillStyle = "rgba(0, 0, 139, 0.8)"; // Dark blue color for target 
          context.fillRect(
            targetX - this.targetWidthPX / 2,
            targetY - this.targetHeightPX / 2,
            this.targetWidthPX,
            this.targetHeightpX
          );
        } else if (this.shape === "circle") {
          context.fillStyle = "rgba(0, 0, 139, 0.8)"; // Dark blue color for target 
          context.arc(
            targetX,
            targetY,
            targetSize,
            0,
            2 * Math.PI
          );
          context.fill();
        }
        this.onTargetClicked();
        this.isTargetClicked = true;
      }

    }
  }
  
  printToConsole(){
    console.log(
      "Information from Drawing: " +
        "Trial Number: " + 
        this.trialNumber +
        " | Trial ID: " +
        this.trialId +
        " | Shape: " +
        this.shape +
        " | Interaction Device: " +
        this.intDevice +
        " | Start Size: " +
        this.startSize +
        " | Start Index: " +
        this.startIndex +
        " | Target Index: " +
        this.targetIndex +
        " | Amplitude: " +
        this.amplitude +
        " | Target Width: " +
        this.targetWidth +
        " | Target Height: " +
        this.targetHeight +
        " | Trail Direction: " +
        this.trialDirection
    );
  }
  
}

