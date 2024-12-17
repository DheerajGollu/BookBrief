# BookBrief
BookBrief is here to help users find their next great, amazing book(s) that could change their lives. This project makes it easy for users to discover new books, learn what they’re about, and get excited about reading again. It’s all about helping people build a fun and healthy reading habit while enjoying all the benefits that come with it, like learning new things, reducing stress, or just getting lost in a great story.

## Operation Platform
The project was designed to be a web application that runs on Windows.

## Programming languages
The system was implemented with multiple languages like React with Javascript for the front-end, Node.js and Express.js for the back-end.

## Libraries needed
The system uses multiple npm packages and dependencies. No specific external libraries need to be installed beyond the ones included in the project setup.

## Steps on how to run the system
### 1. Cloning the project
To clone the project, first open a terminal and go to a directory of your choice. Then run the command `git clone https://github.com/KevVvTheDev/BookBrief.git`. Then go inside the repository by running `cd BookBrief`.

### 2. Installing dependencies
After cloning the repository, install all the necessary dependencies that the project utilizes. Since this project uses npm, run the command `npm install`. It's IMPORTANT to note that the front-end(client-side) and the back-end(server) were separated into two different directories, both front-end and back-end directories contained it's own dependencies which you have to install for them separately. 

Now go inside the `client-side` directory by doing `cd client-side` and then install all the necessary dependencies by running `npm install`.
After that, back out the `client-side` directory by doing `cd ..` and then go to `server` directory by doing `cd server` and then run `npm install` again.

### 3. Running the application
To start the application, you need to start both the `client-side` and `server` directories. To run the UI and start the front-end, you need to navigate and be inside the `client-side` directory and run `npm run dev` command. Navigate to `localhost:5173` to see the front-end. To run the server and start the back-end, you need to navigate and be inside the `server` directory and run `npm run dev` command as well. Navigate to `localhost:8080` to see the back-end with a message that says `congrats you have reached the server!`. 

# THE_END!