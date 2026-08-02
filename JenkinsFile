pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Backend') {
            steps {
                build job: 'backend-job'
            }
        }
        stage('Frontend') {
            steps {
                build job: 'frontend-job'
            }
        }
        stage('Deploy') {
            steps {
                build job: 'ansible'
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
        always {
            cleanWs()
        }
    }
}
