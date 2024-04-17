
// https://www.w3schools.com/php/php_file_upload.asp
// https://www.codingnepalweb.com/file-upload-with-progress-bar-html-javascript/

const form = document.querySelector("form"),
      fileInput = document.querySelector(".file-input"),
      progressArea = document.querySelector(".progress-area"),
      uploadedArea = document.querySelector(".uploaded-area"),
      othersArea = document.querySelector(".others-area");

const selfocus = "var inp=this; setTimeout(function(){inp.select();},10);";

function uploadFile(name, filename) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "upload.php");

    xhr.upload.addEventListener("progress", async ({loaded, total}) => {
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
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
              <div class="content upload">
                <div class="details">
                  <span class="name">${name} • Uploaded</span>
                  <span class="size">${fileSize}</span><br>
                  <div id="pdf"></div>
                  <br><pre style="background: black; color: white" id="log"></pre>
                </div>
              </div>
            </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.innerHTML = uploadedHTML;
            document.getElementById("log").innerHTML = "Processing...";
        }
    });

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const url = location.href + "/files/" + encodeURI(filename).replace(".zip", ".pdf");
            try {
                document.getElementById("log").innerHTML =
                    xhr.responseText.split("LOG:")[1].trim();
                if (xhr.responseText.split("LOG:")[2].trim() == "OK") {
                    document.getElementById("pdf").innerHTML = `
                      <iframe style="width: 100%; height: 30vh" src="${url}"></iframe>
                      <br>
                      <textarea class="url" readonly onfocus="${selfocus}">${url}</textarea>
                      <a class="go" href="${url}">OPEN</a>`;
                }
            } catch (_) {}
        }
    };

    let data = new FormData(form);
    xhr.send(data);
}

function listFiles() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "list.php");
    xhr.onreadystatechange = function() {
        if (this.readyState != 4 || this.status != 200) {
            return;
        }
        const files = xhr.responseText.trim().split("\n");
        console.log("RES", files);

        for (let name of files) {
            const url = location.href + "/files/" + encodeURI(name);
            othersArea.innerHTML += `<li class="row">
              <div class="content upload">
                <div class="details">
                  <span class="name">${name} • Uploaded</span>
                  <textarea class="url" readonly onfocus="${selfocus}">${url}</textarea>
                  <a class="go" href="${url}">OPEN</a>
                </div>
              </div>
            </li>`;;
        }
    };
    xhr.send();
}

function main() {
    form.addEventListener("click", () => fileInput.click());
    fileInput.onchange = ({target}) => {
        let file = target.files[0];
        if (file) {
            uploadFile(file.name, file.name);
        }
    };

    listFiles();
}

main();
