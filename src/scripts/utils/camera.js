
let currentStream = null;

export const initCamera = async (videoId) => {
  const video = document.getElementById(videoId);
  if (!video) {
    console.error(`Element video dengan id '${videoId}' tidak ditemukan.`);
    return;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  currentStream = stream;
  video.srcObject = stream;
};

export const stopCamera = () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
    const video = document.getElementById("camera");
    if (video) {
      video.srcObject = null;
    }
  } else {
  }
};

export const captureImage = (videoId, canvasId) => {
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};
