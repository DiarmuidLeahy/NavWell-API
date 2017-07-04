# NavWell
NavWell is a Virtual Reality framework to determine memory and spatial navigation abilities. There are three distinct parts of the software;

  - The API which handles all interactions with the database
  - The [NavWell Administrator Console](https://github.com/DiarmuidLeahy/NavWell-Admin-Console "GitHub Repo") which is the interface allowing users to customize experiments and view results
  - A [Virtual Reality application](https://github.com/DiarmuidLeahy/NavWell-VR "GitHub Repo") requiring [Oculus Rift](https://www.oculus.com/rift/ "Oculus website") 


## Requirements and Dependencies

### Software
The following tools are required before the installation of NavWell
  
  - [Node.js v6.11.0](https://nodejs.org/dist/v6.11.0/node-v6.11.0-x64.msi "Latest version")
  - [Python v2.7.13](https://www.python.org/ftp/python/2.7.13/python-2.7.13.msi "Legacy version")
  - [Ruby v2.3.3](https://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.3.3-x64.exe "2.3.3")
  - [Visual C++ Build Tools 2015](http://landinghub.visualstudio.com/visual-cpp-build-tools "2015")
  - [Git v2.13.2](https://git-scm.com/download/win "2.13.2")
  - [MongoDB v3.4.5](https://www.mongodb.com/download-center "2.3.4")
  
  
## Installing the NavWell API

Once each of the above dependencies are installed, you're ready to download and install the NavWell API.
Open a command prompt window and run the following commands:

  1. `git clone https://github.com/DiarmuidLeahy/NavWell-API.git navwell/api`
  2. `cd navwell/api`
  3. `npm install -g bower`
  4. `npm install -g grunt`
  5. `npm install -g grunt-cli`
  6. `npm config set msvs_version 2015 -global`
  7. `npm install bcrypt -save`
  8. `npm install`

## Running the service

Now before we can start using the software, we must first set up our database. To do this we need to open a new command prompt window and navigate to `"C:\Program Files\MongoDB\Server\3.4\bin"` and run:
```
mongod
```
If you see a message to the effect of `[thread1] waiting for connections on port 27017 `, the service is performing correctly. Leave this window open and open a new command prompt. From here, navigate to where you installed the API ("navwell/api" or similar) and run
```
node app
```
And that's it! The server is now up and running and you're ready to download the [NavWell Administrator Console](https://github.com/DiarmuidLeahy/NavWell-Admin-Console) 
