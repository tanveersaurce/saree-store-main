pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "tanveeraws/saree-backend"
        FRONTEND_IMAGE = "tanveeraws/saree-frontend"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t saree-backend:test .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t saree-frontend:test .'
                }
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'YOUR_DOCKER_CREDENTIAL_ID',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                docker tag saree-backend:test ${BACKEND_IMAGE}:${IMAGE_TAG}
                docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                docker tag saree-frontend:test ${FRONTEND_IMAGE}:${IMAGE_TAG}
                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}