const request = require('request');
const fs = require('fs');
const readline = require('readline');

const url = process.argv[2];
const localPath = process.argv[3];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const overWriteFile = (localPath, body) => {
  fs.stat(localPath, function (err, stat) {
    if (err == null) {
      rl.question('File exists. Do you want to overwrite? (Y/N)', (answer) => {
        console.log('answer', answer);
        if (answer === 'Y') {
          console.log(`Overwriting ${localPath}`);
          writeFile(localPath, body);
          rl.close();
        } else if (answer === 'N') {
          console.log("Not overwriting... ending process");
          process.exit();
        }
        else {
          console.log("Invalid input");
          process.exit();
        }
      }
      )
    } else if (err.code === 'ENOENT') {
      writeFile(localPath, body);
    }
    
  });
}

const writeFile = (path, download) => {
  fs.writeFile(path, download, err => {
    if (err.code === 'ENOENT') {
      console.log("File path invalid, please try again!")
      rl.close();
      return;
    } else if (err){
      console.log(err);
      rl.close();
      return;
    }
    rl.close();
    console.log(`Downloaded and saved ${download.length} bytes to ${localPath}`);
  });
}

request(url, (error, response, body) => {

  if (error.code === 'ENOTFOUND') {
    console.log("URL not found, please try again");
    rl.close();
    return;
  } else if (error) {
    console.log(error);
    rl.close();
    return;
  }
  //console.log('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.
  overWriteFile(localPath,body);
  
});

