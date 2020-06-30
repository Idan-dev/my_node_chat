# Chat with Node.js

Here a project of mine: developping a chat with Node.js / Express.js, Socket.io and MongoDB. The aim is to show my ability to develop a web application while gaining skill at doing it.

## Getting Started

Follow these instructions to get a copy of the project on your computer.

### Prerequisites

First, you need to have Node.js installed on your computer.

You can download it directly from [Node official website](https://nodejs.org/en/download/).

Then, you need to have an accessible MongoDB cluster. You can have one by signing in for a free account on [MongoDB official website](https://mongodb.com). 

### Installing

Create a new repository, for example, 'testing_chat' repository. Inside it, create two other repository: one called 'backend', and the other 'frontend'. Try to keep the exact spelling, for it is important to run the chat correctly.

Start by cloning 'Idan-dev/my_node_chat' repository to your local 'backend' repository. Also clone 'Idan-dev/my_node_chat_front' into your local 'frontend' repository.

Then, using the command line, go into the corresponding repository on your computer using `cd`. 

As an example, you could start by going into your 'backend' repository like this (remember that you will need to go into both):
```
cd C://my_path/backend
```

Now, run the `npm install` command directly in your 'backend' / 'frontend' repository. Do both, backend and frontend, for the chat to run smoothly.

Meanwhile, you can prepare your database, as it will be needed for the application to work.

Connect into your MongoDB account, and prepare a database to recieve data from the chat. To do so, in the chosen database ('chat' for example), make a new document called 'serverStatus'. The document should correspond with the file found in 'backend/models/serverStatus.js', I will now start to explain how to achieve it. 

Give your serverStatus document three properties:
- a 'name' property, that will have a String, in which you have to write 'Server Status' as a given value;
- a 'usersOnline' property, that will be given an Array;
- a 'usersOnlineNumber' property, that will be given an Integer ('Int32'), to which you can start by giving a '0' value.

Please remember that the properties' name and value are case sensitive, and that you should do your best to get the spelling right for the application to run correctly.

Your document should look like this now:
```
id: automatically given by MongoDB
name: 'Server Status'
usersOnline: Array
usersOnlineNumber: 0
```

Once this is done, still on your MongoDB personal account page, get your cluster's connection link. 

But first, if you do not have already your database access configured, make a new database user with a username and a password that you should keep preciously noted somewhere you can find it back. To do so, click on 'Database Access' in your 'Security' menu on the left.

Then, in your 'Data Storage' menu, click on 'Clusters', then on 'Connect' and then on 'Connect your application'. There, you should see your connection string to copy-paste in the chat application. I will tell you how to do so. For now, check that your connection string should look like this:
```
mongodb+srv://<your_username>:<your_password>@cluster0-m0tfq.gcp.mongodb.net/<your_chosen_database(for example 'chat')>?retryWrites=true&w=majority
```

The fields specified within '<>' should recieve the username, password and database previously set (see above).

When you have done so, go back in your local 'backend' repository. In it, make a '.env' file, as the project use dotenv module. Please that the file should be name exactly '.env' without recieving any name before the '.' . In your new '.env' file, you should write two paramaters: 'MONGOLAB_URI' and 'TOKEN'; with two values: one being the connection string correctly filled with your username, password and database, the other one being a token for authentification (you can wall it "myToken", that will not affect the chat efficiency).

Paramaters and values should be joined together with a '=' without space in between, and values only should be between quotation marks, so the result should look like this:
```
MONGOLAB_URI='mongodb+srv://<your_username>:<your_password>@cluster0-m0tfq.gcp.mongodb.net/<your_chosen_database(for example 'chat')>?retryWrites=true&w=majority'
TOKEN='myToken'
```

Once you have done all this, your local repository should be correctly installed and configured and your database adequately set. 
