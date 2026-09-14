pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "tanveeraws/saree-backend"
        FRONTEND_IMAGE = "tanveeraws/saree-frontend"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

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
                    --exit-code 0 \
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
                    --exit-code 0 \
                    saree-frontend:test
                '''
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo $DOCKER_PASS | docker login \
                        -u $DOCKER_USER \
                        --password-stdin
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

        stage('Update Helm Values (GitOps)') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-creds',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh '''
                        rm -rf helm-repo

                        git clone \
                        https://$GIT_USER:$GIT_TOKEN@github.com/tanveersaurce/saree-store-k8s.git \
                        helm-repo

                        cd helm-repo/saree-store-chart

                        python3 -c "
import re
import os

tag = os.environ['IMAGE_TAG']

with open('values.yaml') as f:
    lines = f.readlines()

def replace_tag_in_block(lines, block_name, tag):
    in_block = False
    done = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        if not in_block and stripped == block_name:
            in_block = True
            continue
        if in_block:
            # A new top-level key (no leading whitespace) means the block ended
            if line and not line[0].isspace():
                in_block = False
                continue
            if not done and 'tag:' in line:
                indent = line[:len(line) - len(line.lstrip())]
                lines[i] = indent + 'tag: ' + tag + chr(10)
                done = True
                in_block = False
    return lines

lines = replace_tag_in_block(lines, 'backend:', tag)
lines = replace_tag_in_block(lines, 'frontend:', tag)

with open('values.yaml', 'w') as f:
    f.writelines(lines)
"

                        git config user.email "jenkins@ci.com"
                        git config user.name "Jenkins CI"

                        git add values.yaml

                        git commit \
                        -m "auto: update image tags [ci skip]" \
                        || echo "No changes to commit"

                        git push origin main
                    '''
                }
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