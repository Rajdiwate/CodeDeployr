# TODO

    1. the deployr ms will listen to "deploy-request" and based on the type of the project(frontend/static) , will process the project and deploy it.
        a. If the project is React ,
            1. get the zip file from s3 and store in local
            2. create a docker container with the volume mount to the zip file. (the docker container should be able to access the zip file).
            3. unzip the file inside the container and build the project
            4. the output folder should be commom for both the container and the local machine.
            5. Once the build is complete , destroy the container , store the build files in the s3 bucket.
            6.  Update the deployment status accordingly and store the deploymentUrl in db

     Give user a retry button on the projects modal to retry the deployment when the deployment has failed or if there are no deployments started yet.
     Create an api for that which will check if theere is already a deployment that is in progress and if not the initiate a new one.

    1. Remove console logs
