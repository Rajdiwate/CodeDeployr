# TODO

    1. Place the create project endpoint in  nextjs api route.
    2. create project in db , show uer a popup that project deployment is in progress
    3. publish to "clone-request" topic of kafka
    4. cloner ms will listen to "clone request" topic and clone the repo , make zip , store in s3 , updae the status in db , publish to deploy-request topic.
    5. the deployr ms will listen to "deploy-request" and based on the type of the project(frontend/static) , will process the project and deploy it.



    1. Remove console logs
