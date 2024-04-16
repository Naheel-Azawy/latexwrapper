
// https://www.w3schools.com/php/php_file_upload.asp
// https://www.codingnepalweb.com/file-upload-with-progress-bar-html-javascript/

const form = document.querySelector("form"),
      fileInput = document.querySelector(".file-input"),
      progressArea = document.querySelector(".progress-area"),
      uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => fileInput.click());

fileInput.onchange = ({target}) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        const max = 30;
        if (fileName.length >= max) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, max + 1) + "... ." + splitName[1];
        }
        uploadFile(fileName, file.name);
    }
};

function uploadFile(name, filename) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "upload.php");

    xhr.upload.addEventListener("progress", ({loaded, total}) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000);
        let fileSize;

        if (fileTotal < 1024)
            fileSize = fileTotal + " KB";
        else
            fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";

        let progressHTML = `<li class="row">
          <div class="content">
            <div class="details">
              <span class="name">${name} • Uploading</span>
              <span class="percent">${fileLoaded}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${fileLoaded}%"></div>
            </div>
          </div>
        </li>`;

        uploadedArea.innerHTML = "";
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;

        if (loaded == total) {
            const url = location.origin + "/files/" + encodeURI(filename).replace(".zip", ".pdf");
            const f = "var inp=this; setTimeout(function(){inp.select();},10);";
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
              <div class="content upload">
                <div class="details">
                  <span class="name">${name} • Uploaded</span>
                  <span class="size">${fileSize}</span><br>
                  <textarea class="url" readonly onfocus="${f}">${url}</textarea>
                  <a class="go" href="${url}">DOWNLOAD</a>
                  <br><pre style="background: black; color: white" id="log"></pre>
                </div>
              </div>
            </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.innerHTML = uploadedHTML;
        }
    });

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("RES", xhr.responseText);
            try {
                document.getElementById("log").innerHTML =
                    xhr.responseText.split("LOG:")[1].trim();
            } catch (_) {}
        }
    };

    let data = new FormData(form);
    xhr.send(data);
}
