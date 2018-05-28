# Serverless Chrome Screenshot

A [Serverless-framework](https://github.com/serverless/serverless) based function for AWS Lambda using the `serverless-plugin-chrome` plugin for Serverless to run Headless Chrome and return Screenshot PNG and optionally save to an S3 bucket.

Originally an example found here https://github.com/adieuadieu/serverless-chrome, this is slightly expanded to include the use of docker and optionally save to an S3 bucket.

## Prerequisites

- Docker
- Docker Compose
- Make
- AWS Admin Access

## Credentials

Either:

```bash
export AWS_PROFILE=<your-profile-name>
```

or

```bash
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

## Environment variables

Make sure you have set your environment variables properly or create a file `.env`. The file `.env.template` contains the environment variables that are used by the application. Keys found in LastPass.

## Deployment

Uncomment the Offline plugin in serverless.yml 

Once Credentials are set up, to deploy the full service run:

```bash
make deploy
```

Or

```bash
npm run deploy
```


## Capture Screenshot of a given URL
When youhave deployed via serverless, it creates a Lambda function which will take a screenshot of a URL it's provided. You can provide this URL to the Lambda function via the AWS API Gateway. 

An API endpoint will be provided in terminal. Use this URL to call the Lambda function with a url in the query string. E.g. `https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/?url=https://github.com/unitsix/serverless-chrome-screenshot`. 

Add `&mobile=1` for mobile device view.

Add `&bucket=<your-bucket-name>` to save to an S3 bucket. 

## Configuration

Take a look at the `serverless-plugins-chrome` plugin's [README](/packages/serverless-plugin) for it's configuration options.


## Local Development

```bash
make offline
```

### Testing

After spinning up offline mode you can test directly from browser or Postman

E.g. `localhost:3000/?url=https://github.com/unitsix/serverless-chrome-screenshot`. 

## Troubleshooting

See: https://github.com/adieuadieu/serverless-chrome for better troubleshooting on serverless-chrome
