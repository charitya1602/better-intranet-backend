# Better Intranet Backend
This repositor is the backend for the Better Intranet Project.


The Aim of this project is to create a better UI for the intranet, the current UI is of the static Apache server.
## How to Install
In order to run this project you will need node v16. Clone this project and in the directory write the following commands.
```bash
  npm i
```
create a .env file with the following variables
```bash
DB_URI=#Your MongoDB URI here
SECRET=#Your Secret Key here
PORT=#Port for server here
```
After doing this you can run the server using
```bash
  npm run dev
```