#!/usr/bin/env groovy

library(
  identifier: 'jenkins-shared-library@main',
  retriever: modernSCM(
    [
      $class: 'GitSCMSource',
      remote: 'https://github.com/gridwhizth/jenkins-shared-library.git',
      credentialsId: 'GitHubApp'
    ]
  )
)

pipeline_onthefire {
    serviceName = "pangpuriye6"
    dockerfilePath = "./"
    scanIncludePath = "./"
    scanExcludePath = "app/pb/*,dependency-check*,**/*_test.go,app/docs/**,app/mocks/**,app/docs/**/*,app/main.go,**/swagger_docs/**/*,pipeline/*"
}