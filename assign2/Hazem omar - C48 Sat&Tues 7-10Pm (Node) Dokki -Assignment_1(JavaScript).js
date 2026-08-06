// part1
// q1
const path = () => {
  console.log({
    file: __filename,
    dir: __dirname,
  });
};
path();
//===============================================
//q2
const pathh = require("path");
let getFileName = (filepath) => {
  return pathh.basename(filepath);
};
console.log(getFileName("/user/files/report.pdf"));
//===============================================
// q3

const pathhh = require("path");
const biuldPath = (obj) => {
  return pathhh.format(obj);
};
console.log(
  biuldPath({
    dir: "/folder",
    name: "app",
    ext: ".js",
  }),
);
//===============================================
// q4
const p = require("path");
let getextension = (filepath) => {
  return p.extname(filepath);
};
console.log(getextension("/docs/readme.md"));
//===============================================
// q5
const Path = require("path");
let getfileinfo = (filepath) => {
  const { name, ext } = Path.parse(filepath);
  return { name, ext };
};
console.log();
console.log(getfileinfo("/home/app/main.js"));

//===============================================
// q6
const paath = require("path");
let absolutepath = (filepath) => {
  return paath.isAbsolute(filepath);
};
console.log(absolutepath("/home/user/file.txt"));
//===============================================
// Q7
const path1 = require("path");
let joinPath = (...segments) => {
  return path1.join(...segments);
};
console.log(joinPath("src", "components", "App.js"));
//===============================================
// Q8
const path2 = require("path");
let resolvePath = (relativePath) => {
  return path2.resolve(relativePath);
};
console.log(resolvePath("./index.js"));
//===============================================
// Q9
const path3 = require("path");
let joinTwoPaths = (path1, path2) => {
  return path3.join(path1, path2);
};
console.log(joinTwoPaths("/folder1", "folder2/file.txt"));
//===============================================
// Q10
const fs = require("fs");
const path8 = require("path");
let deletefile = (filepath) => {
  fs.unlink(filepath, (err) => {
    if (err) {
      console.log(err.message);
    }
    console.log(`${path8.basename(filepath)} is deleted.`);
  });
};
deletefile("/path/to/file.txt");
//===============================================
// Q11
let createfolder = (foldername) => {
  try {
    fs.mkdirSync(foldername);
    console.log("success");
  } catch (err) {
    console.log(err.message);
  }
};
createfolder("./newFolder");
//===============================================
// Q12
const eventemitter = require("events");
const emitter = new eventemitter();
emitter.on("start", () => {
  console.log("welcome event triggered");
});
emitter.emit("start");

//===============================================
// Q13
const eventemit = require("events");
const event = new eventemit();
event.on("login", (username) => {
  console.log(`user logged in :${username}`);
});
event.emit("login", "Ahmed");
//===============================================
// Q14
const fssss = require("fs");
let readfile = (filepath) => {
  const data = fs.readFileSync(filepath, "utf8");
  console.log(data);
};
readfile("./notes.txt");

//===============================================
// Q15
const fss = require("fs");
let writefile = (filepath, content) => {
  fss.writeFile(filepath, content, (err) => {
    if (err) {
      console.log(err.message);
    }
    console.log("file saved successfully ");
  });
};
writefile("./async.txt", "Async save");
//===============================================
// Q16
const FS = require("fs");
let checkdirectory = (path) => {
  return FS.existsSync(path);
};
console.log(checkdirectory("./notes.txt"));
//===============================================
// Q17
const os = require("os");
const { error } = require("console");
let getOsInfo = () => {
  return {
    platform: os.platform(),
    architecture: os.arch(),
  };
};
console.log(getOsInfo());
//===============================================
// Q18
const fsa = require("fs");

function readFileChunks(filePath) {
  const readableStream = fs.createReadStream(filePath, {
    encoding: "utf8",
  });

  readableStream.on("data", (chunk) => {
    console.log(chunk);
  });

  readableStream.on("end", () => {
    console.log("Finished reading file");
  });

  readableStream.on("error", (err) => {
    console.log(err.message);
  });
}

readFileChunks("./big.txt");
//===============================================
// Q19

let copyfile = (source, dest) => {
  const readableStream = fs.createReadStream(source);
  const writableStream = fs.createWriteStream(dest);
  readableStream.on("data", (chunk) => {
    writableStream.write(chunk);
  });
  readableStream.on("end", () => {
    console.log("File copied successfully");
  });
  readableStream.on("error", (err) => {
    console.log(err.message);
  });
};
copyfile("./source.txt", "./dest.txt");
//===========================================
// Q20
const fsssss = require("fs");
const zlib = require("zlib");
const { pipeline } = require("stream");

function compressFile(source, destination) {
  pipeline(
    fsssss.createReadStream(source),
    zlib.createGzip(),
    fsssss.createWriteStream(destination),
    (err) => {
      if (err) {
        console.log(err.message);
        return;
      }

      console.log("File compressed successfully");
    },
  );
}

compressFile("./data.txt", "./data.txt.gz");
// ===========================================================
