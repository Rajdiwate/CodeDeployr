# TODO

    1. detect the tech used in the repository
        1. Create a http-microservie (Cloner) which will be responsible for cloning the repo and storing it in a cache(redis)
        2. create an end point (/detect-framework) which will clone the repo , store in redis , detech the framework, return the details
        3. create an endpoint(/project/create) which  should take the repo from redis(if exists) , store in s3 , create project in db
            a. If the project type is frontend , produce the event to kafka topic(deploy-frontend)
            b. produce event to kafka topic(deploy-backend)

        FLOW ==>
            1. As soon as repos are fetched from github , do an api call to Cloner service on /detect-framework to get the framework of the repo
            2. When user clicks on the import button , show him the page to enter details like env  , branch , etc
            3. On clicking the deploy button , do an api call to Cloner service on project/create




    4. aftet user clicks on one of his repos , show him popup or navigate to a new page in which he should provide the necessary details
        to run the repo (environment variables , path to docker file , run command if if docker file is not present , etc)
    5. on the popup ,  give user a button to click. after which the deployment of the repo should start
