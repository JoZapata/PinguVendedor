var videoModal = document.getElementById('videoModal');			// Get the modal
var videoBtn = document.getElementById("modalBtn");				// Get the button that opens the modal
var videoSpan = document.getElementsByClassName("close")[0];	// Get the <span> element that closes the modal
var video = document.getElementById("modalVideoPlayer");

// When the user clicks on the button, open the modal
videoBtn.onclick = function() {
    videoModal.style.display = "block";
    video.currentTime = 0;
    video.play();
}

function closeVideo() {
	video.pause();
    videoModal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
videoSpan.addEventListener("click",closeVideo);

// detect when the video finishes
video.addEventListener('ended',closeVideo,false);
