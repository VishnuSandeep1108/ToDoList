# ToDoList
This is a simple ToDoList made using NodeJS, Express, MongoDB. This application allows you to 
* Create new tasks
* Read existing tasks
* Update existing tasks
* Delete completed tasks
* Create new lists for each occassion

# Features
* Create Custom Lists using Express Routing
* Add new tasks to existing tasks
* Edit existing tasks
* Delete tasks from list upon checking

# Setup
1. Clone this repository to your local machine
   
    ```
    git clone https://github.com/VishnuSandeep1108/ToDoList.git
    ```
2. Get into the ToDoList Folder you have cloned
   ```
   cd ToDoList
   ```
3. Install necessary dependencies
   ```
   npm install
   ```
4. Run `app.js`
   ```
   node app.js
   ```
5. Open `localhost:3000` in browser
   ```
   http://localhost:3000
   ```
# Usage
* Enter the task in the input field and click on **`+`** button beside it to add task to the list
* Click on the  `pencil` icon next to the task to edit it
* Check the box beside the task to mark it complete and delete from the list
* Enter name of the custom list after `http://localhost:3000/` to create custom list
  * Example:  
  
  * ```
    http://localhost:3000/workList
    ``` 
