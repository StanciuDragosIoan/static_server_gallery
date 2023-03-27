const os = require("os");
const fs = require("fs");
const path = require("path");
const busboy = require('busboy');

const styles = {
  card: `
        text-align:center;
        padding: 1rem;
        display:block;
        margin: 1rem auto; 
        margin-top:2rem;
        width:60%;
        max-width:600px;
        border: 5px solid #bbb;
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        
        
        `,
  text: `
          font-weight:900;
          text-align:center;
        `,
  formStyles: `
           display:block; 
              margin:auto; 
              margin-top:1rem;
              padding:2rem; 
              font-size:1rem; 
              background: #ddd; 
              border: 2px solid #000; 
              border-radius:5px;
              max-width:600px;
        `,
  header: `
          text-align:center;
          width:30rem;
          display:block;
          margin:auto;
          padding:3rem;
          background: blue;
          color: #fff;
        `,
};

const imageUploader = {
  displayWelcomeScreen: (res) => {
    res.write(`
                  <div style="${styles.card}">
                      <h1>
                        Welcome to the image uploader
                      </h1>
                      <p 
                        style="${styles.text}">
                        An app to manage your gallery of pictures
                      </p>
                  </div>
                  `);
  },

  displayUploadForm: (res) => {
    res.write(`
          <style>
            .btn:hover {
              background: #000;
              color:#ccc;
              border: 2px solid #ccc!important;
            }
            
            .file-input  {
              display: block;
              margin:auto;
              width: 15rem;
              padding:1rem;
            }
          </style>
          <h1 style="${styles.text}">Upload Image</h1>
            <form 
              style="${styles.formStyles}" 
              action="/image-uploader" 
              method="post" 
              enctype="multipart/form-data"
            >
                    <input 
                      class="file-input" 
                      type="file"  
                      name="filefield"
                    <br />
                    <input 
                      class="btn" 
                      style="${imageUploader.uploadBtn}" 
                      type="submit" 
                      value="Upload img"
                    >
            </form>
            `);
  },

  uploadBtn: `
          display:block!important;
          margin:auto!important;
          margin-top:2rem!important;
          width:15rem;
          font-size: 2rem;
          border: 2px solid #000;
          border-radius:5px; 
        `,

  header: ` 
          text-align:center;
        `,

uploadImage: (req, res) => {
    const bb = busboy({ headers: req.headers });
    bb.on("file", (name, file, info) => {
      //validation allowing only for .png/.jpg pictures
      const mimetypes = ["image/jpeg", "image/png"];
      const { filename, encoding, mimeType } = info;

      if (!mimetypes.includes(mimeType)) {
        return res.end("Please upload only .jpg or .png files");
      }

      const uploadDirectory = "./uploads";
      //create directory if it does not exist
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory);
      }
      //assign id to image
      const id = Math.random().toString(12).substring(2, 17);
      const saveTo = path.join(__dirname, "uploads", path.basename(`${id}.jpg`));
      file.pipe(fs.createWriteStream(saveTo));
    });

    bb.on("close", function () {
      return res.end(`
                    <h1 
                      style="${imageUploader.header}"
                    >File uploaded successfully</h1>
                  <script>
                  //redirect to index.html after upload
                    setTimeout(()=> {
                      window.location.href = "http://localhost:5555/index.html";
                    }, 2000);
                  </script>
                    `);
    });
    return req.pipe(bb);
  },
};

module.exports = imageUploader;
