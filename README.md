# TODO

    1. cloner ms will  publish to deploy-request topic and send the project details.
    2. the deployr ms will listen to "deploy-request" and based on the type of the project(frontend/static) , will process the project and deploy it.
        a. If the project is static , then send him the link of the index.html present in the s3 bucket.

     Give user a retry button on the projects modal to retry the deployment when the deployment has failed or if there are no deployments started yet.
     Create an api for that which will check if theere is already a deployment that is in progress and if not the initiate a new one.

    1. Remove console logs
