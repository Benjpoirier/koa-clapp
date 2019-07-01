AWS_REGION ?= eu-west-1

aws-ecr-login:
	@pip install --user awscli
	@eval `aws ecr get-login --no-include-email --region ${AWS_REGION}`

build-doc:
	npx docsify init docs

deploy-documentation:
	$(MAKE) build-doc
	$(MAKE) sync-doc-s3

sync-doc-s3:
	# @aws s3 sync --region=eu-west-1 --delete --acl public-read docs s3://docs.app.com

lint:
	@echo "Eslint"
	@npm run lint

test:
	@echo "Tests"
	@npm test

test-u:
	@echo "Update snapshot tests"
	@npm test -- -u
