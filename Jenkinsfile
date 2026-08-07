pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "tanveeraws/saree-backend"
        FRONTEND_IMAGE = "tanveeraws/saree-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    // tools {
    //     sonarRunner 'sonar-scanner'
    // }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
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

        stage('Trivy Backend Scan') {
            steps {
                sh '''
                mkdir -p trivy-reports

                trivy image \
                --format table \
                --output trivy-reports/backend-report.txt \
                saree-backend:test

                trivy image \
                --severity CRITICAL \
                --exit-code 1 \
                saree-backend:test
                '''
            }
        }

        stage('Trivy Frontend Scan') {
            steps {
                sh '''
                trivy image \
                --format table \
                --output trivy-reports/frontend-report.txt \
                saree-frontend:test

                trivy image \
                --severity CRITICAL \
                --exit-code 1 \
                saree-frontend:test
                '''
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
        always {
            archiveArtifacts artifacts: 'trivy-reports/*', fingerprint: true
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