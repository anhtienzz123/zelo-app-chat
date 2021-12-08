pipeline {

  agent any
  environment {
    DOCKER_IMAGE = "zeloappchat/zelo-nodejs"
    DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
  }

  stages {
      
    stage("build") {
            
        steps {
        
        withDockerRegistry(credentialsId: 'zeloappchat-dockerhub', url: 'https://index.docker.io/v1/') {
            
            sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} . "
            sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
            sh "docker push ${DOCKER_IMAGE}:latest"

        }    

            //clean to save disk
            sh "docker image rm -f ${DOCKER_IMAGE}:${DOCKER_TAG}"
            sh "docker image rm -f ${DOCKER_IMAGE}:latest"
            sh "docker image prune -f"

        }

    }
	  
    stage("ssh"){
            
        steps {
                
        sshPublisher(publishers: [sshPublisherDesc(configName: 'zelo-do-server', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: """cd /home/tienhuynh
            docker-compose stop zelo-nodejs
            docker-compose rm -f
            docker-compose pull zelo-nodejs
            docker-compose up -d
            docker image prune -f""", execTimeout: 120000000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
        }
    } 

  }

}