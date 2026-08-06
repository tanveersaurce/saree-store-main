pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "tanveeraws/saree-backend"
        FRONTEND_IMAGE = "tanveeraws/saree-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    tools {
        sonarQubeScanner 'sonar-scanner'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh "docker build -t saree-backend:test ."
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh "docker build -t saree-frontend:test ."
                }
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
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
                sh """
                docker tag saree-backend:test ${BACKEND_IMAGE}:${IMAGE_TAG}
                docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh """
                docker tag saree-frontend:test ${FRONTEND_IMAGE}:${IMAGE_TAG}
                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

    }

    post {

        success {
            echo "Pipeline Completed Successfully!"
        }

        failure {
            echo "Pipeline Failed!"
        }

        always {
            sh "docker logout"
        }
    }
}