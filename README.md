# CheffSquad

## Evarta
EVarta is a Smart remote-interaction platform being developed by team ***"CheffSquad"*** as a solution to the proble **"RK-61"** under **SIH-2020** floated by Bureau of Police Research and Development. 

### Structure of Repository
|File/Directory|Purpose|
|--------------|-------|
|WebApp|Contains source code for webapp version of the platform that runs on server|
|DesktopApp| Contains source code for Desktop-app of the platform with build instructions|
|Readme| Contains information about directory structre of the repository and general deployment instructions|

### How to run the platform
1. On your server machine clone this repository using `git clone https://github.com/Flx0101/CheffSquad.git` in your terminal/command prompt.
2. Enter the WebApp directory with `cd WebApp`
3. Install the dependancies with `npm install`
4. Run the server with `npm run start`
5. The platform server is now running on your machine on *port no:3000*
6. You can access the webapp by typing `localhost:3000`in your browser
7. This platform can be accessed within your local network by typing `http://$ipaddress_of_server:3000` put the local ip address of your server in place of "$ipaddress_of_server"(To access this over the internet, contact the team for instructions regarding the port-forwarding and domain name configuration)
9. Now that the platform is running, You can also use a desktop application for the same.
10. To do this first go to the root directory of the repo. Then `cd DesktopApp` .
11. Follow the instructions of running the desktop app in production or development mode given in the readme file in the directory.

### Pre-requisites
1. The machine must have latest version of NodeJs installed on a linux/windows environment
2. To run the DesktopApp you must first run the WebApp on your server or in local environment
